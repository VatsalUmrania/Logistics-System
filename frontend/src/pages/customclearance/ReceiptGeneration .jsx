import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Loader,
  Calculator,
  Save,
  Eye,
  Download
} from 'lucide-react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const ReceiptGeneration = () => {
  // State management
  const [receipts, setReceipts] = useState([]);
  const [clients, setClients] = useState([]);
  const [operations, setOperations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [receiptForm, setReceiptForm] = useState({
    receipt_no: '',
    operation_no: '',
    client_name: '',
    receipt_type: 'Payment',
    amount: '',
    tax_amount: '',
    discount_amount: '',
    net_amount: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    payment_method: 'Cash',
    currency: 'SAR',
    reference_no: '',
    description: '',
    notes: ''
  });
  
  // Pagination and sorting
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Custom styles for react-select
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

  // Authentication helper
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error("Authentication token missing - please login");
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return null;
    }
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Fetch functions
  const fetchReceipts = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${API_BASE_URL}/receipts`, headers);
      if (!response.ok) throw new Error('Failed to fetch receipts');
      
      const data = await response.json();
      setReceipts(data);
    } catch (error) {
      console.error('Error fetching receipts:', error);
      toast.error('Failed to fetch receipts: ' + error.message);
    }
  };

  const fetchClients = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${API_BASE_URL}/clients`, headers);
      if (!response.ok) throw new Error('Failed to fetch clients');
      
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to fetch clients');
    }
  };

  const fetchOperations = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${API_BASE_URL}/clearance-operations`, headers);
      if (!response.ok) throw new Error('Failed to fetch operations');
      
      const data = await response.json();
      setOperations(data);
    } catch (error) {
      console.error('Error fetching operations:', error);
      toast.error('Failed to fetch operations');
    }
  };

  const fetchNextReceiptNumber = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return 'RCP-2025-001';

      const response = await fetch(`${API_BASE_URL}/receipts/next-receipt`, headers);
      if (!response.ok) throw new Error('Failed to fetch next receipt number');
      
      const data = await response.json();
      return data.nextReceiptNumber;
    } catch (error) {
      console.error('Error fetching next receipt number:', error);
      return `RCP-${new Date().getFullYear()}-001`;
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchReceipts(),
          fetchClients(),
          fetchOperations()
        ]);
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Form handlers
  const handleFormChange = (field, value) => {
    setReceiptForm(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate net amount when amount, tax, or discount changes
      if (['amount', 'tax_amount', 'discount_amount'].includes(field)) {
        const amount = parseFloat(updated.amount) || 0;
        const tax = parseFloat(updated.tax_amount) || 0;
        const discount = parseFloat(updated.discount_amount) || 0;
        updated.net_amount = (amount + tax - discount).toFixed(2);
      }
      
      return updated;
    });
  };

  // Form validation
  const validateForm = () => {
    if (!receiptForm.receipt_no.trim()) {
      toast.error('Receipt number is required');
      return false;
    }
    if (!receiptForm.client_name.trim()) {
      toast.error('Client name is required');
      return false;
    }
    if (!receiptForm.amount || parseFloat(receiptForm.amount) <= 0) {
      toast.error('Valid amount is required');
      return false;
    }
    if (!receiptForm.issue_date) {
      toast.error('Issue date is required');
      return false;
    }
    return true;
  };

  // CRUD operations
  const handleSaveReceipt = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading(editingId ? 'Updating receipt...' : 'Creating receipt...');

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const receiptData = {
        ...receiptForm,
        amount: parseFloat(receiptForm.amount),
        tax_amount: parseFloat(receiptForm.tax_amount) || 0,
        discount_amount: parseFloat(receiptForm.discount_amount) || 0,
        net_amount: parseFloat(receiptForm.net_amount)
      };

      let response;
      if (editingId) {
        response = await fetch(`${API_BASE_URL}/receipts/${editingId}`, {
          method: 'PUT',
          ...headers,
          body: JSON.stringify(receiptData)
        });
      } else {
        response = await fetch(`${API_BASE_URL}/receipts`, {
          method: 'POST',
          ...headers,
          body: JSON.stringify(receiptData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save receipt');
      }

      await fetchReceipts();
      resetForm();
      
      toast.dismiss(loadingToast);
      toast.success(editingId ? 'Receipt updated successfully' : 'Receipt created successfully');

    } catch (error) {
      console.error('Error saving receipt:', error);
      toast.dismiss(loadingToast);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (receipt) => {
    setReceiptForm({
      receipt_no: receipt.receipt_no,
      operation_no: receipt.operation_no || '',
      client_name: receipt.client_name,
      receipt_type: receipt.receipt_type || 'Payment',
      amount: receipt.amount.toString(),
      tax_amount: (receipt.tax_amount || 0).toString(),
      discount_amount: (receipt.discount_amount || 0).toString(),
      net_amount: (receipt.net_amount || receipt.amount).toString(),
      issue_date: receipt.issue_date ? receipt.issue_date.split('T')[0] : '',
      due_date: receipt.due_date ? receipt.due_date.split('T')[0] : '',
      payment_method: receipt.payment_method || 'Cash',
      currency: receipt.currency || 'SAR',
      reference_no: receipt.reference_no || '',
      description: receipt.description || '',
      notes: receipt.notes || ''
    });
    setEditingId(receipt.id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this receipt?')) return;

    const loadingToast = toast.loading('Deleting receipt...');

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${API_BASE_URL}/receipts/${id}`, {
        method: 'DELETE',
        ...headers
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete receipt');
      }

      await fetchReceipts();
      toast.dismiss(loadingToast);
      toast.success('Receipt deleted successfully');

    } catch (error) {
      console.error('Error deleting receipt:', error);
      toast.dismiss(loadingToast);
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setReceiptForm({
      receipt_no: '',
      operation_no: '',
      client_name: '',
      receipt_type: 'Payment',
      amount: '',
      tax_amount: '',
      discount_amount: '',
      net_amount: '',
      issue_date: new Date().toISOString().split('T')[0],
      due_date: '',
      payment_method: 'Cash',
      currency: 'SAR',
      reference_no: '',
      description: '',
      notes: ''
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleAddButtonClick = async () => {
    if (isAdding) {
      resetForm();
    } else {
      const nextReceiptNo = await fetchNextReceiptNumber();
      setReceiptForm(prev => ({
        ...prev,
        receipt_no: nextReceiptNo
      }));
      setIsAdding(true);
    }
  };

  // Prepare dropdown options
  const clientOptions = clients.map(client => ({
    value: client.name,
    label: client.name
  }));

  const operationOptions = operations.map(op => ({
    value: op.job_no,
    label: op.job_no
  }));

  const receiptTypeOptions = [
    { value: 'Invoice', label: 'Invoice' },
    { value: 'Payment', label: 'Payment' },
    { value: 'Refund', label: 'Refund' },
    { value: 'Advance', label: 'Advance' }
  ];

  const paymentMethodOptions = [
    { value: 'Cash', label: 'Cash' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Check', label: 'Check' },
    { value: 'Credit Card', label: 'Credit Card' }
  ];

  // Filter and sort receipts
  const filteredReceipts = receipts.filter(receipt =>
    receipt.receipt_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.operation_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedReceipts = [...filteredReceipts].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'amount' || sortField === 'net_amount') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReceipts = sortedReceipts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedReceipts.length / itemsPerPage);

  if (isLoading && receipts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading receipt data...</p>
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
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              Receipt Generation
            </h1>
            <p className="text-gray-600 mt-2">Create and manage receipts for your operations</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search receipts..."
                  className="bg-transparent outline-none w-40"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={handleAddButtonClick}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center shadow-md ${
                isAdding 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-white-600 hover:bg-gray-100 text-indigo-600'
              }`}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Cancel' : 'Add Receipt'}
            </button>
          </div>
        </div>

        {/* Add/Edit Receipt Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-indigo-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                {editingId ? 'Edit Receipt' : 'Generate New Receipt'}
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleSaveReceipt(); }}>
                {/* Basic Information */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Receipt Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={receiptForm.receipt_no}
                        onChange={(e) => handleFormChange('receipt_no', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm bg-gray-50"
                        placeholder="Auto-generated"
                        readOnly={!editingId}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Receipt Type <span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={receiptTypeOptions}
                        value={receiptTypeOptions.find(option => option.value === receiptForm.receipt_type)}
                        onChange={(selectedOption) => handleFormChange('receipt_type', selectedOption?.value || 'Payment')}
                        placeholder="Select Type"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={selectStyles}
                        className="w-full text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Operation Number
                      </label>
                      <Select
                        options={operationOptions}
                        value={operationOptions.find(option => option.value === receiptForm.operation_no)}
                        onChange={(selectedOption) => handleFormChange('operation_no', selectedOption?.value || '')}
                        placeholder="Select Operation"
                        isSearchable
                        isClearable
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={selectStyles}
                        className="w-full text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Client and Reference Information */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    Client & Reference Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client Name <span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={clientOptions}
                        value={clientOptions.find(option => option.value === receiptForm.client_name)}
                        onChange={(selectedOption) => handleFormChange('client_name', selectedOption?.value || '')}
                        placeholder="Select Client"
                        isSearchable
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={selectStyles}
                        className="w-full text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reference Number
                      </label>
                      <input
                        type="text"
                        value={receiptForm.reference_no}
                        onChange={(e) => handleFormChange('reference_no', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Enter reference number"
                      />
                    </div>
                  </div>
                </div>

                {/* Amount Information */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2 flex items-center">
                    <Calculator className="w-4 h-4 mr-2" />
                    Amount Calculation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Base Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={receiptForm.amount}
                        onChange={(e) => handleFormChange('amount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tax Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={receiptForm.tax_amount}
                        onChange={(e) => handleFormChange('tax_amount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={receiptForm.discount_amount}
                        onChange={(e) => handleFormChange('discount_amount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Net Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={receiptForm.net_amount}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-semibold"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Date and Payment Information */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    Date & Payment Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Issue Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={receiptForm.issue_date}
                        onChange={(e) => handleFormChange('issue_date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={receiptForm.due_date}
                        onChange={(e) => handleFormChange('due_date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method
                      </label>
                      <Select
                        options={paymentMethodOptions}
                        value={paymentMethodOptions.find(option => option.value === receiptForm.payment_method)}
                        onChange={(selectedOption) => handleFormChange('payment_method', selectedOption?.value || 'Cash')}
                        placeholder="Select Method"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={selectStyles}
                        className="w-full text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <input
                        type="text"
                        value={receiptForm.currency}
                        onChange={(e) => handleFormChange('currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="SAR"
                      />
                    </div>
                  </div>
                </div>

                {/* Description and Notes */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={receiptForm.description}
                        onChange={(e) => handleFormChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                        placeholder="Enter receipt description..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        value={receiptForm.notes}
                        onChange={(e) => handleFormChange('notes', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                        placeholder="Enter additional notes..."
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm flex items-center"
                  >
                    {isSubmitting && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Update Receipt' : 'Generate Receipt'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Receipts Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Generated Receipts</h3>
              <div className="text-sm text-gray-600">
                Total: {filteredReceipts.length} receipts
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'Receipt No', key: 'receipt_no' },
                    { label: 'Client', key: 'client_name' },
                    { label: 'Type', key: 'receipt_type' },
                    { label: 'Amount', key: 'amount' },
                    { label: 'Net Amount', key: 'net_amount' },
                    { label: 'Issue Date', key: 'issue_date' },
                    { label: 'Status', key: 'status' },
                    { label: 'Actions', key: null },
                  ].map(({ label, key }) => (
                    <th
                      key={label}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => key && setSortField(key)}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentReceipts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No receipts found</h4>
                        <p className="text-gray-400 mt-2">Create your first receipt to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentReceipts.map((receipt) => (
                    <tr key={receipt.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">
                        {receipt.receipt_no}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {receipt.client_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          receipt.receipt_type === 'Invoice' ? 'bg-blue-100 text-blue-800' :
                          receipt.receipt_type === 'Payment' ? 'bg-green-100 text-green-800' :
                          receipt.receipt_type === 'Refund' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {receipt.receipt_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {receipt.currency} {parseFloat(receipt.amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                        {receipt.currency} {parseFloat(receipt.net_amount || receipt.amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {receipt.issue_date ? new Date(receipt.issue_date).toLocaleDateString('en-GB') : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          receipt.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {receipt.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleEdit(receipt)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(receipt.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
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
                {Math.min(indexOfLastItem, sortedReceipts.length)} of {sortedReceipts.length} receipts
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
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Toast Config Component */}
      <ToastConfig />
    </div>
  );
};

export default ReceiptGeneration;
