import { useState, useEffect } from 'react';
import {
  Truck, Plus, Pencil, Trash2, ChevronDown, ChevronUp, Search, ChevronLeft, ChevronRight, X, Check
} from 'lucide-react';

// Helper for API auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Authentication token missing');
  return { 'Authorization': `Bearer ${token}` };
};

const PAGE_SIZE = 5;

const VesselDetailsPage = () => {
  const [vessels, setVessels] = useState([]);
  const [newVessel, setNewVessel] = useState({ vesselNo: '', vesselName: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('vesselNo');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  // Fetch vessels
  const fetchVessels = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/vessels/', {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Could not fetch vessels');
      const data = await res.json();
      setVessels(
        data.map(item => ({
          id: item.id,
          vesselName: item.name,
          vesselNo: item.number,
          status: item.status || 'Active'
        }))
      );
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Failed to load vessels' });
    }
  };

  useEffect(() => { fetchVessels(); }, []);

  // Feedback auto-clear
  useEffect(() => {
    if (feedback.msg) {
      const t = setTimeout(() => setFeedback({ type: '', msg: '' }), 1800);
      return () => clearTimeout(t);
    }
  }, [feedback]);

  // Form submit
  const handleSaveVessel = async () => {
    if (!newVessel.vesselName.trim()) {
      setFeedback({ type: 'error', msg: 'Vessel name is required.' });
      return;
    }
    try {
      if (editingId) {
        const res = await fetch(`http://localhost:5000/api/vessels/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify({
            name: newVessel.vesselName,
            number: newVessel.vesselNo
          })
        });
        if (!res.ok) throw new Error();
        setFeedback({ type: 'success', msg: 'Vessel updated!' });
      } else {
        const res = await fetch('http://localhost:5000/api/vessels/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify({
            name: newVessel.vesselName,
            number: newVessel.vesselNo
          })
        });
        if (!res.ok) throw new Error();
        setFeedback({ type: 'success', msg: 'Vessel added!' });
      }
      setNewVessel({ vesselNo: '', vesselName: '' });
      setEditingId(null);
      setIsFormOpen(false);
      fetchVessels();
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Failed to save vessel.' });
    }
  };

  // Edit
  const handleEdit = vessel => {
    setNewVessel({ vesselNo: vessel.vesselNo || '', vesselName: vessel.vesselName || '' });
    setEditingId(vessel.id);
    setIsFormOpen(true);
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/vessels/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error();
      setFeedback({ type: 'success', msg: 'Vessel deleted!' });
      fetchVessels();
    } catch {
      setFeedback({ type: 'error', msg: 'Failed to delete vessel.' });
    }
  };

  // Status toggle
  const toggleStatus = async (id) => {
    try {
      const vessel = vessels.find(v => v.id === id);
      const newStatus = vessel.status === 'Active' ? 'Inactive' : 'Active';
      const res = await fetch(`http://localhost:5000/api/vessels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          name: vessel.vesselName,
          number: vessel.vesselNo,
          status: newStatus,
        })
      });
      if (!res.ok) throw new Error();
      setFeedback({ type: 'success', msg: 'Status updated!' });
      fetchVessels();
    } catch {
      setFeedback({ type: 'error', msg: 'Failed to update status.' });
    }
  };

  // Sorting and filtering
  const sortedVessels = [...vessels].sort((a, b) => {
    const aVal = (a[sortField] || '').toLowerCase();
    const bVal = (b[sortField] || '').toLowerCase();
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  const filteredVessels = sortedVessels.filter(v =>
    (v.vesselName && v.vesselName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (v.vesselNo && v.vesselNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const totalPages = Math.max(1, Math.ceil(filteredVessels.length / PAGE_SIZE));
  const displayVessels = filteredVessels.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredVessels, totalPages, currentPage]);

  // UI Block
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 py-10 px-2 md:px-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent flex items-center">
              <Truck className="w-8 h-8 mr-3 text-indigo-600" />
              Vessel Management
            </h1>
            <p className="text-gray-600 mt-2">Add, edit, and manage vessels in your system.</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search vessels..."
                  className="bg-transparent outline-none w-40"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={() => {
                setIsFormOpen(!isFormOpen);
                setEditingId(null);
                setNewVessel({ vesselNo: '', vesselName: '' });
              }}
              className={`px-5 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                ${isFormOpen
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}
              `}
            >
              {isFormOpen ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isFormOpen ? 'Close' : 'Add Vessel'}
            </button>
          </div>
        </div>

        {(feedback.msg) && (
          <div className={`mb-4 px-4 py-2 rounded border flex items-center font-semibold 
            ${feedback.type === 'success'
              ? 'bg-green-100 border-green-200 text-green-700'
              : 'bg-red-100 border-red-200 text-red-700'
            }`}>
            {feedback.type === 'success' ? <Check className="w-5 h-5 mr-2" /> : <X className="w-5 h-5 mr-2" />}
            {feedback.msg}
          </div>
        )}

        {/* Form */}
        {isFormOpen && (
          <div className="bg-white rounded-xl shadow-lg mb-8 border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center gap-3">
              <Plus className="w-5 h-5 text-white" />
              <span className="text-xl font-bold text-white">
                {editingId ? 'Edit Vessel' : 'Add Vessel'}
              </span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vessel Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter vessel name"
                    value={newVessel.vesselName}
                    onChange={e => setNewVessel({ ...newVessel, vesselName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vessel Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter vessel number"
                    value={newVessel.vesselNo}
                    onChange={e => setNewVessel({ ...newVessel, vesselNo: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex space-x-2 pt-6">
                <button
                  onClick={handleSaveVessel}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
                >
                  {editingId ? 'Update Vessel' : 'Add Vessel'}
                </button>
                <button
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingId(null);
                    setNewVessel({ vesselNo: '', vesselName: '' });
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Vessel List</h3>
            <div className="text-sm text-gray-500">
              Showing {filteredVessels.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
              {" - "}
              {Math.min(currentPage * PAGE_SIZE, filteredVessels.length)} of {filteredVessels.length}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th
                    onClick={() => handleSort('vesselNo')}
                    className="cursor-pointer px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider select-none"
                  >
                    Vessel Number
                    {sortField === 'vesselNo' && (sortDirection === 'asc' ? <ChevronUp className="inline ml-1 w-3 h-3" /> : <ChevronDown className="inline ml-1 w-3 h-3" />)}
                  </th>
                  <th
                    onClick={() => handleSort('vesselName')}
                    className="cursor-pointer px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider select-none"
                  >
                    Vessel Name
                    {sortField === 'vesselName' && (sortDirection === 'asc' ? <ChevronUp className="inline ml-1 w-3 h-3" /> : <ChevronDown className="inline ml-1 w-3 h-3" />)}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider select-none">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider select-none">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayVessels.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-400">
                      No vessels found.
                    </td>
                  </tr>
                ) : (
                  displayVessels.map((vessel) => (
                    <tr key={vessel.id} className="hover:bg-indigo-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{vessel.vesselNo || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{vessel.vesselName || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => toggleStatus(vessel.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-150 ${
                            vessel.status === 'Active'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {vessel.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-3">
                        <button
                          onClick={() => handleEdit(vessel)}
                          title="Edit Vessel"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(vessel.id)}
                          title="Delete Vessel"
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-gray-50 via-white to-indigo-50 border-t border-gray-100">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg border ${currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-indigo-700 hover:bg-indigo-50'}`}
            >
              <ChevronLeft className="w-4 h-4 inline" /> Previous
            </button>
            <div className="text-sm text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1 rounded-lg border ${currentPage === totalPages || totalPages === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-indigo-700 hover:bg-indigo-50'}`}
            >
              Next <ChevronRight className="w-4 h-4 inline" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VesselDetailsPage;