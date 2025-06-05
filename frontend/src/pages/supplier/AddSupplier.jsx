import { useState } from 'react';
import { Truck, Plus, Pencil, Trash2, ChevronDown, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

const AddSupplierPage = () => {
  // Initial suppliers data from the provided image
  const initialSuppliers = [
    { 
      id: 1,
      name: 'ALASR INTERNATIONAL TRADING EST', 
      number: '106', 
      address: 'JEDDAH', 
      registerDate: '2025-04-01', 
      phone1: '0126430758', 
      valNo: '302078282700003', 
      credit: '0' 
    },
    { 
      id: 2,
      name: 'ROAD LINK LOGISTICS SERVICES', 
      number: '105', 
      address: 'DAMAMM', 
      registerDate: '2025-04-01', 
      phone1: '5500560045', 
      valNo: '312709465400003', 
      credit: '0' 
    },
    { 
      id: 3,
      name: 'EJAD SOLUTION LOGISTICS SERVICES', 
      number: '104', 
      address: 'RIVADH SULAY DISTRICT, RIVADH, KSA', 
      registerDate: '2025-03-01', 
      phone1: '0598882234', 
      valNo: '311415505000003', 
      credit: '0' 
    },
    { 
      id: 4,
      name: 'AHMED RASHID BIN AHMED BAKHSHWAN LOGIST', 
      number: '100', 
      address: 'AL TOBAR, AL JAKWHARAH DIST, DAMAMM', 
      registerDate: '2025-01-26', 
      phone1: '055555655', 
      valNo: '300388828300003', 
      credit: '0' 
    },
    { 
      id: 5,
      name: 'ALAM ENGAZ CO.LTD PORT SERVICES', 
      number: '99', 
      address: 'DAMAMM KSA 32253', 
      registerDate: '2024-11-01', 
      phone1: '0541861794', 
      valNo: '31116155160003', 
      credit: '0' 
    },
  ];
  
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    phone1: '',
    number: '',
    valNo: '',
    otherDetails: '',
    address: '',
    phone2: '',
    creditLimit: '',
    registerDate: '',
  });
  
  const [isAdding, setIsAdding] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleAddSupplier = () => {
    if (!newSupplier.name.trim() || !newSupplier.number.trim()) return;
    
    if (editingId !== null) {
      // Update existing supplier
      setSuppliers(suppliers.map(s => 
        s.id === editingId ? { ...s, ...newSupplier } : s
      ));
      setEditingId(null);
    } else {
      // Add new supplier
      const newSupplierWithId = {
        ...newSupplier,
        id: suppliers.length + 1,
      };
      setSuppliers([...suppliers, newSupplierWithId]);
    }
    
    // Reset form
    setNewSupplier({
      name: '',
      phone1: '',
      number: '',
      valNo: '',
      otherDetails: '',
      address: '',
      phone2: '',
      creditLimit: '',
      registerDate: '',
    });
  };

  const handleEdit = (supplier) => {
    setNewSupplier({
      name: supplier.name,
      phone1: supplier.phone1,
      number: supplier.number,
      valNo: supplier.valNo,
      otherDetails: supplier.otherDetails || '',
      address: supplier.address,
      phone2: supplier.phone2 || '',
      creditLimit: supplier.creditLimit || '',
      registerDate: supplier.registerDate,
    });
    
    setEditingId(supplier.id);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSuppliers = [...suppliers].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredSuppliers = sortedSuppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone1.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Truck className="w-8 h-8 mr-3 text-indigo-600" />
              ADD SUPPLIER
            </h1>
            <p className="text-gray-600 mt-2">Manage suppliers for your logistics operations</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search suppliers..."
                  className="bg-transparent outline-none w-40"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className={`px-5 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}
              `}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Cancel' : 'Add Bank'}
            </button>
          </div>
        </div>

        {/* Add Supplier Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                {editingId ? 'Edit Supplier Details' : 'Add Supplier Details'}
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter supplier name"
                      value={newSupplier.name}
                      onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supplier Phone No.1 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter phone number"
                        value={newSupplier.phone1}
                        onChange={(e) => setNewSupplier({...newSupplier, phone1: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supplier Phone No.2
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter secondary phone"
                        value={newSupplier.phone2}
                        onChange={(e) => setNewSupplier({...newSupplier, phone2: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supplier No <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter supplier number"
                        value={newSupplier.number}
                        onChange={(e) => setNewSupplier({...newSupplier, number: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supplier Val No <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter validation number"
                        value={newSupplier.valNo}
                        onChange={(e) => setNewSupplier({...newSupplier, valNo: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Other Details
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter additional details"
                      rows="2"
                      value={newSupplier.otherDetails}
                      onChange={(e) => setNewSupplier({...newSupplier, otherDetails: e.target.value})}
                    ></textarea>
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter supplier address"
                      rows="3"
                      value={newSupplier.address}
                      onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Credit Limit
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter credit limit"
                        value={newSupplier.creditLimit}
                        onChange={(e) => setNewSupplier({...newSupplier, creditLimit: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Register Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={newSupplier.registerDate}
                        onChange={(e) => setNewSupplier({...newSupplier, registerDate: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-6">
                <button
                  onClick={handleAddSupplier}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1 shadow-md flex items-center justify-center"
                >
                  {editingId ? 'Update Supplier' : 'Save Supplier Details'}
                </button>
                
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setNewSupplier({
                      name: '',
                      phone1: '',
                      number: '',
                      valNo: '',
                      otherDetails: '',
                      address: '',
                      phone2: '',
                      creditLimit: '',
                      registerDate: '',
                    });
                  }}
                  
                >
                
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Supplier List Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">SUPPLIER LIST</h3>
            <div className="text-sm text-gray-500">
              Showing {Math.min(filteredSuppliers.length, itemsPerPage)} of {filteredSuppliers.length} suppliers
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SLNo
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Supplier Name
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? 
                        <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('number')}
                  >
                    <div className="flex items-center">
                      Supplier No
                      {sortField === 'number' && (
                        sortDirection === 'asc' ? 
                        <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('registerDate')}
                  >
                    <div className="flex items-center">
                      Register Date
                      {sortField === 'registerDate' && (
                        sortDirection === 'asc' ? 
                        <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone No.1
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier Val No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credit
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentSuppliers.length > 0 ? (
                  currentSuppliers.map((supplier, index) => (
                    <tr key={supplier.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{supplier.number}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{supplier.address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{supplier.registerDate}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{supplier.phone1}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{supplier.valNo}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">SAR {supplier.credit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEdit(supplier)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(supplier.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Truck className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No suppliers found</h4>
                        <p className="text-gray-400 mt-1">Add a new supplier to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredSuppliers.length > itemsPerPage && (
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

export default AddSupplierPage;