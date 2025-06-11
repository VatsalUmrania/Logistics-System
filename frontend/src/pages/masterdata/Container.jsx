import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Plus, Pencil, Trash2, ChevronDown, Search, ChevronLeft, ChevronRight, X
} from 'lucide-react';

const ContainerDetailsPage = () => {
  const [containers, setContainers] = useState([]);
  const [newContainer, setNewContainer] = useState({ name: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const API_URL = 'http://localhost:5000/api/containers';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication token missing');
    return { 'Authorization': `Bearer ${token}` };
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  const fetchContainers = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: getAuthHeaders(),  // Add the authentication header
      });
      setContainers(response.data);
    } catch (error) {
      console.error('Failed to fetch containers:', error);
      alert('Error fetching containers. Please check your authentication or try again later.');
    }
  };
  
  const handleAddContainer = async () => {
    if (!newContainer.name.trim()) return;
  
    try {
      const config = {
        headers: getAuthHeaders(),  // Add the authentication headers
      };
  
      if (editingId !== null) {
        // Update container if editingId is not null
        await axios.put(`${API_URL}/${editingId}`, newContainer, config);
      } else {
        // Add new container
        await axios.post(API_URL, { ...newContainer, status: 'Active' }, config);
      }
      fetchContainers();
      setNewContainer({ name: '' });
      setEditingId(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to save container:', error);
    }
  };
  
  const handleEdit = (container) => {
    setNewContainer({ name: container.name });
    setEditingId(container.id);
    setIsAdding(true);
  };
  
  const handleDelete = async (id) => {
    try {
      const config = {
        headers: getAuthHeaders(),  // Add the authentication headers
      };
      await axios.delete(`${API_URL}/${id}`, config);
      fetchContainers();
    } catch (error) {
      console.error('Failed to delete container:', error);
    }
  };
  
  const toggleStatus = async (id) => {
    const container = containers.find(c => c.id === id);
    const updatedStatus = container.status === 'Active' ? 'Inactive' : 'Active';
  
    try {
      const config = {
        headers: getAuthHeaders(),  // Add the authentication headers
      };
      await axios.put(`${API_URL}/${id}`, { status: updatedStatus }, config);
      fetchContainers();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };
  

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedContainers = [...containers].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredContainers = sortedContainers.filter(container =>
    container.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContainers = filteredContainers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContainers.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Container className="w-8 h-8 mr-3 text-indigo-600" />
              CONTAINER DETAILS
            </h1>
            <p className="text-gray-600 mt-2">Manage container types for your logistics operations</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search containers..."
                  className="bg-transparent outline-none w-40"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={() => {
                setIsAdding(!isAdding);
                setEditingId(null);
                setNewContainer({ name: '' });
              }}
              className={`px-5 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAdding
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}
              `}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Close' : 'Add Container'}
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                {editingId ? 'Edit Container Details' : 'Add New Container Type'}
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Container Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Container className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter container type (e.g. 20 ft)"
                    value={newContainer.name}
                    onChange={(e) => setNewContainer({ ...newContainer, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-6">
                <button
                  onClick={handleAddContainer}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1 shadow-md"
                >
                  {editingId ? 'Update Container' : 'Add Container'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">CONTAINER LIST</h3>
            <div className="text-sm text-gray-500">
              Showing {Math.min(filteredContainers.length, itemsPerPage)} of {filteredContainers.length} containers
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.I.No.</th>
                  <th onClick={() => handleSort('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                    <div className="flex items-center">
                      Container Name
                      {sortField === 'name' && (
                        sortDirection === 'asc'
                          ? <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" />
                          : <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentContainers.map((container, index) => (
                  <tr key={container.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{container.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                          <Container className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{container.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${container.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'}`}
                        onClick={() => toggleStatus(container.id)}
                      >
                        {container.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(container)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(container.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredContainers.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span></div>
              <div className="flex space-x-2">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 rounded-lg border bg-white hover:bg-gray-50">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded-lg border ${currentPage === i + 1 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 rounded-lg border bg-white hover:bg-gray-50">
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

export default ContainerDetailsPage;
