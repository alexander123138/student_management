
import React, { useState } from 'react';
import { Search, UserPlus, Filter, MoreHorizontal, FileText, Trash2, Edit, Users, User, Printer } from 'lucide-react';
import { Student } from '../types';
import { GRADE_LEVELS, SCHOOL_NAME } from '../constants';

interface StudentListProps {
  students: Student[];
  onAdd: () => void;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onViewReport: (student: Student) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onAdd, onEdit, onDelete, onViewReport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');

  const filteredStudents = students.filter(s => {
    const matchesSearch = `${s.firstName} ${s.lastName} ${s.regNumber}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterLevel === 'All' || s.gradeLevel === filterLevel;
    return matchesSearch && matchesFilter;
  });

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Print-only Header */}
      <div className="print-only mb-8 text-center border-b-2 border-slate-900 pb-4">
        <h1 className="text-2xl font-black text-blue-900 uppercase">{SCHOOL_NAME}</h1>
        <h2 className="text-lg font-bold text-slate-700">STUDENT ENROLLMENT REPORT - {filterLevel}</h2>
        <p className="text-sm text-slate-500">Generated on: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="p-6 border-b flex flex-col sm:flex-row gap-4 justify-between items-center no-print">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search students by name or reg number..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select 
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="All">All Grades</option>
            {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          
          <button 
            onClick={handleExportPDF}
            className="p-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            title="Export PDF"
          >
            <Printer size={18} />
          </button>

          <button 
            onClick={onAdd}
            className="bg-blue-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold hover:bg-blue-800 transition-all flex-shrink-0"
          >
            <UserPlus size={18} />
            Add Student
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Student Details</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ID Number</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Grade Level</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Parent/Guardian</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider no-print">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold overflow-hidden no-print">
                      {student.photo ? (
                        <img src={student.photo} alt={`${student.firstName} ${student.lastName}`} className="w-full h-full object-cover" />
                      ) : (
                        <span>{student.firstName[0]}{student.lastName[0]}</span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{student.firstName} {student.lastName}</div>
                      <div className="text-xs text-slate-500">{student.gender === 'M' ? 'Male' : 'Female'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                  {student.regNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                    {student.gradeLevel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900 font-medium">{student.parentName}</div>
                  <div className="text-xs text-slate-500">{student.parentPhone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm no-print">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onViewReport(student)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Report Card"
                    >
                      <FileText size={18} />
                    </button>
                    <button 
                      onClick={() => onEdit(student)}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Edit Profile"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(student.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg" title="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredStudents.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={40} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No students found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;