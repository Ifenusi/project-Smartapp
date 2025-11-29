import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import { logout } from '../services/api';
import { 
  Menu, X, Home, Calendar, BookOpen, Utensils, 
  Calculator, Settings, LogOut, User as UserIcon, Bell 
} from 'lucide-react';

// --- Colors ---
// Primary Blue: #0057FF (bg-[#0057FF])
// Soft Gray: #F3F4F6 (bg-gray-100)
// White: #FFFFFF (bg-white)

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
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/student/dashboard' },
    { icon: Calendar, label: 'Book Appointment', path: '/student/book' },
    { icon: BookOpen, label: 'History', path: '/student/history' },
    { icon: UserIcon, label: 'Review Lecturers', path: '/student/lecturers-review' },
    { icon: Utensils, label: 'Food Vendors', path: '/student/food-review' },
    { icon: Calculator, label: 'CGPA Calculator', path: '/student/cgpa' },
    { icon: Settings, label: 'Settings', path: '/student/settings' },
  ];

  if (!user) {
    return <div className="min-h-screen bg-[#F3F4F6]">{children}</div>;
  }

  // Doctor Layout is simpler as per brief
  if (user.role === 'doctor') {
    return (
      <div className="min-h-screen bg-[#F3F4F6]">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Doctor Dashboard</h1>
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 font-medium text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    );
  }

  // Student Layout
  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Top Bar */}
      <header className="bg-white sticky top-0 z-20 shadow-sm/50">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg active:scale-95 transition-transform"
            >
              <Menu size={24} />
            </button>
            <h1 className="font-bold text-lg text-gray-800 truncate max-w-[150px] sm:max-w-none">
              {title || 'Student Smart App'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="text-gray-400 hover:text-gray-600">
               <Bell size={20} />
             </button>
             <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
               <img src={user.profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-20 max-w-lg mx-auto md:max-w-2xl lg:max-w-4xl">
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
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0057FF]">Menu</h2>
                <p className="text-xs text-gray-400">Student Smart App</p>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-[#0057FF]' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={18} className={isActive ? 'text-[#0057FF]' : 'text-gray-400'} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-100">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
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