import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  getCurrentUser, 
  getAllStudents, deleteStudent, resetStudentPassword,
  getReviews, deleteReview, 
  getAllAppointments, getSystemLogs, getAllCGPARecords
} from '../services/api';
import { User, Review, Appointment, SystemLog, CGPARecord } from '../types';
import { Button, Input, Card } from '../components/Common';
import { 
  Trash2, Search, RefreshCcw, Shield, CheckCircle, Clock,
  BarChart2, Users, FileText, Database, Settings
} from 'lucide-react';

const TabButton = ({ active, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
      active 
        ? 'bg-gray-900 text-white shadow-lg' 
        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
    }`}
  >
    {label}
  </button>
);

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState('overview');
  
  // Data
  const [students, setStudents] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cgpaRecords, setCgpaRecords] = useState<CGPARecord[]>([]);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Stats
  const [stats, setStats] = useState({ totalStudents: 0, totalAppts: 0, pendingAppts: 0, completionRate: 0 });

  useEffect(() => {
    const u = getCurrentUser();
    if (u?.role !== 'admin') navigate('/');
    
    // Parse query params for tab
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam) setTab(tabParam);
    
    refreshAll();
    const interval = setInterval(refreshAll, 5000); // Poll for real-time updates
    return () => clearInterval(interval);
  }, [location]);

  const refreshAll = () => {
    const s = getAllStudents();
    const a = getAllAppointments();
    const l = getSystemLogs();
    const r = getReviews();
    const c = getAllCGPARecords();
    
    setStudents(s);
    setAppointments(a);
    setLogs(l);
    setReviews(r);
    setCgpaRecords(c);
    
    const completed = a.filter(apt => apt.status !== 'pending').length;
    const rate = a.length > 0 ? Math.round((completed / a.length) * 100) : 0;

    setStats({
      totalStudents: s.length,
      totalAppts: a.length,
      pendingAppts: a.filter(apt => apt.status === 'pending').length,
      completionRate: rate
    });
  };

  const handleResetPassword = async (id: string) => {
    if (window.confirm("Are you sure? Password will be reset to surname.")) {
      await resetStudentPassword(id);
      alert("Password reset successfully.");
      refreshAll();
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm("Delete this student permanently? This cannot be undone.")) {
      await deleteStudent(id);
      refreshAll();
    }
  };

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.matricNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
               <Shield size={32} />
            </div>
            <div>
               <h2 className="text-xl font-bold">System Admin Console</h2>
               <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                 <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                 System Online
               </div>
            </div>
         </div>
         <div className="text-right hidden sm:block">
            <div className="text-3xl font-bold">{stats.totalStudents}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Registered Students</div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <TabButton active={tab === 'overview'} label="Overview" onClick={() => navigate('/admin/dashboard')} />
        <TabButton active={tab === 'students'} label="Students" onClick={() => navigate('/admin/dashboard?tab=students')} />
        <TabButton active={tab === 'appointments'} label="Appointments" onClick={() => navigate('/admin/dashboard?tab=appointments')} />
        <TabButton active={tab === 'reviews'} label="Reviews" onClick={() => navigate('/admin/dashboard?tab=reviews')} />
        <TabButton active={tab === 'cgpa'} label="CGPA Records" onClick={() => navigate('/admin/dashboard?tab=cgpa')} />
        <TabButton active={tab === 'settings'} label="Settings" onClick={() => navigate('/admin/dashboard?tab=settings')} />
        <TabButton active={tab === 'logs'} label="System Logs" onClick={() => navigate('/admin/dashboard?tab=logs')} />
      </div>

      {/* Overview Content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-gray-500 text-xs font-bold uppercase">Total Appointments</p>
                   <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAppts}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><BarChart2 size={24} /></div>
             </div>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-gray-500 text-xs font-bold uppercase">Pending Requests</p>
                   <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingAppts}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600"><Clock size={24} /></div>
             </div>
          </Card>
          <Card className="border-l-4 border-l-green-500">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-gray-500 text-xs font-bold uppercase">Dr. Completion Rate</p>
                   <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completionRate}%</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-green-600"><CheckCircle size={24} /></div>
             </div>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-gray-500 text-xs font-bold uppercase">Total Reviews</p>
                   <p className="text-3xl font-bold text-gray-900 mt-2">{reviews.length}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg text-purple-600"><FileText size={24} /></div>
             </div>
          </Card>
          
          <div className="md:col-span-4">
             <h3 className="font-bold text-gray-800 mb-4">Recent System Activity</h3>
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {logs.slice(0, 5).map(log => (
                  <div key={log.id} className="p-4 border-b border-gray-50 last:border-0 flex items-start gap-3">
                     <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                       log.type === 'error' ? 'bg-red-500' : 
                       log.type === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                     }`} />
                     <div>
                       <p className="text-sm font-medium text-gray-800">{log.action}</p>
                       <p className="text-xs text-gray-500">{log.details}</p>
                       <p className="text-[10px] text-gray-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* Student Management */}
      {tab === 'students' && (
        <Card>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="font-bold text-lg text-gray-800">Registered Students</h3>
            <div className="relative w-full sm:w-64">
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              <input 
                placeholder="Search name, matric..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-4 rounded-tl-lg">Student</th>
                  <th className="p-4">Matric No</th>
                  <th className="p-4">Email</th>
                  <th className="p-4 rounded-tr-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
                      <img src={student.profilePicUrl} className="w-8 h-8 rounded-full bg-gray-200" alt="" />
                      {student.fullName}
                    </td>
                    <td className="p-4 text-gray-600 font-mono text-xs">{student.matricNumber}</td>
                    <td className="p-4 text-gray-600">{student.email}</td>
                    <td className="p-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleResetPassword(student.id)}
                        title="Reset Password"
                        className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100"
                      >
                        <RefreshCcw size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteStudent(student.id)}
                        title="Delete Student"
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-400">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Appointment Oversight */}
      {tab === 'appointments' && (
        <div className="space-y-4">
           {appointments.map(appt => (
             <div key={appt.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${
                      appt.status === 'accepted' ? 'bg-green-500' : 
                      appt.status === 'declined' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <span className="font-bold text-gray-800">{appt.reason}</span>
                    <span className="text-xs text-gray-400 font-mono">#{appt.id.slice(-6)}</span>
                  </div>
                  <p className="text-sm text-gray-600">Student: {appt.studentName} ({appt.studentMatric})</p>
                  <p className="text-xs text-gray-400">{new Date(appt.date).toLocaleDateString()} @ {appt.time}</p>
               </div>
               <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                      appt.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                      appt.status === 'declined' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {appt.status}
                  </span>
               </div>
             </div>
           ))}
           {appointments.length === 0 && <p className="text-center text-gray-500 py-10">No appointments recorded.</p>}
        </div>
      )}

      {/* Reviews Management */}
      {tab === 'reviews' && (
         <div className="space-y-4">
           {reviews.map(review => (
             <div key={review.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-800">{review.targetName} <span className="text-xs font-normal text-gray-400">({review.type})</span></h4>
                    <div className="flex text-yellow-400 text-xs my-1">
                       {Array.from({length: review.rating}).map((_,i) => <span key={i}>★</span>)}
                    </div>
                    <p className="text-gray-600 text-sm">"{review.comment}"</p>
                    <p className="text-[10px] text-gray-400 mt-2">By {review.studentName} • {new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={async () => {
                     await deleteReview(review.id);
                     refreshAll();
                  }} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16} /></button>
               </div>
             </div>
           ))}
           {reviews.length === 0 && <p className="text-center text-gray-500 py-10">No reviews submitted.</p>}
         </div>
      )}

      {/* CGPA Records Management */}
      {tab === 'cgpa' && (
         <Card>
            <h3 className="font-bold text-gray-800 mb-4">Student CGPA Submissions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                    <tr>
                       <th className="p-3">ID</th>
                       <th className="p-3">Semester</th>
                       <th className="p-3">GPA</th>
                       <th className="p-3">Date</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {cgpaRecords.map(rec => (
                       <tr key={rec.id}>
                          <td className="p-3 font-mono text-xs">{rec.studentId.slice(0, 8)}...</td>
                          <td className="p-3">{rec.semester}</td>
                          <td className="p-3 font-bold text-blue-600">{rec.gpa}</td>
                          <td className="p-3 text-gray-500 text-xs">{new Date(rec.createdAt).toLocaleDateString()}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
              {cgpaRecords.length === 0 && <p className="text-center text-gray-500 py-8">No CGPA records found.</p>}
            </div>
         </Card>
      )}

      {/* Settings */}
      {tab === 'settings' && (
         <Card>
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
               <Settings size={20} /> System Configuration
            </h3>
            <form className="space-y-4 max-w-lg">
               <Input label="Application Name" defaultValue="Wellspring SmartApp" />
               <Input label="University Contact Email" defaultValue="info@wellspring.edu.ng" />
               <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
                  <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                     <div className="w-6 h-6 bg-white rounded-full shadow absolute left-0 top-0 border border-gray-200"></div>
                  </div>
               </div>
               <Button type="button" onClick={() => alert("Settings Saved!")}>Save Changes</Button>
            </form>
         </Card>
      )}

      {/* System Logs */}
      {tab === 'logs' && (
        <Card className="bg-gray-900 text-gray-300 border-gray-800 font-mono text-xs">
           <h3 className="text-white font-bold mb-4 text-sm border-b border-gray-700 pb-2">System Audit Log</h3>
           <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
             {logs.map(log => (
               <div key={log.id} className="flex gap-4 hover:bg-white/5 p-2 rounded">
                 <span className="text-gray-500 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                 <div className="flex-1">
                    <span className={`font-bold mr-2 ${
                      log.type === 'error' ? 'text-red-400' : 
                      log.type === 'success' ? 'text-green-400' : 
                      log.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                    }`}>[{log.type.toUpperCase()}]</span>
                    <span className="text-gray-200">{log.action}</span>
                    <span className="text-gray-500 mx-2">-</span>
                    <span>{log.details}</span>
                 </div>
               </div>
             ))}
           </div>
        </Card>
      )}
    </div>
  );
};