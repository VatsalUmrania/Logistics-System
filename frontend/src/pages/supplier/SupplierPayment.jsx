import React, { useState, useEffect } from 'react';
import {
  Search, Calendar, DollarSign, FileText, CheckCircle,
  Plus, X, Edit, Trash2, Loader2, Eye, ChevronDown, ChevronUp, Users, Layers, Receipt, Banknote,
  ArrowUp, ArrowDown, Check, AlertCircle as Alert
} from 'lucide-react';
import Select from 'react-select';

// Auth header utility
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Authentication token missing');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const API_URL = 'http://localhost:5000/api/supplier-payment/';
const API_SUPPLIERS = 'http://localhost:5000/api/suppliers';

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
  const [successMessage, setSuccessMessage] = useState('');
  const [supplierPayments, setSupplierPayments] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
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

  useEffect(() => {
    fetchPayments();
    fetchSuppliers();
  }, []);

  // Fetch suppliers for dropdown
  const fetchSuppliers = async () => {
    try {
      const res = await fetch(API_SUPPLIERS, { headers: getAuthHeaders() });
      const data = await res.json();
      setSuppliers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setSuppliers([]);
    }
  };

  // Fetch all payments
  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL, { headers: getAuthHeaders() });
      const data = await res.json();
      setSupplierPayments(Array.isArray(data) ? data : data.data || []);
      setCurrentPage(1);
    } catch (err) {
      setError('Failed to fetch payments.');
    }
    setIsLoading(false);
  };

  // Fetch a single payment by ID
  const fetchPaymentById = async (id) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}${id}`, { headers: getAuthHeaders() });
      const data = await res.json();
      return data;
    } catch (err) {
      setError('Failed to fetch payment details.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Search payments
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchPayments();
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}?search=${encodeURIComponent(searchTerm)}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setSupplierPayments(Array.isArray(data) ? data : data.data || []);
      setCurrentPage(1);
    } catch (err) {
      setError('Search failed.');
    }
    setIsLoading(false);
  };

  // Add table row
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
  };

  // Remove table row
  const removeTableRow = (id) => {
    setTableData(tableData.filter((row) => row.id !== id));
  };

  // Reset form
  const resetForm = () => {
    setVoucherNo('');
    setDate('');
    setAmount('');
    setRemarks('');
    setPaymentType('');
    setTotalAmount('');
    setTableData([]);
    setEditId(null);
    setError('');
    
  };

  // Submit payment (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!voucherNo || !date || !paymentType) {
      setError('Please fill all required fields');
      return;
    }
    if (tableData.length === 0) {
      setError('Please add at least one payment detail');
      return;
    }
    setIsLoading(true);
    setError('');
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
      data = await res.json();
      if (res.ok) {
        setSuccessMessage(editId ? 'Payment updated successfully!' : 'Payment created successfully!');
        fetchPayments();
        resetForm();
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        setError(data.error || data.message || 'Failed to save payment.');
      }
    } catch (err) {
      setError('Save failed. Please check your connection.');
    }
    setIsLoading(false);
  };

  // Edit payment (load to form)
  const handleEdit = async (payment) => {
    setIsLoading(true);
    try {
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
        setError('');
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError('Failed to load payment details for editing.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete payment
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) return;
    setIsLoading(true);
    try {
      await fetch(`${API_URL}${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      fetchPayments();
      setSuccessMessage('Payment deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError('Delete failed.');
    }
    setIsLoading(false);
  };

  // Table row value change
  const handleTableRowChange = (rowIndex, field, value) => {
    const updated = [...tableData];
    updated[rowIndex][field] = value;
    if (field === 'bill_amount' || field === 'paid_amount') {
      const bill = parseFloat(updated[rowIndex].bill_amount) || 0;
      const paid = parseFloat(updated[rowIndex].paid_amount) || 0;
      updated[rowIndex].balance_amount = (bill - paid).toFixed(2);
    }
    setTableData(updated);
  };

  // View details for a previous payment
  const handleViewDetails = async (p) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}${p.id}`, { headers: getAuthHeaders() });
      const data = await res.json();
      setViewPayment(data);
    } catch {
      setViewPayment(p);
    }
    setIsLoading(false);
  };

  const getSupplierName = (id) => {
    const supplier = suppliers.find(s => String(s.id) === String(id));
    return supplier ? supplier.name : `Supplier ${id}`;
  };

  const getPaymentTypeName = (id) => {
    const type = paymentTypes.find(t => t.id == id);
    return type ? type.name : `Type ${id}`;
  };

  // Sorting logic for payment table
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(order => order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);
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
  onClick={() => {
    if (isAdding) {
      resetForm();
      setIsAdding(false);
    } else {
      resetForm();
      setIsAdding(true);
    }
  }}
  className={`px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
    ${isAdding 
      ? 'bg-red-600 hover:bg-red-700' 
      : 'bg-indigo-600 hover:bg-indigo-700'}`}
>
  {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
  {isAdding ? 'Cancel' : 'Add Payment'}
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
                              No payment details added. Click "Add Row" to add details.
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
                      No payment records found
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
