import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import { logout } from '../services/api';
import { 
  Menu, X, Home, Calendar, BookOpen, Utensils, 
  Calculator, Settings, LogOut, User as UserIcon, Bell,
  ChevronDown, ExternalLink, GraduationCap, ClipboardList,
  Activity, Users, FileText, LayoutDashboard, Database, Shield, Globe, Plus, Clock
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
      
      <div className="relative z-10 h-[100px] flex flex-col items-center justify-center text-center transition-all duration-500">
        <h2 key={`head-${current}`} className="text-xl md:text-2xl font-bold mb-3 animate-fade-in leading-snug">
          "{CAROUSEL_SLIDES[current].text}"
        </h2>
        <p key={`sub-${current}`} className="text-blue-200 text-sm animate-fade-in">
          — {CAROUSEL_SLIDES[current].sub}
        </p>
      </div>
      
      {/* Dots */}
      <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2">
        {CAROUSEL_SLIDES.map((_, i) => (
          <div 
            key={i} 
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-4' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
};

// --- Reusable UI Components ---
export const Button = ({ children, onClick, variant = 'primary', className = '', isLoading = false, type = 'button', disabled = false }: any) => {
  const baseStyle = "w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-[#0057FF] text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20",
    secondary: "bg-gray-900 text-white hover:bg-gray-800",
    outline: "bg-transparent border-2 border-gray-200 text-gray-600 hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };

  return (
    <button 
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  );
};

export const Input = ({ label, type = "text", as = "input", children, className = "", ...props }: any) => (
  <div className={`mb-4 ${className}`}>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">{label}</label>}
    {as === "select" ? (
       <div className="relative">
         <select className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#0057FF] outline-none transition-all appearance-none text-gray-700 font-medium text-sm" {...props}>
           {children}
         </select>
         <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
       </div>
    ) : as === "textarea" ? (
      <textarea className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#0057FF] outline-none transition-all text-gray-700 font-medium text-sm min-h-[100px] resize-y" {...props} />
    ) : (
      <input type={type} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#0057FF] outline-none transition-all text-gray-700 font-medium text-sm" {...props} />
    )}
  </div>
);

export const Card = ({ children, className = "", title, action }: any) => (
  <div className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm ${className}`}>
    {(title || action) && (
      <div className="flex justify-between items-center mb-6">
        {title && <h3 className="font-bold text-gray-800 text-lg">{title}</h3>}
        {action}
      </div>
    )}
    {children}
  </div>
);

// --- Layout & Sidebar ---

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  external?: boolean;
}

const STUDENT_ITEMS: MenuItem[] = [
  { icon: Home, label: 'Home', path: '/student/dashboard' },
  { icon: Plus, label: 'Book Appointment', path: '/student/book' },
  { icon: Clock, label: 'History', path: '/student/history' },
  { icon: FileText, label: 'Lecturer Review', path: '/student/lecturers-review' },
  { icon: Utensils, label: 'Vendor Review', path: '/student/food-review' },
  { icon: Calculator, label: 'CGPA Calculator', path: '/student/cgpa' },
  { icon: Settings, label: 'Settings', path: '/student/settings' },
  { icon: Globe, label: 'Official Website', path: 'https://wellspringuniversity.edu.ng/', external: true },
  { icon: ExternalLink, label: 'Student Portal', path: 'https://studentportal.wellspringuniversity.app/login', external: true },
];

const DOCTOR_ITEMS: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor/dashboard' },
  { icon: Calendar, label: 'Requests', path: '/doctor/dashboard?tab=requests' },
  { icon: Clock, label: 'History', path: '/doctor/dashboard?tab=history' },
];

const ADMIN_ITEMS: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
  { icon: Users, label: 'Students', path: '/admin/dashboard?tab=students' },
  { icon: Calendar, label: 'Appointments', path: '/admin/dashboard?tab=appointments' },
  { icon: ClipboardList, label: 'Reviews', path: '/admin/dashboard?tab=reviews' },
  { icon: GraduationCap, label: 'CGPA Records', path: '/admin/dashboard?tab=cgpa' },
  { icon: Settings, label: 'Settings', path: '/admin/dashboard?tab=settings' },
  { icon: Database, label: 'Logs', path: '/admin/dashboard?tab=logs' },
];

export const Layout = ({ children, user, title }: { children: React.ReactNode, user: User | null, title?: string }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return <>{children}</>;

  const menuItems: MenuItem[] = user.role === 'doctor' ? DOCTOR_ITEMS : user.role === 'admin' ? ADMIN_ITEMS : STUDENT_ITEMS;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigation = (item: any) => {
    if (item.external) {
      window.open(item.path, '_blank');
    } else {
      navigate(item.path);
    }
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-full w-[280px] bg-white border-r border-gray-200 z-50 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
         <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-10 px-2">
               <div className="w-10 h-10 bg-[#0057FF] rounded-xl flex items-center justify-center text-white">
                  <GraduationCap size={20} />
               </div>
               <div>
                  <h1 className="font-black text-gray-900 leading-none">WELLSPRING</h1>
                  <p className="text-[10px] font-bold text-[#0057FF] tracking-widest mt-1">SMART APP</p>
               </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
               <div className="px-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Menu</div>
               {menuItems.map((item) => {
                 const isActive = !item.external && location.pathname === item.path.split('?')[0];
                 return (
                   <button
                     key={item.label}
                     onClick={() => handleNavigation(item)}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                       isActive 
                         ? 'bg-[#0057FF] text-white shadow-lg shadow-blue-500/30' 
                         : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                     }`}
                   >
                     <item.icon size={18} />
                     {item.label}
                     {item.external && <ExternalLink size={14} className="ml-auto opacity-50" />}
                   </button>
                 );
               })}
            </nav>

            <div className="pt-6 border-t border-gray-100 mt-4">
               <div className="flex items-center gap-3 px-2 mb-4">
                  <img src={user.profilePicUrl} alt="" className="w-10 h-10 rounded-full bg-gray-100 object-cover" />
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-bold text-gray-900 truncate">{user.fullName}</p>
                     <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
               </div>
               <button 
                 onClick={handleLogout}
                 className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
               >
                 <LogOut size={18} />
                 Logout
               </button>
            </div>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
         {/* Top Header */}
         <header className="sticky top-0 z-30 bg-[#F3F4F6]/80 backdrop-blur-md px-4 sm:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-600 hover:bg-white rounded-lg lg:hidden">
                  <Menu size={24} />
               </button>
               <h2 className="text-xl font-bold text-gray-800 hidden sm:block">
                  {title || (user.role === 'student' ? `Hi, ${user.fullName.split(' ')[0]} 👋` : 'Dashboard')}
               </h2>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="relative">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full absolute top-1.5 right-2 border-2 border-[#F3F4F6]"></div>
                  <button className="p-2.5 bg-white text-gray-400 hover:text-[#0057FF] rounded-xl shadow-sm border border-gray-200 transition-colors">
                     <Bell size={20} />
                  </button>
               </div>
               {/* Profile Top Right Link */}
               <button 
                 onClick={() => navigate(user.role === 'student' ? '/student/settings' : '#')}
                 className="hidden sm:flex items-center gap-2 pl-2 pr-4 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm hover:border-blue-200 transition-colors"
               >
                 <img src={user.profilePicUrl} alt="" className="w-8 h-8 rounded-full bg-gray-100" />
                 <span className="text-xs font-bold text-gray-700">Profile</span>
               </button>
            </div>
         </header>

         {/* Content Area */}
         <div className="px-4 sm:px-8 pb-10 max-w-7xl mx-auto">
            {children}
            
            {/* Footer */}
            <footer className="mt-20 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-400 text-xs font-medium">© 2025 Wellspring University — SmartApp System</p>
            </footer>
         </div>
      </main>
    </div>
  );
};