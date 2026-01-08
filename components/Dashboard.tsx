
import React from 'react';
import { 
  Users, 
  GraduationCap, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Student, FeeRecord } from '../types';

interface DashboardProps {
  students: Student[];
  fees: FeeRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ students, fees }) => {
  const totalStudents = students.length;
  const primaryCount = students.filter(s => s.gradeLevel.includes('Class') || s.gradeLevel.includes('KG')).length;
  const jhsCount = totalStudents - primaryCount;
  
  const totalRevenue = fees.reduce((acc, curr) => acc + curr.amountPaid, 0);
  const totalPending = fees.reduce((acc, curr) => acc + (curr.amountDue - curr.amountPaid), 0);

  const enrollmentData = [
    { name: 'Primary', value: primaryCount },
    { name: 'JHS', value: jhsCount },
  ];

  const attendanceHistory = [
    { day: 'Mon', rate: 95 },
    { day: 'Tue', rate: 92 },
    { day: 'Wed', rate: 98 },
    { day: 'Thu', rate: 94 },
    { day: 'Fri', rate: 90 },
  ];

  const COLORS = ['#1e3a8a', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Students</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalStudents}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Teachers</p>
            <h3 className="text-2xl font-bold text-slate-900">12</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Fee Collection</p>
            <h3 className="text-2xl font-bold text-slate-900">GHS {totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Pending Fees</p>
            <h3 className="text-2xl font-bold text-slate-900">GHS {totalPending.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-800">Enrollment by Level</h4>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={enrollmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {enrollmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {enrollmentData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                <span className="text-sm text-slate-600">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-800">Attendance Rate (%)</h4>
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
              <TrendingUp size={16} />
              <span>+2.4% this week</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#1e3a8a" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#1e3a8a' }} 
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity / Bottom Row */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h4 className="font-bold text-slate-800 mb-4">Latest Registered Students</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-100">
                <th className="pb-3 text-sm font-semibold text-slate-500">Reg No</th>
                <th className="pb-3 text-sm font-semibold text-slate-500">Name</th>
                <th className="pb-3 text-sm font-semibold text-slate-500">Level</th>
                <th className="pb-3 text-sm font-semibold text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.slice(-5).reverse().map((student) => (
                <tr key={student.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-4 text-sm text-slate-700">{student.regNumber}</td>
                  <td className="py-4 text-sm font-medium text-slate-900">{student.firstName} {student.lastName}</td>
                  <td className="py-4 text-sm text-slate-600">{student.gradeLevel}</td>
                  <td className="py-4 text-sm">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
