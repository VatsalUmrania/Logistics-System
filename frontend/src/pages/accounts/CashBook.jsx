// import React, { useState, useEffect } from 'react';
// import { 
//   Calculator, Search, Printer, Calendar, ChevronLeft, ChevronRight,
//   ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert
// } from 'lucide-react';
// import Select from 'react-select';

// const Cashbook = () => {
//   // State management
//   const [fromDate, setFromDate] = useState('2025-06-21');
//   const [toDate, setToDate] = useState('2025-06-23');
//   const [cashbookEntries, setCashbookEntries] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [sortField, setSortField] = useState('date');
//   const [sortDirection, setSortDirection] = useState('desc');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // Custom styles for react-select dropdowns (matching AssignExpenses)
//   const selectStyles = {
//     control: (base) => ({
//       ...base,
//       minHeight: '42px',
//       borderRadius: '8px',
//       borderColor: '#d1d5db',
//       '&:hover': {
//         borderColor: '#9ca3af'
//       }
//     }),
//     menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//     menu: (base) => ({ ...base, zIndex: 9999 })
//   };

//   // Auth header utility
//   const getAuthHeaders = () => {
//     const token = localStorage.getItem('authToken');
//     if (!token) throw new Error('Authentication token missing');
//     return {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     };
//   };

//   // Mock cashbook data based on your image
//   const mockCashbookData = [
//     {
//       id: 1,
//       date: '2025-06-21',
//       particulars: 'INSPECTION AMOUNT ADDED IN SGP PORTAL',
//       debit: 10000,
//       credit: 0
//     },
//     {
//       id: 2,
//       date: '2025-06-21',
//       particulars: 'INSPECTION CHARGE PAID, 10976/06/2025, 003064',
//       debit: 0,
//       credit: 815.75
//     },
//     {
//       id: 3,
//       date: '2025-06-21',
//       particulars: 'INSPECTION CHARGE PAID, 10956/06/2025, 4480151',
//       debit: 0,
//       credit: 2828.75
//     },
//     {
//       id: 4,
//       date: '2025-06-22',
//       particulars: 'OFFICE RENT PAYMENT',
//       debit: 0,
//       credit: 5000
//     },
//     {
//       id: 5,
//       date: '2025-06-22',
//       particulars: 'CLIENT PAYMENT RECEIVED',
//       debit: 15000,
//       credit: 0
//     },
//     {
//       id: 6,
//       date: '2025-06-23',
//       particulars: 'UTILITY BILLS PAYMENT',
//       debit: 0,
//       credit: 1200
//     },
//     {
//       id: 7,
//       date: '2025-06-23',
//       particulars: 'BANK TRANSFER RECEIVED',
//       debit: 8500,
//       credit: 0
//     }
//   ];

//   // Initialize data
//   useEffect(() => {
//     setCashbookEntries(mockCashbookData);
//   }, []);

//   // Search handler
//   const handleSearch = async () => {
//     if (!fromDate || !toDate) {
//       setError('Please select both From and To dates');
//       return;
//     }

//     setIsLoading(true);
//     setError('');
    
//     try {
//       // Simulate API call
//       console.log('Searching cashbook entries:', { fromDate, toDate });
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Filter mock data based on date range
//       const filteredEntries = mockCashbookData.filter(entry => {
//         const entryDate = entry.date;
//         return entryDate >= fromDate && entryDate <= toDate;
//       });

//       setCashbookEntries(filteredEntries);
//       setSuccessMessage(`Found ${filteredEntries.length} cashbook entries for the selected period`);
//       setTimeout(() => setSuccessMessage(''), 3000);
//     } catch (error) {
//       setError('Failed to fetch cashbook data. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Print handler
//   const handlePrint = () => {
//     window.print();
//   };

//   // Sort handler
//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//     setCurrentPage(1);
//   };

//   // Render sort icon
//   const renderSortIcon = (field) => {
//     if (sortField !== field) return <ArrowUp className="w-3 h-3 text-gray-400 inline" />;
//     return sortDirection === 'asc' ?
//       <ArrowUp className="w-3 h-3 text-indigo-600 inline" /> :
//       <ArrowDown className="w-3 h-3 text-indigo-600 inline" />;
//   };

//   // Sort cashbook entries
//   const sortedEntries = [...cashbookEntries].sort((a, b) => {
//     let valA, valB;
//     if (sortField === 'date') {
//       valA = new Date(a.date);
//       valB = new Date(b.date);
//     } else if (sortField === 'debit' || sortField === 'credit') {
//       valA = parseFloat(a[sortField]);
//       valB = parseFloat(b[sortField]);
//     } else {
//       valA = a[sortField] ? a[sortField].toLowerCase() : '';
//       valB = b[sortField] ? b[sortField].toLowerCase() : '';
//     }
//     if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
//     if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
//     return 0;
//   });

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentEntries = sortedEntries.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(sortedEntries.length / itemsPerPage);

//   // Calculate totals
//   const getTotalDebit = () => {
//     return cashbookEntries.reduce((sum, entry) => sum + parseFloat(entry.debit), 0);
//   };

//   const getTotalCredit = () => {
//     return cashbookEntries.reduce((sum, entry) => sum + parseFloat(entry.credit), 0);
//   };

//   const getBalance = () => {
//     return getTotalDebit() - getTotalCredit();
//   };

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [cashbookEntries]);

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header - Matching AssignExpenses */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
//               <Calculator className="w-8 h-8 mr-3 text-indigo-600" />
//               CASHBOOK
//             </h1>
//             <p className="text-gray-600 mt-2">Track and manage cash transactions</p>
//           </div>
//           <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
//             <button
//               onClick={handlePrint}
//               className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center shadow-md"
//             >
//               <Printer className="w-5 h-5 mr-2" />
//               Print
//             </button>
//           </div>
//         </div>

//         {/* Status Messages */}
//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
//             <div className="flex items-center">
//               <Alert className="w-5 h-5 text-red-500 mr-2" />
//               <p className="text-red-700">{error}</p>
//             </div>
//           </div>
//         )}
//         {successMessage && (
//           <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
//             <div className="flex items-center">
//               <Check className="w-5 h-5 text-green-500 mr-2" />
//               <p className="text-green-700">{successMessage}</p>
//             </div>
//           </div>
//         )}

//         {/* Search Section - Matching AssignExpenses */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
//           <div className="bg-indigo-50 p-4 border-b border-gray-200">
//             <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
//               <Search className="w-5 h-5 mr-2" />
//               SEARCH BY DATE
//             </h2>
//           </div>
//           <div className="p-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   From <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Calendar className="w-5 h-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="date"
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
//                     value={fromDate}
//                     onChange={(e) => setFromDate(e.target.value)}
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   To <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Calendar className="w-5 h-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="date"
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
//                     value={toDate}
//                     onChange={(e) => setToDate(e.target.value)}
//                   />
//                 </div>
//               </div>
              
//               <div className="flex items-end">
//                 <button
//                   onClick={handleSearch}
//                   disabled={isLoading}
//                   className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm flex items-center justify-center disabled:opacity-50"
//                 >
//                   {isLoading ? (
//                     <Loader className="w-4 h-4 animate-spin mr-2" />
//                   ) : (
//                     <Search className="w-4 h-4 mr-2" />
//                   )}
//                   {isLoading ? 'Searching...' : 'Search'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Date Range Header */}
//         {cashbookEntries.length > 0 && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
//             <div className="text-center">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 From Date: {new Date(fromDate).toLocaleDateString('en-GB')} To Date: {new Date(toDate).toLocaleDateString('en-GB')}
//               </h2>
//             </div>
//           </div>
//         )}

//         {/* Cashbook Summary */}
//         {cashbookEntries.length > 0 && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="text-center">
//                 <h3 className="text-sm font-medium text-gray-600">Total Debit</h3>
//                 <p className="text-2xl font-bold text-green-600">
//                   {getTotalDebit().toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                 </p>
//               </div>
//               <div className="text-center">
//                 <h3 className="text-sm font-medium text-gray-600">Total Credit</h3>
//                 <p className="text-2xl font-bold text-red-600">
//                   {getTotalCredit().toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                 </p>
//               </div>
//               <div className="text-center">
//                 <h3 className="text-sm font-medium text-gray-600">Balance</h3>
//                 <p className={`text-2xl font-bold ${getBalance() >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
//                   {Math.abs(getBalance()).toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Cashbook Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   {[
//                     { label: 'Date', key: 'date' },
//                     { label: 'Particulars', key: 'particulars' },
//                     { label: 'Debit', key: 'debit' },
//                     { label: 'Credit', key: 'credit' },
//                   ].map(({ label, key }) => (
//                     <th
//                       key={label}
//                       className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                       onClick={() => handleSort(key)}
//                     >
//                       <div className="flex items-center">
//                         {label}
//                         {renderSortIcon(key)}
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentEntries.length === 0 ? (
//                   <tr>
//                     <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
//                       <div className="flex flex-col items-center justify-center">
//                         <Calculator className="w-16 h-16 text-gray-300 mb-4" />
//                         <h4 className="text-lg font-medium text-gray-500">No cashbook entries found</h4>
//                         <p className="text-gray-400 mt-2">Adjust your search criteria to view transactions</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   currentEntries.map((entry) => (
//                     <tr key={entry.id} className="hover:bg-gray-50 transition">
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                         {new Date(entry.date).toLocaleDateString('en-GB')}
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-900 max-w-md">
//                         {entry.particulars}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600 text-right">
//                         {entry.debit > 0 ? entry.debit.toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-600 text-right">
//                         {entry.credit > 0 ? entry.credit.toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}
//                       </td>
//                     </tr>
//                   ))
//                 )}
                
//                 {/* Total row */}
//                 {currentEntries.length > 0 && (
//                   <tr className="bg-gray-100 font-semibold">
//                     <td colSpan="2" className="px-4 py-3 text-right text-sm text-gray-900">
//                       <strong>TOTALS:</strong>
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700 text-right font-bold">
//                       {getTotalDebit().toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm text-red-700 text-right font-bold">
//                       {getTotalCredit().toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
          
//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
//               <div className="text-sm text-gray-700 mb-2 md:mb-0">
//                 Showing {indexOfFirstItem + 1} to{' '}
//                 {Math.min(indexOfLastItem, sortedEntries.length)} of {sortedEntries.length} entries
//               </div>
//               <div className="flex items-center">
//                 <div className="flex space-x-1">
//                   <button
//                     onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                     disabled={currentPage === 1}
//                     className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
//                     title="Previous"
//                   >
//                     <ChevronLeft className="w-4 h-4" />
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
//                     title="Next"
//                   >
//                     <ChevronRight className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//               <div className="hidden md:block text-sm font-medium text-gray-700">
//                 Balance: <span className={`font-bold ${getBalance() >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
//                   {Math.abs(getBalance()).toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cashbook;


import React, { useState, useEffect } from 'react';
import {
  Wallet, Calendar, Filter, Download, RefreshCw, TrendingUp,
  TrendingDown, DollarSign, FileText, Search, ChevronLeft, ChevronRight
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';

const CashBookPage = () => {
  // State management
  const [transactions, setTransactions] = useState([]);
  const [cashAccounts, setCashAccounts] = useState([]);
  const [summary, setSummary] = useState({
    opening_balance: 0,
    total_receipts: 0,
    total_payments: 0,
    net_cash_flow: 0,
    closing_balance: 0,
    total_transactions: 0,
    receipt_count: 0,
    payment_count: 0
  });
  const [dailySummary, setDailySummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
    cashAccountId: '',
    transactionType: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 20;

  const API_BASE_URL = 'http://localhost:5000/api';

  // Auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    };
  };

  // Fetch cash accounts
  const fetchCashAccounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cash-book/accounts`, getAuthHeaders());
      if (response.data.success) {
        setCashAccounts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cash accounts:', error);
      toast.error('Failed to load cash accounts');
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        startDate: filters.startDate.toISOString().split('T')[0],
        endDate: filters.endDate.toISOString().split('T')[0],
        cashAccountId: filters.cashAccountId || undefined,
        transactionType: filters.transactionType !== 'all' ? filters.transactionType : undefined,
        page: currentPage,
        limit: itemsPerPage
      };

      const response = await axios.get(`${API_BASE_URL}/cash-book/transactions`, {
        ...getAuthHeaders(),
        params
      });

      if (response.data.success) {
        setTransactions(response.data.data.transactions);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch summary
  const fetchSummary = async () => {
    try {
      const params = {
        startDate: filters.startDate.toISOString().split('T')[0],
        endDate: filters.endDate.toISOString().split('T')[0],
        cashAccountId: filters.cashAccountId || undefined
      };

      const response = await axios.get(`${API_BASE_URL}/cash-book/summary`, {
        ...getAuthHeaders(),
        params
      });

      if (response.data.success) {
        setSummary(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      toast.error('Failed to load summary');
    }
  };

  // Fetch daily summary
  const fetchDailySummary = async () => {
    try {
      const params = {
        startDate: filters.startDate.toISOString().split('T')[0],
        endDate: filters.endDate.toISOString().split('T')[0],
        cashAccountId: filters.cashAccountId || undefined
      };

      const response = await axios.get(`${API_BASE_URL}/cash-book/daily-summary`, {
        ...getAuthHeaders(),
        params
      });

      if (response.data.success) {
        setDailySummary(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching daily summary:', error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCashAccounts();
  }, []);

  // Load data when filters change
  useEffect(() => {
    fetchTransactions();
    fetchSummary();
    fetchDailySummary();
  }, [filters, currentPage]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  // Refresh data
  const handleRefresh = () => {
    fetchTransactions();
    fetchSummary();
    fetchDailySummary();
    toast.success('Data refreshed successfully');
  };

  // Export to CSV
  const handleExport = () => {
    const csvData = transactions.map(transaction => ({
      Date: new Date(transaction.transaction_date).toLocaleDateString(),
      'Voucher No': transaction.voucher_no || '',
      Description: transaction.description,
      'Counter Party': transaction.counter_party,
      'Receipt Amount': transaction.credit_amount || '',
      'Payment Amount': transaction.debit_amount || '',
      'Running Balance': transaction.running_balance
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cash-book-${filters.startDate.toISOString().split('T')[0]}-to-${filters.endDate.toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Wallet className="w-8 h-8 mr-3 text-indigo-600" />
              CASH BOOK
            </h1>
            <p className="text-gray-600 mt-2">Track all cash receipts and payments</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all flex items-center shadow-md"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex items-center shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all flex items-center shadow-md"
            >
              <Download className="w-5 h-5 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <DatePicker
                  selected={filters.startDate}
                  onChange={(date) => handleFilterChange('startDate', date)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <DatePicker
                  selected={filters.endDate}
                  onChange={(date) => handleFilterChange('endDate', date)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cash Account</label>
                <select
                  value={filters.cashAccountId}
                  onChange={(e) => handleFilterChange('cashAccountId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Cash Accounts</option>
                  {cashAccounts.map(account => (
                    <option key={account.cash_sub_account_id} value={account.cash_sub_account_id}>
                      {account.account_head} - {account.sub_account_head}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                <select
                  value={filters.transactionType}
                  onChange={(e) => handleFilterChange('transactionType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Transactions</option>
                  <option value="receipts">Receipts Only</option>
                  <option value="payments">Payments Only</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Opening Balance</p>
                <p className="text-2xl font-bold text-blue-600">
                  SAR {summary.opening_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Receipts</p>
                <p className="text-2xl font-bold text-green-600">
                  SAR {summary.total_receipts.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500">{summary.receipt_count} transactions</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-red-600">
                  SAR {summary.total_payments.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500">{summary.payment_count} transactions</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Closing Balance</p>
                <p className={`text-2xl font-bold ${summary.closing_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  SAR {Math.abs(summary.closing_balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500">
                  Net: SAR {summary.net_cash_flow.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Wallet className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Cash Book Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-indigo-600 text-white text-sm font-semibold">
                <tr>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Voucher No</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">Counter Party</th>
                  <th className="px-6 py-3 text-right">Receipt</th>
                  <th className="px-6 py-3 text-right">Payment</th>
                  <th className="px-6 py-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mr-3"></div>
                        Loading transactions...
                      </div>
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      No transactions found for the selected period
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-900">
                        {new Date(transaction.transaction_date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {transaction.voucher_no || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-900 max-w-xs">
                        <div className="truncate" title={transaction.description}>
                          {transaction.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm max-w-xs">
                        <div className="truncate" title={transaction.counter_party}>
                          {transaction.counter_party || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">
                        {transaction.credit_amount > 0 ? 
                          `SAR ${parseFloat(transaction.credit_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 
                          '-'
                        }
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-red-600">
                        {transaction.debit_amount > 0 ? 
                          `SAR ${parseFloat(transaction.debit_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 
                          '-'
                        }
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        SAR {parseFloat(transaction.running_balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        <div className="text-xs text-gray-500">
                          {transaction.balance_type}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
                  title="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
                  title="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Configuration */}
      <ToastConfig />
    </div>
  );
};

export default CashBookPage;
