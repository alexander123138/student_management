
import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Wallet,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  School,
  GraduationCap
} from 'lucide-react';
import { SCHOOL_NAME } from '../constants';
import logo from '../assets/images/logo.jpg';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
    { id: 'academics', label: 'Academics', icon: BookOpen },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'fees', label: 'Finance', icon: Wallet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 bg-blue-900 text-white flex flex-col z-20`}
      >
        <div className="p-4 flex items-center gap-3 bg-blue-950">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
            <img src={logo} alt="School Logo" className="w-10 h-10 rounded-lg" />
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold leading-tight truncate">{SCHOOL_NAME}</h1>
              <p className="text-[10px] text-blue-300 uppercase tracking-widest">Administrator</p>
            </div>
          )}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-amber-500 text-white shadow-lg' 
                  : 'hover:bg-blue-800 text-blue-100'
              }`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-blue-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-red-500/20 text-red-400 transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 capitalize">
              {navItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer p-2 hover:bg-slate-100 rounded-full" onClick={() => alert('No new notifications at this time.')}>
              <Bell size={20} className="text-slate-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-slate-100">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                  alt="avatar" 
                />
              </div>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
