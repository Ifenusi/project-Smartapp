import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginDoctor, getAllAppointments, updateAppointmentStatus, getCurrentUser } from '../services/api';
import { Appointment } from '../types';
import { Button, Input, Card } from '../components/Common';
import { Check, X, Clock, User as UserIcon, Calendar, Activity } from 'lucide-react';

export const DoctorLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginDoctor(email, password);
      navigate('/doctor/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
             <Activity size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Doctor Portal</h1>
          <p className="text-gray-400">Authorized personnel only</p>
        </div>
        
        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <form onSubmit={handleSubmit}>
            <Input 
              label="Email ID" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="text-white"
              style={{color: 'black'}} 
            />
            <Input 
              label="Password" 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="text-white"
               style={{color: 'black'}}
            />
            
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            
            <Button type="submit" isLoading={loading} className="bg-white text-gray-900 hover:bg-gray-100">
              Access Dashboard
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'requests' | 'history'>('requests');
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user || user.role !== 'doctor') navigate('/doctor/login');
    else {
      setAppointments(getAllAppointments());
    }
  }, [navigate, user]);

  const handleAction = async (id: string, status: 'accepted' | 'declined') => {
    await updateAppointmentStatus(id, status);
    setAppointments(getAllAppointments());
  };

  const pendingAppts = appointments.filter(a => a.status === 'pending');
  const historyAppts = appointments.filter(a => a.status !== 'pending');
  const displayedAppts = activeTab === 'requests' ? pendingAppts : historyAppts;

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
             <img src={user?.profilePicUrl} alt="Dr" className="w-full h-full object-cover rounded-full" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-gray-900">{user?.fullName}</h2>
             <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
               <span className="flex items-center gap-1 text-green-600 font-medium px-2 py-0.5 bg-green-50 rounded-full border border-green-100 text-xs">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 Active Duty
               </span>
               <span className="text-gray-300">|</span>
               <span className="flex items-center gap-1">
                 <Calendar size={14} />
                 {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
               </span>
             </div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-2 font-medium text-sm transition-colors relative ${
            activeTab === 'requests' ? 'text-[#0057FF]' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Appointment Requests
          {pendingAppts.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
              {pendingAppts.length}
            </span>
          )}
          {activeTab === 'requests' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0057FF]" />}
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-2 font-medium text-sm transition-colors relative ${
            activeTab === 'history' ? 'text-[#0057FF]' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Past Appointments
          {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0057FF]" />}
        </button>
      </div>

      <div className="space-y-4">
        {displayedAppts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
               <Clock size={32} />
             </div>
             <p className="text-gray-500 font-medium">No appointments found.</p>
          </div>
        ) : (
          displayedAppts.map(appt => (
            <Card key={appt.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-blue-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{appt.studentName}</h3>
                  <div className="text-sm text-gray-500 font-mono mb-2 bg-gray-50 inline-block px-2 rounded">{appt.studentMatric}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Reason:</span>
                      <span className="font-medium text-[#0057FF]">{appt.reason}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-gray-400">Time:</span>
                       <span className="font-medium">{appt.date} at {appt.time}</span>
                    </div>
                  </div>
                  {appt.note && (
                    <div className="mt-3 text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                      <span className="font-bold text-yellow-700 block text-xs mb-1">NOTE:</span>
                      "{appt.note}"
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                {appt.status === 'pending' ? (
                  <>
                    <button 
                      onClick={() => handleAction(appt.id, 'accepted')}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold text-sm transition-shadow shadow-lg shadow-green-200"
                    >
                      <Check size={18} /> Accept
                    </button>
                    <button 
                      onClick={() => handleAction(appt.id, 'declined')}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-white border-2 border-red-100 text-red-600 rounded-xl hover:bg-red-50 font-semibold text-sm transition-colors"
                    >
                      <X size={18} /> Decline
                    </button>
                  </>
                ) : (
                  <span className={`px-4 py-2 rounded-lg text-sm font-bold capitalize flex items-center gap-2 ${
                    appt.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {appt.status === 'accepted' ? <Check size={16} /> : <X size={16} />}
                    {appt.status}
                  </span>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};