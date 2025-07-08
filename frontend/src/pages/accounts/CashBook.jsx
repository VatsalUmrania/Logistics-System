import React, { useState, useEffect } from 'react';
import {
  Wallet, Calendar, Filter, Download, RefreshCw, TrendingUp,
  TrendingDown, DollarSign, FileText, Search, ChevronLeft, ChevronRight
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';

const CashBookPage = () => {
  // State management
  const [transactions, setTransactions] = useState([]);
  const [cashAccounts, setCashAccounts] = useState([]);
  const [summary, setSummary] = useState({
    opening_balance: 0,
    total_receipts: 0,
    total_payments: 0,
    net_cash_flow: 0,
    closing_balance: 0,
    total_transactions: 0,
    receipt_count: 0,
    payment_count: 0
  });
  const [dailySummary, setDailySummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
    cashAccountId: '',
    transactionType: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 20;

  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

  // Auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    };
  };

  // Fetch cash accounts
  const fetchCashAccounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cash-book/accounts`, getAuthHeaders());
      if (response.data.success) {
        setCashAccounts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cash accounts:', error);
      toast.error('Failed to load cash accounts');
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        startDate: filters.startDate.toISOString().split('T')[0],
        endDate: filters.endDate.toISOString().split('T')[0],
        cashAccountId: filters.cashAccountId || undefined,
        transactionType: filters.transactionType !== 'all' ? filters.transactionType : undefined,
        page: currentPage,
        limit: itemsPerPage
      };

      const response = await axios.get(`${API_BASE_URL}/cash-book/transactions`, {
        ...getAuthHeaders(),
        params
      });

      if (response.data.success) {
        setTransactions(response.data.data.transactions);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch summary
  const fetchSummary = async () => {
    try {
      const params = {
        startDate: filters.startDate.toISOString().split('T')[0],
        endDate: filters.endDate.toISOString().split('T')[0],
        cashAccountId: filters.cashAccountId || undefined
      };

      const response = await axios.get(`${API_BASE_URL}/cash-book/summary`, {
        ...getAuthHeaders(),
        params
      });

      if (response.data.success) {
        setSummary(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      toast.error('Failed to load summary');
    }
  };

  // Fetch daily summary
  const fetchDailySummary = async () => {
    try {
      const params = {
        startDate: filters.startDate.toISOString().split('T')[0],
        endDate: filters.endDate.toISOString().split('T')[0],
        cashAccountId: filters.cashAccountId || undefined
      };

      const response = await axios.get(`${API_BASE_URL}/cash-book/daily-summary`, {
        ...getAuthHeaders(),
        params
      });

      if (response.data.success) {
        setDailySummary(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching daily summary:', error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCashAccounts();
  }, []);

  // Load data when filters change
  useEffect(() => {
    fetchTransactions();
    fetchSummary();
    fetchDailySummary();
  }, [filters, currentPage]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  // Refresh data
  const handleRefresh = () => {
    fetchTransactions();
    fetchSummary();
    fetchDailySummary();
    toast.success('Data refreshed successfully');
  };

  // Export to CSV
  const handleExport = () => {
    const csvData = transactions.map(transaction => ({
      Date: new Date(transaction.transaction_date).toLocaleDateString(),
      'Voucher No': transaction.voucher_no || '',
      Description: transaction.description,
      'Counter Party': transaction.counter_party,
      'Receipt Amount': transaction.credit_amount || '',
      'Payment Amount': transaction.debit_amount || '',
      'Running Balance': transaction.running_balance
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cash-book-${filters.startDate.toISOString().split('T')[0]}-to-${filters.endDate.toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Wallet className="w-8 h-8 mr-3 text-indigo-600" />
              CASH BOOK
            </h1>
            <p className="text-gray-600 mt-2">Track all cash receipts and payments</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all flex items-center shadow-md"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex items-center shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all flex items-center shadow-md"
            >
              <Download className="w-5 h-5 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <DatePicker
                  selected={filters.startDate}
                  onChange={(date) => handleFilterChange('startDate', date)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <DatePicker
                  selected={filters.endDate}
                  onChange={(date) => handleFilterChange('endDate', date)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cash Account</label>
                <select
                  value={filters.cashAccountId}
                  onChange={(e) => handleFilterChange('cashAccountId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Cash Accounts</option>
                  {cashAccounts.map(account => (
                    <option key={account.cash_sub_account_id} value={account.cash_sub_account_id}>
                      {account.account_head} - {account.sub_account_head}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                <select
                  value={filters.transactionType}
                  onChange={(e) => handleFilterChange('transactionType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Transactions</option>
                  <option value="receipts">Receipts Only</option>
                  <option value="payments">Payments Only</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Opening Balance</p>
                <p className="text-2xl font-bold text-blue-600">
                  SAR {summary.opening_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Receipts</p>
                <p className="text-2xl font-bold text-green-600">
                  SAR {summary.total_receipts.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500">{summary.receipt_count} transactions</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-red-600">
                  SAR {summary.total_payments.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500">{summary.payment_count} transactions</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Closing Balance</p>
                <p className={`text-2xl font-bold ${summary.closing_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  SAR {Math.abs(summary.closing_balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500">
                  Net: SAR {summary.net_cash_flow.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Wallet className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Cash Book Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-indigo-600 text-white text-sm font-semibold">
                <tr>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Voucher No</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">Counter Party</th>
                  <th className="px-6 py-3 text-right">Receipt</th>
                  <th className="px-6 py-3 text-right">Payment</th>
                  <th className="px-6 py-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mr-3"></div>
                        Loading transactions...
                      </div>
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      No transactions found for the selected period
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-900">
                        {new Date(transaction.transaction_date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {transaction.voucher_no || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-900 max-w-xs">
                        <div className="truncate" title={transaction.description}>
                          {transaction.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm max-w-xs">
                        <div className="truncate" title={transaction.counter_party}>
                          {transaction.counter_party || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">
                        {transaction.credit_amount > 0 ? 
                          `SAR ${parseFloat(transaction.credit_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 
                          '-'
                        }
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-red-600">
                        {transaction.debit_amount > 0 ? 
                          `SAR ${parseFloat(transaction.debit_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 
                          '-'
                        }
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        SAR {parseFloat(transaction.running_balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        <div className="text-xs text-gray-500">
                          {transaction.balance_type}
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
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
                  title="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
                  title="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Configuration */}
      <ToastConfig />
    </div>
  );
};

export default CashBookPage;
