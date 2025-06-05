import React, { useState } from 'react';
import { Search, Calendar, ChevronDown, Download, FileText } from 'lucide-react';

const CustomerStatement = () => {
  const [fromDate, setFromDate] = useState('2024-11-01');
  const [toDate, setToDate] = useState('2025-05-01');
  const [clientName, setClientName] = useState('ABBAS ALI ALGHEIRA ESTABLISHMENT AND TRADING');
  
  // Mock transaction data
  const transactions = [
    {
      refNo: 'Opening Balance',
      date: '2024-11-01',
      description: 'Opening Balance',
      debit: null,
      credit: null,
      balance: '0.00'
    },
    {
      refNo: 'JV of 691',
      date: '2024-12-31',
      description: 'Credit Sales',
      debit: '1,104.50',
      credit: null,
      balance: null
    },
    {
      refNo: '',
      date: '2025-04-16',
      description: 'cash Transferred',
      debit: null,
      credit: '1,104.50',
      balance: null
    },
    {
      refNo: '',
      date: '',
      description: 'Grand Total',
      debit: '1,104.50',
      credit: '1,104.50',
      balance: null
    },
    {
      refNo: '',
      date: '2025-06-01',
      description: 'Closing Balance',
      debit: null,
      credit: null,
      balance: '0.00 Dr'
    },
    {
      refNo: '',
      date: '2025-06-01',
      description: 'Closing Balance(SR)',
      debit: null,
      credit: null,
      balance: '0.00 Dr'
    }
  ];

  const handleSearch = () => {
    // In a real app, this would fetch data from an API
    console.log('Searching with:', { fromDate, toDate, clientName });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-indigo-600" />
            CUSTOMER STATEMENT
          </h1>
          <p className="text-gray-600 mt-2">View and manage customer account statements</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Search by Date
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter client name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleSearch}
                className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center shadow-md"
              >
                <Search className="w-5 h-5 mr-2" />
                Generate Statement
              </button>
            </div>
          </div>
        </div>

        {/* Report Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-blue-800">From Date: {fromDate}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-blue-800">To Date: {toDate}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-blue-800">Client Name: {clientName}</p>
              </div>
            </div>
            
            {/* Statement Report */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Ref. No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Account Names, Description
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Debit
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Credit
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((transaction, index) => (
                      <tr key={index} className={index === transactions.length - 1 ? "font-semibold" : ""}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {transaction.refNo}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {transaction.date}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          {transaction.debit}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          {transaction.credit}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          {transaction.balance}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Report Footer */}
            <div className="mt-8 flex justify-between items-center">
              <div className="text-sm text-gray-500 italic">
                ** Report Ends **
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerStatement;