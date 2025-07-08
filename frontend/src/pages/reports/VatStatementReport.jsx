import React, { useState, useEffect } from 'react';
import {
  Calculator, Search, Printer, Calendar, ChevronLeft, ChevronRight,
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert
} from 'lucide-react';
import Select from 'react-select';

const VatStatementReport = () => {
  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;
  // State management
  const [startDate, setStartDate] = useState('2024-11-01');
  const [endDate, setEndDate] = useState('2025-06-01');
  const [clientName, setClientName] = useState('');
  const [clients, setClients] = useState([]);
  const [vatStatements, setVatStatements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showResults, setShowResults] = useState(false);
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

  // Auth header utility
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication token missing');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Mock VAT data - in real implementation, this would come from your API
  const mockVatStatements = [
    { id: 1, date: '2025-01-02', clientName: 'EASTERN POWER SUPPORT TRADING EST.', invoiceNo: '12395', vatAmount: 82.50, baseAmount: 550.00 },
    { id: 2, date: '2025-01-02', clientName: 'OVERSEAS DEVELOPMENT COMPANY LIMITED', invoiceNo: '12396', vatAmount: 277.80, baseAmount: 1852.00 },
    { id: 3, date: '2025-01-05', clientName: 'PIVOT SHIPPING COMPANY LIMITED', invoiceNo: '12397', vatAmount: 67.50, baseAmount: 450.00 },
    { id: 4, date: '2025-01-05', clientName: 'PIVOT SHIPPING COMPANY LIMITED', invoiceNo: '12398', vatAmount: 67.50, baseAmount: 450.00 },
    { id: 5, date: '2025-01-07', clientName: 'RAISCO TRADING COMPANY', invoiceNo: '12399', vatAmount: 138.00, baseAmount: 920.00 },
    { id: 6, date: '2025-01-10', clientName: 'GLOBAL LOGISTICS PARTNERS', invoiceNo: '12400', vatAmount: 315.00, baseAmount: 2100.00 },
    { id: 7, date: '2025-01-15', clientName: 'MIDDLE EAST TRADING LLC', invoiceNo: '12401', vatAmount: 210.25, baseAmount: 1401.67 },
    { id: 8, date: '2025-01-18', clientName: 'OCEAN FREIGHT SERVICES', invoiceNo: '12402', vatAmount: 187.60, baseAmount: 1250.67 }
  ];

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/clients/`, getAuthHeaders());
        if (!res.ok) throw new Error('Failed to fetch clients');
        const data = await res.json();
        setClients(data);
      } catch (err) {
        setError('Failed to load clients');
      }
    };
    fetchClients();
  }, []);

  // Search handler
  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setError('Please select both From and To dates');
      return;
    }

    setIsLoading(true);
    setShowResults(false);
    setError('');
    
    try {
      // Simulate API call for VAT statements
      console.log('Searching VAT statements:', { startDate, endDate, clientName });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock data based on criteria
      let filteredStatements = mockVatStatements;
      if (clientName) {
        filteredStatements = mockVatStatements.filter(statement =>
          statement.clientName.toLowerCase().includes(clientName.toLowerCase())
        );
      }

      // Filter by date range
      filteredStatements = filteredStatements.filter(statement => {
        const statementDate = statement.date;
        return statementDate >= startDate && statementDate <= endDate;
      });

      setVatStatements(filteredStatements);
      setShowResults(true);
      setSuccessMessage(`Found ${filteredStatements.length} VAT record(s) for the selected period`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Failed to fetch VAT data. Please try again.');
      setVatStatements([]);
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
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

  // Sort VAT statements
  const sortedStatements = [...vatStatements].sort((a, b) => {
    let valA, valB;
    if (sortField === 'date') {
      valA = new Date(a.date);
      valB = new Date(b.date);
    } else if (sortField === 'vatAmount' || sortField === 'baseAmount') {
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
  const currentStatements = sortedStatements.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedStatements.length / itemsPerPage);

  // Calculate totals
  const getTotalVatAmount = () => {
    return vatStatements.reduce((total, statement) => total + parseFloat(statement.vatAmount), 0);
  };

  const getTotalBaseAmount = () => {
    return vatStatements.reduce((total, statement) => total + parseFloat(statement.baseAmount), 0);
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Prepare client options for dropdown
  const clientOptions = clients.map(client => ({
    value: client.name,
    label: client.name
  }));

  useEffect(() => {
    setCurrentPage(1);
  }, [vatStatements]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Matching AssignExpenses */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <Calculator className="w-8 h-8 mr-3 text-indigo-600" />
              VAT Statement Report
            </h1>
            <p className="text-gray-600 mt-2">Generate and analyze VAT statements by date range</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              disabled={!showResults || vatStatements.length === 0}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print Report
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
              SEARCH VAT RECORDS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name (Optional)
                </label>
                <Select
                  options={clientOptions}
                  value={clientOptions.find(option => option.value === clientName)}
                  onChange={(selectedOption) => setClientName(selectedOption?.value || '')}
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
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm flex items-center disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Searching...' : 'Search VAT Records'}
              </button>
            </div>
          </div>
        </div>

        {/* Report Header */}
        {showResults && vatStatements.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-lg font-medium text-blue-800">
                VAT Statement Period: {formatDate(startDate)} to {formatDate(endDate)}
              </p>
              {clientName && (
                <p className="text-lg font-medium text-blue-800 mt-1">
                  Client: {clientName}
                </p>
              )}
            </div>
          </div>
        )}

        {/* VAT Summary */}
        {showResults && vatStatements.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600">Total Base Amount</h3>
                <p className="text-2xl font-bold text-blue-600">
                  SAR {getTotalBaseAmount().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600">Total VAT Amount</h3>
                <p className="text-2xl font-bold text-green-600">
                  SAR {getTotalVatAmount().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600">Total with VAT</h3>
                <p className="text-2xl font-bold text-indigo-600">
                  SAR {(getTotalBaseAmount() + getTotalVatAmount()).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VAT Statements Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'Date', key: 'date' },
                    { label: 'Client Name', key: 'clientName' },
                    { label: 'Invoice No', key: 'invoiceNo' },
                    { label: 'Base Amount', key: 'baseAmount' },
                    { label: 'VAT Amount', key: 'vatAmount' },
                  ].map(({ label, key }) => (
                    <th
                      key={label}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex items-center">
                        {label}
                        {renderSortIcon(key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentStatements.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Calculator className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">
                          {showResults ? 'No VAT Records Found' : 'Ready to Search'}
                        </h4>
                        <p className="text-gray-400 mt-2">
                          {showResults 
                            ? 'No VAT records found for the selected criteria' 
                            : 'Select a date range and click search to view VAT statements'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentStatements.map((statement) => (
                    <tr key={statement.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(statement.date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                        {statement.clientName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md text-xs font-medium">
                          {statement.invoiceNo}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600 text-right">
                        SAR {statement.baseAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600 text-right">
                        SAR {statement.vatAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
                
                {/* Total row */}
                {currentStatements.length > 0 && (
                  <tr className="bg-gray-100 font-semibold">
                    <td colSpan="3" className="px-4 py-3 text-right text-sm text-gray-900">
                      <strong>TOTALS:</strong>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-700 text-right font-bold">
                      SAR {getTotalBaseAmount().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700 text-right font-bold">
                      SAR {getTotalVatAmount().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700 mb-2 md:mb-0">
                Showing {indexOfFirstItem + 1} to{' '}
                {Math.min(indexOfLastItem, sortedStatements.length)} of {sortedStatements.length} records
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
                Total VAT: <span className="text-green-600 font-bold">SAR {getTotalVatAmount().toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          )}
        </div>

        {/* Note Section */}
        {showResults && vatStatements.length > 0 && (
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">NOTE ON VAT STATEMENT</h3>
                <p className="text-sm text-yellow-700 mt-2">This VAT statement report includes all VAT collected during the specified period. Please verify all amounts before submission to tax authorities.</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {showResults && (
          <div className="mt-8 border-t border-gray-200 pt-4 flex justify-between items-center text-sm text-gray-500">
            <div>Generated on: {new Date().toLocaleDateString('en-GB')} at {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="italic">** Report Ends **</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VatStatementReport;
