// import React, { useState, useEffect } from 'react';
// import { 
//   ClipboardList, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
//   ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert
// } from 'lucide-react';
// import Select from 'react-select';

// const AccountHead = () => {
//   // State management
//   const [accounts, setAccounts] = useState([
//     { id: 1, accountType: 'Asset', accountHead: 'Current Asset' },
//     { id: 2, accountType: 'Asset', accountHead: 'Loans And Advance (Asset)' },
//     { id: 3, accountType: 'Asset', accountHead: 'Account Receivable' },
//     { id: 4, accountType: 'Liability', accountHead: 'Account Payable' },
//     { id: 5, accountType: 'Asset', accountHead: 'Cash in Hand' },
//     { id: 6, accountType: 'Liability', accountHead: 'Current Liability' },
//     { id: 7, accountType: 'Liability', accountHead: 'Capital Account' },
//     { id: 8, accountType: 'Asset', accountHead: 'Bank Account' },
//     { id: 9, accountType: 'Asset', accountHead: 'Fixed Asset' },
//     { id: 10, accountType: 'Asset', accountHead: 'Investment' },
//     { id: 11, accountType: 'Liability', accountHead: 'Loans (Liability)' },
//     { id: 12, accountType: 'Asset', accountHead: 'Misc. Expense (Asset)' },
//     { id: 13, accountType: 'Liability', accountHead: 'Provisions' },
//   ]);
  
//   const [formData, setFormData] = useState({
//     accountType: '',
//     accountHead: ''
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [isAdding, setIsAdding] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortField, setSortField] = useState('accountHead');
//   const [sortDirection, setSortDirection] = useState('asc');
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

//   // Account type options
//   const accountTypeOptions = [
//     { value: 'Asset', label: 'Asset' },
//     { value: 'Liability', label: 'Liability' },
//     { value: 'Equity', label: 'Equity' },
//     { value: 'Revenue', label: 'Revenue' },
//     { value: 'Expense', label: 'Expense' }
//   ];

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       accountType: '',
//       accountHead: ''
//     });
//     setEditingId(null);
//     setIsAdding(false);
//     setError('');
//     setSuccessMessage('');
//   };

//   // Fixed toggle function for Add Account button
//   const handleToggleAddForm = () => {
//     console.log('Button clicked, current state:', isAdding); // Debug log
//     if (isAdding) {
//       resetForm();
//     } else {
//       setIsAdding(true);
//       setEditingId(null);
//       setError('');
//       setSuccessMessage('');
//     }
//   };

//   // Handle form input changes
//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   // Add or update account
//   const handleSubmit = () => {
//     if (!formData.accountType.trim() || !formData.accountHead.trim()) {
//       setError('Please fill in all required fields');
//       return;
//     }

//     // Check for duplicate account head
//     const isDuplicate = accounts.some(acc => 
//       acc.accountHead.toLowerCase() === formData.accountHead.toLowerCase() && 
//       acc.id !== editingId
//     );
    
//     if (isDuplicate) {
//       setError('Account head already exists');
//       return;
//     }

//     try {
//       if (editingId) {
//         // Update existing account
//         const updatedAccounts = accounts.map(acc =>
//           acc.id === editingId 
//             ? { ...acc, accountType: formData.accountType, accountHead: formData.accountHead }
//             : acc
//         );
//         setAccounts(updatedAccounts);
//         setSuccessMessage('Account head updated successfully!');
//       } else {
//         // Add new account
//         const newId = accounts.length ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
//         const newAccount = {
//           id: newId,
//           accountType: formData.accountType,
//           accountHead: formData.accountHead
//         };
//         setAccounts([...accounts, newAccount]);
//         setSuccessMessage('Account head added successfully!');
//       }

//       resetForm();
//       setTimeout(() => setSuccessMessage(''), 3000);
//     } catch (error) {
//       setError('Failed to save account head');
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   // Edit account
//   const handleEdit = (account) => {
//     setFormData({
//       accountType: account.accountType,
//       accountHead: account.accountHead
//     });
//     setEditingId(account.id);
//     setIsAdding(true);
//   };

//   // Delete account
//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this account head?')) {
//       setAccounts(accounts.filter(acc => acc.id !== id));
//       if (editingId === id) {
//         resetForm();
//       }
//       setSuccessMessage('Account head deleted successfully!');
//       setTimeout(() => setSuccessMessage(''), 3000);
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

//   // Filter and sort accounts
//   const filteredAccounts = accounts.filter(account =>
//     account.accountHead.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     account.accountType.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const sortedAccounts = [...filteredAccounts].sort((a, b) => {
//     const aValue = a[sortField] || '';
//     const bValue = b[sortField] || '';
//     if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
//     if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
//     return 0;
//   });

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentAccounts = sortedAccounts.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(sortedAccounts.length / itemsPerPage);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, accounts]);

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header - Matching AssignExpenses */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
//               <ClipboardList className="w-8 h-8 mr-3 text-indigo-600" />
//               Account Head Management
//             </h1>
//             <p className="text-gray-600 mt-2">Manage chart of accounts and account types</p>
//           </div>
//           <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
//             {/* Fixed Add Account Button */}
//             <button
//               type="button"
//               onClick={handleToggleAddForm}
//               className={`px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
//                 ${isAdding 
//                   ? 'bg-red-600 hover:bg-red-700' 
//                   : 'bg-indigo-600 hover:bg-indigo-700'}`}
//             >
//               {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
//               {isAdding ? 'Cancel' : 'Add Account Head'}
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
//               SEARCH ACCOUNT HEADS
//             </h2>
//           </div>
//           <div className="p-4">
//             <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Search by Account Head or Type
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Search account heads..."
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Add/Edit Account Form */}
//         {isAdding && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
//             <div className="bg-gray-50 p-4 border-b border-gray-200">
//               <h2 className="text-lg font-semibold text-gray-700">
//                 {editingId ? 'Edit Account Head' : 'Add New Account Head'}
//               </h2>
//             </div>
//             <div className="p-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-3">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Account Type <span className="text-red-500">*</span>
//                     </label>
//                     <Select
//                       options={accountTypeOptions}
//                       value={accountTypeOptions.find(option => option.value === formData.accountType)}
//                       onChange={(selectedOption) => handleInputChange('accountType', selectedOption?.value || '')}
//                       placeholder="Select Account Type"
//                       isSearchable
//                       menuPortalTarget={document.body}
//                       menuPosition="fixed"
//                       styles={selectStyles}
//                       className="w-full text-sm"
//                     />
//                   </div>
//                 </div>
                
//                 <div className="space-y-3">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Account Head <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
//                       placeholder="Enter account head name"
//                       value={formData.accountHead}
//                       onChange={(e) => handleInputChange('accountHead', e.target.value)}
//                     />
//                   </div>
//                 </div>
//               </div>
              
//               <div className="mt-4 flex justify-end">
//                 <button
//                   onClick={handleSubmit}
//                   className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm"
//                 >
//                   {editingId ? 'Update Account Head' : 'Add Account Head'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Account Summary */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
//           <div className="flex justify-between items-center">
//             <h2 className="text-lg font-semibold text-gray-800">Account Summary</h2>
//             <div className="text-sm font-medium text-gray-700">
//               Total: <span className="text-green-600 font-bold">{filteredAccounts.length} account heads</span>
//             </div>
//           </div>
//         </div>

//         {/* Account Heads Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   {[
//                     { label: 'SL No', key: null },
//                     { label: 'Account Type', key: 'accountType' },
//                     { label: 'Account Head', key: 'accountHead' },
//                     { label: 'Actions', key: null },
//                   ].map(({ label, key }) => (
//                     <th
//                       key={label}
//                       className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                       onClick={() => key && handleSort(key)}
//                     >
//                       <div className="flex items-center">
//                         {label}
//                         {key && renderSortIcon(key)}
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentAccounts.length === 0 ? (
//                   <tr>
//                     <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
//                       <div className="flex flex-col items-center justify-center">
//                         <ClipboardList className="w-16 h-16 text-gray-300 mb-4" />
//                         <h4 className="text-lg font-medium text-gray-500">No account heads found</h4>
//                         <p className="text-gray-400 mt-2">Create your first account head to get started</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   currentAccounts.map((account, index) => (
//                     <tr key={account.id} className="hover:bg-gray-50 transition">
//                       <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {indexOfFirstItem + index + 1}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           account.accountType === 'Asset' ? 'bg-green-100 text-green-800' :
//                           account.accountType === 'Liability' ? 'bg-red-100 text-red-800' :
//                           account.accountType === 'Equity' ? 'bg-blue-100 text-blue-800' :
//                           account.accountType === 'Revenue' ? 'bg-purple-100 text-purple-800' :
//                           'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {account.accountType}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {account.accountHead}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
//                         <button
//                           onClick={() => handleEdit(account)}
//                           className="text-indigo-600 hover:text-indigo-900"
//                           title="Edit"
//                         >
//                           <Pencil className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(account.id)}
//                           className="text-red-600 hover:text-red-900"
//                           title="Delete"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
          
//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
//               <div className="text-sm text-gray-700 mb-2 md:mb-0">
//                 Showing {indexOfFirstItem + 1} to{' '}
//                 {Math.min(indexOfLastItem, filteredAccounts.length)} of {filteredAccounts.length} account heads
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
//                 Total: <span className="text-green-600 font-bold">{filteredAccounts.length} account heads</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountHead;



import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert
} from 'lucide-react';
import Select from 'react-select';
import axios from 'axios';

const AccountHead = () => {
  // State management
  const [accounts, setAccounts] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    account_type: '',
    account_head: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('account_head');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const itemsPerPage = 10;

  // API Base URL
  const API_BASE_URL = 'http://localhost:5000/api/accounts-head';

  // Authentication headers function with better error handling
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Instead of throwing an error, return headers without auth for now
      console.warn('No authentication token found');
      return {
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

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

  // Handle authentication errors
  const handleAuthError = (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      setError('Authentication failed. Please login again.');
      // Optionally redirect to login page
      // window.location.href = '/login';
    } else if (error.response?.status === 404) {
      setError('API endpoint not found. Please check if the server is running.');
    } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      setError('Cannot connect to server. Please ensure the backend server is running on port 5000.');
    } else {
      setError(error.response?.data?.message || error.message || 'An error occurred');
    }
  };

  // Fetch account types
  const fetchAccountTypes = async () => {
    try {
      const authHeaders = getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/types`, authHeaders);
      
      if (response.data.success) {
        setAccountTypes(response.data.data);
        console.log('Account types loaded successfully:', response.data.data);
      } else {
        setError('Failed to load account types');
      }
    } catch (error) {
      console.error('Error fetching account types:', error);
      handleAuthError(error);
    }
  };

  // Fetch account heads with search, sort, and pagination
  const fetchAccountHeads = async (page = currentPage, search = searchTerm, sortBy = sortField, sortDir = sortDirection) => {
    setLoading(true);
    try {
      const authHeaders = getAuthHeaders();
      const params = {
        page,
        limit: itemsPerPage,
        search,
        sortField: sortBy,
        sortDirection: sortDir
      };

      const response = await axios.get(API_BASE_URL, { 
        ...authHeaders,
        params 
      });
      
      if (response.data.success) {
        const { data, total, totalPages: pages } = response.data.data;
        setAccounts(data);
        setTotalRecords(total);
        setTotalPages(pages);
        console.log('Account heads loaded successfully:', data.length, 'records');
      } else {
        setError(response.data.message || 'Failed to fetch account heads');
      }
    } catch (error) {
      console.error('Error fetching account heads:', error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      account_type: '',
      account_head: ''
    });
    setEditingId(null);
    setIsAdding(false);
    setError('');
    setSuccessMessage('');
  };

  // Toggle add form
  const handleToggleAddForm = () => {
    if (isAdding) {
      resetForm();
    } else {
      setIsAdding(true);
      setEditingId(null);
      setError('');
      setSuccessMessage('');
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Add or update account
  const handleSubmit = async () => {
    if (!formData.account_type.trim() || !formData.account_head.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const authHeaders = getAuthHeaders();
      let response;
      
      if (editingId) {
        // Update existing account
        response = await axios.put(`${API_BASE_URL}/${editingId}`, formData, authHeaders);
        setSuccessMessage('Account head updated successfully!');
      } else {
        // Add new account
        response = await axios.post(API_BASE_URL, formData, authHeaders);
        setSuccessMessage('Account head added successfully!');
      }

      if (response.data.success) {
        resetForm();
        fetchAccountHeads();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.message || 'Failed to save account head');
      }
    } catch (error) {
      console.error('Error saving account head:', error);
      handleAuthError(error);
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Edit account
  const handleEdit = (account) => {
    setFormData({
      account_type: account.account_type,
      account_head: account.account_head
    });
    setEditingId(account.id);
    setIsAdding(true);
  };

  // Delete account
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this account head?')) {
      setLoading(true);
      try {
        const authHeaders = getAuthHeaders();
        const response = await axios.delete(`${API_BASE_URL}/${id}`, authHeaders);
        
        if (response.data.success) {
          if (editingId === id) {
            resetForm();
          }
          setSuccessMessage('Account head deleted successfully!');
          fetchAccountHeads();
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(response.data.message || 'Failed to delete account head');
        }
      } catch (error) {
        console.error('Error deleting account head:', error);
        handleAuthError(error);
        setTimeout(() => setError(''), 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  // Sort handler
  const handleSort = (field) => {
    let newDirection = 'asc';
    if (sortField === field && sortDirection === 'asc') {
      newDirection = 'desc';
    }
    
    setSortField(field);
    setSortDirection(newDirection);
    setCurrentPage(1);
    fetchAccountHeads(1, searchTerm, field, newDirection);
  };

  // Search handler
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
    fetchAccountHeads(1, searchValue, sortField, sortDirection);
  };

  // Pagination handler
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchAccountHeads(newPage, searchTerm, sortField, sortDirection);
  };

  // Render sort icon
  const renderSortIcon = (field) => {
    if (sortField !== field) return <ArrowUp className="w-3 h-3 text-gray-400 inline" />;
    return sortDirection === 'asc' ?
      <ArrowUp className="w-3 h-3 text-indigo-600 inline" /> :
      <ArrowDown className="w-3 h-3 text-indigo-600 inline" />;
  };

  // Clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      console.log('Initializing account head data...');
      try {
        await fetchAccountTypes();
        await fetchAccountHeads();
      } catch (error) {
        console.error('Error initializing data:', error);
        handleAuthError(error);
      }
    };

    initializeData();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== '') {
        handleSearch(searchTerm);
      } else {
        fetchAccountHeads(1, '', sortField, sortDirection);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <ClipboardList className="w-8 h-8 mr-3 text-indigo-600" />
              Account Head Management
            </h1>
            <p className="text-gray-600 mt-2">Manage chart of accounts and account types</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleToggleAddForm}
              disabled={loading}
              className={`px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'} 
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <Loader className="w-5 h-5 mr-2 animate-spin" />
              ) : isAdding ? (
                <X className="w-5 h-5 mr-2" />
              ) : (
                <Plus className="w-5 h-5 mr-2" />
              )}
              {isAdding ? 'Cancel' : 'Add Account Head'}
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

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH ACCOUNT HEADS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Account Head or Type
                </label>
                <input
                  type="text"
                  placeholder="Search account heads..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Account Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                {editingId ? 'Edit Account Head' : 'Add New Account Head'}
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Type <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={accountTypes}
                      value={accountTypes.find(option => option.value === formData.account_type)}
                      onChange={(selectedOption) => handleInputChange('account_type', selectedOption?.value || '')}
                      placeholder="Select Account Type"
                      isSearchable
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      styles={selectStyles}
                      className="w-full text-sm"
                      isDisabled={loading}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Head <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter account head name"
                      value={formData.account_head}
                      onChange={(e) => handleInputChange('account_head', e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm flex items-center
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                  {editingId ? 'Update Account Head' : 'Add Account Head'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Account Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Account Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">{totalRecords} account heads</span>
            </div>
          </div>
        </div>

        {/* Account Heads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'SL No', key: null },
                    { label: 'Account Type', key: 'account_type' },
                    { label: 'Account Head', key: 'account_head' },
                    { label: 'Actions', key: null },
                  ].map(({ label, key }) => (
                    <th
                      key={label}
                      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${key ? 'cursor-pointer' : ''}`}
                      onClick={() => key && !loading && handleSort(key)}
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
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Loader className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                        <p>Loading account heads...</p>
                      </div>
                    </td>
                  </tr>
                ) : accounts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <ClipboardList className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No account heads found</h4>
                        <p className="text-gray-400 mt-2">Create your first account head to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  accounts.map((account, index) => (
                    <tr key={account.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          account.account_type === 'Asset' ? 'bg-green-100 text-green-800' :
                          account.account_type === 'Liability' ? 'bg-red-100 text-red-800' :
                          account.account_type === 'Equity' ? 'bg-blue-100 text-blue-800' :
                          account.account_type === 'Revenue' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {account.account_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {account.account_head}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleEdit(account)}
                          disabled={loading}
                          className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(account.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700 mb-2 md:mb-0">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords} account heads
              </div>
              <div className="flex items-center">
                <div className="flex space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                    title="Previous"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <span className="px-3 py-2 text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                    title="Next"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="hidden md:block text-sm font-medium text-gray-700">
                Total: <span className="text-green-600 font-bold">{totalRecords} account heads</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountHead;
