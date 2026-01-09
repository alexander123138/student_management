
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import ReportCard from './components/ReportCard';
import AttendanceTracker from './components/AttendanceTracker';
import FinanceManager from './components/FinanceManager';
import AcademicsManager from './components/AcademicsManager';
import TimetableManager from './components/TimetableManager';
import SettingsManager from './components/SettingsManager';
import { User, Student, FeeRecord, UserRole } from './types';
import { dataService } from './services/dataService';
import { LogIn, ShieldCheck, GraduationCap } from 'lucide-react';
import logo from './assets/images/logo.jpg';
import backgroundImage from './assets/images/image background.jpg';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // UI State
  const [isStudentFormOpen, setStudentFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();
  const [selectedReportStudent, setSelectedReportStudent] = useState<Student | null>(null);

  const refreshData = async () => {
    setStudents(await dataService.getStudents());
    setFees(await dataService.getFees());
  };

  useEffect(() => {
    const loadData = async () => {
      await refreshData();
    };
    loadData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      alert('Please enter both email and password.');
      return;
    }
    setUser({
      id: 'admin-1',
      name: 'Dr. Mensah Arthur',
      email: 'holychild@edu.gh',
      role: UserRole.ADMIN,
    });
  };

  const saveStudent = async (student: Student) => {
    await dataService.saveStudent(student);
    await refreshData();
    setStudentFormOpen(false);
    setEditingStudent(undefined);
  };

  const deleteStudent = async (id: string) => {
    if (confirm('Are you sure you want to delete this student record?')) {
      await dataService.deleteStudent(id);
      await refreshData();
      alert('Student deleted successfully!');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/10 blur-[120px] rounded-full"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <img src={logo} alt="Holy Child Logo" className="w-28 h-28 mx-auto mb-6 rounded-3xl shadow-2xl" />
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Holy Child</h1>
            <p className="text-slate-300 font-medium tracking-wide uppercase text-sm">Preparatory & JHS Management System</p>
          </div>

          <form onSubmit={handleLogin} className="bg-transparent backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200 ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200 ml-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-5 bg-amber-500 text-blue-950 font-black rounded-2xl shadow-xl shadow-amber-500/20 hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs"
              >
                <ShieldCheck size={20} />
                Sign In
              </button>
            </div>
            <div className="mt-10 text-center">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Authorized Personnel Only<br/>
                &copy; 2026 Holy Child Prep School
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard students={students} fees={fees} />;
      case 'students': return (
        <StudentList 
          students={students} 
          onAdd={() => { setEditingStudent(undefined); setStudentFormOpen(true); }}
          onEdit={(s) => { setEditingStudent(s); setStudentFormOpen(true); }}
          onDelete={deleteStudent}
          onViewReport={setSelectedReportStudent}
        />
      );
      case 'attendance': return <AttendanceTracker students={students} />;
      case 'academics': return <AcademicsManager />;
      case 'timetable': return <TimetableManager />;
      case 'fees': return <FinanceManager students={students} fees={fees} onUpdate={refreshData} />;
      case 'settings': return <SettingsManager onNavigateToAcademics={() => setActiveTab('academics')} />;
      default: return (
        <div className="p-20 text-center">
          <h2 className="text-2xl font-bold text-slate-400">Section Under Maintenance</h2>
        </div>
      );
    }
  };

  return (
    <Layout 
      user={user} 
      onLogout={() => setUser(null)}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      <div className="h-full">
        {renderContent()}
      </div>

      {isStudentFormOpen && (
        <StudentForm 
          student={editingStudent}
          onSave={saveStudent}
          onClose={() => setStudentFormOpen(false)}
        />
      )}

      {selectedReportStudent && (
        <ReportCard 
          student={selectedReportStudent}
          onClose={() => setSelectedReportStudent(null)}
        />
      )}
    </Layout>
  );
};

export default App;
