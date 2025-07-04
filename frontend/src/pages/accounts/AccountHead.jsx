import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, Loader, AlertTriangle, FileText, Power, PowerOff,
  Eye, EyeOff, BarChart3, Filter
} from 'lucide-react';
import Select from 'react-select';
import axios from 'axios';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';

const AccountHead = () => {
  // State management
  const [accounts, setAccounts] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    account_type: '',
    account_head: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('account_head');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [includeInactive, setIncludeInactive] = useState(false);
  const [statusCounts, setStatusCounts] = useState({
    active_count: 0,
    inactive_count: 0,
    total_count: 0
  });
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const itemsPerPage = 10;

  // API Base URL
  const API_BASE_URL = 'http://localhost:5000/api/accounts-head';

  // Authentication headers function
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
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

  // Status filter options
  const statusFilterOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active Only' },
    { value: 'inactive', label: 'Inactive Only' }
  ];

  // Validation function
  const validateForm = () => {
    const errors = {};
    
    if (!formData.account_type.trim()) {
      errors.account_type = 'Account type is required';
    }
    
    if (!formData.account_head.trim()) {
      errors.account_head = 'Account head is required';
    } else if (formData.account_head.trim().length < 2) {
      errors.account_head = 'Account head must be at least 2 characters';
    }
    
    if (formData.description && formData.description.length > 1000) {
      errors.description = 'Description must be less than 1000 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle authentication errors
  const handleAuthError = (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      toast.error('Authentication failed. Please login again.');
    } else if (error.response?.status === 404) {
      toast.error('API endpoint not found. Please check if the server is running.');
    } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      toast.error('Cannot connect to server. Please ensure the backend server is running on port 5000.');
    } else {
      toast.error(error.response?.data?.message || error.message || 'An error occurred');
    }
  };

  // Fetch status counts
  const fetchStatusCounts = async () => {
    try {
      const authHeaders = getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/status-counts`, authHeaders);
      
      if (response.data.success) {
        setStatusCounts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching status counts:', error);
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
        toast.error('Failed to load account types');
      }
    } catch (error) {
      console.error('Error fetching account types:', error);
      handleAuthError(error);
    }
  };

  // Fetch account heads with search, sort, and pagination
  const fetchAccountHeads = async (page = currentPage, search = searchTerm, sortBy = sortField, sortDir = sortDirection, includeInactiveFlag = includeInactive) => {
    setLoading(true);
    try {
      const authHeaders = getAuthHeaders();
      const params = {
        page,
        limit: itemsPerPage,
        search,
        sortField: sortBy,
        sortDirection: sortDir,
        includeInactive: includeInactiveFlag.toString()
      };

      const response = await axios.get(API_BASE_URL, { 
        ...authHeaders,
        params 
      });
      
      if (response.data.success) {
        let { data, total, totalPages: pages } = response.data.data;
        
        // Apply status filter on frontend if needed
        if (statusFilter !== 'all') {
          data = data.filter(account => {
            if (statusFilter === 'active') return account.is_active;
            if (statusFilter === 'inactive') return !account.is_active;
            return true;
          });
        }
        
        setAccounts(data);
        setTotalRecords(total);
        setTotalPages(pages);
        console.log('Account heads loaded successfully:', data.length, 'records');
        
        if (data.length === 0 && search) {
          toast.custom(
            (t) => (
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                No account heads found for "{search}"
              </div>
            ),
            {
              duration: 3000,
              style: {
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#fff',
                border: '1px solid #F59E0B',
              }
            }
          );
        }
      } else {
        toast.error(response.data.message || 'Failed to fetch account heads');
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
      account_head: '',
      description: ''
    });
    setEditingId(null);
    setIsAdding(false);
    setFormErrors({});
  };

  // Toggle add form
  const handleToggleAddForm = () => {
    if (isAdding) {
      resetForm();
      toast.custom(
        (t) => (
          <div className="flex items-center">
            <X className="w-5 h-5 mr-2" />
            Form cancelled
          </div>
        ),
        {
          duration: 2000,
          style: {
            background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
            color: '#fff',
            border: '1px solid #6B7280',
          }
        }
      );
    } else {
      setIsAdding(true);
      setEditingId(null);
      setFormErrors({});
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Add or update account
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(editingId ? 'Updating account head...' : 'Creating account head...');
    
    try {
      const authHeaders = getAuthHeaders();
      let response;
      
      if (editingId) {
        // Update existing account
        response = await axios.put(`${API_BASE_URL}/${editingId}`, formData, authHeaders);
        toast.dismiss(loadingToast);
        toast.success('Account head updated successfully!');
      } else {
        // Add new account
        response = await axios.post(API_BASE_URL, formData, authHeaders);
        toast.dismiss(loadingToast);
        toast.success('Account head created successfully!');
      }

      if (response.data.success) {
        resetForm();
        await fetchAccountHeads();
        await fetchStatusCounts();
      } else {
        toast.dismiss(loadingToast);
        toast.error(response.data.message || 'Failed to save account head');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Error saving account head:', error);
      
      if (error.response?.status === 409) {
        toast.error('Account head already exists');
        setFormErrors({ account_head: 'This account head already exists' });
      } else if (error.response?.status === 400) {
        const errorMessage = error.response.data.error || 'Validation failed';
        toast.error(errorMessage);
      } else {
        handleAuthError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Edit account
  const handleEdit = (account) => {
    setFormData({
      account_type: account.account_type,
      account_head: account.account_head,
      description: account.description || ''
    });
    setEditingId(account.id);
    setIsAdding(true);
    setFormErrors({});
    
    toast.custom(
      (t) => (
        <div className="flex items-center">
          <Pencil className="w-5 h-5 mr-2" />
          Editing: {account.account_head}
        </div>
      ),
      {
        duration: 2000,
        style: {
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          color: '#fff',
          border: '1px solid #F59E0B',
        }
      }
    );
  };

  // Toggle account status
  const handleToggleStatus = async (id, accountName, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    const confirmMessage = `Are you sure you want to ${action} "${accountName}"?`;
    
    if (!window.confirm(confirmMessage)) return;
    
    setLoading(true);
    const loadingToast = toast.loading(`${action === 'activate' ? 'Activating' : 'Deactivating'} account head...`);
    
    try {
      const authHeaders = getAuthHeaders();
      const response = await axios.put(`${API_BASE_URL}/${id}/toggle-status`, {}, authHeaders);
      
      if (response.data.success) {
        toast.dismiss(loadingToast);
        const statusText = response.data.data.is_active ? 'activated' : 'deactivated';
        toast.success(`"${accountName}" ${statusText} successfully!`);
        await fetchAccountHeads();
        await fetchStatusCounts();
      } else {
        toast.dismiss(loadingToast);
        toast.error(response.data.message || 'Failed to toggle account head status');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Error toggling account head status:', error);
      
      if (error.response?.status === 404) {
        toast.error('Account head not found');
      } else {
        handleAuthError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const handleDelete = async (id, accountName) => {
    const confirmMessage = `Are you sure you want to delete "${accountName}"? This action will deactivate the account head.`;
    
    if (!window.confirm(confirmMessage)) return;
    
    setLoading(true);
    const loadingToast = toast.loading('Deleting account head...');
    
    try {
      const authHeaders = getAuthHeaders();
      const response = await axios.delete(`${API_BASE_URL}/${id}`, authHeaders);
      
      if (response.data.success) {
        if (editingId === id) {
          resetForm();
        }
        toast.dismiss(loadingToast);
        toast.success(`"${accountName}" deleted successfully!`);
        await fetchAccountHeads();
        await fetchStatusCounts();
      } else {
        toast.dismiss(loadingToast);
        toast.error(response.data.message || 'Failed to delete account head');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Error deleting account head:', error);
      
      if (error.response?.status === 404) {
        toast.error('Account head not found');
      } else {
        handleAuthError(error);
      }
    } finally {
      setLoading(false);
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
    fetchAccountHeads(1, searchTerm, field, newDirection, includeInactive);
  };

  // Search handler
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
    fetchAccountHeads(1, searchValue, sortField, sortDirection, includeInactive);
  };

  // Pagination handler
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchAccountHeads(newPage, searchTerm, sortField, sortDirection, includeInactive);
  };

  // Handle include inactive toggle
  const handleIncludeInactiveToggle = () => {
    const newIncludeInactive = !includeInactive;
    setIncludeInactive(newIncludeInactive);
    setCurrentPage(1);
    fetchAccountHeads(1, searchTerm, sortField, sortDirection, newIncludeInactive);
  };

  // Handle status filter change
  const handleStatusFilterChange = (selectedOption) => {
    setStatusFilter(selectedOption.value);
    setCurrentPage(1);
    
    if (selectedOption.value === 'all') {
      setIncludeInactive(true);
      fetchAccountHeads(1, searchTerm, sortField, sortDirection, true);
    } else if (selectedOption.value === 'active') {
      setIncludeInactive(false);
      fetchAccountHeads(1, searchTerm, sortField, sortDirection, false);
    } else if (selectedOption.value === 'inactive') {
      setIncludeInactive(true);
      fetchAccountHeads(1, searchTerm, sortField, sortDirection, true);
    }
  };

  // Render sort icon
  const renderSortIcon = (field) => {
    if (sortField !== field) return <ArrowUp className="w-3 h-3 text-gray-400 inline" />;
    return sortDirection === 'asc' ?
      <ArrowUp className="w-3 h-3 text-indigo-600 inline" /> :
      <ArrowDown className="w-3 h-3 text-indigo-600 inline" />;
  };

  // Get status badge
  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <Power className="w-3 h-3 mr-1" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <PowerOff className="w-3 h-3 mr-1" />
        Inactive
      </span>
    );
  };

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      console.log('Initializing account head data...');
      try {
        await fetchAccountTypes();
        await fetchAccountHeads();
        await fetchStatusCounts();
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
        fetchAccountHeads(1, '', sortField, sortDirection, includeInactive);
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

        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.total_count}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Power className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.active_count}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <PowerOff className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.inactive_count}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Filter className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Showing</p>
                <p className="text-2xl font-bold text-purple-600">{accounts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH & FILTER ACCOUNT HEADS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Account Head, Type, or Description
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status Filter
                </label>
                <Select
                  options={statusFilterOptions}
                  value={statusFilterOptions.find(option => option.value === statusFilter)}
                  onChange={handleStatusFilterChange}
                  placeholder="Filter by status"
                  isSearchable={false}
                  styles={selectStyles}
                  className="w-full text-sm"
                  isDisabled={loading}
                />
              </div>
            </div>
            
            <div className="mt-4 flex items-center">
              <button
                onClick={handleIncludeInactiveToggle}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  includeInactive 
                    ? 'bg-orange-100 text-orange-800 border border-orange-300' 
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}
                disabled={loading}
              >
                {includeInactive ? (
                  <Eye className="w-4 h-4 mr-2" />
                ) : (
                  <EyeOff className="w-4 h-4 mr-2" />
                )}
                {includeInactive ? 'Showing All Records' : 'Showing Active Only'}
              </button>
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
                    {formErrors.account_type && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.account_type}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Head <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm ${
                        formErrors.account_head ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter account head name"
                      value={formData.account_head}
                      onChange={(e) => handleInputChange('account_head', e.target.value)}
                      disabled={loading}
                    />
                    {formErrors.account_head && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.account_head}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description Field */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm ${
                    formErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter description for this account head"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={loading}
                />
                {formErrors.description && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  {formData.description.length}/1000 characters
                </p>
              </div>
              
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={handleToggleAddForm}
                  disabled={loading}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
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

        {/* Account Heads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'SL No', key: null },
                    { label: 'Status', key: 'is_active' },
                    { label: 'Account Type', key: 'account_type' },
                    { label: 'Account Head', key: 'account_head' },
                    { label: 'Description', key: 'description' },
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
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Loader className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                        <p>Loading account heads...</p>
                      </div>
                    </td>
                  </tr>
                ) : accounts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <ClipboardList className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No account heads found</h4>
                        <p className="text-gray-400 mt-2">
                          {searchTerm ? 'Try adjusting your search criteria' : 'Create your first account head to get started'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  accounts.map((account, index) => (
                    <tr key={account.id} className={`hover:bg-gray-50 transition ${!account.is_active ? 'bg-gray-50 opacity-75' : ''}`}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {getStatusBadge(account.is_active)}
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
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
                        {account.description ? (
                          <div className="flex items-start">
                            <FileText className="w-4 h-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                            <span className="truncate" title={account.description}>
                              {account.description}
                            </span>
                          </div>
                        ) : (
                          <span className="italic text-gray-400">No description</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleToggleStatus(account.id, account.account_head, account.is_active)}
                          disabled={loading}
                          className={`p-1 rounded hover:bg-opacity-20 disabled:opacity-50 transition ${
                            account.is_active 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={account.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {account.is_active ? (
                            <PowerOff className="w-4 h-4" />
                          ) : (
                            <Power className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(account)}
                          disabled={loading}
                          className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 p-1 rounded hover:bg-indigo-50"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(account.id, account.account_head)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 p-1 rounded hover:bg-red-50"
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
                  
                  {/* Page numbers */}
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 rounded-md text-sm transition ${
                            currentPage === pageNum
                              ? 'bg-indigo-600 text-white'
                              : 'hover:bg-indigo-100 text-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
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

      {/* Toast Configuration */}
      <ToastConfig />
    </div>
  );
};

export default AccountHead;
