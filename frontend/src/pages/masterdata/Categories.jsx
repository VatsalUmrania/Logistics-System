import React, { useState, useEffect } from 'react';
import { 
  Layers, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, Loader, AlertTriangle
} from 'lucide-react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';



const CategoryInformationPage = () => {
  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/categories`;
  // State management
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingSino, setEditingSino] = useState(null);
  const [sortField, setSortField] = useState('sino');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [newCategory, setNewCategory] = useState({
    code: '',
    name: '',
    status: 'Active',
    sino: '',
  });

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

  // Handle authentication errors using ToastConfig styles
  const handleAuthError = (error) => {
    console.error('API Error:', error);
    
    if (error.message.includes('401') || error.message.includes('Authentication')) {
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

  // Validation function using ToastConfig warning style
  const validateCategoryForm = () => {
    const errors = [];
    
    if (!newCategory.code.trim()) {
      errors.push('Category code is required');
    } else if (newCategory.code.trim().length < 2) {
      errors.push('Category code must be at least 2 characters');
    }
    
    if (!newCategory.name.trim()) {
      errors.push('Category name is required');
    } else if (newCategory.name.trim().length < 2) {
      errors.push('Category name must be at least 2 characters');
    }
    
    if (errors.length > 0) {
      errors.forEach(error => {
        toast((t) => (
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
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

  // Helper: convert API snake_case to camelCase
  const toCamelCase = (obj) => ({
    sino: obj.sino,
    code: obj.code,
    name: obj.name,
    status: obj.status,
    createdAt: obj.created_at,
    updatedAt: obj.updated_at,
  });

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_BASE_URL, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setCategories(data.map(toCamelCase));
      console.log('Categories loaded successfully:', data.length, 'records');
      
      // Using ToastConfig success style
      if (data.length > 0) {
        toast.success(`✅ Successfully loaded ${data.length} categor${data.length > 1 ? 'ies' : 'y'}`);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Reset form
  const resetForm = () => {
    setNewCategory({
      code: '',
      name: '',
      status: 'Active',
      sino: '',
    });
    setEditingSino(null);
    setIsAdding(false);
  };

  // Toggle add form using ToastConfig custom style
  const handleToggleAddForm = () => {
    console.log('Button clicked, current state:', isAdding);
    if (isAdding) {
      resetForm();
      // Using ToastConfig custom style
      toast((t) => (
        <div className="flex items-center">
          <X className="w-5 h-5 mr-2" />
          Form cancelled
        </div>
      ), {
        duration: 2000,
      });
    } else {
      setIsAdding(true);
      setEditingSino(null);
      
      // Using ToastConfig custom style
      toast((t) => (
        <div className="flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Ready to add new category
        </div>
      ), {
        duration: 2000,
      });
    }
  };

  // Add or update category using ToastConfig styles
  const handleAddCategory = async () => {
    if (!validateCategoryForm()) {
      return;
    }

    // Using ToastConfig loading style
    const loadingToast = toast.loading(
      editingSino ? '🔄 Updating category...' : '💾 Adding new category...'
    );

    try {
      const categoryData = {
        code: newCategory.code,
        name: newCategory.name,
        status: newCategory.status,
      };
      const headers = getAuthHeaders();
      let res;

      if (editingSino !== null) {
        res = await fetch(`${API_BASE_URL}/${editingSino}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(categoryData),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to update category');
        }
        
        toast.dismiss(loadingToast);
        // Using ToastConfig success style
        toast.success(`✅ "${newCategory.name}" updated successfully!`);
      } else {
        res = await fetch(API_BASE_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify(categoryData),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          if (res.status === 409) {
            throw new Error('Category with this code already exists');
          }
          throw new Error(errorData.message || 'Failed to add category');
        }
        
        toast.dismiss(loadingToast);
        // Using ToastConfig success style
        toast.success(`🎉 "${newCategory.name}" added successfully!`);
      }

      await fetchCategories();
      resetForm();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error saving category:', err);
      
      if (err.message.includes('already exists')) {
        // Using ToastConfig warning style
        toast((t) => (
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Category already exists with this code
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
      } else {
        // Using ToastConfig error style
        toast.error(`❌ ${err.message || 'Failed to save category'}`);
      }
      
      handleAuthError(err);
    }
  };

  // Edit category using ToastConfig custom style
  const handleEdit = (category) => {
    setNewCategory({
      code: category.code,
      name: category.name,
      status: category.status,
      sino: category.sino,
    });
    setEditingSino(category.sino);
    setIsAdding(true);
    
    // Using ToastConfig custom style
    toast((t) => (
      <div className="flex items-center">
        <Pencil className="w-5 h-5 mr-2" />
        Editing: {category.name}
      </div>
    ), {
      duration: 2500,
    });
  };

  // Delete category using ToastConfig styles
  const handleDelete = async (sino) => {
    const category = categories.find(c => c.sino === sino);
    const categoryName = category ? category.name : 'this category';
    
    if (!window.confirm(`⚠️ Are you sure you want to delete "${categoryName}"?\n\nThis action cannot be undone.`)) {
      // Using ToastConfig custom style
      toast((t) => (
        <div className="flex items-center">
          <X className="w-5 h-5 mr-2" />
          Deletion cancelled
        </div>
      ), {
        duration: 2000,
      });
      return;
    }

    // Using ToastConfig loading style
    const loadingToast = toast.loading(`🗑️ Deleting "${categoryName}"...`);

    try {
      const res = await fetch(`${API_BASE_URL}/${sino}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete category');
      }
      
      toast.dismiss(loadingToast);
      // Using ToastConfig success style
      toast.success(`🗑️ "${categoryName}" deleted successfully!`);
      
      await fetchCategories();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error deleting category:', err);
      
      // Using ToastConfig error style
      toast.error(`❌ ${err.message || 'Failed to delete category'}`);
      handleAuthError(err);
    }
  };

  // Toggle status using ToastConfig styles
  const toggleStatus = async (sino) => {
    const category = categories.find(c => c.sino === sino);
    if (!category) {
      toast.error('❌ Category not found');
      return;
    }
    
    const updatedStatus = category.status === 'Active' ? 'Inactive' : 'Active';
    const loadingToast = toast.loading(`🔄 Updating "${category.name}" status...`);

    try {
      const res = await fetch(`${API_BASE_URL}/${sino}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          code: category.code,
          name: category.name,
          status: updatedStatus,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update status');
      }
      
      toast.dismiss(loadingToast);
      // Using ToastConfig success style
      toast.success(`✅ "${category.name}" status updated to ${updatedStatus}!`);
      
      await fetchCategories();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error updating category status:', err);
      
      // Using ToastConfig error style
      toast.error(`❌ ${err.message || 'Failed to update category status'}`);
      handleAuthError(err);
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

  // Handle search using ToastConfig styles
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
    
    // Show toast for search results
    setTimeout(() => {
      const filteredResults = categories.filter(category =>
        (category.name || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        (category.code || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        category.sino.toString().includes(searchValue)
      );
      
      if (filteredResults.length === 0 && searchValue.trim()) {
        // Using ToastConfig warning style
        toast((t) => (
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            No categories found for "{searchValue}"
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
      } else if (filteredResults.length > 0 && searchValue.trim()) {
        // Using ToastConfig custom style
        toast((t) => (
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Found {filteredResults.length} categor{filteredResults.length > 1 ? 'ies' : 'y'}
          </div>
        ), {
          duration: 2000,
        });
      }
    }, 100);
  };

  // Filtered and sorted categories
  const filteredCategories = categories.filter(category =>
    (category.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.sino.toString().includes(searchTerm)
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = sortedCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categories]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== '') {
        handleSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading category data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <Layers className="w-8 h-8 mr-3 text-indigo-600" />
              Category Management
            </h1>
            <p className="text-gray-600 mt-2">Organize your logistics categories</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleToggleAddForm}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center shadow-md 
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-white-600 hover:bg-gray-100 text-indigo-600'}`}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Cancel' : 'Add Category'}
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH CATEGORIES
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Name, Code, or SINO
                </label>
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Category Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                {editingSino ? 'Edit Category' : 'Add New Category'}
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter category code"
                      value={newCategory.code}
                      onChange={(e) => setNewCategory({ ...newCategory, code: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter category name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      value={newCategory.status}
                      onChange={e => setNewCategory({ ...newCategory, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={handleToggleAddForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm"
                >
                  {editingSino ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Category Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">{filteredCategories.length} categories</span>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'SINO', key: 'sino' },
                    { label: 'Code', key: 'code' },
                    { label: 'Name', key: 'name' },
                    { label: 'Status', key: 'status' },
                    { label: 'Created', key: 'createdAt' },
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
                {currentCategories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Layers className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No category records found</h4>
                        <p className="text-gray-400 mt-2">
                          {searchTerm ? 'Try adjusting your search criteria' : 'Create your first category to get started'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentCategories.map((category) => (
                    <tr key={category.sino} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">
                        #{category.sino}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <Layers className="w-4 h-4 text-indigo-600 mr-2" />
                          {category.code}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => toggleStatus(category.sino)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            category.status === 'Active'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {category.status}
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {category.createdAt
                          ? new Date(category.createdAt).toLocaleDateString()
                          : 'N/A'
                        }
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.sino)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
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
                {Math.min(indexOfLastItem, filteredCategories.length)} of {filteredCategories.length} categories
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
                Total: <span className="text-green-600 font-bold">{filteredCategories.length} categories</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Configuration */}
      <ToastConfig position="bottom-right" />
    </div>
  );
};

export default CategoryInformationPage;
