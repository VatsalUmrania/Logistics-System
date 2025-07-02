import React, { useState, useEffect } from 'react';
import {
  BookOpen, Plus, X, Save, Trash2, Calculator, 
  ChevronDown, Search, ChevronLeft, ChevronRight
} from 'lucide-react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
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

const JournalVoucherPage = () => {
  // State management
  const [journalVouchers, setJournalVouchers] = useState([]);
  const [accountHeads, setAccountHeads] = useState([]);
  const [subAccounts, setSubAccounts] = useState({});
  const [paymentTypes, setPaymentTypes] = useState(['Cash', 'Bank Transfer', 'Check', 'Credit Card']);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form state
  const [voucherData, setVoucherData] = useState({
    date: new Date(),
    voucherNo: '',
    paymentType: ''
  });
  
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    debitAccountHead: '',
    debitAccount: '',
    creditAccountHead: '',
    creditAccount: '',
    amount: '',
    remarks: ''
  });
  
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const itemsPerPage = 8;

  // Mock data initialization
  useEffect(() => {
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
      'Investment'
    ];
    
    const mockSubAccounts = {
      'Current Asset': ['Select', 'Inventory', 'Prepaid Expenses'],
      'Cash In Hand': ['Select', 'Cash', 'Petty Cash - BAJER ALI', 'Petty Cash Saheer', 'Petty Cash Mureed', 'PETTY CASH SIDDHIQUE', 'PETTY CASH ABDUL HAMEED LAJAMI', 'PETTY CASH IN INSPECTION'],
      'Current Liability': ['Select', 'VAT SETTLEMENT'],
      'Account Receivable': ['Select', 'Trade Debtors', 'Other Receivables'],
      'Account Payable': ['Select', 'Trade Creditors', 'Other Payables'],
      'Bank Account': ['Select', 'Al Rajhi Bank', 'SABB Bank', 'NCB Bank']
    };
    
    setAccountHeads(mockAccountHeads);
    setSubAccounts(mockSubAccounts);
    
    // Generate next voucher number
    const nextVoucherNo = `JV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
    setVoucherData(prev => ({ ...prev, voucherNo: nextVoucherNo }));
  }, []);

  // Handle account head change
  const handleAccountHeadChange = (field, value) => {
    setCurrentEntry(prev => ({
      ...prev,
      [field]: value,
      [field.replace('Head', '')]: '' // Reset sub account when head changes
    }));
  };

  // Add entry to the list
  const handleAddEntry = () => {
    if (!currentEntry.debitAccountHead || !currentEntry.debitAccount || 
        !currentEntry.creditAccountHead || !currentEntry.creditAccount || 
        !currentEntry.amount) {
      setError('Please fill in all required fields for the entry');
      return;
    }

    const newEntry = {
      id: Date.now(),
      ...currentEntry,
      amount: parseFloat(currentEntry.amount)
    };

    setEntries(prev => [...prev, newEntry]);
    setCurrentEntry({
      debitAccountHead: '',
      debitAccount: '',
      creditAccountHead: '',
      creditAccount: '',
      amount: '',
      remarks: ''
    });
    setError('');
  };

  // Remove entry from list
  const handleRemoveEntry = (id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  // Calculate total amount
  const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);

  // Handle form submission
  const handleSubmit = async () => {
    if (!voucherData.date || !voucherData.voucherNo || !voucherData.paymentType) {
      setError('Please fill in all voucher details');
      return;
    }

    if (entries.length === 0) {
      setError('Please add at least one journal entry');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newVoucher = {
        id: Date.now(),
        ...voucherData,
        date: voucherData.date.toISOString().split('T')[0],
        entries: [...entries],
        totalAmount,
        createdAt: new Date().toISOString()
      };

      if (editingId) {
        setJournalVouchers(prev => prev.map(item => 
          item.id === editingId ? newVoucher : item
        ));
        setSuccess('Journal Voucher updated successfully!');
      } else {
        setJournalVouchers(prev => [...prev, newVoucher]);
        setSuccess('Journal Voucher created successfully!');
      }
      
      // Reset form
      setIsAdding(false);
      setEditingId(null);
      setVoucherData({
        date: new Date(),
        voucherNo: `JV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
        paymentType: ''
      });
      setEntries([]);
      setCurrentEntry({
        debitAccountHead: '',
        debitAccount: '',
        creditAccountHead: '',
        creditAccount: '',
        amount: '',
        remarks: ''
      });
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save Journal Voucher. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort data
  const filteredData = journalVouchers.filter(item =>
    item.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.paymentType.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-indigo-600" />
              JOURNAL VOUCHER
            </h1>
            <p className="text-gray-600 mt-2">Create and manage journal vouchers for accounting entries</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search vouchers..."
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
                setError('');
                if (!isAdding) {
                  const nextVoucherNo = `JV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
                  setVoucherData({
                    date: new Date(),
                    voucherNo: nextVoucherNo,
                    paymentType: ''
                  });
                  setEntries([]);
                }
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
                  Create Voucher
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

        {/* Create/Edit Form */}
        {isAdding && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Panel - Voucher Details */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Voucher Details
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={voucherData.date}
                    onChange={(date) => setVoucherData({ ...voucherData, date })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voucher No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={voucherData.voucherNo}
                    onChange={(e) => setVoucherData({ ...voucherData, voucherNo: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={voucherData.paymentType}
                    onChange={(e) => setVoucherData({ ...voucherData, paymentType: e.target.value })}
                  >
                    <option value="">Select</option>
                    {paymentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Right Panel - Journal Entries */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Journal Entries
                </h2>
              </div>
              <div className="p-6">
                {/* Entry Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Debit Account Head <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      value={currentEntry.debitAccountHead}
                      onChange={(e) => handleAccountHeadChange('debitAccountHead', e.target.value)}
                    >
                      <option value="">Select</option>
                      {accountHeads.map(head => (
                        <option key={head} value={head}>{head}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Debit Account <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      value={currentEntry.debitAccount}
                      onChange={(e) => setCurrentEntry({ ...currentEntry, debitAccount: e.target.value })}
                      disabled={!currentEntry.debitAccountHead}
                    >
                      <option value="">Select</option>
                      {(subAccounts[currentEntry.debitAccountHead] || []).map(account => (
                        <option key={account} value={account}>{account}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credit Account Head <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      value={currentEntry.creditAccountHead}
                      onChange={(e) => handleAccountHeadChange('creditAccountHead', e.target.value)}
                    >
                      <option value="">Select</option>
                      {accountHeads.map(head => (
                        <option key={head} value={head}>{head}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credit Account <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      value={currentEntry.creditAccount}
                      onChange={(e) => setCurrentEntry({ ...currentEntry, creditAccount: e.target.value })}
                      disabled={!currentEntry.creditAccountHead}
                    >
                      <option value="">Select</option>
                      {(subAccounts[currentEntry.creditAccountHead] || []).map(account => (
                        <option key={account} value={account}>{account}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      value={currentEntry.amount}
                      onChange={(e) => setCurrentEntry({ ...currentEntry, amount: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remarks
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      value={currentEntry.remarks}
                      onChange={(e) => setCurrentEntry({ ...currentEntry, remarks: e.target.value })}
                      placeholder="Optional remarks"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mb-6">
                  <button
                    onClick={handleAddEntry}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Entry
                  </button>
                </div>

                {/* Entries Table */}
                {entries.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Debit Account</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Credit Account</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Amount</th>
                          <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map((entry) => (
                          <tr key={entry.id} className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm text-gray-900">{entry.debitAccount}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{entry.creditAccount}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{entry.remarks || '-'}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">
                              SAR {entry.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                onClick={() => handleRemoveEntry(entry.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Remove Entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t-2 border-gray-300 bg-gray-50">
                          <td colSpan={3} className="px-4 py-2 text-sm font-bold text-gray-900">Total Amount</td>
                          <td className="px-4 py-2 text-sm font-bold text-gray-900 text-right">
                            SAR {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={loading || entries.length === 0}
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
                        Submit Voucher
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vouchers List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Journal Vouchers</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-indigo-600 text-white text-sm font-semibold">
                <tr>
                  <th className="px-6 py-3 text-left">Sl.No</th>
                  <th className="px-6 py-3 text-left">Voucher No</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Payment Type</th>
                  <th className="px-6 py-3 text-right">Total Amount</th>
                  <th className="px-6 py-3 text-center">Entries</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      No journal vouchers found
                      {searchTerm && (
                        <div className="mt-2 text-sm text-gray-400">
                          Try adjusting your search criteria
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  currentItems.map((voucher, index) => (
                    <tr key={voucher.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-center text-gray-900 font-medium">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{voucher.voucherNo}</td>
                      <td className="px-6 py-4 text-gray-900">
                        {new Date(voucher.date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {voucher.paymentType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        SAR {voucher.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {voucher.entries.length} entries
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

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

export default JournalVoucherPage;
