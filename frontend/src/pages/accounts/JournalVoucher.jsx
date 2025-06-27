// import React, { useState, useEffect } from 'react';
// import {
//   FileText, Search, Printer, Calendar, Plus, Pencil, Trash2, Eye, X,
//   ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert, ChevronLeft, ChevronRight
// } from 'lucide-react';
// import Select from 'react-select';

// const JournalVoucher = () => {
//   // State management
//   const [vouchers, setVouchers] = useState([]);
//   const [accountHeads, setAccountHeads] = useState([]);
//   const [accounts, setAccounts] = useState([]);
//   const [paymentTypes, setPaymentTypes] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [currentView, setCurrentView] = useState('list'); // 'list', 'add', 'edit', 'view', 'print'
//   const [selectedVoucher, setSelectedVoucher] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortField, setSortField] = useState('date');
//   const [sortDirection, setSortDirection] = useState('desc');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // Form state
//   const [formData, setFormData] = useState({
//     date: new Date().toISOString().split('T')[0],
//     voucherNo: '',
//     paymentType: '',
//     entries: [
//       {
//         debitAccountHead: '',
//         debitAccount: '',
//         creditAccountHead: '',
//         creditAccount: '',
//         description: '',
//         amount: ''
//       }
//     ]
//   });

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

//   // Mock data - replace with actual API calls
//   useEffect(() => {
//     // Initialize mock data
//     setAccountHeads([
//       { value: 'Asset', label: 'Asset' },
//       { value: 'Liability', label: 'Liability' },
//       { value: 'Equity', label: 'Equity' },
//       { value: 'Revenue', label: 'Revenue' },
//       { value: 'Expense', label: 'Expense' }
//     ]);

//     setAccounts([
//       { value: 'Cash Account', label: 'Cash Account' },
//       { value: 'Bank Account', label: 'Bank Account' },
//       { value: 'Accounts Receivable', label: 'Accounts Receivable' },
//       { value: 'Accounts Payable', label: 'Accounts Payable' },
//       { value: 'Office Supplies', label: 'Office Supplies' },
//       { value: 'Equipment', label: 'Equipment' },
//       { value: 'Depreciation Expense', label: 'Depreciation Expense' },
//       { value: 'Accumulated Depreciation', label: 'Accumulated Depreciation' }
//     ]);

//     setPaymentTypes([
//       { value: 'Cash', label: 'Cash' },
//       { value: 'Bank Transfer', label: 'Bank Transfer' },
//       { value: 'Check', label: 'Check' },
//       { value: 'Credit Card', label: 'Credit Card' }
//     ]);

//     // Mock vouchers data
//     setVouchers([
//       {
//         id: 1,
//         voucherNo: '92',
//         date: '2025-01-12',
//         paymentType: 'Bank Transfer',
//         totalAmount: 920.00,
//         entries: [
//           {
//             debitAccountHead: 'Asset',
//             debitAccount: 'RIYAD BANK',
//             creditAccountHead: 'Expense',
//             creditAccount: 'Container Claims',
//             description: 'CNTR DAMAGE AMOUNT RETURNED FROM JV 43 - 9907/12/2025, 1224237',
//             amount: 920.00
//           }
//         ]
//       },
//       {
//         id: 2,
//         voucherNo: '93',
//         date: '2025-01-15',
//         paymentType: 'Cash',
//         totalAmount: 1500.00,
//         entries: [
//           {
//             debitAccountHead: 'Expense',
//             debitAccount: 'Office Supplies',
//             creditAccountHead: 'Asset',
//             creditAccount: 'Cash Account',
//             description: 'Office supplies purchase',
//             amount: 1500.00
//           }
//         ]
//       }
//     ]);
//   }, []);

//   // Form handlers
//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleEntryChange = (index, field, value) => {
//     const newEntries = [...formData.entries];
//     newEntries[index][field] = value;
//     setFormData(prev => ({ ...prev, entries: newEntries }));
//   };

//   const addEntry = () => {
//     setFormData(prev => ({
//       ...prev,
//       entries: [
//         ...prev.entries,
//         {
//           debitAccountHead: '',
//           debitAccount: '',
//           creditAccountHead: '',
//           creditAccount: '',
//           description: '',
//           amount: ''
//         }
//       ]
//     }));
//   };

//   const removeEntry = (index) => {
//     if (formData.entries.length > 1) {
//       const newEntries = formData.entries.filter((_, i) => i !== index);
//       setFormData(prev => ({ ...prev, entries: newEntries }));
//     }
//   };

//   // Calculate total amount
//   const getTotalAmount = () => {
//     return formData.entries.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);
//   };

//   // CRUD operations
//   const handleSave = () => {
//     if (!formData.voucherNo || !formData.date) {
//       setError('Please fill in all required fields');
//       return;
//     }

//     const totalAmount = getTotalAmount();
//     const voucherData = {
//       ...formData,
//       totalAmount,
//       id: currentView === 'edit' ? selectedVoucher.id : Date.now()
//     };

//     if (currentView === 'edit') {
//       setVouchers(prev => prev.map(v => v.id === selectedVoucher.id ? voucherData : v));
//       setSuccessMessage('Voucher updated successfully!');
//     } else {
//       setVouchers(prev => [...prev, voucherData]);
//       setSuccessMessage('Voucher created successfully!');
//     }

//     resetForm();
//     setCurrentView('list');
//     setTimeout(() => setSuccessMessage(''), 3000);
//   };

//   const handleEdit = (voucher) => {
//     setSelectedVoucher(voucher);
//     setFormData({
//       date: voucher.date,
//       voucherNo: voucher.voucherNo,
//       paymentType: voucher.paymentType,
//       entries: voucher.entries
//     });
//     setCurrentView('edit');
//   };

//   const handleView = (voucher) => {
//     setSelectedVoucher(voucher);
//     setCurrentView('view');
//   };

//   const handlePrint = (voucher = null) => {
//     if (voucher) {
//       setSelectedVoucher(voucher);
//     }
//     setCurrentView('print');
//     setTimeout(() => window.print(), 100);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this voucher?')) {
//       setVouchers(prev => prev.filter(v => v.id !== id));
//       setSuccessMessage('Voucher deleted successfully!');
//       setTimeout(() => setSuccessMessage(''), 3000);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       date: new Date().toISOString().split('T')[0],
//       voucherNo: '',
//       paymentType: '',
//       entries: [
//         {
//           debitAccountHead: '',
//           debitAccount: '',
//           creditAccountHead: '',
//           creditAccount: '',
//           description: '',
//           amount: ''
//         }
//       ]
//     });
//     setSelectedVoucher(null);
//   };

//   // Search voucher
//   const handleSearch = () => {
//     if (!searchTerm) {
//       setError('Please enter a voucher number to search');
//       return;
//     }

//     const voucher = vouchers.find(v => v.voucherNo === searchTerm);
//     if (voucher) {
//       handleView(voucher);
//       setSuccessMessage('Voucher found!');
//       setTimeout(() => setSuccessMessage(''), 3000);
//     } else {
//       setError('Voucher not found');
//       setTimeout(() => setError(''), 3000);
//     }
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

//   // Filter and sort vouchers
//   const filteredVouchers = vouchers.filter(voucher =>
//     voucher.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     voucher.paymentType.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const sortedVouchers = [...filteredVouchers].sort((a, b) => {
//     let valA, valB;
//     if (sortField === 'date') {
//       valA = new Date(a.date);
//       valB = new Date(b.date);
//     } else if (sortField === 'totalAmount') {
//       valA = parseFloat(a.totalAmount);
//       valB = parseFloat(b.totalAmount);
//     } else {
//       valA = a[sortField] || '';
//       valB = b[sortField] || '';
//     }
//     if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
//     if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
//     return 0;
//   });

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentVouchers = sortedVouchers.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(sortedVouchers.length / itemsPerPage);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, vouchers]);

//   // Render different views
//   const renderListView = () => (
//     <>
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
//             <FileText className="w-8 h-8 mr-3 text-indigo-600" />
//             Journal Voucher Management
//           </h1>
//           <p className="text-gray-600 mt-2">Create, view, edit and print journal vouchers</p>
//         </div>
//         <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
//           <button
//             onClick={() => setCurrentView('add')}
//             className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center shadow-md"
//           >
//             <Plus className="w-5 h-5 mr-2" />
//             Create Voucher
//           </button>
//         </div>
//       </div>

//       {/* Search Section */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
//         <div className="bg-indigo-50 p-4 border-b border-gray-200">
//           <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
//             <Search className="w-5 h-5 mr-2" />
//             SEARCH VOUCHERS
//           </h2>
//         </div>
//         <div className="p-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Voucher Number
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter voucher number..."
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div className="flex items-end">
//               <button
//                 onClick={handleSearch}
//                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm flex items-center justify-center"
//               >
//                 <Search className="w-4 h-4 mr-2" />
//                 Search
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Vouchers Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 {[
//                   { label: 'Voucher No', key: 'voucherNo' },
//                   { label: 'Date', key: 'date' },
//                   { label: 'Payment Type', key: 'paymentType' },
//                   { label: 'Total Amount', key: 'totalAmount' },
//                   { label: 'Actions', key: null },
//                 ].map(({ label, key }) => (
//                   <th
//                     key={label}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                     onClick={() => key && handleSort(key)}
//                   >
//                     <div className="flex items-center">
//                       {label}
//                       {key && renderSortIcon(key)}
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentVouchers.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
//                     <div className="flex flex-col items-center justify-center">
//                       <FileText className="w-16 h-16 text-gray-300 mb-4" />
//                       <h4 className="text-lg font-medium text-gray-500">No vouchers found</h4>
//                       <p className="text-gray-400 mt-2">Create your first journal voucher to get started</p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 currentVouchers.map((voucher) => (
//                   <tr key={voucher.id} className="hover:bg-gray-50 transition">
//                     <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">
//                       {voucher.voucherNo}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                       {new Date(voucher.date).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         voucher.paymentType === 'Cash' ? 'bg-green-100 text-green-800' :
//                         voucher.paymentType === 'Bank Transfer' ? 'bg-blue-100 text-blue-800' :
//                         'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {voucher.paymentType}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
//                       ${voucher.totalAmount.toFixed(2)}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
//                       <button
//                         onClick={() => handleView(voucher)}
//                         className="text-blue-600 hover:text-blue-900"
//                         title="View"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleEdit(voucher)}
//                         className="text-indigo-600 hover:text-indigo-900"
//                         title="Edit"
//                       >
//                         <Pencil className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handlePrint(voucher)}
//                         className="text-green-600 hover:text-green-900"
//                         title="Print"
//                       >
//                         <Printer className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(voucher.id)}
//                         className="text-red-600 hover:text-red-900"
//                         title="Delete"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
//             <div className="text-sm text-gray-700 mb-2 md:mb-0">
//               Showing {indexOfFirstItem + 1} to{' '}
//               {Math.min(indexOfLastItem, filteredVouchers.length)} of {filteredVouchers.length} vouchers
//             </div>
//             <div className="flex items-center">
//               <div className="flex space-x-1">
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
//                   title="Previous"
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
//                   title="Next"
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//             <div className="hidden md:block text-sm font-medium text-gray-700">
//               Total: <span className="text-green-600 font-bold">{filteredVouchers.length} vouchers</span>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );

//   const renderFormView = () => (
//     <>
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
//             <FileText className="w-8 h-8 mr-3 text-indigo-600" />
//             {currentView === 'edit' ? 'Edit Journal Voucher' : 'Create Journal Voucher'}
//           </h1>
//           <p className="text-gray-600 mt-2">
//             {currentView === 'edit' ? 'Update voucher details' : 'Create a new journal voucher entry'}
//           </p>
//         </div>
//         <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
//           <button
//             onClick={() => {
//               resetForm();
//               setCurrentView('list');
//             }}
//             className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center shadow-md"
//           >
//             <X className="w-5 h-5 mr-2" />
//             Cancel
//           </button>
//         </div>
//       </div>

//       {/* Form */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="bg-gray-50 p-4 border-b border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-700">Voucher Information</h2>
//         </div>
//         <div className="p-6">
//           {/* Basic Information */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Date <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
//                 value={formData.date}
//                 onChange={(e) => handleInputChange('date', e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Voucher No <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
//                 placeholder="Enter voucher number"
//                 value={formData.voucherNo}
//                 onChange={(e) => handleInputChange('voucherNo', e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Payment Type
//               </label>
//               <Select
//                 options={paymentTypes}
//                 value={paymentTypes.find(option => option.value === formData.paymentType)}
//                 onChange={(selectedOption) => handleInputChange('paymentType', selectedOption?.value || '')}
//                 placeholder="Select Payment Type"
//                 isSearchable
//                 menuPortalTarget={document.body}
//                 menuPosition="fixed"
//                 styles={selectStyles}
//                 className="w-full text-sm"
//               />
//             </div>
//           </div>

//           {/* Journal Entries */}
//           <div className="mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-800">Journal Entries</h3>
//               <button
//                 onClick={addEntry}
//                 className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm flex items-center"
//               >
//                 <Plus className="w-4 h-4 mr-1" />
//                 Add Entry
//               </button>
//             </div>

//             <div className="space-y-4">
//               {formData.entries.map((entry, index) => (
//                 <div key={index} className="border border-gray-200 rounded-lg p-4">
//                   <div className="flex justify-between items-center mb-3">
//                     <h4 className="font-medium text-gray-700">Entry {index + 1}</h4>
//                     {formData.entries.length > 1 && (
//                       <button
//                         onClick={() => removeEntry(index)}
//                         className="text-red-600 hover:text-red-900"
//                         title="Remove entry"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     )}
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Debit Account Head
//                       </label>
//                       <Select
//                         options={accountHeads}
//                         value={accountHeads.find(option => option.value === entry.debitAccountHead)}
//                         onChange={(selectedOption) => handleEntryChange(index, 'debitAccountHead', selectedOption?.value || '')}
//                         placeholder="Select"
//                         isSearchable
//                         menuPortalTarget={document.body}
//                         menuPosition="fixed"
//                         styles={selectStyles}
//                         className="w-full text-sm"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Debit Account
//                       </label>
//                       <Select
//                         options={accounts}
//                         value={accounts.find(option => option.value === entry.debitAccount)}
//                         onChange={(selectedOption) => handleEntryChange(index, 'debitAccount', selectedOption?.value || '')}
//                         placeholder="Select"
//                         isSearchable
//                         menuPortalTarget={document.body}
//                         menuPosition="fixed"
//                         styles={selectStyles}
//                         className="w-full text-sm"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Credit Account Head
//                       </label>
//                       <Select
//                         options={accountHeads}
//                         value={accountHeads.find(option => option.value === entry.creditAccountHead)}
//                         onChange={(selectedOption) => handleEntryChange(index, 'creditAccountHead', selectedOption?.value || '')}
//                         placeholder="Select"
//                         isSearchable
//                         menuPortalTarget={document.body}
//                         menuPosition="fixed"
//                         styles={selectStyles}
//                         className="w-full text-sm"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Credit Account
//                       </label>
//                       <Select
//                         options={accounts}
//                         value={accounts.find(option => option.value === entry.creditAccount)}
//                         onChange={(selectedOption) => handleEntryChange(index, 'creditAccount', selectedOption?.value || '')}
//                         placeholder="Select"
//                         isSearchable
//                         menuPortalTarget={document.body}
//                         menuPosition="fixed"
//                         styles={selectStyles}
//                         className="w-full text-sm"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Amount
//                       </label>
//                       <input
//                         type="number"
//                         step="0.01"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
//                         placeholder="0.00"
//                         value={entry.amount}
//                         onChange={(e) => handleEntryChange(index, 'amount', e.target.value)}
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Description
//                       </label>
//                       <textarea
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
//                         rows="2"
//                         placeholder="Enter description"
//                         value={entry.description}
//                         onChange={(e) => handleEntryChange(index, 'description', e.target.value)}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Total Amount */}
//             <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//               <div className="flex justify-between items-center">
//                 <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
//                 <span className="text-lg font-bold text-indigo-600">${getTotalAmount().toFixed(2)}</span>
//               </div>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-end">
//             <button
//               onClick={handleSave}
//               className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow transition"
//             >
//               {currentView === 'edit' ? 'Update Voucher' : 'Create Voucher'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );

//   const renderViewMode = () => (
//     <>
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
//             <FileText className="w-8 h-8 mr-3 text-indigo-600" />
//             Voucher Details - {selectedVoucher?.voucherNo}
//           </h1>
//           <p className="text-gray-600 mt-2">View voucher information</p>
//         </div>
//         <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
//           <button
//             onClick={() => handleEdit(selectedVoucher)}
//             className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center shadow-md"
//           >
//             <Pencil className="w-5 h-5 mr-2" />
//             Edit
//           </button>
//           <button
//             onClick={() => handlePrint()}
//             className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center shadow-md"
//           >
//             <Printer className="w-5 h-5 mr-2" />
//             Print
//           </button>
//           <button
//             onClick={() => setCurrentView('list')}
//             className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center shadow-md"
//           >
//             <X className="w-5 h-5 mr-2" />
//             Close
//           </button>
//         </div>
//       </div>

//       {/* Voucher Details */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="bg-indigo-50 p-4 border-b border-gray-200">
//           <div className="flex justify-between items-center">
//             <h2 className="text-lg font-semibold text-indigo-700">
//               Voucher No: {selectedVoucher?.voucherNo}
//             </h2>
//             <span className="text-lg font-semibold text-indigo-700">
//               Date: {selectedVoucher && new Date(selectedVoucher.date).toLocaleDateString()}
//             </span>
//           </div>
//         </div>
        
//         <div className="p-6">
//           {/* Basic Information */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             <div className="border border-gray-200 rounded-lg p-4">
//               <h3 className="font-medium text-gray-700 mb-2">Payment Type</h3>
//               <p className="text-gray-900">{selectedVoucher?.paymentType}</p>
//             </div>
//             <div className="border border-gray-200 rounded-lg p-4">
//               <h3 className="font-medium text-gray-700 mb-2">Total Amount</h3>
//               <p className="text-green-600 font-bold text-lg">${selectedVoucher?.totalAmount.toFixed(2)}</p>
//             </div>
//             <div className="border border-gray-200 rounded-lg p-4">
//               <h3 className="font-medium text-gray-700 mb-2">Number of Entries</h3>
//               <p className="text-gray-900">{selectedVoucher?.entries.length}</p>
//             </div>
//           </div>

//           {/* Journal Entries */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Journal Entries</h3>
//             <div className="overflow-x-auto">
//               <table className="w-full border border-gray-200 rounded-lg">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sl.No</th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Account Name</th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
//                     <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Debit</th>
//                     <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Credit</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {selectedVoucher?.entries.map((entry, index) => (
//                     <React.Fragment key={index}>
//                       <tr className="hover:bg-gray-50">
//                         <td className="px-4 py-3 text-sm text-gray-900">{index * 2 + 1}</td>
//                         <td className="px-4 py-3 text-sm text-gray-900">{entry.debitAccount}</td>
//                         <td className="px-4 py-3 text-sm text-gray-900">{entry.description}</td>
//                         <td className="px-4 py-3 text-sm text-right font-medium">{parseFloat(entry.amount).toFixed(2)}</td>
//                         <td className="px-4 py-3 text-sm text-right">0.00</td>
//                       </tr>
//                       <tr className="hover:bg-gray-50">
//                         <td className="px-4 py-3 text-sm text-gray-900">{index * 2 + 2}</td>
//                         <td className="px-4 py-3 text-sm text-gray-900">{entry.creditAccount}</td>
//                         <td className="px-4 py-3 text-sm text-gray-900">{entry.description}</td>
//                         <td className="px-4 py-3 text-sm text-right">0.00</td>
//                         <td className="px-4 py-3 text-sm text-right font-medium">{parseFloat(entry.amount).toFixed(2)}</td>
//                       </tr>
//                     </React.Fragment>
//                   ))}
//                   <tr className="bg-gray-100 font-semibold">
//                     <td colSpan="3" className="px-4 py-3 text-right text-sm">Total</td>
//                     <td className="px-4 py-3 text-sm text-right">{selectedVoucher?.totalAmount.toFixed(2)}</td>
//                     <td className="px-4 py-3 text-sm text-right">{selectedVoucher?.totalAmount.toFixed(2)}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );

//   const renderPrintView = () => (
//     <div className="bg-white min-h-screen print:shadow-none">
//       {/* Print Header */}
//       <div className="flex justify-between items-center p-6 border-b border-gray-200 print:border-black">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Journal Voucher</h1>
//         </div>
//         <div className="text-right">
//           <p className="text-lg font-semibold">Voucher No: {selectedVoucher?.voucherNo}</p>
//           <p className="text-lg font-semibold">Date: {selectedVoucher && new Date(selectedVoucher.date).toLocaleDateString()}</p>
//         </div>
//       </div>

//       {/* Print Content */}
//       <div className="p-6">
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse border border-gray-400">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-400 px-4 py-3 text-left text-sm font-semibold">Sl.No</th>
//                 <th className="border border-gray-400 px-4 py-3 text-left text-sm font-semibold">Account Name</th>
//                 <th className="border border-gray-400 px-4 py-3 text-left text-sm font-semibold">Description</th>
//                 <th className="border border-gray-400 px-4 py-3 text-right text-sm font-semibold">Debit</th>
//                 <th className="border border-gray-400 px-4 py-3 text-right text-sm font-semibold">Credit</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedVoucher?.entries.map((entry, index) => (
//                 <React.Fragment key={index}>
//                   <tr>
//                     <td className="border border-gray-400 px-4 py-3 text-sm">{index * 2 + 1}</td>
//                     <td className="border border-gray-400 px-4 py-3 text-sm">{entry.debitAccount}</td>
//                     <td className="border border-gray-400 px-4 py-3 text-sm">{entry.description}</td>
//                     <td className="border border-gray-400 px-4 py-3 text-sm text-right font-medium">{parseFloat(entry.amount).toFixed(2)}</td>
//                     <td className="border border-gray-400 px-4 py-3 text-sm text-right">0.00</td>
//                   </tr>
//                   <tr>
//                     <td className="border border-gray-400 px-4 py-3 text-sm">{index * 2 + 2}</td>
//                     <td className="border border-gray-400 px-4 py-3 text-sm">{entry.creditAccount}</td>
//                     <td className="border border-gray-400 px-4 py-3 text-sm">{entry.description}</td>
//                     <td className="border border-gray-400 px-4 py-3 text-sm text-right">0.00</td>
//                     <td className="border border-gray-400 px-4 py-3 text-sm text-right font-medium">{parseFloat(entry.amount).toFixed(2)}</td>
//                   </tr>
//                 </React.Fragment>
//               ))}
//               <tr className="bg-gray-100 font-semibold">
//                 <td colSpan="3" className="border border-gray-400 px-4 py-3 text-right text-sm">Total</td>
//                 <td className="border border-gray-400 px-4 py-3 text-sm text-right">{selectedVoucher?.totalAmount.toFixed(2)}</td>
//                 <td className="border border-gray-400 px-4 py-3 text-sm text-right">{selectedVoucher?.totalAmount.toFixed(2)}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Print Controls */}
//       <div className="fixed top-4 right-4 print:hidden">
//         <div className="flex gap-2">
//           <button
//             onClick={() => window.print()}
//             className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center shadow-md"
//           >
//             <Printer className="w-5 h-5 mr-2" />
//             Print
//           </button>
//           <button
//             onClick={() => setCurrentView('view')}
//             className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center shadow-md"
//           >
//             <X className="w-5 h-5 mr-2" />
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
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

//         {/* Render different views based on current state */}
//         {currentView === 'list' && renderListView()}
//         {(currentView === 'add' || currentView === 'edit') && renderFormView()}
//         {currentView === 'view' && renderViewMode()}
//         {currentView === 'print' && renderPrintView()}
//       </div>
//     </div>
//   );
// };

// export default JournalVoucher;


import React, { useState, useEffect } from 'react';
import {
  BookOpen, Plus, X, Save, Trash2, Calculator, 
  ChevronDown, Search, ChevronLeft, ChevronRight
} from 'lucide-react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';

// Auth header utility
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error("Authentication token missing - redirecting to login");
    window.location.href = '/login';
    return {};
  }
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

const JournalVoucherPage = () => {
  // State management
  const [journalVouchers, setJournalVouchers] = useState([]);
  const [accountHeads, setAccountHeads] = useState([]);
  const [subAccounts, setSubAccounts] = useState({});
  const [paymentTypes, setPaymentTypes] = useState(['Cash', 'Bank Transfer', 'Check', 'Credit Card']);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form state
  const [voucherData, setVoucherData] = useState({
    date: new Date(),
    voucherNo: '',
    paymentType: ''
  });
  
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    debitAccountHead: '',
    debitAccount: '',
    creditAccountHead: '',
    creditAccount: '',
    amount: '',
    remarks: ''
  });
  
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const itemsPerPage = 8;

  // Mock data initialization
  useEffect(() => {
    const mockAccountHeads = [
      'Current Asset',
      'Loans And Advances(Asset)',
      'Account Receivable',
      'Account Payable',
      'Cash In Hand',
      'Current Liability',
      'Capital Account',
      'Bank Account',
      'Fixed Asset',
      'Investment'
    ];
    
    const mockSubAccounts = {
      'Current Asset': ['Select', 'Inventory', 'Prepaid Expenses'],
      'Cash In Hand': ['Select', 'Cash', 'Petty Cash - BAJER ALI', 'Petty Cash Saheer', 'Petty Cash Mureed', 'PETTY CASH SIDDHIQUE', 'PETTY CASH ABDUL HAMEED LAJAMI', 'PETTY CASH IN INSPECTION'],
      'Current Liability': ['Select', 'VAT SETTLEMENT'],
      'Account Receivable': ['Select', 'Trade Debtors', 'Other Receivables'],
      'Account Payable': ['Select', 'Trade Creditors', 'Other Payables'],
      'Bank Account': ['Select', 'Al Rajhi Bank', 'SABB Bank', 'NCB Bank']
    };
    
    setAccountHeads(mockAccountHeads);
    setSubAccounts(mockSubAccounts);
    
    // Generate next voucher number
    const nextVoucherNo = `JV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
    setVoucherData(prev => ({ ...prev, voucherNo: nextVoucherNo }));
  }, []);

  // Handle account head change
  const handleAccountHeadChange = (field, value) => {
    setCurrentEntry(prev => ({
      ...prev,
      [field]: value,
      [field.replace('Head', '')]: '' // Reset sub account when head changes
    }));
  };

  // Add entry to the list
  const handleAddEntry = () => {
    if (!currentEntry.debitAccountHead || !currentEntry.debitAccount || 
        !currentEntry.creditAccountHead || !currentEntry.creditAccount || 
        !currentEntry.amount) {
      setError('Please fill in all required fields for the entry');
      return;
    }

    const newEntry = {
      id: Date.now(),
      ...currentEntry,
      amount: parseFloat(currentEntry.amount)
    };

    setEntries(prev => [...prev, newEntry]);
    setCurrentEntry({
      debitAccountHead: '',
      debitAccount: '',
      creditAccountHead: '',
      creditAccount: '',
      amount: '',
      remarks: ''
    });
    setError('');
  };

  // Remove entry from list
  const handleRemoveEntry = (id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  // Calculate total amount
  const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);

  // Handle form submission
  const handleSubmit = async () => {
    if (!voucherData.date || !voucherData.voucherNo || !voucherData.paymentType) {
      setError('Please fill in all voucher details');
      return;
    }

    if (entries.length === 0) {
      setError('Please add at least one journal entry');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newVoucher = {
        id: Date.now(),
        ...voucherData,
        date: voucherData.date.toISOString().split('T')[0],
        entries: [...entries],
        totalAmount,
        createdAt: new Date().toISOString()
      };

      if (editingId) {
        setJournalVouchers(prev => prev.map(item => 
          item.id === editingId ? newVoucher : item
        ));
        setSuccess('Journal Voucher updated successfully!');
      } else {
        setJournalVouchers(prev => [...prev, newVoucher]);
        setSuccess('Journal Voucher created successfully!');
      }
      
      // Reset form
      setIsAdding(false);
      setEditingId(null);
      setVoucherData({
        date: new Date(),
        voucherNo: `JV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
        paymentType: ''
      });
      setEntries([]);
      setCurrentEntry({
        debitAccountHead: '',
        debitAccount: '',
        creditAccountHead: '',
        creditAccount: '',
        amount: '',
        remarks: ''
      });
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save Journal Voucher. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort data
  const filteredData = journalVouchers.filter(item =>
    item.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.paymentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField]?.toString().toLowerCase() || '';
    const bValue = b[sortField]?.toString().toLowerCase() || '';
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-indigo-600" />
              JOURNAL VOUCHER
            </h1>
            <p className="text-gray-600 mt-2">Create and manage journal vouchers for accounting entries</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search vouchers..."
                  className="bg-transparent outline-none w-40"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <button
              onClick={() => {
                setIsAdding(!isAdding);
                setEditingId(null);
                setError('');
                if (!isAdding) {
                  const nextVoucherNo = `JV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
                  setVoucherData({
                    date: new Date(),
                    voucherNo: nextVoucherNo,
                    paymentType: ''
                  });
                  setEntries([]);
                }
              }}
              className={`px-5 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md ${
                isAdding
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
              }`}
            >
              {isAdding ? (
                <>
                  <X className="w-5 h-5 mr-2" />
                  Close
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Create Voucher
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <X className="w-3 h-3 text-white" />
            </div>
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Create/Edit Form */}
        {isAdding && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Panel - Voucher Details */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Voucher Details
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={voucherData.date}
                    onChange={(date) => setVoucherData({ ...voucherData, date })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voucher No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={voucherData.voucherNo}
                    onChange={(e) => setVoucherData({ ...voucherData, voucherNo: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={voucherData.paymentType}
                    onChange={(e) => setVoucherData({ ...voucherData, paymentType: e.target.value })}
                  >
                    <option value="">Select</option>
                    {paymentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Right Panel - Journal Entries */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Journal Entries
                </h2>
              </div>
              <div className="p-6">
                {/* Entry Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Debit Account Head <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      value={currentEntry.debitAccountHead}
                      onChange={(e) => handleAccountHeadChange('debitAccountHead', e.target.value)}
                    >
                      <option value="">Select</option>
                      {accountHeads.map(head => (
                        <option key={head} value={head}>{head}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Debit Account <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      value={currentEntry.debitAccount}
                      onChange={(e) => setCurrentEntry({ ...currentEntry, debitAccount: e.target.value })}
                      disabled={!currentEntry.debitAccountHead}
                    >
                      <option value="">Select</option>
                      {(subAccounts[currentEntry.debitAccountHead] || []).map(account => (
                        <option key={account} value={account}>{account}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credit Account Head <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      value={currentEntry.creditAccountHead}
                      onChange={(e) => handleAccountHeadChange('creditAccountHead', e.target.value)}
                    >
                      <option value="">Select</option>
                      {accountHeads.map(head => (
                        <option key={head} value={head}>{head}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credit Account <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      value={currentEntry.creditAccount}
                      onChange={(e) => setCurrentEntry({ ...currentEntry, creditAccount: e.target.value })}
                      disabled={!currentEntry.creditAccountHead}
                    >
                      <option value="">Select</option>
                      {(subAccounts[currentEntry.creditAccountHead] || []).map(account => (
                        <option key={account} value={account}>{account}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      value={currentEntry.amount}
                      onChange={(e) => setCurrentEntry({ ...currentEntry, amount: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remarks
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      value={currentEntry.remarks}
                      onChange={(e) => setCurrentEntry({ ...currentEntry, remarks: e.target.value })}
                      placeholder="Optional remarks"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mb-6">
                  <button
                    onClick={handleAddEntry}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Entry
                  </button>
                </div>

                {/* Entries Table */}
                {entries.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Debit Account</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Credit Account</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Amount</th>
                          <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map((entry) => (
                          <tr key={entry.id} className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm text-gray-900">{entry.debitAccount}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{entry.creditAccount}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{entry.remarks || '-'}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">
                              SAR {entry.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                onClick={() => handleRemoveEntry(entry.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Remove Entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t-2 border-gray-300 bg-gray-50">
                          <td colSpan={3} className="px-4 py-2 text-sm font-bold text-gray-900">Total Amount</td>
                          <td className="px-4 py-2 text-sm font-bold text-gray-900 text-right">
                            SAR {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={loading || entries.length === 0}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition flex items-center disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Submit Voucher
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vouchers List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Journal Vouchers</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-indigo-600 text-white text-sm font-semibold">
                <tr>
                  <th className="px-6 py-3 text-left">Sl.No</th>
                  <th className="px-6 py-3 text-left">Voucher No</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Payment Type</th>
                  <th className="px-6 py-3 text-right">Total Amount</th>
                  <th className="px-6 py-3 text-center">Entries</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      No journal vouchers found
                      {searchTerm && (
                        <div className="mt-2 text-sm text-gray-400">
                          Try adjusting your search criteria
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  currentItems.map((voucher, index) => (
                    <tr key={voucher.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-center text-gray-900 font-medium">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{voucher.voucherNo}</td>
                      <td className="px-6 py-4 text-gray-900">
                        {new Date(voucher.date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {voucher.paymentType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        SAR {voucher.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {voucher.entries.length} entries
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {sortedData.length > itemsPerPage && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedData.length)} of {sortedData.length} results
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
                  disabled={currentPage === totalPages || totalPages === 0}
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
    </div>
  );
};

export default JournalVoucherPage;
