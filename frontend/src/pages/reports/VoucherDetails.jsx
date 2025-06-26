import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Printer, Calendar, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert, Eye
} from 'lucide-react';
import Select from 'react-select';

const VoucherDetails = () => {
  // State management
  const [voucherNo, setVoucherNo] = useState('');
  const [voucherData, setVoucherData] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Mock voucher data - in real implementation, this would come from your API
  const mockVouchers = [
    {
      id: 'V-2023-001',
      date: '2025-05-15',
      type: 'Payment',
      account: 'Cash Account',
      description: 'Office supplies purchase',
      debit: 1200.00,
      credit: 0.00,
      status: 'Approved',
      preparedBy: 'John Smith',
      approvedBy: 'Jane Doe',
      details: [
        { account: 'Office Supplies', debit: 1000.00, credit: 0.00 },
        { account: 'VAT Input', debit: 200.00, credit: 0.00 },
        { account: 'Cash Account', debit: 0.00, credit: 1200.00 }
      ]
    },
    {
      id: 'V-2023-002',
      date: '2025-05-18',
      type: 'Receipt',
      account: 'Bank Account',
      description: 'Client payment - Project Alpha',
      debit: 0.00,
      credit: 5500.00,
      status: 'Pending',
      preparedBy: 'Alex Johnson',
      approvedBy: '-',
      details: [
        { account: 'Bank Account', debit: 5500.00, credit: 0.00 },
        { account: 'Accounts Receivable', debit: 0.00, credit: 5500.00 }
      ]
    },
    {
      id: 'V-2023-003',
      date: '2025-05-20',
      type: 'Journal',
      account: 'Expense Account',
      description: 'Monthly depreciation adjustment',
      debit: 850.00,
      credit: 850.00,
      status: 'Approved',
      preparedBy: 'Sarah Wilson',
      approvedBy: 'Mike Davis',
      details: [
        { account: 'Depreciation Expense', debit: 850.00, credit: 0.00 },
        { account: 'Accumulated Depreciation', debit: 0.00, credit: 850.00 }
      ]
    }
  ];

  // Initialize vouchers data
  useEffect(() => {
    setVouchers(mockVouchers);
  }, []);

  // Search handler
  const handleSearch = () => {
    if (!voucherNo.trim()) {
      setError('Please enter a voucher number');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      const foundVoucher = mockVouchers.find(v => v.id.toLowerCase().includes(voucherNo.toLowerCase()));
      
      if (foundVoucher) {
        setVoucherData(foundVoucher);
        setShowDetails(true);
        setSuccessMessage('Voucher found successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('Voucher not found');
        setVoucherData(null);
        setShowDetails(false);
      }
      setIsLoading(false);
    }, 500);
  };

  // View voucher details
  const handleViewVoucher = (voucher) => {
    setVoucherData(voucher);
    setShowDetails(true);
    setVoucherNo(voucher.id);
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

  // Filter vouchers based on search term
  const filteredVouchers = vouchers.filter(voucher =>
    voucher.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort vouchers
  const sortedVouchers = [...filteredVouchers].sort((a, b) => {
    let valA, valB;
    if (sortField === 'date') {
      valA = new Date(a.date);
      valB = new Date(b.date);
    } else if (sortField === 'debit' || sortField === 'credit') {
      valA = parseFloat(a[sortField]);
      valB = parseFloat(b[sortField]);
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
    value: voucher.id,
    label: voucher.id
  }));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, vouchers]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Matching AssignExpenses */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              Voucher Details
            </h1>
            <p className="text-gray-600 mt-2">Search and view voucher details</p>
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

        {/* Search Section - Matching AssignExpenses */}
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
                  styles={selectStyles}
                  className="w-full text-sm"
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

        {/* Voucher List Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">All Vouchers</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search vouchers..."
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'Voucher No', key: 'id' },
                    { label: 'Date', key: 'date' },
                    { label: 'Type', key: 'type' },
                    { label: 'Description', key: 'description' },
                    { label: 'Debit', key: 'debit' },
                    { label: 'Credit', key: 'credit' },
                    { label: 'Status', key: 'status' },
                    { label: 'Actions', key: null },
                  ].map(({ label, key }) => (
                    <th
                      key={label}
                      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        key ? 'cursor-pointer' : ''
                      } ${label === 'Actions' ? 'text-center' : ''}`}
                      onClick={() => key && handleSort(key)}
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
                {currentVouchers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No vouchers found</h4>
                        <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentVouchers.map((voucher) => (
                    <tr key={voucher.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">
                        {voucher.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {new Date(voucher.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          voucher.type === 'Payment' ? 'bg-red-100 text-red-800' :
                          voucher.type === 'Receipt' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {voucher.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                        {voucher.description}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-600 text-right">
                        {voucher.debit > 0 ? `$${voucher.debit.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600 text-right">
                        {voucher.credit > 0 ? `$${voucher.credit.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          voucher.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          voucher.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {voucher.status}
                        </span>
                      </td>
                      {/* FIXED ACTIONS COLUMN */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleViewVoucher(voucher)}
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
                {Math.min(indexOfLastItem, sortedVouchers.length)} of {sortedVouchers.length} vouchers
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
                Total: <span className="text-green-600 font-bold">{sortedVouchers.length} vouchers</span>
              </div>
            </div>
          )}
        </div>

        {/* Voucher Details Section */}
        {voucherData && showDetails && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-indigo-50 p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-indigo-700">
                  Voucher Details - {voucherData.id}
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
                  <h3 className="font-medium text-gray-700 mb-3">Basic Information</h3>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="w-32 text-gray-600">Date:</span>
                      <span className="font-medium">{new Date(voucherData.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Type:</span>
                      <span className="font-medium">{voucherData.type}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        voucherData.status === 'Approved' 
                          ? 'text-green-600' 
                          : voucherData.status === 'Pending'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }`}>
                        {voucherData.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-3">Financial Information</h3>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="w-32 text-gray-600">Debit:</span>
                      <span className="font-medium text-red-600">${voucherData.debit.toFixed(2)}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Credit:</span>
                      <span className="font-medium text-green-600">${voucherData.credit.toFixed(2)}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Account:</span>
                      <span className="font-medium">{voucherData.account}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{voucherData.description}</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div className="bg-gray-50 p-3">
                  <h3 className="font-medium text-gray-700">Account Details</h3>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Debit ($)
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credit ($)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {voucherData.details.map((detail, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {detail.account}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 text-right font-medium">
                          {detail.debit > 0 ? detail.debit.toFixed(2) : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 text-right font-medium">
                          {detail.credit > 0 ? detail.credit.toFixed(2) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">Prepared By</h3>
                  <p className="text-gray-900">{voucherData.preparedBy}</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">Approved By</h3>
                  <p className="text-gray-900">{voucherData.approvedBy}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-sm text-gray-500">
                <div>Generated on: {new Date().toLocaleDateString()}</div>
                <div className="italic">** Voucher Ends **</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherDetails;
