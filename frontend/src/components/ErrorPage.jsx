import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fafc] to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Error Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1b2844] via-[#1b2844] to-[#40919e] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-8 h-8 text-red-400" />
                <h1 className="text-2xl font-bold text-white">Error Occurred</h1>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-300">
                  {new Date().toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  }).replace(/(\d+)\/(\d+)\/(\d+),\s(.+)/, '$3-$1-$2 $4')}
                </div>
                
              </div>
            </div>
          </div>

          {/* Error Details */}
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {error?.statusText || error?.message || "Something went wrong"}
              </h2>
              <p className="text-gray-600">
                {error?.error?.message || "We're sorry, but we couldn't process your request."}
              </p>
            </div>

            {/* Error Code Display */}
            {error?.status && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-500">Error Code</div>
                <div className="text-3xl font-bold text-gray-800">{error.status}</div>
              </div>
            )}

            {/* Technical Details (collapsible) */}
            <div className="mb-8">
              <details className="group">
                <summary className="text-sm font-medium text-gray-500 cursor-pointer hover:text-indigo-600 transition-colors">
                  Technical Details
                </summary>
                <pre className="mt-2 p-4 bg-gray-50 rounded-xl text-xs text-gray-600 overflow-auto">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </details>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Go Back</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        
      </div>
    </div>
  );
};

export default ErrorPage;