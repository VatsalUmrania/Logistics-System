import React, { useState, useEffect } from 'react';
import { 
  Truck, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, Loader, AlertTriangle, Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';

const VesselDetailsPage = () => {
  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/vessels`;
  // State management
  const [vessels, setVessels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('vesselName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [newVessel, setNewVessel] = useState({
    vesselNo: '',
    vesselName: ''
  });

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
  const validateVesselForm = () => {
    const errors = [];
    
    if (!newVessel.vesselName.trim()) {
      errors.push('Vessel name is required');
    } else if (newVessel.vesselName.trim().length < 2) {
      errors.push('Vessel name must be at least 2 characters');
    }
    
    // Check for duplicate vessel names (case-insensitive)
    const existingVessel = vessels.find(
      vessel => 
        vessel.vesselName.toLowerCase() === newVessel.vesselName.trim().toLowerCase() &&
        vessel.id !== editingId
    );
    
    if (existingVessel) {
      errors.push('Vessel with this name already exists');
    }
    
    // Check for duplicate vessel numbers if provided (case-insensitive)
    if (newVessel.vesselNo.trim()) {
      const existingVesselNo = vessels.find(
        vessel => 
          vessel.vesselNo && 
          vessel.vesselNo.toLowerCase() === newVessel.vesselNo.trim().toLowerCase() &&
          vessel.id !== editingId
      );
      
      if (existingVesselNo) {
        errors.push('Vessel with this number already exists');
      }
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

  // Fetch vessels from backend
  const fetchVessels = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`Failed to fetch vessels: ${res.status} ${res.statusText}`);
      const data = await res.json();
      
      // Map the backend data to frontend format
      setVessels(data.map(item => ({
        id: item.id,
        vesselName: item.name,
        vesselNo: item.number,
        createdAt: item.created_at
      })));
      
      console.log('Vessels loaded successfully:', data.length, 'records');
      
      // Using ToastConfig success style
      if (data.length > 0) {
        toast.success(`✅ Successfully loaded ${data.length} vessel${data.length > 1 ? 's' : ''}`);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVessels();
  }, []);

  // Reset form
  const resetForm = () => {
    setNewVessel({
      vesselNo: '',
      vesselName: ''
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
          Ready to add new vessel
        </div>
      ), {
        duration: 2000,
      });
    }
  };

  // Add or update vessel using ToastConfig styles
  const handleAddVessel = async () => {
    if (!validateVesselForm()) {
      return;
    }

    // Using ToastConfig loading style
    const loadingToast = toast.loading(
      editingId ? '🔄 Updating vessel...' : '💾 Adding new vessel...'
    );

    try {
      const headers = getAuthHeaders();
      
      // Send only the fields that exist in your database
      const vesselData = {
        name: newVessel.vesselName.trim(),
        number: newVessel.vesselNo.trim() || null
      };

      console.log('Sending vessel data:', vesselData);

      let res;
      if (editingId) {
        res = await fetch(`${API_BASE_URL}${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(vesselData),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to update vessel');
        }
        
        toast.dismiss(loadingToast);
        // Using ToastConfig success style
        toast.success(`✅ "${newVessel.vesselName}" updated successfully!`);
      } else {
        res = await fetch(`${API_BASE_URL}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(vesselData),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          if (res.status === 409) {
            throw new Error('Vessel with this name or number already exists');
          }
          throw new Error(errorData.message || 'Failed to add vessel');
        }
        
        toast.dismiss(loadingToast);
        // Using ToastConfig success style
        toast.success(`🎉 "${newVessel.vesselName}" added successfully!`);
      }

      await fetchVessels();
      resetForm();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Add vessel error:', err);
      
      if (err.message.includes('already exists')) {
        // Using ToastConfig warning style
        toast((t) => (
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Vessel already exists with this name or number
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
        toast.error(`❌ ${err.message || 'Failed to save vessel'}`);
      }
      
      handleAuthError(err);
    }
  };

  // Delete vessel using ToastConfig styles
  const handleDelete = async (id) => {
    const vessel = vessels.find(v => v.id === id);
    const vesselName = vessel ? vessel.vesselName : 'this vessel';
    
    if (!window.confirm(`⚠️ Are you sure you want to delete "${vesselName}"?\n\nThis action cannot be undone.`)) {
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
    const loadingToast = toast.loading(`🗑️ Deleting "${vesselName}"...`);

    try {
      const res = await fetch(`${API_BASE_URL}${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete vessel');
      }
      
      toast.dismiss(loadingToast);
      // Using ToastConfig success style
      toast.success(`🗑️ "${vesselName}" deleted successfully!`);
      
      await fetchVessels();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error deleting vessel:', err);
      
      // Using ToastConfig error style
      toast.error(`❌ ${err.message || 'Failed to delete vessel'}`);
      handleAuthError(err);
    }
  };

  // Edit vessel using ToastConfig custom style
  const handleEdit = (vessel) => {
    setNewVessel({
      vesselNo: vessel.vesselNo || '',
      vesselName: vessel.vesselName || ''
    });
    setEditingId(vessel.id);
    setIsAdding(true);
    
    // Using ToastConfig custom style
    toast((t) => (
      <div className="flex items-center">
        <Pencil className="w-5 h-5 mr-2" />
        Editing: {vessel.vesselName}
      </div>
    ), {
      duration: 2500,
    });
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
      const filteredResults = vessels.filter(vessel =>
        (vessel.vesselName || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        (vessel.vesselNo || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        vessel.id.toString().includes(searchValue)
      );
      
      if (filteredResults.length === 0 && searchValue.trim()) {
        // Using ToastConfig warning style
        toast((t) => (
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            No vessels found for "{searchValue}"
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
            Found {filteredResults.length} vessel{filteredResults.length > 1 ? 's' : ''}
          </div>
        ), {
          duration: 2000,
        });
      }
    }, 100);
  };

  // Filtered and sorted vessels
  const filteredVessels = vessels.filter(vessel =>
    (vessel.vesselName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vessel.vesselNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    vessel.id.toString().includes(searchTerm)
  );

  const sortedVessels = [...filteredVessels].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVessels = sortedVessels.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedVessels.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, vessels]);

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
          <p className="mt-4 text-gray-600">Loading vessel data...</p>
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
              <Truck className="w-8 h-8 mr-3 text-indigo-600" />
              Vessel Management
            </h1>
            <p className="text-gray-600 mt-2">Manage and track all vessel information</p>
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
              {isAdding ? 'Cancel' : 'Add Vessel'}
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH VESSELS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Name, Number, or ID
                </label>
                <input
                  type="text"
                  placeholder="Search vessels..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        Add/Edit Vessel Form
        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                {editingId ? 'Edit Vessel' : 'Add New Vessel'}
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vessel Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter vessel name"
                      value={newVessel.vesselName}
                      onChange={(e) => setNewVessel({ ...newVessel, vesselName: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vessel Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter vessel number"
                      value={newVessel.vesselNo}
                      onChange={(e) => setNewVessel({ ...newVessel, vesselNo: e.target.value })}
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
                  onClick={handleAddVessel}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm"
                >
                  {editingId ? 'Update Vessel' : 'Add Vessel'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vessel Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Vessel Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">{filteredVessels.length} vessels</span>
            </div>
          </div>
        </div>

        {/* Vessels Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'ID', key: 'id' },
                    { label: 'Vessel Number', key: 'vesselNo' },
                    { label: 'Vessel Name', key: 'vesselName' },
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
                {currentVessels.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Truck className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No vessel records found</h4>
                        <p className="text-gray-400 mt-2">
                          {searchTerm ? 'Try adjusting your search criteria' : 'Create your first vessel to get started'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentVessels.map((vessel) => (
                    <tr key={vessel.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">
                        #{vessel.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {vessel.vesselNo || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <Truck className="w-4 h-4 text-indigo-600 mr-2" />
                          {vessel.vesselName}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {vessel.createdAt ? new Date(vessel.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleEdit(vessel)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vessel.id)}
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
                {Math.min(indexOfLastItem, filteredVessels.length)} of {filteredVessels.length} vessels
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
                Total: <span className="text-green-600 font-bold">{filteredVessels.length} vessels</span>
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

export default VesselDetailsPage;
