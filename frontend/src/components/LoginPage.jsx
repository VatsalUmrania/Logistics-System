import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Truck, Package, BarChart3, MapPin, Clock, Shield,
  Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, 
  CheckCircle, AlertTriangle, User, Building, Star,
  Zap, Globe, Award, Home, Container, Anchor, Plane,
  Activity, TrendingUp, Users, Search
} from 'lucide-react';
import logo from '../assets/logo_lms-removebg-preview.jpg';

const LoginPage = () => {
  const navigate = useNavigate();

  // State management following AssignExpenses pattern
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

  // Animation state for dynamic elements
  const [animationState, setAnimationState] = useState({
    currentStat: 0,
    currentFeature: 0
  });

  // Handle caps lock detection (Best Practice)
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
    
    // Clear error when user starts typing (Best Practice)
    if (uiState.error) {
      setUiState(prev => ({ ...prev, error: '' }));
    }
  };

  // Form validation with clear error messages (Best Practice)
  const validateForm = () => {
    if (!formData.email) {
      setUiState(prev => ({ ...prev, error: 'Email address is required' }));
      return false;
    }
    if (!formData.email.includes('@')) {
      setUiState(prev => ({ ...prev, error: 'Please enter a valid email address' }));
      return false;
    }
    if (!formData.password) {
      setUiState(prev => ({ ...prev, error: 'Password is required' }));
      return false;
    }
    if (formData.password.length < 6) {
      setUiState(prev => ({ ...prev, error: 'Password must be at least 6 characters long' }));
      return false;
    }
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
        if (formData.rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        }
        setUiState(prev => ({ ...prev, successMessage: 'Login successful! Redirecting...' }));
        setTimeout(() => navigate('/home'), 1000);
      } else {
        setUiState(prev => ({ ...prev, error: 'Login failed: Invalid response from server' }));
      }

    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setUiState(prev => ({ ...prev, error: 'Invalid email or password. Please try again.' }));
      } else if (err.response?.status === 429) {
        setUiState(prev => ({ ...prev, error: 'Too many login attempts. Please try again later.' }));
      } else {
        setUiState(prev => ({ 
          ...prev, 
          error: err.response?.data?.message || 'Login failed. Please check your connection and try again.' 
        }));
      }
    } finally {
      setUiState(prev => ({ ...prev, loading: false }));
    }
  };

  // Load remembered email on component mount (Best Practice)
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }));
    }
  }, []);

  // Auto-rotate stats and features for dynamic content
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setAnimationState(prev => ({
        ...prev,
        currentStat: (prev.currentStat + 1) % logisticsStats.length
      }));
    }, 3000);

    const featuresInterval = setInterval(() => {
      setAnimationState(prev => ({
        ...prev,
        currentFeature: (prev.currentFeature + 1) % logisticsFeatures.length
      }));
    }, 4000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(featuresInterval);
    };
  }, []);

  // Logistics-specific data matching your project
  const logisticsStats = [
    { label: 'Active Shipments', value: '2,847', icon: Package, color: 'from-blue-500 to-cyan-500', trend: '+12%' },
    { label: 'Fleet Vehicles', value: '156', icon: Truck, color: 'from-green-500 to-emerald-500', trend: '+8%' },
    { label: 'Container Operations', value: '1,234', icon: Container, color: 'from-purple-500 to-pink-500', trend: '+15%' },
    { label: 'Port Connections', value: '45+', icon: Anchor, color: 'from-orange-500 to-red-500', trend: '+3%' },
    { label: 'On-Time Delivery', value: '98.2%', icon: Clock, color: 'from-indigo-500 to-purple-500', trend: '+2%' },
    { label: 'Client Satisfaction', value: '4.9/5', icon: Star, color: 'from-yellow-500 to-orange-500', trend: '+0.2' }
  ];

  const logisticsFeatures = [
    { 
      icon: BarChart3, 
      title: 'Real-time Analytics', 
      desc: 'Monitor shipments, track containers, and analyze performance with live dashboards.',
      highlight: 'Live Tracking'
    },
    { 
      icon: Shield, 
      title: 'Enterprise Security', 
      desc: 'Bank-grade encryption and compliance with international logistics security standards.',
      highlight: 'ISO Certified'
    },
    { 
      icon: Building, 
      title: 'Multi-Port Operations', 
      desc: 'Manage operations across multiple ports, warehouses, and distribution centers.',
      highlight: 'Global Network'
    },
    { 
      icon: Plane, 
      title: 'Multi-Modal Transport', 
      desc: 'Coordinate sea, air, and land transportation with integrated scheduling.',
      highlight: 'Smart Routes'
    },
    {
      icon: Users,
      title: 'Supplier Management',
      desc: 'Complete supplier lifecycle management with automated invoicing and tracking.',
      highlight: 'Automated'
    },
    {
      icon: TrendingUp,
      title: 'Business Intelligence',
      desc: 'Advanced analytics and forecasting tools to optimize your supply chain.',
      highlight: 'AI Powered'
    }
  ];

  const trustIndicators = [
    { icon: Shield, text: 'ISO 27001 Certified', color: 'text-green-400' },
    { icon: Award, text: 'Industry Leader 2025', color: 'text-yellow-400' },
    { icon: Globe, text: '45+ Countries', color: 'text-blue-400' },
    { icon: Activity, text: '99.9% Uptime SLA', color: 'text-purple-400' }
  ];

  const currentStat = logisticsStats[animationState.currentStat];
  const currentFeature = logisticsFeatures[animationState.currentFeature];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Exact same structure as AssignExpenses */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-indigo-600" />
              Secure Login Portal
            </h1>
            <p className="text-gray-600 mt-2">Access your logistics management dashboard</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center shadow-md"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </button>
          </div>
        </div>

        {/* Status Messages - Same as AssignExpenses */}
        {uiState.error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{uiState.error}</p>
            </div>
          </div>
        )}
        {uiState.successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-700">{uiState.successMessage}</p>
            </div>
          </div>
        )}

        {/* Caps Lock Warning - Best Practice */}
        {uiState.capsLockOn && uiState.passwordFocused && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
              <p className="text-yellow-700">Caps Lock is currently enabled</p>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Login Form (Same structure as AssignExpenses forms) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-indigo-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                LOGIN TO DASHBOARD
              </h2>
            </div>
            <div className="p-6">
              {/* Welcome Section */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <img src={logo} alt="Logo" className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gray-800">LogiFlow</span>
                    <p className="text-sm text-gray-600">Logistics Management</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome Back</h3>
                <p className="text-gray-600">Sign in to access your dashboard</p>
              </div>

              {/* Login Form - Same structure as AssignExpenses */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className={`h-5 w-5 transition-colors ${uiState.emailFocused ? 'text-indigo-500' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        onFocus={() => setUiState(prev => ({ ...prev, emailFocused: true }))}
                        onBlur={() => setUiState(prev => ({ ...prev, emailFocused: false }))}
                        required
                        disabled={uiState.loading}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                        placeholder="Enter your email address"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className={`h-5 w-5 transition-colors ${uiState.passwordFocused ? 'text-indigo-500' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type={uiState.showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        onFocus={() => setUiState(prev => ({ ...prev, passwordFocused: true }))}
                        onBlur={() => setUiState(prev => ({ ...prev, passwordFocused: false }))}
                        required
                        disabled={uiState.loading}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setUiState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-indigo-600 transition-colors"
                        disabled={uiState.loading}
                        tabIndex={-1}
                      >
                        {uiState.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Password must be at least 6 characters long
                    </div>
                  </div>
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="sr-only"
                      disabled={uiState.loading}
                    />
                    <div className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${
                      formData.rememberMe 
                        ? 'bg-indigo-600 border-indigo-600' 
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}>
                      {formData.rememberMe && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="ml-2 text-gray-700">Remember me</span>
                  </label>
                  <button 
                    type="button" 
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                    onClick={() => navigate('/forgot-password')}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={uiState.loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
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

              {/* Help Section */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-gray-500">Need help?</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button 
                    type="button"
                    className="p-3 text-xs text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all flex items-center justify-center space-x-1 border border-gray-200 hover:border-indigo-200"
                    onClick={() => navigate('/support')}
                  >
                    <User className="w-3 h-3" />
                    <span>Support</span>
                  </button>
                  <button 
                    type="button"
                    className="p-3 text-xs text-gray-600 hover:text-green-600 rounded-lg hover:bg-green-50 transition-all flex items-center justify-center space-x-1 border border-gray-200 hover:border-green-200"
                    onClick={() => navigate('/status')}
                  >
                    <Activity className="w-3 h-3" />
                    <span>Status</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Logistics Showcase (Same structure as AssignExpenses info panels) */}
          <div className="space-y-6">
            {/* Live Stats Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Live Operations Dashboard
                </h2>
              </div>
              <div className="p-6">
                {/* Featured Stat */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-4 transition-all duration-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${currentStat.color} rounded-2xl flex items-center justify-center`}>
                        <currentStat.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-800 mb-1">{currentStat.value}</div>
                        <div className="text-gray-600">{currentStat.label}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 text-sm font-medium">{currentStat.trend}</div>
                      <div className="text-gray-500 text-xs">vs last month</div>
                    </div>
                  </div>
                </div>

                {/* Mini Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {logisticsStats.slice(0, 3).map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all">
                        <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-2`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-lg font-bold text-gray-800">{stat.value}</div>
                        <div className="text-gray-600 text-xs">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Features Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700">Platform Features</h2>
              </div>
              <div className="p-6">
                {/* Dynamic Feature Showcase */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-4 transition-all duration-500">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <currentFeature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-800 text-lg">{currentFeature.title}</h3>
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                          {currentFeature.highlight}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{currentFeature.desc}</p>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-2 gap-3">
                  {trustIndicators.map((indicator, index) => {
                    const Icon = indicator.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Icon className={`w-5 h-5 ${indicator.color}`} />
                        <span className="text-gray-700 text-sm font-medium">{indicator.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 space-y-2">
          <div className="flex items-center justify-center space-x-2 p-3 bg-white rounded-lg border border-gray-200">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Secure logistics management platform</span>
          </div>
          <p>© {new Date().getFullYear()} LogiFlow Systems. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <button className="hover:text-indigo-600 transition-colors">Privacy Policy</button>
            <span>•</span>
            <button className="hover:text-indigo-600 transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
