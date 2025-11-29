import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCurrentUser, bookAppointment, getStudentAppointments, 
  getLecturers, getVendors, submitReview, getReviews, deleteReview,
  saveCGPARecord, getStudentCGPARecords, updateStudentProfile
} from '../services/api';
import { User, Appointment, REASONS_FOR_VISIT, Lecturer, Vendor, Review, CGPARecord, Course } from '../types';
import { Button, Input, Card } from '../components/Common';
import { 
  Plus, Clock, CheckCircle, AlertCircle, Star, Trash2, 
  Calculator, User as UserIcon, Utensils, Save, X 
} from 'lucide-react';

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

  const FeatureCard = ({ icon: Icon, title, desc, path, colorClass }: any) => (
    <div 
      onClick={() => navigate(path)}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
    >
       <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${colorClass} group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
       </div>
       <h3 className="text-base font-bold text-gray-800 mb-1">{title}</h3>
       <p className="text-xs text-gray-400">{desc}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="text-center py-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to the Wellspring Student Smart App 🎓✨</h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
          We created this space to help you navigate school life with ease. 
          From clinic appointments to CGPA tracking — we've got you covered. 
          Your wellbeing matters. Your voice matters. You matter.
        </p>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <FeatureCard 
          icon={Plus} 
          title="Book Appointment" 
          desc="Connect with the clinic" 
          path="/student/book" 
          colorClass="bg-blue-50 text-[#0057FF]"
        />
        <FeatureCard 
          icon={Calculator} 
          title="CGPA Calculator" 
          desc="Track your grades" 
          path="/student/cgpa" 
          colorClass="bg-green-50 text-green-600"
        />
        <FeatureCard 
          icon={UserIcon} 
          title="Rate Lecturers" 
          desc="Share your feedback" 
          path="/student/lecturers-review" 
          colorClass="bg-purple-50 text-purple-600"
        />
        <FeatureCard 
          icon={Utensils} 
          title="Rate Vendors" 
          desc="Best food spots" 
          path="/student/food-review" 
          colorClass="bg-orange-50 text-orange-600"
        />
      </div>

      <div className="bg-blue-600 rounded-xl p-5 text-white flex items-center justify-between shadow-lg shadow-blue-500/20">
         <div>
           <h4 className="font-bold text-lg">Have you checked your health?</h4>
           <p className="text-blue-100 text-xs mt-1">Don't wait until it's an emergency.</p>
         </div>
         <Button 
            className="w-auto bg-white text-blue-600 hover:bg-blue-50 py-2 px-4 text-sm"
            onClick={() => navigate('/student/book')}
          >
            Book Now
         </Button>
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
      setTimeout(() => navigate('/student/history'), 2000);
    } catch (error) {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Appointment Submitted!</h2>
        <p className="text-gray-500 text-sm">The doctor has been notified. Check your history for updates.</p>
        <Button className="mt-6 w-auto" variant="outline" onClick={() => navigate('/student/dashboard')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Doctor Appointment Booking</h2>
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
            placeholder="Describe your symptoms briefly..."
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

// --- Appointment History ---
export const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      setAppointments(getStudentAppointments(user.id));
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Appointment History</h2>
      
      {appointments.length === 0 ? (
        <Card className="text-center py-10">
           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
             <Clock size={32} />
           </div>
           <p className="text-gray-500 font-medium">No appointments yet.</p>
           <p className="text-xs text-gray-400 mt-1">Book an appointment to see your history.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map(appt => (
            <Card key={appt.id} className="relative overflow-hidden">
               <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white rounded-bl-xl ${
                 appt.status === 'accepted' ? 'bg-green-500' : 
                 appt.status === 'declined' ? 'bg-red-500' : 'bg-yellow-500'
               }`}>
                 {appt.status}
               </div>

               <div className="pr-12">
                 <h3 className="font-bold text-gray-800 mb-1">{appt.reason}</h3>
                 <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                   <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(appt.date).toLocaleDateString()} at {appt.time}
                   </div>
                 </div>
                 
                 {appt.note && (
                   <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 italic">
                     "{appt.note}"
                   </div>
                 )}
                 
                 <div className="mt-3 text-[10px] text-gray-400 text-right">
                    Booked on {new Date(appt.createdAt).toLocaleDateString()}
                 </div>
               </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Review Component (Reusable) ---
const ReviewSection = ({ 
  type, 
  items, 
  title 
}: { 
  type: 'lecturer' | 'vendor', 
  items: (Lecturer | Vendor)[], 
  title: string 
}) => {
  const [selectedId, setSelectedId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const user = getCurrentUser();

  useEffect(() => {
    setRecentReviews(getReviews(type).slice(0, 5)); // Show last 5
  }, [type, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedId) return;
    setLoading(true);
    
    const target = items.find(i => i.id === selectedId);
    if (!target) return;

    await submitReview({
      studentId: user.id,
      targetId: target.id,
      targetName: target.name,
      type,
      rating,
      comment
    }, user.fullName);
    
    setLoading(false);
    setComment('');
    setSelectedId('');
    setRating(5);
    alert('Review Submitted Successfully!');
  };

  return (
    <div className="animate-fade-in space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <Card>
          <form onSubmit={handleSubmit}>
            <Input 
              label={`Select ${type === 'lecturer' ? 'Lecturer' : 'Vendor'}`}
              as="select" 
              value={selectedId} 
              onChange={e => setSelectedId(e.target.value)}
              required
            >
              <option value="">-- Select --</option>
              {items.map(i => (
                <option key={i.id} value={i.id}>{i.name} {type === 'lecturer' ? `(${(i as Lecturer).department})` : `(${(i as Vendor).location})`}</option>
              ))}
            </Input>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <Input 
              label="Comment" 
              as="textarea" 
              placeholder="Share your experience (Keep it respectful)..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              required
            />
            
            <Button type="submit" isLoading={loading} disabled={!selectedId}>Submit Review</Button>
          </form>
        </Card>
      </section>

      {/* Recent Reviews List (Optional display for student) */}
      <section>
        <h3 className="font-bold text-gray-700 mb-3">Recent Reviews</h3>
        <div className="space-y-3">
          {recentReviews.length === 0 ? (
            <p className="text-gray-400 text-sm italic">No reviews yet.</p>
          ) : (
            recentReviews.map(review => (
              <div key={review.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-800 text-sm">{review.targetName}</span>
                  <div className="flex text-yellow-400 text-xs">
                    {Array.from({length: review.rating}).map((_, i) => <span key={i}>★</span>)}
                  </div>
                </div>
                <p className="text-gray-600 text-xs mb-2">"{review.comment}"</p>
                <p className="text-[10px] text-gray-400">By {review.studentName} • {new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export const LecturerReview = () => {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  useEffect(() => setLecturers(getLecturers()), []);
  return <ReviewSection type="lecturer" items={lecturers} title="Review Lecturers" />;
};

export const VendorReview = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  useEffect(() => setVendors(getVendors()), []);
  return <ReviewSection type="vendor" items={vendors} title="Review Food Vendors" />;
};

// --- CGPA Calculator ---
export const CGPACalculator = () => {
  const [rows, setRows] = useState<Omit<Course, 'id'>[]>([{ code: '', units: 0, grade: 'A' }]);
  const [history, setHistory] = useState<CGPARecord[]>([]);
  const user = getCurrentUser();

  useEffect(() => {
    if (user) setHistory(getStudentCGPARecords(user.id));
  }, [user]);

  const addRow = () => setRows([...rows, { code: '', units: 0, grade: 'A' }]);
  
  const removeRow = (index: number) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const updateRow = (index: number, field: keyof Course, value: any) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  const calculate = async () => {
    if (!user) return;
    let totalPoints = 0;
    let totalUnits = 0;
    
    const gradePoints: Record<string, number> = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'F': 0 };

    rows.forEach(row => {
      const units = Number(row.units);
      if (units > 0) {
        totalPoints += (gradePoints[row.grade] * units);
        totalUnits += units;
      }
    });

    const gpa = totalUnits === 0 ? 0 : Number((totalPoints / totalUnits).toFixed(2));
    
    // Save to history
    await saveCGPARecord({
      studentId: user.id,
      semester: `Calculation ${history.length + 1}`,
      courses: rows as Course[],
      gpa
    });
    
    setHistory(getStudentCGPARecords(user.id));
    alert(`Your GPA is: ${gpa}`);
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 mb-6">CGPA Calculator</h2>
      
      <Card className="mb-8">
        <div className="space-y-3 mb-6">
          {rows.map((row, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input 
                placeholder="Course Code"
                className="flex-1 p-2 rounded-lg border border-gray-200 text-sm"
                value={row.code}
                onChange={e => updateRow(idx, 'code', e.target.value)}
              />
              <input 
                placeholder="Units"
                type="number"
                className="w-16 p-2 rounded-lg border border-gray-200 text-sm"
                value={row.units || ''}
                onChange={e => updateRow(idx, 'units', e.target.value)}
              />
              <select 
                className="w-16 p-2 rounded-lg border border-gray-200 text-sm bg-white"
                value={row.grade}
                onChange={e => updateRow(idx, 'grade', e.target.value)}
              >
                {['A','B','C','D','E','F'].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {rows.length > 1 && (
                <button onClick={() => removeRow(idx)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex gap-3">
          <Button variant="secondary" onClick={addRow} className="flex items-center gap-2">
            <Plus size={16} /> Add Course
          </Button>
          <Button onClick={calculate}>
             Calculate GPA
          </Button>
        </div>
      </Card>

      <h3 className="font-bold text-gray-700 mb-3">History</h3>
      <div className="space-y-3">
        {history.length === 0 && <p className="text-gray-400 text-sm">No calculations saved yet.</p>}
        {history.map(record => (
          <div key={record.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
             <div>
               <p className="font-bold text-gray-800">{record.semester}</p>
               <p className="text-xs text-gray-400">{new Date(record.createdAt).toLocaleDateString()}</p>
             </div>
             <div className="text-2xl font-bold text-[#0057FF]">{record.gpa}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Settings ---
export const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', profilePicUrl: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (u) {
      setUser(u);
      setFormData({
        fullName: u.fullName,
        phone: u.phoneNumber || '',
        email: u.email,
        profilePicUrl: u.profilePicUrl || ''
      });
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    await updateStudentProfile(user.id, {
      fullName: formData.fullName,
      phoneNumber: formData.phone,
      email: formData.email,
    });
    setLoading(false);
    alert('Profile Updated Successfully');
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Account Settings</h2>
      <Card>
        <form onSubmit={handleSave} className="space-y-2">
          <div className="flex justify-center mb-6">
             <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden relative group cursor-pointer">
               <img src={formData.profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-white text-xs font-bold">Change</span>
               </div>
             </div>
          </div>
          
          <Input label="Matric Number (Read Only)" value={user.matricNumber} disabled className="opacity-60" />
          <Input label="Department (Read Only)" value={user.department} disabled className="opacity-60" />
          
          <Input 
            label="Full Name" 
            value={formData.fullName} 
            onChange={e => setFormData({...formData, fullName: e.target.value})} 
          />
          <Input 
            label="Email" 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
          />
          <Input 
            label="Phone" 
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})} 
          />

          <Button type="submit" isLoading={loading} className="mt-4">
            <Save size={18} className="mr-2" /> Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
};
