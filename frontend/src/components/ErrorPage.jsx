import React, { useEffect } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { 
  AlertTriangle, ArrowLeft, Home, RefreshCw, Bug, 
  Calendar, Clock, User, Globe, Monitor
} from 'lucide-react';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  // Enhanced error logging to console
  useEffect(() => {
    console.group('🚨 ERROR PAGE - Detailed Error Information');
    console.error('Error Object:', error);
    console.error('Error Type:', typeof error);
    console.error('Error Status:', error?.status);
    console.error('Error Status Text:', error?.statusText);
    console.error('Error Message:', error?.message);
    console.error('Error Data:', error?.data);
    console.error('Error Stack:', error?.stack);
    console.error('Error Internal:', error?.internal);
    
    // Browser and environment info
    console.group('🌐 Environment Information');
    console.log('User Agent:', navigator.userAgent);
    console.log('URL:', window.location.href);
    console.log('Timestamp:', new Date().toISOString());
    console.log('Screen Resolution:', `${screen.width}x${screen.height}`);
    console.log('Viewport:', `${window.innerWidth}x${window.innerHeight}`);
    console.log('Language:', navigator.language);
    console.log('Platform:', navigator.platform);
    console.log('Cookies Enabled:', navigator.cookieEnabled);
    console.log('Online Status:', navigator.onLine);
    console.groupEnd();

    // React Router specific error details
    if (error?.internal) {
      console.group('🔄 React Router Error Details');
      console.error('Internal Error:', error.internal);
      console.error('Error Boundary:', error.error);
      console.groupEnd();
    }

    // Network error details
    if (error?.status >= 400) {
      console.group('🌐 Network Error Details');
      console.error('HTTP Status:', error.status);
      console.error('Response Headers:', error.headers);
      console.error('Request URL:', error.url);
      console.groupEnd();
    }

    console.groupEnd();

    // Send error to monitoring service (if available)
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error?.message || 'Unknown error',
        fatal: true
      });
    }
  }, [error]);

  // Get error details with fallbacks
  const getErrorTitle = () => {
    if (error?.status === 404) return "Page Not Found";
    if (error?.status === 403) return "Access Forbidden";
    if (error?.status === 500) return "Server Error";
    if (error?.status >= 400 && error?.status < 500) return "Client Error";
    if (error?.status >= 500) return "Server Error";
    return error?.statusText || error?.message || "Something went wrong";
  };

  const getErrorDescription = () => {
    if (error?.status === 404) return "The page you're looking for doesn't exist or has been moved.";
    if (error?.status === 403) return "You don't have permission to access this resource.";
    if (error?.status === 500) return "Our server encountered an error while processing your request.";
    if (error?.status >= 400 && error?.status < 500) return "There was an issue with your request.";
    if (error?.status >= 500) return "We're experiencing technical difficulties.";
    return error?.error?.message || error?.data || "We're sorry, but we couldn't process your request.";
  };

  const getErrorIcon = () => {
    if (error?.status === 404) return "🔍";
    if (error?.status === 403) return "🔒";
    if (error?.status === 500) return "⚠️";
    return "❌";
  };

  const handleRefresh = () => {
    console.log('🔄 User initiated page refresh');
    window.location.reload();
  };

  const handleGoBack = () => {
    console.log('⬅️ User navigating back');
    navigate(-1);
  };

  const handleGoHome = () => {
    console.log('🏠 User navigating to home');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header - Matching AssignExpenses Style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <AlertTriangle className="w-8 h-8 mr-3 text-red-600" />
              Error {error?.status || 'Occurred'}
            </h1>
            <p className="text-gray-600 mt-2">Something unexpected happened</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center shadow-md"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Details Card - Matching AssignExpenses Style */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="bg-red-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-red-700 flex items-center">
              <Bug className="w-5 h-5 mr-2" />
              ERROR DETAILS
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Error Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="text-2xl mr-2">{getErrorIcon()}</span>
                    {getErrorTitle()}
                  </h3>
                  <p className="text-gray-600">{getErrorDescription()}</p>
                </div>

                {/* Error Code */}
                {error?.status && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">HTTP Status Code</div>
                    <div className="text-3xl font-bold text-gray-800">{error.status}</div>
                  </div>
                )}
              </div>

              {/* Environment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Environment Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-medium mr-2">Date:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-medium mr-2">Time:</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Globe className="w-4 h-4 mr-2" />
                    <span className="font-medium mr-2">URL:</span>
                    <span className="truncate">{window.location.pathname}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Monitor className="w-4 h-4 mr-2" />
                    <span className="font-medium mr-2">Browser:</span>
                    <span className="truncate">{navigator.userAgent.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details - Expandable */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <details className="group">
              <summary className="text-lg font-semibold text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors flex items-center">
                <Bug className="w-5 h-5 mr-2" />
                TECHNICAL DETAILS
                <span className="ml-auto text-sm text-gray-500">(Click to expand)</span>
              </summary>
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <div className="space-y-4">
                  {/* Error Stack */}
                  {error?.stack && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Stack Trace:</h4>
                      <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-auto max-h-40">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                  
                  {/* Full Error Object */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Error Object:</h4>
                    <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-auto max-h-40">
                      {JSON.stringify(error, null, 2)}
                    </pre>
                  </div>

                  {/* Browser Information */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Browser Information:</h4>
                    <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-auto max-h-40">
{`User Agent: ${navigator.userAgent}
Platform: ${navigator.platform}
Language: ${navigator.language}
Screen: ${screen.width}x${screen.height}
Viewport: ${window.innerWidth}x${window.innerHeight}
Online: ${navigator.onLine}
Cookies: ${navigator.cookieEnabled}`}
                    </pre>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Action Buttons - Matching AssignExpenses Style */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What would you like to do?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleGoBack}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
            
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </button>
            
            <button
              onClick={handleGoHome}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Return Home</span>
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>If this error persists, please contact support with the error details above.</p>
          <p className="mt-1">Error ID: {Date.now().toString(36)}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
