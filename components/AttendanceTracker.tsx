
import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Save, Search, Calendar, CheckCircle2, XCircle, Clock, Printer } from 'lucide-react';
import { Student, AttendanceRecord } from '../types';
import { GRADE_LEVELS, SCHOOL_NAME } from '../constants';
import { dataService } from '../services/dataService';

interface AttendanceTrackerProps {
  students: Student[];
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ students }) => {
  const [selectedGrade, setSelectedGrade] = useState(GRADE_LEVELS[2]); // Default to Class 1
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceRecord['status']>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter students for the current grade
  const filteredStudents = students.filter(s => s.gradeLevel === selectedGrade);

  useEffect(() => {
    // Load existing attendance for the selected date and grade
    const existingAttendance = dataService.getAttendance();
    const dateAttendance = existingAttendance.filter(r => r.date === selectedDate);
    
    const initialData: Record<string, AttendanceRecord['status']> = {};
    filteredStudents.forEach(s => {
      const record = dateAttendance.find(r => r.studentId === s.id);
      initialData[s.id] = record ? record.status : 'present'; // Default to present
    });
    setAttendanceData(initialData);
    setSaveSuccess(false);
  }, [selectedGrade, selectedDate, students]);

  const handleStatusChange = (studentId: string, status: AttendanceRecord['status']) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const records: AttendanceRecord[] = filteredStudents.map(s => ({
      id: `${s.id}_${selectedDate}`,
      studentId: s.id,
      date: selectedDate,
      status: attendanceData[s.id] || 'present'
    }));

    dataService.saveAttendance(records);
    
    // Fake delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    setSaveSuccess(true);
    
    // Reset success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const stats = {
    present: Object.values(attendanceData).filter(v => v === 'present').length,
    absent: Object.values(attendanceData).filter(v => v === 'absent').length,
    late: Object.values(attendanceData).filter(v => v === 'late').length,
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Print-only Header */}
      <div className="print-only mb-8 text-center border-b-2 border-slate-900 pb-4">
        <h1 className="text-2xl font-black text-blue-900 uppercase">{SCHOOL_NAME}</h1>
        <h2 className="text-lg font-bold text-slate-700">ATTENDANCE REPORT - {selectedGrade}</h2>
        <p className="text-sm text-slate-500">Date: {selectedDate}</p>
        <div className="flex justify-center gap-8 mt-4 text-xs font-bold uppercase">
          <span className="text-emerald-600">Present: {stats.present}</span>
          <span className="text-rose-600">Absent: {stats.absent}</span>
          <span className="text-amber-600">Late: {stats.late}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 no-print">
        {/* Selection Header */}
        <div className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-6">
          <div className="space-y-1.5 min-w-[200px]">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <ClipboardCheck size={14} className="text-blue-600" /> Select Grade
            </label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
            >
              {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="space-y-1.5 min-w-[200px]">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Calendar size={14} className="text-blue-600" /> Select Date
            </label>
            <input 
              type="date"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="flex-1 flex justify-end gap-3">
            <button 
              onClick={handleExportPDF}
              className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all border border-slate-200"
              title="Export PDF"
            >
              <Printer size={20} />
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving || filteredStudents.length === 0}
              className={`px-8 py-3 rounded-xl flex items-center gap-3 font-bold text-sm transition-all shadow-lg ${
                saveSuccess 
                ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                : 'bg-blue-900 text-white hover:bg-blue-800 shadow-blue-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : saveSuccess ? (
                <CheckCircle2 size={18} />
              ) : (
                <Save size={18} />
              )}
              {saveSuccess ? 'Attendance Saved!' : 'Save Attendance'}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {filteredStudents.length > 0 && (
        <div className="grid grid-cols-3 gap-4 no-print">
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-700">Present</span>
            <span className="text-2xl font-black text-emerald-800">{stats.present}</span>
          </div>
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center justify-between">
            <span className="text-sm font-bold text-rose-700">Absent</span>
            <span className="text-2xl font-black text-rose-800">{stats.absent}</span>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center justify-between">
            <span className="text-sm font-bold text-amber-700">Late</span>
            <span className="text-2xl font-black text-amber-800">{stats.late}</span>
          </div>
        </div>
      )}

      {/* Student List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Student Name</th>
                <th className="px-8 py-5 text-center text-xs font-black text-slate-400 uppercase tracking-widest w-64">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 overflow-hidden border-2 border-white shadow-sm no-print">
                          {student.photo ? (
                            <img src={student.photo} className="w-full h-full object-cover" />
                          ) : (
                            student.firstName[0] + student.lastName[0]
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{student.firstName} {student.lastName}</div>
                          <div className="text-xs text-slate-500 font-medium">ID: {student.regNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      {/* Printable text version of status */}
                      <div className="print-only text-center font-bold uppercase text-xs">
                        {attendanceData[student.id] || 'present'}
                      </div>
                      {/* Interactive version for screen */}
                      <div className="flex items-center justify-center p-1 bg-slate-100 rounded-xl gap-1 no-print">
                        {[
                          { id: 'present', label: 'Present', icon: CheckCircle2, color: 'text-emerald-600', active: 'bg-emerald-500 text-white shadow-sm' },
                          { id: 'absent', label: 'Absent', icon: XCircle, color: 'text-rose-600', active: 'bg-rose-500 text-white shadow-sm' },
                          { id: 'late', label: 'Late', icon: Clock, color: 'text-amber-600', active: 'bg-amber-500 text-white shadow-sm' }
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            onClick={() => handleStatusChange(student.id, btn.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                              attendanceData[student.id] === btn.id 
                              ? btn.active 
                              : `text-slate-500 hover:bg-white`
                            }`}
                          >
                            <btn.icon size={14} className={attendanceData[student.id] === btn.id ? 'text-white' : btn.color} />
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-8 py-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <Search size={32} className="text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-bold">No students registered in {selectedGrade}.</p>
                    <p className="text-xs text-slate-400 mt-1">Please add students to this grade level first.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;