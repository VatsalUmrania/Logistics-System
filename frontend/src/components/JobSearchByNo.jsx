import React, { useState } from 'react';
import { Search, FileText, Printer, ChevronDown } from 'lucide-react';

const JobSearchByNo = () => {
  const [jobNo, setJobNo] = useState('');
  const [jobDetails, setJobDetails] = useState(null);
  
  // Mock job data
  const mockJobs = [
    {
      id: '9557/11/2024',
      customerName: 'FALCON GLOBAL ARABIAN TRADING COMPANY',
      invoiceAmount: 90.85,
      valAmountInvoice: 0.00,
      expense: 90.85,
      purchaseAmount: 0.00,
      purchaseVal: 0.00,
      differenceInVal: 0.00,
      otherCharges: 0.00,
      profit: 0.00
    },
    {
      id: '9558/12/2024',
      customerName: 'GLOBAL LOGISTICS PARTNERS',
      invoiceAmount: 2500.00,
      valAmountInvoice: 125.00,
      expense: 2375.00,
      purchaseAmount: 2000.00,
      purchaseVal: 100.00,
      differenceInVal: 25.00,
      otherCharges: 75.00,
      profit: 125.00
    }
  ];

  const handleSearch = () => {
    if (!jobNo.trim()) {
      alert('Please enter a job number');
      return;
    }
    
    const foundJob = mockJobs.find(job => job.id === jobNo);
    
    if (foundJob) {
      setJobDetails(foundJob);
    } else {
      alert('Job not found');
      setJobDetails(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 print:p-0">
      <div className="max-w-5xl mx-auto print:max-w-none">
        {/* Header */}
        <div className="mb-8 print:hidden">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-indigo-600" />
            SEARCH BY JOB NO
          </h1>
          <p className="text-gray-600 mt-2">Search and view job details</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 print:shadow-none print:border print:border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 print:bg-gray-200 print:bg-none">
            <h2 className="text-xl font-bold text-white flex items-center print:text-gray-800">
              <Search className="w-5 h-5 mr-2 print:text-gray-700" />
              Search Job
            </h2>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job No
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter Job No"
                  value={jobNo}
                  onChange={(e) => setJobNo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-green-700 transition-all flex items-center justify-center shadow-md"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Job Details Section */}
        {jobDetails && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Job Details
                  </h2>
                  <p className="text-gray-600">Job No: {jobDetails.id}</p>
                </div>
                <button 
                  onClick={handlePrint}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium flex items-center shadow-md print:hidden"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </button>
              </div>
              
              <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800">
                    Customer Name: <span className="font-normal">{jobDetails.customerName}</span>
                  </h3>
                </div>
                
                <div className="divide-y divide-gray-200">
                  <div className="flex justify-between items-center p-4 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-700">Invoice Amount</span>
                    </div>
                    <span className="text-lg font-semibold text-emerald-600">
                      ${jobDetails.invoiceAmount.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded-lg mr-3">
                        <ChevronDown className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-700">Val Amount (invoice)</span>
                    </div>
                    <span className="text-gray-900">
                      ${jobDetails.valAmountInvoice.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="bg-red-100 p-2 rounded-lg mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700">Expense</span>
                    </div>
                    <span className="text-red-600 font-medium">
                      ${jobDetails.expense.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700">Purchase Amount</span>
                    </div>
                    <span className="text-gray-900">
                      ${jobDetails.purchaseAmount.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700">Purchase Val</span>
                    </div>
                    <span className="text-gray-900">
                      ${jobDetails.purchaseVal.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700">Difference in Val</span>
                    </div>
                    <span className="text-gray-900">
                      ${jobDetails.differenceInVal.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="bg-pink-100 p-2 rounded-lg mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700">Other Charges</span>
                    </div>
                    <span className="text-gray-900">
                      ${jobDetails.otherCharges.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="bg-teal-100 p-2 rounded-lg mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700">Profit</span>
                    </div>
                    <span className={`text-lg font-semibold ${
                      jobDetails.profit >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      ${jobDetails.profit.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 border-t border-gray-200 pt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Generated on: {new Date().toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-500 italic">
                  ** Report Ends **
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Print styles */}
        <style>
          {`
            @media print {
              body {
                background-color: white;
                padding: 0;
                margin: 0;
              }
              .print\\:hidden {
                display: none;
              }
              .print\\:max-w-none {
                max-width: none;
            }
            .print\\:border {
              border: 1px solid #e5e7eb;
            }
            .print\\:bg-none {
              background: none !important;
            }
            .print\\:text-gray-800 {
              color: #1f2937;
            }
            .print\\:shadow-none {
              box-shadow: none;
            }
          }
        `}
      </style>
      </div>
    </div>
  );
};

export default JobSearchByNo;