
import React, { useState, useEffect } from 'react';
import { X, Printer, BrainCircuit, Loader2 } from 'lucide-react';
import { Student, GradeRecord } from '../types';
import { getStudentPerformanceInsights } from '../services/geminiService';
import { SCHOOL_NAME } from '../constants';

interface ReportCardProps {
  student: Student;
  onClose: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ student, onClose }) => {
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Mock grades for this demo if none exist
  const mockGrades: GradeRecord[] = [
    { id: '1', studentId: student.id, subject: 'English Language', term: 1, score: 78, maxScore: 100, grade: 'A' },
    { id: '2', studentId: student.id, subject: 'Mathematics', term: 1, score: 85, maxScore: 100, grade: 'A' },
    { id: '3', studentId: student.id, subject: 'Science', term: 1, score: 62, maxScore: 100, grade: 'C' },
    { id: '4', studentId: student.id, subject: 'Social Studies', term: 1, score: 91, maxScore: 100, grade: 'A' },
  ];

  const generateAIComment = async () => {
    setLoading(true);
    const insights = await getStudentPerformanceInsights(student, mockGrades);
    setAiInsight(insights);
    setLoading(false);
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
              onClick={() => window.print()}
              className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-all flex items-center gap-2 text-sm font-medium"
            >
              <Printer size={18} />
              Print
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
              <p className="text-slate-600 text-sm font-medium">Grade: {student.gradeLevel}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-blue-900/50 uppercase tracking-widest mb-1">Session Info</p>
              <p className="text-slate-900 font-bold">Academic Year: 2023/2024</p>
              <p className="text-slate-600 font-medium">Term: 1st Term</p>
              <p className="text-slate-600 font-medium italic">Status: Completed</p>
            </div>
          </div>

          <table className="w-full mb-10 border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="px-6 py-3 text-left font-bold text-sm uppercase tracking-wider rounded-tl-xl">Subject</th>
                <th className="px-6 py-3 text-center font-bold text-sm uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-center font-bold text-sm uppercase tracking-wider">Max</th>
                <th className="px-6 py-3 text-center font-bold text-sm uppercase tracking-wider rounded-tr-xl">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockGrades.map((grade) => (
                <tr key={grade.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-800 font-semibold">{grade.subject}</td>
                  <td className="px-6 py-4 text-center text-slate-900 font-bold">{grade.score}</td>
                  <td className="px-6 py-4 text-center text-slate-500 font-medium">{grade.maxScore}</td>
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

          {/* AI Insights Section */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 mb-10 shadow-xl shadow-blue-900/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <BrainCircuit size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h5 className="text-xl font-bold flex items-center gap-2">
                  <BrainCircuit className="text-amber-500" />
                  AI Performance Analysis
                </h5>
                {!aiInsight && !loading && (
                  <button 
                    onClick={generateAIComment}
                    className="bg-amber-500 hover:bg-amber-400 text-blue-950 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                  >
                    Generate Insights
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex items-center gap-3 text-slate-400 animate-pulse py-4">
                  <Loader2 className="animate-spin" />
                  <span>Synthesizing student data and generating professional feedback...</span>
                </div>
              ) : aiInsight ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">Teacher's Professional Comment</p>
                    <p className="text-slate-100 italic leading-relaxed text-lg">"{aiInsight.comment}"</p>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">Key Strengths</p>
                      <ul className="space-y-1">
                        {aiInsight.strengths.map((s: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-3">Focus Areas</p>
                      <ul className="space-y-1">
                        {aiInsight.improvements.map((im: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                            {im}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm">Click the button above to generate automated performance analysis using Google Gemini AI.</p>
              )}
            </div>
          </div>

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
