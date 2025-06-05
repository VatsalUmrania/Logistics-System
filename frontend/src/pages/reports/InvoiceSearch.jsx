import React, { useState } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';

const InvoiceSearch = () => {
  // Mock invoice data
  const [invoices, setInvoices] = useState([
    { 
      id: 1, 
      operationNo: '9918/12/2024', 
      clientName: 'EASTERN POWER SUPPORT TRADING EST.', 
      receiptDate: '2025-01-02',
      amount: 12500.00
    },
    { 
      id: 2, 
      operationNo: '9919/01/2025', 
      clientName: 'Overseas Development Company Limited', 
      receiptDate: '2025-01-02',
      amount: 8450.50
    },
    { 
      id: 3, 
      operationNo: '9874/12/2024', 
      clientName: 'PIVOT SHIPPING COMPANY LIMITED', 
      receiptDate: '2025-01-05',
      amount: 23000.00
    },
    { 
      id: 4, 
      operationNo: '9871/12/2024', 
      clientName: 'PIVOT SHIPPING COMPANY LIMITED', 
      receiptDate: '2025-01-05',
      amount: 18500.75
    },
    { 
      id: 5, 
      operationNo: '9938/01/2025', 
      clientName: 'RAISCO TRADING COMPANY', 
      receiptDate: '2025-01-05',
      amount: 9200.00
    },
    { 
      id: 6, 
      operationNo: '9940/01/2025', 
      clientName: 'GLOBAL LOGISTICS PARTNERS', 
      receiptDate: '2025-01-07',
      amount: 15600.25
    },
    { 
      id: 7, 
      operationNo: '9945/01/2025', 
      clientName: 'MIDDLE EAST TRADING GROUP', 
      receiptDate: '2025-01-08',
      amount: 21000.50
    },
    { 
      id: 8, 
      operationNo: '9950/01/2025', 
      clientName: 'ARABIAN GULF SHIPPING', 
      receiptDate: '2025-01-10',
      amount: 17500.00
    },
    { 
      id: 9, 
      operationNo: '9955/01/2025', 
      clientName: 'RED SEA IMPORT EXPORT', 
      receiptDate: '2025-01-12',
      amount: 13250.75
    },
    { 
      id: 10, 
      operationNo: '9960/01/2025', 
      clientName: 'DESERT CARGO SERVICES', 
      receiptDate: '2025-01-15',
      amount: 18900.00
    },
    { 
      id: 11, 
      operationNo: '9965/01/2025', 
      clientName: 'OCEAN FREIGHT SOLUTIONS', 
      receiptDate: '2025-01-18',
      amount: 24500.25
    },
    { 
      id: 12, 
      operationNo: '9970/01/2025', 
      clientName: 'SAUDI INDUSTRIAL SUPPLIERS', 
      receiptDate: '2025-01-20',
      amount: 16750.50
    },
  ]);
  
  const [startDate, setStartDate] = useState('2024-10-03');
  const [endDate, setEndDate] = useState('2025-06-01');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Filter invoices by date range
  const filteredInvoices = invoices.filter(invoice => {
    return invoice.receiptDate >= startDate && invoice.receiptDate <= endDate;
  });
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  
  // Handle date search
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              INVOICE SEARCH
            </h1>
            <p className="text-gray-600 mt-2">Search and manage your invoices</p>
          </div>
        </div>

        {/* Date Filter Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Search by Date
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
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
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
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
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <button
                  onClick={handleSearch}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center shadow-md"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Invoices
                </button>
              </div>
            </div>
            
            <div className="mt-6 px-4 py-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm font-medium text-blue-800">
                Date: {startDate} to {endDate}
              </p>
            </div>
          </div>
        </div>

        {/* Invoice List Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">INVOICE LIST</h3>
            <div className="text-sm text-gray-500">
              Showing {Math.min(filteredInvoices.length, itemsPerPage)} of {filteredInvoices.length} invoices
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SL.No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operation No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receipt Date
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentInvoices.length > 0 ? (
                  currentInvoices.map((invoice, index) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{invoice.operationNo}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{invoice.clientName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{invoice.receiptDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center mx-auto">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No invoices found</h4>
                        <p className="text-gray-400 mt-1">Try adjusting your date range</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredInvoices.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg border ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                  let page;
                  if (totalPages <= 10) {
                    page = i + 1;
                  } else {
                    if (currentPage <= 5) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 4) {
                      page = totalPages - 9 + i;
                    } else {
                      page = currentPage - 5 + i;
                    }
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg border ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg border ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceSearch;