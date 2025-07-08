import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, CheckCircle, AlertTriangle, DollarSign, Loader
} from 'lucide-react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const AssignOtherCharges = () => {
  // State management
  const [clients, setClients] = useState([]);
  const [operations, setOperations] = useState([]);
  const [otherCharges, setOtherCharges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Search form state
  const [searchForm, setSearchForm] = useState({
    operationNo: '',
    clientName: ''
  });
  
  // Other charges form state
  const [chargeForm, setChargeForm] = useState({
    operation_no: '',
    client_name: '',
    charge_description: '',
    charge_amount: '',
    vat_percent: 0,
    vat_amount: 0,
    total_amount: '',
    date_assigned: new Date().toISOString().split('T')[0]
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('charge_description');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Fetch all required data from backend
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const headers = getAuthHeaders();
      if (!headers) return;
      
      const [clientsRes, chargesRes, jobRes] = await Promise.all([
        fetch(`${API_BASE_URL}/clients`, headers),
        fetch(`${API_BASE_URL}/other-charges`, headers),
        fetch(`${API_BASE_URL}/clearance-operations`, headers)
      ]);

      if (!clientsRes.ok) throw new Error('Failed to fetch clients');
      if (!chargesRes.ok) throw new Error('Failed to fetch other charges');
      if (!jobRes.ok) throw new Error('Failed to fetch operations');

      const clientsData = await clientsRes.json();
      const chargesData = await chargesRes.json();
      const jobData = await jobRes.json();

      setClients(clientsData);
      setOtherCharges(chargesData);
      
      // Extract unique job numbers
      const uniqueJobNumbers = [...new Set(jobData.map(op => op.job_no))]
        .filter(Boolean)
        .map(job => ({ value: job, label: job }));
      setOperations(uniqueJobNumbers);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Form handlers
  const handleSearchChange = (field, value) => {
    setSearchForm(prev => ({ ...prev, [field]: value }));
  };

  const handleChargeChange = (field, value) => {
    setChargeForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'charge_amount' || field === 'vat_percent') {
        const chargeAmount = parseFloat(updated.charge_amount) || 0;
        const vatPercent = parseFloat(updated.vat_percent) || 0;
        const vatAmount = (chargeAmount * vatPercent) / 100;
        updated.vat_amount = vatAmount;
        updated.total_amount = (chargeAmount + vatAmount).toFixed(2);
      }
      return updated;
    });
  };

  // Form validation
  const validateForm = () => {
    if (!chargeForm.charge_description.trim()) {
      toast.error('Charge description is required');
      return false;
    }
    if (!chargeForm.charge_amount || parseFloat(chargeForm.charge_amount) <= 0) {
      toast.error('Valid charge amount is required');
      return false;
    }
    if (!chargeForm.client_name.trim()) {
      toast.error('Client name is required');
      return false;
    }
    return true;
  };

  // Add/Edit Other Charge Handler
  const handleAddCharge = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    const loadingToast = toast.loading(editingId ? 'Updating other charge...' : 'Creating other charge...');
    
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const chargeData = {
        operation_no: chargeForm.operation_no || null,
        client_name: chargeForm.client_name,
        charge_description: chargeForm.charge_description,
        charge_amount: parseFloat(chargeForm.charge_amount),
        vat_percent: parseFloat(chargeForm.vat_percent) || 0,
        vat_amount: parseFloat(chargeForm.vat_amount) || 0,
        total_amount: parseFloat(chargeForm.total_amount) || 0,
        date_assigned: chargeForm.date_assigned
      };
      
      let response;
      if (editingId) {
        response = await fetch(`${API_BASE_URL}/other-charges/${editingId}`, {
          method: 'PUT',
          ...headers,
          body: JSON.stringify(chargeData)
        });
      } else {
        response = await fetch(`${API_BASE_URL}/other-charges`, {
          method: 'POST',
          ...headers,
          body: JSON.stringify(chargeData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save other charge');
      }

      // Refresh data
      await fetchData();
      
      // Reset form
      resetForm();
      
      toast.dismiss(loadingToast);
      toast.success(editingId ? 'Other charge updated successfully' : 'Other charge created successfully');
      
    } catch (error) {
      console.error('Error saving other charge:', error);
      toast.dismiss(loadingToast);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Handler
  const handleEdit = (charge) => {
    setChargeForm({
      operation_no: charge.operation_no || '',
      client_name: charge.client_name,
      charge_description: charge.charge_description,
      charge_amount: charge.charge_amount.toString(),
      vat_percent: charge.vat_percent,
      vat_amount: charge.vat_amount,
      total_amount: charge.total_amount.toString(),
      date_assigned: charge.date_assigned ? charge.date_assigned.split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setEditingId(charge.id);
    setIsAdding(true);
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this other charge?')) return;
    
    const loadingToast = toast.loading('Deleting other charge...');
    
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${API_BASE_URL}/other-charges/${id}`, {
        method: 'DELETE',
        ...headers
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete other charge');
      }

      // Refresh data
      await fetchData();
      
      toast.dismiss(loadingToast);
      toast.success('Other charge deleted successfully');
      
    } catch (error) {
      console.error('Error deleting other charge:', error);
      toast.dismiss(loadingToast);
      toast.error(error.message);
    }
  };

  // Reset form
  const resetForm = () => {
    setChargeForm({
      operation_no: '',
      client_name: '',
      charge_description: '',
      charge_amount: '',
      vat_percent: 0,
      vat_amount: 0,
      total_amount: '',
      date_assigned: new Date().toISOString().split('T')[0]
    });
    setIsAdding(false);
    setEditingId(null);
  };

  // Helper functions
  const getTotalAmount = () => {
    return otherCharges.reduce((sum, charge) => sum + parseFloat(charge.total_amount || 0), 0).toFixed(2);
  };

  const handleSearch = () => {
    // Implement search functionality if needed
    console.log('Searching with:', searchForm);
  };

  // Sorting logic
  const sortedCharges = [...otherCharges].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle numeric sorting for amount fields
    if (['charge_amount', 'vat_percent', 'vat_amount', 'total_amount'].includes(sortField)) {
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
  const currentCharges = sortedCharges.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedCharges.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Prepare options for searchable dropdowns
  const clientOptions = clients.map(client => ({
    value: client.name,
    label: client.name
  }));

  const operationOptions = operations;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading other charges data...</p>
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
              <DollarSign className="w-8 h-8 mr-3 text-indigo-600" />
              Other Charges Management
            </h1>
            <p className="text-gray-600 mt-2">Assign and manage additional charges for operations</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={() => {
                if (isAdding) {
                  resetForm();
                } else {
                  setIsAdding(true);
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center shadow-md 
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-white-600 hover:bg-gray-100 text-indigo-600'}`}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Cancel' : 'Add Other Charge'}
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH OPERATIONS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Client Name Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name
                </label>
                <div className="relative">
                  <Select
                    options={clientOptions}
                    value={clientOptions.find(option => option.value === searchForm.clientName)}
                    onChange={(selectedOption) => handleSearchChange('clientName', selectedOption?.value || '')}
                    placeholder="Select Client"
                    isSearchable
                    isClearable
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={selectStyles}
                    className="w-full text-sm"
                  />
                </div>
              </div>
              {/* Operation No Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operation No
                </label>
                <div className="relative">
                  <Select
                    options={operationOptions}
                    value={operationOptions.find(option => option.value === searchForm.operationNo)}
                    onChange={(selectedOption) => handleSearchChange('operationNo', selectedOption?.value || '')}
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
          </div>
        </div>

        {/* Add/Edit Other Charge Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                {editingId ? 'Edit Other Charge' : 'Add New Other Charge'}
              </h2>
            </div>
            <div className="p-4">
              <form onSubmit={(e) => { e.preventDefault(); handleAddCharge(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Operation No
                      </label>
                      <Select
                        options={operationOptions}
                        value={operationOptions.find(option => option.value === chargeForm.operation_no)}
                        onChange={(selectedOption) => handleChargeChange('operation_no', selectedOption?.value || '')}
                        placeholder="Select Operation"
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
                        Client Name <span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={clientOptions}
                        value={clientOptions.find(option => option.value === chargeForm.client_name)}
                        onChange={(selectedOption) => handleChargeChange('client_name', selectedOption?.value || '')}
                        placeholder="Select Client"
                        isSearchable
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={selectStyles}
                        className="w-full text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Charge Description <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={chargeForm.charge_description}
                        onChange={(e) => handleChargeChange('charge_description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Enter charge description"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Assigned
                      </label>
                      <input
                        type="date"
                        value={chargeForm.date_assigned}
                        onChange={(e) => handleChargeChange('date_assigned', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Charge Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={chargeForm.charge_amount}
                        onChange={(e) => handleChargeChange('charge_amount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        VAT (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={chargeForm.vat_percent}
                        onChange={(e) => handleChargeChange('vat_percent', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          VAT Amount
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={(parseFloat(chargeForm?.vat_amount) || 0).toFixed(2)}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total Amount
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={chargeForm.total_amount}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-semibold"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm flex items-center"
                  >
                    {isSubmitting && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                    {editingId ? 'Update Other Charge' : 'Add Other Charge'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Other Charges Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Other Charges Summary
            </h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">SAR {getTotalAmount()}</span>
            </div>
          </div>
        </div>

        {/* Other Charges Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'Operation', key: 'operation_no' },
                    { label: 'Client', key: 'client_name' },
                    { label: 'Description', key: 'charge_description' },
                    { label: 'Amount', key: 'charge_amount' },
                    { label: 'VAT %', key: 'vat_percent' },
                    { label: 'VAT Amount', key: 'vat_amount' },
                    { label: 'Total', key: 'total_amount' },
                    { label: 'Date', key: 'date_assigned' },
                    { label: 'Actions', key: null },
                  ].map(({ label, key }) => (
                    <th
                      key={label}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => key && handleSort(key)}
                    >
                      <div className="flex items-center">
                        {label}
                        {key && sortField === key && (
                          sortDirection === 'asc' ? 
                            <ArrowUp className="w-4 h-4 ml-1" /> : 
                            <ArrowDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCharges.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <DollarSign className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No other charges found</h4>
                        <p className="text-gray-400 mt-2">Create your first other charge to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentCharges.map((charge) => (
                    <tr key={charge.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {charge.operation_no || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {charge.client_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                        {charge.charge_description}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {parseFloat(charge.charge_amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                        {charge.vat_percent}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {parseFloat(charge.vat_amount || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600 text-right">
                        {parseFloat(charge.total_amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {new Date(charge.date_assigned).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleEdit(charge)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(charge.id)}
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
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700 mb-2 md:mb-0">
                Showing {indexOfFirstItem + 1} to{' '}
                {Math.min(indexOfLastItem, sortedCharges.length)} of {sortedCharges.length} charges
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
                Total: <span className="text-green-600 font-bold">SAR {getTotalAmount()}</span>
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

export default AssignOtherCharges;
