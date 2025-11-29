import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllAppointments, updateAppointmentStatus, getCurrentUser } from '../services/api';
import { Appointment } from '../types';
import { Button, Input, Card } from '../components/Common';
import { Check, X, Clock, User as UserIcon, Calendar, Activity, CheckCircle, AlertCircle } from 'lucide-react';

export const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'requests' | 'history'>('requests');
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  // Simulating realtime updates with periodic fetch
  useEffect(() => {
    if (!user || user.role !== 'doctor') navigate('/');
    
    const fetchAppts = () => setAppointments(getAllAppointments());
    fetchAppts();
    
    const interval = setInterval(fetchAppts, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [navigate, user]);

  useEffect(() => {
     const params = new URLSearchParams(location.search);
     if (params.get('tab') === 'requests') setActiveTab('requests');
  }, [location]);

  const handleAction = async (id: string, status: 'accepted' | 'declined') => {
    await updateAppointmentStatus(id, status);
    setAppointments(getAllAppointments());
  };

  const pendingAppts = appointments.filter(a => a.status === 'pending');
  const historyAppts = appointments.filter(a => a.status !== 'pending');
  const displayedAppts = activeTab === 'requests' ? pendingAppts : historyAppts;

  // Stats
  const stats = {
     total: appointments.length,
     pending: pendingAppts.length,
     completed: historyAppts.length
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Card className="flex items-center gap-4 border-l-4 border-l-blue-500 py-4 px-5">
            <div className="p-3 bg-blue-50 rounded-full text-[#0057FF]">
               <Activity size={24} />
            </div>
            <div>
               <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Total Appointments</p>
               <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
            </div>
         </Card>
         <Card className="flex items-center gap-4 border-l-4 border-l-yellow-500 py-4 px-5">
            <div className="p-3 bg-yellow-50 rounded-full text-yellow-600">
               <AlertCircle size={24} />
            </div>
            <div>
               <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Pending Requests</p>
               <h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3>
            </div>
         </Card>
         <Card className="flex items-center gap-4 border-l-4 border-l-green-500 py-4 px-5">
            <div className="p-3 bg-green-50 rounded-full text-green-600">
               <CheckCircle size={24} />
            </div>
            <div>
               <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Completed Visits</p>
               <h3 className="text-2xl font-bold text-gray-900">{stats.completed}</h3>
            </div>
         </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mt-2">
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
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
               <Clock size={32} />
             </div>
             <p className="text-gray-500 font-medium">No appointments found in this category.</p>
          </div>
        ) : (
          displayedAppts.map(appt => (
            <Card key={appt.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-blue-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#0057FF] shrink-0 font-bold border border-blue-100">
                  {appt.studentName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{appt.studentName}</h3>
                  <div className="text-sm text-gray-500 font-mono mb-2 bg-gray-50 inline-block px-2 rounded border border-gray-100">{appt.studentMatric}</div>
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
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0057FF] text-white rounded-xl hover:bg-blue-700 font-semibold text-sm transition-shadow shadow-lg shadow-blue-200"
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