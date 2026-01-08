
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Download, Plus, Printer, X } from 'lucide-react';
import { GRADE_LEVELS, SCHOOL_NAME } from '../constants';
import { TimetableEntry } from '../types';
import { dataService } from '../services/dataService';

const TimetableManager: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState(GRADE_LEVELS[2]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | null>(null);

  // Form states
  const [entrySubject, setEntrySubject] = useState('');
  const [entryTeacher, setEntryTeacher] = useState('');
  const [entryRoom, setEntryRoom] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const slots = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 10:30 (Break)', '10:30 - 11:30', '11:30 - 12:30', '12:30 - 01:30', '01:30 - 02:30'];

  useEffect(() => {
    setTimetable(dataService.getTimetable());
  }, []);

  const handleExportPDF = () => {
    window.print();
  };

  const handleEditSlot = (day: string, startTime: string, endTime: string) => {
    const existing = timetable.find(t => t.gradeLevel === selectedGrade && t.day === day && t.startTime === startTime);
    if (existing) {
      setSelectedEntry(existing);
      setEntrySubject(existing.subject);
      setEntryTeacher(existing.teacherId);
      setEntryRoom('Room 4B'); // Default
    } else {
      setSelectedEntry(null);
      setEntrySubject('Mathematics');
      setEntryTeacher('Mrs. Osei-Kyei');
      setEntryRoom('Room 4B');
    }
    setShowEditModal(true);
  };

  const handleSaveEntry = () => {
    const entry: TimetableEntry = selectedEntry ? {
      ...selectedEntry,
      subject: entrySubject,
      teacherId: entryTeacher
    } : {
      id: 't-' + Math.random().toString(36).substr(2, 9),
      gradeLevel: selectedGrade,
      day: 'Monday', // Would need to pass from click
      startTime: '08:00',
      endTime: '09:00',
      subject: entrySubject,
      teacherId: entryTeacher
    };
    dataService.saveTimetableEntry(entry);
    setTimetable(dataService.getTimetable());
    setShowEditModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Print-only Header */}
      <div className="print-only mb-8 text-center border-b-2 border-slate-900 pb-4">
        <h1 className="text-2xl font-black text-blue-900 uppercase">{SCHOOL_NAME}</h1>
        <h2 className="text-lg font-bold text-slate-700">ACADEMIC TIMETABLE - {selectedGrade}</h2>
        <p className="text-sm text-slate-500">Effective: 2023/2024 Academic Session</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-6 no-print">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Class Timetable</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selected Grade:</span>
              <select 
                className="bg-transparent text-sm font-bold text-blue-600 focus:outline-none"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
              >
                {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportPDF}
            className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 border border-slate-200 transition-all"
            title="Export PDF"
          >
            <Printer size={18} />
          </button>
          <button
            onClick={() => { setEntrySubject(''); setEntryTeacher(''); setEntryRoom(''); setShowEditModal(true); }}
            className="bg-blue-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all active:scale-95"
          >
            <Plus size={18} /> Update Schedule
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-5 text-left border-r border-slate-100 w-40 text-xs font-black text-slate-400 uppercase tracking-widest">Time Slot</th>
                {days.map(day => (
                  <th key={day} className="p-5 text-center text-xs font-black text-slate-400 uppercase tracking-widest">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {slots.map((slot, i) => (
                <tr key={i} className={slot.includes('Break') ? 'bg-amber-50/30' : 'hover:bg-slate-50 transition-colors'}>
                  <td className="p-5 border-r border-slate-100 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Clock size={12} className="text-blue-500" />
                      {slot}
                    </div>
                  </td>
                  {days.map(day => (
                    <td key={day} className="p-4">
                      {slot.includes('Break') ? (
                        <div className="text-center py-2">
                          <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Rest Break</span>
                        </div>
                      ) : (
                        <div
                          onClick={() => handleEditSlot(day, slot.split(' - ')[0], slot.split(' - ')[1])}
                          className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm hover:border-blue-300 transition-colors cursor-pointer group"
                        >
                          <p className="text-xs font-black text-blue-900 mb-1 group-hover:text-blue-600">Mathematics</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Mrs. Osei-Kyei</p>
                          <p className="text-[10px] text-slate-400 font-medium">Room 4B</p>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Timetable Entry Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 bg-blue-900 text-white">
              <h3 className="text-xl font-black tracking-tight">Edit Timetable Slot</h3>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEntry(); }} className="p-10 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                    value={entrySubject}
                    onChange={(e) => setEntrySubject(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Teacher</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                    value={entryTeacher}
                    onChange={(e) => setEntryTeacher(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Room</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                    value={entryRoom}
                    onChange={(e) => setEntryRoom(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableManager;