import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, bookAppointment, getStudentAppointments } from '../services/api';
import { User, Appointment, REASONS_FOR_VISIT } from '../types';
import { Button, Input, Card } from '../components/Common';
import { Plus, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// --- Dashboard ---
export const StudentDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) navigate('/');
    else setUser(u);
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user.fullName.split(' ')[0]}</h2>
        <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
          Your opinion is valid. Your wellness matters. 
          Connect with your clinic easily.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quick Actions */}
        <div 
          onClick={() => navigate('/student/book')}
          className="bg-[#0057FF] rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20 cursor-pointer hover:bg-blue-700 transition-colors relative overflow-hidden group"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-bold mb-1">Book Appointment</h3>
            <p className="text-blue-100 text-xs">Schedule a visit with the doctor</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>

        <div 
          onClick={() => navigate('/student/history')}
          className="bg-white rounded-2xl p-6 text-gray-800 border border-gray-100 shadow-sm cursor-pointer hover:border-blue-200 transition-colors"
        >
           <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
              <Clock size={24} className="text-gray-600" />
            </div>
            <h3 className="text-lg font-bold mb-1">History</h3>
            <p className="text-gray-400 text-xs">View past appointments</p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3 border border-blue-100">
        <div className="p-2 bg-blue-100 rounded-lg text-[#0057FF]">
          <AlertCircle size={20} />
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 text-sm">Did you know?</h4>
          <p className="text-gray-600 text-xs mt-1">You can check your appointment status in real-time without visiting the clinic physically.</p>
        </div>
      </div>
    </div>
  );
};

// --- Book Appointment ---
export const BookAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    reason: REASONS_FOR_VISIT[0],
    date: '',
    time: '',
    note: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const user = getCurrentUser();
    if (!user) return navigate('/');

    try {
      await bookAppointment(user, formData);
      setSuccess(true);
      setTimeout(() => navigate('/student/dashboard'), 2000);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Appointment Submitted!</h2>
        <p className="text-gray-500 text-center max-w-xs">The doctor has been notified. Check your history for updates.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 mb-6">New Appointment</h2>
      <Card>
        <form onSubmit={handleSubmit}>
          <Input 
            label="Reason for visit" 
            as="select"
            value={formData.reason}
            onChange={e => setFormData({...formData, reason: e.target.value})}
            required
          >
            {REASONS_FOR_VISIT.map(r => <option key={r} value={r}>{r}</option>)}
          </Input>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Date" 
              type="date" 
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              required
            />
            <Input 
              label="Time" 
              type="time" 
              value={formData.time}
              onChange={e => setFormData({...formData, time: e.target.value})}
              required
            />
          </div>

          <Input 
            label="Notes (Optional)" 
            as="textarea"
            placeholder="Describe your symptoms..."
            value={formData.note}
            onChange={e => setFormData({...formData, note: e.target.value})}
          />

          <div className="mt-6">
            <Button type="submit" isLoading={loading}>
              Submit Appointment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

// --- History ---
export const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) navigate('/');
    else setAppointments(getStudentAppointments(user.id));
  }, [navigate]);

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 mb-6">My Appointments</h2>
      
      {appointments.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>No appointments yet.</p>
          <button onClick={() => navigate('/student/book')} className="text-[#0057FF] font-semibold mt-2">Book Now</button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map(appt => (
            <Card key={appt.id} className="p-5 flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-800">{appt.reason}</h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Clock size={14} />
                  {appt.date} at {appt.time}
                </p>
                {appt.note && <p className="text-xs text-gray-400 mt-2 line-clamp-1">{appt.note}</p>}
              </div>
              <div>
                {appt.status === 'pending' && <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">Pending</span>}
                {appt.status === 'accepted' && <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Accepted</span>}
                {appt.status === 'declined' && <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">Declined</span>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Coming Soon Placeholder ---
export const FutureFeature: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Clock size={32} className="text-gray-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-500 mt-2 max-w-xs">{subtitle}</p>
      <div className="mt-8 opacity-50 pointer-events-none grayscale blur-[1px]">
        {/* Fake Content for "Preview" */}
        <div className="w-64 h-20 bg-white rounded-xl mb-4 border border-gray-200"></div>
        <div className="w-64 h-20 bg-white rounded-xl mb-4 border border-gray-200"></div>
      </div>
      <span className="absolute mt-12 bg-black/80 text-white px-4 py-2 rounded-full text-xs font-bold tracking-wide">COMING SOON</span>
    </div>
  );
};