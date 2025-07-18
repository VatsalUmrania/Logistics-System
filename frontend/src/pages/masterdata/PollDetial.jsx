import React, { useState, useEffect } from 'react';
import { 
  Ship, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert
} from 'lucide-react';

const PolDetailsPage = () => {
  // State management
  const [polName, setPolName] = useState('');
  const [polList, setPolList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isAdding, setIsAdding] = useState(false);
  const itemsPerPage = 10;

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication token missing');
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch POL list from backend
  const fetchPolList = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/ports', {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch POL list');
      const data = await response.json();
      setPolList(data);
      setError('');
    } catch (err) {
      setError('Failed to load POL list');
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
    setError('');
    setSuccessMessage('');
  };

  // Fixed toggle function for Add POL button
  const handleToggleAddForm = () => {
    console.log('Button clicked, current state:', isAdding); // Debug log
    if (isAdding) {
      resetForm();
    } else {
      setIsAdding(true);
      setError('');
      setSuccessMessage('');
    }
  };

  // Add POL
  const handleAddPol = async () => {
    if (!polName.trim()) {
      setError('POL name is required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/ports', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: polName.trim() })
      });
      
      if (!response.ok) throw new Error('Failed to add POL');
      
      await fetchPolList();
      resetForm();
      setSuccessMessage('POL added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to add POL');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Start editing
  const handleEditStart = (pol) => {
    setEditingId(pol.id);
    setEditingName(pol.name);
    setError('');
    setSuccessMessage('');
  };

  // Save edit
  const handleEditSave = async (id) => {
    if (!editingName.trim()) {
      setError('POL name cannot be empty');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/ports/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: editingName.trim() })
      });
      
      if (!response.ok) throw new Error('Failed to update POL');
      
      await fetchPolList();
      setEditingId(null);
      setEditingName('');
      setSuccessMessage('POL updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update POL');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Cancel edit
  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName('');
    setError('');
    setSuccessMessage('');
  };

  // Delete POL
  const handleDeletePol = async (id) => {
    if (!window.confirm('Are you sure you want to delete this POL?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/ports/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) throw new Error('Failed to delete POL');
      
      await fetchPolList();
      setSuccessMessage('POL deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete POL');
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
        {/* Header - Matching AssignExpenses */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <Ship className="w-8 h-8 mr-3 text-indigo-600" />
              Port of Loading Management
            </h1>
            <p className="text-gray-600 mt-2">Manage ports of loading for your logistics operations</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            {/* Fixed Add POL Button */}
            <button
              type="button"
              onClick={handleToggleAddForm}
              className={`px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Cancel' : 'Add POL'}
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
              
              <div className="mt-4 flex justify-end">
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
                      No port records found
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
                              className="text-green-600 hover:text-green-900"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="text-red-600 hover:text-red-900"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditStart(pol)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePol(pol.id)}
                              className="text-red-600 hover:text-red-900"
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
    </div>
  );
};

export default PolDetailsPage;
