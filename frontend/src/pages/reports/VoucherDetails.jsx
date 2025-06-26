import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Printer, Calendar, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert, Eye, Receipt
} from 'lucide-react';
import Select from 'react-select';
import axios from 'axios';

const VoucherDetails = () => {
  // State management
  const [voucherNo, setVoucherNo] = useState('');
  const [voucherData, setVoucherData] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showModal, setShowModal] = useState(false); // New modal state
  const [modalData, setModalData] = useState(null); // Modal data state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [sortField, setSortField] = useState('payment_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  // API Base URL
  const API_BASE_URL = 'http://localhost:5000/api/supplier-payment';

  // Authentication headers function
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

  // Handle authentication errors
  const handleAuthError = (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      setError('Authentication failed. Please login again.');
    } else if (error.response?.status === 404) {
      setError('API endpoint not found. Please check if the server is running.');
    } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      setError('Cannot connect to server. Please ensure the backend server is running on port 5000.');
    } else {
      setError(error.response?.data?.message || error.message || 'An error occurred');
    }
  };

  // Fetch all supplier payments
  const fetchSupplierPayments = async () => {
    setIsLoading(true);
    try {
      const authHeaders = getAuthHeaders();
      const response = await axios.get(API_BASE_URL, authHeaders);
      
      if (Array.isArray(response.data)) {
        setVouchers(response.data);
        console.log('Supplier payments loaded successfully:', response.data.length, 'records');
      } else {
        setError('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching supplier payments:', error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch detailed voucher data
  const fetchVoucherDetails = async (paymentId) => {
    setIsLoading(true);
    try {
      const authHeaders = getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/${paymentId}`, authHeaders);
      
      if (response.data) {
        setVoucherData(response.data);
        setShowDetails(true);
        setSuccessMessage('Voucher details loaded successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('No voucher details found');
      }
    } catch (error) {
      console.error('Error fetching voucher details:', error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch voucher details for modal
  const fetchVoucherDetailsForModal = async (paymentId) => {
    try {
      const authHeaders = getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/${paymentId}`, authHeaders);
      
      if (response.data) {
        setModalData(response.data);
        setShowModal(true);
      } else {
        setError('No voucher details found');
      }
    } catch (error) {
      console.error('Error fetching voucher details for modal:', error);
      handleAuthError(error);
    }
  };

  // Search handler
  const handleSearch = () => {
    if (!voucherNo.trim()) {
      setError('Please enter a voucher number');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Search in the loaded vouchers
    setTimeout(() => {
      const foundVoucher = vouchers.find(v => 
        v.voucher_no.toLowerCase().includes(voucherNo.toLowerCase())
      );
      
      if (foundVoucher) {
        fetchVoucherDetails(foundVoucher.id);
        setVoucherNo(foundVoucher.voucher_no);
      } else {
        setError('Voucher not found');
        setVoucherData(null);
        setShowDetails(false);
        setIsLoading(false);
      }
    }, 300);
  };

  // View voucher details in modal
  const handleViewVoucherModal = (voucher) => {
    fetchVoucherDetailsForModal(voucher.id);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

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

  // Format currency
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get payment type badge color
  const getPaymentTypeBadgeColor = (paymentType) => {
    switch (paymentType?.toLowerCase()) {
      case 'cash':
        return 'bg-green-100 text-green-800';
      case 'bank transfer':
        return 'bg-blue-100 text-blue-800';
      case 'check':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter vouchers based on search term
  const filteredVouchers = vouchers.filter(voucher =>
    voucher.voucher_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.remarks.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.payment_type_label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort vouchers
  const sortedVouchers = [...filteredVouchers].sort((a, b) => {
    let valA, valB;
    if (sortField === 'payment_date') {
      valA = new Date(a.payment_date);
      valB = new Date(b.payment_date);
    } else if (sortField === 'amount') {
      valA = parseFloat(a.amount);
      valB = parseFloat(b.amount);
    } else {
      valA = a[sortField] ? a[sortField].toLowerCase() : '';
      valB = b[sortField] ? b[sortField].toLowerCase() : '';
    }
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVouchers = sortedVouchers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedVouchers.length / itemsPerPage);

  // Prepare voucher options for dropdown
  const voucherOptions = vouchers.map(voucher => ({
    value: voucher.voucher_no,
    label: voucher.voucher_no
  }));

  // Clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Initial data fetch
  useEffect(() => {
    fetchSupplierPayments();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, vouchers]);

  // Modal Component
  const PaymentDetailsModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-indigo-50 p-4 border-b border-gray-200 sticky top-0">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-indigo-700">
                Payment Details - {data.voucher_no}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-3">Payment Information</h3>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="w-32 text-gray-600">Voucher No:</span>
                    <span className="font-medium">{data.voucher_no}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(data.payment_date)}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-gray-600">Payment Type:</span>
                    <span className={`font-medium px-2 py-1 rounded-full text-xs ${getPaymentTypeBadgeColor(data.payment_type_label)}`}>
                      {data.payment_type_label}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-3">Financial Information</h3>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="w-32 text-gray-600">Amount:</span>
                    <span className="font-bold text-green-600 text-lg">{formatCurrency(data.amount)}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-gray-600">Created:</span>
                    <span className="font-medium">{formatDate(data.created_at)}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-gray-600">Updated:</span>
                    <span className="font-medium">{formatDate(data.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Remarks</h3>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{data.remarks}</p>
            </div>

            {/* Payment Details Table */}
            {data.details && data.details.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <Receipt className="w-5 h-5 text-indigo-600 mr-2" />
                  <h3 className="font-medium text-gray-700">Payment Details</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Operation No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Receipt No
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bill Amount
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Paid Amount
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.details.map((detail, index) => (
                        <tr key={detail.id || index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {detail.operation_no || '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {detail.receipt_no || '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                            {formatCurrency(detail.bill_amount)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 text-right font-medium">
                            {formatCurrency(detail.paid_amount)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                            <span className={`${parseFloat(detail.balance_amount) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {formatCurrency(detail.balance_amount)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={2} className="px-4 py-3 text-sm font-medium text-gray-700">
                          Total:
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                          {formatCurrency(
                            data.details.reduce((sum, detail) => sum + parseFloat(detail.bill_amount), 0)
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-green-600 text-right">
                          {formatCurrency(
                            data.details.reduce((sum, detail) => sum + parseFloat(detail.paid_amount), 0)
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-right">
                          <span className={`${
                            data.details.reduce((sum, detail) => sum + parseFloat(detail.balance_amount), 0) > 0 
                              ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {formatCurrency(
                              data.details.reduce((sum, detail) => sum + parseFloat(detail.balance_amount), 0)
                            )}
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-sm text-gray-500">
              <div>Generated on: {new Date().toLocaleDateString()}</div>
              <div className="italic">** Payment Voucher Ends **</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              Supplier Payment Details
            </h1>
            <p className="text-gray-600 mt-2">Search and view supplier payment voucher details</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              disabled={!showDetails}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print
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
              SEARCH VOUCHER
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voucher Number <span className="text-red-500">*</span>
                </label>
                <Select
                  options={voucherOptions}
                  value={voucherOptions.find(option => option.value === voucherNo)}
                  onChange={(selectedOption) => setVoucherNo(selectedOption?.value || '')}
                  placeholder="Select or type voucher number"
                  isSearchable
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={{
                    ...selectStyles,
                    menuPortal: (base) => ({ ...base, zIndex: 10000 }),
                    menu: (base) => ({ 
                      ...base, 
                      zIndex: 10000,
                      position: 'absolute',
                      top: 'auto',
                      bottom: '100%',
                      marginBottom: '4px'
                    })
                  }}
                  className="w-full text-sm"
                  isDisabled={isLoading}
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm flex items-center justify-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results Section - Positioned above All Supplier Payments */}
        {voucherData && showDetails && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-green-50 p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-green-700">
                  Search Result - {voucherData.voucher_no}
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-3">Payment Information</h3>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="w-32 text-gray-600">Voucher No:</span>
                      <span className="font-medium">{voucherData.voucher_no}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Date:</span>
                      <span className="font-medium">{formatDate(voucherData.payment_date)}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Payment Type:</span>
                      <span className={`font-medium px-2 py-1 rounded-full text-xs ${getPaymentTypeBadgeColor(voucherData.payment_type_label)}`}>
                        {voucherData.payment_type_label}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-3">Financial Information</h3>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="w-32 text-gray-600">Amount:</span>
                      <span className="font-bold text-green-600 text-lg">{formatCurrency(voucherData.amount)}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Created:</span>
                      <span className="font-medium">{formatDate(voucherData.created_at)}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Updated:</span>
                      <span className="font-medium">{formatDate(voucherData.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Remarks</h3>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{voucherData.remarks}</p>
              </div>

              {/* Payment Details Table */}
              {voucherData.details && voucherData.details.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <Receipt className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-medium text-gray-700">Payment Details</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Operation No
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Receipt No
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bill Amount
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Paid Amount
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Balance Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {voucherData.details.map((detail, index) => (
                          <tr key={detail.id || index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {detail.operation_no || '-'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {detail.receipt_no || '-'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                              {formatCurrency(detail.bill_amount)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 text-right font-medium">
                              {formatCurrency(detail.paid_amount)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                              <span className={`${parseFloat(detail.balance_amount) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {formatCurrency(detail.balance_amount)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={2} className="px-4 py-3 text-sm font-medium text-gray-700">
                            Total:
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                            {formatCurrency(
                              voucherData.details.reduce((sum, detail) => sum + parseFloat(detail.bill_amount), 0)
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-green-600 text-right">
                            {formatCurrency(
                              voucherData.details.reduce((sum, detail) => sum + parseFloat(detail.paid_amount), 0)
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-right">
                            <span className={`${
                              voucherData.details.reduce((sum, detail) => sum + parseFloat(detail.balance_amount), 0) > 0 
                                ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {formatCurrency(
                                voucherData.details.reduce((sum, detail) => sum + parseFloat(detail.balance_amount), 0)
                              )}
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-sm text-gray-500">
                <div>Generated on: {new Date().toLocaleDateString()}</div>
                <div className="italic">** Payment Voucher Ends **</div>
              </div>
            </div>
          </div>
        )}

        {/* Voucher List Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">All Supplier Payments</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search payments..."
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'Voucher No', key: 'voucher_no' },
                    { label: 'Date', key: 'payment_date' },
                    { label: 'Amount', key: 'amount' },
                    { label: 'Payment Type', key: 'payment_type_label' },
                    { label: 'Remarks', key: 'remarks' },
                    { label: 'Actions', key: null },
                  ].map(({ label, key }) => (
                    <th
                      key={label}
                      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        key ? 'cursor-pointer' : ''
                      } ${label === 'Actions' ? 'text-center' : ''}`}
                      onClick={() => key && !isLoading && handleSort(key)}
                    >
                      <div className={`flex items-center ${label === 'Actions' ? 'justify-center' : ''}`}>
                        {label}
                        {key && renderSortIcon(key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Loader className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                        <p>Loading supplier payments...</p>
                      </div>
                    </td>
                  </tr>
                ) : currentVouchers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No payments found</h4>
                        <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentVouchers.map((voucher) => (
                    <tr key={voucher.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">
                        {voucher.voucher_no}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(voucher.payment_date)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600 text-right">
                        {formatCurrency(voucher.amount)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentTypeBadgeColor(voucher.payment_type_label)}`}>
                          {voucher.payment_type_label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                        {voucher.remarks}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleViewVoucherModal(voucher)}
                            className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
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
                {Math.min(indexOfLastItem, sortedVouchers.length)} of {sortedVouchers.length} payments
              </div>
              <div className="flex items-center">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1 || isLoading}
                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                    title="Previous"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <span className="px-3 py-2 text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages || isLoading}
                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                    title="Next"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="hidden md:block text-sm font-medium text-gray-700">
                Total: <span className="text-green-600 font-bold">{sortedVouchers.length} payments</span>
              </div>
            </div>
          )}
        </div>

        {/* Payment Details Modal */}
        <PaymentDetailsModal 
          isOpen={showModal} 
          onClose={closeModal} 
          data={modalData} 
        />
      </div>
    </div>
  );
};

export default VoucherDetails;

