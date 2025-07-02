import React, { useState, useEffect } from 'react';
import {
  FolderOpen, Plus, X, Pencil, Trash2, ChevronDown, Search,
  ChevronLeft, ChevronRight, Save, Building2
} from 'lucide-react';
import axios from 'axios';

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

const SubAccountHeadPage = () => {
  // State management
  const [subAccountHeads, setSubAccountHeads] = useState([]);
  const [accountHeads, setAccountHeads] = useState([
    'Account Receivable',
    'Account Payable',
    'Cash',
    'Bank',
    'Inventory',
    'Fixed Assets'
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newSubAccount, setNewSubAccount] = useState({
    accountHead: '',
    subAccountHead: ''
  });
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const itemsPerPage = 8;

  // Mock data - replace with actual API calls
  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL, getAuthHeaders());
      const formatted = res.data.map(item => ({
        id: item.id,
        accountHead: item.account_head,
        subAccountHead: item.sub_account_head
      }));
      setSubAccountHeads(formatted);

    } catch (err) {
      setError('Failed to load Sub Account Heads');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

const BASE_URL = 'http://localhost:5000/api/sub-account-head';

  // Handle form submission
  const handleSubmit = async () => {
  if (!newSubAccount.accountHead.trim() || !newSubAccount.subAccountHead.trim()) {
    setError('Please fill in all required fields');
    return;
  }

  setLoading(true);
  setError('');
  try {
    if (editingId) {
      // PUT request to update
      await axios.put(`${BASE_URL}/${editingId}`, {
  account_head: newSubAccount.accountHead,
  sub_account_head: newSubAccount.subAccountHead
}, getAuthHeaders());

      setSuccess('Sub Account Head updated successfully!');
    } else {
      // POST request to create
      await axios.post(BASE_URL, {
  account_head: newSubAccount.accountHead,
  sub_account_head: newSubAccount.subAccountHead
}, getAuthHeaders());

      setSuccess('Sub Account Head added successfully!');
    }

    // Refetch list
    const res = await axios.get(BASE_URL, getAuthHeaders());

    setSubAccountHeads(res.data);

    // Reset form
    setIsAdding(false);
    setEditingId(null);
    setNewSubAccount({ accountHead: '', subAccountHead: '' });
    setTimeout(() => setSuccess(''), 5000);
  } catch (err) {
    setError('Failed to save Sub Account Head. Please try again.');
  } finally {
    setLoading(false);
  }
};


  // Handle edit
  const handleEdit = (item) => {
    setNewSubAccount({
      accountHead: item.accountHead,
      subAccountHead: item.subAccountHead
    });
    setEditingId(item.id);
    setIsAdding(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Sub Account Head?')) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await axios.delete(`${BASE_URL}/${id}`, getAuthHeaders());
      const res = await axios.get(BASE_URL, getAuthHeaders());
      setSubAccountHeads(res.data);

      setSuccess('Sub Account Head deleted successfully!');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError('Failed to delete Sub Account Head. Please try again.');
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
  const filteredData = Array.isArray(subAccountHeads)
  ? subAccountHeads.filter(item =>
      (item.subAccountHead?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.accountHead?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )
  : [];


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
              <FolderOpen className="w-8 h-8 mr-3 text-indigo-600" />
              SUB ACCOUNT HEADS
            </h1>
            <p className="text-gray-600 mt-2">Manage sub account heads for your accounting system</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search sub accounts..."
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
                setNewSubAccount({ accountHead: '', subAccountHead: '' });
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
                  Add Sub Account Head
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

        {/* Add/Edit Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                {editingId ? 'Edit Sub Account Head' : 'Add Sub Account Head'}
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Head Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Account Head <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={newSubAccount.accountHead}
                    onChange={(e) => setNewSubAccount({ ...newSubAccount, accountHead: e.target.value })}
                  >
                    <option value="">Choose Account Head</option>
                    {accountHeads.map(head => (
                      <option key={head} value={head}>{head}</option>
                    ))}
                  </select>
                </div>

                {/* Sub Account Head Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Account Head <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Sub Account Head"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={newSubAccount.subAccountHead}
                    onChange={(e) => setNewSubAccount({ ...newSubAccount, subAccountHead: e.target.value })}
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
                <th 
                  className="px-6 py-3 text-left cursor-pointer hover:bg-indigo-700"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    Sl.No
                    {sortField === 'id' && (
                      <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
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
                <th 
                  className="px-6 py-3 text-left cursor-pointer hover:bg-indigo-700"
                  onClick={() => handleSort('subAccountHead')}
                >
                  <div className="flex items-center">
                    Sub Account Head
                    {sortField === 'subAccountHead' && (
                      <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    <FolderOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    No sub account heads found
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
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.accountHead === 'Account Receivable' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.accountHead}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{item.subAccountHead}</td>
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

export default SubAccountHeadPage;
