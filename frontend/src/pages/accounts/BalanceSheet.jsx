import React, { useState, useEffect } from 'react';
import { 
  Calculator, Search, Printer, Calendar, ChevronLeft, ChevronRight,
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert
} from 'lucide-react';
import Select from 'react-select';

const BalanceSheet = () => {
  // State management
  const [fromDate, setFromDate] = useState('2025-06-17');
  const [toDate, setToDate] = useState('2025-06-19');
  const [balanceSheetData, setBalanceSheetData] = useState({
    assets: [],
    liabilities: [],
    equity: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [sortField, setSortField] = useState('account');
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

  // Mock balance sheet data based on your image
  const mockBalanceSheetData = {
    assets: [
      {
        id: 1,
        category: 'Account Receivable',
        accounts: [
          { name: 'RAWAFID SYSTEMS FOR CONTRACTING , TRADING AND INDUSTRY CO LTD', amount: 0.00 },
          { name: 'HASHIM USMAN AL MAIMANY TRADING(شركة هاشم عثمان الميماني التجارية)', amount: 0.00 },
          { name: 'INSTRUMENTATION & CONTROL CO. LTD', amount: 0.00 },
          { name: 'SIGNCITY TRADING EST', amount: 0.00 }
        ]
      },
      {
        id: 2,
        category: 'Current Asset',
        accounts: [
          { name: 'Cash in Hand', amount: 15000.00 },
          { name: 'Bank Account - RIYAD BANK', amount: 25000.00 },
          { name: 'Petty Cash', amount: 2500.00 }
        ]
      },
      {
        id: 3,
        category: 'Fixed Asset',
        accounts: [
          { name: 'Office Equipment', amount: 50000.00 },
          { name: 'Computer & Software', amount: 30000.00 },
          { name: 'Furniture & Fixtures', amount: 20000.00 }
        ]
      }
    ],
    liabilities: [
      {
        id: 1,
        category: 'Current Liability',
        accounts: [
          { name: 'Accounts Payable', amount: 8500.00 },
          { name: 'Accrued Expenses', amount: 3200.00 },
          { name: 'Short Term Loans', amount: 15000.00 }
        ]
      },
      {
        id: 2,
        category: 'Long Term Liability',
        accounts: [
          { name: 'Bank Loan', amount: 75000.00 },
          { name: 'Equipment Financing', amount: 25000.00 }
        ]
      }
    ],
    equity: [
      {
        id: 1,
        category: 'Owner\'s Equity',
        accounts: [
          { name: 'Capital Account', amount: 100000.00 },
          { name: 'Retained Earnings', amount: 15800.00 },
          { name: 'Current Year Profit', amount: 8500.00 }
        ]
      }
    ]
  };

  // Initialize data
  useEffect(() => {
    setBalanceSheetData(mockBalanceSheetData);
  }, []);

  // Search handler
  const handleSearch = async () => {
    if (!fromDate || !toDate) {
      setError('Please select both From and To dates');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      console.log('Generating balance sheet for:', { fromDate, toDate });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBalanceSheetData(mockBalanceSheetData);
      setSuccessMessage(`Balance sheet generated successfully for ${fromDate} to ${toDate}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Failed to generate balance sheet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Calculate totals
  const getTotalAssets = () => {
    return balanceSheetData.assets.reduce((total, category) => 
      total + category.accounts.reduce((sum, account) => sum + account.amount, 0), 0
    );
  };

  const getTotalLiabilities = () => {
    return balanceSheetData.liabilities.reduce((total, category) => 
      total + category.accounts.reduce((sum, account) => sum + account.amount, 0), 0
    );
  };

  const getTotalEquity = () => {
    return balanceSheetData.equity.reduce((total, category) => 
      total + category.accounts.reduce((sum, account) => sum + account.amount, 0), 0
    );
  };

  const getTotalLiabilitiesAndEquity = () => {
    return getTotalLiabilities() + getTotalEquity();
  };

  // Render account section
  const renderAccountSection = (title, categories, isAssets = false) => (
    <div className="mb-6">
      <div className="bg-indigo-100 px-4 py-2 border-b border-gray-300">
        <h3 className="font-bold text-indigo-800 uppercase">{title}</h3>
      </div>
      {categories.map((category) => (
        <div key={category.id}>
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
            <h4 className="font-semibold text-gray-700">{category.category}</h4>
          </div>
          {category.accounts.map((account, index) => (
            <div key={index} className="flex justify-between items-center px-4 py-2 border-b border-gray-100 hover:bg-gray-50">
              <span className="text-sm text-gray-800 flex-1">{account.name}</span>
              <span className="text-sm font-medium text-gray-900 text-right min-w-[100px]">
                {account.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total {category.category}</span>
              <span className="font-bold text-gray-900">
                {category.accounts.reduce((sum, account) => sum + account.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      ))}
      <div className="bg-indigo-50 px-4 py-3 border-b-2 border-indigo-200">
        <div className="flex justify-between items-center">
          <span className="font-bold text-indigo-800">TOTAL {title.toUpperCase()}</span>
          <span className="font-bold text-indigo-900 text-lg">
            {isAssets ? getTotalAssets().toLocaleString('en-US', { minimumFractionDigits: 2 }) :
             title === 'LIABILITIES' ? getTotalLiabilities().toLocaleString('en-US', { minimumFractionDigits: 2 }) :
             getTotalEquity().toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Matching AssignExpenses */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <Calculator className="w-8 h-8 mr-3 text-indigo-600" />
              Balance Sheet
            </h1>
            <p className="text-gray-600 mt-2">Financial position statement</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center shadow-md"
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
              SEARCH BY DATE
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
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
                  {isLoading ? 'Generating...' : 'Search'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Date Range Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Date: {new Date(fromDate).toLocaleDateString('en-GB')} to {new Date(toDate).toLocaleDateString('en-GB')}
            </h2>
          </div>
        </div>

        {/* Balance Sheet Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Assets Column */}
            <div className="border-r border-gray-200">
              {renderAccountSection('ASSETS', balanceSheetData.assets, true)}
            </div>

            {/* Liabilities and Equity Column */}
            <div>
              {renderAccountSection('LIABILITIES', balanceSheetData.liabilities)}
              {renderAccountSection('EQUITY', balanceSheetData.equity)}
              
              {/* Total Liabilities and Equity */}
              <div className="bg-blue-100 px-4 py-3 border-t-2 border-blue-300">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-800">TOTAL LIABILITIES AND EQUITY</span>
                  <span className="font-bold text-blue-900 text-lg">
                    {getTotalLiabilitiesAndEquity().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Balance Verification */}
          <div className="bg-gray-100 px-4 py-4 border-t border-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Assets</h3>
                <p className="text-xl font-bold text-blue-600">
                  {getTotalAssets().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Liabilities & Equity</h3>
                <p className="text-xl font-bold text-green-600">
                  {getTotalLiabilitiesAndEquity().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Balance Check</h3>
                <p className={`text-xl font-bold ${
                  Math.abs(getTotalAssets() - getTotalLiabilitiesAndEquity()) < 0.01 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {Math.abs(getTotalAssets() - getTotalLiabilitiesAndEquity()) < 0.01 ? 'BALANCED' : 'UNBALANCED'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
