import React, { useState, useEffect } from 'react';
import { 
  X, AlertTriangle, FileX, CheckCircle, Search, ChevronLeft, ChevronRight,
  ArrowUp, ArrowDown, Loader, ClipboardList, Calendar, User, FileText
} from 'lucide-react';
import Select from 'react-select';

const ReceiptCancellation = () => {
  // State management following AssignExpenses pattern
  const [receipts, setReceipts] = useState([]);
  const [clients, setClients] = useState([]);
  const [operations, setOperations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
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
  
  // Pagination and sorting
  const [sortField, setSortField] = useState('receipt_no');
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

  // Authentication helper
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication token missing');
    }
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Mock data - replace with actual API calls
  const mockReceipts = [
    {
      id: 1,
      receipt_no: 'RCP-2025-001',
      client_name: 'ABC Logistics Co.',
      operation_no: 'OP-2025-001',
      amount: 15000.00,
      issue_date: '2025-01-15',
      status: 'Active',
      payment_method: 'Bank Transfer'
    },
    {
      id: 2,
      receipt_no: 'RCP-2025-002',
      client_name: 'XYZ Shipping Ltd.',
      operation_no: 'OP-2025-002',
      amount: 8500.00,
      issue_date: '2025-01-20',
      status: 'Active',
      payment_method: 'Cash'
    },
    {
      id: 3,
      receipt_no: 'RCP-2025-003',
      client_name: 'Global Trade Inc.',
      operation_no: 'OP-2025-003',
      amount: 22000.00,
      issue_date: '2025-01-25',
      status: 'Cancelled',
      payment_method: 'Check'
    }
  ];

  const mockClients = [
    'ABC Logistics Co.',
    'XYZ Shipping Ltd.',
    'Global Trade Inc.',
    'Ocean Freight Services',
    'Continental Cargo'
  ];

  const mockOperations = [
    'OP-2025-001',
    'OP-2025-002',
    'OP-2025-003',
    'OP-2025-004',
    'OP-2025-005'
  ];

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        setReceipts(mockReceipts);
        setClients(mockClients);
        setOperations(mockOperations);
        setError('');
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
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

  // Search functionality
  const handleSearch = () => {
    console.log('Searching with:', searchForm);
    // Implement actual search logic here
  };

  // Cancel receipt functionality
  const handleCancelReceipt = (receipt) => {
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
    if (!cancellationForm.reason.trim()) {
      setError('Please provide a reason for cancellation.');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmCancellation = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update receipt status
      setReceipts(prev => 
        prev.map(receipt => 
          receipt.id === cancellationForm.receiptId 
            ? { ...receipt, status: 'Cancelled' }
            : receipt
        )
      );
      
      setShowConfirmation(false);
      setIsAdding(false);
      setSuccessMessage(`Receipt ${cancellationForm.receiptNo} has been cancelled successfully.`);
      setCancellationForm({
        receiptId: '',
        receiptNo: '',
        reason: '',
        cancellationDate: new Date().toISOString().split('T')[0]
      });
      setSelectedReceipt(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to cancel receipt. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
      receipt.receipt_no.toLowerCase().includes(searchForm.receiptNo.toLowerCase());
    const matchesClient = !searchForm.clientName || 
      receipt.client_name.toLowerCase().includes(searchForm.clientName.toLowerCase());
    const matchesOperation = !searchForm.operationNo || 
      receipt.operation_no.toLowerCase().includes(searchForm.operationNo.toLowerCase());
    
    return matchesReceiptNo && matchesClient && matchesOperation;
  });

  const sortedReceipts = [...filteredReceipts].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReceipts = sortedReceipts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedReceipts.length / itemsPerPage);

  // Prepare options for dropdowns
  const clientOptions = clients.map(client => ({
    value: client,
    label: client
  }));

  const operationOptions = operations.map(op => ({
    value: op,
    label: op
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
        {/* Header - Same structure as AssignExpenses */}
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
                setIsAdding(!isAdding);
                if (isAdding) {
                  setCancellationForm({
                    receiptId: '',
                    receiptNo: '',
                    reason: '',
                    cancellationDate: new Date().toISOString().split('T')[0]
                  });
                  setSelectedReceipt(null);
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

        {/* Status Messages - Same as AssignExpenses */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Search Section - Same structure as AssignExpenses */}
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
                  Operation Number
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

        {/* Cancellation Form - Same structure as AssignExpenses */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-red-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-red-700 flex items-center">
                <FileX className="w-5 h-5 mr-2" />
                CANCEL RECEIPT
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Receipt Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cancellationForm.receiptNo}
                      onChange={(e) => handleCancellationChange('receiptNo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter receipt number"
                      disabled={selectedReceipt}
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
                      placeholder="Provide detailed reason for cancellation (e.g., duplicate entry, customer request, processing error...)"
                    />
                  </div>
                </div>
              </div>
              
              {/* Preview Section */}
              {selectedReceipt && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-md font-semibold text-gray-800 mb-3">Receipt Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Client:</span>
                      <span className="ml-2 font-medium">{selectedReceipt.client_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <span className="ml-2 font-medium">${selectedReceipt.amount.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Issue Date:</span>
                      <span className="ml-2 font-medium">{new Date(selectedReceipt.issue_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSubmitCancellation}
                  disabled={!cancellationForm.receiptNo.trim() || !cancellationForm.reason.trim()}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <FileX className="w-4 h-4 mr-2" />
                  Cancel Receipt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Receipts Table - Same structure as AssignExpenses */}
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
                    { label: 'Operation', key: 'operation_no' },
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
                        {receipt.operation_no}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                        ${receipt.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {new Date(receipt.issue_date).toLocaleDateString()}
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
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        {receipt.status === 'Active' ? (
                          <button
                            onClick={() => handleCancelReceipt(receipt)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                            title="Cancel Receipt"
                          >
                            <FileX className="w-4 h-4 mr-1" />
                            Cancel
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
          
          {/* Pagination - Same as AssignExpenses */}
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
                    disabled={isLoading}
                  >
                    Keep Receipt
                  </button>
                  <button
                    className="flex-1 bg-red-600 text-white rounded-lg py-3 px-4 font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    onClick={confirmCancellation}
                    disabled={isLoading}
                  >
                    {isLoading ? (
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
    </div>
  );
};

export default ReceiptCancellation;
