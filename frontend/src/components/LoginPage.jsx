

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { authService } from '../services/api';
// import logo from '../assets/logo_lms-removebg-preview.jpg';

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
    
//     try {
//       const credentials = {
//         email: formData.email,
//         password: formData.password
//       };
      
//       const response = await authService.login(credentials);
      
//       // Handle remember me
//       if (formData.rememberMe) {
//         localStorage.setItem('token', response.data.token);
//         localStorage.setItem('user', JSON.stringify(response.data.user));
//       } else {
//         sessionStorage.setItem('token', response.data.token);
//         sessionStorage.setItem('user', JSON.stringify(response.data.user));
//       }
      
//       navigate('/home');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
//       {/* Header */}
//       <header className="w-full py-6 px-6">
//         <Link to="/" className="flex items-center space-x-3 w-fit">
//           <div className="relative">
//               <img src={logo} alt="logo" className="w-11 h-11" />
//           </div>
//           <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
//             Logistics Management System
//           </span>
//         </Link>
//       </header>

//       {/* Main Content */}
//       <main className="flex-grow flex items-center justify-center px-6 py-12">
//         <div className="w-full max-w-md">
//           {/* Error Popup */}
//           {error && (
//             <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
//               <svg 
//                 className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" 
//                 fill="none" 
//                 stroke="currentColor" 
//                 viewBox="0 0 24 24"
//               >
//                 <path 
//                   strokeLinecap="round" 
//                   strokeLinejoin="round" 
//                   strokeWidth={2} 
//                   d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
//                 />
//               </svg>
//               <span>{error}</span>
//             </div>
//           )}

//           {/* Login Card */}
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
//             {/* Header */}
//             <div className="text-center mb-8">
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
//               <p className="text-gray-600">Enter your credentials to access your account</p>
//             </div>

//             {/* Login Form */}
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Email Field */}
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
//                     placeholder="Enter your email"
//                     required
//                     disabled={loading}
//                   />
//                   <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     id="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
//                     placeholder="Enter your password"
//                     required
//                     disabled={loading}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 flex items-center pr-3"
//                     disabled={loading}
//                   >
//                     {showPassword ? (
//                       <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                       </svg>
//                     ) : (
//                       <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                       </svg>
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Remember Me & Forgot Password */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="rememberMe"
//                     name="rememberMe"
//                     checked={formData.rememberMe}
//                     onChange={handleInputChange}
//                     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600/20"
//                     disabled={loading}
//                   />
//                   <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
//                     Remember me
//                   </label>
//                 </div>
//                 <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
//                   Forgot password?
//                 </Link>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-3 px-4 text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
//               >
//                 <span>{loading ? 'Signing In...' : 'Sign In'}</span>
//                 {!loading && (
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                   </svg>
//                 )}
//               </button>

//               {/* Divider */}
//               <div className="relative my-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-200"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">Or continue with</span>
//                 </div>
//               </div>

//               {/* Social Login Buttons */}
//               <div className="grid grid-cols-2 gap-4">
//                 <button
//                   type="button"
//                   className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                   disabled={loading}
//                 >
//                   <div className="bg-gray-200 border-2 border-dashed rounded-xl w-5 h-5 mr-2" />
//                   <span className="text-sm text-gray-700">Google</span>
//                 </button>
//                 <button
//                   type="button"
//                   className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                   disabled={loading}
//                 >
//                   <div className="bg-gray-200 border-2 border-dashed rounded-xl w-5 h-5 mr-2" />
//                   <span className="text-sm text-gray-700">Microsoft</span>
//                 </button>
//               </div>
//             </form>

//             {/* Sign Up Link */}
//             <p className="mt-8 text-center text-sm text-gray-600">
//               Don't have an account?{' '}
//               <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
//                 Sign up now
//               </Link>
//             </p>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="py-6 text-center text-gray-600 text-sm">
//         <p>&copy; {new Date().getFullYear()} Logistics Management System. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState } from 'react';
import { Truck, Package, BarChart3, MapPin, Clock, Shield, Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import logo from '../assets/logo_lms-removebg-preview.jpg';
const LogisticsLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    userType: 'dispatcher'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (formData.email && formData.password) {
        setError('');
        console.log('Login successful!', formData);
        // Here you would normally navigate based on user type
      } else {
        setError('Please fill in all required fields');
      }
      setLoading(false);
    }, 1500);
  };

  const userTypes = [
    { value: 'dispatcher', label: 'Dispatcher', icon: MapPin },
    { value: 'driver', label: 'Driver', icon: Truck },
    { value: 'warehouse', label: 'Warehouse', icon: Package },
    { value: 'manager', label: 'Manager', icon: BarChart3 }
  ];

  const stats = [
    { label: 'Active Shipments', value: '2,847', icon: Package },
    { label: 'Fleet Vehicles', value: '156', icon: Truck },
    { label: 'On-Time Delivery', value: '98.2%', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Left Panel - Branding & Stats */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white/20 rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border-2 border-white/20 rounded-lg rotate-45"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 border-2 border-white/20 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 border-2 border-white/20 rounded-lg rotate-12"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo and Title */}
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                <div className="relative">
//               <img src={logo} alt="logo" className="w-11 h-11" />
//           </div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Logistics Management System</h1>
                <p className="text-blue-200 text-sm">Supply Chain Excellence</p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Streamline Your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Logistics Operations
                </span>
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Manage shipments, track deliveries, optimize routes, and coordinate your entire supply chain from one powerful platform.
              </p>
            </div>
          </div>

          {/* Live Stats */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-100">Live Operations Dashboard</h3>
            <div className="grid gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-blue-200 text-sm">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">LogiFlow</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Access your logistics control center</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <Shield className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <div className="space-y-6">
            {/* User Type Selection */}
            {/* <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {userTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <label key={type.value} className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value={type.value}
                        checked={formData.userType === type.value}
                        onChange={handleInputChange}
                        className="sr-only"
                        disabled={loading}
                      />
                      <div className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                        formData.userType === type.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}>
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div> */}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white disabled:bg-gray-50"
                  placeholder="Enter your work email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white disabled:bg-gray-50"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="sr-only"
                  disabled={loading}
                />
                <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                  formData.rememberMe 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-gray-300 bg-white group-hover:border-gray-400'
                }`}>
                  {formData.rememberMe && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">Keep me signed in</span>
              </label>
              <button type="button" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                Reset Password
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
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
          </div>

          {/* Additional Options */}
          <div className="mt-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Need assistance?</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <button className="text-sm text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                Contact IT Support
              </button>
              <button className="text-sm text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                System Status
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>Secure enterprise logistics platform</p>
            <p className="mt-1">© {new Date().getFullYear()} LogiFlow Systems. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsLogin;