import { useState } from 'react';
import { Package, Plus, Pencil, Trash2, ChevronDown, ChevronUp, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const CommodityManagementPage = () => {
  const [commodities, setCommodities] = useState([
    { id: 1, code: 'CMD001', name: 'Electronics', category: 'Consumer Goods', status: 'Active' },
    { id: 2, code: 'CMD002', name: 'Textiles', category: 'Raw Materials', status: 'Active' },
    { id: 3, code: 'CMD003', name: 'Automotive Parts', category: 'Industrial', status: 'Inactive' },
    { id: 4, code: 'CMD004', name: 'Pharmaceuticals', category: 'Healthcare', status: 'Active' },
    { id: 5, code: 'CMD005', name: 'Agricultural Products', category: 'Food', status: 'Active' },
    { id: 6, code: 'CMD006', name: 'Chemicals', category: 'Industrial', status: 'Inactive' },
  ]);
  
  const [newCommodity, setNewCommodity] = useState({ name: '', category: '' });
  const [isAdding, setIsAdding] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('code');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const categories = [
    'Consumer Goods', 'Raw Materials', 'Industrial', 
    'Healthcare', 'Food', 'Chemicals', 'Electronics'
  ];

  const handleAddCommodity = () => {
    if (!newCommodity.name.trim()) return;
    
    if (editingId !== null) {
      // Update existing commodity
      setCommodities(commodities.map(c => 
        c.id === editingId ? { ...c, ...newCommodity } : c
      ));
      setEditingId(null);
    } else {
      // Add new commodity
      const newCommodityWithId = {
        ...newCommodity,
        id: commodities.length + 1,
        code: `CMD${String(commodities.length + 1).padStart(3, '0')}`,
        status: 'Active'
      };
      setCommodities([...commodities, newCommodityWithId]);
    }
    
    setNewCommodity({ name: '', category: '' });
  };

  const handleEdit = (commodity) => {
    setNewCommodity({ name: commodity.name, category: commodity.category });
    setEditingId(commodity.id);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    setCommodities(commodities.filter(c => c.id !== id));
  };

  const toggleStatus = (id) => {
    setCommodities(commodities.map(c => 
      c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c
    ));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCommodities = [...commodities].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredCommodities = sortedCommodities.filter(commodity => 
    commodity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commodity.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commodity.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCommodities = filteredCommodities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCommodities.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Package className="w-8 h-8 mr-3 text-indigo-600" />
              COMMODITY MANAGEMENT
            </h1>
            <p className="text-gray-600 mt-2">Manage all commodity information in your logistics system</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
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
            <button className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200 flex items-center">
              <Filter className="w-5 h-5 text-gray-600 mr-2" />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Commodity Form */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                      onChange={(e) => setNewCommodity({...newCommodity, name: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </div>
                    <select
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                      value={newCommodity.category}
                      onChange={(e) => setNewCommodity({...newCommodity, category: e.target.value})}
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
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
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1"
                  >
                    {editingId ? 'Update Commodity' : 'Add Commodity'}
                  </button>
                  
                  {isAdding && (
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setNewCommodity({ name: '', category: '' });
                      }}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-3xl font-bold">{commodities.length}</div>
              <div className="text-sm mt-1">Total Commodities</div>
              <div className="mt-4 flex items-center">
                <div className="text-xs bg-white/20 rounded-full px-2 py-1">
                  +18% from last quarter
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
                  +12% from last quarter
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
                  -5% from last quarter
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-3xl font-bold">7</div>
              <div className="text-sm mt-1">Categories</div>
              <div className="mt-4 flex items-center">
                <div className="text-xs bg-white/20 rounded-full px-2 py-1">
                  +2 new this year
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Commodities Table */}
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">All Commodities</h3>
            <div className="text-sm text-gray-500">
              Showing {Math.min(filteredCommodities.length, itemsPerPage)} of {filteredCommodities.length} commodities
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('code')}
                  >
                    <div className="flex items-center">
                      Commodity Code
                      {sortField === 'code' && (
                        sortDirection === 'asc' ? 
                        <ChevronUp className="w-4 h-4 ml-1" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Commodity Name
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? 
                        <ChevronUp className="w-4 h-4 ml-1" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center">
                      Category
                      {sortField === 'category' && (
                        sortDirection === 'asc' ? 
                        <ChevronUp className="w-4 h-4 ml-1" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentCommodities.length > 0 ? (
                  currentCommodities.map((commodity) => (
                    <tr key={commodity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-indigo-600">{commodity.code}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                            <Package className="w-4 h-4 text-white" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">{commodity.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{commodity.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                            commodity.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                          onClick={() => toggleStatus(commodity.id)}
                        >
                          {commodity.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEdit(commodity)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(commodity.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Package className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No commodities found</h4>
                        <p className="text-gray-400 mt-1">Add a new commodity to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredCommodities.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg border ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg border ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg border ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
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

export default CommodityManagementPage;