
import React, { useState, useEffect } from 'react';
import { 
  Wallet, Search, Plus, Filter, Download, 
  CheckCircle, AlertCircle, Clock, Printer, 
  History, Settings, CreditCard, Receipt, 
  Users, Trash2, Edit, FileText, X
} from 'lucide-react';
import { Student, FeeRecord, FeeTransaction, FeeStructure } from '../types';
import { dataService } from '../services/dataService';
import { SCHOOL_NAME, GRADE_LEVELS } from '../constants';

interface FinanceManagerProps {
  students: Student[];
  fees: FeeRecord[];
  onUpdate: () => void;
}

const FinanceManager: React.FC<FinanceManagerProps> = ({ students, fees, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'ledger' | 'transactions' | 'structure'>('ledger');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [transactions, setTransactions] = useState<FeeTransaction[]>([]);
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  
  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showFeeStructureModal, setShowFeeStructureModal] = useState(false);
  const [showAddFeeStructureModal, setShowAddFeeStructureModal] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<FeeStructure | null>(null);
  
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Form states
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Mobile Money' | 'Bank Transfer'>('Cash');
  const [paymentDesc, setPaymentDesc] = useState('');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [editTuition, setEditTuition] = useState('');
  const [editCanteen, setEditCanteen] = useState('');
  const [editOthers, setEditOthers] = useState('');
  const [newGradeLevel, setNewGradeLevel] = useState('');
  const [newTuition, setNewTuition] = useState('');
  const [newCanteen, setNewCanteen] = useState('');
  const [newOthers, setNewOthers] = useState('');

  useEffect(() => {
    setTransactions(dataService.getTransactions());
    setStructures(dataService.getFeeStructures());
  }, [fees]);

  // IMPORTANT: The Ledger is now built by mapping over STUDENTS first.
  // This ensures every single student is visible and functional in the finance section.
  const ledgerItems = students.map(student => {
    const fee = fees.find(f => f.studentId === student.id) || {
      id: 'f-' + student.id,
      studentId: student.id,
      amountDue: 0,
      amountPaid: 0,
      lastPaymentDate: '',
      status: 'unpaid'
    };
    return { student, fee };
  });

  const filteredLedger = ledgerItems.filter(({ student, fee }) => {
    const name = `${student.firstName} ${student.lastName}`.toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || student.regNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || fee.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee || !paymentAmount) return;

    const tx: FeeTransaction = {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      studentId: selectedFee.studentId,
      amount: parseFloat(paymentAmount),
      date: new Date().toISOString().split('T')[0],
      method: paymentMethod,
      description: paymentDesc || 'Individual Fees Payment',
      receivedBy: 'Admin'
    };

    await dataService.addTransaction(tx);
    await onUpdate();
    setShowPaymentModal(false);
    setPaymentAmount('');
    setPaymentDesc('');
  };

  const handleAdjustBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee || !adjustmentAmount) return;

    const updatedFee: FeeRecord = {
      ...selectedFee,
      amountDue: parseFloat(adjustmentAmount),
    };

    // Recalculate status
    const balance = updatedFee.amountDue - updatedFee.amountPaid;
    updatedFee.status = balance <= 0 ? 'paid' : (updatedFee.amountPaid > 0 ? 'partial' : 'unpaid');

    await dataService.saveFee(updatedFee);
    await onUpdate();
    setShowAdjustmentModal(false);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleSaveFeeStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStructure) return;

    const updatedStructure: FeeStructure = {
      ...selectedStructure,
      tuition: parseFloat(editTuition) || 0,
      canteen: parseFloat(editCanteen) || 0,
      others: parseFloat(editOthers) || 0,
      total: (parseFloat(editTuition) || 0) + (parseFloat(editCanteen) || 0) + (parseFloat(editOthers) || 0)
    };

    dataService.saveFeeStructure(updatedStructure);
    setStructures(dataService.getFeeStructures());
    setShowFeeStructureModal(false);
    setSelectedStructure(null);
  };

  const handleAddFeeStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGradeLevel || !newTuition) return;

    const newStructure: FeeStructure = {
      id: 's-' + Math.random().toString(36).substr(2, 9),
      gradeLevel: newGradeLevel,
      tuition: parseFloat(newTuition) || 0,
      canteen: parseFloat(newCanteen) || 0,
      others: parseFloat(newOthers) || 0,
      total: (parseFloat(newTuition) || 0) + (parseFloat(newCanteen) || 0) + (parseFloat(newOthers) || 0)
    };

    dataService.saveFeeStructure(newStructure);
    setStructures(dataService.getFeeStructures());
    setShowAddFeeStructureModal(false);
    setNewGradeLevel('');
    setNewTuition('');
    setNewCanteen('');
    setNewOthers('');
  };

  const stats = {
    total: fees.reduce((a, b) => a + b.amountDue, 0),
    collected: fees.reduce((a, b) => a + b.amountPaid, 0),
    outstanding: fees.reduce((a, b) => a + (b.amountDue - b.amountPaid), 0)
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Print-only Header for PDF Statements */}
      <div className="print-only mb-8 text-center border-b-2 border-slate-900 pb-4">
        <h1 className="text-2xl font-black text-blue-900 uppercase">{SCHOOL_NAME}</h1>
        <h2 className="text-lg font-bold text-slate-700 uppercase tracking-widest">Official Financial Document</h2>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Financial Registry</h3>
          <p className="text-slate-500 text-sm font-medium">Tracking and recording fees for all {students.length} students individually.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
          {[
            { id: 'ledger', label: 'Student Ledger', icon: Users },
            { id: 'transactions', label: 'Payment History', icon: History },
            { id: 'structure', label: 'Default Bills', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-blue-900 text-white shadow-lg' 
                : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'ledger' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Expected</p>
              <h3 className="text-2xl font-black text-slate-900">GHS {stats.total.toLocaleString()}</h3>
            </div>
            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-sm">
              <p className="text-xs font-black text-emerald-600/60 uppercase tracking-widest mb-1">Total Collected</p>
              <h3 className="text-2xl font-black text-emerald-900">GHS {stats.collected.toLocaleString()}</h3>
            </div>
            <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 shadow-sm">
              <p className="text-xs font-black text-rose-600/60 uppercase tracking-widest mb-1">Total Outstanding</p>
              <h3 className="text-2xl font-black text-rose-900">GHS {stats.outstanding.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b flex flex-col sm:flex-row gap-4 justify-between items-center no-print">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search individual student ledger..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select 
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 focus:outline-none"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Filter: All Students</option>
                  <option value="paid">Fully Paid Only</option>
                  <option value="partial">Has Balance</option>
                  <option value="unpaid">No Payment Yet</option>
                </select>
                <button 
                  onClick={handleExportPDF}
                  className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all border border-slate-200"
                  title="Export Individual Balances"
                >
                  <Printer size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Details</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Bill</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Paid</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Balance</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest no-print">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLedger.map(({ student, fee }) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSelectedFee(fee); setSelectedStudent(student); setShowStatementModal(true); }}>
                          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs">
                            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">{student.firstName} {student.lastName}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">ID: {student.regNumber} • {student.gradeLevel}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-slate-600">
                        <div className="flex items-center gap-2">
                          GHS {fee.amountDue.toLocaleString()}
                          <button 
                            onClick={() => { setSelectedFee(fee); setSelectedStudent(student); setAdjustmentAmount(fee.amountDue.toString()); setShowAdjustmentModal(true); }}
                            className="text-slate-300 hover:text-blue-500 transition-colors no-print"
                            title="Edit Individual Bill"
                          >
                            <Edit size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm text-emerald-600 font-black">GHS {fee.amountPaid.toLocaleString()}</td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm text-rose-600 font-black">GHS {(fee.amountDue - fee.amountPaid).toLocaleString()}</td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          fee.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                          fee.status === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {fee.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right no-print">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => { setSelectedFee(fee); setSelectedStudent(student); setShowStatementModal(true); }}
                            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Individual Statement"
                          >
                            <FileText size={18} />
                          </button>
                          <button 
                            onClick={() => { setSelectedFee(fee); setSelectedStudent(student); setShowPaymentModal(true); }}
                            className="px-5 py-2.5 bg-blue-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-800 transition-all flex items-center gap-2 shadow-sm"
                          >
                            <Receipt size={14} /> Record Payment
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredLedger.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
                        No students found in the financial registry.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h4 className="text-lg font-bold text-slate-900">Individual Payment Records (All History)</h4>
            <button onClick={handleExportPDF} className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 border border-slate-200 no-print">
              <Printer size={18} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.slice().reverse().map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-4 whitespace-nowrap text-sm font-bold text-slate-600">{tx.date}</td>
                    <td className="px-8 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                      {students.find(s => s.id === tx.studentId)?.firstName} {students.find(s => s.id === tx.studentId)?.lastName}
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-sm font-black text-emerald-600">GHS {tx.amount.toLocaleString()}</td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[9px] font-black uppercase rounded-lg">
                        {tx.method}
                      </span>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-sm text-slate-500">{tx.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Default Billing Structure Tab */}
      {activeTab === 'structure' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Settings className="text-blue-600" /> Default Fee Structure
              </h4>
              <button
                onClick={() => setShowAddFeeStructureModal(true)}
                className="px-4 py-2 bg-blue-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-800 transition-all"
              >
                Add New
              </button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {structures.map((s) => (
                <div key={s.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-300 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h5 className="font-black text-blue-900">{s.gradeLevel}</h5>
                    <button
                      onClick={() => { setSelectedStructure(s); setEditTuition(s.tuition.toString()); setEditCanteen(s.canteen.toString()); setEditOthers(s.others.toString()); setShowFeeStructureModal(true); }}
                      className="text-slate-300 group-hover:text-blue-500"
                      title="Edit Fee Structure"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Tuition</p>
                      <p className="text-sm font-bold text-slate-700">GHS {s.tuition}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Others</p>
                      <p className="text-sm font-bold text-slate-700">GHS {s.others}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Total Bill</p>
                      <p className="text-sm font-black text-blue-900">GHS {s.total}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && selectedStudent && selectedFee && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 bg-blue-900 text-white">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black tracking-tight">Record Fee Payment</h3>
                  <p className="text-blue-300 text-sm">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                </div>
                <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} className="text-blue-300" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-blue-300 uppercase mb-1">Due</p>
                  <p className="text-xl font-black">GHS {selectedFee.amountDue}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-blue-300 uppercase mb-1">Balance</p>
                  <p className="text-xl font-black">GHS {selectedFee.amountDue - selectedFee.amountPaid}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleRecordPayment} className="p-10 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Payment Amount (GHS)</label>
                  <input 
                    type="number"
                    required
                    placeholder="0.00"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-black text-slate-700 text-lg"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Method</label>
                    <select 
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                    >
                      <option>Cash</option>
                      <option>Mobile Money</option>
                      <option>Bank Transfer</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                    <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Notes / Description</label>
                  <input 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Term 1 Part Payment..."
                    value={paymentDesc}
                    onChange={(e) => setPaymentDesc(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-5 bg-blue-900 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-3"
                >
                  <CheckCircle size={20} /> Collect Fees & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Individual Statement Modal */}
      {showStatementModal && selectedStudent && selectedFee && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col">
            <div className="p-6 bg-slate-50 border-b flex justify-between items-center no-print">
              <h3 className="font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText className="text-blue-600" /> Individual Statement
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="p-2.5 bg-blue-900 text-white rounded-xl hover:bg-blue-800 flex items-center gap-2 text-xs font-bold uppercase px-4">
                  <Printer size={16} /> Print Statement
                </button>
                <button onClick={() => setShowStatementModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-12 print:p-0">
              <div className="text-center mb-10 pb-6 border-b-2 border-slate-900">
                <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tighter">{SCHOOL_NAME}</h1>
                <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.3em] mt-1">Student Statement of Account</p>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Student Information</p>
                  <h4 className="text-xl font-black text-slate-900">{selectedStudent.firstName} {selectedStudent.lastName}</h4>
                  <p className="text-sm font-bold text-slate-600">Reg No: {selectedStudent.regNumber}</p>
                  <p className="text-sm font-bold text-slate-600">Grade: {selectedStudent.gradeLevel}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Account Summary</p>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-600">Total Billed: <span className="text-slate-900">GHS {selectedFee.amountDue.toLocaleString()}</span></p>
                    <p className="text-sm font-bold text-slate-600">Total Paid: <span className="text-emerald-600">GHS {selectedFee.amountPaid.toLocaleString()}</span></p>
                    <p className="text-lg font-black text-rose-600">Balance: GHS {(selectedFee.amountDue - selectedFee.amountPaid).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Individual Transaction Ledger</h5>
                <table className="w-full">
                  <thead className="bg-slate-50 border-y border-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-[10px] font-black text-slate-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-[10px] font-black text-slate-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-[10px] font-black text-slate-500 uppercase">Method</th>
                      <th className="px-4 py-3 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount (GHS)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="bg-blue-50/50">
                      <td className="px-4 py-4 text-xs font-bold text-slate-500">2023/2024</td>
                      <td className="px-4 py-4 text-xs font-black text-blue-900 uppercase">Opening Balance / Billing</td>
                      <td className="px-4 py-4 text-xs font-bold text-slate-500">-</td>
                      <td className="px-4 py-4 text-xs font-black text-slate-900 text-right">{selectedFee.amountDue.toLocaleString()}</td>
                    </tr>
                    {transactions.filter(t => t.studentId === selectedFee.studentId).map(t => (
                      <tr key={t.id}>
                        <td className="px-4 py-4 text-xs font-bold text-slate-600">{t.date}</td>
                        <td className="px-4 py-4 text-xs font-bold text-slate-900">{t.description}</td>
                        <td className="px-4 py-4 text-xs font-bold text-slate-500">{t.method}</td>
                        <td className="px-4 py-4 text-xs font-black text-emerald-600 text-right">-{t.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-900">
                      <td colSpan={3} className="px-4 py-5 text-right text-xs font-black uppercase tracking-widest text-slate-500">Net Outstanding Balance</td>
                      <td className="px-4 py-5 text-right text-lg font-black text-rose-600 tracking-tighter">GHS {(selectedFee.amountDue - selectedFee.amountPaid).toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-20 pt-12 border-t border-slate-100 flex justify-between">
                <div className="text-center w-48">
                  <div className="h-0.5 bg-slate-300 mb-2"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accounts Officer</p>
                </div>
                <div className="text-center w-48">
                  <div className="h-0.5 bg-slate-300 mb-2"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Principal's Seal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bill Adjustment Modal */}
      {showAdjustmentModal && selectedStudent && selectedFee && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 bg-blue-900 text-white">
              <h3 className="text-xl font-black tracking-tight">Adjust Student Bill</h3>
              <p className="text-blue-300 text-sm">{selectedStudent.firstName} {selectedStudent.lastName}</p>
            </div>
            <form onSubmit={handleAdjustBill} className="p-10 space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Current Bill</p>
                  <p className="text-lg font-black text-blue-900">GHS {selectedFee.amountDue}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">New Adjusted Bill (GHS)</label>
                  <input 
                    type="number"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-black text-slate-700"
                    value={adjustmentAmount}
                    onChange={(e) => setAdjustmentAmount(e.target.value)}
                  />
                  <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">Adjusting this will change the total expected fees for this specific student only. Use this for scholarships or special discounts.</p>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAdjustmentModal(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest">Save Change</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fee Structure Edit Modal */}
      {showFeeStructureModal && selectedStructure && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 bg-blue-900 text-white">
              <h3 className="text-xl font-black tracking-tight">Edit Fee Structure</h3>
              <p className="text-blue-300 text-sm">{selectedStructure.gradeLevel}</p>
            </div>
            <form onSubmit={handleSaveFeeStructure} className="p-10 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tuition (GHS)</label>
                  <input
                    type="number"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-black text-slate-700"
                    value={editTuition}
                    onChange={(e) => setEditTuition(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Canteen (GHS)</label>
                  <input
                    type="number"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-black text-slate-700"
                    value={editCanteen}
                    onChange={(e) => setEditCanteen(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Others (GHS)</label>
                  <input
                    type="number"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-black text-slate-700"
                    value={editOthers}
                    onChange={(e) => setEditOthers(e.target.value)}
                  />
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Total Bill</p>
                  <p className="text-lg font-black text-blue-900">GHS {(parseFloat(editTuition) || 0) + (parseFloat(editCanteen) || 0) + (parseFloat(editOthers) || 0)}</p>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowFeeStructureModal(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Fee Structure Modal */}
      {showAddFeeStructureModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <div className="p-8 bg-blue-900 text-white flex-shrink-0">
              <h3 className="text-xl font-black tracking-tight">Add New Fee Structure</h3>
              <p className="text-blue-300 text-sm">Create default billing for a new grade level</p>
            </div>
            <form onSubmit={handleAddFeeStructure} className="flex-1 overflow-y-auto p-10 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Grade Level</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                    value={newGradeLevel}
                    onChange={(e) => setNewGradeLevel(e.target.value)}
                    placeholder="e.g., Class 5"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tuition (GHS)</label>
                  <input
                    type="number"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                    value={newTuition}
                    onChange={(e) => setNewTuition(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Canteen (GHS)</label>
                  <input
                    type="number"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                    value={newCanteen}
                    onChange={(e) => setNewCanteen(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Others (GHS)</label>
                  <input
                    type="number"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                    value={newOthers}
                    onChange={(e) => setNewOthers(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Total Bill</p>
                  <p className="text-lg font-black text-blue-900">GHS {(parseFloat(newTuition) || 0) + (parseFloat(newCanteen) || 0) + (parseFloat(newOthers) || 0)}</p>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddFeeStructureModal(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest">Add Structure</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceManager;
