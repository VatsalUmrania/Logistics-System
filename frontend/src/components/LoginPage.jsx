import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Lock, Eye, EyeOff, Mail, ArrowRight, Loader2,
  CheckCircle, AlertTriangle, User, Activity, Shield, Home
} from 'lucide-react';
import logo from '../assets/logo_lms-removebg-preview.jpg';

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [uiState, setUiState] = useState({
    showPassword: false,
    loading: false,
    error: '',
    successMessage: '',
    capsLockOn: false,
    passwordFocused: false,
    emailFocused: false
  });

  const handleKeyPress = (e) => {
    const capsLock = e.getModifierState && e.getModifierState('CapsLock');
    setUiState(prev => ({ ...prev, capsLockOn: capsLock }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (uiState.error) {
      setUiState(prev => ({ ...prev, error: '' }));
    }
  };

  const validateForm = () => {
    if (!formData.email) return setUiState(prev => ({ ...prev, error: 'Email address is required' })) && false;
    if (!formData.email.includes('@')) return setUiState(prev => ({ ...prev, error: 'Enter a valid email address' })) && false;
    if (!formData.password) return setUiState(prev => ({ ...prev, error: 'Password is required' })) && false;
    if (formData.password.length < 6) return setUiState(prev => ({ ...prev, error: 'Password must be at least 6 characters' })) && false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setUiState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email: formData.email,
        password: formData.password
      });

      const { data } = res.data;

      if (data?.token) {
        localStorage.setItem('authToken', data.token);
        if (formData.rememberMe) localStorage.setItem('rememberedEmail', formData.email);
        setUiState(prev => ({ ...prev, successMessage: 'Login successful! Redirecting...' }));
        setTimeout(() => navigate('/home'), 1000);
      } else {
        setUiState(prev => ({ ...prev, error: 'Invalid response from server' }));
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setUiState(prev => ({ ...prev, error: 'Invalid email or password' }));
      } else {
        setUiState(prev => ({
          ...prev,
          error: err.response?.data?.message || 'Login failed. Please try again.'
        }));
      }
    } finally {
      setUiState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex justify-center items-center">
            <Shield className="w-6 h-6 text-indigo-600 mr-2" />
            Secure Login Portal
          </h1>
          <p className="text-gray-600 mt-1">Access your logistics dashboard</p>
        </div>

        {/* Error */}
        {uiState.error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {uiState.error}
          </div>
        )}

        {/* Success */}
        {uiState.successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 rounded mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {uiState.successMessage}
          </div>
        )}

        {/* Caps Lock Warning */}
        {uiState.capsLockOn && uiState.passwordFocused && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-3 rounded mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Caps Lock is on
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-2">
              <img src={logo} alt="Logo" className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className={`absolute left-3 top-3.5 w-5 h-5 ${uiState.emailFocused ? 'text-indigo-500' : 'text-gray-400'}`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  onFocus={() => setUiState(prev => ({ ...prev, emailFocused: true }))}
                  onBlur={() => setUiState(prev => ({ ...prev, emailFocused: false }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={uiState.loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <Lock className={`absolute left-3 top-3.5 w-5 h-5 ${uiState.passwordFocused ? 'text-indigo-500' : 'text-gray-400'}`} />
                <input
                  type={uiState.showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  onFocus={() => setUiState(prev => ({ ...prev, passwordFocused: true }))}
                  onBlur={() => setUiState(prev => ({ ...prev, passwordFocused: false }))}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={uiState.loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-indigo-600"
                  onClick={() => setUiState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                  disabled={uiState.loading}
                >
                  {uiState.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            {/* Remember & Forgot */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={uiState.loading}
                  className="mr-2"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-indigo-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={uiState.loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all flex justify-center items-center space-x-2"
            >
              {uiState.loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Help Links */}
          <div className="mt-6 text-sm text-center space-x-4">
            <button
              onClick={() => navigate('/support')}
              className="text-gray-600 hover:text-indigo-600"
            >
              <User className="inline w-4 h-4 mr-1" />
              Support
            </button>
            <button
              onClick={() => navigate('/status')}
              className="text-gray-600 hover:text-green-600"
            >
              <Activity className="inline w-4 h-4 mr-1" />
              System Status
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Secure logistics platform</span>
          </div>
          <p className="mt-1">© {new Date().getFullYear()} LogiFlow Systems. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
