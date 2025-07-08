import React, { useState, useEffect } from 'react';
import {
  FileText, Search, Printer, Calendar, User, Download, ChevronLeft, ChevronRight,
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert
} from 'lucide-react';
import Select from 'react-select';

const CustomerStatement = () => {
  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;
  // State management
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [clientName, setClientName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statements, setStatements] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [clients, setClients] = useState([]);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
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

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/clients`, getAuthHeaders());
        const data = await res.json();
        setClients(data);
      } catch (err) {
        setError('Failed to load clients');
      }
    };
    fetchClients();
  }, []);

  // Calculate totals for debit, credit and final balance
  const totalDebit = statements.reduce((sum, stmt) => sum + stmt.debit, 0);
  const totalCredit = statements.reduce((sum, stmt) => sum + stmt.credit, 0);
  const finalBalance = totalDebit - totalCredit;

  // Handles search: simulates API call and retrieves mock data
  const handleSearch = async () => {
    if (!fromDate || !toDate) {
      setError('Please select both From and To dates');
      return;
    }
    if (!clientName.trim()) {
      setError('Please select a Client Name');
      return;
    }
    
    setIsLoading(true);
    setShowResults(false);
    setError('');
    
    try {
      // Simulate API delay
      console.log('Searching customer statements:', {
        fromDate,
        toDate,
        clientName,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockStatements = [
        {
          id: 1,
          date: '2024-01-15',
          invoiceNo: 'INV-001',
          description: 'Logistics Service - Container Handling',
          debit: 1500.0,
          credit: 0.0,
          balance: 1500.0,
        },
        {
          id: 2,
          date: '2024-01-20',
          invoiceNo: 'PAY-001',
          description: 'Payment Received - Bank Transfer',
          debit: 0.0,
          credit: 1500.0,
          balance: 0.0,
        },
        {
          id: 3,
          date: '2024-01-25',
          invoiceNo: 'INV-002',
          description: 'Customs Clearance Service',
          debit: 750.0,
          credit: 0.0,
          balance: 750.0,
        },
        {
          id: 4,
          date: '2024-02-01',
          invoiceNo: 'INV-003',
          description: 'Freight Forwarding Service',
          debit: 2200.0,
          credit: 0.0,
          balance: 2950.0,
        },
        {
          id: 5,
          date: '2024-02-10',
          invoiceNo: 'PAY-002',
          description: 'Partial Payment Received',
          debit: 0.0,
          credit: 1000.0,
          balance: 1950.0,
        },
      ];

      setStatements(mockStatements);
      setShowResults(true);
      setSuccessMessage(`Statement generated successfully with ${mockStatements.length} transactions`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Search failed:', error);
      setError('Failed to generate statement. Please try again.');
      setStatements([]);
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

  // Sort statements
  const sortedStatements = [...statements].sort((a, b) => {
    let valA, valB;
    if (sortField === 'date') {
      valA = new Date(a.date);
      valB = new Date(b.date);
    } else if (sortField === 'debit' || sortField === 'credit' || sortField === 'balance') {
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

  // Print handler
  const handlePrint = () => {
    console.log('Printing customer statement');
    window.print();
  };

  // Export handler
  const handleExport = () => {
    console.log('Exporting customer statement');
    setSuccessMessage('Statement exported successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Prepare client options for dropdown
  const clientOptions = clients.map(client => ({
    value: client.name,
    label: client.name
  }));

  useEffect(() => {
    setCurrentPage(1);
  }, [statements]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Matching AssignExpenses */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              Customer Statement Report
            </h1>
            <p className="text-gray-600 mt-2">Generate and manage customer account statements</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              disabled={statements.length === 0}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5 mr-2" />
              Export
            </button>
            <button
              onClick={handlePrint}
              disabled={statements.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
              SEARCH PARAMETERS
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
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
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
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <Select
                  options={clientOptions}
                  value={clientOptions.find(option => option.value === clientName)}
                  onChange={(selectedOption) => setClientName(selectedOption?.value || '')}
                  placeholder="Select Client"
                  isSearchable
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
                {isLoading ? 'Generating...' : 'Generate Statement'}
              </button>
            </div>
          </div>
        </div>

        {/* Statement Summary */}
        {showResults && statements.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{clientName}</h2>
                <p className="text-sm text-gray-600">
                  Period: {new Date(fromDate).toLocaleDateString('en-GB')} to {new Date(toDate).toLocaleDateString('en-GB')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Statement Balance</p>
                <p className={`text-lg font-bold ${finalBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  SAR {Math.abs(finalBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  {finalBalance < 0 ? ' (CR)' : ' (DR)'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {showResults && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              {statements.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        { label: 'Date', key: 'date' },
                        { label: 'Reference', key: 'invoiceNo' },
                        { label: 'Description', key: 'description' },
                        { label: 'Debit (SAR)', key: 'debit' },
                        { label: 'Credit (SAR)', key: 'credit' },
                        { label: 'Balance (SAR)', key: 'balance' },
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
                    {currentStatements.map((statement) => (
                      <tr key={statement.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {new Date(statement.date).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className="font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                            {statement.invoiceNo}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {statement.description}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          {statement.debit > 0 ? (
                            <span className="font-semibold text-red-600">
                              {statement.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          {statement.credit > 0 ? (
                            <span className="font-semibold text-green-600">
                              {statement.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          <span className={`font-semibold ${statement.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {Math.abs(statement.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                      </tr>
                    ))}
                    
                    {/* Total row */}
                    <tr className="bg-gray-100 font-semibold">
                      <td className="px-4 py-3 text-sm text-gray-900" colSpan="3">
                        <strong>TOTAL</strong>
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">
                        <strong>
                          {totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </strong>
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-green-600">
                        <strong>
                          {totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </strong>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <strong className={finalBalance >= 0 ? 'text-blue-600' : 'text-red-600'}>
                          {Math.abs(finalBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          {finalBalance < 0 ? ' (CR)' : ' (DR)'}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No statements found</h3>
                  <p className="text-gray-500">No customer statements found for the selected criteria</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-700 mb-2 md:mb-0">
                  Showing {indexOfFirstItem + 1} to{' '}
                  {Math.min(indexOfLastItem, sortedStatements.length)} of {sortedStatements.length} transactions
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
                  Balance: <span className={`font-bold ${finalBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    SAR {Math.abs(finalBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Search Performed Yet */}
        {!showResults && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Ready to Generate Statement</h3>
              <p className="text-gray-500">
                Enter search criteria and click "Generate Statement" to view customer account details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerStatement;
