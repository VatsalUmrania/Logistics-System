import React, { useState, useEffect } from 'react';
import {
  FileText, Search, ChevronLeft, ChevronRight, Calendar,
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert
} from 'lucide-react';
import Select from 'react-select';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Authentication token missing');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const API_URL = 'http://localhost:5000/api/invoices';
const SUPPLIERS_URL = 'http://localhost:5000/api/suppliers';

const InvoiceSearch = () => {
  // State management
  const [invoices, setInvoices] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchFields, setSearchFields] = useState({
    supplier: '',
    invoiceNo: '',
    jobNumber: '',
    dateFrom: '',
    dateTo: ''
  });
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Custom styles for react-select dropdowns (matching AssignExpenses)
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
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch suppliers
        const supRes = await fetch(SUPPLIERS_URL, { headers: getAuthHeaders() });
        if (!supRes.ok) throw new Error('Failed to fetch suppliers');
        const supData = await supRes.json();
        setSuppliers(Array.isArray(supData) ? supData : supData.data || []);
        
        // Fetch invoices
        const invRes = await fetch(API_URL, { headers: getAuthHeaders() });
        if (!invRes.ok) throw new Error('Failed to fetch invoices');
        const invData = await invRes.json();
        setInvoices(Array.isArray(invData) ? invData : invData.data || []);
        
        setError('');
      } catch (err) {
        setError('Failed to load invoice data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(s => String(s.id) === String(supplierId));
    return supplier ? supplier.name : supplierId || '-';
  };

  // Search handler
  const handleSearch = () => {
    setSuccessMessage(`Found ${filteredInvoices.length} invoice(s) matching your criteria`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Filtering (including date interval and job number)
  const filteredInvoices = invoices.filter(inv => {
    const supplierName = getSupplierName(inv.supplier_id).toLowerCase();
    const supplierMatches = searchFields.supplier
      ? supplierName.includes(searchFields.supplier.toLowerCase())
      : true;
    const invoiceNoMatches = searchFields.invoiceNo
      ? ((inv.invoice_no || inv.invoiceNo || '') + '').toLowerCase().includes(searchFields.invoiceNo.toLowerCase())
      : true;
    const jobNumberMatches = searchFields.jobNumber
      ? ((inv.job_number || '') + '').toLowerCase().includes(searchFields.jobNumber.toLowerCase())
      : true;
    
    // Support both 'date' and 'invoice_date'
    const dateVal = (inv.date || inv.invoice_date || '').slice(0, 10);
    const from = searchFields.dateFrom;
    const to = searchFields.dateTo;
    let dateMatches = true;
    if (from && to) {
      dateMatches = dateVal >= from && dateVal <= to;
    } else if (from) {
      dateMatches = dateVal >= from;
    } else if (to) {
      dateMatches = dateVal <= to;
    }
    return supplierMatches && invoiceNoMatches && jobNumberMatches && dateMatches;
  });

  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
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

  // Sorting
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    let aVal, bVal;
    if (sortField === 'supplier') {
      aVal = getSupplierName(a.supplier_id).toLowerCase();
      bVal = getSupplierName(b.supplier_id).toLowerCase();
    } else if (sortField === 'date') {
      aVal = (a.date || a.invoice_date || '');
      bVal = (b.date || b.invoice_date || '');
    } else {
      aVal = a[sortField] || a[sortField.replace(/([A-Z])/g, '_$1').toLowerCase()] || '';
      bVal = b[sortField] || b[sortField.replace(/([A-Z])/g, '_$1').toLowerCase()] || '';
    }
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = sortedInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(sortedInvoices.length / itemsPerPage));

  // Prepare options for dropdowns
  const supplierOptions = suppliers.map(supplier => ({
    value: supplier.name,
    label: supplier.name
  }));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchFields, invoices]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading invoice data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Matching AssignExpenses */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              Invoice Search
            </h1>
            <p className="text-gray-600 mt-2">Search and filter supplier invoices efficiently</p>
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

        {/* Search Section - Matching AssignExpenses */}
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
                <Select
                  options={supplierOptions}
                  value={supplierOptions.find(option => option.value === searchFields.supplier)}
                  onChange={(selectedOption) => setSearchFields(f => ({ ...f, supplier: selectedOption?.value || '' }))}
                  placeholder="Select Supplier"
                  isSearchable
                  isClearable
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={selectStyles}
                  className="w-full text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  placeholder="Enter invoice number..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchFields.invoiceNo}
                  onChange={e => setSearchFields(f => ({ ...f, invoiceNo: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Number
                </label>
                <input
                  type="text"
                  placeholder="Enter job number..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchFields.jobNumber}
                  onChange={e => setSearchFields(f => ({ ...f, jobNumber: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date From
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={searchFields.dateFrom}
                    onChange={e => setSearchFields(f => ({ ...f, dateFrom: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date To
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={searchFields.dateTo}
                    onChange={e => setSearchFields(f => ({ ...f, dateTo: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSearch}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Search Invoices
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Invoice Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">{filteredInvoices.length} invoices</span>
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
                    { label: 'SL.No', key: null },
                    { label: 'Supplier', key: 'supplier' },
                    { label: 'Job Number', key: 'job_number' },
                    { label: 'Invoice No', key: 'invoiceNo' },
                    { label: 'Date', key: 'date' },
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
                {currentInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No invoices found</h4>
                        <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentInvoices.map((inv, index) => (
                    <tr key={inv.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1 + indexOfFirstItem}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {getSupplierName(inv.supplier_id)}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {inv.job_number || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md text-xs font-medium">
                          {inv.invoice_no || inv.invoiceNo || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {(inv.date || inv.invoice_date || '').slice(0, 10) || 'N/A'}
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
                {Math.min(indexOfLastItem, filteredInvoices.length)} of {filteredInvoices.length} invoices
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
                Total: <span className="text-green-600 font-bold">{filteredInvoices.length} invoices</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceSearch;
