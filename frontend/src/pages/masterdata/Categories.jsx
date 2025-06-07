// import { useState } from 'react';
// import { Layers, Plus, Pencil, Trash2, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';

// const CategoriesManagementPage = () => {
//   const [categories, setCategories] = useState([
//     { id: 1, code: 'CTG001', name: 'Electronics', status: 'Active' },
//     { id: 2, code: 'CTG002', name: 'Textiles', status: 'Active' },
//     { id: 3, code: 'CTG003', name: 'Automotive Parts', status: 'Inactive' },
//     { id: 4, code: 'CTG004', name: 'Pharmaceuticals', status: 'Active' },
//     { id: 5, code: 'CTG005', name: 'Agricultural Products', status: 'Active' },
//     { id: 6, code: 'CTG006', name: 'Chemicals', status: 'Inactive' },
//   ]);
  
//   const [newCategory, setNewCategory] = useState({
//     code: '',



//     name: ''
//   });
  
//   const [isAdding, setIsAdding] = useState(true);
//   const [editingId, setEditingId] = useState(null);
//   const [sortField, setSortField] = useState('code');
//   const [sortDirection, setSortDirection] = useState('asc');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const handleAddCategory = () => {
//     if (!newCategory.code.trim() || !newCategory.name.trim()) return;
    
//     if (editingId !== null) {
//       // Update existing category
//       setCategories(categories.map(c => 
//         c.id === editingId ? { ...c, ...newCategory } : c
//       ));
//       setEditingId(null);
//     } else {
//       // Add new category
//       const newCategoryWithId = {
//         ...newCategory,
//         id: categories.length + 1,
//         status: 'Active'
//       };
//       setCategories([...categories, newCategoryWithId]);
//     }
    
//     setNewCategory({
//       code: '',
//       name: ''
//     });
//   };

//   const handleEdit = (category) => {
//     setNewCategory({ code: category.code, name: category.name });
//     setEditingId(category.id);
//     setIsAdding(true);
//   };

//   const handleDelete = (id) => {
//     setCategories(categories.filter(c => c.id !== id));
//   };

//   const toggleStatus = (id) => {
//     setCategories(categories.map(c => 
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

//   const sortedCategories = [...categories].sort((a, b) => {
//     if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
//     if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
//     return 0;
//   });

//   const filteredCategories = sortedCategories.filter(category => 
//     category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     category.code.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//               <Layers className="w-8 h-8 mr-3 text-indigo-600" />
//               CATEGORIES MANAGEMENT
//             </h1>
//             <p className="text-gray-600 mt-2">Organize your logistics categories</p>
//           </div>
          
//           <div className="mt-4 md:mt-0 flex space-x-3">
//             <div className="relative">
//               <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
//                 <Search className="w-5 h-5 text-gray-400 mr-2" />
//                 <input
//                   type="text"
//                   placeholder="Search categories..."
//                   className="bg-transparent outline-none w-40"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Add Category Form */}
//           <div className="bg-white rounded-xl shadow-lg overflow-hidden lg:col-span-1">
//             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
//               <h2 className="text-xl font-bold text-white flex items-center">
//                 <Plus className="w-5 h-5 mr-2" />
//                 {editingId ? 'Edit Category' : 'Add New Category'}
//               </h2>
//             </div>
            
//             <div className="p-6">
//               <div className="space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category Code <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Layers className="w-5 h-5 text-gray-400" />
//                     </div>
//                     <input
//                       type="text"
//                       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       placeholder="Enter category code"
//                       value={newCategory.code}
//                       onChange={(e) => setNewCategory({...newCategory, code: e.target.value})}
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     placeholder="Enter category name"
//                     value={newCategory.name}
//                     onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
//                   />
//                 </div>
                
//                 <div className="flex space-x-3 pt-2">
//                   <button
//                     onClick={handleAddCategory}
//                     className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1"
//                   >
//                     {editingId ? 'Update Category' : 'Add Category'}
//                   </button>
                  
//                   {isAdding && (
//                     <button
//                       onClick={() => {
//                         setEditingId(null);
//                         setNewCategory({ code: '', name: '' });
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

//           {/* Categories List */}
//           <div className="bg-white rounded-xl shadow-lg overflow-hidden lg:col-span-2">
//             <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//               <h3 className="text-lg font-semibold text-gray-800">CATEGORIES LIST</h3>
//               <div className="text-sm text-gray-500">
//                 Showing {Math.min(filteredCategories.length, itemsPerPage)} of {filteredCategories.length} categories
//               </div>
//             </div>
            
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       SINO
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                       onClick={() => handleSort('code')}
//                     >
//                       <div className="flex items-center">
//                         Category Code
//                         {sortField === 'code' && (
//                           sortDirection === 'asc' ? 
//                           <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
//                           <ChevronDown className="w-4 h-4 ml-1" />
//                         )}
//                       </div>
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                       onClick={() => handleSort('name')}
//                     >
//                       <div className="flex items-center">
//                         Category Name
//                         {sortField === 'name' && (
//                           sortDirection === 'asc' ? 
//                           <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
//                           <ChevronDown className="w-4 h-4 ml-1" />
//                         )}
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {currentCategories.length > 0 ? (
//                     currentCategories.map((category, index) => (
//                       <tr key={category.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">
//                             {(currentPage - 1) * itemsPerPage + index + 1}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-sm font-medium text-indigo-600">{category.code}</div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center">
//                             <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
//                               <Layers className="w-4 h-4 text-white" />
//                             </div>
//                             <div className="text-sm font-medium text-gray-900">{category.name}</div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-center">
//                           <span 
//                             className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
//                               category.status === 'Active' 
//                                 ? 'bg-green-100 text-green-800' 
//                                 : 'bg-red-100 text-red-800'
//                             }`}
//                             onClick={() => toggleStatus(category.id)}
//                           >
//                             {category.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                           <button 
//                             onClick={() => handleEdit(category)}
//                             className="text-indigo-600 hover:text-indigo-900 mr-4"
//                           >
//                             <Pencil className="w-5 h-5" />
//                           </button>
//                           <button 
//                             onClick={() => handleDelete(category.id)}
//                             className="text-red-600 hover:text-red-900"
//                           >
//                             <Trash2 className="w-5 h-5" />
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="5" className="px-6 py-12 text-center">
//                         <div className="flex flex-col items-center justify-center">
//                           <Layers className="w-16 h-16 text-gray-300 mb-4" />
//                           <h4 className="text-lg font-medium text-gray-500">No categories found</h4>
//                           <p className="text-gray-400 mt-1">Add a new category to get started</p>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
            
//             {/* Pagination */}
//             {filteredCategories.length > itemsPerPage && (
//               <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
//                 <div className="text-sm text-gray-700">
//                   Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
//                 </div>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                     className={`px-3 py-1 rounded-lg border ${
//                       currentPage === 1 
//                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
//                         : 'bg-white text-gray-700 hover:bg-gray-50'
//                     }`}
//                   >
//                     <ChevronLeft className="w-5 h-5" />
//                   </button>
                  
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                     <button
//                       key={page}
//                       onClick={() => setCurrentPage(page)}
//                       className={`px-3 py-1 rounded-lg border ${
//                         currentPage === page
//                           ? 'bg-indigo-600 text-white border-indigo-600'
//                           : 'bg-white text-gray-700 hover:bg-gray-50'
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   ))}
                  
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     className={`px-3 py-1 rounded-lg border ${
//                       currentPage === totalPages
//                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                         : 'bg-white text-gray-700 hover:bg-gray-50'
//                     }`}
//                   >
//                     <ChevronRight className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategoriesManagementPage;

import { useState, useEffect } from 'react';
import { Layers,Plus, Pencil, Trash2, ChevronDown, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/categories';

const CategoryInformationPage = () => {
  const [categories, setCategories] = useState([]);

  const [newCategory, setNewCategory] = useState({
    code: '',
    name: '',
    description: '',
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Convert API snake_case object to camelCase
  const toCamelCase = (obj) => ({
    id: obj.id,
    code: obj.code,
    name: obj.name,
    description: obj.description,
    createdAt: obj.created_at,
  });

  // Convert camelCase to snake_case for API
  const formatToSnakeCase = (category) => ({
    code: category.code,
    name: category.name,
    description: category.description,
  });

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      
      // Convert the data to camel case using the 'toCamelCase' function
      const categories = data.map(toCamelCase);
      
      // Log the fetched data for debugging
      console.log('Fetched Categories:', data[0].sino);
      
      // Set the categories in the state
      setCategories(categories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };
  

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add or update category handler
  const handleAddCategory = async () => {
    if (!newCategory.code.trim() || !newCategory.name.trim()) return;
  
    try {
      // Format data before sending (exclude `id`)
      const categoryData = {
        code: newCategory.code,
        name: newCategory.name,
        status: newCategory.status, // Add more fields if necessary
      };
  
      let res;
      if (editingId !== null) {
        // Update existing category
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData),
        });
      } else {
        // Add new category
        res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData),
        });
      }
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add category');
      }
  
      // Fetch categories after adding/updating
      await fetchCategories();
      setNewCategory({
        code: '',
        name: '',
        status: 'Active',  // Default status value, can be changed as needed
      });
      setEditingId(null);
      setIsAdding(false);
    } catch (err) {
      console.error('Error:', err);
      alert(err.message);
    }
  };
  

  // Delete category handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete category');
      await fetchCategories();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Edit category handler (populate form)
  const handleEdit = (category) => {
    setNewCategory({
      code: category.code,
      name: category.name,
      description: category.description,
    });
    setEditingId(category.id);
    setIsAdding(true);
  };

  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleStatus = async (id) => {
    // First, update the status locally to immediately reflect the change in the UI
    setCategories(categories.map(category => 
      category.id === id 
        ? { ...category, status: category.status === 'Active' ? 'Inactive' : 'Active' } 
        : category
    ));
  
    // Then, update the status in the database via an API call
    try {
      const categoryToUpdate = categories.find(category => category.id === id);
      const updatedCategory = { ...categoryToUpdate, status: categoryToUpdate.status === 'Active' ? 'Inactive' : 'Active' };
      
      // Send the updated status to the backend
      await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: updatedCategory.status }),
      });
  
      console.log(`Category ${id} status updated to ${updatedCategory.status}`);
    } catch (err) {
      console.error('Error updating status:', err);
      // Optionally, revert the status change if the update fails
      setCategories(categories.map(category => 
        category.id === id 
          ? { ...category, status: category.status === 'Active' ? 'Inactive' : 'Active' } 
          : category
      ));
    }
  };
  
  // Sorted & filtered categories for display
  const sortedCategories = [...categories].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredCategories = sortedCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Layers className="w-8 h-8 mr-3 text-indigo-600" />
              CATEGORIES MANAGEMENT
            </h1>
            <p className="text-gray-600 mt-2">Organize your logistics categories</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="bg-transparent outline-none w-40"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Category Form */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden lg:col-span-1">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                {editingId ? 'Edit Category' : 'Add New Category'}
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter category code"
                    value={newCategory.code}
                    onChange={(e) => setNewCategory({...newCategory, code: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter category name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={handleAddCategory}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1"
                  >
                    {editingId ? 'Update Category' : 'Add Category'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden lg:col-span-2">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">CATEGORIES LIST</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SINO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category, index) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{category[index]}</td>
                        <td className="px-6 py-4 text-indigo-600">{category.code}</td>
                        <td className="px-6 py-4">{category.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span 
                            onClick={() => toggleStatus(category.id)} 
                            className={`cursor-pointer px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {category.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button onClick={() => handleEdit(category)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <Layers className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No categories found</h4>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryInformationPage;
