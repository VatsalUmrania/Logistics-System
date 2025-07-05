// import React, { useState, useEffect } from 'react';
// import { 
//   Calculator, Search, Printer, Calendar, ChevronLeft, ChevronRight,
//   ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert, RefreshCw,
//   FileText, Download, Eye, Filter, TrendingUp, TrendingDown, X, BarChart3
// } from 'lucide-react';
// import Select from 'react-select';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import ToastConfig from '../../components/ToastConfig';

// // Auth header utility
// const getAuthHeaders = () => {
//   const token = localStorage.getItem('authToken');
//   if (!token) {
//     console.warn('No authentication token found');
//     return {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     };
//   }
//   return {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     }
//   };
// };

// const BalanceSheet = () => {
//   // State management
//   const [asOfDate, setAsOfDate] = useState(() => {
//     return new Date().toISOString().split('T')[0];
//   });
//   const [balanceSheetData, setBalanceSheetData] = useState({
//     assets: [],
//     liabilities: [],
//     equity: [],
//     totals: {
//       assets: 0,
//       liabilities: 0,
//       equity: 0,
//       liabilities_equity: 0,
//       isBalanced: true
//     }
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [categories, setCategories] = useState([]);
//   const [fetchingCategories, setFetchingCategories] = useState(false);
//   const [trialBalance, setTrialBalance] = useState([]);
//   const [showTrialBalance, setShowTrialBalance] = useState(false);

//   // API Base URL
//   const API_BASE_URL = 'http://localhost:5000/api';

//   // Custom styles for react-select
//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       minHeight: '42px',
//       borderRadius: '8px',
//       borderColor: state.isFocused ? '#4F46E5' : '#d1d5db',
//       boxShadow: state.isFocused ? '0 0 0 3px rgba(79, 70, 229, 0.1)' : 'none',
//       '&:hover': {
//         borderColor: '#9ca3af'
//       }
//     }),
//     menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//     menu: (base) => ({ ...base, zIndex: 9999 })
//   };

//   // Fetch account categories
//   const fetchCategories = async () => {
//     try {
//       setFetchingCategories(true);
//       const response = await axios.get(`${API_BASE_URL}/balance-sheet/categories`, getAuthHeaders());
      
//       if (response.data.success) {
//         setCategories(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//       toast.error('Failed to fetch account categories');
//     } finally {
//       setFetchingCategories(false);
//     }
//   };

//   // Fetch balance sheet data
//   const fetchBalanceSheet = async (date = asOfDate) => {
//     if (!date) {
//       toast.error('Please select a date');
//       return;
//     }

//     setIsLoading(true);
//     setError('');
//     const loadingToast = toast.loading('Generating balance sheet...');
    
//     try {
//       console.log('Generating balance sheet for date:', date);

//       const response = await axios.get(`${API_BASE_URL}/balance-sheet`, {
//         ...getAuthHeaders(),
//         params: { asOf: date }
//       });
      
//       console.log('Balance sheet response:', response.data);
//       toast.dismiss(loadingToast);
      
//       if (response.data.success) {
//         setBalanceSheetData(response.data.data);
//         toast.success('Balance sheet generated successfully');
//       } else {
//         throw new Error(response.data.error || 'Failed to generate balance sheet');
//       }
//     } catch (error) {
//       toast.dismiss(loadingToast);
//       console.error('Error generating balance sheet:', error);
      
//       if (error.response?.status === 404) {
//         setError('No data found for the selected date');
//         toast.error('No data found for the selected date');
//       } else if (error.response?.status === 400) {
//         setError(error.response.data.error || 'Invalid request parameters');
//         toast.error(error.response.data.error || 'Invalid date format');
//       } else if (error.response?.status === 401) {
//         setError('Authentication failed. Please login again.');
//         toast.error('Session expired. Please login again.');
//         // Redirect to login
//         setTimeout(() => {
//           window.location.href = '/login';
//         }, 2000);
//       } else {
//         const errorMessage = error.response?.data?.error || error.message || 'Failed to generate balance sheet';
//         setError(errorMessage);
//         toast.error(errorMessage);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch trial balance
//   const fetchTrialBalance = async (date = asOfDate) => {
//     if (!date) {
//       toast.error('Please select a date');
//       return;
//     }

//     const loadingToast = toast.loading('Generating trial balance...');
    
//     try {
//       const response = await axios.get(`${API_BASE_URL}/balance-sheet/trial-balance`, {
//         ...getAuthHeaders(),
//         params: { asOf: date }
//       });
      
//       toast.dismiss(loadingToast);
      
//       if (response.data.success) {
//         setTrialBalance(response.data.data);
//         setShowTrialBalance(true);
//         toast.success('Trial balance generated successfully');
//       } else {
//         throw new Error(response.data.error || 'Failed to generate trial balance');
//       }
//     } catch (error) {
//       toast.dismiss(loadingToast);
//       console.error('Error generating trial balance:', error);
//       toast.error(error.response?.data?.error || 'Failed to generate trial balance');
//     }
//   };

//   // Initialize data
//   useEffect(() => {
//     fetchCategories();
//     fetchBalanceSheet();
//   }, []);

//   // Handle date change
//   const handleDateChange = (newDate) => {
//     setAsOfDate(newDate);
//     if (newDate) {
//       fetchBalanceSheet(newDate);
//     }
//   };

//   // Print handler
//   const handlePrint = () => {
//     if (!balanceSheetData.assets.length && !balanceSheetData.liabilities.length && !balanceSheetData.equity.length) {
//       toast.error('No data to print. Please generate a balance sheet first.');
//       return;
//     }
    
//     window.print();
//     toast.success('Print dialog opened');
//   };

//   // Export to CSV
//   const handleExportCSV = () => {
//     if (!balanceSheetData.assets.length && !balanceSheetData.liabilities.length && !balanceSheetData.equity.length) {
//       toast.error('No data to export. Please generate a balance sheet first.');
//       return;
//     }
    
//     const csvData = [];
//     csvData.push(['Balance Sheet', '', '']);
//     csvData.push(['As of', new Date(asOfDate).toLocaleDateString('en-GB'), '']);
//     csvData.push(['', '', '']);
    
//     // Assets
//     csvData.push(['ASSETS', '', '']);
//     balanceSheetData.assets.forEach(category => {
//       csvData.push([category.category, '', '']);
//       category.accounts.forEach(account => {
//         csvData.push(['', account.name, parseFloat(account.amount).toFixed(2)]);
//       });
//       csvData.push(['', `Total ${category.category}`, category.total.toFixed(2)]);
//       csvData.push(['', '', '']);
//     });
//     csvData.push(['TOTAL ASSETS', '', balanceSheetData.totals.assets.toFixed(2)]);
//     csvData.push(['', '', '']);
    
//     // Liabilities
//     csvData.push(['LIABILITIES', '', '']);
//     balanceSheetData.liabilities.forEach(category => {
//       csvData.push([category.category, '', '']);
//       category.accounts.forEach(account => {
//         csvData.push(['', account.name, parseFloat(account.amount).toFixed(2)]);
//       });
//       csvData.push(['', `Total ${category.category}`, category.total.toFixed(2)]);
//       csvData.push(['', '', '']);
//     });
    
//     // Equity
//     csvData.push(['EQUITY', '', '']);
//     balanceSheetData.equity.forEach(category => {
//       csvData.push([category.category, '', '']);
//       category.accounts.forEach(account => {
//         csvData.push(['', account.name, parseFloat(account.amount).toFixed(2)]);
//       });
//       csvData.push(['', `Total ${category.category}`, category.total.toFixed(2)]);
//       csvData.push(['', '', '']);
//     });
    
//     csvData.push(['TOTAL LIABILITIES AND EQUITY', '', balanceSheetData.totals.liabilities_equity.toFixed(2)]);
//     csvData.push(['', '', '']);
//     csvData.push(['Balance Check', balanceSheetData.totals.isBalanced ? 'BALANCED' : 'UNBALANCED', '']);
    
//     const csvContent = csvData.map(row => row.join(',')).join('\n');
    
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', `balance_sheet_${asOfDate}.csv`);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
    
//     toast.success('CSV file downloaded successfully');
//   };

//   // Render account section
//   const renderAccountSection = (title, categories, totalAmount) => (
//     <div className="mb-6">
//       <div className="bg-indigo-100 px-4 py-3 border-b border-gray-300">
//         <h3 className="font-bold text-indigo-800 uppercase text-lg">{title}</h3>
//       </div>
//       {categories.map((category, categoryIndex) => (
//         <div key={categoryIndex}>
//           <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
//             <h4 className="font-semibold text-gray-700">{category.category}</h4>
//           </div>
//           {category.accounts.map((account, index) => (
//             <div key={index} className="flex justify-between items-center px-4 py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors">
//               <span className="text-sm text-gray-800 flex-1">{account.name}</span>
//               <span className="text-sm font-medium text-gray-900 text-right min-w-[120px]">
//                 {parseFloat(account.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
//               </span>
//             </div>
//           ))}
//           <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
//             <div className="flex justify-between items-center">
//               <span className="font-semibold text-gray-700">Total {category.category}</span>
//               <span className="font-bold text-gray-900">
//                 {category.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
//               </span>
//             </div>
//           </div>
//         </div>
//       ))}
//       <div className="bg-indigo-50 px-4 py-3 border-b-2 border-indigo-200">
//         <div className="flex justify-between items-center">
//           <span className="font-bold text-indigo-800 text-lg">TOTAL {title.toUpperCase()}</span>
//           <span className="font-bold text-indigo-900 text-xl">
//             {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
//           </span>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
//                 <Calculator className="w-8 h-8 mr-3 text-indigo-600" />
//                 Balance Sheet
//               </h1>
//               <p className="text-gray-600 mt-2">Financial position statement from your logistics accounting system</p>
//             </div>
//             <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
//               <button
//                 onClick={() => fetchBalanceSheet(asOfDate)}
//                 disabled={isLoading}
//                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center shadow-md disabled:opacity-50"
//               >
//                 <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
//                 Refresh
//               </button>
//               <button
//                 onClick={() => fetchTrialBalance(asOfDate)}
//                 disabled={isLoading}
//                 className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center shadow-md disabled:opacity-50"
//               >
//                 <BarChart3 className="w-5 h-5 mr-2" />
//                 Trial Balance
//               </button>
//               {(balanceSheetData.assets.length > 0 || balanceSheetData.liabilities.length > 0 || balanceSheetData.equity.length > 0) && (
//                 <>
//                   <button
//                     onClick={handleExportCSV}
//                     className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center shadow-md"
//                   >
//                     <Download className="w-5 h-5 mr-2" />
//                     Export CSV
//                   </button>
//                   <button
//                     onClick={handlePrint}
//                     className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center shadow-md"
//                   >
//                     <Printer className="w-5 h-5 mr-2" />
//                     Print
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Date Selection */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
//             <div className="bg-indigo-50 p-4 border-b border-gray-200">
//               <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
//                 <Calendar className="w-5 h-5 mr-2" />
//                 SELECT DATE
//               </h2>
//             </div>
//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     As of Date <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Calendar className="w-5 h-5 text-gray-400" />
//                     </div>
//                     <input
//                       type="date"
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//                       value={asOfDate}
//                       onChange={(e) => handleDateChange(e.target.value)}
//                       max={new Date().toISOString().split('T')[0]}
//                     />
//                   </div>
//                 </div>
                
//                 <div className="flex items-end">
//                   <button
//                     onClick={() => fetchBalanceSheet(asOfDate)}
//                     disabled={isLoading || !asOfDate}
//                     className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-5 rounded-lg shadow transition text-sm flex items-center justify-center disabled:opacity-50"
//                   >
//                     {isLoading ? (
//                       <Loader className="w-4 h-4 animate-spin mr-2" />
//                     ) : (
//                       <Search className="w-4 h-4 mr-2" />
//                     )}
//                     {isLoading ? 'Generating...' : 'Generate Balance Sheet'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
//               <div className="flex items-center">
//                 <Alert className="w-5 h-5 text-red-500 mr-2" />
//                 <p className="text-red-700">{error}</p>
//               </div>
//             </div>
//           )}

//           {/* Trial Balance Modal */}
//           {showTrialBalance && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//               <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
//                 <div className="bg-purple-50 p-4 border-b border-gray-200 flex justify-between items-center">
//                   <h3 className="text-lg font-semibold text-purple-700">Trial Balance as of {new Date(asOfDate).toLocaleDateString('en-GB')}</h3>
//                   <button
//                     onClick={() => setShowTrialBalance(false)}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>
//                 <div className="p-6 overflow-auto max-h-[70vh]">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
//                         <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Opening Balance</th>
//                         <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Debit</th>
//                         <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Credit</th>
//                         <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Closing Balance</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {trialBalance.map((account, index) => (
//                         <tr key={index} className="hover:bg-gray-50">
//                           <td className="px-4 py-3 text-sm text-gray-900">{account.account_name}</td>
//                           <td className="px-4 py-3 text-sm text-right text-gray-900">
//                             {parseFloat(account.opening_balance).toFixed(2)} {account.opening_type}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-right text-gray-900">
//                             {parseFloat(account.total_debit).toFixed(2)}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-right text-gray-900">
//                             {parseFloat(account.total_credit).toFixed(2)}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
//                             {Math.abs(parseFloat(account.closing_balance)).toFixed(2)} {account.closing_type}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Date Range Header */}
//           {(balanceSheetData.assets.length > 0 || balanceSheetData.liabilities.length > 0 || balanceSheetData.equity.length > 0) && (
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
//               <div className="text-center">
//                 <h2 className="text-xl font-semibold text-gray-800">
//                   Balance Sheet as of {new Date(asOfDate).toLocaleDateString('en-GB')}
//                 </h2>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Generated from Journal Vouchers and Opening Balances
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Balance Sheet Content */}
//           {(balanceSheetData.assets.length > 0 || balanceSheetData.liabilities.length > 0 || balanceSheetData.equity.length > 0) ? (
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
//                 {/* Assets Column */}
//                 <div className="border-r border-gray-200">
//                   {renderAccountSection('ASSETS', balanceSheetData.assets, balanceSheetData.totals.assets)}
//                 </div>

//                 {/* Liabilities and Equity Column */}
//                 <div>
//                   {balanceSheetData.liabilities.length > 0 && 
//                     renderAccountSection('LIABILITIES', balanceSheetData.liabilities, balanceSheetData.totals.liabilities)
//                   }
//                   {balanceSheetData.equity.length > 0 && 
//                     renderAccountSection('EQUITY', balanceSheetData.equity, balanceSheetData.totals.equity)
//                   }
                  
//                   {/* Total Liabilities and Equity */}
//                   <div className="bg-blue-100 px-4 py-4 border-t-2 border-blue-300">
//                     <div className="flex justify-between items-center">
//                       <span className="font-bold text-blue-800 text-lg">TOTAL LIABILITIES AND EQUITY</span>
//                       <span className="font-bold text-blue-900 text-xl">
//                         {balanceSheetData.totals.liabilities_equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Balance Verification */}
//               <div className="bg-gray-100 px-6 py-4 border-t border-gray-300">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
//                   <div>
//                     <h3 className="text-sm font-medium text-gray-600">Total Assets</h3>
//                     <p className="text-2xl font-bold text-blue-600">
//                       {balanceSheetData.totals.assets.toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                     </p>
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-medium text-gray-600">Total Liabilities & Equity</h3>
//                     <p className="text-2xl font-bold text-green-600">
//                       {balanceSheetData.totals.liabilities_equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                     </p>
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-medium text-gray-600">Balance Check</h3>
//                     <p className={`text-2xl font-bold flex items-center justify-center ${
//                       balanceSheetData.totals.isBalanced ? 'text-green-600' : 'text-red-600'
//                     }`}>
//                       {balanceSheetData.totals.isBalanced ? (
//                         <>
//                           <Check className="w-6 h-6 mr-2" />
//                           BALANCED
//                         </>
//                       ) : (
//                         <>
//                           <Alert className="w-6 h-6 mr-2" />
//                           UNBALANCED
//                         </>
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : !isLoading && (
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
//               <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-500 mb-2">No Balance Sheet Data</h3>
//               <p className="text-gray-400">Select a date and generate a balance sheet to view financial position</p>
//               <p className="text-gray-400 text-sm mt-2">Data will be fetched from your journal vouchers and opening balances</p>
//             </div>
//           )}
//         </div>
//       </div>
      
//       {/* Toast Configuration */}
//       <ToastConfig />
//     </>
//   );
// };

// export default BalanceSheet;


import React, { useState, useEffect } from 'react';
import {
  Calculator, Search, Printer, Calendar, RefreshCw,
  Loader, Check, AlertCircle as Alert, Download, X, BarChart3
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';

// ---------- helpers -------------------------------------------------
const API_BASE_URL = 'http://localhost:5000/api';
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token
    ? { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    : { headers: { 'Content-Type': 'application/json' } };
};

// ---------- component ----------------------------------------------
const BalanceSheet = () => {
  /* ────────── state ────────── */
  const [asOfDate, setAsOfDate] = useState(() =>
    new Date().toISOString().substring(0, 10)
  );
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [trialBalance, setTrialBalance] = useState([]);
  const [showTrial, setShowTrial] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  /* ────────── side-effects ────────── */
  useEffect(() => {
    fetchBalanceSheet(asOfDate);
  }, []);

  /* ────────── api calls ────────── */
  const fetchBalanceSheet = async date => {
    if (!date) return toast.error('Select a valid date');
    setIsLoading(true);
    setErrMsg('');
    const toastId = toast.loading('Generating balance sheet…');
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/balance-sheet`,
        { ...getAuthHeaders(), params: { asOf: date } }
      );
      toast.dismiss(toastId);
      if (data.success) {
        setBalanceSheet(data.data);
        toast.success('Balance sheet ready');
      } else throw new Error(data.error);
    } catch (e) {
      toast.dismiss(toastId);
      setErrMsg(e.message);
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrialBalance = async date => {
    if (!date) return toast.error('Select a valid date');
    const toastId = toast.loading('Generating trial balance…');
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/balance-sheet/trial-balance`,
        { ...getAuthHeaders(), params: { asOf: date } }
      );
      toast.dismiss(toastId);
      if (data.success) {
        setTrialBalance(data.data);
        setShowTrial(true);
        toast.success('Trial balance ready');
      } else throw new Error(data.error);
    } catch (e) {
      toast.dismiss(toastId);
      toast.error(e.message);
    }
  };

  /* ────────── print function ────────── */
  const handlePrint = () => {
    if (!balanceSheet) {
      toast.error('No balance sheet data to print');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Balance Sheet - ${new Date(asOfDate).toLocaleDateString('en-GB')}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: Arial, sans-serif; 
              font-size: 12px; 
              line-height: 1.4; 
              color: #000;
              background: white;
              padding: 20px;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #000; 
              padding-bottom: 15px; 
            }
            .header h1 { 
              font-size: 24px; 
              font-weight: bold; 
              margin-bottom: 5px; 
            }
            .header p { 
              font-size: 14px; 
              color: #666; 
            }
            .balance-sheet { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 20px; 
              margin-bottom: 30px;
            }
            .section { 
              border: 1px solid #000; 
              page-break-inside: avoid;
            }
            .section-header { 
              background-color: #f0f0f0; 
              padding: 10px; 
              font-weight: bold; 
              font-size: 14px;
              border-bottom: 1px solid #000; 
              text-align: center;
            }
            .category-header { 
              background-color: #f8f8f8; 
              padding: 8px 10px; 
              font-weight: bold; 
              border-bottom: 1px solid #ccc; 
            }
            .account-row { 
              padding: 4px 10px; 
              border-bottom: 1px solid #eee; 
              display: flex; 
              justify-content: space-between; 
            }
            .account-row:last-child { 
              border-bottom: none; 
            }
            .category-total { 
              padding: 6px 10px; 
              font-weight: bold; 
              background-color: #f5f5f5; 
              border-bottom: 1px solid #ccc; 
              display: flex; 
              justify-content: space-between; 
            }
            .section-total { 
              padding: 10px; 
              font-weight: bold; 
              background-color: #e8e8e8; 
              border-top: 2px solid #000;
              display: flex; 
              justify-content: space-between; 
              font-size: 14px;
            }
            .grand-total { 
              padding: 12px; 
              font-weight: bold; 
              background-color: #d0d0d0; 
              border: 2px solid #000;
              display: flex; 
              justify-content: space-between; 
              font-size: 14px;
              margin-top: 10px;
            }
            .balance-check { 
              text-align: center; 
              margin-top: 20px; 
              padding: 10px;
              border: 1px solid #000;
              font-weight: bold;
              font-size: 14px;
            }
            .balanced { color: #008000; }
            .unbalanced { color: #ff0000; }
            .footer { 
              margin-top: 30px; 
              text-align: center; 
              font-size: 10px; 
              color: #666; 
              border-top: 1px solid #ccc; 
              padding-top: 10px;
            }
            @page { 
              margin: 1in; 
              size: A4; 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BALANCE SHEET</h1>
            <p>As of ${new Date(asOfDate).toLocaleDateString('en-GB')}</p>
            <p>Generated from Logistics Accounting System</p>
          </div>
          
          <div class="balance-sheet">
            <!-- Assets Column -->
            <div class="section">
              <div class="section-header">ASSETS</div>
              ${balanceSheet.assets.map(category => `
                <div class="category-header">${category.category}</div>
                ${category.accounts.map(account => `
                  <div class="account-row">
                    <span>${account.name}</span>
                    <span>${parseFloat(account.amount).toFixed(2)}</span>
                  </div>
                `).join('')}
                <div class="category-total">
                  <span>Total ${category.category}</span>
                  <span>${category.total.toFixed(2)}</span>
                </div>
              `).join('')}
              <div class="section-total">
                <span>TOTAL ASSETS</span>
                <span>${balanceSheet.totals.assets.toFixed(2)}</span>
              </div>
            </div>

            <!-- Liabilities and Equity Column -->
            <div class="section">
              <div class="section-header">LIABILITIES AND EQUITY</div>
              
              <!-- Liabilities -->
              ${balanceSheet.liabilities.map(category => `
                <div class="category-header">${category.category}</div>
                ${category.accounts.map(account => `
                  <div class="account-row">
                    <span>${account.name}</span>
                    <span>${parseFloat(account.amount).toFixed(2)}</span>
                  </div>
                `).join('')}
                <div class="category-total">
                  <span>Total ${category.category}</span>
                  <span>${category.total.toFixed(2)}</span>
                </div>
              `).join('')}
              
              <!-- Equity -->
              ${balanceSheet.equity.map(category => `
                <div class="category-header">${category.category}</div>
                ${category.accounts.map(account => `
                  <div class="account-row">
                    <span>${account.name}</span>
                    <span>${parseFloat(account.amount).toFixed(2)}</span>
                  </div>
                `).join('')}
                <div class="category-total">
                  <span>Total ${category.category}</span>
                  <span>${category.total.toFixed(2)}</span>
                </div>
              `).join('')}
              
              <div class="section-total">
                <span>TOTAL LIABILITIES AND EQUITY</span>
                <span>${balanceSheet.totals.liabilities_equity.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <!-- Balance Check -->
          <div class="balance-check ${balanceSheet.totals.isBalanced ? 'balanced' : 'unbalanced'}">
            Balance Check: ${balanceSheet.totals.isBalanced ? 'BALANCED ✓' : 'UNBALANCED ✗'}
          </div>

          <!-- Summary Table -->
          <table style="width: 100%; margin-top: 20px; border-collapse: collapse; border: 1px solid #000;">
            <thead>
              <tr style="background-color: #f0f0f0;">
                <th style="border: 1px solid #000; padding: 8px; text-align: left;">Summary</th>
                <th style="border: 1px solid #000; padding: 8px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #000; padding: 6px;">Total Assets</td>
                <td style="border: 1px solid #000; padding: 6px; text-align: right; font-weight: bold;">${balanceSheet.totals.assets.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 6px;">Total Liabilities</td>
                <td style="border: 1px solid #000; padding: 6px; text-align: right;">${balanceSheet.totals.liabilities.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 6px;">Total Equity</td>
                <td style="border: 1px solid #000; padding: 6px; text-align: right;">${balanceSheet.totals.equity.toFixed(2)}</td>
              </tr>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td style="border: 1px solid #000; padding: 6px;">Total Liabilities & Equity</td>
                <td style="border: 1px solid #000; padding: 6px; text-align: right;">${balanceSheet.totals.liabilities_equity.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <p>Logistics Management System - Balance Sheet Report</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    
    toast.success('Print dialog opened');
  };

  /* ────────── utilities ────────── */
  const section = (title, blocks, grandTotal) => (
    <section className="mb-6">
      <header className="bg-indigo-100 px-4 py-2 font-bold text-indigo-800">
        {title}
      </header>
      {blocks.map(cat => (
        <div key={cat.category}>
          <div className="bg-gray-100 px-4 py-1 font-semibold">{cat.category}</div>
          {cat.accounts.map(ac => (
            <div
              key={ac.name}
              className="flex justify-between px-4 py-1 text-sm border-b last:border-b-0 hover:bg-gray-50"
            >
              <span>{ac.name}</span>
              <span>{(+ac.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
          <div className="flex justify-between px-4 py-1 bg-gray-50 font-semibold">
            <span>Total {cat.category}</span>
            <span>{cat.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      ))}
      <footer className="flex justify-between px-4 py-2 bg-blue-50 font-bold border-t-2 border-blue-300">
        <span>TOTAL {title}</span>
        <span>{grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
      </footer>
    </section>
  );

  /* ────────── render ────────── */
  return (
    <>
      {/* ------------- page actions ------------- */}
      <div className="bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Calculator className="w-8 h-8 text-indigo-600" />
              Balance Sheet
            </h1>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => fetchBalanceSheet(asOfDate)}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center shadow-md disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <button
                onClick={() => fetchTrialBalance(asOfDate)}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center shadow-md disabled:opacity-50"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Trial Balance
              </button>

              {balanceSheet && (
                <>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center shadow-md"
                  >
                    <Printer className="w-5 h-5 mr-2" />
                    Print
                  </button>

                  <button
                    onClick={() => exportCSV(balanceSheet, asOfDate)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center shadow-md"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Export CSV
                  </button>
                </>
              )}
            </div>
          </header>

          {/* date picker */}
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              As of Date <span className="text-red-500">*</span>
            </label>
            <div className="relative max-w-xs">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={asOfDate}
                onChange={e => {
                  setAsOfDate(e.target.value);
                  fetchBalanceSheet(e.target.value);
                }}
                max={new Date().toISOString().substring(0, 10)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {errMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded flex items-center">
              <Alert className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{errMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* ------------- balance sheet display ------------- */}
      {balanceSheet && (
        <div className="max-w-7xl mx-auto bg-white shadow-sm border rounded-xl">
          <div className="p-6">
            <h2 className="text-center font-semibold text-xl mb-2">
              BALANCE SHEET
            </h2>
            <p className="text-center text-sm text-gray-600 mb-6">
              As of {new Date(asOfDate).toLocaleDateString('en-GB')}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Assets Column */}
              <div className="border-r border-gray-200">
                {section('ASSETS', balanceSheet.assets, balanceSheet.totals.assets)}
              </div>

              {/* Liabilities and Equity Column */}
              <div className="flex flex-col">
                {balanceSheet.liabilities.length > 0 && 
                  section('LIABILITIES', balanceSheet.liabilities, balanceSheet.totals.liabilities)
                }
                {balanceSheet.equity.length > 0 && 
                  section('EQUITY', balanceSheet.equity, balanceSheet.totals.equity)
                }
                <footer className="mt-auto bg-blue-50 px-4 py-3 font-bold border-t-2 border-blue-300">
                  <div className="flex justify-between">
                    <span>TOTAL LIABILITIES & EQUITY</span>
                    <span>
                      {balanceSheet.totals.liabilities_equity.toLocaleString('en-US', {
                        minimumFractionDigits: 2
                      })}
                    </span>
                  </div>
                </footer>
              </div>
            </div>

            {/* balance verification */}
            <div className="bg-gray-100 px-6 py-4 border-t border-gray-300 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Total Assets</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {balanceSheet.totals.assets.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Total Liabilities & Equity</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {balanceSheet.totals.liabilities_equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Balance Check</h3>
                  <p className={`text-2xl font-bold flex items-center justify-center ${
                    balanceSheet.totals.isBalanced ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {balanceSheet.totals.isBalanced ? (
                      <>
                        <Check className="w-6 h-6 mr-2" />
                        BALANCED
                      </>
                    ) : (
                      <>
                        <Alert className="w-6 h-6 mr-2" />
                        UNBALANCED
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* no data state */}
      {!balanceSheet && !isLoading && (
        <div className="max-w-7xl mx-auto bg-white shadow-sm border rounded-xl p-12 text-center">
          <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No Balance Sheet Data</h3>
          <p className="text-gray-400">Select a date and generate a balance sheet to view financial position</p>
          <p className="text-gray-400 text-sm mt-2">Data will be fetched from your journal vouchers and opening balances</p>
        </div>
      )}

      {/* trial-balance modal */}
      {showTrial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-purple-50 p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-purple-700">
                Trial Balance as of {new Date(asOfDate).toLocaleDateString('en-GB')}
              </h3>
              <button
                onClick={() => setShowTrial(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-auto max-h-[70vh]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Opening Balance</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Debit</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Credit</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Closing Balance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trialBalance.map((account, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{account.account_name}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {parseFloat(account.opening_balance).toFixed(2)} {account.opening_type}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {parseFloat(account.total_debit).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {parseFloat(account.total_credit).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                        {Math.abs(parseFloat(account.closing_balance)).toFixed(2)} {account.closing_type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* global toaster */}
      <ToastConfig />
    </>
  );
};

export default BalanceSheet;

/* ---------- CSV export helper ---------- */
function exportCSV(bs, date) {
  const rows = [];
  rows.push(['Balance Sheet', '', '']);
  rows.push(['Date', new Date(date).toLocaleDateString('en-GB'), ''], ['', '', '']);

  const pushBlock = (label, blocks, grand) => {
    rows.push([label.toUpperCase(), '', '']);
    blocks.forEach(c => {
      rows.push([c.category, '', '']);
      c.accounts.forEach(a => rows.push(['', a.name, (+a.amount).toFixed(2)]));
      rows.push(['', `Total ${c.category}`, c.total.toFixed(2)], ['', '', '']);
    });
    rows.push([`TOTAL ${label.toUpperCase()}`, '', grand.toFixed(2)], ['', '', '']);
  };

  pushBlock('Assets', bs.assets, bs.totals.assets);
  pushBlock('Liabilities', bs.liabilities, bs.totals.liabilities);
  pushBlock('Equity', bs.equity, bs.totals.equity);
  rows.push(['TOTAL L & E', '', bs.totals.liabilities_equity.toFixed(2)]);
  rows.push(['Balanced', bs.totals.isBalanced ? 'Yes' : 'No', '']);

  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `balance_sheet_${date}.csv`;
  link.click();
  
  toast.success('CSV file downloaded successfully');
}
