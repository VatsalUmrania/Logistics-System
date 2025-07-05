import React, { useState, useEffect } from 'react';
import { 
  Search, Download, Printer, Trash2, ChevronLeft, ChevronRight, X,
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert, FileText,
  AlertTriangle, Calendar, TrendingUp, Filter
} from 'lucide-react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';

// Auth header function
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.warn('No authentication token found');
    return {
      'Content-Type': 'application/json'
    };
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const API_URL = 'http://localhost:5000/api/supplier-assignments/';
const PAGE_SIZE = 10;

const formatNumber = (num) => {
  if (num === null || num === undefined || num === "") return "-";
  return Number(num).toLocaleString(undefined, { minimumFractionDigits: 2 });
};

const exportToCSV = (data) => {
  const headers = [
    "SL.No",
    "Job Number",
    "Supplier Name",
    "Invoice No",
    "Invoice Date",
    "Bill Amt Without VAT",
    "VAT Amount",
    "Bill Amount"
  ];
  const rows = data.map((item, idx) => [
    idx + 1,
    item.job_number,
    item.supplier_name,
    item.supplier_invoice_no,
    item.invoice_date ? item.invoice_date.substring(0, 10) : '',
    formatNumber(item.total_amount),
    formatNumber(item.vat_amount),
    formatNumber(item.bill_total_with_vat)
  ]);
  const content = [headers, ...rows].map(r => r.map(f => `"${String(f).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `purchase-search-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
};

const PurchaseSearch = () => {
  // State management
  const [searchParams, setSearchParams] = useState({
    supplierName: '',
    jobNo: '',
    fromDate: '',
    toDate: ''
  });
  const [allPurchases, setAllPurchases] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('job_number');
  const [sortOrder, setSortOrder] = useState('asc');
  const [suppliers, setSuppliers] = useState([]);
  const [jobNumbers, setJobNumbers] = useState([]);

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

  // Enhanced error handling with emojis and specific error types
  const handleAuthError = (error) => {
    console.error('API Error:', error);
    
    if (error.message.includes('401') || error.message.includes('Authentication') || error.message.includes('Unauthorized')) {
      toast.error('🔐 Authentication failed. Please login again.');
    } else if (error.message.includes('404')) {
      toast.error('🔍 API endpoint not found. Please check if the server is running.');
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('Network Error')) {
      toast.error('🌐 Cannot connect to server. Please ensure the backend server is running on port 5000.');
    } else if (error.message.includes('500')) {
      toast.error('⚠️ Server error occurred. Please try again later.');
    } else {
      toast.error(`❌ ${error.message || 'An unexpected error occurred'}`);
    }
  };

  // Enhanced validation with custom warning toasts
  const validateSearchParams = () => {
    const warnings = [];
    
    if (searchParams.fromDate && searchParams.toDate && new Date(searchParams.fromDate) > new Date(searchParams.toDate)) {
      warnings.push('From date cannot be later than To date');
    }
    
    if (searchParams.fromDate && !searchParams.toDate) {
      warnings.push('Please select To date when From date is specified');
    }
    
    if (!searchParams.fromDate && searchParams.toDate) {
      warnings.push('Please select From date when To date is specified');
    }
    
    if (warnings.length > 0) {
      warnings.forEach(warning => {
        toast((t) => (
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {warning}
          </div>
        ), {
          duration: 4500,
          style: {
            background: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%)',
            color: '#ffffff',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1)',
          },
        });
      });
      return false;
    }
    
    return true;
  };

  // Enhanced fetch with detailed feedback
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const loadingToast = toast.loading('🔄 Loading purchase data...');
      
      // Fetch purchases
      const purchasesRes = await fetch(API_URL, { headers: getAuthHeaders() });
      if (!purchasesRes.ok) {
        throw new Error(`Failed to fetch purchases: ${purchasesRes.status} ${purchasesRes.statusText}`);
      }
      
      const purchasesData = await purchasesRes.json();
      const purchases = purchasesData?.data || [];
      setAllPurchases(purchases);
      setSearchResults(purchases);

      // Extract unique suppliers and job numbers for dropdowns
      const uniqueSuppliers = [...new Set(purchases.map(p => p.supplier_name).filter(Boolean))];
      const uniqueJobNumbers = [...new Set(purchases.map(p => p.job_number).filter(Boolean))];
      
      setSuppliers(uniqueSuppliers.map(name => ({ value: name, label: name })));
      setJobNumbers(uniqueJobNumbers.map(job => ({ value: job, label: job })));
      
      toast.dismiss(loadingToast);
      
      // Success feedback with data counts
      toast((t) => (
        <div className="flex items-center">
          <Check className="w-5 h-5 mr-2" />
          Loaded {purchases.length} purchase records
        </div>
      ), {
        duration: 3000,
      });

    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('❌ Failed to load purchase data. Please refresh the page.');
      setAllPurchases([]);
      setSearchResults([]);
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Enhanced input change handler with feedback
  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
    
    // Provide feedback for specific field changes
    if (field === 'supplierName' && value) {
      toast((t) => (
        <div className="flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Supplier selected: {value}
        </div>
      ), {
        duration: 1500,
      });
    } else if (field === 'jobNo' && value) {
      toast((t) => (
        <div className="flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Job selected: {value}
        </div>
      ), {
        duration: 1500,
      });
    }
  };

  // Enhanced search handler with detailed feedback
  const handleSearch = () => {
    if (!validateSearchParams()) {
      return;
    }

    const loadingToast = toast.loading('🔍 Searching purchase records...');
    
    let results = allPurchases;
    setHasSearched(true);

    // Apply filters
    if (searchParams.supplierName.trim()) {
      const searchValue = searchParams.supplierName.trim().toLowerCase();
      results = results.filter(p =>
        (p.supplier_name || '').toLowerCase().includes(searchValue)
      );
    }

    if (searchParams.jobNo.trim()) {
      const searchValue = searchParams.jobNo.trim().toLowerCase();
      results = results.filter(p =>
        (p.job_number || '').toLowerCase().includes(searchValue)
      );
    }

    if (searchParams.fromDate && searchParams.toDate) {
      const from = new Date(searchParams.fromDate);
      const to = new Date(searchParams.toDate);
      results = results.filter(p => {
        const date = new Date(p.invoice_date);
        return date >= from && date <= to;
      });
    }

    setSearchResults(results);
    setCurrentPage(1);
    toast.dismiss(loadingToast);

    // Enhanced success feedback with statistics
    if (results.length === 0) {
      toast((t) => (
        <div className="flex items-center">
          <Search className="w-5 h-5 mr-2" />
          No purchase records found for the selected criteria
        </div>
      ), {
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%)',
          color: '#ffffff',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1)',
        },
      });
    } else {
      const totalAmount = results.reduce((sum, item) => sum + parseFloat(item.bill_total_with_vat || 0), 0);
      
      toast((t) => (
        <div className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Found {results.length} records (Total: SAR {totalAmount.toFixed(2)})
        </div>
      ), {
        duration: 3000,
      });
    }
  };

  // Enhanced clear handler with feedback
  const handleClear = () => {
    setSearchParams({ supplierName: '', jobNo: '', fromDate: '', toDate: '' });
    setSearchResults(allPurchases);
    setHasSearched(false);
    setCurrentPage(1);
    
    toast((t) => (
      <div className="flex items-center">
        <X className="w-5 h-5 mr-2" />
        Search filters cleared
      </div>
    ), {
      duration: 2000,
    });
  };

  // Enhanced export handler with feedback
  const handleExport = () => {
    if (sortedResults.length === 0) {
      toast((t) => (
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          No data to export
        </div>
      ), {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%)',
          color: '#ffffff',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1)',
        },
      });
      return;
    }

    const loadingToast = toast.loading('📊 Preparing CSV export...');
    
    try {
      exportToCSV(sortedResults);
      toast.dismiss(loadingToast);
      
      toast((t) => (
        <div className="flex items-center">
          <Download className="w-5 h-5 mr-2" />
          CSV exported successfully ({sortedResults.length} records)
        </div>
      ), {
        duration: 3000,
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('❌ Failed to export CSV file');
    }
  };

  // Enhanced print handler with feedback
  const handlePrint = () => {
    if (sortedResults.length === 0) {
      toast((t) => (
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          No data to print
        </div>
      ), {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%)',
          color: '#ffffff',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1)',
        },
      });
      return;
    }

    toast((t) => (
      <div className="flex items-center">
        <Printer className="w-5 h-5 mr-2" />
        Preparing print document...
      </div>
    ), {
      duration: 2000,
    });

    setTimeout(() => {
      const headers = [
        "SL.No", "Job Number", "Supplier Name", "Invoice No", "Invoice Date",
        "Bill Amt Without VAT", "VAT Amount", "Bill Amount"
      ];

      const rows = sortedResults.map((item, idx) => [
        idx + 1, item.job_number, item.supplier_name, item.supplier_invoice_no,
        item.invoice_date ? item.invoice_date.substring(0, 10) : '',
        formatNumber(item.total_amount), formatNumber(item.vat_amount), formatNumber(item.bill_total_with_vat)
      ]);

      const tableHTML = `
        <table>
          <thead>
            <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map((row, i) =>
              `<tr${i % 2 === 1 ? ' style="background:#f3f4f6;"' : ''}>
                ${row.map((cell, j) =>
                  `<td style="text-align:${j >= 5 ? 'right' : 'left'}">${cell}</td>`
                ).join('')}
              </tr>`
            ).join('')}
          </tbody>
        </table>
      `;

      const searchSummary = `
        <div style="margin-bottom: 1.2em; padding-bottom: 0.5em; border-bottom: 2px solid #6366f1;">
          <div style="font-size: 2em; font-weight: 700; color: #312e81; margin-bottom: 0.15em;">
            Purchase Search Results
          </div>
          <div style="font-size:1.09em; color:#374151;">
            ${searchParams.supplierName ? `<span style="margin-right:1.3em;">Supplier: <b>${searchParams.supplierName}</b></span>` : ''}
            ${searchParams.jobNo ? `<span style="margin-right:1.3em;">Job No: <b>${searchParams.jobNo}</b></span>` : ''}
            ${searchParams.fromDate || searchParams.toDate ? `<span>Date: <b>${searchParams.fromDate || '---'} to ${searchParams.toDate || '---'}</b></span>` : ''}
          </div>
          <div style="margin-top:0.6em; font-size:0.97em; color:#64748b;">
            Printed on: ${new Date().toLocaleString()}
          </div>
        </div>
      `;

      const mywindow = window.open('', '', 'width=1100,height=800');
      mywindow.document.write(`
        <html>
          <head>
            <title>Purchase Search Print</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; color: #22223b; padding: 32px 24px 24px 24px; font-size: 15px; }
              @media print { body { background: none; padding: 0; } }
              table { border-collapse: collapse; width: 100%; background: #fff; margin-bottom: 1.1em; font-size: 1em; }
              th, td { border: 1px solid #e5e7eb; padding: 9px 10px; vertical-align: middle; }
              th { background: #6366f1; color: #fff; font-weight: 700; font-size: 1em; border-bottom: 3px solid #a5b4fc; }
              tr:nth-child(even) { background: #f3f4f6; }
              tr:nth-child(odd) { background: #fff; }
            </style>
          </head>
          <body>
            ${searchSummary}
            ${tableHTML}
          </body>
        </html>
      `);
      mywindow.document.close();
      mywindow.focus();
      mywindow.print();
      setTimeout(() => mywindow.close(), 500);
    }, 500);
  };

  // Enhanced sorting handler with feedback
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);

    toast((t) => (
      <div className="flex items-center">
        <ArrowUp className="w-4 h-4 mr-2" />
        Sorted by {column} ({sortOrder === 'asc' ? 'descending' : 'ascending'})
      </div>
    ), {
      duration: 1500,
    });
  };

  // Date change handlers with validation feedback
  const handleDateChange = (field, value) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
    
    if (field === 'fromDate' && searchParams.toDate && value && new Date(value) > new Date(searchParams.toDate)) {
      toast((t) => (
        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          From date cannot be later than To date
        </div>
      ), {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%)',
          color: '#ffffff',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1)',
        },
      });
    }
    
    if (field === 'toDate' && searchParams.fromDate && value && new Date(searchParams.fromDate) > new Date(value)) {
      toast((t) => (
        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          To date cannot be earlier than From date
        </div>
      ), {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%)',
          color: '#ffffff',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1)',
        },
      });
    }
  };

  // Render sort icon
  const renderSortIcon = (column) => {
    if (sortColumn !== column) return <ArrowUp className="w-3 h-3 text-gray-400 inline" />;
    return sortOrder === 'asc' ?
      <ArrowUp className="w-3 h-3 text-indigo-600 inline" /> :
      <ArrowDown className="w-3 h-3 text-indigo-600 inline" />;
  };

  // Sorting and pagination
  const sortedResults = [...searchResults].sort((a, b) => {
    let valA, valB;
    if (sortColumn === 'invoice_date') {
      valA = new Date(a.invoice_date || 0);
      valB = new Date(b.invoice_date || 0);
    } else if (sortColumn === 'total_amount' || sortColumn === 'vat_amount' || sortColumn === 'bill_total_with_vat') {
      valA = parseFloat(a[sortColumn]) || 0;
      valB = parseFloat(b[sortColumn]) || 0;
    } else {
      valA = a[sortColumn] ? a[sortColumn].toLowerCase() : '';
      valB = b[sortColumn] ? b[sortColumn].toLowerCase() : '';
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedResults.length / PAGE_SIZE);
  const paginatedResults = sortedResults.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const getTotalAmount = () => {
    return sortedResults.reduce((sum, item) => sum + parseFloat(item.bill_total_with_vat || 0), 0).toFixed(2);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchResults]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading purchase data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Toast Configuration */}
      <ToastConfig position="bottom-right" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              Purchase Search Management
            </h1>
            <p className="text-gray-600 mt-2">Search and filter purchase records by various criteria</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              disabled={sortedResults.length === 0}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Download className="w-5 h-5 mr-2" />
              Export CSV
            </button>
            <button
              onClick={handlePrint}
              disabled={sortedResults.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH PURCHASES
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Name
                </label>
                <Select
                  options={suppliers}
                  value={suppliers.find(option => option.value === searchParams.supplierName)}
                  onChange={(selectedOption) => handleInputChange('supplierName', selectedOption?.value || '')}
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
                  Job Number
                </label>
                <Select
                  options={jobNumbers}
                  value={jobNumbers.find(option => option.value === searchParams.jobNo)}
                  onChange={(selectedOption) => handleInputChange('jobNo', selectedOption?.value || '')}
                  placeholder="Select Job Number"
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
                  From Date
                </label>
                <input
                  type="date"
                  value={searchParams.fromDate}
                  onChange={(e) => handleDateChange('fromDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={searchParams.toDate}
                  onChange={(e) => handleDateChange('toDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center transition-all"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </button>
              <button
                onClick={handleSearch}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Purchase Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Purchase Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">SAR {getTotalAmount()}</span>
            </div>
          </div>
        </div>

        {/* Purchase Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'SL.No', key: null },
                    { label: 'Job Number', key: 'job_number' },
                    { label: 'Supplier Name', key: 'supplier_name' },
                    { label: 'Invoice No', key: 'supplier_invoice_no' },
                    { label: 'Invoice Date', key: 'invoice_date' },
                    { label: 'Bill Amt Without VAT', key: 'total_amount' },
                    { label: 'VAT Amount', key: 'vat_amount' },
                    { label: 'Bill Amount', key: 'bill_total_with_vat' },
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
                {paginatedResults.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No purchase records found</h4>
                        <p className="text-gray-400 mt-2">
                          {hasSearched ? 'Try adjusting your search criteria' : 'Use the search filters above to find purchases'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedResults.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {((currentPage - 1) * PAGE_SIZE) + index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.job_number}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.supplier_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.supplier_invoice_no}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.invoice_date ? item.invoice_date.substring(0, 10) : ''}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        SAR {formatNumber(item.total_amount)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        SAR {formatNumber(item.vat_amount)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600 text-right">
                        SAR {formatNumber(item.bill_total_with_vat)}
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
                Showing {((currentPage - 1) * PAGE_SIZE) + 1} to{' '}
                {Math.min(currentPage * PAGE_SIZE, sortedResults.length)} of {sortedResults.length} purchases
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
                Total: <span className="text-green-600 font-bold">SAR {getTotalAmount()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseSearch;
