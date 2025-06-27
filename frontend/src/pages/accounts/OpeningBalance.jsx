import React, { useState, useEffect } from 'react';
import {
  Calculator, Plus, X, Save, ChevronDown, Search, 
  ChevronLeft, ChevronRight, Pencil, Trash2, DollarSign
} from 'lucide-react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Auth header utility
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error("Authentication token missing - redirecting to login");
    window.location.href = '/login';
    return {};
  }
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

const OpeningBalancePage = () => {
  // State management
  const [openingBalances, setOpeningBalances] = useState([]);
  const [accountHeads, setAccountHeads] = useState([]);
  const [subAccountHeads, setSubAccountHeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newBalance, setNewBalance] = useState({
    accountHead: '',
    subAccountHead: '',
    date: new Date(),
    type: '',
    amount: ''
  });
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const itemsPerPage = 8;

  // Mock data for account heads (replace with API call)
  const mockAccountHeads = [
    'Current Asset',
    'Loans And Advances(Asset)',
    'Account Receivable',
    'Account Payable',
    'Cash In Hand',
    'Current Liability',
    'Capital Account',
    'Bank Account',
    'Fixed Asset',
    'Investment',
    'Loans(Liability)',
    'Misc. Expense(Asset)',
    'Provisions',
    'Reserve And Surplus',
    'Stock In Hand',
    'Direct Income',
    'Indirect Income',
    'Direct Expense',
    'Indirect Expense',
    'Sales Accounts',
    'Purchase Accounts',
    'Duties And Taxes',
    'Intangible Asset',
    'Prepaid Expense',
    'Cash With Bank',
    'Vehicles',
    'Other Assets',
    'Retained Earnings',
    'Accrued Expense',
    'Salary Outstanding',
    'Cost Of Services',
    'Employee Related Expenses',
    'Other Expenses',
    'UTILITY EXPENSES',
    'OPERATING EXPENSES',
    'Communication Expenses',
    'Vehicle Related Expenses',
    'Short Term Loan(Credit)',
    'Current Account',
    'Petro Expenses',
    'LONG TERM LIABILITIES',
    'EMPLOYEE RECEIVABLES'
  ];

  const typeOptions = ['Debit', 'Credit'];

  // Initialize data
  useEffect(() => {
    setAccountHeads(mockAccountHeads);
    // Mock opening balances data
    setOpeningBalances([
      {
        id: 1,
        accountHead: 'Cash In Hand',
        subAccountHead: 'Petty Cash',
        date: '2025-01-01',
        type: 'Debit',
        amount: 5000.00
      },
      {
        id: 2,
        accountHead: 'Bank Account',
        subAccountHead: 'Al Rajhi Bank',
        date: '2025-01-01',
        type: 'Debit',
        amount: 150000.00
      }
    ]);
  }, []);

  // Handle account head change to load sub accounts
  const handleAccountHeadChange = (accountHead) => {
    setNewBalance({ ...newBalance, accountHead, subAccountHead: '' });
    // Mock sub account heads based on account head
    const mockSubAccounts = [
      'Sub Account 1',
      'Sub Account 2',
      'Sub Account 3'
    ];
    setSubAccountHeads(mockSubAccounts);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!newBalance.accountHead || !newBalance.subAccountHead || !newBalance.type || !newBalance.amount) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingId) {
        // Update existing
        setOpeningBalances(prev => prev.map(item => 
          item.id === editingId 
            ? { 
                ...item, 
                ...newBalance,
                date: newBalance.date.toISOString().split('T')[0],
                amount: parseFloat(newBalance.amount)
              }
            : item
        ));
        setSuccess('Opening Balance updated successfully!');
      } else {
        // Add new
        const newId = Math.max(...openingBalances.map(item => item.id), 0) + 1;
        setOpeningBalances(prev => [...prev, { 
          id: newId, 
          ...newBalance,
          date: newBalance.date.toISOString().split('T')[0],
          amount: parseFloat(newBalance.amount)
        }]);
        setSuccess('Opening Balance added successfully!');
      }
      
      // Reset form
      setIsAdding(false);
      setEditingId(null);
      setNewBalance({
        accountHead: '',
        subAccountHead: '',
        date: new Date(),
        type: '',
        amount: ''
      });
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save Opening Balance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setNewBalance({
      accountHead: item.accountHead,
      subAccountHead: item.subAccountHead,
      date: new Date(item.date),
      type: item.type,
      amount: item.amount.toString()
    });
    setEditingId(item.id);
    setIsAdding(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Opening Balance entry?')) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setOpeningBalances(prev => prev.filter(item => item.id !== id));
      setSuccess('Opening Balance deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete Opening Balance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort data
  const filteredData = openingBalances.filter(item =>
    item.accountHead.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subAccountHead.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField]?.toString().toLowerCase() || '';
    const bValue = b[sortField]?.toString().toLowerCase() || '';
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate totals
  const totalDebit = openingBalances.filter(item => item.type === 'Debit').reduce((sum, item) => sum + item.amount, 0);
  const totalCredit = openingBalances.filter(item => item.type === 'Credit').reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Calculator className="w-8 h-8 mr-3 text-indigo-600" />
              OPENING BALANCE
            </h1>
            <p className="text-gray-600 mt-2">Manage opening balances for your accounting system</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search balances..."
                  className="bg-transparent outline-none w-40"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <button
              onClick={() => {
                setIsAdding(!isAdding);
                setEditingId(null);
                setNewBalance({
                  accountHead: '',
                  subAccountHead: '',
                  date: new Date(),
                  type: '',
                  amount: ''
                });
                setError('');
              }}
              className={`px-5 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md ${
                isAdding
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
              }`}
            >
              {isAdding ? (
                <>
                  <X className="w-5 h-5 mr-2" />
                  Close
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Add Opening Balance
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <X className="w-3 h-3 text-white" />
            </div>
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Debit</p>
                <p className="text-2xl font-bold text-green-600">
                  SAR {totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Credit</p>
                <p className="text-2xl font-bold text-red-600">
                  SAR {totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Balance</p>
                <p className={`text-2xl font-bold ${totalDebit - totalCredit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  SAR {Math.abs(totalDebit - totalCredit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Calculator className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                {editingId ? 'Edit Opening Balance' : 'Add Opening Balance'}
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Account Head */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Head <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={newBalance.accountHead}
                    onChange={(e) => handleAccountHeadChange(e.target.value)}
                  >
                    <option value="">--Select--</option>
                    {accountHeads.map(head => (
                      <option key={head} value={head}>{head}</option>
                    ))}
                  </select>
                </div>

                {/* Sub Account Head */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Account Head <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={newBalance.subAccountHead}
                    onChange={(e) => setNewBalance({ ...newBalance, subAccountHead: e.target.value })}
                    disabled={!newBalance.accountHead}
                  >
                    <option value="">--Select--</option>
                    {subAccountHeads.map(subHead => (
                      <option key={subHead} value={subHead}>{subHead}</option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={newBalance.date}
                    onChange={(date) => setNewBalance({ ...newBalance, date })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={newBalance.type}
                    onChange={(e) => setNewBalance({ ...newBalance, type: e.target.value })}
                  >
                    <option value="">Select</option>
                    {typeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={newBalance.amount}
                    onChange={(e) => setNewBalance({ ...newBalance, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition flex items-center disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingId ? 'Update' : 'Save'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-indigo-600 text-white text-sm font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">Sl.No</th>
                <th 
                  className="px-6 py-3 text-left cursor-pointer hover:bg-indigo-700"
                  onClick={() => handleSort('accountHead')}
                >
                  <div className="flex items-center">
                    Account Head
                    {sortField === 'accountHead' && (
                      <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left">Sub Account Head</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    <Calculator className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    No opening balance entries found
                    {searchTerm && (
                      <div className="mt-2 text-sm text-gray-400">
                        Try adjusting your search criteria
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-center text-gray-900 font-medium">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{item.accountHead}</td>
                    <td className="px-6 py-4 text-gray-900">{item.subAccountHead}</td>
                    <td className="px-6 py-4 text-gray-900">
                      {new Date(item.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.type === 'Debit' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      SAR {item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 flex space-x-3">
                      <button
                        onClick={() => handleEdit(item)}
                        title="Edit"
                        className="text-indigo-600 hover:text-indigo-800 transition"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {sortedData.length > itemsPerPage && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedData.length)} of {sortedData.length} results
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
                  disabled={currentPage === totalPages || totalPages === 0}
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
    </div>
  );
};

export default OpeningBalancePage;
