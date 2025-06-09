// import { useState } from 'react';
// import { Package, Plus, Pencil, Trash2, ChevronDown, ChevronUp, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

// const CommodityManagementPage = () => {
//   const [commodities, setCommodities] = useState([
//     { id: 1, code: 'CMD001', name: 'Electronics', category: 'Consumer Goods', status: 'Active' },
//     { id: 2, code: 'CMD002', name: 'Textiles', category: 'Raw Materials', status: 'Active' },
//     { id: 3, code: 'CMD003', name: 'Automotive Parts', category: 'Industrial', status: 'Inactive' },
//     { id: 4, code: 'CMD004', name: 'Pharmaceuticals', category: 'Healthcare', status: 'Active' },
//     { id: 5, code: 'CMD005', name: 'Agricultural Products', category: 'Food', status: 'Active' },
//     { id: 6, code: 'CMD006', name: 'Chemicals', category: 'Industrial', status: 'Inactive' },
//   ]);
  
//   const [newCommodity, setNewCommodity] = useState({ name: '', category: '' });
//   const [isAdding, setIsAdding] = useState(true);
//   const [editingId, setEditingId] = useState(null);
//   const [sortField, setSortField] = useState('code');
//   const [sortDirection, setSortDirection] = useState('asc');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const categories = [
//     'Consumer Goods', 'Raw Materials', 'Industrial', 
//     'Healthcare', 'Food', 'Chemicals', 'Electronics'
//   ];

//   const handleAddCommodity = () => {
//     if (!newCommodity.name.trim()) return;
    
//     if (editingId !== null) {
//       // Update existing commodity
//       setCommodities(commodities.map(c => 
//         c.id === editingId ? { ...c, ...newCommodity } : c
//       ));
//       setEditingId(null);
//     } else {
//       // Add new commodity
//       const newCommodityWithId = {
//         ...newCommodity,
//         id: commodities.length + 1,
//         code: `CMD${String(commodities.length + 1).padStart(3, '0')}`,
//         status: 'Active'
//       };
//       setCommodities([...commodities, newCommodityWithId]);
//     }
    
//     setNewCommodity({ name: '', category: '' });
//   };

//   const handleEdit = (commodity) => {
//     setNewCommodity({ name: commodity.name, category: commodity.category });
//     setEditingId(commodity.id);
//     setIsAdding(true);
//   };

//   const handleDelete = (id) => {
//     setCommodities(commodities.filter(c => c.id !== id));
//   };

//   const toggleStatus = (id) => {
//     setCommodities(commodities.map(c => 
//       c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c
//     ));
//   };

//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   const sortedCommodities = [...commodities].sort((a, b) => {
//     if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
//     if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
//     return 0;
//   });

//   const filteredCommodities = sortedCommodities.filter(commodity => 
//     commodity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     commodity.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     commodity.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentCommodities = filteredCommodities.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredCommodities.length / itemsPerPage);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//               <Package className="w-8 h-8 mr-3 text-indigo-600" />
//               COMMODITY MANAGEMENT
//             </h1>
//             <p className="text-gray-600 mt-2">Manage all commodity information in your logistics system</p>
//           </div>
          
//           <div className="mt-4 md:mt-0 flex space-x-3">
//             <div className="relative">
//               <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
//                 <Search className="w-5 h-5 text-gray-400 mr-2" />
//                 <input
//                   type="text"
//                   placeholder="Search commodities..."
//                   className="bg-transparent outline-none w-40"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>
//             <button className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200 flex items-center">
//               <Filter className="w-5 h-5 text-gray-600 mr-2" />
//               Filter
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Add Commodity Form */}
//           <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
//               <h2 className="text-xl font-bold text-white flex items-center">
//                 <Plus className="w-5 h-5 mr-2" />
//                 {editingId ? 'Edit Commodity' : 'Add New Commodity'}
//               </h2>
//             </div>
            
//             <div className="p-6">
//               <div className="space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Commodity Name <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Package className="w-5 h-5 text-gray-400" />
//                     </div>
//                     <input
//                       type="text"
//                       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       placeholder="Enter commodity name"
//                       value={newCommodity.name}
//                       onChange={(e) => setNewCommodity({...newCommodity, name: e.target.value})}
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <ChevronDown className="w-5 h-5 text-gray-400" />
//                     </div>
//                     <select
//                       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
//                       value={newCommodity.category}
//                       onChange={(e) => setNewCommodity({...newCommodity, category: e.target.value})}
//                     >
//                       <option value="">Select category</option>
//                       {categories.map(cat => (
//                         <option key={cat} value={cat}>{cat}</option>
//                       ))}
//                     </select>
//                     <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                       <ChevronDown className="w-4 h-4 text-gray-400" />
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex space-x-3 pt-2">
//                   <button
//                     onClick={handleAddCommodity}
//                     className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1"
//                   >
//                     {editingId ? 'Update Commodity' : 'Add Commodity'}
//                   </button>
                  
//                   {isAdding && (
//                     <button
//                       onClick={() => {
//                         setEditingId(null);
//                         setNewCommodity({ name: '', category: '' });
//                       }}
//                       className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
//                     >
//                       Clear
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Stats Overview */}
//           <div className="grid grid-cols-2 gap-5">
//             <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
//               <div className="text-3xl font-bold">{commodities.length}</div>
//               <div className="text-sm mt-1">Total Commodities</div>
//               <div className="mt-4 flex items-center">
//                 <div className="text-xs bg-white/20 rounded-full px-2 py-1">
//                   +18% from last quarter
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
//               <div className="text-3xl font-bold">
//                 {commodities.filter(c => c.status === 'Active').length}
//               </div>
//               <div className="text-sm mt-1">Active Commodities</div>
//               <div className="mt-4 flex items-center">
//                 <div className="text-xs bg-white/20 rounded-full px-2 py-1">
//                   +12% from last quarter
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
//               <div className="text-3xl font-bold">
//                 {commodities.filter(c => c.status === 'Inactive').length}
//               </div>
//               <div className="text-sm mt-1">Inactive Commodities</div>
//               <div className="mt-4 flex items-center">
//                 <div className="text-xs bg-white/20 rounded-full px-2 py-1">
//                   -5% from last quarter
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
//               <div className="text-3xl font-bold">7</div>
//               <div className="text-sm mt-1">Categories</div>
//               <div className="mt-4 flex items-center">
//                 <div className="text-xs bg-white/20 rounded-full px-2 py-1">
//                   +2 new this year
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Commodities Table */}
//         <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//             <h3 className="text-lg font-semibold text-gray-800">All Commodities</h3>
//             <div className="text-sm text-gray-500">
//               Showing {Math.min(filteredCommodities.length, itemsPerPage)} of {filteredCommodities.length} commodities
//             </div>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                     onClick={() => handleSort('code')}
//                   >
//                     <div className="flex items-center">
//                       Commodity Code
//                       {sortField === 'code' && (
//                         sortDirection === 'asc' ? 
//                         <ChevronUp className="w-4 h-4 ml-1" /> : 
//                         <ChevronDown className="w-4 h-4 ml-1" />
//                       )}
//                     </div>
//                   </th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                     onClick={() => handleSort('name')}
//                   >
//                     <div className="flex items-center">
//                       Commodity Name
//                       {sortField === 'name' && (
//                         sortDirection === 'asc' ? 
//                         <ChevronUp className="w-4 h-4 ml-1" /> : 
//                         <ChevronDown className="w-4 h-4 ml-1" />
//                       )}
//                     </div>
//                   </th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                     onClick={() => handleSort('category')}
//                   >
//                     <div className="flex items-center">
//                       Category
//                       {sortField === 'category' && (
//                         sortDirection === 'asc' ? 
//                         <ChevronUp className="w-4 h-4 ml-1" /> : 
//                         <ChevronDown className="w-4 h-4 ml-1" />
//                       )}
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {currentCommodities.length > 0 ? (
//                   currentCommodities.map((commodity) => (
//                     <tr key={commodity.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-indigo-600">{commodity.code}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
//                             <Package className="w-4 h-4 text-white" />
//                           </div>
//                           <div className="text-sm font-medium text-gray-900">{commodity.name}</div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900">{commodity.category}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span 
//                           className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
//                             commodity.status === 'Active' 
//                               ? 'bg-green-100 text-green-800' 
//                               : 'bg-red-100 text-red-800'
//                           }`}
//                           onClick={() => toggleStatus(commodity.id)}
//                         >
//                           {commodity.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button 
//                           onClick={() => handleEdit(commodity)}
//                           className="text-indigo-600 hover:text-indigo-900 mr-4"
//                         >
//                           <Pencil className="w-5 h-5" />
//                         </button>
//                         <button 
//                           onClick={() => handleDelete(commodity.id)}
//                           className="text-red-600 hover:text-red-900"
//                         >
//                           <Trash2 className="w-5 h-5" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <Package className="w-16 h-16 text-gray-300 mb-4" />
//                         <h4 className="text-lg font-medium text-gray-500">No commodities found</h4>
//                         <p className="text-gray-400 mt-1">Add a new commodity to get started</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
          
//           {/* Pagination */}
//           {filteredCommodities.length > itemsPerPage && (
//             <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
//               <div className="text-sm text-gray-700">
//                 Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className={`px-3 py-1 rounded-lg border ${
//                     currentPage === 1 
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
//                       : 'bg-white text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   <ChevronLeft className="w-5 h-5" />
//                 </button>
                
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                   <button
//                     key={page}
//                     onClick={() => setCurrentPage(page)}
//                     className={`px-3 py-1 rounded-lg border ${
//                       currentPage === page
//                         ? 'bg-indigo-600 text-white border-indigo-600'
//                         : 'bg-white text-gray-700 hover:bg-gray-50'
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 ))}
                
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className={`px-3 py-1 rounded-lg border ${
//                     currentPage === totalPages
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                       : 'bg-white text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CommodityManagementPage;

import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Plus, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Pencil, Trash2, AlertCircle, CheckCircle } from 'lucide-react';


const CommodityManagementPage = () => {
  const [commodities, setCommodities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCommodity, setNewCommodity] = useState({ name: '', category_sino: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const itemsPerPage = 10;
  const [isAdding, setIsAdding] = useState(false);

  // Base API URL - adjust according to your backend setup
  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch categories from database
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      // Filter only active categories for the dropdown
      const activeCategories = data.filter(cat => cat.status === 'Active');
      setCategories(activeCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    }
  };

  // Fetch commodities from database
  const fetchCommodities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/commodities`);
      if (!response.ok) throw new Error('Failed to fetch commodities');
      const data = await response.json();
      setCommodities(data);
    } catch (err) {
      console.error('Error fetching commodities:', err);
      setError('Failed to load commodities');
    } finally {
      setLoading(false);
    }
  };

  // Add new commodity to database
  const addCommodity = async (commodityData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/commodities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commodityData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add commodity');
      }
      
      const newCommodity = await response.json();
      setCommodities(prev => [...prev, newCommodity]);
      setSuccess('Commodity added successfully!');
      return true;
    } catch (err) {
      console.error('Error adding commodity:', err);
      setError(err.message || 'Failed to add commodity');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update commodity in database
  const updateCommodity = async (id, commodityData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/commodities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commodityData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update commodity');
      }
      
      const updatedCommodity = await response.json();
      setCommodities(prev => prev.map(c => c.id === id ? updatedCommodity : c));
      setSuccess('Commodity updated successfully!');
      return true;
    } catch (err) {
      console.error('Error updating commodity:', err);
      setError(err.message || 'Failed to update commodity');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete commodity from database
  const deleteCommodity = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/commodities/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete commodity');
      }
      
      setCommodities(prev => prev.filter(c => c.id !== id));
      setSuccess('Commodity deleted successfully!');
      return true;
    } catch (err) {
      console.error('Error deleting commodity:', err);
      setError(err.message || 'Failed to delete commodity');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Toggle commodity status (Active/Inactive)
  const toggleCommodityStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      setLoading(true);
      const response = await post(`${API_BASE_URL}/commodities/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }
      
      setCommodities(prev => prev.map(c => 
        c.id === id ? { ...c, status: newStatus } : c
      ));
      setSuccess(`Commodity status updated to ${newStatus}!`);
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchCategories();
    fetchCommodities();
  }, []);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Get category name by sino
  const getCategoryName = (categorySino) => {
    const category = categories.find(cat => cat.sino === categorySino);
    return category ? category.name : 'Unknown Category';
  };

  // Filter and sort commodities
  const filteredCommodities = commodities
    .filter(c => {
      const categoryName = getCategoryName(c.category_sino);
      return (
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toString().includes(searchTerm) ||
        (c.code && c.code.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });

  if (sortField) {
    filteredCommodities.sort((a, b) => {
      let aField, bField;
      
      if (sortField === 'category_name') {
        aField = getCategoryName(a.category_sino);
        bField = getCategoryName(b.category_sino);
      } else {
        aField = a[sortField] || '';
        bField = b[sortField] || '';
      }
      
      if (typeof aField === 'string') aField = aField.toLowerCase();
      if (typeof bField === 'string') bField = bField.toLowerCase();

      if (aField < bField) return sortDirection === 'asc' ? -1 : 1;
      if (aField > bField) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const totalPages = Math.ceil(filteredCommodities.length / itemsPerPage);
  const currentCommodities = filteredCommodities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddCommodity = async () => {
    if (!newCommodity.name.trim()) {
      setError('Commodity name is required');
      return;
    }

    if (!newCommodity.category_sino) {
      setError('Please select a category');
      return;
    }

    const commodityData = {
      name: newCommodity.name.trim(),
      category_sino: parseInt(newCommodity.category_sino),
      status: 'Active'
    };

    let success = false;
    if (editingId) {
      success = await updateCommodity(editingId, commodityData);
    } else {
      success = await addCommodity(commodityData);
    }

    if (success) {
      setNewCommodity({ name: '', category_sino: '' });
      setEditingId(null);
      setIsAdding(false);
    }
  };

  const handleEdit = (commodity) => {
    setEditingId(commodity.id);
    setNewCommodity({ 
      name: commodity.name, 
      category_sino: commodity.category_sino?.toString() || '' 
    });
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this commodity?')) {
      await deleteCommodity(id);
    }
  };

  const toggleStatus = async (commodity) => {
    await toggleCommodityStatus(commodity.id, commodity.status);
  };

  const handleClear = () => {
    setEditingId(null);
    setNewCommodity({ name: '', category_sino: '' });
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Alert Messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Package className="w-8 h-8 mr-3 text-indigo-600" />
              COMMODITY MANAGEMENT
            </h1>
            <p className="text-gray-600 mt-2">Manage all commodity information in your logistics system</p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
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
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="bg-indigo-600 text-white rounded-lg px-4 py-2 shadow-sm flex items-center justify-center hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              {isAdding ? 'Cancel' : 'Add Commodity'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Commodity Form */}
          {isAdding && (
            <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden">
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
                        onChange={(e) => setNewCommodity({ ...newCommodity, name: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                        value={newCommodity.category_sino}
                        onChange={(e) => setNewCommodity({ ...newCommodity, category_sino: e.target.value })}
                        disabled={loading}
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat.sino} value={cat.sino}>
                            {cat.name}
                          </option>
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
                      disabled={loading}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : (editingId ? 'Update' : 'Add')}
                    </button>

                    <button
                      onClick={handleClear}
                      disabled={loading}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Overview */}
          <div className={`grid grid-cols-2 gap-4 ${isAdding ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-3xl font-bold">{commodities.length}</div>
              <div className="text-sm mt-1">Total Commodities</div>
              <div className="mt-4 flex items-center">
                <div className="text-xs bg-white/20 rounded-full px-2 py-1">
                  Database Connected
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
                  Real-time Data
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
                  Auto Updated
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-3xl font-bold">{categories.length}</div>
              <div className="text-sm mt-1">Active Categories</div>
              <div className="mt-4 flex items-center">
                <div className="text-xs bg-white/20 rounded-full px-2 py-1">
                  From Database
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Commodities Table */}
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Package className="w-5 h-5 mr-2 text-indigo-600" />
              Commodity List ({filteredCommodities.length})
            </h2>
            
            {loading && (
              <div className="text-sm text-gray-500 flex items-center">
                <div className="animate-spin w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full mr-2"></div>
                Loading...
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b border-gray-200 bg-gray-50 font-semibold text-gray-600">
                <tr>
                  <th
                    className="cursor-pointer px-6 py-3 hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      ID
                      {sortField === 'id' &&
                        (sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer px-6 py-3 hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Commodity Name
                      {sortField === 'name' &&
                        (sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer px-6 py-3 hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('category_name')}
                  >
                    <div className="flex items-center">
                      Category
                      {sortField === 'category_name' &&
                        (sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCommodities.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <div className="text-lg font-medium">No commodities found</div>
                      <div className="text-sm mt-1">
                        {searchTerm ? 'Try adjusting your search criteria' : 'Add a new commodity to get started'}
                      </div>
                    </td>
                  </tr>
                )}
                {currentCommodities.map((commodity) => (
                  <tr
                    key={commodity.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-indigo-600">
                      #{commodity.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                          <Package className="w-4 h-4 text-white" />
                        </div>
                        <div className="font-medium text-gray-900">{commodity.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getCategoryName(commodity.category_sino)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(commodity)}
                        disabled={loading}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          commodity.status === 'Active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {commodity.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {commodity.created_at 
                        ? new Date(commodity.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : 'N/A'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(commodity)}
                          disabled={loading}
                          className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Edit commodity"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(commodity.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Delete commodity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center px-3 py-1 rounded-md border text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-100'
                      : 'border-indigo-300 text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
              </div>

              <div className="text-sm text-gray-700 font-medium">
                Page {currentPage} of {totalPages} ({filteredCommodities.length} total)
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-3 py-1 rounded-md border text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-100'
                      : 'border-indigo-300 text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
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