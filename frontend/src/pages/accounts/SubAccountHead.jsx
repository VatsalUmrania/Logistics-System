import React, { useState, useEffect } from 'react';
import {
  FolderOpen, Plus, X, Pencil, Trash2, ChevronDown, Search,
  ChevronLeft, ChevronRight, Save, Building2, AlertTriangle,
  Power, PowerOff, Eye, EyeOff, BarChart3, Filter
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';

// Move BASE_URL outside component
const BASE_URL = 'http://localhost:5000/api/sub-accounts-head';

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

const SubAccountHeadPage = () => {
  // State management
  const [subAccountHeads, setSubAccountHeads] = useState([]);
  const [accountHeads, setAccountHeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newSubAccount, setNewSubAccount] = useState({
    accountHead: '',
    subAccountHead: '',
    description: ''
  });
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [includeInactive, setIncludeInactive] = useState(false);
  const [statusCounts, setStatusCounts] = useState({
    active_count: 0,
    inactive_count: 0,
    total_count: 0
  });
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const itemsPerPage = 8;

  // Validation function
  const validateForm = () => {
    const errors = {};
    
    if (!newSubAccount.accountHead.trim()) {
      errors.accountHead = 'Account Head is required';
    }
    
    if (!newSubAccount.subAccountHead.trim()) {
      errors.subAccountHead = 'Sub Account Head is required';
    } else if (newSubAccount.subAccountHead.trim().length < 2) {
      errors.subAccountHead = 'Sub Account Head must be at least 2 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Fetch status counts
  const fetchStatusCounts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/status-counts`, getAuthHeaders());
      
      if (res.data.success) {
        setStatusCounts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch status counts:', err);
    }
  };

  // Fetch account heads for dropdown (only active ones)
  const fetchAccountHeads = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/accounts-head`, getAuthHeaders());
      
      // Handle the response structure
      if (res.data.success && res.data.data && res.data.data.data) {
        const accountHeadsData = res.data.data.data
          .filter(head => head.is_active === 1) // Only active account heads
          .map(head => ({
            id: head.id,
            account_head: head.account_head,
            account_type: head.account_type,
            description: head.description,
            is_active: head.is_active
          }));
        
        setAccountHeads(accountHeadsData);
        
        if (accountHeadsData.length === 0) {
          toast.custom(
            (t) => (
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                No active account heads found
              </div>
            )
          );
        }
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.error('Failed to fetch account heads:', err);
      toast.error('Failed to load active account heads');
      setAccountHeads([]);
    }
  };

  // Fetch sub account heads data
  const fetchData = async (includeInactiveFlag = includeInactive) => {
    try {
      setLoading(true);
      const params = {
        includeInactive: includeInactiveFlag.toString()
      };
      
      const res = await axios.get(BASE_URL, { 
        ...getAuthHeaders(),
        params 
      });
      
      // Handle response format
      if (res.data.success) {
        const formatted = res.data.data.map(item => ({
          id: item.id,
          accountHeadId: item.account_head_id,
          accountHead: item.account_head,
          subAccountHead: item.sub_account_head,
          accountType: item.account_type || '',
          description: item.description || '',
          isActive: item.is_active !== undefined ? item.is_active : true
        }));
        
        setSubAccountHeads(formatted);
        
        if (formatted.length === 0) {
          toast.custom(
            (t) => (
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                No sub account heads found
              </div>
            )
          );
        }
      } else {
        const formatted = res.data.map(item => ({
          id: item.id,
          accountHeadId: item.account_head_id,
          accountHead: item.account_head,
          subAccountHead: item.sub_account_head,
          accountType: item.account_type || '',
          description: item.description || '',
          isActive: item.is_active !== undefined ? item.is_active : true
        }));
        
        setSubAccountHeads(formatted);
      }
    } catch (err) {
      toast.error('Failed to load Sub Account Heads');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAccountHeads();
    fetchData();
    fetchStatusCounts();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Saving Sub Account Head...');
    
    try {
      const payload = {
        account_head: newSubAccount.accountHead,
        sub_account_head: newSubAccount.subAccountHead,
        description: newSubAccount.description || null
      };

      if (editingId) {
        // PUT request to update
        await axios.put(`${BASE_URL}/${editingId}`, payload, getAuthHeaders());
        toast.dismiss(loadingToast);
        toast.success('Sub Account Head updated successfully!');
      } else {
        // POST request to create
        await axios.post(BASE_URL, payload, getAuthHeaders());
        toast.dismiss(loadingToast);
        toast.success('Sub Account Head added successfully!');
      }

      // Refetch data
      await fetchData();
      await fetchStatusCounts();

      // Reset form
      setIsAdding(false);
      setEditingId(null);
      setNewSubAccount({ accountHead: '', subAccountHead: '', description: '' });
      setFormErrors({});
      
    } catch (err) {
      toast.dismiss(loadingToast);
      
      if (err.response?.status === 400) {
        const errorMessage = err.response.data.error || 'Validation failed';
        toast.error(errorMessage);
        
        // Handle specific validation errors
        if (errorMessage.includes('already exists')) {
          setFormErrors({ subAccountHead: 'This sub account head already exists' });
        } else if (errorMessage.includes('inactive account head')) {
          setFormErrors({ accountHead: 'Selected account head is inactive' });
        }
      } else if (err.response?.status === 404) {
        toast.error('Account head not found');
      } else {
        toast.error('Failed to save Sub Account Head. Please try again.');
      }
      
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setNewSubAccount({
      accountHead: item.accountHead,
      subAccountHead: item.subAccountHead,
      description: item.description || ''
    });
    setEditingId(item.id);
    setIsAdding(true);
    setFormErrors({});
    
    toast.custom(
      (t) => (
        <div className="flex items-center">
          <Pencil className="w-5 h-5 mr-2" />
          Editing: {item.subAccountHead}
        </div>
      )
    );
  };

  // Handle toggle status
  const handleToggleStatus = async (id, subAccountName, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    const confirmMessage = `Are you sure you want to ${action} "${subAccountName}"?`;
    
    if (!window.confirm(confirmMessage)) return;
    
    setLoading(true);
    const loadingToast = toast.loading(`${action === 'activate' ? 'Activating' : 'Deactivating'} sub account head...`);
    
    try {
      const response = await axios.put(`${BASE_URL}/${id}/toggle-status`, {}, getAuthHeaders());
      
      if (response.data.success) {
        toast.dismiss(loadingToast);
        const statusText = response.data.data.is_active ? 'activated' : 'deactivated';
        toast.success(`"${subAccountName}" ${statusText} successfully!`);
        await fetchData();
        await fetchStatusCounts();
      } else {
        toast.dismiss(loadingToast);
        toast.error(response.data.message || 'Failed to toggle sub account head status');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error toggling sub account head status:', err);
      
      if (err.response?.status === 404) {
        toast.error('Sub Account Head not found');
      } else {
        toast.error('Failed to toggle status. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id, subAccountName) => {
    const confirmMessage = `Are you sure you want to delete "${subAccountName}"? This action will deactivate the sub account head.`;
    
    if (!window.confirm(confirmMessage)) return;
    
    setLoading(true);
    const loadingToast = toast.loading('Deleting Sub Account Head...');
    
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`, getAuthHeaders());
      
      if (response.status >= 200 && response.status < 300) {
        toast.dismiss(loadingToast);
        toast.success(`"${subAccountName}" deleted successfully!`);
        await fetchData();
        await fetchStatusCounts();
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      
      if (err.response?.status === 404) {
        toast.error('Sub Account Head not found');
      } else if (err.response?.status === 403) {
        toast.error('You do not have permission to delete this item');
      } else {
        toast.error('Failed to delete Sub Account Head. Please try again.');
      }
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel/close form
  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewSubAccount({ accountHead: '', subAccountHead: '', description: '' });
    setFormErrors({});
    
    toast.custom(
      (t) => (
        <div className="flex items-center">
          <X className="w-5 h-5 mr-2" />
          Form cancelled
        </div>
      )
    );
  };

  // Handle include inactive toggle
  const handleIncludeInactiveToggle = () => {
    const newIncludeInactive = !includeInactive;
    setIncludeInactive(newIncludeInactive);
    setCurrentPage(1);
    fetchData(newIncludeInactive);
    
    toast.custom(
      (t) => (
        <div className="flex items-center">
          {newIncludeInactive ? (
            <Eye className="w-5 h-5 mr-2" />
          ) : (
            <EyeOff className="w-5 h-5 mr-2" />
          )}
          {newIncludeInactive ? 'Showing all records' : 'Showing active only'}
        </div>
      )
    );
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

  // Filter and sort data
  const filteredData = Array.isArray(subAccountHeads)
    ? subAccountHeads.filter(item => {
        // Text search filter
        const matchesSearch = (item.subAccountHead?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (item.accountHead?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (item.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        
        // Status filter
        let matchesStatus = true;
        if (statusFilter === 'active') {
          matchesStatus = item.isActive;
        } else if (statusFilter === 'inactive') {
          matchesStatus = !item.isActive;
        }
        
        return matchesSearch && matchesStatus;
      })
    : [];

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

  // Get account type badge color
  const getAccountTypeBadge = (accountHead) => {
    const accountHeadData = accountHeads.find(ah => ah.account_head === accountHead);
    const accountType = accountHeadData?.account_type || '';
    
    const typeColors = {
      'Asset': 'bg-green-100 text-green-800',
      'Liability': 'bg-red-100 text-red-800',
      'Equity': 'bg-blue-100 text-blue-800',
      'Revenue': 'bg-purple-100 text-purple-800',
      'Expense': 'bg-orange-100 text-orange-800'
    };
    
    return typeColors[accountType] || 'bg-gray-100 text-gray-800';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FolderOpen className="w-8 h-8 mr-3 text-indigo-600" />
              SUB ACCOUNT HEADS
            </h1>
            <p className="text-gray-600 mt-2">Manage sub account heads for your accounting system</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search sub accounts..."
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
                if (isAdding) {
                  handleCancel();
                } else {
                  setIsAdding(true);
                  setEditingId(null);
                  setNewSubAccount({ accountHead: '', subAccountHead: '', description: '' });
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
                  Add Sub Account Head
                </>
              )}
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
                <p className="text-2xl font-bold text-purple-600">{currentItems.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleIncludeInactiveToggle}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                includeInactive 
                  ? 'bg-blue-100 text-blue-800 border border-blue-300' 
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
          
          <div className="text-sm text-gray-600">
            Total Records: <span className="font-semibold">{subAccountHeads.length}</span> | 
            Filtered: <span className="font-semibold">{filteredData.length}</span>
          </div>
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                {editingId ? 'Edit Sub Account Head' : 'Add Sub Account Head'}
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Head Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Account Head <span className="text-red-500">*</span>
                    <span className="text-xs text-blue-600 ml-2">(Active only)</span>
                  </label>
                  <select
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      formErrors.accountHead ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={newSubAccount.accountHead}
                    onChange={(e) => {
                      setNewSubAccount({ ...newSubAccount, accountHead: e.target.value });
                      if (formErrors.accountHead) {
                        setFormErrors({ ...formErrors, accountHead: '' });
                      }
                    }}
                  >
                    <option value="">Choose Account Head</option>
                    {accountHeads.map(head => (
                      <option key={head.id} value={head.account_head}>
                        {head.account_head} ({head.account_type})
                      </option>
                    ))}
                  </select>
                  {formErrors.accountHead && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.accountHead}</p>
                  )}
                  {accountHeads.length === 0 && (
                    <p className="text-orange-500 text-xs mt-1">No active account heads available</p>
                  )}
                </div>

                {/* Sub Account Head Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Account Head <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Sub Account Head"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      formErrors.subAccountHead ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={newSubAccount.subAccountHead}
                    onChange={(e) => {
                      setNewSubAccount({ ...newSubAccount, subAccountHead: e.target.value });
                      if (formErrors.subAccountHead) {
                        setFormErrors({ ...formErrors, subAccountHead: '' });
                      }
                    }}
                  />
                  {formErrors.subAccountHead && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.subAccountHead}</p>
                  )}
                </div>
              </div>

              {/* Description Input */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Enter description for this sub account head"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows="3"
                  value={newSubAccount.description}
                  onChange={(e) => setNewSubAccount({ ...newSubAccount, description: e.target.value })}
                />
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
                  disabled={loading || accountHeads.length === 0}
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
                <th 
                  className="px-6 py-3 text-left cursor-pointer hover:bg-indigo-700"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    Sl.No
                    {sortField === 'id' && (
                      <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left cursor-pointer hover:bg-indigo-700"
                  onClick={() => handleSort('isActive')}
                >
                  <div className="flex items-center">
                    Status
                    {sortField === 'isActive' && (
                      <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left cursor-pointer hover:bg-indigo-700"
                  onClick={() => handleSort('accountHead')}
                >
                  <div className="flex items-center">
                    Account Head
                    {sortField === 'accountHead' && (
                      <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left cursor-pointer hover:bg-indigo-700"
                  onClick={() => handleSort('subAccountHead')}
                >
                  <div className="flex items-center">
                    Sub Account Head
                    {sortField === 'subAccountHead' && (
                      <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mr-3"></div>
                      Loading sub account heads...
                    </div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    <FolderOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    No sub account heads found
                    {searchTerm && (
                      <div className="mt-2 text-sm text-gray-400">
                        Try adjusting your search criteria
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => (
                  <tr key={item.id} className={`border-b border-gray-200 hover:bg-gray-50 transition ${!item.isActive ? 'bg-gray-50 opacity-75' : ''}`}>
                    <td className="px-6 py-4 text-center text-gray-900 font-medium">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.isActive)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAccountTypeBadge(item.accountHead)}`}>
                        {item.accountHead}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{item.subAccountHead}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {item.description || (
                        <span className="italic text-gray-400">No description</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex space-x-3">
                      <button
                        onClick={() => handleToggleStatus(item.id, item.subAccountHead, item.isActive)}
                        disabled={loading}
                        className={`p-1 rounded hover:bg-opacity-20 disabled:opacity-50 transition ${
                          item.isActive 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={item.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {item.isActive ? (
                          <PowerOff className="w-4 h-4" />
                        ) : (
                          <Power className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        title="Edit"
                        className="text-indigo-600 hover:text-indigo-800 transition p-1 rounded hover:bg-indigo-50"
                        disabled={loading}
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.subAccountHead)}
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
          {sortedData.length > itemsPerPage && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedData.length)} of {sortedData.length} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50 transition"
                  title="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
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
                        onClick={() => setCurrentPage(pageNum)}
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50 transition"
                  title="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Your Custom Toast Configuration */}
      <ToastConfig />
    </div>
  );
};

export default SubAccountHeadPage;
