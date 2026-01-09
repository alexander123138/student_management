
import React, { useState } from 'react';
import { X, Printer, Edit3, Save, FileText } from 'lucide-react';
import { Student, GradeRecord } from '../types';
import { SCHOOL_NAME } from '../constants';

interface ReportCardProps {
  student: Student;
  onClose: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ student, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableGradeLevel, setEditableGradeLevel] = useState(student.gradeLevel);
  const [reopeningDate, setReopeningDate] = useState('January 15, 2025');
  const [grades, setGrades] = useState<GradeRecord[]>([
    { id: '1', studentId: student.id, subject: 'English Language', term: 1, score: 78, maxScore: 100, grade: 'A', classScore: 70 },
    { id: '2', studentId: student.id, subject: 'Mathematics', term: 1, score: 85, maxScore: 100, grade: 'A', classScore: 80 },
    { id: '3', studentId: student.id, subject: 'Science', term: 1, score: 62, maxScore: 100, grade: 'C', classScore: 55 },
    { id: '4', studentId: student.id, subject: 'Social Studies', term: 1, score: 91, maxScore: 100, grade: 'A', classScore: 85 },
  ] as any);

  const updateGrade = (id: string, score: number) => {
    setGrades(grades.map(g => {
      if (g.id === id) {
        const newGrade = score >= 80 ? 'A' : score >= 60 ? 'B' : 'C';
        return { ...g, score, grade: newGrade };
      }
      return g;
    }));
  };

  const updateSubject = (id: string, subject: string) => {
    setGrades(grades.map(g => g.id === id ? { ...g, subject } : g));
  };

  const addSubject = () => {
    setGrades([...grades, { id: Math.random().toString(), studentId: student.id, subject: 'New Subject', term: 1, score: 0, maxScore: 100, grade: 'F', classScore: 0 } as any]);
  };

  const removeSubject = (id: string) => {
    setGrades(grades.filter(g => g.id !== id));
  };

  const updateClassScore = (id: string, classScore: number) => {
    setGrades(grades.map(g => g.id === id ? { ...g, classScore } : g));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header Toolbar */}
        <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-slate-800">Terminal Report Card</h3>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded tracking-wider">Draft</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-all flex items-center gap-2 text-sm font-medium"
            >
              {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
              {isEditing ? 'Save' : 'Edit'}
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-all flex items-center gap-2 text-sm font-medium"
            >
              <Printer size={18} />
              Print
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-all flex items-center gap-2 text-sm font-medium"
            >
              <FileText size={18} />
              PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-lg text-slate-400"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#fdfdfd]">
          {/* School Banner */}
          <div className="text-center mb-10 border-b-2 border-slate-900 pb-8">
            <h1 className="text-3xl font-black text-blue-900 uppercase mb-2 tracking-tight">{SCHOOL_NAME}</h1>
            <p className="text-slate-500 font-medium">P.O. Box 456, Sunyani, Ghana | Tel: +233 244 556 677</p>
            <p className="text-slate-500 italic mt-1 font-semibold">Motto: Knowledge is Light</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
            <div>
              <p className="text-xs font-bold text-blue-900/50 uppercase tracking-widest mb-1">Student Details</p>
              <h4 className="text-xl font-bold text-slate-900">{student.firstName} {student.lastName}</h4>
              <p className="text-slate-600 text-sm font-medium">Reg No: {student.regNumber}</p>
              <p className="text-slate-600 text-sm font-medium">
                Grade: {isEditing ? (
                  <input
                    value={editableGradeLevel}
                    onChange={(e) => setEditableGradeLevel(e.target.value)}
                    className="bg-transparent border-b border-slate-300 focus:outline-none ml-1"
                  />
                ) : (
                  editableGradeLevel
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-blue-900/50 uppercase tracking-widest mb-1">Session Info</p>
              <p className="text-slate-900 font-bold">Academic Year: 2023/2024</p>
              <p className="text-slate-600 font-medium">Term: 1st Term</p>
              <p className="text-slate-600 font-medium italic">Status: Completed</p>
              <p className="text-slate-600 font-medium">Reopening Date: {isEditing ? <input value={reopeningDate} onChange={(e) => setReopeningDate(e.target.value)} className="bg-transparent border-b border-slate-300 focus:outline-none" /> : reopeningDate}</p>
            </div>
          </div>

          <table className="w-full mb-10 border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="px-6 py-3 text-left font-bold text-sm uppercase tracking-wider rounded-tl-xl">Subject</th>
                <th className="px-6 py-3 text-center font-bold text-sm uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-center font-bold text-sm uppercase tracking-wider">Max</th>
                <th className="px-6 py-3 text-center font-bold text-sm uppercase tracking-wider">Class Score</th>
                <th className="px-6 py-3 text-center font-bold text-sm uppercase tracking-wider">Total Score</th>
                <th className="px-6 py-3 text-center font-bold text-sm uppercase tracking-wider rounded-tr-xl">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {grades.map((grade) => (
                <tr key={grade.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-800 font-semibold">
                    {isEditing ? (
                      <input
                        value={grade.subject}
                        onChange={(e) => updateSubject(grade.id, e.target.value)}
                        className="w-full bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                      />
                    ) : (
                      grade.subject
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-900 font-bold">
                    {isEditing ? (
                      <input
                        type="number"
                        value={grade.score}
                        onChange={(e) => updateGrade(grade.id, parseInt(e.target.value) || 0)}
                        className="w-16 text-center bg-transparent border border-slate-300 rounded px-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        min="0"
                        max="100"
                      />
                    ) : (
                      grade.score
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-500 font-medium">{grade.maxScore}</td>
                  <td className="px-6 py-4 text-center text-slate-900 font-bold">
                    {isEditing ? (
                      <input
                        type="number"
                        value={grade.classScore}
                        onChange={(e) => updateClassScore(grade.id, parseInt(e.target.value) || 0)}
                        className="w-16 text-center bg-transparent border border-slate-300 rounded px-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        min="0"
                        max="100"
                      />
                    ) : (
                      grade.classScore
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-900 font-bold">
                    {Math.round((grade.score + grade.classScore) / 2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-lg font-bold ${
                      grade.score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                      grade.score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {grade.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isEditing && (
            <div className="mt-4 text-center">
              <button onClick={addSubject} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Add Subject
              </button>
            </div>
          )}

          {/* Footer Signatures */}
          <div className="flex justify-between items-end mt-16 pt-12 border-t-2 border-slate-100">
            <div className="text-center w-48">
              <div className="h-12 border-b-2 border-slate-300 mb-2"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Class Teacher</p>
            </div>
            <div className="text-center w-48">
              <div className="h-12 border-b-2 border-slate-300 mb-2"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Parent's Signature</p>
            </div>
            <div className="text-center w-48">
              <div className="h-12 border-b-2 border-slate-300 mb-2"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Headmaster</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
