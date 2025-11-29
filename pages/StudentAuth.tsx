import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginStudent, registerStudent } from '../services/api';
import { Button, Input, Card } from '../components/Common';

export const StudentLogin = () => {
  const navigate = useNavigate();
  const [matric, setMatric] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white sm:bg-[#F3F4F6]">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#0057FF] rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Smart App</h1>
          <p className="text-gray-500">Your digital campus companion</p>
        </div>

        <Card className="shadow-none sm:shadow-lg border-none sm:border">
          <form onSubmit={handleSubmit}>
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
              <Link to="/register" className="text-sm font-semibold text-[#0057FF] hover:underline">
                Create Account
              </Link>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={loading}>
              Login
            </Button>
          </form>
        </Card>

        <div className="mt-8 text-center text-xs text-gray-400">
          Powered by Student Smart Systems
          <div className="mt-2">
            <Link to="/doctor/login" className="text-gray-300 hover:text-gray-500 underline">
              Doctor Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StudentRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    matric: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // In a real app, handle file upload for profile pic here
      await registerStudent(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white sm:bg-[#F3F4F6]">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Create Account</h2>
        
        <Card className="shadow-none sm:shadow-lg border-none sm:border">
          <form onSubmit={handleSubmit} className="space-y-1">
            <Input 
              label="Full Name" 
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <Input 
              label="Matric Number" 
              name="matric"
              placeholder="COSC/..."
              value={formData.matric}
              onChange={handleChange}
              required
            />
            <Input 
              label="Email" 
              type="email"
              name="email"
              placeholder="student@wellspring.edu.ng"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input 
              label="Phone Number" 
              type="tel"
              name="phone"
              placeholder="080..."
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input 
              label="Password" 
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            
            <div className="mb-6">
               <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Profile Picture</label>
               <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={loading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-[#0057FF]">
              Already have an account? Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};