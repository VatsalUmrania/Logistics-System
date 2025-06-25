import React, { useState } from 'react';
import {
  X, AlertTriangle, FileX, CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReceiptCancellation = () => {
  const [formData, setFormData] = useState({ receiptNo: '', reason: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCancel = () => {
    if (!formData.receiptNo.trim()) {
      alert('Please enter a job number');
      return;
    }
    if (!formData.reason.trim()) {
      alert('Please enter a reason for cancellation');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmCancellation = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowConfirmation(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({ receiptNo: '', reason: '' });
      }, 2000);
    } catch (error) {
      alert('Failed to cancel receipt');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData({ receiptNo: '', reason: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-2">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FileX className="w-8 h-8 mr-3 text-red-600" />
              Receipt Cancellation
            </h1>
            <p className="text-gray-600 mt-2">
              Cancel a receipt by providing the job number and a valid reason.
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <X size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold">Cancellation Details</h2>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-8">
            <form
              onSubmit={e => { e.preventDefault(); handleCancel(); }}
              className="space-y-8"
              autoComplete="off"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Job Number */}
                <div className="space-y-3">
                  <label htmlFor="receiptNo" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileX size={16} className="text-red-600" />
                    Job Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="receiptNo"
                    name="receiptNo"
                    value={formData.receiptNo}
                    onChange={handleInputChange}
                    className="w-full h-14 border-2 border-gray-200 rounded-xl px-4 text-sm bg-white text-slate-800 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 hover:border-gray-300 shadow-sm transition"
                    placeholder="Enter job number (e.g., JOB-2024-001)"
                  />
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
                    Enter the job number associated with the receipt
                  </p>
                </div>
                {/* Reason */}
                <div className="space-y-3">
                  <label htmlFor="reason" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-yellow-600" />
                    Cancellation Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm bg-white text-slate-800 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 hover:border-gray-300 resize-none shadow-sm transition"
                    placeholder="Provide a detailed reason for cancellation (e.g., duplicate entry, customer request, error in processing...)"
                  />
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
                    This reason will be permanently recorded in the system
                  </p>
                </div>
              </div>

              {/* Preview Section */}
              {(formData.receiptNo || formData.reason) && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FileX size={18} className="text-gray-600" />
                    Cancellation Preview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Job Number:</p>
                      <p className="text-sm text-gray-800 font-mono bg-white px-3 py-2 rounded-lg border">
                        {formData.receiptNo || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Reason:</p>
                      <p className="text-sm text-gray-800 bg-white px-3 py-2 rounded-lg border min-h-[40px]">
                        {formData.reason || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 border-t">
                <button
                  type="button"
                  className="bg-gray-500 text-white rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition px-8 py-4 min-w-[160px] hover:bg-gray-600 hover:shadow-lg hover:scale-105"
                  onClick={handleClearForm}
                  disabled={isLoading}
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-red-600 to-red-600 text-white rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition px-8 py-4 min-w-[160px] hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isLoading || !formData.receiptNo.trim() || !formData.reason.trim()}
                >
                  <X size={18} />
                  Cancel Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4">
              <h3 className="text-xl font-semibold flex items-center gap-3">
                <AlertTriangle size={24} />
                Confirm Cancellation
              </h3>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700 mb-4 text-lg">
                  Are you sure you want to cancel the receipt for:
                </p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Job Number:</p>
                    <p className="text-lg font-semibold text-gray-800 font-mono">{formData.receiptNo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reason:</p>
                    <p className="text-sm text-gray-800 leading-relaxed">{formData.reason}</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-red-700 font-medium">
                  ⚠️ This action cannot be undone and will be permanently recorded in the system.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  className="flex-1 bg-gray-500 text-white rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition px-4 py-3 hover:bg-gray-600"
                  onClick={() => setShowConfirmation(false)}
                  disabled={isLoading}
                >
                  Keep Receipt
                </button>
                <button
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition px-4 py-3 hover:from-red-700 hover:to-red-800 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={confirmCancellation}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <X size={18} />
                      Confirm Cancel
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4">
              <h3 className="text-xl font-semibold flex items-center gap-3">
                <CheckCircle size={24} />
                Success
              </h3>
            </div>
            <div className="p-6 text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Receipt Cancelled Successfully</h4>
              <p className="text-gray-600 text-sm">
                The receipt for job <strong>{formData.receiptNo}</strong> has been cancelled and logged in the system.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptCancellation;
