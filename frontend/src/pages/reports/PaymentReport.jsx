import React, { useState } from 'react';
import { Search, Calendar, Download, FileText, ChevronDown } from 'lucide-react';

const PaymentReport = () => {
  const [fromDate, setFromDate] = useState('2024-11-01');
  const [toDate, setToDate] = useState('2025-06-01');
  const [clientName, setClientName] = useState('ABBAS ALI ALCHIERIAF ESTABLISHMENT AND TRADING');
  const [selectAllClients, setSelectAllClients] = useState(false);
  
  // Mock payment data
  const payments = [
    // Empty state as shown in screenshot
  ];

  // Client options
  const clientOptions = [
    'ABBAS ALI ALCHIERIAF ESTABLISHMENT AND TRADING',
    'EASTERN POWER SUPPORT TRADING EST.',
    'PIVOT SHIPPING COMPANY LIMITED',
    'RAISCO TRADING COMPANY',
    'GLOBAL LOGISTICS PARTNERS',
    'MIDDLE EAST TRADING GROUP',
    'ARABIAN GULF SHIPPING'
  ];

  const handleSearch = () => {
    // In a real app, this would fetch data from an API
    console.log('Searching payments:', { fromDate, toDate, clientName, selectAllClients });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-indigo-600" />
            PAYMENT REPORT
          </h1>
          <p className="text-gray-600 mt-2">Track and manage payment records</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Search Payments
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
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
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none pr-8"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    disabled={selectAllClients}
                  >
                    <option value="">Select a client</option>
                    {clientOptions.map((client, index) => (
                      <option key={index} value={client}>{client}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="selectAll"
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    checked={selectAllClients}
                    onChange={(e) => {
                      setSelectAllClients(e.target.checked);
                      if (e.target.checked) setClientName('');
                    }}
                  />
                  <label htmlFor="selectAll" className="ml-2 text-sm font-medium text-gray-700">
                    Select All Clients
                  </label>
                </div>
                <button
                  onClick={handleSearch}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center shadow-md"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-lg font-medium text-blue-800">
                From: {fromDate} To: {toDate}
              </p>
              <p className="text-lg font-medium text-blue-800 mt-1">
                CLIENT NAME: {selectAllClients ? "All Clients" : clientName}
              </p>
            </div>
            
            {/* Payment Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        SINO
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Voucher No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Date Of Payment
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.length > 0 ? (
                      payments.map((payment, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.voucherNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {payment.amount}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <FileText className="w-16 h-16 text-gray-300 mb-4" />
                            <h4 className="text-lg font-medium text-gray-500">No payment data found</h4>
                            <p className="text-gray-400 mt-1">Try adjusting your search criteria</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Report Footer */}
            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export to Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReport;