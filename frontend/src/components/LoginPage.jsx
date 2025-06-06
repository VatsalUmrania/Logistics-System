

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
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
 // ✅ Make sure this is correctly implemented
import logo from '../assets/logo_lms-removebg-preview.jpg';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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

    try {
      const credentials = {
        email: formData.email,
        password: formData.password
      };

      const response = await authService.login(credentials);

      const { token, user } = response.data;

      if (formData.rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
      }

      navigate('/home');
    } catch (err) {
      const message =
        err?.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-6">
        <Link to="/" className="flex items-center space-x-3 w-fit">
          <img src={logo} alt="logo" className="w-11 h-11" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Logistics Management System
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
              <p className="text-gray-600">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600/20"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                {!loading && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </button>

              {/* Social Login - Placeholder */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" disabled={loading}>
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-5 h-5 mr-2" />
                  <span className="text-sm text-gray-700">Google</span>
                </button>
                <button type="button" className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" disabled={loading}>
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-5 h-5 mr-2" />
                  <span className="text-sm text-gray-700">Microsoft</span>
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Logistics Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
