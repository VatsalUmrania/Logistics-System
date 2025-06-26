import React, { useState, useEffect } from 'react';
import { 
  Calculator, Search, Printer, Calendar, ChevronLeft, ChevronRight,
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert
} from 'lucide-react';
import Select from 'react-select';

const Cashbook = () => {
  // State management
  const [fromDate, setFromDate] = useState('2025-06-21');
  const [toDate, setToDate] = useState('2025-06-23');
  const [cashbookEntries, setCashbookEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
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

  // Auth header utility
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication token missing');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Mock cashbook data based on your image
  const mockCashbookData = [
    {
      id: 1,
      date: '2025-06-21',
      particulars: 'INSPECTION AMOUNT ADDED IN SGP PORTAL',
      debit: 10000,
      credit: 0
    },
    {
      id: 2,
      date: '2025-06-21',
      particulars: 'INSPECTION CHARGE PAID, 10976/06/2025, 003064',
      debit: 0,
      credit: 815.75
    },
    {
      id: 3,
      date: '2025-06-21',
      particulars: 'INSPECTION CHARGE PAID, 10956/06/2025, 4480151',
      debit: 0,
      credit: 2828.75
    },
    {
      id: 4,
      date: '2025-06-22',
      particulars: 'OFFICE RENT PAYMENT',
      debit: 0,
      credit: 5000
    },
    {
      id: 5,
      date: '2025-06-22',
      particulars: 'CLIENT PAYMENT RECEIVED',
      debit: 15000,
      credit: 0
    },
    {
      id: 6,
      date: '2025-06-23',
      particulars: 'UTILITY BILLS PAYMENT',
      debit: 0,
      credit: 1200
    },
    {
      id: 7,
      date: '2025-06-23',
      particulars: 'BANK TRANSFER RECEIVED',
      debit: 8500,
      credit: 0
    }
  ];

  // Initialize data
  useEffect(() => {
    setCashbookEntries(mockCashbookData);
  }, []);

  // Search handler
  const handleSearch = async () => {
    if (!fromDate || !toDate) {
      setError('Please select both From and To dates');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      console.log('Searching cashbook entries:', { fromDate, toDate });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock data based on date range
      const filteredEntries = mockCashbookData.filter(entry => {
        const entryDate = entry.date;
        return entryDate >= fromDate && entryDate <= toDate;
      });

      setCashbookEntries(filteredEntries);
      setSuccessMessage(`Found ${filteredEntries.length} cashbook entries for the selected period`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Failed to fetch cashbook data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Print handler
  const handlePrint = () => {
    window.print();
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

  // Sort cashbook entries
  const sortedEntries = [...cashbookEntries].sort((a, b) => {
    let valA, valB;
    if (sortField === 'date') {
      valA = new Date(a.date);
      valB = new Date(b.date);
    } else if (sortField === 'debit' || sortField === 'credit') {
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
  const currentEntries = sortedEntries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedEntries.length / itemsPerPage);

  // Calculate totals
  const getTotalDebit = () => {
    return cashbookEntries.reduce((sum, entry) => sum + parseFloat(entry.debit), 0);
  };

  const getTotalCredit = () => {
    return cashbookEntries.reduce((sum, entry) => sum + parseFloat(entry.credit), 0);
  };

  const getBalance = () => {
    return getTotalDebit() - getTotalCredit();
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [cashbookEntries]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Matching AssignExpenses */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <Calculator className="w-8 h-8 mr-3 text-indigo-600" />
              CASHBOOK
            </h1>
            <p className="text-gray-600 mt-2">Track and manage cash transactions</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center shadow-md"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print
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
              SEARCH BY DATE
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm flex items-center justify-center disabled:opacity-50"
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
        </div>

        {/* Date Range Header */}
        {cashbookEntries.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                From Date: {new Date(fromDate).toLocaleDateString('en-GB')} To Date: {new Date(toDate).toLocaleDateString('en-GB')}
              </h2>
            </div>
          </div>
        )}

        {/* Cashbook Summary */}
        {cashbookEntries.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600">Total Debit</h3>
                <p className="text-2xl font-bold text-green-600">
                  {getTotalDebit().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600">Total Credit</h3>
                <p className="text-2xl font-bold text-red-600">
                  {getTotalCredit().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600">Balance</h3>
                <p className={`text-2xl font-bold ${getBalance() >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {Math.abs(getBalance()).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cashbook Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'Date', key: 'date' },
                    { label: 'Particulars', key: 'particulars' },
                    { label: 'Debit', key: 'debit' },
                    { label: 'Credit', key: 'credit' },
                  ].map(({ label, key }) => (
                    <th
                      key={label}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex items-center">
                        {label}
                        {renderSortIcon(key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentEntries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Calculator className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No cashbook entries found</h4>
                        <p className="text-gray-400 mt-2">Adjust your search criteria to view transactions</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {new Date(entry.date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-md">
                        {entry.particulars}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600 text-right">
                        {entry.debit > 0 ? entry.debit.toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-600 text-right">
                        {entry.credit > 0 ? entry.credit.toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}
                      </td>
                    </tr>
                  ))
                )}
                
                {/* Total row */}
                {currentEntries.length > 0 && (
                  <tr className="bg-gray-100 font-semibold">
                    <td colSpan="2" className="px-4 py-3 text-right text-sm text-gray-900">
                      <strong>TOTALS:</strong>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700 text-right font-bold">
                      {getTotalDebit().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-red-700 text-right font-bold">
                      {getTotalCredit().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
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
                {Math.min(indexOfLastItem, sortedEntries.length)} of {sortedEntries.length} entries
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
                Balance: <span className={`font-bold ${getBalance() >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {Math.abs(getBalance()).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cashbook;
