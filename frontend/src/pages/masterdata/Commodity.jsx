import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert, Settings
} from 'lucide-react';
import Select from 'react-select';

const CommodityManagementPage = () => {
  // State management
  const [commodities, setCommodities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const itemsPerPage = 10;

  const [newCommodity, setNewCommodity] = useState({
    name: '',
    category_sino: '',
    status: 'Active'
  });

  const API_BASE_URL = 'http://localhost:5000/api';

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

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication token missing');
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch categories from database
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      const activeCategories = data.filter(cat => cat.status === 'Active');
      setCategories(activeCategories);
    } catch (err) {
      setError('Failed to load categories');
    }
  };

  // Fetch commodities from database
  const fetchCommodities = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/commodities`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch commodities');
      const data = await res.json();
      setCommodities(data);
      setError('');
    } catch (err) {
      setError('Failed to load commodities');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchCategories(), fetchCommodities()]);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Reset form
  const resetForm = () => {
    setNewCommodity({
      name: '',
      category_sino: '',
      status: 'Active'
    });
    setEditingId(null);
    setIsAdding(false);
    setError('');
    setSuccessMessage('');
  };

  // Fixed toggle function for Add Commodity button
  const handleToggleAddForm = () => {
    console.log('Button clicked, current state:', isAdding); // Debug log
    if (isAdding) {
      resetForm();
    } else {
      setIsAdding(true);
      setEditingId(null);
      setError('');
      setSuccessMessage('');
    }
  };

  // Add or update commodity
  const handleAddCommodity = async () => {
    if (!newCommodity.name.trim()) {
      setError('Commodity name is required');
      return;
    }
    if (!newCommodity.category_sino) {
      setError('Please select a category');
      return;
    }

    try {
      const headers = getAuthHeaders();
      const commodityData = {
        name: newCommodity.name.trim(),
        category_sino: parseInt(newCommodity.category_sino),
        status: newCommodity.status || 'Active'
      };

      let res;
      if (editingId) {
        res = await fetch(`${API_BASE_URL}/commodities/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(commodityData),
        });
        if (!res.ok) throw new Error('Failed to update commodity');
        setSuccessMessage('Commodity updated successfully!');
      } else {
        res = await fetch(`${API_BASE_URL}/commodities`, {
          method: 'POST',
          headers,
          body: JSON.stringify(commodityData),
        });
        if (!res.ok) throw new Error('Failed to add commodity');
        setSuccessMessage('Commodity added successfully!');
      }

      await fetchCommodities();
      resetForm();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save commodity');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Delete commodity
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this commodity?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/commodities/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete commodity');
      
      await fetchCommodities();
      setSuccessMessage('Commodity deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete commodity');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Edit commodity
  const handleEdit = (commodity) => {
    setNewCommodity({
      name: commodity.name || '',
      category_sino: commodity.category_sino?.toString() || '',
      status: commodity.status || 'Active'
    });
    setEditingId(commodity.id);
    setIsAdding(true);
  };

  // Toggle commodity status
  const toggleCommodityStatus = async (commodity) => {
    const newStatus = commodity.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const headers = getAuthHeaders();
      const commodityData = { 
        name: commodity.name,
        category_sino: commodity.category_sino,
        status: newStatus 
      };
      
      const res = await fetch(`${API_BASE_URL}/commodities/${commodity.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(commodityData),
      });
      
      if (!res.ok) throw new Error('Failed to update commodity status');
      
      await fetchCommodities();
      setSuccessMessage(`Commodity status updated to ${newStatus}!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update status');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
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

  // Helper function to get category name
  const getCategoryName = (categorySino) => {
    const category = categories.find(cat => cat.sino === categorySino);
    return category ? category.name : 'Unknown Category';
  };

  // Filtered and sorted commodities
  const filteredCommodities = commodities.filter(commodity => {
    const categoryName = getCategoryName(commodity.category_sino) || '';
    return (
      (commodity.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commodity.id.toString().includes(searchTerm)
    );
  });

  const sortedCommodities = [...filteredCommodities].sort((a, b) => {
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

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCommodities = sortedCommodities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedCommodities.length / itemsPerPage);

  // Category management functions
  const addCategory = async () => {
    if (newCategoryName.trim() && !categories.find(cat => cat.name === newCategoryName)) {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ name: newCategoryName, status: 'Active' })
        });
        if (!res.ok) throw new Error('Failed to add category');
        await fetchCategories();
        setNewCategoryName('');
        setSuccessMessage('Category added successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError('Failed to add category');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const removeCategory = async (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        const res = await fetch(`${API_BASE_URL}/categories/${category.sino}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete category');
        await fetchCategories();
        setSuccessMessage('Category deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError('Failed to delete category');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  // Prepare options for dropdowns
  const categoryOptions = categories.map(category => ({
    value: category.sino,
    label: category.name
  }));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, commodities]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading commodity data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Matching AssignExpenses */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <Package className="w-8 h-8 mr-3 text-indigo-600" />
              Commodity Management
            </h1>
            <p className="text-gray-600 mt-2">Manage all commodity information in your logistics system</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            {/* Fixed Add Commodity Button */}
            <button
              type="button"
              onClick={handleToggleAddForm}
              className={`px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Cancel' : 'Add Commodity'}
            </button>
            <button
              onClick={() => setIsManagingCategories(true)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center"
            >
              <Settings className="w-5 h-5 mr-2" />
              Manage Categories
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
              SEARCH COMMODITIES
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Name, Category, or ID
                </label>
                <input
                  type="text"
                  placeholder="Search commodities..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Management Modal */}
        {isManagingCategories && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
              <div className="bg-indigo-600 p-4 rounded-t-xl">
                <h2 className="text-lg font-bold text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Manage Categories
                </h2>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add new category
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter category name"
                    />
                    <button
                      onClick={addCategory}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-3">Current Categories</h3>
                  <ul className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-60 overflow-y-auto">
                    {categories.map((category) => (
                      <li key={category.sino} className="flex justify-between items-center p-3 hover:bg-gray-50">
                        <span className="text-sm">{category.name}</span>
                        <button
                          onClick={() => removeCategory(category)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setIsManagingCategories(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg shadow transition text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Commodity Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                {editingId ? 'Edit Commodity' : 'Add New Commodity'}
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Commodity Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter commodity name"
                      value={newCommodity.name}
                      onChange={(e) => setNewCommodity({ ...newCommodity, name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <Select
                        options={categoryOptions}
                        value={categoryOptions.find(option => option.value == newCommodity.category_sino)}
                        onChange={(selectedOption) => setNewCommodity({ ...newCommodity, category_sino: selectedOption?.value || '' })}
                        placeholder="Select Category"
                        isSearchable
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={selectStyles}
                        className="flex-grow text-sm"
                      />
                      <button
                        onClick={() => setIsManagingCategories(true)}
                        className="ml-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600"
                        title="Manage categories"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      value={newCommodity.status}
                      onChange={(e) => setNewCommodity({ ...newCommodity, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAddCommodity}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm"
                >
                  {editingId ? 'Update Commodity' : 'Add Commodity'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Commodity Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Commodity Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">{filteredCommodities.length} commodities</span>
            </div>
          </div>
        </div>

        {/* Commodities Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'ID', key: 'id' },
                    { label: 'Name', key: 'name' },
                    { label: 'Category', key: 'category_name' },
                    { label: 'Status', key: 'status' },
                    { label: 'Created', key: 'created_at' },
                    { label: 'Actions', key: null },
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
                {currentCommodities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      No commodity records found
                    </td>
                  </tr>
                ) : (
                  currentCommodities.map((commodity) => (
                    <tr key={commodity.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">
                        #{commodity.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 text-indigo-600 mr-2" />
                          {commodity.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getCategoryName(commodity.category_sino)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => toggleCommodityStatus(commodity)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            commodity.status === 'Active'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {commodity.status}
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {commodity.created_at
                          ? new Date(commodity.created_at).toLocaleDateString()
                          : 'N/A'
                        }
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleEdit(commodity)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(commodity.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
                Showing {indexOfFirstItem + 1} to{' '}
                {Math.min(indexOfLastItem, filteredCommodities.length)} of {filteredCommodities.length} commodities
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
                Total: <span className="text-green-600 font-bold">{filteredCommodities.length} commodities</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommodityManagementPage;
