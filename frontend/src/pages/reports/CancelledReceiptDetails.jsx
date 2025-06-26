import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Printer, Calendar, ChevronLeft, ChevronRight, 
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert
} from 'lucide-react';
import Select from 'react-select';

const CancelledReceiptDetails = () => {
  // State management
  const [startDate, setStartDate] = useState('2024-10-11');
  const [endDate, setEndDate] = useState('2025-06-01');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [sortField, setSortField] = useState('receiptDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  // Custom styles for react-select dropdowns (matching AssignExpenses)
  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: '42px',
      borderRadius: '8px',
      borderColor: '#d1d5db',
      '&:hover': {
        borderColor: '#9ca3af'
      }
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({ ...base, zIndex: 9999 })
  };

  // Mock data for cancelled receipts
  const [cancelledReceipts, setCancelledReceipts] = useState([
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
  ]);

  // Filter receipts based on search term
  const filteredReceipts = cancelledReceipts.filter(receipt =>
    receipt.operationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.receiptNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort receipts
  const sortedReceipts = [...filteredReceipts].sort((a, b) => {
    let valA, valB;
    if (sortField === 'receiptDate' || sortField === 'cancelledDate') {
      valA = new Date(a[sortField]);
      valB = new Date(b[sortField]);
    } else if (sortField === 'receiptAmount') {
      valA = parseFloat(a[sortField]);
      valB = parseFloat(b[sortField]);
    } else {
      valA = a[sortField] ? a[sortField].toLowerCase() : '';
      valB = b[sortField] ? b[sortField].toLowerCase() : '';
    }
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReceipts = sortedReceipts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedReceipts.length / itemsPerPage);

  // Calculate total cancelled amount
  const totalCancelledAmount = filteredReceipts.reduce((sum, receipt) => sum + receipt.receiptAmount, 0);

  // Search handler
  const handleSearch = () => {
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(`Found ${filteredReceipts.length} cancelled receipt(s) between ${startDate} and ${endDate}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 500);
  };

  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Render sort icon
  const renderSortIcon = (field) => {
    if (sortField !== field) return <ArrowUp className="w-3 h-3 text-gray-400 inline" />;
    return sortDirection === 'asc' ?
      <ArrowUp className="w-3 h-3 text-indigo-600 inline" /> :
      <ArrowDown className="w-3 h-3 text-indigo-600 inline" />;
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filteredReceipts]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Matching AssignExpenses */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              Cancelled Receipt Details
            </h1>
            <p className="text-gray-600 mt-2">View and manage cancelled receipt records</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center shadow-md"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print Report
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <Alert className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Search Section - Matching AssignExpenses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH CANCELLED RECEIPTS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by operation or receipt no..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm flex items-center disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Receipt Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Receipt Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total Cancelled Amount: <span className="text-red-600 font-bold">SAR {totalCancelledAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Cancelled Receipts Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'S1.No.', key: 'id' },
                    { label: 'Operation No.', key: 'operationNo' },
                    { label: 'Receipt No.', key: 'receiptNo' },
                    { label: 'Receipt Amount', key: 'receiptAmount' },
                    { label: 'Receipt Date', key: 'receiptDate' },
                    { label: 'Cancelled Date', key: 'cancelledDate' },
                  ].map(({ label, key }) => (
                    <th
                      key={label}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => key && handleSort(key)}
                    >
                      <div className="flex items-center">
                        {label}
                        {key && renderSortIcon(key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentReceipts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No cancelled receipts found</h4>
                        <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentReceipts.map((receipt, index) => (
                    <tr key={receipt.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {receipt.operationNo}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {receipt.receiptNo}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        <span className="font-medium text-red-600">
                          SAR {receipt.receiptAmount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {new Date(receipt.receiptDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs font-medium">
                          {new Date(receipt.cancelledDate).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
                
                {/* Total row */}
                {currentReceipts.length > 0 && (
                  <tr className="bg-gray-100 font-semibold">
                    <td colSpan="3" className="px-4 py-3 text-right text-sm text-gray-900">
                      Total Cancelled Amount:
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-red-700 text-right font-bold">
                      SAR {totalCancelledAmount.toFixed(2)}
                    </td>
                    <td colSpan="2" className="px-4 py-3 text-sm text-gray-900"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700 mb-2 md:mb-0">
                Showing {indexOfFirstItem + 1} to{' '}
                {Math.min(indexOfLastItem, filteredReceipts.length)} of {filteredReceipts.length} receipts
              </div>
              <div className="flex items-center">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                    title="Previous"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                    title="Next"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="hidden md:block text-sm font-medium text-gray-700">
                Total: <span className="text-red-600 font-bold">SAR {totalCancelledAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancelledReceiptDetails;
