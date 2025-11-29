import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginStudent, registerStudent } from '../services/api';
import { Button, Input, Card, Carousel } from '../components/Common';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [matric, setMatric] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration State
  const [regData, setRegData] = useState({
    fullName: '',
    matric: '',
    email: '',
    phone: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginStudent(matric, password);
      navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerStudent(regData);
      setIsRegistering(false); // Switch to login after success
      setError('');
      alert('Account created successfully! Please login.');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-start pt-6 pb-12 px-4 bg-[#F3F4F6]">
      <div className="w-full max-w-lg">
        {/* Branding Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
            Wellspring Smart App Project
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Your Digital Campus Companion
          </p>
        </div>

        {/* Carousel Component */}
        <Carousel />

        {/* Auth Card */}
        <Card className="shadow-xl border-0">
          <div className="flex mb-6 border-b border-gray-100">
            <button 
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${!isRegistering ? 'text-[#0057FF] border-b-2 border-[#0057FF]' : 'text-gray-400 hover:text-gray-600'}`}
              onClick={() => setIsRegistering(false)}
            >
              Login
            </button>
            <button 
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${isRegistering ? 'text-[#0057FF] border-b-2 border-[#0057FF]' : 'text-gray-400 hover:text-gray-600'}`}
              onClick={() => setIsRegistering(true)}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center animate-fade-in">
              {error}
            </div>
          )}

          {!isRegistering ? (
            <form onSubmit={handleLogin} className="animate-fade-in">
              <Input 
                label="Matric Number" 
                placeholder="e.g. COSC/62927"
                value={matric}
                onChange={e => setMatric(e.target.value)}
                required
              />
              <Input 
                label="Password" 
                type="password"
                placeholder="Surname (lowercase)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <div className="flex items-center justify-between mb-6">
                 <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded text-[#0057FF] focus:ring-[#0057FF]" />
                  Remember me
                </label>
              </div>
              <Button type="submit" isLoading={loading}>
                Access Student Portal
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="animate-fade-in space-y-1">
              <Input 
                label="Full Name" 
                placeholder="John Doe"
                value={regData.fullName}
                onChange={e => setRegData({...regData, fullName: e.target.value})}
                required
              />
              <Input 
                label="Matric Number" 
                placeholder="e.g. COSC/..."
                value={regData.matric}
                onChange={e => setRegData({...regData, matric: e.target.value})}
                required
              />
              <Input 
                label="Email" 
                type="email"
                placeholder="student@wellspring.edu.ng"
                value={regData.email}
                onChange={e => setRegData({...regData, email: e.target.value})}
                required
              />
              <Input 
                label="Phone" 
                type="tel"
                placeholder="080..."
                value={regData.phone}
                onChange={e => setRegData({...regData, phone: e.target.value})}
                required
              />
              <Input 
                label="Password" 
                type="password"
                placeholder="Create Password"
                value={regData.password}
                onChange={e => setRegData({...regData, password: e.target.value})}
                required
              />
              <div className="mb-4">
                 <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Profile Picture (Optional)</label>
                 <input type="file" className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
              </div>
              <Button type="submit" isLoading={loading}>
                Create Account
              </Button>
            </form>
          )}
        </Card>

        <div className="mt-8 text-center space-y-2">
          <p className="text-xs text-gray-400">Powered by Wellspring Smart Systems</p>
          <div className="flex gap-4 justify-center text-xs text-gray-400">
             <a href="#/doctor/login" className="hover:text-[#0057FF] underline">Doctor Login</a>
             <span>|</span>
             <a href="#/admin/login" className="hover:text-[#0057FF] underline">Admin Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};