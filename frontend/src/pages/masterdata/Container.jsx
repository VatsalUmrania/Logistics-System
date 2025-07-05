import React, { useState, useEffect } from 'react';
import { 
  Container, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, Loader, AlertTriangle, Settings
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';

const ContainerDetailsPage = () => {
  // State management
  const [containers, setContainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [newContainer, setNewContainer] = useState({
    name: '',
    status: 'Active'
  });

  const API_URL = 'http://localhost:5000/api/containers';

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
    
    if (error.response?.status === 401 || error.message.includes('Authentication')) {
      toast.error('🔐 Authentication failed. Please login again.');
    } else if (error.response?.status === 404 || error.message.includes('404')) {
      toast.error('🔍 API endpoint not found. Please check if the server is running.');
    } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      toast.error('🌐 Cannot connect to server. Please ensure the backend server is running on port 5000.');
    } else if (error.response?.status === 500 || error.message.includes('500')) {
      toast.error('⚠️ Server error occurred. Please try again later.');
    } else {
      toast.error(`❌ ${error.message || 'An unexpected error occurred'}`);
    }
  };

  // Validation function using ToastConfig warning style
  const validateContainerForm = () => {
    const errors = [];
    
    if (!newContainer.name.trim()) {
      errors.push('Container name is required');
    } else if (newContainer.name.trim().length < 2) {
      errors.push('Container name must be at least 2 characters');
    }
    
    // Check for duplicate container names (case-insensitive)
    const existingContainer = containers.find(
      container => 
        container.name.toLowerCase() === newContainer.name.trim().toLowerCase() &&
        container.id !== editingId
    );
    
    if (existingContainer) {
      errors.push('Container with this name already exists');
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

  // Fetch containers from backend
  const fetchContainers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_URL, {
        headers: getAuthHeaders(),
      });
      setContainers(response.data);
      console.log('Containers loaded successfully:', response.data.length, 'records');
      
      // Using ToastConfig success style
      if (response.data.length > 0) {
        toast.success(`✅ Successfully loaded ${response.data.length} container${response.data.length > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error('Failed to fetch containers:', error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  // Reset form
  const resetForm = () => {
    setNewContainer({
      name: '',
      status: 'Active'
    });
    setEditingId(null);
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
      setEditingId(null);
      
      // Using ToastConfig custom style
      toast((t) => (
        <div className="flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Ready to add new container
        </div>
      ), {
        duration: 2000,
      });
    }
  };

  // Add or update container using ToastConfig styles
  const handleAddContainer = async () => {
    if (!validateContainerForm()) {
      return;
    }

    // Using ToastConfig loading style
    const loadingToast = toast.loading(
      editingId ? '🔄 Updating container...' : '💾 Adding new container...'
    );

    try {
      const config = { headers: getAuthHeaders() };
      
      if (editingId !== null) {
        await axios.put(`${API_URL}/${editingId}`, newContainer, config);
        
        toast.dismiss(loadingToast);
        // Using ToastConfig success style
        toast.success(`✅ "${newContainer.name}" updated successfully!`);
      } else {
        await axios.post(API_URL, { ...newContainer, status: 'Active' }, config);
        
        toast.dismiss(loadingToast);
        // Using ToastConfig success style
        toast.success(`🎉 "${newContainer.name}" added successfully!`);
      }

      await fetchContainers();
      resetForm();
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Failed to save container:', error);
      
      if (error.response?.status === 409 || error.message.includes('already exists')) {
        // Using ToastConfig warning style
        toast((t) => (
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Container already exists with this name
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
        toast.error(`❌ ${error.message || 'Failed to save container'}`);
      }
      
      handleAuthError(error);
    }
  };

  // Delete container using ToastConfig styles
  const handleDelete = async (id) => {
    const container = containers.find(c => c.id === id);
    const containerName = container ? container.name : 'this container';
    
    if (!window.confirm(`⚠️ Are you sure you want to delete "${containerName}"?\n\nThis action cannot be undone.`)) {
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
    const loadingToast = toast.loading(`🗑️ Deleting "${containerName}"...`);

    try {
      const config = { headers: getAuthHeaders() };
      await axios.delete(`${API_URL}/${id}`, config);
      
      toast.dismiss(loadingToast);
      // Using ToastConfig success style
      toast.success(`🗑️ "${containerName}" deleted successfully!`);
      
      await fetchContainers();
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Failed to delete container:', error);
      
      // Using ToastConfig error style
      toast.error(`❌ ${error.message || 'Failed to delete container'}`);
      handleAuthError(error);
    }
  };

  // Edit container using ToastConfig custom style
  const handleEdit = (container) => {
    setNewContainer({
      name: container.name || '',
      status: container.status || 'Active'
    });
    setEditingId(container.id);
    setIsAdding(true);
    
    // Using ToastConfig custom style
    toast((t) => (
      <div className="flex items-center">
        <Pencil className="w-5 h-5 mr-2" />
        Editing: {container.name}
      </div>
    ), {
      duration: 2500,
    });
  };

  // Toggle status using ToastConfig styles
  const toggleStatus = async (id) => {
    const container = containers.find(c => c.id === id);
    if (!container) {
      toast.error('❌ Container not found');
      return;
    }
    
    const updatedStatus = container.status === 'Active' ? 'Inactive' : 'Active';
    const loadingToast = toast.loading(`🔄 Updating "${container.name}" status...`);

    try {
      const config = { headers: getAuthHeaders() };
      await axios.put(`${API_URL}/${id}`, { 
        name: container.name, 
        status: updatedStatus 
      }, config);
      
      toast.dismiss(loadingToast);
      // Using ToastConfig success style
      toast.success(`✅ "${container.name}" status updated to ${updatedStatus}!`);
      
      await fetchContainers();
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Failed to toggle status:', error);
      
      // Using ToastConfig error style
      toast.error(`❌ ${error.message || 'Failed to update status'}`);
      handleAuthError(error);
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
      const filteredResults = containers.filter(container =>
        (container.name || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        container.id.toString().includes(searchValue)
      );
      
      if (filteredResults.length === 0 && searchValue.trim()) {
        // Using ToastConfig warning style
        toast((t) => (
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            No containers found for "{searchValue}"
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
            Found {filteredResults.length} container{filteredResults.length > 1 ? 's' : ''}
          </div>
        ), {
          duration: 2000,
        });
      }
    }, 100);
  };

  // Filtered and sorted containers
  const filteredContainers = containers.filter(container =>
    (container.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    container.id.toString().includes(searchTerm)
  );

  const sortedContainers = [...filteredContainers].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContainers = sortedContainers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedContainers.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, containers]);

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
          <p className="mt-4 text-gray-600">Loading container data...</p>
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
              <Container className="w-8 h-8 mr-3 text-indigo-600" />
              Container Management
            </h1>
            <p className="text-gray-600 mt-2">Manage container types for your logistics operations</p>
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
              {isAdding ? 'Cancel' : 'Add Container'}
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH CONTAINERS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Name or ID
                </label>
                <input
                  type="text"
                  placeholder="Search containers..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Container Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                {editingId ? 'Edit Container' : 'Add New Container'}
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Container Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter container type (e.g. 20 ft)"
                      value={newContainer.name}
                      onChange={(e) => setNewContainer({ ...newContainer, name: e.target.value })}
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
                      value={newContainer.status}
                      onChange={(e) => setNewContainer({ ...newContainer, status: e.target.value })}
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
                  onClick={handleAddContainer}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm"
                >
                  {editingId ? 'Update Container' : 'Add Container'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Container Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Container Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">{filteredContainers.length} containers</span>
            </div>
          </div>
        </div>

        {/* Containers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'ID', key: 'id' },
                    { label: 'Container Name', key: 'name' },
                    { label: 'Status', key: 'status' },
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
                {currentContainers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Container className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No container records found</h4>
                        <p className="text-gray-400 mt-2">
                          {searchTerm ? 'Try adjusting your search criteria' : 'Create your first container to get started'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentContainers.map((container) => (
                    <tr key={container.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">
                        #{container.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <Container className="w-4 h-4 text-indigo-600 mr-2" />
                          {container.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => toggleStatus(container.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            container.status === 'Active'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {container.status}
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleEdit(container)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(container.id)}
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
                {Math.min(indexOfLastItem, filteredContainers.length)} of {filteredContainers.length} containers
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
                Total: <span className="text-green-600 font-bold">{filteredContainers.length} containers</span>
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

export default ContainerDetailsPage;
