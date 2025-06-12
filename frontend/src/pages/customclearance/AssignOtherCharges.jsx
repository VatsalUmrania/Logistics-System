import React, { useState } from 'react';
import { Save, DollarSign, ArrowLeft, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AssignOtherCharges = () => {
  const [formData, setFormData] = useState({
    jobNo: '',
    otherCharges: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
    if (success) setSuccess(false);
  };

  const handleSave = async () => {
    // Validation
    if (!formData.jobNo.trim()) {
      setError('Please enter a Job Number');
      return;
    }
    if (!formData.otherCharges.trim()) {
      setError('Please enter Other Charges amount');
      return;
    }

    setError('');
    setIsLoading(true);
    
    try {
      console.log('Saving data:', formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Save failed:', error);
      setError('Failed to save charges. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({ jobNo: '', otherCharges: '' });
    setError('');
    setSuccess(false);
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen p-10 m-0 font-sans">
            {/* Enhanced Form Container */}
      <div className="p-8 flex justify-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50 max-w-4xl w-full relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -translate-y-20 translate-x-20 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-slate-100 to-blue-100 rounded-full translate-y-16 -translate-x-16 opacity-50"></div>
          
          {/* Enhanced Card Header */}
          <div className="bg-gradient-to-r from-indigo-700 via-blue-800 to-indigo-900 text-white px-8 py-6 -mx-10 -mt-10 mb-10 rounded-t-3xl flex items-center gap-4 shadow-xl relative z-10">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold m-0">Charge Assignment</h2>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-3 relative z-10">
              <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-green-800 font-bold text-base">Success!</h3>
                <p className="text-green-700 text-sm">Other charges have been successfully assigned to the job.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-3 relative z-10">
              <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-red-800 font-bold text-base">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}
          
          {/* Enhanced Form */}
          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Job No Input */}
              <div className="flex flex-col gap-3">
                <label htmlFor="jobNo" className="text-slate-700 text-sm font-bold flex items-center gap-3">
                  <FileText size={18} className="text-slate-500" />
                  Job Number
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  id="jobNo"
                  name="jobNo"
                  value={formData.jobNo}
                  onChange={handleInputChange}
                  className="h-14 border-2 border-slate-200 rounded-2xl px-5 text-base bg-white/90 backdrop-blur-sm transition-all duration-300 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder-slate-400 shadow-lg font-medium"
                  placeholder="Enter Job Number (e.g., JOB-2024-001)"
                  disabled={isLoading}
                />
              </div>
              
              {/* Other Charges Input */}
              <div className="flex flex-col gap-3">
                <label htmlFor="otherCharges" className="text-slate-700 text-sm font-bold flex items-center gap-3">
                  <DollarSign size={18} className="text-slate-500" />
                  Other Charges Amount
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="number"
                  id="otherCharges"
                  name="otherCharges"
                  value={formData.otherCharges}
                  onChange={handleInputChange}
                  className="h-14 border-2 border-slate-200 rounded-2xl px-5 text-base bg-white/90 backdrop-blur-sm transition-all duration-300 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder-slate-400 shadow-lg font-medium"
                  placeholder="Enter amount (e.g., 150.00)"
                  step="0.01"
                  min="0"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-6">
              <button 
                type="button" 
                className="bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-600 text-white border-none rounded-2xl cursor-pointer flex items-center justify-center gap-3 text-base font-bold transition-all duration-300 px-10 py-4 h-14 min-w-32 hover:from-emerald-600 hover:via-green-700 hover:to-emerald-700 hover:shadow-xl hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500 disabled:scale-100 active:scale-95 shadow-lg uppercase tracking-wide"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Charges
                  </>
                )}
              </button>
              
              <button 
                type="button" 
                className="bg-slate-100 text-slate-600 border-2 border-slate-200 rounded-2xl cursor-pointer flex items-center justify-center text-base font-bold transition-all duration-300 px-10 py-4 h-14 hover:bg-slate-200 hover:border-slate-300 hover:text-slate-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 uppercase tracking-wide"
                onClick={clearForm}
                disabled={isLoading}
              >
                Clear Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignOtherCharges;