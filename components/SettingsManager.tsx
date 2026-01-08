
import React, { useState } from 'react';
import { Settings, School, User, Bell, Shield, Database, HelpCircle, X } from 'lucide-react';
import { SCHOOL_NAME } from '../constants';

interface SettingsManagerProps {
  onNavigateToAcademics?: () => void;
}

const SettingsManager: React.FC<SettingsManagerProps> = ({ onNavigateToAcademics }) => {
  const [showSchoolProfileModal, setShowSchoolProfileModal] = useState(false);
  const [showAcademicSettingsModal, setShowAcademicSettingsModal] = useState(false);
  const [showUserManagementModal, setShowUserManagementModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState('');
  const [templateContent, setTemplateContent] = useState('');

  // Password Management form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // School Profile form state
  const [schoolName, setSchoolName] = useState('Holy Child Preparatory & JHS');
  const [schoolAddress, setSchoolAddress] = useState('P.O. Box 456, Sunyani, Ghana');
  const [schoolPhone, setSchoolPhone] = useState('+233 244 556 677');
  const [schoolEmail, setSchoolEmail] = useState('info@holychild.edu.gh');
  const [primaryColor, setPrimaryColor] = useState('#1e3a8a');
  const [secondaryColor, setSecondaryColor] = useState('#f59e0b');

  // Academic Settings form state
  const [gradingScale, setGradingScale] = useState('Letter Grades');
  const [academicTerms, setAcademicTerms] = useState('3 Terms');
  const [calendarYear, setCalendarYear] = useState('2023/2024');

  // User Management form state
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherRole, setTeacherRole] = useState('Teacher');

  // Notifications form state
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [attendanceAlerts, setAttendanceAlerts] = useState(true);
  const [gradeAlerts, setGradeAlerts] = useState(true);

  const sections = [
    { 
      title: 'School Profile', 
      desc: 'Update school details, logo and branding colors.',
      icon: School,
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      title: 'Academic Settings', 
      desc: 'Define grading scales, terms and academic calendar years.',
      icon: Database,
      color: 'bg-amber-50 text-amber-600'
    },
    { 
      title: 'User Management', 
      desc: 'Manage teacher accounts, roles and system permissions.',
      icon: User,
      color: 'bg-emerald-50 text-emerald-600'
    },
    { 
      title: 'Notifications', 
      desc: 'Configure automated SMS and email parent alerts.',
      icon: Bell,
      color: 'bg-rose-50 text-rose-600'
    },
    {
      title: 'Security',
      desc: 'Password management, policies and portal login security.',
      icon: Shield,
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Configuration</h3>
        <p className="text-slate-500 font-medium mt-1">Master administrative controls for {SCHOOL_NAME}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sections.map((section, i) => (
          <button
            key={i}
            onClick={() => {
              if (section.title === 'School Profile') setShowSchoolProfileModal(true);
              else if (section.title === 'Academic Settings') setShowAcademicSettingsModal(true);
              else if (section.title === 'User Management') setShowUserManagementModal(true);
              else if (section.title === 'Notifications') setShowNotificationsModal(true);
              else if (section.title === 'Security') setShowSecurityModal(true);
            }}
            className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all group text-left"
          >
            <div className={`w-14 h-14 rounded-2xl ${section.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
              <section.icon size={28} />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-slate-900">{section.title}</h4>
              <p className="text-sm text-slate-500 font-medium">{section.desc}</p>
            </div>
            <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-blue-500 group-hover:border-blue-200 transition-all">
              <HelpCircle size={18} />
            </div>
          </button>
        ))}
      </div>

      <div className="text-center pt-8">
        <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Holy Child SMS v2.5.0-Preview</p>
      </div>

      {/* School Profile Modal */}
      {showSchoolProfileModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 bg-blue-900 text-white">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-black tracking-tight">School Profile Settings</h3>
                <button onClick={() => setShowSchoolProfileModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X size={24} />
                </button>
              </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert('School profile updated!'); setShowSchoolProfileModal(false); }} className="p-10 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">School Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">School Address</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                    value={schoolAddress}
                    onChange={(e) => setSchoolAddress(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                      value={schoolPhone}
                      onChange={(e) => setSchoolPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                      value={schoolEmail}
                      onChange={(e) => setSchoolEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Primary Color</label>
                    <input
                      type="color"
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Secondary Color</label>
                    <input
                      type="color"
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowSchoolProfileModal(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Academic Settings Modal */}
      {showAcademicSettingsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 bg-amber-500 text-white">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-black tracking-tight">Academic Settings</h3>
                <button onClick={() => setShowAcademicSettingsModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X size={24} />
                </button>
              </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert('Academic settings updated!'); setShowAcademicSettingsModal(false); }} className="p-10 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Grading Scale</label>
                  <select
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold text-slate-700"
                    value={gradingScale}
                    onChange={(e) => setGradingScale(e.target.value)}
                  >
                    <option>Letter Grades (A-F)</option>
                    <option>Percentage (0-100)</option>
                    <option>GPA (0.0-4.0)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Academic Terms</label>
                  <select
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold text-slate-700"
                    value={academicTerms}
                    onChange={(e) => setAcademicTerms(e.target.value)}
                  >
                    <option>3 Terms</option>
                    <option>2 Semesters</option>
                    <option>4 Quarters</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Academic Year</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold text-slate-700"
                    value={calendarYear}
                    onChange={(e) => setCalendarYear(e.target.value)}
                    placeholder="2023/2024"
                  />
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">Quick Actions</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { if (onNavigateToAcademics) { onNavigateToAcademics(); setTimeout(() => alert('Use the buttons in the Academics section to manage subjects'), 100); } }} className="px-3 py-2 bg-amber-500 text-white text-xs font-bold rounded-lg">Manage Subjects</button>
                    <button type="button" onClick={() => { if (onNavigateToAcademics) { onNavigateToAcademics(); setTimeout(() => alert('Use the buttons in the Academics section to schedule exams'), 100); } }} className="px-3 py-2 bg-amber-500 text-white text-xs font-bold rounded-lg">Schedule Exams</button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAcademicSettingsModal(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-amber-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest">Save Settings</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Management Modal */}
      {showUserManagementModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 bg-emerald-500 text-white">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-black tracking-tight">User Management</h3>
                <button onClick={() => setShowUserManagementModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X size={24} />
                </button>
              </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert('Teacher account created!'); setTeacherName(''); setTeacherEmail(''); setTeacherRole('Teacher'); }} className="p-10 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Teacher Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-700"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-700"
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                    placeholder="teacher@holychild.edu.gh"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Role & Permissions</label>
                  <select
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-700"
                    value={teacherRole}
                    onChange={(e) => setTeacherRole(e.target.value)}
                  >
                    <option>Admin (Full Access)</option>
                    <option>Teacher (Edit Access)</option>
                    <option>Staff (View Only)</option>
                  </select>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">Existing Users</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Dr. Mensah Arthur</span>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Admin</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Mrs. Osei-Kyei</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Teacher</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowUserManagementModal(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-emerald-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 bg-rose-500 text-white">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-black tracking-tight">Notifications Settings</h3>
                <button onClick={() => setShowNotificationsModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X size={24} />
                </button>
              </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert('Notification settings updated!'); setShowNotificationsModal(false); }} className="p-10 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Communication Channels</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={smsEnabled}
                        onChange={(e) => setSmsEnabled(e.target.checked)}
                      />
                      <span className="text-sm font-medium">SMS Alerts</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={emailEnabled}
                        onChange={(e) => setEmailEnabled(e.target.checked)}
                      />
                      <span className="text-sm font-medium">Email Alerts</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Alert Types</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={attendanceAlerts}
                        onChange={(e) => setAttendanceAlerts(e.target.checked)}
                      />
                      <span className="text-sm font-medium">Attendance Notifications</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={gradeAlerts}
                        onChange={(e) => setGradeAlerts(e.target.checked)}
                      />
                      <span className="text-sm font-medium">Grade & Report Card Alerts</span>
                    </label>
                  </div>
                </div>
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                  <p className="text-xs font-bold text-rose-700 uppercase tracking-widest mb-2">Notification Templates</p>
                  <div className="space-y-2">
                    <button type="button" onClick={() => { setCurrentTemplate('Attendance'); setTemplateContent('Dear Parent,\n\nYour child [STUDENT_NAME] was [STATUS] on [DATE].\n\nPlease contact the school if you have any concerns.\n\nBest regards,\nHoly Child Preparatory School'); setShowTemplateModal(true); }} className="block w-full text-left px-3 py-2 bg-rose-100 text-rose-700 text-xs font-bold rounded hover:bg-rose-200">Edit Attendance Alert Template</button>
                    <button type="button" onClick={() => { setCurrentTemplate('Grade'); setTemplateContent('Dear Parent,\n\n[STUDENT_NAME]\'s latest grades are now available:\n\n[GRADES_SUMMARY]\n\nPlease review the full report card in the parent portal.\n\nBest regards,\nHoly Child Preparatory School'); setShowTemplateModal(true); }} className="block w-full text-left px-3 py-2 bg-rose-100 text-rose-700 text-xs font-bold rounded hover:bg-rose-200">Edit Grade Alert Template</button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowNotificationsModal(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-rose-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest">Save Settings</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <div className="p-8 bg-purple-600 text-white flex-shrink-0">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-black tracking-tight">Security Settings</h3>
                <button onClick={() => setShowSecurityModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X size={24} />
                </button>
              </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert('Security settings updated!'); setShowSecurityModal(false); }} className="flex-1 overflow-y-auto p-10 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password Policies</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm font-medium">Require strong passwords (8+ characters)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm font-medium">Password expiration (90 days)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm font-medium">Two-factor authentication</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Login Security</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm font-medium">Account lockout after 5 failed attempts</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm font-medium">Session timeout (30 minutes)</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password Management</label>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                      <input
                        type="password"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none font-bold text-slate-700"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                      <input
                        type="password"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none font-bold text-slate-700"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none font-bold text-slate-700"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!currentPassword || !newPassword || !confirmPassword) {
                          alert('Please fill in all password fields.');
                          return;
                        }
                        if (newPassword !== confirmPassword) {
                          alert('New password and confirmation do not match.');
                          return;
                        }
                        if (newPassword.length < 8) {
                          alert('New password must be at least 8 characters long.');
                          return;
                        }
                        // Here you would typically send to backend
                        alert('Password changed successfully!');
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="w-full py-3 bg-purple-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-purple-700 transition-colors"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                  <p className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-2">Security Actions</p>
                  <div className="space-y-2">
                    <button type="button" onClick={() => alert('Password reset initiated for all users')} className="block w-full text-left px-3 py-2 bg-purple-100 text-purple-700 text-xs font-bold rounded hover:bg-purple-200">Reset All Passwords</button>
                    <button type="button" onClick={() => alert('Security audit log exported')} className="block w-full text-left px-3 py-2 bg-purple-100 text-purple-700 text-xs font-bold rounded hover:bg-purple-200">Export Security Log</button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowSecurityModal(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-purple-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest">Save Security Settings</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Template Editor Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 bg-rose-500 text-white">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-black tracking-tight">Edit {currentTemplate} Template</h3>
                <button onClick={() => setShowTemplateModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X size={24} />
                </button>
              </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert(`${currentTemplate} template updated!`); setShowTemplateModal(false); }} className="p-10 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Template Content</label>
                  <textarea
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-mono text-sm"
                    rows={8}
                    value={templateContent}
                    onChange={(e) => setTemplateContent(e.target.value)}
                    placeholder="Enter your message template..."
                  />
                </div>
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                  <p className="text-xs font-bold text-rose-700 uppercase tracking-widest mb-2">Available Variables</p>
                  <div className="text-xs text-rose-600 space-y-1">
                    <div><code>[STUDENT_NAME]</code> - Student's full name</div>
                    <div><code>[DATE]</code> - Date of the event</div>
                    <div><code>[STATUS]</code> - Attendance status or grade</div>
                    <div><code>[GRADES_SUMMARY]</code> - Summary of grades</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowTemplateModal(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-rose-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest">Save Template</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsManager;
