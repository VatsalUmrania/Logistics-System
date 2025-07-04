import React, { useState, useEffect } from 'react';
import {
  BookOpen, Plus, X, Save, Trash2, Calculator, 
  ChevronDown, Search, ChevronLeft, ChevronRight,
  Pencil, Eye, RefreshCw, AlertTriangle
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import toast from 'react-hot-toast';
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

const JournalVoucherPage = () => {
  // State management
  const [journalVouchers, setJournalVouchers] = useState([]);
  const [accountHeads, setAccountHeads] = useState([]);
  const [subAccounts, setSubAccounts] = useState({});
  const [subAccountIdToName, setSubAccountIdToName] = useState({});
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingVoucher, setViewingVoucher] = useState(null);
  
  // Form state
  const [voucherData, setVoucherData] = useState({
    date: new Date(),
    voucherNo: '',
    paymentType: '',
    remarks: ''
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
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [fetchingData, setFetchingData] = useState(true);
  const itemsPerPage = 8;

  // API Base URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch initial data
  useEffect(() => {
    fetchAccountData();
  }, []);

  useEffect(() => {
    fetchJournalVouchers();
  }, [currentPage, searchTerm]);

  // Fetch account data
  const fetchAccountData = async () => {
    try {
      setFetchingData(true);
      const response = await axios.get(`${API_BASE_URL}/journal-vouchers/account-data`, getAuthHeaders());
      
      if (response.data.success) {
        setAccountHeads(response.data.data.accountHeads);
        setPaymentTypes(response.data.data.paymentTypes);
        
        // Build sub-account maps
        const subAccountsMap = {};
        const idToNameMap = {};
        
        for (const head of response.data.data.accountHeads) {
          const subAccountsResponse = await axios.get(
            `${API_BASE_URL}/journal-vouchers/sub-accounts/${head.id}`, 
            getAuthHeaders()
          );
          
          if (subAccountsResponse.data.success) {
            const subAccounts = subAccountsResponse.data.data;
            subAccountsMap[head.id] = subAccounts;
            
            subAccounts.forEach(sa => {
              idToNameMap[sa.id] = sa.name;
            });
          }
        }
        
        setSubAccounts(subAccountsMap);
        setSubAccountIdToName(idToNameMap);
        
        // Get next voucher number
        await fetchNextVoucherNumber();
      } else {
        throw new Error('Failed to fetch account data');
      }
    } catch (err) {
      console.error('Failed to fetch account data:', err);
      toast.error('Failed to load account data');
    } finally {
      setFetchingData(false);
    }
  };

  // Fetch journal vouchers
  const fetchJournalVouchers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/journal-vouchers`, {
        ...getAuthHeaders(),
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm
        }
      });
      
      if (response.data.success) {
        setJournalVouchers(response.data.data.data);
        setTotalPages(response.data.data.totalPages);
        setTotalEntries(response.data.data.total);
      } else {
        throw new Error('Failed to fetch journal vouchers');
      }
    } catch (err) {
      console.error('Error fetching journal vouchers:', err);
      toast.error('Failed to fetch journal vouchers');
    } finally {
      setLoading(false);
    }
  };

  // Fetch next voucher number
  const fetchNextVoucherNumber = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/journal-vouchers/next-voucher-no`, getAuthHeaders());
      
      if (response.data.success) {
        setVoucherData(prev => ({ ...prev, voucherNo: response.data.data.voucher_no }));
      }
    } catch (err) {
      console.error('Error fetching next voucher number:', err);
      toast.error('Failed to get next voucher number');
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!voucherData.date) {
      errors.date = 'Date is required';
    }
    
    if (!voucherData.voucherNo) {
      errors.voucherNo = 'Voucher number is required';
    }
    
    if (!voucherData.paymentType) {
      errors.paymentType = 'Payment type is required';
    }
    
    if (entries.length === 0) {
      errors.entries = 'At least one journal entry is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate current entry
  const validateCurrentEntry = () => {
    if (!currentEntry.debitAccountHead || !currentEntry.debitAccount || 
        !currentEntry.creditAccountHead || !currentEntry.creditAccount || 
        !currentEntry.amount) {
      toast.error('Please fill in all required fields for the entry');
      return false;
    }

    if (parseFloat(currentEntry.amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return false;
    }

    return true;
  };

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
    if (!validateCurrentEntry()) return;

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
    
    toast.success('Entry added successfully');
  };

  // Remove entry from list
  const handleRemoveEntry = (id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast.success('Entry removed');
  };

  // Calculate total amount
  const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(editingId ? 'Updating journal voucher...' : 'Creating journal voucher...');
    
    try {
      const payload = {
        voucherData: {
          voucher_no: voucherData.voucherNo,
          date: voucherData.date.toISOString().split('T')[0],
          payment_type: voucherData.paymentType,
          total_amount: totalAmount,
          remarks: voucherData.remarks || null
        },
        entries: entries.map(entry => ({
          debit_account_head_id: parseInt(entry.debitAccountHead),
          debit_account_subhead_id: parseInt(entry.debitAccount),
          credit_account_head_id: parseInt(entry.creditAccountHead),
          credit_account_subhead_id: parseInt(entry.creditAccount),
          amount: entry.amount,
          remarks: entry.remarks || null
        }))
      };

      let response;
      if (editingId) {
        response = await axios.put(`${API_BASE_URL}/journal-vouchers/${editingId}`, payload, getAuthHeaders());
      } else {
        response = await axios.post(`${API_BASE_URL}/journal-vouchers`, payload, getAuthHeaders());
      }
      
      toast.dismiss(loadingToast);
      
      if (response.data.success) {
        toast.success(editingId ? 'Journal voucher updated successfully!' : 'Journal voucher created successfully!');
        
        // Reset form and refresh data
        handleCancel();
        await fetchJournalVouchers();
        await fetchNextVoucherNumber();
      } else {
        throw new Error(response.data.error || 'Operation failed');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Save error:', err);
      toast.error(err.response?.data?.error || 'Failed to save journal voucher');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = async (voucher) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/journal-vouchers/${voucher.id}`, getAuthHeaders());
      
      if (response.data.success) {
        const voucherDetails = response.data.data;
        
        setVoucherData({
          date: new Date(voucherDetails.date),
          voucherNo: voucherDetails.voucher_no,
          paymentType: voucherDetails.payment_type,
          remarks: voucherDetails.remarks || ''
        });
        
        // Convert entries to form format
        const formattedEntries = voucherDetails.entries.map(entry => ({
          id: entry.id,
          debitAccountHead: entry.debit_account_head_id.toString(),
          debitAccount: entry.debit_account_subhead_id.toString(),
          creditAccountHead: entry.credit_account_head_id.toString(),
          creditAccount: entry.credit_account_subhead_id.toString(),
          amount: parseFloat(entry.amount),
          remarks: entry.remarks || ''
        }));
        
        setEntries(formattedEntries);
        setEditingId(voucher.id);
        setIsAdding(true);
        setFormErrors({});
        
        toast.custom((t) => (
          <div className="flex items-center">
            <Pencil className="w-5 h-5 mr-2" />
            Editing voucher: {voucher.voucher_no}
          </div>
        ));
      }
    } catch (err) {
      console.error('Error fetching voucher details:', err);
      toast.error('Failed to load voucher details');
    } finally {
      setLoading(false);
    }
  };

  // Handle view voucher details
  const handleViewVoucher = async (voucher) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/journal-vouchers/${voucher.id}`, getAuthHeaders());
      
      if (response.data.success) {
        setViewingVoucher(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching voucher details:', err);
      toast.error('Failed to load voucher details');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id, voucherNo) => {
    const confirmMessage = `Are you sure you want to delete voucher "${voucherNo}"? This action cannot be undone.`;
    
    if (!window.confirm(confirmMessage)) return;
    
    setLoading(true);
    const loadingToast = toast.loading('Deleting journal voucher...');
    
    try {
      const response = await axios.delete(`${API_BASE_URL}/journal-vouchers/${id}`, getAuthHeaders());
      
      toast.dismiss(loadingToast);
      
      if (response.data.success) {
        toast.success('Journal voucher deleted successfully!');
        await fetchJournalVouchers();
      } else {
        throw new Error(response.data.error || 'Delete operation failed');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error deleting voucher:', err);
      toast.error(err.response?.data?.error || 'Failed to delete journal voucher');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel/close form
  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setVoucherData({
      date: new Date(),
      voucherNo: '',
      paymentType: '',
      remarks: ''
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
    setFormErrors({});
    
    toast.custom((t) => (
      <div className="flex items-center">
        <X className="w-5 h-5 mr-2" />
        Form cancelled
      </div>
    ));
  };

  // Handle refresh
  const handleRefresh = async () => {
    setLoading(true);
    const loadingToast = toast.loading('Refreshing data...');
    
    try {
      await Promise.all([
        fetchAccountData(),
        fetchJournalVouchers()
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

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (fetchingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading journal voucher data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
                onClick={async () => {
                  if (isAdding) {
                    handleCancel();
                  } else {
                    setIsAdding(true);
                    setEditingId(null);
                    setVoucherData({
                      date: new Date(),
                      voucherNo: '',
                      paymentType: '',
                      remarks: ''
                    });
                    setEntries([]);
                    setFormErrors({});
                    await fetchNextVoucherNumber();
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

          {/* Create/Edit Form */}
          {isAdding && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Left Panel - Voucher Details */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    {editingId ? 'Edit Voucher Details' : 'Voucher Details'}
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {/* Form Error Display */}
                  {Object.keys(formErrors).length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm font-medium">Please fix the following errors:</p>
                      <ul className="text-red-600 text-sm mt-1 list-disc list-inside">
                        {Object.values(formErrors).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      selected={voucherData.date}
                      onChange={(date) => {
                        setVoucherData({ ...voucherData, date });
                        setFormErrors({ ...formErrors, date: '' });
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        formErrors.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                      dateFormat="yyyy-MM-dd"
                      maxDate={new Date()}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Voucher No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        formErrors.voucherNo ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={voucherData.voucherNo}
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        formErrors.paymentType ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={voucherData.paymentType}
                      onChange={(e) => {
                        setVoucherData({ ...voucherData, paymentType: e.target.value });
                        setFormErrors({ ...formErrors, paymentType: '' });
                      }}
                    >
                      <option value="">Select Payment Type</option>
                      {paymentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Voucher Remarks
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows="3"
                      placeholder="Optional voucher remarks"
                      value={voucherData.remarks}
                      onChange={(e) => setVoucherData({ ...voucherData, remarks: e.target.value })}
                      maxLength={1000}
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      {voucherData.remarks.length}/1000 characters
                    </p>
                  </div>

                  {/* Total Amount Display */}
                  <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-indigo-700">Total Amount:</span>
                      <span className="text-lg font-bold text-indigo-900">
                        SAR {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="text-xs text-indigo-600 mt-1">
                      {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                    </div>
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
                        <option value="">Select Account Head</option>
                        {accountHeads.map(head => (
                          <option key={head.id} value={head.id}>{head.name}</option>
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
                        <option value="">Select Sub Account</option>
                        {(subAccounts[currentEntry.debitAccountHead] || []).map(account => (
                          <option key={account.id} value={account.id}>{account.name}</option>
                        ))}
                      </select>
                      {!currentEntry.debitAccountHead && (
                        <p className="text-gray-500 text-xs mt-1">Select account head first</p>
                      )}
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
                        <option value="">Select Account Head</option>
                        {accountHeads.map(head => (
                          <option key={head.id} value={head.id}>{head.name}</option>
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
                        <option value="">Select Sub Account</option>
                        {(subAccounts[currentEntry.creditAccountHead] || []).map(account => (
                          <option key={account.id} value={account.id}>{account.name}</option>
                        ))}
                      </select>
                      {!currentEntry.creditAccountHead && (
                        <p className="text-gray-500 text-xs mt-1">Select account head first</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        value={currentEntry.amount}
                        onChange={(e) => setCurrentEntry({ ...currentEntry, amount: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Entry Remarks
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        value={currentEntry.remarks}
                        onChange={(e) => setCurrentEntry({ ...currentEntry, remarks: e.target.value })}
                        placeholder="Optional entry remarks"
                        maxLength={500}
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
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Entry Remarks</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Amount</th>
                            <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entries.map((entry) => (
                            <tr key={entry.id} className="border-t border-gray-200">
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {subAccountIdToName[entry.debitAccount] || `ID: ${entry.debitAccount}`}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {subAccountIdToName[entry.creditAccount] || `ID: ${entry.creditAccount}`}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {entry.remarks || (
                                  <span className="italic text-gray-400">No remarks</span>
                                )}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">
                                SAR {entry.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-2 text-center">
                                <button
                                  onClick={() => handleRemoveEntry(entry.id)}
                                  className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
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

                  {entries.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Calculator className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p>No entries added yet</p>
                      <p className="text-sm text-gray-400 mt-1">Add your first journal entry above</p>
                    </div>
                  )}

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
                          {editingId ? 'Update Voucher' : 'Submit Voucher'}
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
              <p className="text-sm text-gray-600 mt-1">
                Total: {totalEntries} vouchers
              </p>
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
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && journalVouchers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mr-3"></div>
                          Loading journal vouchers...
                        </div>
                      </td>
                    </tr>
                  ) : journalVouchers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
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
                    journalVouchers.map((voucher, index) => (
                      <tr key={voucher.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-center text-gray-900 font-medium">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-medium">{voucher.voucher_no}</td>
                        <td className="px-6 py-4 text-gray-900">
                          {new Date(voucher.date).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {voucher.payment_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">
                          SAR {parseFloat(voucher.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {voucher.entries?.length || 0} entries
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center flex space-x-2 justify-center">
                          <button
                            onClick={() => handleViewVoucher(voucher)}
                            title="View Details"
                            className="text-blue-600 hover:text-blue-800 transition p-1 rounded hover:bg-blue-50"
                            disabled={loading}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(voucher)}
                            title="Edit"
                            className="text-indigo-600 hover:text-indigo-800 transition p-1 rounded hover:bg-indigo-50"
                            disabled={loading}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(voucher.id, voucher.voucher_no)}
                            title="Delete"
                            className="text-red-600 hover:text-red-800 transition p-1 rounded hover:bg-red-50"
                            disabled={loading}
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

          {/* View Voucher Modal */}
          {viewingVoucher && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      Voucher Details: {viewingVoucher.voucher_no}
                    </h2>
                    <button
                      onClick={() => setViewingVoucher(null)}
                      className="text-white hover:text-gray-200 transition"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Voucher Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Voucher Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Voucher No:</span>
                          <span className="font-medium">{viewingVoucher.voucher_no}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{new Date(viewingVoucher.date).toLocaleDateString('en-GB')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Type:</span>
                          <span className="px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {viewingVoucher.payment_type}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {viewingVoucher.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-bold text-lg text-indigo-600">
                            SAR {parseFloat(viewingVoucher.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-600">Voucher Remarks:</span>
                          <p className="mt-1 text-gray-900">
                            {viewingVoucher.remarks || (
                              <span className="italic text-gray-400">No remarks</span>
                            )}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span className="font-medium">{new Date(viewingVoucher.created_at).toLocaleString('en-GB')}</span>
                        </div>
                        {viewingVoucher.updated_at !== viewingVoucher.created_at && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Updated:</span>
                            <span className="font-medium">{new Date(viewingVoucher.updated_at).toLocaleString('en-GB')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Journal Entries */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Journal Entries</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Entry #</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Debit Account</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Credit Account</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Entry Remarks</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewingVoucher.entries.map((entry, index) => (
                            <tr key={entry.id} className="border-t border-gray-200">
                              <td className="px-4 py-2 text-sm text-gray-900 font-medium">{index + 1}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                <div>
                                  <div className="font-medium">{entry.debit_sub_account_head}</div>
                                  <div className="text-xs text-gray-500">{entry.debit_account_head}</div>
                                </div>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                <div>
                                  <div className="font-medium">{entry.credit_sub_account_head}</div>
                                  <div className="text-xs text-gray-500">{entry.credit_account_head}</div>
                                </div>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {entry.remarks || (
                                  <span className="italic text-gray-400">No remarks</span>
                                )}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">
                                SAR {parseFloat(entry.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Toast Configuration */}
      <ToastConfig />
    </>
  );
};

export default JournalVoucherPage;
