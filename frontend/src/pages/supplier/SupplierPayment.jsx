import React, { useState, useEffect } from 'react';
import {
  Search, Calendar, DollarSign, FileText, CheckCircle,
  Plus, X, Edit, Trash2, Loader2, Eye, ChevronDown, ChevronUp, Users, Layers, Receipt, Banknote,
  ArrowUp, ArrowDown, Check, AlertCircle as Alert, AlertTriangle, Filter, TrendingUp
} from 'lucide-react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';

// Auth header utility
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
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const API_URL = `${API_BASE_URL}/supplier-payment/`;
const API_SUPPLIERS = `${API_BASE_URL}/suppliers`;

const paymentTypeIcons = {
  1: <DollarSign className="w-5 h-5 text-emerald-600" />, // Cash
  2: <Banknote className="w-5 h-5 text-cyan-600" />, // Bank Transfer
  3: <Receipt className="w-5 h-5 text-purple-600" />, // Cheque
  4: <Layers className="w-5 h-5 text-pink-600" />, // Card
};

const PAGE_SIZE = 10;

const SupplierPayment = () => {
  // Form state
  const [searchTerm, setSearchTerm] = useState('');
  const [voucherNo, setVoucherNo] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [supplierPayments, setSupplierPayments] = useState([]);
  const [editId, setEditId] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [viewPayment, setViewPayment] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [paymentTypes] = useState([
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Bank Transfer' },
    { id: 3, name: 'Cheque' },
    { id: 4, name: 'Card' }
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('payment_date');
  const [sortOrder, setSortOrder] = useState('desc');

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
  const validatePaymentForm = () => {
    const errors = [];
    
    if (!voucherNo) {
      errors.push('Voucher number is required');
    }
    
    if (!date) {
      errors.push('Payment date is required');
    }
    
    if (!paymentType) {
      errors.push('Payment type is required');
    }
    
    if (!amount && !totalAmount) {
      errors.push('Amount is required');
    }
    
    if (tableData.length === 0) {
      errors.push('Please add at least one payment detail');
    }
    
    if (tableData.some(row => !row.supplier_id)) {
      errors.push('Please select suppliers for all payment details');
    }
    
    if (errors.length > 0) {
      errors.forEach(error => {
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

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      const loadingToast = toast.loading('🔄 Loading payment data...');
      
      try {
        await Promise.all([
          fetchPayments(),
          fetchSuppliers()
        ]);
        
        toast.dismiss(loadingToast);
        toast.success('✅ All data loaded successfully!');
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error('❌ Failed to load some data');
      }
    };
    
    loadInitialData();
  }, []);

  // Enhanced fetch suppliers with feedback
  const fetchSuppliers = async () => {
    try {
      const res = await fetch(API_SUPPLIERS, { headers: getAuthHeaders() });
      if (!res.ok) {
        throw new Error(`Failed to fetch suppliers: ${res.status}`);
      }
      
      const data = await res.json();
      const suppliersList = Array.isArray(data) ? data : data.data || [];
      setSuppliers(suppliersList);
      
      toast((t) => (
        <div className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Loaded {suppliersList.length} suppliers
        </div>
      ), {
        duration: 2000,
      });
      
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setSuppliers([]);
      handleAuthError(err);
    }
  };

  // Enhanced fetch payments with feedback
  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL, { headers: getAuthHeaders() });
      if (!res.ok) {
        throw new Error(`Failed to fetch payments: ${res.status}`);
      }
      
      const data = await res.json();
      const paymentsList = Array.isArray(data) ? data : data.data || [];
      setSupplierPayments(paymentsList);
      setCurrentPage(1);
      
    } catch (err) {
      console.error('Error fetching payments:', err);
      toast.error('❌ Failed to fetch payments');
      handleAuthError(err);
    }
    setIsLoading(false);
  };

  // Enhanced fetch payment by ID with feedback
  const fetchPaymentById = async (id) => {
    const loadingToast = toast.loading(`🔍 Loading payment details...`);
    
    try {
      const res = await fetch(`${API_URL}${id}`, { headers: getAuthHeaders() });
      if (!res.ok) {
        throw new Error('Failed to fetch payment details');
      }
      
      const data = await res.json();
      toast.dismiss(loadingToast);
      return data;
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error fetching payment details:', err);
      toast.error('❌ Failed to fetch payment details');
      handleAuthError(err);
      return null;
    }
  };

  // Enhanced search with feedback
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchPayments();
      toast((t) => (
        <div className="flex items-center">
          <Search className="w-5 h-5 mr-2" />
          Showing all payments
        </div>
      ), {
        duration: 2000,
      });
      return;
    }
    
    const loadingToast = toast.loading(`🔍 Searching for "${searchTerm}"...`);
    setIsLoading(true);
    
    try {
      const res = await fetch(`${API_URL}?search=${encodeURIComponent(searchTerm)}`, {
        headers: getAuthHeaders()
      });
      
      if (!res.ok) {
        throw new Error('Search failed');
      }
      
      const data = await res.json();
      const paymentsList = Array.isArray(data) ? data : data.data || [];
      setSupplierPayments(paymentsList);
      setCurrentPage(1);
      
      toast.dismiss(loadingToast);
      
      if (paymentsList.length === 0) {
        toast((t) => (
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            No payments found for "{searchTerm}"
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
      } else {
        toast((t) => (
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Found {paymentsList.length} payment{paymentsList.length > 1 ? 's' : ''}
          </div>
        ), {
          duration: 2000,
        });
      }
      
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error searching payments:', err);
      toast.error('❌ Search failed');
      handleAuthError(err);
    }
    setIsLoading(false);
  };

  // Enhanced add table row with feedback
  const addTableRow = () => {
    setTableData([
      ...tableData,
      {
        id: Date.now(),
        supplier_id: '',
        operation_no: '',
        receipt_no: '',
        bill_amount: '',
        paid_amount: '',
        balance_amount: '',
        amount: '',
        checked: false,
      },
    ]);
    
    toast((t) => (
      <div className="flex items-center">
        <Plus className="w-4 h-4 mr-2" />
        New payment detail row added
      </div>
    ), {
      duration: 1500,
    });
  };

  // Enhanced remove table row with validation
  const removeTableRow = (id) => {
    if (tableData.length <= 1) {
      toast((t) => (
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          At least one payment detail is required
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
    
    setTableData(tableData.filter((row) => row.id !== id));
    
    toast((t) => (
      <div className="flex items-center">
        <Trash2 className="w-4 h-4 mr-2" />
        Payment detail removed
      </div>
    ), {
      duration: 1500,
    });
  };

  // Enhanced reset form with feedback
  const resetForm = () => {
    setVoucherNo('');
    setDate('');
    setAmount('');
    setRemarks('');
    setPaymentType('');
    setTotalAmount('');
    setTableData([]);
    setEditId(null);
  };

  // Enhanced toggle add form with custom toast
  const handleToggleAddForm = () => {
    if (isAdding) {
      resetForm();
      setIsAdding(false);
      toast((t) => (
        <div className="flex items-center">
          <X className="w-5 h-5 mr-2" />
          Payment form closed
        </div>
      ), {
        duration: 2000,
      });
    } else {
      resetForm();
      setIsAdding(true);
      toast((t) => (
        <div className="flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Ready to create new payment
        </div>
      ), {
        duration: 2000,
      });
    }
  };

  // Enhanced submit with detailed feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePaymentForm()) {
      return;
    }

    const paymentTypeName = getPaymentTypeName(paymentType);
    const loadingMessage = editId 
      ? `🔄 Updating payment ${voucherNo}...` 
      : `💾 Creating payment ${voucherNo}...`;
    
    const loadingToast = toast.loading(loadingMessage);
    setIsLoading(true);

    const payload = {
      voucher_no: voucherNo,
      payment_date: date,
      amount: Number(totalAmount) || Number(amount) || 0,
      payment_type_id: paymentType,
      remarks: remarks,
      details: tableData.map((row) => ({
        supplier_id: row.supplier_id || 1,
        operation_no: row.operation_no,
        receipt_no: row.receipt_no,
        bill_amount: Number(row.bill_amount) || 0,
        paid_amount: Number(row.paid_amount) || 0,
        balance_amount: Number(row.balance_amount) || 0,
      })),
    };

    try {
      let res, data;
      const url = editId ? `${API_URL}${editId}` : API_URL;
      const method = editId ? 'PUT' : 'POST';
      
      res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 409) {
          throw new Error('Payment with this voucher number already exists');
        }
        throw new Error(errorData.error || errorData.message || 'Failed to save payment');
      }
      
      data = await res.json();
      
      toast.dismiss(loadingToast);
      
      if (editId) {
        toast.success(`✅ Payment "${voucherNo}" (${paymentTypeName}) updated successfully!`);
      } else {
        toast.success(`🎉 Payment "${voucherNo}" (${paymentTypeName}) created successfully!`);
      }
      
      fetchPayments();
      resetForm();
      setIsAdding(false);
      
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error saving payment:', err);
      
      if (err.message.includes('already exists')) {
        toast((t) => (
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Payment already exists with this voucher number
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
        toast.error(`❌ ${err.message || 'Failed to save payment'}`);
      }
      
      handleAuthError(err);
    }
    setIsLoading(false);
  };

  // Enhanced edit with custom toast
  const handleEdit = async (payment) => {
    const fullPayment = await fetchPaymentById(payment.id);
    if (fullPayment) {
      setEditId(fullPayment.id);
      setVoucherNo(fullPayment.voucher_no || '');
      setDate(fullPayment.payment_date ? fullPayment.payment_date.substring(0, 10) : '');
      setAmount(fullPayment.amount || '');
      setRemarks(fullPayment.remarks || '');
      setPaymentType(fullPayment.payment_type_id || '');
      setTotalAmount(fullPayment.amount || '');
      setTableData(
        (fullPayment.details || []).map((d, i) => ({
          id: d.id || Date.now() + i,
          supplier_id: d.supplier_id,
          operation_no: d.operation_no,
          receipt_no: d.receipt_no,
          bill_amount: d.bill_amount,
          paid_amount: d.paid_amount,
          balance_amount: d.balance_amount,
          amount: d.paid_amount,
          checked: false,
        }))
      );
      setIsAdding(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      toast((t) => (
        <div className="flex items-center">
          <Edit className="w-5 h-5 mr-2" />
          Editing payment: {fullPayment.voucher_no}
        </div>
      ), {
        duration: 2500,
      });
    }
  };

  // Enhanced delete with confirmation and detailed feedback
  const handleDelete = async (id) => {
    const payment = supplierPayments.find(p => p.id === id);
    const voucherNo = payment?.voucher_no || 'Unknown';
    
    if (!window.confirm(`⚠️ Are you sure you want to delete payment "${voucherNo}"?\n\nThis action cannot be undone.`)) {
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
    
    const loadingToast = toast.loading(`🗑️ Deleting payment ${voucherNo}...`);
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete payment');
      }
      
      fetchPayments();
      toast.dismiss(loadingToast);
      toast.success(`🗑️ Payment "${voucherNo}" deleted successfully!`);
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error deleting payment:', err);
      toast.error(`❌ Failed to delete payment`);
      handleAuthError(err);
    }
    setIsLoading(false);
  };

  // Enhanced table row change with feedback for supplier selection
  const handleTableRowChange = (rowIndex, field, value) => {
    const updated = [...tableData];
    updated[rowIndex][field] = value;
    
    if (field === 'bill_amount' || field === 'paid_amount') {
      const bill = parseFloat(updated[rowIndex].bill_amount) || 0;
      const paid = parseFloat(updated[rowIndex].paid_amount) || 0;
      updated[rowIndex].balance_amount = (bill - paid).toFixed(2);
    }
    
    if (field === 'supplier_id' && value) {
      const supplier = suppliers.find(s => s.id == value);
      if (supplier) {
        toast((t) => (
          <div className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Selected: {supplier.name}
          </div>
        ), {
          duration: 1500,
        });
      }
    }
    
    setTableData(updated);
  };

  // Enhanced view details with feedback
  const handleViewDetails = async (p) => {
    const fullPayment = await fetchPaymentById(p.id);
    if (fullPayment) {
      setViewPayment(fullPayment);
      
      toast((t) => (
        <div className="flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          Viewing payment: {fullPayment.voucher_no}
        </div>
      ), {
        duration: 2000,
      });
    } else {
      setViewPayment(p);
    }
  };

  const getSupplierName = (id) => {
    const supplier = suppliers.find(s => String(s.id) === String(id));
    return supplier ? supplier.name : `Supplier ${id}`;
  };

  const getPaymentTypeName = (id) => {
    const type = paymentTypes.find(t => t.id == id);
    return type ? type.name : `Type ${id}`;
  };

  // Enhanced sorting handler with feedback
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(order => order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);
    
    toast((t) => (
      <div className="flex items-center">
        <ArrowUp className="w-4 h-4 mr-2" />
        Sorted by {column} ({sortOrder === 'asc' ? 'descending' : 'ascending'})
      </div>
    ), {
      duration: 1500,
    });
  };

  const renderSortIcon = (column) => {
    if (sortColumn !== column) return <ArrowUp className="w-3 h-3 text-gray-400 inline" />;
    return sortOrder === 'asc'
      ? <ArrowUp className="w-3 h-3 text-indigo-600 inline" />
      : <ArrowDown className="w-3 h-3 text-indigo-600 inline" />;
  };

  const sortedPayments = [...supplierPayments].sort((a, b) => {
    if (sortColumn === 'voucher_no') {
      const valA = a.voucher_no ? a.voucher_no.toLowerCase() : '';
      const valB = b.voucher_no ? b.voucher_no.toLowerCase() : '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }
    if (sortColumn === 'payment_date') {
      const valA = a.payment_date || '';
      const valB = b.payment_date || '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedPayments.length / PAGE_SIZE);
  const paginatedPayments = sortedPayments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Get total amount
  const getTotalAmount = () => {
    return sortedPayments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0).toFixed(2);
  };

  // Prepare options for dropdowns
  const supplierOptions = suppliers.map(supplier => ({
    value: supplier.id,
    label: supplier.name
  }));

  const paymentTypeOptions = paymentTypes.map(type => ({
    value: type.id,
    label: type.name
  }));

  useEffect(() => {
    setCurrentPage(1);
  }, [supplierPayments]);

  if (isLoading && supplierPayments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading supplier payments...</p>
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
              <Banknote className="w-8 h-8 mr-3 text-indigo-600" />
              Supplier Payment Management
            </h1>
            <p className="text-gray-600 mt-2">Manage supplier payments and voucher details</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={handleToggleAddForm}
              className={`px-4 py-2  rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-white-600 hover:bg-gray-100 text-indigo-600'}`}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Cancel' : 'Add Payment'}
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH PAYMENTS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Supplier Name or Voucher Number
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search payments..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-lg font-medium transition-all flex items-center"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Payment Form */}
        {isAdding && (
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700">
                  {editId ? 'Edit Payment' : 'Add New Payment'}
                </h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Voucher No <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={voucherNo}
                        onChange={(e) => setVoucherNo(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Enter voucher number"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Type <span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={paymentTypeOptions}
                        value={paymentTypeOptions.find(option => option.value == paymentType)}
                        onChange={(selectedOption) => setPaymentType(selectedOption?.value || '')}
                        placeholder="Select Payment Type"
                        isSearchable
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={selectStyles}
                        className="w-full text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Remarks
                      </label>
                      <textarea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                        placeholder="Enter remarks"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Payment Details Table */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-semibold text-gray-800">Payment Details</h3>
                    <button
                      type="button"
                      onClick={addTableRow}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Row
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operation No</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt No</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tableData.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                              <div className="flex flex-col items-center justify-center">
                                <Banknote className="w-16 h-16 text-gray-300 mb-4" />
                                <h4 className="text-lg font-medium text-gray-500">No payment details added</h4>
                                <p className="text-gray-400 mt-2">Click "Add Row" to add payment details</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          tableData.map((row, index) => (
                            <tr key={row.id} className="hover:bg-gray-50 transition">
                              <td className="px-4 py-3">
                                <Select
                                  options={supplierOptions}
                                  value={supplierOptions.find(option => option.value == row.supplier_id)}
                                  onChange={(selectedOption) => handleTableRowChange(index, 'supplier_id', selectedOption?.value || '')}
                                  placeholder="Select Supplier"
                                  isSearchable
                                  menuPortalTarget={document.body}
                                  menuPosition="fixed"
                                  styles={selectStyles}
                                  className="w-full text-sm"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  placeholder="Operation No"
                                  value={row.operation_no}
                                  onChange={(e) => handleTableRowChange(index, 'operation_no', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  placeholder="Receipt No"
                                  value={row.receipt_no}
                                  onChange={(e) => handleTableRowChange(index, 'receipt_no', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder="0.00"
                                  value={row.bill_amount}
                                  onChange={(e) => handleTableRowChange(index, 'bill_amount', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder="0.00"
                                  value={row.paid_amount}
                                  onChange={(e) => handleTableRowChange(index, 'paid_amount', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={row.balance_amount}
                                  readOnly
                                  className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-50 text-sm"
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeTableRow(row.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Remove row"
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
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    ) : null}
                    {editId ? 'Update Payment' : 'Add Payment'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Payment Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Payment Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">SAR {getTotalAmount()}</span>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'Voucher No', key: 'voucher_no' },
                    { label: 'Date', key: 'payment_date' },
                    { label: 'Amount', key: 'amount' },
                    { label: 'Type', key: 'payment_type_id' },
                    { label: 'Remarks', key: 'remarks' },
                    { label: 'Actions', key: null },
                  ].map(({ label, key }) => (
                    <th
                      key={label}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => key && handleSort(key)}
                    >
                      <div className="flex items-center">
                        {label}
                        {key && sortColumn === key && renderSortIcon(key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Banknote className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No payment records found</h4>
                        <p className="text-gray-400 mt-2">
                          {searchTerm ? 'Try adjusting your search criteria' : 'Create your first payment to get started'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.voucher_no}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                        SAR {parseFloat(payment.amount || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center gap-1">
                          {paymentTypeIcons[payment.payment_type_id]}
                          {getPaymentTypeName(payment.payment_type_id)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                        {payment.remarks || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(payment)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(payment)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(payment.id)}
                          className="text-red-600 hover:text-red-900"
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
          <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-700 mb-2 md:mb-0">
              Showing {((currentPage - 1) * PAGE_SIZE) + 1} to{' '}
              {Math.min(currentPage * PAGE_SIZE, sortedPayments.length)} of {sortedPayments.length} payments
            </div>
            <div className="flex items-center">
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                  title="Previous"
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                  title="Next"
                >
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
              </div>
            </div>
            <div className="hidden md:block text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">SAR {getTotalAmount()}</span>
            </div>
          </div>
        </div>

        {/* View Payment Modal */}
        {viewPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="bg-indigo-600 p-4 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white">Payment Details</h2>
                  <button
                    onClick={() => setViewPayment(null)}
                    className="text-white hover:text-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600">Voucher Number:</span>
                        <span className="ml-2 font-medium">{viewPayment.voucher_no}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Payment Date:</span>
                        <span className="ml-2 font-medium">
                          {viewPayment.payment_date ? new Date(viewPayment.payment_date).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <span className="ml-2 font-medium">SAR {parseFloat(viewPayment.amount || 0).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Payment Type:</span>
                        <span className="ml-2 font-medium inline-flex items-center gap-1">
                          {paymentTypeIcons[viewPayment.payment_type_id]}
                          {getPaymentTypeName(viewPayment.payment_type_id)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Remarks:</span>
                        <span className="ml-2 font-medium">{viewPayment.remarks || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Payment Details */}
                {viewPayment.details && viewPayment.details.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Supplier</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Operation No</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Receipt No</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Bill Amount</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Paid Amount</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewPayment.details.map((detail, index) => (
                            <tr key={index} className="border-t border-gray-200">
                              <td className="px-4 py-3 text-sm">{getSupplierName(detail.supplier_id)}</td>
                              <td className="px-4 py-3 text-sm">{detail.operation_no || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm">{detail.receipt_no || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm">SAR {parseFloat(detail.bill_amount || 0).toFixed(2)}</td>
                              <td className="px-4 py-3 text-sm font-medium">SAR {parseFloat(detail.paid_amount || 0).toFixed(2)}</td>
                              <td className="px-4 py-3 text-sm">SAR {parseFloat(detail.balance_amount || 0).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierPayment;
