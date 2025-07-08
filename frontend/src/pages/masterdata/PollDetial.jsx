import React, { useState, useEffect } from 'react';
import { 
  Ship, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, Loader, Check, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';



const PolDetailsPage = () => {
  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/containers`;
  // State management
  const [polName, setPolName] = useState('');
  const [polList, setPolList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isAdding, setIsAdding] = useState(false);
  const itemsPerPage = 10;

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
  const validatePolForm = (name, isEdit = false) => {
    const errors = [];
    
    if (!name.trim()) {
      errors.push('Port name is required');
    } else if (name.trim().length < 2) {
      errors.push('Port name must be at least 2 characters');
    }
    
    // Check for duplicate port names (case-insensitive)
    const existingPort = polList.find(
      port => 
        port.name.toLowerCase() === name.trim().toLowerCase() &&
        (!isEdit || port.id !== editingId)
    );
    
    if (existingPort) {
      errors.push('Port with this name already exists');
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

  // Fetch POL list from backend
  const fetchPolList = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch POL list');
      const data = await response.json();
      setPolList(data);
      console.log('Ports loaded successfully:', data.length, 'records');
      
      // Using ToastConfig success style
      if (data.length > 0) {
        toast.success(`✅ Successfully loaded ${data.length} port${data.length > 1 ? 's' : ''}`);
      }
    } catch (err) {
      console.error('Failed to fetch POL list:', err);
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolList();
  }, []);

  // Reset form
  const resetForm = () => {
    setPolName('');
    setEditingId(null);
    setEditingName('');
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
      
      // Using ToastConfig custom style
      toast((t) => (
        <div className="flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Ready to add new port
        </div>
      ), {
        duration: 2000,
      });
    }
  };

  // Add POL using ToastConfig styles
  const handleAddPol = async () => {
    if (!validatePolForm(polName)) {
      return;
    }

    // Using ToastConfig loading style
    const loadingToast = toast.loading('💾 Adding new port...');

    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: polName.trim() })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 409) {
          throw new Error('Port with this name already exists');
        }
        throw new Error(errorData.message || 'Failed to add port');
      }
      
      toast.dismiss(loadingToast);
      // Using ToastConfig success style
      toast.success(`🎉 "${polName}" added successfully!`);
      
      await fetchPolList();
      resetForm();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Failed to add POL:', err);
      
      if (err.message.includes('already exists')) {
        // Using ToastConfig warning style
        toast((t) => (
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Port already exists with this name
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
        toast.error(`❌ ${err.message || 'Failed to add port'}`);
      }
      
      handleAuthError(err);
    }
  };

  // Start editing using ToastConfig custom style
  const handleEditStart = (pol) => {
    setEditingId(pol.id);
    setEditingName(pol.name);
    
    // Using ToastConfig custom style
    toast((t) => (
      <div className="flex items-center">
        <Pencil className="w-5 h-5 mr-2" />
        Editing: {pol.name}
      </div>
    ), {
      duration: 2500,
    });
  };

  // Save edit using ToastConfig styles
  const handleEditSave = async (id) => {
    if (!validatePolForm(editingName, true)) {
      return;
    }

    // Using ToastConfig loading style
    const loadingToast = toast.loading('🔄 Updating port...');

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: editingName.trim() })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 409) {
          throw new Error('Port with this name already exists');
        }
        throw new Error(errorData.message || 'Failed to update port');
      }
      
      toast.dismiss(loadingToast);
      // Using ToastConfig success style
      toast.success(`✅ "${editingName}" updated successfully!`);
      
      await fetchPolList();
      setEditingId(null);
      setEditingName('');
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Failed to update POL:', err);
      
      if (err.message.includes('already exists')) {
        // Using ToastConfig warning style
        toast((t) => (
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Port already exists with this name
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
        toast.error(`❌ ${err.message || 'Failed to update port'}`);
      }
      
      handleAuthError(err);
    }
  };

  // Cancel edit using ToastConfig custom style
  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName('');
    
    // Using ToastConfig custom style
    toast((t) => (
      <div className="flex items-center">
        <X className="w-5 h-5 mr-2" />
        Edit cancelled
      </div>
    ), {
      duration: 2000,
    });
  };

  // Delete POL using ToastConfig styles
  const handleDeletePol = async (id) => {
    const port = polList.find(p => p.id === id);
    const portName = port ? port.name : 'this port';
    
    if (!window.confirm(`⚠️ Are you sure you want to delete "${portName}"?\n\nThis action cannot be undone.`)) {
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
    const loadingToast = toast.loading(`🗑️ Deleting "${portName}"...`);

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete port');
      }
      
      toast.dismiss(loadingToast);
      // Using ToastConfig success style
      toast.success(`🗑️ "${portName}" deleted successfully!`);
      
      await fetchPolList();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Failed to delete POL:', err);
      
      // Using ToastConfig error style
      toast.error(`❌ ${err.message || 'Failed to delete port'}`);
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
      const filteredResults = polList.filter(pol =>
        (pol.name || '').toLowerCase().includes(searchValue.toLowerCase())
      );
      
      if (filteredResults.length === 0 && searchValue.trim()) {
        // Using ToastConfig warning style
        toast((t) => (
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            No ports found for "{searchValue}"
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
            Found {filteredResults.length} port{filteredResults.length > 1 ? 's' : ''}
          </div>
        ), {
          duration: 2000,
        });
      }
    }, 100);
  };

  // Handle key press for inline editing
  const handleKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      handleEditSave(id);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  // Filtered and sorted POL list
  const filteredPols = polList.filter(pol =>
    (pol.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPols = [...filteredPols].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPols = sortedPols.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedPols.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, polList]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== '') {
        handleSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading POL data...</p>
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
              <Ship className="w-8 h-8 mr-3 text-indigo-600" />
              Port of Loading Management
            </h1>
            <p className="text-gray-600 mt-2">Manage ports of loading for your logistics operations</p>
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
              {isAdding ? 'Cancel' : 'Add POL'}
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH PORTS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Port Name
                </label>
                <input
                  type="text"
                  placeholder="Search ports..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add POL Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                Add New Port of Loading
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Port Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter port name"
                      value={polName}
                      onChange={(e) => setPolName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddPol()}
                    />
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
                  onClick={handleAddPol}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm"
                >
                  Add Port
                </button>
              </div>
            </div>
          </div>
        )}

        {/* POL Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Port Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">{filteredPols.length} ports</span>
            </div>
          </div>
        </div>

        {/* POL Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'ID', key: 'id' },
                    { label: 'Port Name', key: 'name' },
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
                {currentPols.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Ship className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No port records found</h4>
                        <p className="text-gray-400 mt-2">
                          {searchTerm ? 'Try adjusting your search criteria' : 'Create your first port to get started'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentPols.map((pol, index) => (
                    <tr key={pol.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">
                        #{pol.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {editingId === pol.id ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => handleKeyPress(e, pol.id)}
                            onBlur={() => handleEditSave(pol.id)}
                            className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                            autoFocus
                          />
                        ) : (
                          <div className="flex items-center">
                            <Ship className="w-4 h-4 text-indigo-600 mr-2" />
                            {pol.name}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        {editingId === pol.id ? (
                          <>
                            <button
                              onClick={() => handleEditSave(pol.id)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditStart(pol)}
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePol(pol.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
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
                {Math.min(indexOfLastItem, filteredPols.length)} of {filteredPols.length} ports
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
                Total: <span className="text-green-600 font-bold">{filteredPols.length} ports</span>
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

export default PolDetailsPage;
