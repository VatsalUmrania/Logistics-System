import React, { useState } from 'react';
import { Search, Calendar, Printer, FileText } from 'lucide-react';

const CancelledReceiptDetails = () => {
  const [startDate, setStartDate] = useState('2024-10-11');
  const [endDate, setEndDate] = useState('2025-06-01');
  
  // Mock data for cancelled receipts
  const cancelledReceipts = [
    { id: 1, operationNo: '9626/01/2025', receiptNo: '12411', receiptAmount: 5777.27, receiptDate: '2025-01-13', cancelledDate: '2025-01-19' },
    { id: 2, operationNo: '9626/01/2025', receiptNo: '12412', receiptAmount: 4974.95, receiptDate: '2025-01-13', cancelledDate: '2025-01-19' },
    { id: 3, operationNo: '9626/01/2025', receiptNo: '12439', receiptAmount: 7042.95, receiptDate: '2025-01-18', cancelledDate: '2025-01-19' },
    { id: 4, operationNo: '9877/01/2025', receiptNo: '12407', receiptAmount: 7762.50, receiptDate: '2025-01-09', cancelledDate: '2025-01-27' },
    { id: 5, operationNo: '9820/01/2025', receiptNo: '12418', receiptAmount: 3658.62, receiptDate: '2025-01-13', cancelledDate: '2025-02-03' },
    { id: 6, operationNo: '10056/01/2025', receiptNo: '12584', receiptAmount: 6600.77, receiptDate: '2025-02-04', cancelledDate: '2025-02-05' },
    { id: 7, operationNo: '10086/01/2025', receiptNo: '12683', receiptAmount: 3872.45, receiptDate: '2025-02-04', cancelledDate: '2025-02-05' },
    { id: 8, operationNo: '10027/01/2025', receiptNo: '12572', receiptAmount: 27576.88, receiptDate: '2025-02-03', cancelledDate: '2025-02-10' },
    { id: 9, operationNo: '10187/02/2025', receiptNo: '12619', receiptAmount: 18000.00, receiptDate: '2025-02-10', cancelledDate: '2025-02-10' },
    { id: 10, operationNo: '10144/02/2025', receiptNo: '12640', receiptAmount: 15019.75, receiptDate: '2025-02-10', cancelledDate: '2025-02-10' },
    { id: 11, operationNo: '10014/01/2025', receiptNo: '12645', receiptAmount: 14505.60, receiptDate: '2025-02-11', cancelledDate: '2025-02-11' },
  ];

  // Calculate total cancelled amount
  const totalCancelledAmount = cancelledReceipts.reduce((sum, receipt) => sum + receipt.receiptAmount, 0);

  const handleSearch = () => {
    // In a real app, this would fetch data from an API based on the date range
    console.log('Searching cancelled receipts:', { startDate, endDate });
    // For demo purposes, we'll just use the mock data
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 print:p-0">
      <div className="max-w-7xl mx-auto print:max-w-none">
        {/* Header */}
        <div className="mb-8 print:hidden">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-red-600" />
            CANCELLED RECEIPT DETAILS
          </h1>
          <p className="text-gray-600 mt-2">View details of cancelled receipts</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 print:shadow-none print:border print:border-gray-200">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 print:bg-gray-200 print:bg-none">
            <h2 className="text-xl font-bold text-white flex items-center print:text-gray-800">
              <Search className="w-5 h-5 mr-2 print:text-gray-700" />
              Search Cancelled Receipts
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="md:col-span-2 flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-medium hover:from-red-700 hover:to-orange-700 transition-all flex items-center justify-center shadow-md"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-200">
          <div className="p-6">
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Cancelled Receipt Report</h2>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-medium hover:from-red-700 hover:to-orange-700 transition-all flex items-center justify-center shadow-md print:hidden"
                >
                  <Printer className="w-5 h-5 mr-2" />
                  Print Report
                </button>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <span className="font-medium text-red-800 mr-2">From Date:</span>
                    <span className="font-semibold">{startDate}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-red-800 mr-2">To Date:</span>
                    <span className="font-semibold">{endDate}</span>
                  </div>
                </div>
              </div>
            
              {/* Cancelled Receipts Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        S1.No.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Operation No.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Receipt No.
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Receipt Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Receipt Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Cancelled Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cancelledReceipts.map((receipt) => (
                      <tr key={receipt.id} className="hover:bg-red-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {receipt.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {receipt.operationNo}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {receipt.receiptNo}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          ${receipt.receiptAmount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {receipt.receiptDate}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md">
                            {receipt.cancelledDate}
                          </span>
                        </td>
                      </tr>
                    ))}
                    
                    {/* Total row */}
                    <tr className="bg-gray-50 font-semibold">
                      <td colSpan="3" className="px-4 py-3 text-right text-sm text-gray-900">
                        Total Cancelled Amount:
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-red-700 text-right">
                        ${totalCancelledAmount.toFixed(2)}
                      </td>
                      <td colSpan="2" className="px-4 py-3 text-sm text-gray-900"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Report Footer */}
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
      </div>
      
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
  );
};

export default CancelledReceiptDetails;