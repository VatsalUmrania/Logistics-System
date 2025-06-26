import React, { useState, useEffect } from 'react';
import { 
  Truck, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert, Settings
} from 'lucide-react';

const VesselDetailsPage = () => {
  // State management
  const [vessels, setVessels] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('name');
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
    if (!token) throw new Error('Authentication token missing');
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch vessels from backend
  const fetchVessels = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/api/vessels/', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`Failed to fetch vessels: ${res.status} ${res.statusText}`);
      const data = await res.json();
      
      // Map the backend data to frontend format
      setVessels(data.map(item => ({
        id: item.id,
        vesselName: item.name,
        vesselNo: item.number,
        createdAt: item.created_at
      })));
      setError('');
    } catch (err) {
      setError('Failed to load vessels');
      console.error('Fetch error:', err);
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
    setError('');
    setSuccessMessage('');
  };

  // Fixed toggle function for Add Vessel button
  const handleToggleAddForm = () => {
    console.log('Button clicked, current state:', isAdding);
    if (isAdding) {
      resetForm();
    } else {
      setIsAdding(true);
      setEditingId(null);
      setError('');
      setSuccessMessage('');
    }
  };

  // Add or update vessel - FIXED VERSION
  const handleAddVessel = async () => {
    if (!newVessel.vesselName.trim()) {
      setError('Vessel name is required');
      return;
    }

    try {
      const headers = getAuthHeaders();
      
      // Send only the fields that exist in your database
      const vesselData = {
        name: newVessel.vesselName.trim(),
        number: newVessel.vesselNo.trim() || null
      };

      console.log('Sending vessel data:', vesselData); // Debug log

      let res;
      if (editingId) {
        res = await fetch(`http://localhost:5000/api/vessels/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(vesselData),
        });
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Update error response:', errorText);
          throw new Error(`Failed to update vessel: ${res.status}`);
        }
        setSuccessMessage('Vessel updated successfully!');
      } else {
        res = await fetch('http://localhost:5000/api/vessels/', {
          method: 'POST',
          headers,
          body: JSON.stringify(vesselData),
        });
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Create error response:', errorText);
          throw new Error(`Failed to add vessel: ${res.status}`);
        }
        setSuccessMessage('Vessel added successfully!');
      }

      await fetchVessels();
      resetForm();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Add vessel error:', err);
      setError(err.message || 'Failed to save vessel');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Delete vessel
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vessel?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/vessels/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete vessel');
      
      await fetchVessels();
      setSuccessMessage('Vessel deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete vessel');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Edit vessel
  const handleEdit = (vessel) => {
    setNewVessel({
      vesselNo: vessel.vesselNo || '',
      vesselName: vessel.vesselName || ''
    });
    setEditingId(vessel.id);
    setIsAdding(true);
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
        {/* Header - Matching AssignExpenses */}
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
              className={`px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Cancel' : 'Add Vessel'}
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

        {/* Add/Edit Vessel Form */}
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
              
              <div className="mt-4 flex justify-end">
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
                      No vessel records found
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
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vessel.id)}
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
    </div>
  );
};

export default VesselDetailsPage;
