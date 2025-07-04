import React, { useState, useEffect } from 'react';
import { 
  Calculator, Search, Printer, Calendar, ChevronLeft, ChevronRight,
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert, RefreshCw,
  FileText, Download, Eye, Filter, TrendingUp, TrendingDown, X, BarChart3,
  Activity, DollarSign
} from 'lucide-react';
import Select from 'react-select';
import axios from 'axios';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';

// Auth header utility
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

const LedgerReport = () => {
  // State management
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingAccounts, setFetchingAccounts] = useState(false);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [reportData, setReportData] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statistics, setStatistics] = useState(null);
  const [accountSummary, setAccountSummary] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const itemsPerPage = 15;

  // API Base URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // Custom styles for react-select
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '42px',
      borderRadius: '8px',
      borderColor: state.isFocused ? '#4F46E5' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(79, 70, 229, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#9ca3af'
      }
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({ ...base, zIndex: 9999 }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#4F46E5' : state.isFocused ? '#EEF2FF' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#4F46E5' : '#EEF2FF'
      }
    })
  };

  // Fetch accounts for dropdown
  const fetchAccounts = async () => {
    try {
      setFetchingAccounts(true);
      console.log('Fetching accounts from:', `${API_BASE_URL}/ledger/accounts`);
      
      const response = await axios.get(`${API_BASE_URL}/ledger/accounts`, getAuthHeaders());
      console.log('Accounts response:', response.data);
      
      if (response.data.success) {
        const accountOptions = response.data.data.map(account => ({
          value: `${account.account_head_id}_${account.sub_account_head_id}`,
          label: account.display_name,
          account_head_id: account.account_head_id,
          sub_account_head_id: account.sub_account_head_id,
          account_head: account.account_head,
          sub_account_head: account.sub_account_head,
          account_type: account.account_type
        }));
        
        setAccounts(accountOptions);
        console.log('Processed accounts:', accountOptions);
        
        if (accountOptions.length === 0) {
          toast.custom((t) => (
            <div className="flex items-center">
              <Alert className="w-5 h-5 mr-2" />
              No accounts found. Please create some accounts first.
            </div>
          ));
        } else {
          toast.success(`Loaded ${accountOptions.length} accounts successfully`);
        }
      } else {
        throw new Error(response.data.error || 'Failed to fetch accounts');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error(error.response?.data?.error || 'Failed to fetch accounts');
      setAccounts([]);
    } finally {
      setFetchingAccounts(false);
    }
  };

  // Fetch ledger statistics
  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ledger/statistics`, {
        ...getAuthHeaders(),
        params: {
          from_date: fromDate,
          to_date: toDate
        }
      });
      
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Don't show error toast for statistics as it's not critical
    }
  };

  // Fetch account summary
  const fetchAccountSummary = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ledger/summary`, {
        ...getAuthHeaders(),
        params: {
          from_date: fromDate,
          to_date: toDate
        }
      });
      
      if (response.data.success) {
        setAccountSummary(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching account summary:', error);
      toast.error('Failed to fetch account summary');
    }
  };

  // Initialize data
  useEffect(() => {
    fetchAccounts();
    fetchStatistics();
  }, []);

  // Update statistics when date range changes
  useEffect(() => {
    if (fromDate && toDate) {
      fetchStatistics();
    }
  }, [fromDate, toDate]);

  // Reset pagination when entries change
  useEffect(() => {
    setCurrentPage(1);
  }, [ledgerEntries, searchTerm]);

  // Form validation
  const validateForm = () => {
    if (!fromDate) {
      toast.error('Please select a From Date');
      return false;
    }
    
    if (!toDate) {
      toast.error('Please select a To Date');
      return false;
    }
    
    if (new Date(fromDate) > new Date(toDate)) {
      toast.error('From Date cannot be greater than To Date');
      return false;
    }
    
    if (!selectedAccount) {
      toast.error('Please select an account');
      return false;
    }
    
    return true;
  };

  // Generate ledger report
  const handleSearch = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const loadingToast = toast.loading('Generating ledger report...');
    
    try {
      console.log('Generating report with params:', {
        account_head_id: selectedAccount.account_head_id,
        sub_account_head_id: selectedAccount.sub_account_head_id,
        from_date: fromDate,
        to_date: toDate
      });

      const response = await axios.get(`${API_BASE_URL}/ledger/report`, {
        ...getAuthHeaders(),
        params: {
          account_head_id: selectedAccount.account_head_id,
          sub_account_head_id: selectedAccount.sub_account_head_id,
          from_date: fromDate,
          to_date: toDate
        }
      });
      
      console.log('Report response:', response.data);
      toast.dismiss(loadingToast);
      
      if (response.data.success) {
        setLedgerEntries(response.data.data.entries || []);
        setReportData(response.data.data);
        setCurrentPage(1);
        setSearchTerm('');
        
        toast.success(`Ledger report generated successfully for ${selectedAccount.label}`);
        
        // Auto-hide filters on mobile after successful search
        if (window.innerWidth < 768) {
          setShowFilters(false);
        }
      } else {
        throw new Error(response.data.error || 'Failed to generate report');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Error generating ledger report:', error);
      
      if (error.response?.status === 404) {
        toast.error('No ledger data found for the selected criteria');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.error || 'Invalid request parameters');
      } else {
        toast.error('Failed to generate ledger report. Please try again.');
      }
      
      setLedgerEntries([]);
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Show account summary
  const handleShowSummary = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading('Fetching account summary...');
    
    try {
      await fetchAccountSummary();
      setShowSummary(true);
      toast.dismiss(loadingToast);
      toast.success('Account summary loaded successfully');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to load account summary');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear report
  const handleClearReport = () => {
    setLedgerEntries([]);
    setReportData(null);
    setSearchTerm('');
    setCurrentPage(1);
    setShowSummary(false);
    toast.custom((t) => (
      <div className="flex items-center">
        <X className="w-5 h-5 mr-2" />
        Report cleared
      </div>
    ));
  };

  // Print handler
  const handlePrint = () => {
        if (ledgerEntries.length === 0) {
          toast.error('No data to print. Please generate a report first.');
          return;
        }
        
        // Create print-friendly content
        const printContent = `
          <html>
            <head>
              <title>Ledger Report - ${selectedAccount?.label}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
                .report-info { margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; font-weight: bold; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .total-row { background-color: #f0f0f0; font-weight: bold; }
                .balance-info { margin-top: 10px; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>LEDGER REPORT</h1>
                <h2>${selectedAccount?.label}</h2>
              </div>
              <div class="report-info">
                <p><strong>Period:</strong> ${new Date(fromDate).toLocaleDateString()} to ${new Date(toDate).toLocaleDateString()}</p>
                <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Voucher No</th>
                    <th class="text-right">Debit</th>
                    <th class="text-right">Credit</th>
                    <th class="text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  ${ledgerEntries.map(entry => `
                    <tr>
                      <td>${entry.date ? new Date(entry.date).toLocaleDateString('en-GB') : ''}</td>
                      <td>${entry.description || ''}</td>
                      <td class="text-center">${entry.voucher_no || ''}</td>
                      <td class="text-right">${entry.debit > 0 ? parseFloat(entry.debit).toFixed(2) : ''}</td>
                      <td class="text-right">${entry.credit > 0 ? parseFloat(entry.credit).toFixed(2) : ''}</td>
                      <td class="text-right">${parseFloat(entry.running_balance || 0).toFixed(2)} ${entry.balance_type || 'Dr'}</td>
                    </tr>
                  `).join('')}
                  <tr class="total-row">
                    <td colspan="3"><strong>TOTAL</strong></td>
                    <td class="text-right"><strong>${getTotalDebit().toFixed(2)}</strong></td>
                    <td class="text-right"><strong>${getTotalCredit().toFixed(2)}</strong></td>
                    <td class="text-right"><strong>${reportData?.closing_balance ? 
                      `${parseFloat(reportData.closing_balance.amount).toFixed(2)} ${reportData.closing_balance.type}` : 
                      ''}</strong></td>
                  </tr>
                </tbody>
              </table>
              <div class="balance-info">
                <p>Opening Balance: ${reportData?.opening_balance ? 
                  `${parseFloat(reportData.opening_balance.amount).toFixed(2)} ${reportData.opening_balance.type}` : 
                  '0.00 Dr'}</p>
                <p>Closing Balance: ${reportData?.closing_balance ? 
                  `${parseFloat(reportData.closing_balance.amount).toFixed(2)} ${reportData.closing_balance.type}` : 
                  '0.00 Dr'}</p>
              </div>
            </body>
          </html>
        `;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
        
        toast.success('Print dialog opened');
      };

  // Export to CSV
  const handleExportCSV = () => {
    if (ledgerEntries.length === 0) {
      toast.error('No data to export. Please generate a report first.');
      return;
    }
    
    const csvHeaders = ['Date', 'Description', 'Voucher No', 'Debit', 'Credit', 'Balance', 'Balance Type'];
    const csvData = ledgerEntries.map(entry => [
      entry.date ? new Date(entry.date).toLocaleDateString('en-GB') : '',
      `"${(entry.description || '').replace(/"/g, '""')}"`,
      entry.voucher_no || '',
      entry.debit > 0 ? parseFloat(entry.debit).toFixed(2) : '',
      entry.credit > 0 ? parseFloat(entry.credit).toFixed(2) : '',
      parseFloat(entry.running_balance || 0).toFixed(2),
      entry.balance_type || 'Dr'
    ]);
    
    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ledger_report_${selectedAccount?.label.replace(/[^a-zA-Z0-9]/g, '_')}_${fromDate}_to_${toDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV file downloaded successfully');
  };

  // Refresh accounts
  const handleRefreshAccounts = async () => {
    await fetchAccounts();
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
    if (sortField !== field) return <ArrowUp className="w-3 h-3 text-gray-400 inline ml-1" />;
    return sortDirection === 'asc' ?
      <ArrowUp className="w-3 h-3 text-indigo-600 inline ml-1" /> :
      <ArrowDown className="w-3 h-3 text-indigo-600 inline ml-1" />;
  };

  // Filter entries based on search term
  const filteredEntries = ledgerEntries.filter(entry => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (entry.description || '').toLowerCase().includes(searchLower) ||
      (entry.voucher_no || '').toLowerCase().includes(searchLower) ||
      (entry.date || '').includes(searchTerm)
    );
  });

  // Sort ledger entries
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    let valA, valB;
    if (sortField === 'date') {
      valA = new Date(a.date || '1900-01-01');
      valB = new Date(b.date || '1900-01-01');
    } else if (sortField === 'debit' || sortField === 'credit' || sortField === 'running_balance') {
      valA = parseFloat(a[sortField]) || 0;
      valB = parseFloat(b[sortField]) || 0;
    } else {
      valA = (a[sortField] || '').toString().toLowerCase();
      valB = (b[sortField] || '').toString().toLowerCase();
    }
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalFilteredPages = Math.ceil(sortedEntries.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEntries = sortedEntries.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate totals
  const getTotalDebit = () => {
    return filteredEntries.reduce((sum, entry) => sum + parseFloat(entry.debit || 0), 0);
  };

  const getTotalCredit = () => {
    return filteredEntries.reduce((sum, entry) => sum + parseFloat(entry.credit || 0), 0);
  };

  // Get balance trend icon
  const getBalanceTrendIcon = () => {
    if (!reportData?.opening_balance || !reportData?.closing_balance) return null;
    
    const openingAmount = parseFloat(reportData.opening_balance.amount);
    const closingAmount = parseFloat(reportData.closing_balance.amount);
    
    if (closingAmount > openingAmount) {
      return <TrendingUp className="w-4 h-4 text-green-600 inline ml-1" />;
    } else if (closingAmount < openingAmount) {
      return <TrendingDown className="w-4 h-4 text-red-600 inline ml-1" />;
    }
    return null;
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                <Calculator className="w-8 h-8 mr-3 text-indigo-600" />
                Ledger Report
              </h1>
              <p className="text-gray-600 mt-2">Generate detailed account ledger reports with running balances from journal vouchers</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center shadow-md md:hidden"
              >
                <Filter className="w-5 h-5 mr-2" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
              <button
                onClick={handleRefreshAccounts}
                disabled={fetchingAccounts}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center shadow-md disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${fetchingAccounts ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleShowSummary}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center shadow-md disabled:opacity-50"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Summary
              </button>
              {ledgerEntries.length > 0 && (
                <>
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center shadow-md"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Export CSV
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center shadow-md"
                  >
                    <Printer className="w-5 h-5 mr-2" />
                    Print
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          {statistics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Vouchers</p>
                    <p className="text-2xl font-bold text-blue-600">{statistics.total_vouchers}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Entries</p>
                    <p className="text-2xl font-bold text-green-600">{statistics.total_entries}</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {parseFloat(statistics.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Days</p>
                    <p className="text-2xl font-bold text-orange-600">{statistics.active_days}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>
          )}

          {/* Search Section */}
          {(showFilters || window.innerWidth >= 768) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
              <div className="bg-indigo-50 p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  SEARCH CRITERIA
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      FROM DATE <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        max={toDate}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TO DATE <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        min={fromDate}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ACCOUNT <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={accounts}
                      value={selectedAccount}
                      onChange={(selectedOption) => setSelectedAccount(selectedOption)}
                      placeholder="Select Account"
                      isSearchable
                      isLoading={fetchingAccounts}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      styles={selectStyles}
                      className="text-sm"
                      noOptionsMessage={() => fetchingAccounts ? "Loading accounts..." : "No accounts found"}
                    />
                    {accounts.length === 0 && !fetchingAccounts && (
                      <p className="text-red-500 text-xs mt-1">No accounts available. Please create some accounts first.</p>
                    )}
                  </div>
                  
                  <div className="flex items-end">
                    <div className="w-full space-y-2">
                      <button
                        onClick={handleSearch}
                        disabled={isLoading || fetchingAccounts}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-5 rounded-lg shadow transition text-sm flex items-center justify-center disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Search className="w-4 h-4 mr-2" />
                        )}
                        {isLoading ? 'Generating...' : 'Generate Report'}
                      </button>
                      {(ledgerEntries.length > 0 || showSummary) && (
                        <button
                          onClick={handleClearReport}
                          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm flex items-center justify-center"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Clear Report
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Summary */}
          {showSummary && accountSummary.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="bg-purple-50 p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-purple-700 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  ACCOUNT SUMMARY ({new Date(fromDate).toLocaleDateString('en-GB')} to {new Date(toDate).toLocaleDateString('en-GB')})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Account</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Total Debit</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Total Credit</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Net Balance</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Transactions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {accountSummary.slice(0, 10).map((account, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <div className="font-medium text-gray-900">{account.account_head}</div>
                            <div className="text-gray-500">{account.sub_account_head}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {account.account_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-green-600">
                          {parseFloat(account.total_debit).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-red-600">
                          {parseFloat(account.total_credit).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-bold">
                          <span className={parseFloat(account.net_balance) >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {Math.abs(parseFloat(account.net_balance)).toFixed(2)} {parseFloat(account.net_balance) >= 0 ? 'Dr' : 'Cr'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {account.transaction_count}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {accountSummary.length > 10 && (
                <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600">
                  Showing top 10 accounts. Total: {accountSummary.length} accounts with transactions.
                </div>
              )}
            </div>
          )}

          {/* Report Header */}
          {reportData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="bg-gray-800 text-white p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Report Period</h3>
                    <p className="text-gray-300">
                      {new Date(fromDate).toLocaleDateString('en-GB')} to {new Date(toDate).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Account Details</h3>
                    <p className="text-gray-300">{selectedAccount?.label}</p>
                    <p className="text-gray-400 text-sm">Type: {selectedAccount?.account_type}</p>
                  </div>
                </div>
              </div>
              
              {/* Balance Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-1">Opening Balance</h4>
                  <p className="text-2xl font-bold text-blue-900">
                    {reportData.opening_balance ? 
                      `${parseFloat(reportData.opening_balance.amount).toFixed(2)} ${reportData.opening_balance.type}` : 
                      '0.00 Dr'}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">Closing Balance</h4>
                  <p className="text-2xl font-bold text-green-900 flex items-center">
                    {reportData.closing_balance ? 
                      `${parseFloat(reportData.closing_balance.amount).toFixed(2)} ${reportData.closing_balance.type}` : 
                      '0.00 Dr'}
                    {getBalanceTrendIcon()}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-1">Total Transactions</h4>
                  <p className="text-2xl font-bold text-purple-900">
                    {reportData.summary?.total_transactions || ledgerEntries.length}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-1">Net Movement</h4>
                  <p className="text-2xl font-bold text-orange-900">
                    {reportData.summary ? 
                      (reportData.summary.total_debit - reportData.summary.total_credit).toFixed(2) : 
                      (getTotalDebit() - getTotalCredit()).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filter Bar for Table */}
          {ledgerEntries.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  Showing {currentEntries.length} of {filteredEntries.length} transactions
                  {searchTerm && ` (filtered from ${ledgerEntries.length} total)`}
                </div>
              </div>
            </div>
          )}

          {/* Ledger Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    {[
                      { label: 'DATE', key: 'date', width: 'w-32' },
                      { label: 'DESCRIPTION', key: 'description', width: 'w-auto' },
                      { label: 'VOUCHER NO', key: 'voucher_no', width: 'w-32' },
                      { label: 'DEBIT', key: 'debit', width: 'w-32' },
                      { label: 'CREDIT', key: 'credit', width: 'w-32' },
                      { label: 'BALANCE', key: 'running_balance', width: 'w-36' },
                    ].map(({ label, key, width }) => (
                      <th
                        key={label}
                        className={`${width} px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer border border-gray-300 hover:bg-gray-200 transition-colors`}
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
                  {currentEntries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-gray-500 border border-gray-300">
                        <div className="flex flex-col items-center justify-center">
                          {ledgerEntries.length === 0 ? (
                            <>
                              <Calculator className="w-16 h-16 text-gray-300 mb-4" />
                              <h4 className="text-lg font-medium text-gray-500 mb-2">No Ledger Report Generated</h4>
                              <p className="text-gray-400">Select an account and date range to generate a ledger report</p>
                              <p className="text-gray-400 text-sm mt-1">Data will be fetched from your journal vouchers and opening balances</p>
                            </>
                          ) : (
                            <>
                              <FileText className="w-16 h-16 text-gray-300 mb-4" />
                              <h4 className="text-lg font-medium text-gray-500 mb-2">No Matching Transactions</h4>
                              <p className="text-gray-400">Try adjusting your search criteria</p>
                              {searchTerm && (
                                <button
                                  onClick={() => setSearchTerm('')}
                                  className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
                                >
                                  Clear search
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentEntries.map((entry, index) => (
                      <tr key={entry.id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
                          {entry.date ? new Date(entry.date).toLocaleDateString('en-GB') : ''}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300">
                          <div className="max-w-xs" title={entry.description}>
                            {entry.description}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border border-gray-300 text-center">
                          {entry.voucher_no || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right border border-gray-300">
                          {entry.debit > 0 ? parseFloat(entry.debit).toFixed(2) : ''}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right border border-gray-300">
                          {entry.credit > 0 ? parseFloat(entry.credit).toFixed(2) : ''}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right border border-gray-300">
                          <span className={`${entry.balance_type === 'Cr' ? 'text-red-600' : 'text-green-600'}`}>
                            {parseFloat(entry.running_balance || 0).toFixed(2)} {entry.balance_type || 'Dr'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                  
                  {/* Total row */}
                  {currentEntries.length > 0 && (
                    <tr className="bg-gray-100 font-semibold border-t-2 border-gray-400">
                      <td colSpan="3" className="px-4 py-3 text-left text-sm text-gray-900 border border-gray-300">
                        <strong>TOTAL ({filteredEntries.length} transactions)</strong>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-bold border border-gray-300">
                        {getTotalDebit().toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-bold border border-gray-300">
                        {getTotalCredit().toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-bold border border-gray-300">
                        {reportData?.closing_balance ? 
                          `${parseFloat(reportData.closing_balance.amount).toFixed(2)} ${reportData.closing_balance.type}` : 
                          '0.00 Dr'
                        }
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalFilteredPages > 1 && (
              <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-700 mb-2 md:mb-0">
                  Showing {indexOfFirstItem + 1} to{' '}
                  {Math.min(indexOfLastItem, sortedEntries.length)} of {sortedEntries.length} entries
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {/* Page numbers */}
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalFilteredPages) }, (_, i) => {
                      let pageNum;
                      if (totalFilteredPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalFilteredPages - 2) {
                        pageNum = totalFilteredPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 rounded-md text-sm transition-colors ${
                            currentPage === pageNum
                              ? 'bg-indigo-600 text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalFilteredPages))}
                    disabled={currentPage === totalFilteredPages}
                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="hidden md:block text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalFilteredPages}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Toast Configuration */}
      <ToastConfig />
    </>
  );
};

export default LedgerReport;
