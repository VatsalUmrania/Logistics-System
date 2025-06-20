import React, { useState, useEffect } from 'react';
import {
  Package, Search, Plus, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Pencil, Trash2, AlertCircle, CheckCircle
} from 'lucide-react';

const CommodityManagementPage = () => {
  const [commodities, setCommodities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCommodity, setNewCommodity] = useState({ name: '', category_sino: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const itemsPerPage = 10;
  const [isAdding, setIsAdding] = useState(false);

  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch categories from database
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required to fetch categories');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      const activeCategories = data.filter(cat => cat.status === 'Active');
      setCategories(activeCategories);
    } catch (err) {
      setError('Failed to load categories');
    }
  };

  // Fetch commodities from database
  const fetchCommodities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required to fetch commodities');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/commodities`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch commodities');
      const data = await response.json();
      setCommodities(data);
    } catch (err) {
      setError('Failed to load commodities');
    } finally {
      setLoading(false);
    }
  };

  const addCommodity = async (commodityData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required to add commodity');
        return false;
      }
      const response = await fetch(`${API_BASE_URL}/commodities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(commodityData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add commodity');
      }
      const newCommodity = await response.json();
      setCommodities(prev => [...prev, newCommodity]);
      setSuccess('Commodity added successfully!');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to add commodity');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCommodity = async (id, commodityData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication token missing. Please login again.');
        return false;
      }
      const response = await fetch(`${API_BASE_URL}/commodities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(commodityData),
      });
      if (!response.ok) {
        let errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          errorText = errorJson.message || errorText;
        } catch (_) {}
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      const updatedCommodity = await response.json();
      setCommodities(prev => prev.map(c => c.id === id ? updatedCommodity : c));
      setSuccess('Commodity updated successfully!');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update commodity');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCommodity = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication token missing. Please login again.');
        return false;
      }
      const response = await fetch(`${API_BASE_URL}/commodities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete commodity');
      }
      setCommodities(prev => prev.filter(c => c.id !== id));
      setSuccess('Commodity deleted successfully!');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete commodity');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleCommodityStatus = async (id, currentStatus, name) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication token missing. Please login again.');
        return false;
      }
      const commodityData = { id, name, status: newStatus };
      const isUpdated = await updateCommodity(id, commodityData);
      if (isUpdated) {
        setSuccess(`Commodity status updated to ${newStatus}!`);
        await fetchCommodities();
        return true;
      } else {
        throw new Error('Failed to update commodity status');
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCommodities();
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const getCategoryName = (categorySino) => {
    const category = categories.find(cat => cat.sino === categorySino);
    return category ? category.name : 'Unknown Category';
  };

  const filteredCommodities = commodities.filter(c => {
    const categoryName = getCategoryName(c.category_sino) || '';
    return (
      (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toString().includes(searchTerm) ||
      (c.code && c.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  if (sortField) {
    filteredCommodities.sort((a, b) => {
      let aField, bField;
      if (sortField === 'category_name') {
        aField = getCategoryName(a.category_sino) || '';
        bField = getCategoryName(b.category_sino) || '';
      } else {
        aField = a[sortField] || '';
        bField = b[sortField] || '';
      }
      if (typeof aField === 'string') aField = aField.toLowerCase();
      if (typeof bField === 'string') bField = bField.toLowerCase();
      if (aField < bField) return sortDirection === 'asc' ? -1 : 1;
      if (aField > bField) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const totalPages = Math.ceil(filteredCommodities.length / itemsPerPage);
  const currentCommodities = filteredCommodities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddCommodity = async () => {
    if (!newCommodity.name.trim()) {
      setError('Commodity name is required');
      return;
    }
    if (!newCommodity.category_sino) {
      setError('Please select a category');
      return;
    }
    const commodityData = {
      name: newCommodity.name.trim(),
      category_sino: parseInt(newCommodity.category_sino),
      status: 'Active'
    };
    let success = false;
    if (editingId) {
      success = await updateCommodity(editingId, commodityData);
    } else {
      success = await addCommodity(commodityData);
    }
    if (success) {
      setNewCommodity({ name: '', category_sino: '' });
      setEditingId(null);
      setIsAdding(false);
    }
  };

  const handleEdit = (commodity) => {
    setEditingId(commodity.id);
    setNewCommodity({
      name: commodity.name,
      category_sino: commodity.category_sino?.toString() || ''
    });
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this commodity?')) {
      await deleteCommodity(id);
    }
  };

  const toggleStatus = async (commodity) => {
    await toggleCommodityStatus(commodity.id, commodity.status, commodity.name);
  };

  const handleClear = () => {
    setEditingId(null);
    setNewCommodity({ name: '', category_sino: '' });
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 py-8 px-2 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Alert Messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent flex items-center">
              <Package className="w-8 h-8 mr-3 text-indigo-600" />
              COMMODITY MANAGEMENT
            </h1>
            <p className="text-gray-600 mt-2">Manage all commodity information in your logistics system</p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search commodities..."
                  className="bg-transparent outline-none w-40"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-indigo-600 text-white rounded-lg px-4 py-2 shadow-sm flex items-center justify-center hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              {isAdding ? 'Cancel' : 'Add Commodity'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Commodity Form */}
          {isAdding && (
            <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  {editingId ? 'Edit Commodity' : 'Add New Commodity'}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Commodity Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter commodity name"
                        value={newCommodity.name}
                        onChange={(e) => setNewCommodity({ ...newCommodity, name: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                        value={newCommodity.category_sino}
                        onChange={(e) => setNewCommodity({ ...newCommodity, category_sino: e.target.value })}
                        disabled={loading}
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat.sino} value={cat.sino}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={handleAddCommodity}
                      disabled={loading}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : (editingId ? 'Update' : 'Add')}
                    </button>
                    <button
                      onClick={handleClear}
                      disabled={loading}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Overview */}
          <div className={`grid grid-cols-2 gap-4 ${isAdding ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-3xl font-bold">{commodities.length}</div>
              <div className="text-sm mt-1">Total Commodities</div>
              <div className="mt-4 flex items-center">
                <div className="text-xs bg-white/20 rounded-full px-2 py-1">
                  Database Connected
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-3xl font-bold">
                {commodities.filter(c => c.status === 'Active').length}
              </div>
              <div className="text-sm mt-1">Active Commodities</div>
              <div className="mt-4 flex items-center">
                <div className="text-xs bg-white/20 rounded-full px-2 py-1">
                  Real-time Data
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-3xl font-bold">
                {commodities.filter(c => c.status === 'Inactive').length}
              </div>
              <div className="text-sm mt-1">Inactive Commodities</div>
              <div className="mt-4 flex items-center">
                <div className="text-xs bg-white/20 rounded-full px-2 py-1">
                  Auto Updated
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-3xl font-bold">{categories.length}</div>
              <div className="text-sm mt-1">Active Categories</div>
              <div className="mt-4 flex items-center">
                <div className="text-xs bg-white/20 rounded-full px-2 py-1">
                  From Database
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Commodities Table */}
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Package className="w-5 h-5 mr-2 text-indigo-600" />
              Commodity List ({filteredCommodities.length})
            </h2>
            {loading && (
              <div className="text-sm text-gray-500 flex items-center">
                <div className="animate-spin w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full mr-2"></div>
                Loading...
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold text-white">
                <tr>
                  <th
                    className="cursor-pointer px-6 py-3 hover:bg-indigo-700 transition-colors"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      ID
                      {sortField === 'id' &&
                        (sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer px-6 py-3 hover:bg-indigo-700 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Commodity Name
                      {sortField === 'name' &&
                        (sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer px-6 py-3 hover:bg-indigo-700 transition-colors"
                    onClick={() => handleSort('category_name')}
                  >
                    <div className="flex items-center">
                      Category
                      {sortField === 'category_name' &&
                        (sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCommodities.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <div className="text-lg font-medium">No commodities found</div>
                      <div className="text-sm mt-1">
                        {searchTerm ? 'Try adjusting your search criteria' : 'Add a new commodity to get started'}
                      </div>
                    </td>
                  </tr>
                )}
                {currentCommodities.map((commodity) => (
                  <tr
                    key={commodity.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-indigo-600">
                      #{commodity.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                          <Package className="w-4 h-4 text-white" />
                        </div>
                        <div className="font-medium text-gray-900">{commodity.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getCategoryName(commodity.category_sino)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(commodity)}
                        disabled={loading}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          commodity.status === 'Active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {commodity.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {commodity.created_at
                        ? new Date(commodity.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : 'N/A'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(commodity)}
                          disabled={loading}
                          className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Edit commodity"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(commodity.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Delete commodity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200 bg-gradient-to-r from-gray-50 via-white to-purple-50">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center px-3 py-1 rounded-md border text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-100'
                      : 'border-indigo-300 text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
              </div>
              <div className="text-sm text-gray-700 font-medium">
                Page {currentPage} of {totalPages} ({filteredCommodities.length} total)
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-3 py-1 rounded-md border text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-100'
                      : 'border-indigo-300 text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommodityManagementPage;