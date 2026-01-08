
import React, { useState, useEffect } from 'react';
import { BookOpen, FileSpreadsheet, Plus, Settings, ChevronRight, Award, Edit, X } from 'lucide-react';
import { GRADE_LEVELS } from '../constants';
import { Subject, Exam } from '../types';
import { dataService } from '../services/dataService';

const AcademicsManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'subjects' | 'exams'>('subjects');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  // Modal states
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showEditSubjectModal, setShowEditSubjectModal] = useState(false);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [showEditExamModal, setShowEditExamModal] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  // Form states
  const [subjectName, setSubjectName] = useState('');
  const [subjectLevels, setSubjectLevels] = useState<string[]>([]);
  const [examTitle, setExamTitle] = useState('');
  const [examStartDate, setExamStartDate] = useState('');
  const [examEndDate, setExamEndDate] = useState('');
  const [examType, setExamType] = useState<'Main Exam' | 'Assessment' | 'Mock'>('Main Exam');

  useEffect(() => {
    setSubjects(dataService.getSubjects());
    setExams(dataService.getExams());
  }, []);

  const handleSaveSubject = () => {
    if (selectedSubject) {
      // Edit
      const updated: Subject = { ...selectedSubject, name: subjectName, levels: subjectLevels };
      dataService.saveSubject(updated);
    } else {
      // Add
      const newSubject: Subject = { id: 'sub-' + Math.random().toString(36).substr(2, 9), name: subjectName, levels: subjectLevels };
      dataService.saveSubject(newSubject);
    }
    setSubjects(dataService.getSubjects());
    setShowAddSubjectModal(false);
    setShowEditSubjectModal(false);
    setSelectedSubject(null);
    setSubjectName('');
    setSubjectLevels([]);
  };

  const handleSaveExam = () => {
    if (selectedExam) {
      // Edit
      const updated: Exam = { ...selectedExam, title: examTitle, startDate: examStartDate, endDate: examEndDate, type: examType };
      dataService.saveExam(updated);
    } else {
      // Add
      const newExam: Exam = { id: 'exam-' + Math.random().toString(36).substr(2, 9), title: examTitle, startDate: examStartDate, endDate: examEndDate, type: examType, status: 'Upcoming' };
      dataService.saveExam(newExam);
    }
    setExams(dataService.getExams());
    setShowAddExamModal(false);
    setShowEditExamModal(false);
    setSelectedExam(null);
    setExamTitle('');
    setExamStartDate('');
    setExamEndDate('');
    setExamType('Main Exam');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex gap-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveSubTab('subjects')}
          className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${activeSubTab === 'subjects' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-400'}`}
        >
          Subjects & Curriculum
        </button>
        <button 
          onClick={() => setActiveSubTab('exams')}
          className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${activeSubTab === 'exams' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-400'}`}
        >
          Examinations
        </button>
      </div>

      {activeSubTab === 'subjects' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => { setSelectedSubject(subject); setSubjectName(subject.name); setSubjectLevels(subject.levels); setShowEditSubjectModal(true); }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <BookOpen size={24} />
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedSubject(subject); setSubjectName(subject.name); setSubjectLevels(subject.levels); setShowEditSubjectModal(true); }}
                  className="text-slate-300 group-hover:text-blue-500 transition-colors"
                >
                  <Settings size={18} />
                </button>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">{subject.name}</h4>
              <p className="text-xs text-slate-500 mb-6">Active for {subject.levels.join(' & ')} levels</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-xs font-bold text-slate-400">12 Teachers Assigned</span>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </div>
          ))}
          <button
            onClick={() => { setSubjectName(''); setSubjectLevels([]); setShowAddSubjectModal(true); }}
            className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-500 transition-all"
          >
            <Plus size={32} className="mb-2" />
            <span className="font-bold text-sm">Add New Subject</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="text-xl font-bold text-slate-900">Exam Schedules</h4>
                <p className="text-sm text-slate-500">Manage upcoming term examinations and continuous assessments.</p>
              </div>
              <button
                onClick={() => { setExamTitle(''); setExamStartDate(''); setExamEndDate(''); setExamType('Main Exam'); setShowAddExamModal(true); }}
                className="bg-blue-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center gap-2"
              >
                <Plus size={18} /> Schedule Exam
              </button>
            </div>

            <div className="space-y-4">
              {exams.map((exam, i) => (
                <div
                  key={i}
                  onClick={() => { setSelectedExam(exam); setExamTitle(exam.title); setExamStartDate(exam.startDate); setExamEndDate(exam.endDate); setExamType(exam.type); setShowEditExamModal(true); }}
                  className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
                      <FileSpreadsheet size={20} />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900">{exam.title}</h5>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-medium text-slate-400">{new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="text-xs font-bold text-blue-600">{exam.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      exam.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                      exam.status === 'Grading' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {exam.status}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedExam(exam); setExamTitle(exam.title); setExamStartDate(exam.startDate); setExamEndDate(exam.endDate); setExamType(exam.type); setShowEditExamModal(true); }}
                      className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 bg-blue-900 text-white">
              <h3 className="text-xl font-black tracking-tight">Add New Subject</h3>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveSubject(); }} className="p-10 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Applicable Levels</label>
                  <div className="flex gap-2">
                    {['Primary', 'JHS'].map(level => (
                      <label key={level} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={subjectLevels.includes(level)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSubjectLevels([...subjectLevels, level]);
                            } else {
                              setSubjectLevels(subjectLevels.filter(l => l !== level));
                            }
                          }}
                        />
                        {level}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddSubjectModal(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest">Add Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Subject Modal */}
      {showEditSubjectModal && selectedSubject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 bg-blue-900 text-white">
              <h3 className="text-xl font-black tracking-tight">Edit Subject</h3>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveSubject(); }} className="p-10 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Applicable Levels</label>
                  <div className="flex gap-2">
                    {['Primary', 'JHS'].map(level => (
                      <label key={level} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={subjectLevels.includes(level)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSubjectLevels([...subjectLevels, level]);
                            } else {
                              setSubjectLevels(subjectLevels.filter(l => l !== level));
                            }
                          }}
                        />
                        {level}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowEditSubjectModal(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {showAddExamModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 bg-blue-900 text-white">
              <h3 className="text-xl font-black tracking-tight">Schedule New Exam</h3>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveExam(); }} className="p-10 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Exam Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                      value={examStartDate}
                      onChange={(e) => setExamStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                      value={examEndDate}
                      onChange={(e) => setExamEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Exam Type</label>
                  <select
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                    value={examType}
                    onChange={(e) => setExamType(e.target.value as any)}
                  >
                    <option>Main Exam</option>
                    <option>Assessment</option>
                    <option>Mock</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddExamModal(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest">Schedule Exam</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Exam Modal */}
      {showEditExamModal && selectedExam && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 bg-blue-900 text-white">
              <h3 className="text-xl font-black tracking-tight">Edit Exam</h3>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveExam(); }} className="p-10 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Exam Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                      value={examStartDate}
                      onChange={(e) => setExamStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                      value={examEndDate}
                      onChange={(e) => setExamEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Exam Type</label>
                  <select
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                    value={examType}
                    onChange={(e) => setExamType(e.target.value as any)}
                  >
                    <option>Main Exam</option>
                    <option>Assessment</option>
                    <option>Mock</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowEditExamModal(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicsManager;
