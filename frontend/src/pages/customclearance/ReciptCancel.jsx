import React, { useState, useEffect } from 'react';
import { 
  X, AlertTriangle, FileX, CheckCircle, Search, ChevronLeft, ChevronRight,
  ArrowUp, ArrowDown, Loader, ClipboardList, Calendar, User, FileText, Eye
} from 'lucide-react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const ReceiptCancellation = () => {
  // State management
  const [receipts, setReceipts] = useState([]);
  const [clients, setClients] = useState([]);
  const [operations, setOperations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [searchForm, setSearchForm] = useState({
    receiptNo: '',
    clientName: '',
    operationNo: ''
  });
  
  const [cancellationForm, setCancellationForm] = useState({
    receiptId: '',
    receiptNo: '',
    reason: '',
    cancellationDate: new Date().toISOString().split('T')[0]
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showReceiptDetails, setShowReceiptDetails] = useState(false);
  const [receiptDetailsData, setReceiptDetailsData] = useState(null);
  
  // Pagination and sorting
  const [sortField, setSortField] = useState('receipt_no');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Fetch data functions
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

  // Fetch receipt details
  const fetchReceiptDetails = async (receiptId) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${API_BASE_URL}/receipts/${receiptId}`, headers);
      if (!response.ok) throw new Error('Failed to fetch receipt details');
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching receipt details:', error);
      toast.error('Failed to fetch receipt details');
      return null;
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);

  // Form handlers
  const handleSearchChange = (field, value) => {
    setSearchForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCancellationChange = (field, value) => {
    setCancellationForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle receipt selection from dropdown
  const handleReceiptSelection = (selectedOption) => {
    if (selectedOption) {
      const receipt = receipts.find(r => r.id === selectedOption.value);
      if (receipt) {
        if (receipt.status === 'Cancelled') {
          toast.error('This receipt is already cancelled');
          return;
        }
        setSelectedReceipt(receipt);
        setCancellationForm(prev => ({
          ...prev,
          receiptId: receipt.id,
          receiptNo: receipt.receipt_no
        }));
      }
    } else {
      setSelectedReceipt(null);
      setCancellationForm(prev => ({
        ...prev,
        receiptId: '',
        receiptNo: ''
      }));
    }
  };

  // Show receipt details popup
  const handleShowReceiptDetails = async (receipt) => {
    const details = await fetchReceiptDetails(receipt.id);
    if (details) {
      setReceiptDetailsData(details);
      setShowReceiptDetails(true);
    }
  };

  // Search functionality
  const handleSearch = async () => {
    if (!searchForm.receiptNo && !searchForm.clientName && !searchForm.operationNo) {
      await fetchReceipts();
      return;
    }

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const params = new URLSearchParams();
      if (searchForm.receiptNo) params.append('receipt_no', searchForm.receiptNo);
      if (searchForm.clientName) params.append('client_name', searchForm.clientName);
      if (searchForm.operationNo) params.append('operation_no', searchForm.operationNo);

      const response = await fetch(`${API_BASE_URL}/receipts?${params}`, headers);
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setReceipts(data);
      toast.success(`Found ${data.length} receipt(s)`);
    } catch (error) {
      console.error('Error searching receipts:', error);
      toast.error('Search failed: ' + error.message);
    }
  };

  // Cancel receipt functionality
  const handleCancelReceipt = (receipt) => {
    if (receipt.status === 'Cancelled') {
      toast.error('This receipt is already cancelled');
      return;
    }

    setSelectedReceipt(receipt);
    setCancellationForm({
      receiptId: receipt.id,
      receiptNo: receipt.receipt_no,
      reason: '',
      cancellationDate: new Date().toISOString().split('T')[0]
    });
    setIsAdding(true);
  };

  const handleSubmitCancellation = () => {
    if (!cancellationForm.receiptNo.trim()) {
      toast.error('Please select a receipt to cancel.');
      return;
    }
    if (!cancellationForm.reason.trim()) {
      toast.error('Please provide a reason for cancellation.');
      return;
    }
    if (cancellationForm.reason.trim().length < 10) {
      toast.error('Cancellation reason must be at least 10 characters long.');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmCancellation = async () => {
    setIsSubmitting(true);
    const loadingToast = toast.loading('Cancelling receipt...');
    
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${API_BASE_URL}/receipts/${cancellationForm.receiptId}/cancel`, {
        method: 'PATCH',
        ...headers,
        body: JSON.stringify({
          reason: cancellationForm.reason,
          cancellation_date: cancellationForm.cancellationDate
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel receipt');
      }

      // Refresh receipts data
      await fetchReceipts();
      
      setShowConfirmation(false);
      setIsAdding(false);
      setCancellationForm({
        receiptId: '',
        receiptNo: '',
        reason: '',
        cancellationDate: new Date().toISOString().split('T')[0]
      });
      setSelectedReceipt(null);
      
      toast.dismiss(loadingToast);
      toast.success(`Receipt ${cancellationForm.receiptNo} has been cancelled successfully.`);
      
    } catch (error) {
      console.error('Error cancelling receipt:', error);
      toast.dismiss(loadingToast);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setCancellationForm({
      receiptId: '',
      receiptNo: '',
      reason: '',
      cancellationDate: new Date().toISOString().split('T')[0]
    });
    setSelectedReceipt(null);
    setIsAdding(false);
    setShowConfirmation(false);
  };

  // Sorting logic
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return <ArrowUp className="w-3 h-3 text-gray-400 inline" />;
    return sortDirection === 'asc' ?
      <ArrowUp className="w-3 h-3 text-indigo-600 inline" /> :
      <ArrowDown className="w-3 h-3 text-indigo-600 inline" />;
  };

  // Filter and sort receipts
  const filteredReceipts = receipts.filter(receipt => {
    const matchesReceiptNo = !searchForm.receiptNo || 
      receipt.receipt_no?.toLowerCase().includes(searchForm.receiptNo.toLowerCase());
    const matchesClient = !searchForm.clientName || 
      receipt.client_name?.toLowerCase().includes(searchForm.clientName.toLowerCase());
    const matchesOperation = !searchForm.operationNo || 
      receipt.operation_no?.toLowerCase().includes(searchForm.operationNo.toLowerCase());
    
    return matchesReceiptNo && matchesClient && matchesOperation;
  });

  const sortedReceipts = [...filteredReceipts].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle numeric sorting for amount
    if (sortField === 'amount') {
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

  // Prepare options for dropdowns
  const clientOptions = clients.map(client => ({
    value: client.name,
    label: client.name
  }));

  const operationOptions = operations.map(op => ({
    value: op.job_no,
    label: op.job_no
  }));

  // Prepare receipt options for dropdown (only active receipts)
  const receiptOptions = receipts
    .filter(receipt => receipt.status === 'Active')
    .map(receipt => ({
      value: receipt.id,
      label: `${receipt.receipt_no} - ${receipt.client_name} (SAR ${parseFloat(receipt.amount || 0).toFixed(2)})`
    }));

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
              <FileX className="w-8 h-8 mr-3 text-red-600" />
              Receipt Cancellation
            </h1>
            <p className="text-gray-600 mt-2">Search and cancel receipts with proper documentation</p>
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
              className={`px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAdding 
                  ? 'bg-gray-600 hover:bg-gray-700' 
                  : 'bg-red-600 hover:bg-red-700'}`}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <FileX className="w-5 h-5 mr-2" />}
              {isAdding ? 'Cancel' : 'Cancel Receipt'}
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH RECEIPTS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Receipt Number
                </label>
                <input
                  type="text"
                  placeholder="Enter receipt number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchForm.receiptNo}
                  onChange={(e) => handleSearchChange('receiptNo', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name
                </label>
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operation Number (Job No)
                </label>
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
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSearch}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Search Receipts
              </button>
            </div>
          </div>
        </div>

        {/* Cancellation Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-red-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-red-700 flex items-center">
                <FileX className="w-5 h-5 mr-2" />
                CANCEL RECEIPT
              </h2>
            </div>
            <div className="p-4">
              <form onSubmit={(e) => { e.preventDefault(); handleSubmitCancellation(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Receipt <span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={receiptOptions}
                        value={receiptOptions.find(option => option.value === cancellationForm.receiptId)}
                        onChange={handleReceiptSelection}
                        placeholder="Select a receipt to cancel"
                        isSearchable
                        isClearable
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={selectStyles}
                        className="w-full text-sm"
                        noOptionsMessage={() => "No active receipts available"}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cancellation Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={cancellationForm.cancellationDate}
                        onChange={(e) => handleCancellationChange('cancellationDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cancellation Reason <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={cancellationForm.reason}
                        onChange={(e) => handleCancellationChange('reason', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                        placeholder="Provide detailed reason for cancellation (minimum 10 characters)"
                        required
                        minLength={10}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {cancellationForm.reason.length}/10 characters minimum
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Preview Section */}
                {selectedReceipt && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-md font-semibold text-gray-800 mb-3">Receipt Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Receipt No:</span>
                        <span className="ml-2 font-medium">{selectedReceipt.receipt_no}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Client:</span>
                        <span className="ml-2 font-medium">{selectedReceipt.client_name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <span className="ml-2 font-medium">SAR {parseFloat(selectedReceipt.amount).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Issue Date:</span>
                        <span className="ml-2 font-medium">{new Date(selectedReceipt.issue_date).toLocaleDateString('en-GB')}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={!cancellationForm.receiptId || !cancellationForm.reason.trim() || cancellationForm.reason.length < 10}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <FileX className="w-4 h-4 mr-2" />
                    Cancel Receipt
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
              <h3 className="text-lg font-semibold text-gray-800">Receipt Records</h3>
              <div className="text-sm text-gray-600">
                Showing {currentReceipts.length} of {sortedReceipts.length} receipts
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
                    { label: 'Operation (Job No)', key: 'operation_no' },
                    { label: 'Amount', key: 'amount' },
                    { label: 'Issue Date', key: 'issue_date' },
                    { label: 'Status', key: 'status' },
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
                {currentReceipts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No receipts found</h4>
                        <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
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
                        {receipt.operation_no || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                        SAR {parseFloat(receipt.amount || 0).toFixed(2)}
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
                          onClick={() => handleShowReceiptDetails(receipt)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {receipt.status === 'Active' ? (
                          <button
                            onClick={() => handleCancelReceipt(receipt)}
                            className="text-red-600 hover:text-red-900"
                            title="Cancel Receipt"
                          >
                            <FileX className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">Cancelled</span>
                        )}
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

        {/* Receipt Details Modal */}
        {showReceiptDetails && receiptDetailsData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="bg-indigo-600 p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <FileText className="w-6 h-6 mr-3" />
                    Receipt Details - {receiptDetailsData.receipt_no}
                  </h3>
                  <button
                    onClick={() => setShowReceiptDetails(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                      Basic Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Receipt Number:</span>
                        <span className="font-medium">{receiptDetailsData.receipt_no}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Receipt Type:</span>
                        <span className="font-medium">{receiptDetailsData.receipt_type || 'Payment'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          receiptDetailsData.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {receiptDetailsData.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Operation No:</span>
                        <span className="font-medium">{receiptDetailsData.operation_no || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reference No:</span>
                        <span className="font-medium">{receiptDetailsData.reference_no || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Client Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                      Client Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Client Name:</span>
                        <span className="font-medium">{receiptDetailsData.client_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium">{receiptDetailsData.payment_method || 'Cash'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Currency:</span>
                        <span className="font-medium">{receiptDetailsData.currency || 'SAR'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amount Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                      Amount Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Amount:</span>
                        <span className="font-medium">{receiptDetailsData.currency || 'SAR'} {parseFloat(receiptDetailsData.amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax Amount:</span>
                        <span className="font-medium">{receiptDetailsData.currency || 'SAR'} {parseFloat(receiptDetailsData.tax_amount || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount:</span>
                        <span className="font-medium">{receiptDetailsData.currency || 'SAR'} {parseFloat(receiptDetailsData.discount_amount || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-300 pt-2">
                        <span className="text-gray-800 font-semibold">Net Amount:</span>
                        <span className="font-bold text-green-600">{receiptDetailsData.currency || 'SAR'} {parseFloat(receiptDetailsData.net_amount || receiptDetailsData.amount).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Date Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                      Date Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Issue Date:</span>
                        <span className="font-medium">{receiptDetailsData.issue_date ? new Date(receiptDetailsData.issue_date).toLocaleDateString('en-GB') : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due Date:</span>
                        <span className="font-medium">{receiptDetailsData.due_date ? new Date(receiptDetailsData.due_date).toLocaleDateString('en-GB') : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created At:</span>
                        <span className="font-medium">{receiptDetailsData.created_at ? new Date(receiptDetailsData.created_at).toLocaleDateString('en-GB') : '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description and Notes */}
                {(receiptDetailsData.description || receiptDetailsData.notes) && (
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                      Additional Information
                    </h4>
                    {receiptDetailsData.description && (
                      <div className="mb-3">
                        <span className="text-gray-600 font-medium">Description:</span>
                        <p className="text-gray-800 mt-1">{receiptDetailsData.description}</p>
                      </div>
                    )}
                    {receiptDetailsData.notes && (
                      <div>
                        <span className="text-gray-600 font-medium">Notes:</span>
                        <p className="text-gray-800 mt-1">{receiptDetailsData.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowReceiptDetails(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
              <div className="bg-red-600 p-4">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-3" />
                  Confirm Receipt Cancellation
                </h3>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to cancel the following receipt?
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div>
                      <span className="text-gray-600">Receipt Number:</span>
                      <span className="ml-2 font-semibold">{cancellationForm.receiptNo}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Reason:</span>
                      <span className="ml-2">{cancellationForm.reason}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-700 font-medium">
                    ⚠️ This action cannot be undone and will be permanently recorded in the system.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex-1 bg-gray-500 text-white rounded-lg py-3 px-4 font-medium hover:bg-gray-600 transition"
                    onClick={() => setShowConfirmation(false)}
                    disabled={isSubmitting}
                  >
                    Keep Receipt
                  </button>
                  <button
                    className="flex-1 bg-red-600 text-white rounded-lg py-3 px-4 font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    onClick={confirmCancellation}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FileX className="w-5 h-5 mr-2" />
                        Confirm Cancel
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Toast Config Component */}
      <ToastConfig />
    </div>
  );
};

export default ReceiptCancellation;
