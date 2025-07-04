import React, { useState, useEffect } from 'react';
import {
  Calculator, Plus, X, Save, ChevronDown, Search, 
  ChevronLeft, ChevronRight, Pencil, Trash2, DollarSign,
  AlertTriangle, RefreshCw
} from 'lucide-react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

// Import the toast configuration component
import ToastConfig from '../../components/ToastConfig';

// Auth header utility
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

const OpeningBalancePage = () => {
  // State management
  const [openingBalances, setOpeningBalances] = useState([]);
  const [accountHeads, setAccountHeads] = useState([]);
  const [subAccountHeads, setSubAccountHeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newBalance, setNewBalance] = useState({
    accountHead: '',
    subAccountHead: '',
    date: new Date(),
    type: '',
    amount: '',
    description: ''
  });
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [totals, setTotals] = useState({
    total_debit: 0,
    total_credit: 0,
    net_balance: 0,
    total_entries: 0
  });
  const itemsPerPage = 8;

  const typeOptions = ['Debit', 'Credit'];

  // API Base URL - Updated to match your backend
  const API_BASE_URL = 'http://localhost:5000/api';

  // Initialize data
  useEffect(() => {
    fetchAccountHeads();
  }, []);

  useEffect(() => {
    fetchOpeningBalances();
    fetchTotals();
  }, [currentPage, searchTerm]);

  // Fetch account heads (only active ones)
  const fetchAccountHeads = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/accounts-head`, getAuthHeaders());
      
      if (response.data.success && response.data.data && response.data.data.data) {
        // Filter only active account heads
        const activeAccountHeads = response.data.data.data.filter(head => head.is_active === 1);
        setAccountHeads(activeAccountHeads);
        
        if (activeAccountHeads.length === 0) {
          toast.custom((t) => (
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              No active account heads found
            </div>
          ));
        }
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error fetching account heads:', error);
      toast.error('Failed to fetch account heads');
      setAccountHeads([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sub account heads based on account head
  const fetchSubAccountHeads = async (accountHeadId) => {
    try {
      setSubAccountHeads([]); // Clear existing sub accounts
      
      if (!accountHeadId) {
        return;
      }

      // First, get the account head name from the selected ID
      const selectedAccountHead = accountHeads.find(head => head.id === parseInt(accountHeadId));
      if (!selectedAccountHead) {
        console.warn('Account head not found for ID:', accountHeadId);
        toast.error('Selected account head not found');
        return;
      }
      
      // Fetch all sub account heads with includeInactive=false to get only active ones
      const response = await axios.get(`${API_BASE_URL}/sub-accounts-head`, {
        ...getAuthHeaders(),
        params: { includeInactive: 'false' }
      });
      
      if (response.data.success && Array.isArray(response.data.data)) {
        // Filter sub account heads that match the selected account head name
        const filteredSubAccounts = response.data.data.filter(subHead => 
          subHead.account_head === selectedAccountHead.account_head && subHead.is_active
        );
        
        setSubAccountHeads(filteredSubAccounts);
        
        if (filteredSubAccounts.length === 0) {
          toast.custom((t) => (
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              No active sub-account heads found for this account
            </div>
          ));
        }
      } else if (Array.isArray(response.data)) {
        // Handle direct array response
        const filteredSubAccounts = response.data.filter(subHead => 
          subHead.account_head === selectedAccountHead.account_head && subHead.is_active !== false
        );
        setSubAccountHeads(filteredSubAccounts);
      } else {
        console.warn('Unexpected API response structure:', response.data);
        setSubAccountHeads([]);
      }
    } catch (error) {
      console.error('Error fetching sub account heads:', error);
      toast.error('Failed to fetch sub account heads');
      setSubAccountHeads([]);
    }
  };

  // Fetch opening balances
  const fetchOpeningBalances = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/opening-balance`, {
        ...getAuthHeaders(),
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm
        }
      });
      
      if (response.data.success) {
        setOpeningBalances(response.data.data.data || []);
        setTotalPages(response.data.data.totalPages || 1);
        setTotalEntries(response.data.data.total || 0);
      } else {
        throw new Error(response.data.error || 'Failed to fetch opening balances');
      }
    } catch (error) {
      console.error('Error fetching opening balances:', error);
      toast.error(error.response?.data?.error || 'Failed to fetch opening balances');
      setOpeningBalances([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch totals
  const fetchTotals = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/opening-balance/totals`, getAuthHeaders());
      
      if (response.data.success) {
        setTotals(response.data.data);
      } else {
        // Use fallback values if API fails but don't show error toast for totals
        setTotals({
          total_debit: 0,
          total_credit: 0,
          net_balance: 0,
          total_entries: 0
        });
      }
    } catch (error) {
      console.error('Error fetching totals:', error);
      // Set default values without showing error toast
      setTotals({
        total_debit: 0,
        total_credit: 0,
        net_balance: 0,
        total_entries: 0
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!newBalance.accountHead) {
      errors.accountHead = 'Account Head is required';
    }
    
    if (!newBalance.subAccountHead) {
      errors.subAccountHead = 'Sub Account Head is required';
    }
    
    if (!newBalance.type) {
      errors.type = 'Type is required';
    }
    
    if (!newBalance.amount || parseFloat(newBalance.amount) <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
    
    if (!newBalance.date) {
      errors.date = 'Date is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle account head change to load sub accounts
  const handleAccountHeadChange = (accountHeadId) => {
    setNewBalance({ ...newBalance, accountHead: accountHeadId, subAccountHead: '' });
    setFormErrors({ ...formErrors, accountHead: '', subAccountHead: '' });
    
    if (accountHeadId) {
      fetchSubAccountHeads(accountHeadId);
    } else {
      setSubAccountHeads([]);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(editingId ? 'Updating opening balance...' : 'Creating opening balance...');
    
    try {
      const data = {
        account_head_id: parseInt(newBalance.accountHead),
        sub_account_head_id: parseInt(newBalance.subAccountHead),
        balance_date: newBalance.date.toISOString().split('T')[0],
        balance_type: newBalance.type,
        amount: parseFloat(newBalance.amount),
        description: newBalance.description || ''
      };

      let response;
      
      if (editingId) {
        // Update existing
        response = await axios.put(
          `${API_BASE_URL}/opening-balance/${editingId}`, 
          data, 
          getAuthHeaders()
        );
      } else {
        // Add new
        response = await axios.post(
          `${API_BASE_URL}/opening-balance`, 
          data, 
          getAuthHeaders()
        );
      }
      
      toast.dismiss(loadingToast);
      
      if (response.data.success) {
        toast.success(editingId ? 'Opening Balance updated successfully!' : 'Opening Balance added successfully!');
        
        // Reset form and refresh data
        handleCancel();
        await fetchOpeningBalances();
        await fetchTotals();
      } else {
        throw new Error(response.data.error || 'Operation failed');
      }
      
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Error saving opening balance:', error);
      
      const errorMessage = error.response?.data?.error || error.message || 'Failed to save Opening Balance. Please try again.';
      toast.error(errorMessage);
      
      // Handle specific validation errors
      if (error.response?.status === 400 && error.response?.data?.error) {
        const errorMsg = error.response.data.error;
        if (errorMsg.includes('already exists')) {
          setFormErrors({ 
            ...formErrors, 
            general: 'Opening balance already exists for this account on this date' 
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setNewBalance({
      accountHead: item.account_head_id.toString(),
      subAccountHead: item.sub_account_head_id.toString(),
      date: new Date(item.date),
      type: item.type,
      amount: item.amount.toString(),
      description: item.description || ''
    });
    setEditingId(item.id);
    setIsAdding(true);
    setFormErrors({});
    
    // Load sub account heads for the selected account head
    if (item.account_head_id) {
      fetchSubAccountHeads(item.account_head_id);
    }
    
    toast.custom((t) => (
      <div className="flex items-center">
        <Pencil className="w-5 h-5 mr-2" />
        Editing opening balance for {item.account_head}
      </div>
    ));
  };

  // Handle delete
  const handleDelete = async (id, accountName, subAccountName) => {
    const confirmMessage = `Are you sure you want to delete the opening balance for "${accountName} - ${subAccountName}"?`;
    
    if (!window.confirm(confirmMessage)) return;
    
    setLoading(true);
    const loadingToast = toast.loading('Deleting opening balance...');
    
    try {
      const response = await axios.delete(`${API_BASE_URL}/opening-balance/${id}`, getAuthHeaders());
      
      toast.dismiss(loadingToast);
      
      if (response.data.success) {
        toast.success('Opening Balance deleted successfully!');
        await fetchOpeningBalances();
        await fetchTotals();
      } else {
        throw new Error(response.data.error || 'Delete operation failed');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Error deleting opening balance:', error);
      
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete Opening Balance. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel/close form
  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewBalance({
      accountHead: '',
      subAccountHead: '',
      date: new Date(),
      type: '',
      amount: '',
      description: ''
    });
    setSubAccountHeads([]);
    setFormErrors({});
    
    toast.custom((t) => (
      <div className="flex items-center">
        <X className="w-5 h-5 mr-2" />
        Form cancelled
      </div>
    ));
  };

  // Refresh data
  const handleRefresh = async () => {
    setLoading(true);
    const loadingToast = toast.loading('Refreshing data...');
    
    try {
      await Promise.all([
        fetchAccountHeads(),
        fetchOpeningBalances(),
        fetchTotals()
      ]);
      
      toast.dismiss(loadingToast);
      toast.success('Data refreshed successfully!');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  // Sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <Calculator className="w-8 h-8 mr-3 text-indigo-600" />
                OPENING BALANCE
              </h1>
              <p className="text-gray-600 mt-2">Manage opening balances for your accounting system</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <div className="relative">
                <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                  <Search className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search balances..."
                    className="bg-transparent outline-none w-40"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all flex items-center shadow-md disabled:opacity-50"
                title="Refresh Data"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => {
                  if (isAdding) {
                    handleCancel();
                  } else {
                    setIsAdding(true);
                    setEditingId(null);
                    setNewBalance({
                      accountHead: '',
                      subAccountHead: '',
                      date: new Date(),
                      type: '',
                      amount: '',
                      description: ''
                    });
                    setSubAccountHeads([]);
                    setFormErrors({});
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
                    Add Opening Balance
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Debit</p>
                  <p className="text-2xl font-bold text-green-600">
                    SAR {(totals.total_debit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Credit</p>
                  <p className="text-2xl font-bold text-red-600">
                    SAR {(totals.total_credit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <DollarSign className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Balance</p>
                  <p className={`text-2xl font-bold ${(totals.net_balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    SAR {Math.abs(totals.net_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Calculator className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          {isAdding && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  {editingId ? 'Edit Opening Balance' : 'Add Opening Balance'}
                </h2>
              </div>
              <div className="p-6">
                {/* Form Error Display */}
                {formErrors.general && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{formErrors.general}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Account Head */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Head <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        formErrors.accountHead ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={newBalance.accountHead}
                      onChange={(e) => handleAccountHeadChange(e.target.value)}
                    >
                      <option value="">--Select Account Head--</option>
                      {accountHeads.map(head => (
                        <option key={head.id} value={head.id}>
                          {head.account_head} ({head.account_type})
                        </option>
                      ))}
                    </select>
                    {formErrors.accountHead && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.accountHead}</p>
                    )}
                  </div>

                  {/* Sub Account Head */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub Account Head <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        formErrors.subAccountHead ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={newBalance.subAccountHead}
                      onChange={(e) => {
                        setNewBalance({ ...newBalance, subAccountHead: e.target.value });
                        setFormErrors({ ...formErrors, subAccountHead: '' });
                      }}
                      disabled={!newBalance.accountHead}
                    >
                      <option value="">--Select Sub Account Head--</option>
                      {subAccountHeads.map(subHead => (
                        <option key={subHead.id} value={subHead.id}>
                          {subHead.sub_account_head}
                        </option>
                      ))}
                    </select>
                    {formErrors.subAccountHead && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.subAccountHead}</p>
                    )}
                    {!newBalance.accountHead && (
                      <p className="text-gray-500 text-xs mt-1">Select an account head first</p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      selected={newBalance.date}
                      onChange={(date) => {
                        setNewBalance({ ...newBalance, date });
                        setFormErrors({ ...formErrors, date: '' });
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        formErrors.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                      dateFormat="yyyy-MM-dd"
                      maxDate={new Date()}
                    />
                    {formErrors.date && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>
                    )}
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        formErrors.type ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={newBalance.type}
                      onChange={(e) => {
                        setNewBalance({ ...newBalance, type: e.target.value });
                        setFormErrors({ ...formErrors, type: '' });
                      }}
                    >
                      <option value="">--Select Type--</option>
                      {typeOptions.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {formErrors.type && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.type}</p>
                    )}
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        formErrors.amount ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={newBalance.amount}
                      onChange={(e) => {
                        setNewBalance({ ...newBalance, amount: e.target.value });
                        setFormErrors({ ...formErrors, amount: '' });
                      }}
                    />
                    {formErrors.amount && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.amount}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="Optional description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={newBalance.description}
                      onChange={(e) => setNewBalance({ ...newBalance, description: e.target.value })}
                      maxLength={1000}
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      {newBalance.description.length}/1000 characters
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
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
                        {editingId ? 'Update' : 'Save'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-indigo-600 text-white text-sm font-semibold">
                <tr>
                  <th className="px-6 py-3 text-left">Sl.No</th>
                  <th 
                    className="px-6 py-3 text-left cursor-pointer hover:bg-indigo-700"
                    onClick={() => handleSort('account_head')}
                  >
                    <div className="flex items-center">
                      Account Head
                      {sortField === 'account_head' && (
                        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">Sub Account Head</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && openingBalances.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mr-3"></div>
                        Loading opening balances...
                      </div>
                    </td>
                  </tr>
                ) : openingBalances.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      <Calculator className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      No opening balance entries found
                      {searchTerm && (
                        <div className="mt-2 text-sm text-gray-400">
                          Try adjusting your search criteria
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  openingBalances.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-center text-gray-900 font-medium">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {item.account_head}
                        <div className="text-xs text-gray-500">({item.account_type})</div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{item.sub_account_head}</td>
                      <td className="px-6 py-4 text-gray-900">
                        {new Date(item.date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.type === 'Debit' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        SAR {parseFloat(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 flex space-x-3">
                        <button
                          onClick={() => handleEdit(item)}
                          title="Edit"
                          className="text-indigo-600 hover:text-indigo-800 transition p-1 rounded hover:bg-indigo-50"
                          disabled={loading}
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.account_head, item.sub_account_head)}
                          title="Delete"
                          className="text-red-600 hover:text-red-800 transition p-1 rounded hover:bg-red-50"
                          disabled={loading}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalEntries)} of {totalEntries} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
                    title="Previous"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex space-x-1">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 rounded-md text-sm transition ${
                              currentPage === pageNum
                                ? 'bg-indigo-600 text-white'
                                : 'hover:bg-indigo-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return <span key={pageNum} className="px-2">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
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
      </div>
      
      {/* Toast Configuration Component */}
      <ToastConfig />
    </>
  );
};

export default OpeningBalancePage;

