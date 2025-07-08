import React, { useState, useEffect } from 'react';
import { 
  Landmark, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, Loader, AlertTriangle
} from 'lucide-react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';



const BankInformationPage = () => {
  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/banks`;
  // State management
  const [banks, setBanks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('bankName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [newBank, setNewBank] = useState({
    bankName: '',
    branchNo: '',
    accountName: '',
    accountNo: '',
    iban: '',
    address: '',
  });

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

  // Convert API snake_case object to camelCase
  const toCamelCase = (obj) => ({
    id: obj.id,
    bankName: obj.name,
    branchNo: obj.branch_no,
    accountName: obj.account_name,
    accountNo: obj.account_no,
    iban: obj.iban,
    address: obj.address,
    createdAt: obj.created_at,
  });

  // Convert camelCase to snake_case for API
  const formatToSnakeCase = (bank) => ({
    name: bank.bankName,
    branch_no: bank.branchNo,
    account_name: bank.accountName,
    account_no: bank.accountNo,
    iban: bank.iban,
    address: bank.address,
  });

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

  // Handle authentication errors using ToastConfig styles
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

  // Validation function using your ToastConfig warning style
  const validateBankForm = () => {
    const errors = [];
    
    if (!newBank.bankName.trim()) {
      errors.push('Bank name is required');
    } else if (newBank.bankName.trim().length < 2) {
      errors.push('Bank name must be at least 2 characters');
    }
    
    if (!newBank.accountNo.trim()) {
      errors.push('Account number is required');
    } else if (newBank.accountNo.trim().length < 5) {
      errors.push('Account number must be at least 5 characters');
    }
    
    if (newBank.iban && newBank.iban.length > 0 && newBank.iban.length < 15) {
      errors.push('IBAN must be at least 15 characters if provided');
    }
    
    if (errors.length > 0) {
      errors.forEach(error => {
        // Using a custom toast that will inherit your warning styles
        toast((t) => (
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        ), {
          duration: 4500,
          // This will use your warning configuration from ToastConfig
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

  // Fetch banks from backend
  const fetchBanks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_BASE_URL, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`Failed to fetch banks: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setBanks(data.map(toCamelCase));
      console.log('Banks loaded successfully:', data.length, 'records');
      
      // Using your ToastConfig success style
      if (data.length > 0) {
        toast.success(`✅ Successfully loaded ${data.length} bank record${data.length > 1 ? 's' : ''}`);
      }
    } catch (err) {
      console.error('Error fetching banks:', err);
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  // Reset form
  const resetForm = () => {
    setNewBank({
      bankName: '',
      branchNo: '',
      accountName: '',
      accountNo: '',
      iban: '',
      address: '',
    });
    setEditingId(null);
    setIsAdding(false);
  };

  // Toggle add form using your custom toast style
  const handleToggleAddForm = () => {
    if (isAdding) {
      resetForm();
      // Using your custom toast configuration
      toast((t) => (
        <div className="flex items-center">
          <X className="w-5 h-5 mr-2" />
          Form cancelled
        </div>
      ), {
        duration: 2000,
      });
    } else {
      setIsAdding(true);
      setEditingId(null);
      
      // Using your custom toast configuration
      toast((t) => (
        <div className="flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Ready to add new bank
        </div>
      ), {
        duration: 2000,
      });
    }
  };

  // Add or update bank handler using ToastConfig styles
  const handleAddBank = async () => {
    if (!validateBankForm()) {
      return;
    }

    // Using your ToastConfig loading style
    const loadingToast = toast.loading(
      editingId ? '🔄 Updating bank information...' : '💾 Adding new bank...'
    );
    
    try {
      const headers = getAuthHeaders();
      let res;

      if (editingId !== null) {
        res = await fetch(`${API_BASE_URL}/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(formatToSnakeCase(newBank)),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to update bank');
        }
        
        toast.dismiss(loadingToast);
        // Using your ToastConfig success style
        toast.success(`✅ "${newBank.bankName}" updated successfully!`);
      } else {
        res = await fetch(API_BASE_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify(formatToSnakeCase(newBank)),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          if (res.status === 409) {
            throw new Error('Bank with this account number already exists');
          }
          throw new Error(errorData.message || 'Failed to add bank');
        }
        
        toast.dismiss(loadingToast);
        // Using your ToastConfig success style
        toast.success(`🎉 "${newBank.bankName}" added successfully!`);
      }

      await fetchBanks();
      resetForm();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error saving bank:', err);
      
      if (err.message.includes('already exists')) {
        // Using your warning toast style from ToastConfig
        toast((t) => (
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Bank already exists with this account number
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
      } else {
        // Using your ToastConfig error style
        toast.error(`❌ ${err.message || 'Failed to save bank'}`);
      }
      
      handleAuthError(err);
    }
  };

  // Delete bank handler using ToastConfig styles
  const handleDelete = async (id) => {
    const bank = banks.find(b => b.id === id);
    const bankName = bank ? bank.bankName : 'this bank';
    
    if (!window.confirm(`⚠️ Are you sure you want to delete "${bankName}"?\n\nThis action cannot be undone.`)) {
      // Using your custom toast style
      toast((t) => (
        <div className="flex items-center">
          <X className="w-5 h-5 mr-2" />
          Deletion cancelled
        </div>
      ), {
        duration: 2000,
      });
      return;
    }

    // Using your ToastConfig loading style
    const loadingToast = toast.loading(`🗑️ Deleting "${bankName}"...`);
    
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete bank');
      }
      
      toast.dismiss(loadingToast);
      // Using your ToastConfig success style
      toast.success(`🗑️ "${bankName}" deleted successfully!`);
      
      await fetchBanks();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error deleting bank:', err);
      
      // Using your ToastConfig error style
      toast.error(`❌ ${err.message || 'Failed to delete bank'}`);
      handleAuthError(err);
    }
  };

  // Edit bank handler using your custom toast style
  const handleEdit = (bank) => {
    setNewBank({
      bankName: bank.bankName,
      branchNo: bank.branchNo,
      accountName: bank.accountName,
      accountNo: bank.accountNo,
      iban: bank.iban,
      address: bank.address,
    });
    setEditingId(bank.id);
    setIsAdding(true);
    
    // Using your custom toast configuration
    toast((t) => (
      <div className="flex items-center">
        <Pencil className="w-5 h-5 mr-2" />
        Editing: {bank.bankName}
      </div>
    ), {
      duration: 2500,
    });
  };

  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
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

  // Handle search using your ToastConfig styles
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
    
    // Show toast for search results
    setTimeout(() => {
      const filteredResults = sortedBanks.filter(bank =>
        bank.bankName.toLowerCase().includes(searchValue.toLowerCase()) ||
        bank.accountNo.toLowerCase().includes(searchValue.toLowerCase()) ||
        (bank.address || '').toLowerCase().includes(searchValue.toLowerCase())
      );
      
      if (filteredResults.length === 0 && searchValue.trim()) {
        // Using your warning toast style
        toast((t) => (
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            No banks found for "{searchValue}"
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
      } else if (filteredResults.length > 0 && searchValue.trim()) {
        // Using your custom toast style
        toast((t) => (
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Found {filteredResults.length} bank{filteredResults.length > 1 ? 's' : ''}
          </div>
        ), {
          duration: 2000,
        });
      }
    }, 100);
  };

  // Sorted & filtered banks for display
  const sortedBanks = [...banks].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredBanks = sortedBanks.filter(bank =>
    bank.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.accountNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (bank.address || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBanks = filteredBanks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBanks.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, banks]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== '') {
        handleSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading bank information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <Landmark className="w-8 h-8 mr-3 text-indigo-600" />
              Bank Information Management
            </h1>
            <p className="text-gray-600 mt-2">Manage bank details for your logistics operations</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleToggleAddForm}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center shadow-md 
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-white-600 hover:bg-gray-100 text-indigo-600'}`}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Cancel' : 'Add Bank'}
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH BANKS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Bank Name, Account Number, or Address
                </label>
                <input
                  type="text"
                  placeholder="Search banks..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Bank Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                {editingId ? 'Edit Bank' : 'Add New Bank'}
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter bank name"
                      value={newBank.bankName}
                      onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter branch number"
                      value={newBank.branchNo}
                      onChange={(e) => setNewBank({ ...newBank, branchNo: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter account name"
                      value={newBank.accountName}
                      onChange={(e) => setNewBank({ ...newBank, accountName: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter account number"
                      value={newBank.accountNo}
                      onChange={(e) => setNewBank({ ...newBank, accountNo: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IBAN
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter IBAN"
                      value={newBank.iban}
                      onChange={(e) => setNewBank({ ...newBank, iban: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                      placeholder="Enter address"
                      rows="3"
                      value={newBank.address}
                      onChange={(e) => setNewBank({ ...newBank, address: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={handleToggleAddForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBank}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm"
                >
                  {editingId ? 'Update Bank' : 'Add Bank'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bank Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Bank Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">{filteredBanks.length} banks</span>
            </div>
          </div>
        </div>

        {/* Banks Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'Bank Name', key: 'bankName' },
                    { label: 'Branch No', key: 'branchNo' },
                    { label: 'Account Name', key: 'accountName' },
                    { label: 'Account No', key: 'accountNo' },
                    { label: 'IBAN', key: 'iban' },
                    { label: 'Address', key: 'address' },
                    { label: 'Actions', key: null },
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
                {currentBanks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Landmark className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No bank records found</h4>
                        <p className="text-gray-400 mt-2">
                          {searchTerm ? 'Try adjusting your search criteria' : 'Create your first bank record to get started'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentBanks.map((bank) => (
                    <tr key={bank.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bank.bankName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {bank.branchNo || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {bank.accountName || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {bank.accountNo}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {bank.iban || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                        {bank.address || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleEdit(bank)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(bank.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
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
                Showing {indexOfFirstItem + 1} to{' '}
                {Math.min(indexOfLastItem, filteredBanks.length)} of {filteredBanks.length} banks
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
                Total: <span className="text-green-600 font-bold">{filteredBanks.length} banks</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Configuration - Your centralized config */}
      <ToastConfig position="bottom-right" />
    </div>
  );
};

export default BankInformationPage;
