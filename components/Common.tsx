import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import { logout } from '../services/api';
import { 
  Menu, X, Home, Calendar, BookOpen, Utensils, 
  Calculator, Settings, LogOut, User as UserIcon, Bell,
  ChevronDown, ExternalLink, GraduationCap, ClipboardList,
  Activity, Users, FileText, LayoutDashboard, Database, Shield
} from 'lucide-react';

// --- Colors ---
// Primary Blue: #0057FF (bg-[#0057FF])
// Soft Gray: #F3F4F6 (bg-gray-100)
// White: #FFFFFF (bg-white)

// --- Carousel Component ---
const CAROUSEL_SLIDES = [
  { text: "No let your CGPA reach red before you serious oo.", sub: "Stay focused, stay sharp." },
  { text: "Be productive when you can. Rest when you must.", sub: "Balance is key to wellness." },
  { text: "Relate with others with love and respect.", sub: "We rise by lifting others." },
  { text: "Remember: we all came from different backgrounds — be kind.", sub: "Empathy builds community." },
  { text: "Small consistency > big procrastination.", sub: "Start small, keep going." }
];

export const Carousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#0057FF] text-white rounded-2xl p-8 mb-8 relative overflow-hidden shadow-lg shadow-blue-500/20">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
      
      <div className="relative z-10 h-[140px] flex flex-col items-center justify-center text-center transition-all duration-500">
        <h2 key={`head-${current}`} className="text-xl md:text-2xl font-bold mb-3 animate-fade-in leading-snug">
          "{CAROUSEL_SLIDES[current].text}"
        </h2>
        <p key={`sub-${current}`} className="text-blue-100 text-sm md:text-base animate-fade-in">
          — {CAROUSEL_SLIDES[current].sub}
        </p>
      </div>

      <div className="flex justify-center gap-2 mt-4 relative z-10">
        {CAROUSEL_SLIDES.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === current ? 'bg-white w-6' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', className = '', isLoading, disabled, ...props 
}) => {
  const baseStyles = "w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#0057FF] text-white hover:bg-blue-700 shadow-[#0057FF]/30 hover:shadow-lg",
    secondary: "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    outline: "bg-transparent border-2 border-[#0057FF] text-[#0057FF] hover:bg-blue-50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  as?: 'input' | 'select' | 'textarea';
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', as = 'input', ...props }) => {
  const baseInputStyles = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#0057FF] focus:ring-4 focus:ring-[#0057FF]/10 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400";
  
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">{label}</label>
      {as === 'select' ? (
        <select className={baseInputStyles} {...(props as any)}>
            {props.children}
        </select>
      ) : as === 'textarea' ? (
        <textarea className={`${baseInputStyles} min-h-[100px] resize-y`} {...(props as any)} />
      ) : (
        <input className={baseInputStyles} {...(props as any)} />
      )}
      {error && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{error}</p>}
    </div>
  );
};

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
    {children}
  </div>
);

// --- Layout & Sidebar ---
interface LayoutProps {
  user: User | null;
  children: React.ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ user, children, title }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const studentMenuItems = [
    { icon: Home, label: 'Home', path: '/student/dashboard' },
    { icon: Calendar, label: 'Book Appointment', path: '/student/book' },
    { icon: Calculator, label: 'Calculate CGPA', path: '/student/cgpa' },
    { icon: UserIcon, label: 'Review Lecturers', path: '/student/lecturers-review' },
    { icon: Utensils, label: 'Review Food Vendors', path: '/student/food-review' },
    { icon: Settings, label: 'Settings', path: '/student/settings' },
  ];

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Overview Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Students Management', path: '/admin/dashboard?tab=students' },
    { icon: Calendar, label: 'Appointments', path: '/admin/dashboard?tab=appointments' },
    { icon: FileText, label: 'Reviews', path: '/admin/dashboard?tab=reviews' },
    { icon: Calculator, label: 'CGPA Records', path: '/admin/dashboard?tab=cgpa' },
    { icon: Settings, label: 'System Settings', path: '/admin/dashboard?tab=settings' },
    { icon: Activity, label: 'System Logs', path: '/admin/dashboard?tab=logs' },
  ];

  const doctorMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/doctor/dashboard' },
    { icon: Calendar, label: 'Incoming Appointments', path: '/doctor/dashboard?tab=requests' },
    { icon: ClipboardList, label: 'Medical Notes', path: '/doctor/dashboard?tab=notes', badge: 'Soon' },
    { icon: Settings, label: 'Settings', path: '/doctor/dashboard?tab=settings' },
  ];

  let menuItems = studentMenuItems;
  if (user?.role === 'admin') menuItems = adminMenuItems;
  if (user?.role === 'doctor') menuItems = doctorMenuItems;

  // Render Navbar for Logged Out State (Unified Login)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F3F4F6]">
        <header className="bg-white sticky top-0 z-20 shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo Left */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0057FF]">
                 <GraduationCap size={24} />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-gray-900 text-sm leading-tight">WELLSPRING</h1>
                <p className="text-[10px] text-gray-500 font-medium tracking-wider">UNIVERSITY</p>
              </div>
            </div>
          </div>
        </header>
        {children}
      </div>
    );
  }

  const roleLabels = {
    student: 'Student Portal',
    doctor: 'Doctor Panel',
    admin: 'Admin Console'
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Top Bar (Authenticated) */}
      <header className="bg-white sticky top-0 z-20 shadow-sm/50">
        <div className="flex items-center justify-between px-4 h-16 max-w-7xl mx-auto w-full">
          
          {/* Left: Hamburger & Menu */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg active:scale-95 transition-transform"
            >
              <Menu size={24} />
            </button>
            <h1 className="font-bold text-lg text-gray-800 truncate flex items-center gap-2">
              {user.role === 'admin' && <Shield size={18} className="text-blue-600"/>}
              {title || roleLabels[user.role]}
            </h1>
          </div>
          
          {/* Right: Profile Dropdown */}
          <div className="flex items-center gap-3" ref={profileRef}>
             <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 hidden sm:block">
               <Bell size={20} />
             </button>
             
             <div className="relative">
               <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-2 rounded-full border border-transparent hover:border-gray-200 transition-all"
               >
                 <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-100 relative">
                   <img src={user.profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                 </div>
                 {user.role === 'doctor' && (
                    <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                 )}
                 <ChevronDown size={14} className="text-gray-400" />
               </button>

               {/* Profile Dropdown Menu */}
               {isProfileOpen && (
                 <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in z-50">
                   <div className="px-4 py-3 border-b border-gray-100 mb-2">
                     <p className="font-bold text-gray-800 truncate">{user.fullName}</p>
                     <p className="text-xs text-gray-500 truncate capitalize">{user.role}</p>
                   </div>
                   
                   {user.role === 'student' && (
                     <>
                       <button onClick={() => { navigate('/student/settings'); setIsProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#0057FF] flex items-center gap-2">
                         <Settings size={16} /> Account Settings
                       </button>
                       <button onClick={() => { navigate('/student/history'); setIsProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#0057FF] flex items-center gap-2">
                         <Calendar size={16} /> Appointment History
                       </button>
                     </>
                   )}

                   {user.role === 'admin' && (
                     <button onClick={() => { navigate('/admin/dashboard?tab=settings'); setIsProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#0057FF] flex items-center gap-2">
                       <Settings size={16} /> System Settings
                     </button>
                   )}
                   
                   <div className="my-2 border-t border-gray-100" />
                   <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                     <LogOut size={16} /> Logout
                   </button>
                 </div>
               )}
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-20 max-w-4xl mx-auto">
        {children}
      </main>

      {/* Sidebar Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="relative w-[280px] h-full bg-white shadow-2xl flex flex-col animate-slide-in-left">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-blue-50">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-[#0057FF] flex items-center justify-center text-white">
                    <GraduationCap size={18} />
                 </div>
                 <div>
                    <h2 className="text-sm font-bold text-gray-900">WELLSPRING</h2>
                    <p className="text-[10px] text-gray-500">SMART APP PROJECT</p>
                 </div>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname + location.search === item.path;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.path.includes('?')) {
                        navigate(item.path);
                      } else {
                        navigate(item.path);
                      }
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-[#0057FF]' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={18} className={isActive ? 'text-[#0057FF]' : 'text-gray-400'} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {/* @ts-ignore */}
                    {item.badge && (
                      <span className="px-2 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded-full font-bold">
                        {/* @ts-ignore */}
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors border border-red-100 bg-white"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};