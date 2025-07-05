// import React, { useState, useEffect } from 'react';
// import { 
//   FileText, Search, Printer, ChevronLeft, ChevronRight, X, 
//   ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert
// } from 'lucide-react';
// import Select from 'react-select';

// // Auth headers utility
// const getAuthHeaders = () => {
//   const token = localStorage.getItem('authToken');
//   if (!token) throw new Error('Authentication token missing');
//   return {
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json'
//   };
// };

// const API_URL = 'http://localhost:5000/api';
// const SUPPLIERS_URL = `${API_URL}/suppliers`;
// const ASSIGNMENTS_URL = `${API_URL}/supplier-assignments`;
// const PAYMENTS_URL = `${API_URL}/supplier-payment`;
// const PAGE_SIZE = 10;

// const SupplierStatement = () => {
//   // State management
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [supplierId, setSupplierId] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isInitialLoading, setIsInitialLoading] = useState(true);
//   const [statements, setStatements] = useState([]);
//   const [showResults, setShowResults] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [suppliers, setSuppliers] = useState([]);
//   const [allAssignments, setAllAssignments] = useState([]);
//   const [allPayments, setAllPayments] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortColumn, setSortColumn] = useState('date');
//   const [sortOrder, setSortOrder] = useState('asc');

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

//   // Fetch suppliers, assignments, payments on mount
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setIsInitialLoading(true);

//         // Suppliers
//         const suppliersRes = await fetch(SUPPLIERS_URL, { headers: getAuthHeaders() });
//         const suppliersData = await suppliersRes.json();
//         setSuppliers(Array.isArray(suppliersData) ? suppliersData : (suppliersData.data || []));

//         // Assignments (Invoices)
//         const assignmentsRes = await fetch(ASSIGNMENTS_URL, { headers: getAuthHeaders() });
//         const assignmentsData = await assignmentsRes.json();
//         setAllAssignments(assignmentsData.data || []);

//         // Payments
//         const paymentsRes = await fetch(PAYMENTS_URL, { headers: getAuthHeaders() });
//         const paymentsData = await paymentsRes.json();
//         setAllPayments(Array.isArray(paymentsData) ? paymentsData : (paymentsData.data || []));
//       } catch (error) {
//         setError('Failed to load initial data. Please try again later.');
//       } finally {
//         setIsInitialLoading(false);
//       }
//     };
//     fetchInitialData();
//   }, []);

//   // Format as currency
//   const formatAmount = (value) => {
//     if (!value && value !== 0) return '-';
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'SAR',
//       minimumFractionDigits: 2
//     }).format(value);
//   };

//   // Get supplier name by ID
//   const getSupplierName = (id) => {
//     const supplier = suppliers.find(s => String(s.id) === String(id));
//     return supplier ? supplier.name : `Supplier ${id}`;
//   };

//   // Search handler
//   const handleSearch = () => {
//     if (!fromDate || !toDate) {
//       setError('Please select both From and To dates');
//       return;
//     }
//     if (!supplierId) {
//       setError('Please select a Supplier');
//       return;
//     }
//     setIsLoading(true);
//     setShowResults(false);
//     setError('');

//     try {
//       // Filter assignments by date and supplier
//       const filteredAssignments = allAssignments.filter(assignment => {
//         const assignmentDate = assignment.invoice_date?.split('T')[0];
//         return (
//           String(assignment.supplier_id) === String(supplierId) &&
//           assignmentDate >= fromDate &&
//           assignmentDate <= toDate
//         );
//       });

//       // Filter payments by date and supplier
//       const filteredPayments = allPayments.filter(payment => {
//         const paymentDate = payment.payment_date?.split('T')[0];
//         return (
//           String(payment.supplier_id) === String(supplierId) &&
//           paymentDate >= fromDate &&
//           paymentDate <= toDate
//         );
//       });

//       // Convert to unified statement format
//       const assignmentStatements = filteredAssignments.map(a => ({
//         id: `A${a.id}`,
//         date: a.invoice_date?.split('T')[0],
//         type: 'Invoice',
//         refNo: a.supplier_invoice_no,
//         description: a.job_number,
//         debit: parseFloat(a.bill_total_with_vat) || 0,
//         credit: 0,
//         balance: 0,
//       }));

//       const paymentStatements = filteredPayments.map(p => ({
//         id: `P${p.id}`,
//         date: p.payment_date?.split('T')[0],
//         type: 'Payment',
//         refNo: p.voucher_no,
//         description: p.remarks,
//         debit: 0,
//         credit: parseFloat(p.amount) || 0,
//         balance: 0,
//       }));

//       // Merge, sort, calculate running balance
//       const merged = [...assignmentStatements, ...paymentStatements]
//         .sort((a, b) => new Date(a.date) - new Date(b.date));

//       let runningBalance = 0;
//       const withBalance = merged.map(s => {
//         runningBalance += s.debit - s.credit;
//         return { ...s, balance: runningBalance };
//       });

//       setStatements(withBalance);
//       setShowResults(true);
//       setSuccessMessage('Statement generated successfully!');
//       setTimeout(() => setSuccessMessage(''), 3000);
//     } catch (error) {
//       setError('Failed to generate statement. Please try again.');
//       setStatements([]);
//       setShowResults(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePrint = () => window.print();

//   // Sorting handler
//   const handleSort = (column) => {
//     if (sortColumn === column) {
//       setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
//     } else {
//       setSortColumn(column);
//       setSortOrder('asc');
//     }
//     setCurrentPage(1);
//   };

//   // Render sort icon
//   const renderSortIcon = (column) => {
//     if (sortColumn !== column) return <ArrowUp className="w-3 h-3 text-gray-400 inline" />;
//     return sortOrder === 'asc' ?
//       <ArrowUp className="w-3 h-3 text-indigo-600 inline" /> :
//       <ArrowDown className="w-3 h-3 text-indigo-600 inline" />;
//   };

//   // Sorting and pagination
//   const sortedStatements = [...statements].sort((a, b) => {
//     let valA, valB;
//     if (sortColumn === 'date') {
//       valA = new Date(a.date);
//       valB = new Date(b.date);
//     } else if (sortColumn === 'debit' || sortColumn === 'credit' || sortColumn === 'balance') {
//       valA = parseFloat(a[sortColumn]) || 0;
//       valB = parseFloat(b[sortColumn]) || 0;
//     } else {
//       valA = a[sortColumn] ? a[sortColumn].toLowerCase() : '';
//       valB = b[sortColumn] ? b[sortColumn].toLowerCase() : '';
//     }
//     if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
//     if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
//     return 0;
//   });

//   // Pagination
//   const totalPages = Math.ceil(sortedStatements.length / PAGE_SIZE);
//   const paginatedStatements = sortedStatements.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

//   // Prepare options for dropdowns
//   const supplierOptions = suppliers.map(supplier => ({
//     value: supplier.id,
//     label: supplier.name
//   }));

//   // Calculate totals
//   const getTotalDebit = () => {
//     return statements.reduce((sum, s) => sum + (s.debit || 0), 0);
//   };

//   const getTotalCredit = () => {
//     return statements.reduce((sum, s) => sum + (s.credit || 0), 0);
//   };

//   const getFinalBalance = () => {
//     return statements.length > 0 ? statements[statements.length - 1].balance : 0;
//   };

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [statements]);

//   if (isInitialLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
//           <p className="mt-4 text-gray-600">Loading supplier statement data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header - Matching AssignExpenses */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
//               <FileText className="w-8 h-8 mr-3 text-indigo-600" />
//               Supplier Statement Management
//             </h1>
//             <p className="text-gray-600 mt-2">Generate and view supplier statements with invoices and payments</p>
//           </div>
//           <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
//             <button
//               onClick={handlePrint}
//               disabled={!showResults || statements.length === 0}
//               className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <Printer className="w-5 h-5 mr-2" />
//               Print Statement
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
//               SEARCH SUPPLIER STATEMENTS
//             </h2>
//           </div>
//           <div className="p-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   From Date <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   value={fromDate}
//                   onChange={(e) => setFromDate(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   To Date <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   value={toDate}
//                   onChange={(e) => setToDate(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Supplier <span className="text-red-500">*</span>
//                 </label>
//                 <Select
//                   options={supplierOptions}
//                   value={supplierOptions.find(option => option.value == supplierId)}
//                   onChange={(selectedOption) => setSupplierId(selectedOption?.value || '')}
//                   placeholder="Select Supplier"
//                   isSearchable
//                   menuPortalTarget={document.body}
//                   menuPosition="fixed"
//                   styles={selectStyles}
//                   className="w-full text-sm"
//                 />
//               </div>
//             </div>
            
//             <div className="mt-4 flex justify-end">
//               <button
//                 onClick={handleSearch}
//                 disabled={isLoading}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm disabled:opacity-50 flex items-center"
//               >
//                 {isLoading ? (
//                   <Loader className="w-4 h-4 animate-spin mr-2" />
//                 ) : (
//                   <Search className="w-4 h-4 mr-2" />
//                 )}
//                 {isLoading ? 'Searching...' : 'Generate Statement'}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Statement Summary */}
//         {showResults && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
//             <div className="flex justify-between items-center">
//               <h2 className="text-lg font-semibold text-gray-800">Statement Summary</h2>
//               <div className="text-sm font-medium text-gray-700">
//                 Period: <span className="font-bold">{fromDate} to {toDate}</span> | 
//                 Supplier: <span className="text-indigo-600 font-bold">{getSupplierName(supplierId)}</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Statement Table */}
//         {showResults && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     {[
//                       { label: 'Date', key: 'date' },
//                       { label: 'Type', key: 'type' },
//                       { label: 'Reference No', key: 'refNo' },
//                       { label: 'Description', key: 'description' },
//                       { label: 'Debit', key: 'debit' },
//                       { label: 'Credit', key: 'credit' },
//                       { label: 'Balance', key: 'balance' },
//                     ].map(({ label, key }) => (
//                       <th
//                         key={label}
//                         className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                         onClick={() => handleSort(key)}
//                       >
//                         <div className="flex items-center">
//                           {label}
//                           {renderSortIcon(key)}
//                         </div>
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {paginatedStatements.length === 0 ? (
//                     <tr>
//                       <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
//                         No statement records found for the selected criteria
//                       </td>
//                     </tr>
//                   ) : (
//                     paginatedStatements.map((statement) => (
//                       <tr key={statement.id} className="hover:bg-gray-50 transition">
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                           {statement.date}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm">
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                             statement.type === 'Invoice' 
//                               ? 'bg-red-100 text-red-800' 
//                               : 'bg-green-100 text-green-800'
//                           }`}>
//                             {statement.type}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                           {statement.refNo}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                           {statement.description || 'N/A'}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-600">
//                           {statement.debit > 0 ? formatAmount(statement.debit) : '-'}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
//                           {statement.credit > 0 ? formatAmount(statement.credit) : '-'}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-indigo-800">
//                           {formatAmount(statement.balance)}
//                         </td>
//                       </tr>
//                     ))
//                   )}
                  
//                   {/* Totals Row */}
//                   {paginatedStatements.length > 0 && (
//                     <tr className="bg-gray-100 font-bold">
//                       <td colSpan={4} className="px-4 py-3 text-right text-sm font-bold text-gray-800">
//                         Total:
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-red-700">
//                         {formatAmount(getTotalDebit())}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-700">
//                         {formatAmount(getTotalCredit())}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-indigo-900">
//                         {formatAmount(getFinalBalance())}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
            
//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
//                 <div className="text-sm text-gray-700 mb-2 md:mb-0">
//                   Showing {((currentPage - 1) * PAGE_SIZE) + 1} to{' '}
//                   {Math.min(currentPage * PAGE_SIZE, sortedStatements.length)} of {sortedStatements.length} records
//                 </div>
//                 <div className="flex items-center">
//                   <div className="flex space-x-1">
//                     <button
//                       onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                       disabled={currentPage === 1}
//                       className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
//                       title="Previous"
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                       disabled={currentPage === totalPages}
//                       className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
//                       title="Next"
//                     >
//                       <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="hidden md:block text-sm font-medium text-gray-700">
//                   Balance: <span className="text-indigo-600 font-bold">{formatAmount(getFinalBalance())}</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SupplierStatement;


import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Printer, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert,
  AlertTriangle, Calendar, TrendingUp, TrendingDown
} from 'lucide-react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';

// Auth headers utility
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.warn('No authentication token found');
    return {
      'Content-Type': 'application/json'
    };
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const API_URL = 'http://localhost:5000/api';
const SUPPLIERS_URL = `${API_URL}/suppliers`;
const ASSIGNMENTS_URL = `${API_URL}/supplier-assignments`;
const PAYMENTS_URL = `${API_URL}/supplier-payment`;
const PAGE_SIZE = 10;

const SupplierStatement = () => {
  // State management
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [statements, setStatements] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');

  // Custom styles for react-select dropdowns
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

  // Enhanced error handling with emojis and specific error types
  const handleAuthError = (error) => {
    console.error('API Error:', error);
    
    if (error.message.includes('401') || error.message.includes('Authentication')) {
      toast.error('🔐 Authentication failed. Please login again.');
    } else if (error.message.includes('404')) {
      toast.error('🔍 API endpoint not found. Please check if the server is running.');
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('Network Error')) {
      toast.error('🌐 Cannot connect to server. Please ensure the backend server is running on port 5000.');
    } else if (error.message.includes('500')) {
      toast.error('⚠️ Server error occurred. Please try again later.');
    } else {
      toast.error(`❌ ${error.message || 'An unexpected error occurred'}`);
    }
  };

  // Enhanced validation with custom warning toasts
  const validateSearchForm = () => {
    const errors = [];
    
    if (!fromDate) {
      errors.push('From date is required');
    }
    
    if (!toDate) {
      errors.push('To date is required');
    }
    
    if (!supplierId) {
      errors.push('Please select a supplier');
    }
    
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      errors.push('From date cannot be later than To date');
    }
    
    if (errors.length > 0) {
      errors.forEach(error => {
        // Using custom warning toast with ToastConfig styling
        toast((t) => (
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        ), {
          duration: 4500,
          style: {
            background: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%)',
            color: '#ffffff',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1)',
          },
        });
      });
      return false;
    }
    
    return true;
  };

  // Enhanced fetch with detailed feedback
  const fetchInitialData = async () => {
    try {
      setIsInitialLoading(true);
      const loadingToast = toast.loading('🔄 Loading supplier statement data...');

      // Fetch suppliers
      const suppliersRes = await fetch(SUPPLIERS_URL, { headers: getAuthHeaders() });
      if (!suppliersRes.ok) throw new Error(`Failed to fetch suppliers: ${suppliersRes.status}`);
      const suppliersData = await suppliersRes.json();
      const suppliersList = Array.isArray(suppliersData) ? suppliersData : (suppliersData.data || []);
      setSuppliers(suppliersList);

      // Fetch assignments
      const assignmentsRes = await fetch(ASSIGNMENTS_URL, { headers: getAuthHeaders() });
      if (!assignmentsRes.ok) throw new Error(`Failed to fetch assignments: ${assignmentsRes.status}`);
      const assignmentsData = await assignmentsRes.json();
      setAllAssignments(assignmentsData.data || []);

      // Fetch payments
      const paymentsRes = await fetch(PAYMENTS_URL, { headers: getAuthHeaders() });
      if (!paymentsRes.ok) throw new Error(`Failed to fetch payments: ${paymentsRes.status}`);
      const paymentsData = await paymentsRes.json();
      setAllPayments(Array.isArray(paymentsData) ? paymentsData : (paymentsData.data || []));

      toast.dismiss(loadingToast);
      
      // Success feedback with data counts
      toast((t) => (
        <div className="flex items-center">
          <Check className="w-5 h-5 mr-2" />
          Loaded {suppliersList.length} suppliers, {assignmentsData.data?.length || 0} assignments, {Array.isArray(paymentsData) ? paymentsData.length : paymentsData.data?.length || 0} payments
        </div>
      ), {
        duration: 3000,
      });

    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('❌ Failed to load initial data. Please refresh the page.');
      handleAuthError(error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  // Fetch initial data on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Format as currency
  const formatAmount = (value) => {
    if (!value && value !== 0) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Get supplier name by ID
  const getSupplierName = (id) => {
    const supplier = suppliers.find(s => String(s.id) === String(id));
    return supplier ? supplier.name : `Supplier ${id}`;
  };

  // Enhanced search handler with detailed feedback
  const handleSearch = async () => {
    if (!validateSearchForm()) {
      return;
    }

    const supplierName = getSupplierName(supplierId);
    const loadingToast = toast.loading(`📊 Generating statement for ${supplierName}...`);
    
    setIsLoading(true);
    setShowResults(false);

    try {
      // Filter assignments by date and supplier
      const filteredAssignments = allAssignments.filter(assignment => {
        const assignmentDate = assignment.invoice_date?.split('T')[0];
        return (
          String(assignment.supplier_id) === String(supplierId) &&
          assignmentDate >= fromDate &&
          assignmentDate <= toDate
        );
      });

      // Filter payments by date and supplier
      const filteredPayments = allPayments.filter(payment => {
        const paymentDate = payment.payment_date?.split('T')[0];
        return (
          String(payment.supplier_id) === String(supplierId) &&
          paymentDate >= fromDate &&
          paymentDate <= toDate
        );
      });

      // Convert to unified statement format
      const assignmentStatements = filteredAssignments.map(a => ({
        id: `A${a.id}`,
        date: a.invoice_date?.split('T')[0],
        type: 'Invoice',
        refNo: a.supplier_invoice_no,
        description: a.job_number,
        debit: parseFloat(a.bill_total_with_vat) || 0,
        credit: 0,
        balance: 0,
      }));

      const paymentStatements = filteredPayments.map(p => ({
        id: `P${p.id}`,
        date: p.payment_date?.split('T')[0],
        type: 'Payment',
        refNo: p.voucher_no,
        description: p.remarks,
        debit: 0,
        credit: parseFloat(p.amount) || 0,
        balance: 0,
      }));

      // Merge, sort, calculate running balance
      const merged = [...assignmentStatements, ...paymentStatements]
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      let runningBalance = 0;
      const withBalance = merged.map(s => {
        runningBalance += s.debit - s.credit;
        return { ...s, balance: runningBalance };
      });

      setStatements(withBalance);
      setShowResults(true);
      toast.dismiss(loadingToast);

      // Enhanced success feedback with statistics
      const totalInvoices = filteredAssignments.length;
      const totalPayments = filteredPayments.length;
      const finalBalance = withBalance.length > 0 ? withBalance[withBalance.length - 1].balance : 0;

      if (withBalance.length === 0) {
        // No data found warning
        toast((t) => (
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            No transactions found for {supplierName} in the selected period
          </div>
        ), {
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%)',
            color: '#ffffff',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1)',
          },
        });
      } else {
        // Success with detailed stats
        toast((t) => (
          <div className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Statement generated: {totalInvoices} invoices, {totalPayments} payments
          </div>
        ), {
          duration: 3000,
        });

        // Balance indicator toast
        setTimeout(() => {
          if (finalBalance > 0) {
            toast((t) => (
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Outstanding balance: {formatAmount(finalBalance)}
              </div>
            ), {
              duration: 4000,
              style: {
                background: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%)',
                color: '#ffffff',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1)',
              },
            });
          } else if (finalBalance < 0) {
            toast((t) => (
              <div className="flex items-center">
                <TrendingDown className="w-5 h-5 mr-2" />
                Credit balance: {formatAmount(Math.abs(finalBalance))}
              </div>
            ), {
              duration: 4000,
            });
          }
        }, 1000);
      }

    } catch (error) {
      console.error('Error generating statement:', error);
      toast.dismiss(loadingToast);
      toast.error(`❌ Failed to generate statement for ${supplierName}`);
      setStatements([]);
      setShowResults(true);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced print handler with feedback
  const handlePrint = () => {
    if (!showResults || statements.length === 0) {
      toast((t) => (
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          No statement data to print
        </div>
      ), {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%)',
          color: '#ffffff',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1)',
        },
      });
      return;
    }

    // Print preparation toast
    toast((t) => (
      <div className="flex items-center">
        <Printer className="w-5 h-5 mr-2" />
        Preparing statement for printing...
      </div>
    ), {
      duration: 2000,
    });

    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Date change handlers with validation feedback
  const handleFromDateChange = (date) => {
    setFromDate(date);
    if (toDate && date && new Date(date) > new Date(toDate)) {
      toast((t) => (
        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          From date adjusted - cannot be later than To date
        </div>
      ), {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%)',
          color: '#ffffff',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1)',
        },
      });
    }
  };

  const handleToDateChange = (date) => {
    setToDate(date);
    if (fromDate && date && new Date(fromDate) > new Date(date)) {
      toast((t) => (
        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          To date adjusted - cannot be earlier than From date
        </div>
      ), {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%)',
          color: '#ffffff',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1)',
        },
      });
    }
  };

  // Supplier selection handler with feedback
  const handleSupplierChange = (selectedOption) => {
    setSupplierId(selectedOption?.value || '');
    if (selectedOption) {
      toast((t) => (
        <div className="flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Selected: {selectedOption.label}
        </div>
      ), {
        duration: 2000,
      });
    }
  };

  // Sorting handler
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);

    // Sort feedback
    toast((t) => (
      <div className="flex items-center">
        <ArrowUp className="w-4 h-4 mr-2" />
        Sorted by {column} ({sortOrder === 'asc' ? 'descending' : 'ascending'})
      </div>
    ), {
      duration: 1500,
    });
  };

  // Render sort icon
  const renderSortIcon = (column) => {
    if (sortColumn !== column) return <ArrowUp className="w-3 h-3 text-gray-400 inline" />;
    return sortOrder === 'asc' ?
      <ArrowUp className="w-3 h-3 text-indigo-600 inline" /> :
      <ArrowDown className="w-3 h-3 text-indigo-600 inline" />;
  };

  // Sorting and pagination
  const sortedStatements = [...statements].sort((a, b) => {
    let valA, valB;
    if (sortColumn === 'date') {
      valA = new Date(a.date);
      valB = new Date(b.date);
    } else if (sortColumn === 'debit' || sortColumn === 'credit' || sortColumn === 'balance') {
      valA = parseFloat(a[sortColumn]) || 0;
      valB = parseFloat(b[sortColumn]) || 0;
    } else {
      valA = a[sortColumn] ? a[sortColumn].toLowerCase() : '';
      valB = b[sortColumn] ? b[sortColumn].toLowerCase() : '';
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedStatements.length / PAGE_SIZE);
  const paginatedStatements = sortedStatements.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Prepare options for dropdowns
  const supplierOptions = suppliers.map(supplier => ({
    value: supplier.id,
    label: supplier.name
  }));

  // Calculate totals
  const getTotalDebit = () => {
    return statements.reduce((sum, s) => sum + (s.debit || 0), 0);
  };

  const getTotalCredit = () => {
    return statements.reduce((sum, s) => sum + (s.credit || 0), 0);
  };

  const getFinalBalance = () => {
    return statements.length > 0 ? statements[statements.length - 1].balance : 0;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [statements]);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading supplier statement data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Toast Configuration */}
      <ToastConfig position="bottom-right" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              Supplier Statement Management
            </h1>
            <p className="text-gray-600 mt-2">Generate and view supplier statements with invoices and payments</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              disabled={!showResults || statements.length === 0}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print Statement
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH SUPPLIER STATEMENTS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => handleFromDateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => handleToDateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier <span className="text-red-500">*</span>
                </label>
                <Select
                  options={supplierOptions}
                  value={supplierOptions.find(option => option.value == supplierId)}
                  onChange={handleSupplierChange}
                  placeholder="Select Supplier"
                  isSearchable
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={selectStyles}
                  className="w-full text-sm"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm disabled:opacity-50 flex items-center"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Generating...' : 'Generate Statement'}
              </button>
            </div>
          </div>
        </div>

        {/* Statement Summary */}
        {showResults && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Statement Summary</h2>
              <div className="text-sm font-medium text-gray-700">
                Period: <span className="font-bold">{fromDate} to {toDate}</span> | 
                Supplier: <span className="text-indigo-600 font-bold">{getSupplierName(supplierId)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Statement Table */}
        {showResults && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      { label: 'Date', key: 'date' },
                      { label: 'Type', key: 'type' },
                      { label: 'Reference No', key: 'refNo' },
                      { label: 'Description', key: 'description' },
                      { label: 'Debit', key: 'debit' },
                      { label: 'Credit', key: 'credit' },
                      { label: 'Balance', key: 'balance' },
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
                  {paginatedStatements.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="w-16 h-16 text-gray-300 mb-4" />
                          <h4 className="text-lg font-medium text-gray-500">No statement records found</h4>
                          <p className="text-gray-400 mt-2">
                            No transactions found for the selected criteria
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedStatements.map((statement) => (
                      <tr key={statement.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {statement.date}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statement.type === 'Invoice' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {statement.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {statement.refNo}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {statement.description || 'N/A'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-600">
                          {statement.debit > 0 ? formatAmount(statement.debit) : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                          {statement.credit > 0 ? formatAmount(statement.credit) : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-indigo-800">
                          {formatAmount(statement.balance)}
                        </td>
                      </tr>
                    ))
                  )}
                  
                  {/* Totals Row */}
                  {paginatedStatements.length > 0 && (
                    <tr className="bg-gray-100 font-bold">
                      <td colSpan={4} className="px-4 py-3 text-right text-sm font-bold text-gray-800">
                        Total:
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-red-700">
                        {formatAmount(getTotalDebit())}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-700">
                        {formatAmount(getTotalCredit())}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-indigo-900">
                        {formatAmount(getFinalBalance())}
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
                  Showing {((currentPage - 1) * PAGE_SIZE) + 1} to{' '}
                  {Math.min(currentPage * PAGE_SIZE, sortedStatements.length)} of {sortedStatements.length} records
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
                  Balance: <span className="text-indigo-600 font-bold">{formatAmount(getFinalBalance())}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierStatement;
