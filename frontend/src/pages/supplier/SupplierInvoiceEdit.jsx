import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, CheckCircle, AlertTriangle, Eye, Calendar, DollarSign,
  Loader, Check, AlertCircle as Alert
} from 'lucide-react';
import Select from 'react-select';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Authentication token missing');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const PAGE_SIZE = 10;

const SupplierInvoiceEdit = () => {
  const [supplierName, setSupplierName] = useState('');
  const [jobNo, setJobNo] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [slNoFilter, setSlNoFilter] = useState('');
  const [invoiceNoFilter, setInvoiceNoFilter] = useState('');
  const [isLoading, setIsLoading] = useState({
    supplier: false,
    job: false,
    invoice: false,
    table: false
  });
  const [invoices, setInvoices] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState({
    job_number: '',
    invoice_no: ''
  });
  const [isViewMode, setIsViewMode] = useState(false);
  const [vatInputMode, setVatInputMode] = useState('value');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sorting state
  const [sortColumn, setSortColumn] = useState('slNo');
  const [sortOrder, setSortOrder] = useState('asc');

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

  // Fetch invoices and suppliers
  useEffect(() => {
    fetchInvoices();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchNextJobNumber = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/invoices/next-job-number', {
          headers: getAuthHeaders()
        });
        setCurrentInvoice(prev => ({
          ...prev,
          job_number: response.data.job_number,
        }));
      } catch (error) {
        console.error('Failed to load next job number', error);
      }
    }
    const fetchNextInvoiceNumber = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/invoices/next-invoice-number', {
          headers: getAuthHeaders()
        });
        setCurrentInvoice(prev => ({
          ...prev,
          invoice_no: response.data.invoice_no,
        }));
      } catch (error) {
        console.error('Failed to load next invoice number', error);
      }
    }
    fetchNextJobNumber();
    fetchNextInvoiceNumber();
  }, []);

  const fetchInvoices = async (params = {}) => {
    setIsLoading(prev => ({ ...prev, table: true }));
    try {
      let url = `${API_URL}/invoices`;
      if (Object.keys(params).length) {
        const query = new URLSearchParams(params).toString();
        url += `?${query}`;
      }
      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await response.json();
      setInvoices(Array.isArray(data) ? data : data.data || []);
      setCurrentPage(1);
    } catch (error) {
      setInvoices([]);
      setError('Failed to fetch invoices');
    } finally {
      setIsLoading(prev => ({ ...prev, table: false }));
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${API_URL}/suppliers`, { headers: getAuthHeaders() });
      const data = await response.json();
      setSuppliers(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      setSuppliers([]);
    }
  };

  const handleSearch = (type) => {
    setIsLoading(prev => ({ ...prev, [type]: true }));

    const params = {};
    if (type === 'supplier' && supplierName) params.supplier = supplierName;
    if (type === 'job' && jobNo) params.job_no = jobNo;
    if (type === 'invoice' && invoiceNo) params.invoice_no = invoiceNo;

    fetchInvoices(params);
    setIsLoading(prev => ({ ...prev, [type]: false }));
  };

  const handleCreate = () => {
    setCurrentInvoice({
      job_number: currentInvoice.job_number || '',
      invoice_no: currentInvoice.invoice_no || '',
      invoice_date: new Date().toISOString().split('T')[0],
      bill_amount_without_vat: '',
      vat_amount: '',
      bill_amount: '',
      supplier_id: ''
    });
    setVatInputMode('value');
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (invoice) => {
    setCurrentInvoice({
      ...invoice,
      invoice_date: invoice.invoice_date
    });
    setVatInputMode('value');
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (invoice) => {
    setCurrentInvoice(invoice);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await fetch(`${API_URL}/invoices/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        fetchInvoices();
        setSuccessMessage('Invoice deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Failed to delete invoice');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  // Auto-calculate Bill Amount and VAT
  useEffect(() => {
    if (!currentInvoice) return;
    let billWithoutVat = parseFloat(currentInvoice.bill_amount_without_vat) || 0;
    let vatAmount = parseFloat(currentInvoice.vat_amount) || 0;

    if (vatInputMode === 'percent') {
      vatAmount = billWithoutVat * ((parseFloat(currentInvoice.vat_amount) || 0) / 100);
    }
    const billAmount = billWithoutVat + vatAmount;

    setCurrentInvoice(inv => ({
      ...inv,
      bill_amount: isNaN(billAmount) ? '' : billAmount.toFixed(2),
      vat_amount: vatInputMode === 'percent' ? (inv.vat_amount || '') : (isNaN(vatAmount) ? '' : vatAmount.toFixed(2))
    }));
  }, [currentInvoice?.bill_amount_without_vat, currentInvoice?.vat_amount, vatInputMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentInvoice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVatModeChange = (e) => {
    setVatInputMode(e.target.value);
    setCurrentInvoice(inv => ({
      ...inv,
      vat_amount: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let billWithoutVat = parseFloat(currentInvoice.bill_amount_without_vat) || 0;
    let vatAmount = parseFloat(currentInvoice.vat_amount) || 0;
    if (vatInputMode === 'percent') {
      vatAmount = billWithoutVat * ((parseFloat(currentInvoice.vat_amount) || 0) / 100);
    }

    const invoiceData = {
      job_number: currentInvoice.job_number,
      invoice_no: currentInvoice.invoice_no,
      invoice_date: currentInvoice.invoice_date,
      bill_amount_without_vat: billWithoutVat,
      vat_amount: vatAmount,
      bill_amount: billWithoutVat + vatAmount,
      supplier_id: currentInvoice.supplier_id || null
    };

    try {
      if (currentInvoice.id) {
        await fetch(`${API_URL}/invoices/${currentInvoice.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(invoiceData),
        });
        setSuccessMessage('Invoice updated successfully!');
      } else {
        await fetch(`${API_URL}/invoices`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(invoiceData)
        });
        setSuccessMessage('Invoice created successfully!');
      }
      setIsModalOpen(false);
      fetchInvoices();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Failed to save invoice');
      setTimeout(() => setError(''), 3000);
    }
  };

  const calculateTotal = (field) => {
    return invoices.reduce((sum, invoice) => sum + parseFloat(invoice[field] || 0), 0).toFixed(2);
  };

  // Filtering
  const withSlNo = invoices.map((invoice, idx) => ({ ...invoice, slNo: idx + 1 }));
  let filteredInvoices = withSlNo.filter(inv => {
    if (slNoFilter && String(inv.slNo) !== String(slNoFilter)) return false;
    if (invoiceNoFilter && !inv.invoice_no?.toLowerCase().includes(invoiceNoFilter.toLowerCase())) return false;
    return true;
  });

  // Sorting
  filteredInvoices = filteredInvoices.sort((a, b) => {
    let valA, valB;
    if (sortColumn === 'slNo') {
      valA = a.slNo;
      valB = b.slNo;
    } else if (sortColumn === 'invoice_no') {
      valA = a.invoice_no ? a.invoice_no.toLowerCase() : '';
      valB = b.invoice_no ? b.invoice_no.toLowerCase() : '';
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / PAGE_SIZE);
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [slNoFilter, invoiceNoFilter, sortColumn, sortOrder]);

  // Sorting toggle
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  // Render sort icon
  const renderSortIcon = (column) => {
    if (sortColumn !== column) return <ArrowUp className="w-3 h-3 text-gray-400 inline" />;
    return sortOrder === 'asc' ?
      <ArrowUp className="w-3 h-3 text-indigo-600 inline" /> :
      <ArrowDown className="w-3 h-3 text-indigo-600 inline" />;
  };

  // Prepare options for dropdowns
  const supplierOptions = suppliers.map(supplier => ({
    value: supplier.id,
    label: supplier.name
  }));

  if (isLoading.table && invoices.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading supplier invoices...</p>
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
              Supplier Invoice Management
            </h1>
            <p className="text-gray-600 mt-2">Create and manage supplier invoices</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all flex items-center shadow-md"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Invoice
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
              SEARCH INVOICES
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Name
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="Enter supplier name"
                  />
                  <button
                    onClick={() => handleSearch('supplier')}
                    disabled={isLoading.supplier}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-lg font-medium transition-all flex items-center"
                  >
                    {isLoading.supplier ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Number
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={jobNo}
                    onChange={(e) => setJobNo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="Enter job number"
                  />
                  <button
                    onClick={() => handleSearch('job')}
                    disabled={isLoading.job}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-lg font-medium transition-all flex items-center"
                  >
                    {isLoading.job ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="Enter invoice number"
                  />
                  <button
                    onClick={() => handleSearch('invoice')}
                    disabled={isLoading.invoice}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-lg font-medium transition-all flex items-center"
                  >
                    {isLoading.invoice ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Invoice Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">SAR {calculateTotal('bill_amount')}</span>
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'Sl.No', key: 'slNo' },
                    { label: 'Job Number', key: 'job_number' },
                    { label: 'Invoice No', key: 'invoice_no' },
                    { label: 'Invoice Date', key: 'invoice_date' },
                    { label: 'Bill Amt Without VAT', key: 'bill_amount_without_vat' },
                    { label: 'VAT Amount', key: 'vat_amount' },
                    { label: 'Bill Amount', key: 'bill_amount' },
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
                {paginatedInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                      {isLoading.table ? 'Loading invoices...' : 'No invoice records found'}
                    </td>
                  </tr>
                ) : (
                  paginatedInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.slNo}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {invoice.job_number}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {invoice.invoice_no}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {invoice.invoice_date}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="font-medium">SAR {parseFloat(invoice.bill_amount_without_vat || 0).toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">SAR {parseFloat(invoice.vat_amount || 0).toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-blue-500" />
                          <span className="font-bold">SAR {parseFloat(invoice.bill_amount || 0).toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleView(invoice)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(invoice.id)}
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
              {Math.min(currentPage * PAGE_SIZE, filteredInvoices.length)} of {filteredInvoices.length} invoices
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
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                  title="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="hidden md:block text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">SAR {calculateTotal('bill_amount')}</span>
            </div>
          </div>
        </div>

        {/* Invoice Modal */}
        {isModalOpen && currentInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-indigo-600 p-4 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white">
                    {isViewMode ? 'Invoice Details' : (currentInvoice.id ? 'Edit Invoice' : 'Create Invoice')}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {isViewMode ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600">Supplier Name:</span>
                        <span className="ml-2 font-medium">{currentInvoice.supplier_name || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Job Number:</span>
                        <span className="ml-2 font-medium">{currentInvoice.job_number}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Invoice Number:</span>
                        <span className="ml-2 font-medium">{currentInvoice.invoice_no}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Invoice Date:</span>
                        <span className="ml-2 font-medium">{currentInvoice.invoice_date}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600">Bill Amount Without VAT:</span>
                        <span className="ml-2 font-medium">SAR {parseFloat(currentInvoice.bill_amount_without_vat || 0).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">VAT Amount:</span>
                        <span className="ml-2 font-medium">SAR {parseFloat(currentInvoice.vat_amount || 0).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Bill Amount:</span>
                        <span className="ml-2 font-bold text-indigo-600">SAR {parseFloat(currentInvoice.bill_amount || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Supplier Name
                          </label>
                          <Select
                            options={supplierOptions}
                            value={supplierOptions.find(option => option.value == currentInvoice.supplier_id)}
                            onChange={(selectedOption) => setCurrentInvoice(prev => ({...prev, supplier_id: selectedOption?.value || ''}))}
                            placeholder="Select Supplier"
                            isSearchable
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={selectStyles}
                            className="w-full text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="job_number"
                            value={currentInvoice.job_number}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Invoice Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="invoice_no"
                            value={currentInvoice.invoice_no}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Invoice Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="invoice_date"
                            value={currentInvoice.invoice_date}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bill Amount Without VAT <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="bill_amount_without_vat"
                            value={currentInvoice.bill_amount_without_vat}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            VAT Amount <span className="text-red-500">*</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              step="0.01"
                              name="vat_amount"
                              value={currentInvoice.vat_amount}
                              onChange={handleChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                              placeholder={vatInputMode === "percent" ? "VAT %" : "VAT Value"}
                            />
                            <select
                              value={vatInputMode}
                              onChange={handleVatModeChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                            >
                              <option value="value">Value</option>
                              <option value="percent">Percent</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bill Amount <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="bill_amount"
                            value={currentInvoice.bill_amount}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg shadow transition text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow transition text-sm"
                      >
                        {currentInvoice.id ? 'Update Invoice' : 'Save Invoice'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierInvoiceEdit;
