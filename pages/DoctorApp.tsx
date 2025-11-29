import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginDoctor, getAllAppointments, updateAppointmentStatus, getCurrentUser } from '../services/api';
import { Appointment, User } from '../types';
import { Button, Input, Card } from '../components/Common';
import { Check, X, Clock, User as UserIcon } from 'lucide-react';

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
              style={{color: 'black'}} // Override for input text visibility if simple Input used
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
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'doctor') navigate('/doctor/login');
    else {
      // Load appointments
      setAppointments(getAllAppointments());
    }
  }, [navigate]);

  const handleAction = async (id: string, status: 'accepted' | 'declined') => {
    await updateAppointmentStatus(id, status);
    setAppointments(getAllAppointments()); // Refresh
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Pending</div>
          <div className="text-3xl font-bold text-yellow-600 mt-1">
            {appointments.filter(a => a.status === 'pending').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Accepted</div>
          <div className="text-3xl font-bold text-green-600 mt-1">
            {appointments.filter(a => a.status === 'accepted').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total</div>
          <div className="text-3xl font-bold text-[#0057FF] mt-1">
            {appointments.length}
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold text-gray-800 mb-4">All Appointments</h2>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No appointments found.</div>
        ) : (
          appointments.map(appt => (
            <Card key={appt.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0057FF]">
                  <UserIcon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{appt.studentName}</h3>
                  <div className="text-sm text-gray-500 font-mono mb-1">{appt.studentMatric}</div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-medium text-[#0057FF]">{appt.reason}</span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <Clock size={14} /> {appt.date} • {appt.time}
                    </span>
                  </div>
                  {appt.note && (
                    <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      "{appt.note}"
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {appt.status === 'pending' ? (
                  <>
                    <button 
                      onClick={() => handleAction(appt.id, 'accepted')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium text-sm transition-colors"
                    >
                      <Check size={16} /> Accept
                    </button>
                    <button 
                      onClick={() => handleAction(appt.id, 'declined')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium text-sm transition-colors"
                    >
                      <X size={16} /> Decline
                    </button>
                  </>
                ) : (
                  <span className={`px-4 py-2 rounded-lg text-sm font-bold capitalize ${
                    appt.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
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