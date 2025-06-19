import { useState, useEffect } from 'react';
import { Truck, Plus, Pencil, Trash2, ChevronDown, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

const AddSupplierPage = () => {
  // API endpoints
  const API_URL = 'http://localhost:5000/api/suppliers';
  const INVOICE_API_URL = 'http://localhost:5000/api/supplier-assignments';

  // Supplier state
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    vat_number: '',
    registration_number: '',
    registration_date: '',
  });

  // Invoice state
  const [invoices, setInvoices] = useState([]);
  const [newInvoice, setNewInvoice] = useState({
    selectedSupplierId: '',
    supplierInvoiceNo: '',
    jobNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    vatRate: 0.15,
    totalAmount: 0,
    vatAmount: 0,
    billTotalWithVAT: 0,
    items: [{ purpose: '', item: '', quantity: 1, amount: 0 }]
  });

  const [isAdding, setIsAdding] = useState(true);
  const [isAddingInvoice, setIsAddingInvoice] = useState(false);
  const [editingId, setEditingId] = useState(null); // For supplier edit
  const [editingInvoiceId, setEditingInvoiceId] = useState(null); // For invoice edit
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const itemsPerPage = 5;
  const [activeTab, setActiveTab] = useState('suppliers');

  // Helper: Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication token missing');
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch suppliers
  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch suppliers');
      const data = await res.json();
      setSuppliers(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch suppliers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }; 

  // Fetch invoices
  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(INVOICE_API_URL, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch invoices');
      const responseData = await res.json();
      setInvoices(responseData.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch invoices. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add or update supplier
  const handleAddSupplier = async () => {
    if (!newSupplier.name.trim()) {
      setError('Supplier name is required');
      return;
    }
    try {
      let res;
      const headers = getAuthHeaders();
      if (editingId !== null) {
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(newSupplier),
        });
        if (!res.ok) throw new Error('Failed to update supplier');
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify(newSupplier),
        });
        if (!res.ok) throw new Error('Failed to add supplier');
      }
      await fetchSuppliers();
      setNewSupplier({
        name: '',
        address: '',
        phone: '',
        email: '',
        vat_number: '',
        registration_number: '',
        registration_date: '',
      });
      setEditingId(null);
      setIsAdding(false);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to save supplier');
    }
  };

  // Invoice form changes
  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "vatRate") {
      newValue = parseFloat(value);
      if (newValue > 1) newValue = newValue / 100;
    }
    setNewInvoice(prev => ({ ...prev, [name]: newValue }));
  };

  // Invoice item changes
  const handleItemChange = (index, field, value) => {
    const newItems = [...newInvoice.items];
    newItems[index][field] = value;
    const totalAmount = newItems.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
    const vatAmount = totalAmount * newInvoice.vatRate;
    const billTotalWithVAT = totalAmount + vatAmount;
    setNewInvoice(prev => ({
      ...prev,
      items: newItems,
      totalAmount,
      vatAmount,
      billTotalWithVAT
    }));
  };

  // Add new invoice item
  const addItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { purpose: '', item: '', quantity: 1, amount: 0 }]
    }));
  };

  // Remove invoice item
  const removeItem = (index) => {
    if (newInvoice.items.length <= 1) return;
    const newItems = newInvoice.items.filter((_, i) => i !== index);
    const totalAmount = newItems.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
    const vatAmount = totalAmount * newInvoice.vatRate;
    const billTotalWithVAT = totalAmount + vatAmount;
    setNewInvoice(prev => ({
      ...prev,
      items: newItems,
      totalAmount,
      vatAmount,
      billTotalWithVAT
    }));
  };

  // Add or update invoice
  const handleSubmitInvoice = async () => {
    if (!newInvoice.selectedSupplierId) {
      setError('Please select a supplier');
      return;
    }
    if (!newInvoice.supplierInvoiceNo) {
      setError('Invoice number is required');
      return;
    }
    try {
      let res;
      const headers = getAuthHeaders();
      if (editingInvoiceId !== null) {
        res = await fetch(`${INVOICE_API_URL}/${editingInvoiceId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            ...newInvoice,
            selectedSupplierId: parseInt(newInvoice.selectedSupplierId)
          }),
        });
        if (!res.ok) throw new Error('Failed to update invoice');
      } else {
        res = await fetch(INVOICE_API_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            ...newInvoice,
            selectedSupplierId: parseInt(newInvoice.selectedSupplierId)
          }),
        });
        if (!res.ok) throw new Error('Failed to create invoice');
      }
      setNewInvoice({
        selectedSupplierId: '',
        supplierInvoiceNo: '',
        jobNumber: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        vatRate: 0.15,
        totalAmount: 0,
        vatAmount: 0,
        billTotalWithVAT: 0,
        items: [{ purpose: '', item: '', quantity: 1, amount: 0 }]
      });
      setEditingInvoiceId(null);
      setIsAddingInvoice(false);
      fetchInvoices();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to create/update invoice');
    }
  };

  // Supplier edit
  const handleEdit = (supplier) => {
    setNewSupplier({ ...supplier });
    setEditingId(supplier.id);
    setIsAdding(true);
  };

  // Invoice edit
  const handleEditInvoice = async (invoice) => {
  try {
    // Fetch the full invoice including its items from the backend
    const res = await fetch(`http://localhost:5000/api/supplier-assignments/${invoice.id}`, {
      headers: getAuthHeaders(), // Replace with your auth header helper if needed
    });
    if (!res.ok) throw new Error('Failed to fetch invoice details');
    const fullInvoice = await res.json();

    setNewInvoice({
      selectedSupplierId: fullInvoice.supplier_id?.toString() || '',
      supplierInvoiceNo: fullInvoice.supplier_invoice_no || '',
      jobNumber: fullInvoice.job_number || '',
      invoiceDate: fullInvoice.invoice_date
        ? new Date(fullInvoice.invoice_date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      vatRate: Number(fullInvoice.vat_rate) || 0.15,
      totalAmount: Number(fullInvoice.total_amount) || 0,
      vatAmount: Number(fullInvoice.vat_amount) || 0,
      billTotalWithVAT: Number(fullInvoice.bill_total_with_vat) || 0,
      items: Array.isArray(fullInvoice.items) && fullInvoice.items.length > 0
        ? fullInvoice.items.map(item => ({
            purpose: item.purpose || '',
            item: item.item || '',
            quantity: Number(item.quantity) || 1,
            amount: Number(item.amount) || 0
          }))
        : [{ purpose: '', item: '', quantity: 1, amount: 0 }]
    });
    setEditingInvoiceId(fullInvoice.id);
    setIsAddingInvoice(true);
  } catch (err) {
    setError(err.message || 'Failed to load invoice for editing');
  }
};

  // Supplier delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete supplier');
      await fetchSuppliers();
      setError('');
    } catch (err) {
      setError('Failed to delete supplier');
    }
  };

  // Invoice delete
  const handleDeleteInvoice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      const res = await fetch(`${INVOICE_API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete invoice');
      await fetchInvoices();
      setError('');
    } catch (err) {
      setError('Failed to delete invoice');
    }
  };

  useEffect(() => {
    fetchSuppliers();
    fetchInvoices();
    // eslint-disable-next-line
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSuppliers = [...suppliers].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredSuppliers = sortedSuppliers.filter(supplier => 
    supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.vat_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  // Invoice search
  const filteredInvoices = invoices.filter(invoice => {
    const supplierName = suppliers.find(s => s.id === invoice.supplier_id)?.name?.toLowerCase() || '';
    return (
      (invoice.supplier_invoice_no?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      supplierName.includes(searchTerm.toLowerCase()) ||
      (invoice.job_number?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Truck className="w-8 h-8 mr-3 text-indigo-600" />
              SUPPLIER MANAGEMENT
            </h1>
            <p className="text-gray-600 mt-2">Manage suppliers and their invoices</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'suppliers' ? 'suppliers' : 'invoices'}...`}
                  className="bg-transparent outline-none w-40"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {activeTab === 'suppliers' ? (
              <button
                onClick={() => setIsAdding(!isAdding)}
                className={`px-5 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                  ${isAdding 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}
                `}
              >
                {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                {isAdding ? 'Cancel' : 'Add Supplier'}
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsAddingInvoice(!isAddingInvoice);
                  setEditingInvoiceId(null);
                  setNewInvoice({
                    selectedSupplierId: '',
                    supplierInvoiceNo: '',
                    jobNumber: '',
                    invoiceDate: new Date().toISOString().split('T')[0],
                    vatRate: 0.15,
                    totalAmount: 0,
                    vatAmount: 0,
                    billTotalWithVAT: 0,
                    items: [{ purpose: '', item: '', quantity: 1, amount: 0 }]
                  });
                }}
                className={`px-5 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                  ${isAddingInvoice 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}
                `}
              >
                {isAddingInvoice ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                {isAddingInvoice ? 'Cancel' : 'Add Invoice'}
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'suppliers'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('suppliers')}
          >
            Suppliers
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'invoices'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('invoices')}
          >
            Supplier Invoices
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Supplier Management */}
        {activeTab === 'suppliers' && (
          <>
            {/* Add Supplier Form */}
            {isAdding && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    {editingId ? 'Edit Supplier Details' : 'Add Supplier Details'}
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Supplier Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter supplier name"
                          value={newSupplier.name}
                          onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter email address"
                          value={newSupplier.email}
                          onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            VAT Number
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter VAT number"
                            value={newSupplier.vat_number}
                            onChange={(e) => setNewSupplier({...newSupplier, vat_number: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Registration Number
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter registration number"
                            value={newSupplier.registration_number}
                            onChange={(e) => setNewSupplier({...newSupplier, registration_number: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Supplier Address
                        </label>
                        <textarea
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter supplier address"
                          rows={3}
                          value={newSupplier.address}
                          onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter phone number"
                            value={newSupplier.phone}
                            onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Registration Date
                          </label>
                          <input
                            type="date"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={newSupplier.registration_date}
                            onChange={(e) => setNewSupplier({...newSupplier, registration_date: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-6">
                    <button
                      onClick={handleAddSupplier}
                      className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1 shadow-md flex items-center justify-center"
                    >
                      {editingId ? 'Update Supplier' : 'Save Supplier Details'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Supplier List Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">SUPPLIER LIST</h3>
                {isLoading ? (
                  <div className="text-sm text-indigo-600">Loading suppliers...</div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Showing {Math.min(filteredSuppliers.length, itemsPerPage)} of {filteredSuppliers.length} suppliers
                  </div>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-max">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SLNo
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          Supplier Name
                          {sortField === 'name' && (
                            sortDirection === 'asc' ? 
                            <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
                            <ChevronDown className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('registration_date')}
                      >
                        <div className="flex items-center">
                          Register Date
                          {sortField === 'registration_date' && (
                            sortDirection === 'asc' ? 
                            <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
                            <ChevronDown className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone No.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        VAT Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reg. Number
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                            <h4 className="text-lg font-medium text-gray-500">Loading suppliers...</h4>
                          </div>
                        </td>
                      </tr>
                    ) : currentSuppliers.length > 0 ? (
                      currentSuppliers.map((supplier, index) => (
                        <tr key={supplier.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">{supplier.address}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {supplier.registration_date || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{supplier.phone || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{supplier.vat_number || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{supplier.registration_number || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => handleEdit(supplier)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(supplier.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Truck className="w-16 h-16 text-gray-300 mb-4" />
                            <h4 className="text-lg font-medium text-gray-500">No suppliers found</h4>
                            <p className="text-gray-400 mt-1">Add a new supplier to get started</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {filteredSuppliers.length > itemsPerPage && !isLoading && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-lg border ${
                        currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-lg border ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-lg border ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Invoice Management */}
        {activeTab === 'invoices' && (
          <>
            {/* Add Invoice Form */}
            {isAddingInvoice && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    {editingInvoiceId ? 'Edit Supplier Invoice' : 'Add Supplier Invoice'}
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Supplier <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={newInvoice.selectedSupplierId}
                          onChange={(e) => setNewInvoice({...newInvoice, selectedSupplierId: e.target.value})}
                        >
                          <option value="">Select Supplier</option>
                          {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Invoice Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter invoice number"
                          name="supplierInvoiceNo"
                          value={newInvoice.supplierInvoiceNo}
                          onChange={handleInvoiceChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Number
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter job number"
                          name="jobNumber"
                          value={newInvoice.jobNumber}
                          onChange={handleInvoiceChange}
                        />
                      </div>
                    </div>
                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Invoice Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          name="invoiceDate"
                          value={newInvoice.invoiceDate}
                          onChange={handleInvoiceChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          VAT Rate (%)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter VAT rate"
                          name="vatRate"
                          value={newInvoice.vatRate * 100}
                          onChange={handleInvoiceChange}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Invoice Items */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice Items</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Item</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Amount (SAR)</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {newInvoice.items.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200">
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                                  placeholder="Purpose"
                                  value={item.purpose}
                                  onChange={(e) => handleItemChange(index, 'purpose', e.target.value)}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                                  placeholder="Item description"
                                  value={item.item}
                                  onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  min="1"
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                                  value={item.quantity}
                                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                                  value={item.amount}
                                  onChange={(e) => handleItemChange(index, 'amount', parseFloat(e.target.value) || 0)}
                                />
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => removeItem(index)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button
                      type="button"
                      onClick={addItem}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Item
                    </button>
                  </div>
                  {/* Invoice Summary */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Total Amount:</span>
                        <span className="font-medium">SAR {newInvoice.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700">VAT Amount:</span>
                        <span className="font-medium">SAR {newInvoice.vatAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-indigo-800 font-medium">Bill Total with VAT:</span>
                        <span className="font-bold text-indigo-800">SAR {newInvoice.billTotalWithVAT.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-6">
                    <button
                      onClick={handleSubmitInvoice}
                      className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1 shadow-md flex items-center justify-center"
                    >
                      {editingInvoiceId ? 'Update Invoice' : 'Save Invoice'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Invoice List Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">SUPPLIER INVOICES</h3>
                {isLoading ? (
                  <div className="text-sm text-indigo-600">Loading invoices...</div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Showing {filteredInvoices.length} invoices
                  </div>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-max">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount (SAR)</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{invoice.supplier_invoice_no}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {suppliers.find(s => s.id === invoice.supplier_id)?.name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{invoice.job_number || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : ''}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{parseFloat(invoice.bill_total_with_vat).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                            onClick={() => handleEditInvoice(invoice)}
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredInvoices.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Truck className="w-16 h-16 text-gray-300 mb-4" />
                            <h4 className="text-lg font-medium text-gray-500">No invoices found</h4>
                            <p className="text-gray-400 mt-1">Add a new invoice to get started</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddSupplierPage;