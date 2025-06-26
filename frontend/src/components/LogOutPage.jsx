import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, CheckCircle, Home, ArrowLeft, Clock, Shield, 
  User, AlertTriangle, Loader
} from 'lucide-react';
import { useAuth } from "../../../backend/modules/auth/AuthContext";

const LogoutPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [logoutComplete, setLogoutComplete] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [error, setError] = useState('');

  // Perform logout process
  useEffect(() => {
    const performLogout = async () => {
      try {
        setIsLoggingOut(true);
        
        // Simulate logout process with delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Clear authentication data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        sessionStorage.clear();
        
        // Call logout from auth context if available
        if (logout) {
          await logout();
        }
        
        setIsLoggingOut(false);
        setLogoutComplete(true);
        
        // Start countdown
        const countdownInterval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              navigate('/login', { replace: true });
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(countdownInterval);
      } catch (err) {
        setError('Failed to logout properly. Please try again.');
        setIsLoggingOut(false);
      }
    };

    performLogout();
  }, [logout, navigate]);

  // Manual navigation handlers
  const handleGoToLogin = () => {
    navigate('/login', { replace: true });
  };

  const handleGoToHome = () => {
    navigate('/home', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header - Matching AssignExpenses Style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <LogOut className="w-8 h-8 mr-3 text-indigo-600" />
              Logout
            </h1>
            <p className="text-gray-600 mt-2">You are being signed out of the system</p>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Logout Status Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoggingOut ? (
            // Logging Out State
            <div className="bg-indigo-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                SIGNING OUT
              </h2>
            </div>
          ) : logoutComplete ? (
            // Logout Complete State
            <div className="bg-green-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-green-700 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                LOGOUT SUCCESSFUL
              </h2>
            </div>
          ) : (
            // Error State
            <div className="bg-red-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-red-700 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                LOGOUT FAILED
              </h2>
            </div>
          )}

          <div className="p-6">
            {isLoggingOut ? (
              // Logging Out Content
              <div className="text-center">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LogOut className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Signing you out...
                </h3>
                <p className="text-gray-600 mb-6">
                  Please wait while we securely log you out of the system.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <Shield className="w-4 h-4 mr-2" />
                    Clearing authentication tokens
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-2" />
                    Removing user session data
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Securing your account
                  </div>
                </div>
              </div>
            ) : logoutComplete ? (
              // Logout Complete Content
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  You have been successfully logged out
                </h3>
                <p className="text-gray-600 mb-6">
                  Thank you for using our Logistics Management System. Your session has been securely terminated.
                </p>
                
                {/* Security Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                    <div className="text-left">
                      <h4 className="font-medium text-blue-800 mb-1">Security Notice</h4>
                      <p className="text-sm text-blue-700">
                        For your security, all authentication tokens have been cleared and your session data has been removed.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Auto Redirect Notice */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="text-sm text-gray-700">
                      Redirecting to login page in <span className="font-bold text-indigo-600">{countdown}</span> seconds
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleGoToLogin}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors shadow-md"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Login</span>
                  </button>
                  <button
                    onClick={handleGoToHome}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors shadow-md"
                  >
                    <Home className="w-5 h-5" />
                    <span>Go to Home</span>
                  </button>
                </div>
              </div>
            ) : (
              // Error Content
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Logout Failed
                </h3>
                <p className="text-gray-600 mb-6">
                  There was an issue logging you out. Please try again or contact support if the problem persists.
                </p>
                
                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors shadow-md"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Try Again</span>
                  </button>
                  <button
                    onClick={handleGoToLogin}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors shadow-md"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Go to Login</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        {logoutComplete && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">What happens next?</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3 mt-2"></div>
                <span>Your authentication session has been completely terminated</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3 mt-2"></div>
                <span>All temporary data and tokens have been cleared from your browser</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3 mt-2"></div>
                <span>You will need to log in again to access the system</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3 mt-2"></div>
                <span>Your account and data remain secure and unchanged</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© 2025 Logistics Management System. All rights reserved.</p>
          <p className="mt-1">Session ended at {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
