import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const userProfile = await login(email, password);
      if (userProfile?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to login. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex w-1/2 bg-primary-600 flex-col justify-between p-12 text-white">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm font-medium backdrop-blur-sm border border-white/20">
            <Sparkles className="w-4 h-4" /> AI-Powered Learning
          </div>
          <div className="mt-20 max-w-md">
            <h1 className="text-5xl font-bold mb-6">EduAI</h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              Unlock your academic potential with personalized AI tutoring, real-time feedback, and intelligent study paths designed specifically for your curriculum.
            </p>
          </div>
        </div>
        <div className="relative mt-12 w-full max-w-md aspect-square bg-primary-700/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10">
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-lg font-medium">"My grades improved by 40% in one semester."</p>
              <p className="text-sm text-gray-300 mt-1">— Sarah J., Computer Science Major</p>
            </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
            <p className="text-gray-500 mt-2">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-sm text-primary-600 font-medium hover:text-primary-700">Forgot Password?</a>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Don't have an account? <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">Create Account</Link>
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-8 right-8 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-primary-700 transition">
        <Sparkles className="w-6 h-6" />
      </div>
    </div>
  );
};

export default LoginPage;
