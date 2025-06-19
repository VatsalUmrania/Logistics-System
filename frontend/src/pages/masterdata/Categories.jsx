// import { useState, useEffect } from 'react';
// import { Layers,Plus, Pencil, Trash2, ChevronDown, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

// const API_URL = 'http://localhost:5000/api/categories';

// const CategoryInformationPage = () => {
//   const [categories, setCategories] = useState([]);

//   const [newCategory, setNewCategory] = useState({
//     code: '',
//     name: '',
//     description: '',
//     sino: '', // Add sino field
//   });
  

//   const [isAdding, setIsAdding] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [sortField, setSortField] = useState('name');
//   const [sortDirection, setSortDirection] = useState('asc');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // Convert API snake_case object to camelCase
//   const toCamelCase = (obj) => ({
//     id: obj.id,
//     code: obj.code,
//     name: obj.name,
//     description: obj.description,
//     createdAt: obj.created_at,
//     status: obj.status, // Ensure status is mapped correctly
//     sino: obj.sino, // Ensure sino is mapped correctly
//   });
  
//   // const handleEdit = (category) => {
//   //   setNewCategory({
//   //     code: category.code,
//   //     name: category.name,
//   //     description: category.description,
//   //   });
//   //   setEditingId(category.id);
//   //   setIsAdding(true);
//   // };
//   const handleEdit = (category) => {
//     setNewCategory({
//       code: category.code,
//       name: category.name,
//       description: category.description,
//       status: category.status,  // Include status for editing
//       sino: category.sino,      // Include sino for editing (if applicable)
//     });
//     setEditingId(category.id);  // Set the ID to know which category is being edited
//     setIsAdding(true);  // Toggle the form to "Edit" mode
//   };
  
  
//   // Convert camelCase to snake_case for API
//   const formatToSnakeCase = (category) => ({
//     code: category.code,
//     name: category.name,
//     description: category.description,
//   });

//   // Fetch categories from backend
//   const fetchCategories = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         console.error('Authentication token missing');
//         setError('Please log in to fetch categories');
//         return;
//       }
  
//       const res = await fetch(API_URL, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
  
//       if (!res.ok) {
//         throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
//       }
  
//       const data = await res.json();
//       const categories = data.map(toCamelCase);
  
//       console.log('Fetched Categories (sample):', data[0]?.sino); // Optional chaining for safety
  
//       setCategories(categories);
//     } catch (err) {
//       console.error('Failed to fetch categories:', err);
//       setError('Failed to load categories');
//     }
//   };
  
//   useEffect(() => {
//     fetchCategories();
//   }, []);
  
//   // Add or update category handler
//   // const handleAddCategory = async () => {
//   //   if (!newCategory.code.trim() || !newCategory.name.trim()) return;
  
//   //   try {
//   //     const token = localStorage.getItem('authToken');
//   //     if (!token) {
//   //       alert('Authentication token missing. Please log in again.');
//   //       return;
//   //     }
  
//   //     const categoryData = {
//   //       code: newCategory.code,
//   //       name: newCategory.name,
//   //       status: newCategory.status,
//   //     };
  
//   //     const headers = {
//   //       'Content-Type': 'application/json',
//   //       'Authorization': `Bearer ${token}`,
//   //     };
  
//   //     let res;
//   //     if (editingId !== null) {
//   //       // Update existing category
//   //       res = await fetch(`${API_URL}/${editingId}`, {
//   //         method: 'PUT',
//   //         headers,
//   //         body: JSON.stringify(categoryData),
//   //       });
//   //     } else {
//   //       // Add new category
//   //       res = await fetch(API_URL, {
//   //         method: 'POST',
//   //         headers,
//   //         body: JSON.stringify(categoryData),
//   //       });
//   //     }
  
//   //     if (!res.ok) {
//   //       const errorData = await res.json();
//   //       throw new Error(errorData.message || 'Failed to add category');
//   //     }
  
//   //     await fetchCategories();
//   //     setNewCategory({
//   //       code: '',
//   //       name: '',
//   //       status: 'Active',
//   //     });
//   //     setEditingId(null);
//   //     setIsAdding(false);
//   //   } catch (err) {
//   //     console.error('Error:', err);
//   //     alert(err.message);
//   //   }
//   // };
//   const handleAddCategory = async () => {
//     // Ensure required fields are not empty
//     if (!newCategory.code.trim() || !newCategory.name.trim()) {
//       alert('Category code and name are required.');
//       return;
//     }
  
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         alert('Authentication token missing. Please log in again.');
//         return;
//       }
  
//       // Prepare the category data to send to the backend
//       const categoryData = {
//         code: newCategory.code,
//         name: newCategory.name,
//           // Include description field
//         status: newCategory.status,            // Include status field
//         sino: newCategory.sino || 'defaultSino', // Use default value for sino if it's not provided
//       };
  
//       // Set up headers for the request
//       const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       };
  
//       let res;
  
//       if (editingId !== null && editingId !== undefined) {
//         // Update existing category
//         res = await fetch(`${API_URL}/${editingId}`, {
//           method: 'PUT',
//           headers,
//           body: JSON.stringify(categoryData),
//         });
//       } else {
//         // Add new category (when editingId is null)
//         res = await fetch(API_URL, {
//           method: 'POST',
//           headers,
//           body: JSON.stringify(categoryData),
//         });
//       }
  
//       // Handle server response and errors
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || 'Failed to add or update category');
//       }
  
//       // Re-fetch the updated list of categories
//       await fetchCategories();
  
//       // Reset the form fields after a successful add/update
//       setNewCategory({
//         code: '',
//         name: '',
//         description: '', // Reset description field
//         status: 'Active', // Reset status to Active
//         sino: '',         // Reset sino field (if applicable)
//       });
  
//       setEditingId(null);  // Clear the editing state
//       setIsAdding(false);  // Reset to Add mode
  
//     } catch (err) {
//       console.error('Error:', err);
//       alert(err.message || 'An error occurred while adding/updating the category');
//     }
//   };
  
  

//   // Delete category handler
//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this category?')) return;
  
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         alert('Authentication token missing. Please log in again.');
//         return;
//       }
  
//       const res = await fetch(`${API_URL}/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
  
//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(`Failed to delete category: ${errorText}`);
//       }
  
//       await fetchCategories();
//     } catch (err) {
//       console.error('Delete error:', err);
//       alert(err.message || 'Failed to delete category');
//     }
//   };
  

//   // Sort handler
//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };


//   const toggleStatus = async (id) => {
//     // First, update the status locally to immediately reflect the change in the UI
//     setCategories(categories.map(category => 
//       category.id === id 
//         ? { ...category, status: category.status === 'Active' ? 'Inactive' : 'Active' } 
//         : category
//     ));
  
//     // Retrieve the authentication token from localStorage
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       alert('Authentication token missing. Please log in again.');
//       return;
//     }
  
//     // Then, update the status in the database via an API call
//     try {
//       const categoryToUpdate = categories.find(category => category.id === id);
//       const updatedCategory = { ...categoryToUpdate, status: categoryToUpdate.status === 'Active' ? 'Inactive' : 'Active' };
  
//       // Send the updated status to the backend with Authorization header
//       const res = await fetch(`${API_URL}/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`  // Authorization header
//         },
//         body: JSON.stringify({ status: updatedCategory.status }),
//       });
  
//       if (!res.ok) {
//         throw new Error('Failed to update category status');
//       }
  
//       console.log(`Category ${id} status updated to ${updatedCategory.status}`);
//     } catch (err) {
//       console.error('Error updating status:', err);
//       // Optionally, revert the status change if the update fails
//       setCategories(categories.map(category => 
//         category.id === id 
//           ? { ...category, status: category.status === 'Active' ? 'Inactive' : 'Active' } 
//           : category
//       ));
//       alert(err.message || 'Failed to update category status');
//     }
//   };
  
  
//   // Sorted & filtered categories for display
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
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     placeholder="Enter category code"
//                     value={newCategory.code}
//                     onChange={(e) => setNewCategory({...newCategory, code: e.target.value})}
//                   />
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
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Categories List */}
//           <div className="bg-white rounded-xl shadow-lg overflow-hidden lg:col-span-2">
//             <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//               <h3 className="text-lg font-semibold text-gray-800">CATEGORIES LIST</h3>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SINO</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Code</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
//                     <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//   {filteredCategories.length > 0 ? (
//     filteredCategories.map((category) => (
//       <tr key={category.id} className="hover:bg-gray-50">
//         <td className="px-6 py-4 whitespace-nowrap">{category.sino}</td> {/* Corrected this line */}
//         <td className="px-6 py-4 text-indigo-600">{category.code}</td>
//         <td className="px-6 py-4">{category.name}</td>
//         <td className="px-6 py-4 whitespace-nowrap text-center">
//           <span
//             onClick={() => toggleStatus(category.id)}
//             className={`cursor-pointer px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//               category.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//             }`}
//           >
//             {category.status}
//           </span>
//         </td>
//         <td className="px-6 py-4 whitespace-nowrap text-right">
//           <button onClick={() => handleEdit(category)} className="text-indigo-600 hover:text-indigo-900 mr-4">
//             <Pencil className="w-5 h-5" />
//           </button>
//           <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">
//             <Trash2 className="w-5 h-5" />
//           </button>
//         </td>
//       </tr>
//     ))
//   ) : (
//     <tr>
//       <td colSpan="5" className="px-6 py-12 text-center">
//         <Layers className="w-16 h-16 text-gray-300 mb-4" />
//         <h4 className="text-lg font-medium text-gray-500">No categories found</h4>
//       </td>
//     </tr>
//   )}
// </tbody>

//                 {/* <tbody className="divide-y divide-gray-200">
//                   {filteredCategories.length > 0 ? (
//                     filteredCategories.map((category, index) => (
//                       <tr key={category.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">{category[index]}</td>
//                         <td className="px-6 py-4 text-indigo-600">{category.code}</td>
//                         <td className="px-6 py-4">{category.name}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-center">
//                           <span 
//                             onClick={() => toggleStatus(category.id)} 
//                             className={`cursor-pointer px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
//                           >
//                             {category.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right">
//                           <button onClick={() => handleEdit(category)} className="text-indigo-600 hover:text-indigo-900 mr-4">
//                             <Pencil className="w-5 h-5" />
//                           </button>
//                           <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">
//                             <Trash2 className="w-5 h-5" />
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="5" className="px-6 py-12 text-center">
//                         <Layers className="w-16 h-16 text-gray-300 mb-4" />
//                         <h4 className="text-lg font-medium text-gray-500">No categories found</h4>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody> */}
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategoryInformationPage;


// import { useState, useEffect } from 'react';
// import { Layers, Plus, Pencil, Trash2, ChevronDown, Search } from 'lucide-react';

// const API_URL = 'http://localhost:5000/api/categories';

// const CategoryInformationPage = () => {
//   const [categories, setCategories] = useState([]);
//   const [newCategory, setNewCategory] = useState({
//     code: '',
//     name: '',
//     status: 'Active',
//     sino: '',
//   });
//   const [isAdding, setIsAdding] = useState(false);
//   const [editingSino, setEditingSino] = useState(null); // Use 'sino' as unique key
//   const [sortField, setSortField] = useState('sino');
//   const [sortDirection, setSortDirection] = useState('asc');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
//   const [error, setError] = useState('');

//   // Helper: convert API snake_case to camelCase
//   const toCamelCase = (obj) => ({
//     sino: obj.sino,
//     code: obj.code,
//     name: obj.name,
//     status: obj.status,
//     createdAt: obj.created_at,
//     updatedAt: obj.updated_at,
//   });

//   // Fetch all categories
//   const fetchCategories = async () => {
//     try {
//       setError('');
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         setError('Please log in to fetch categories');
//         return;
//       }
//       const res = await fetch(API_URL, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
//       const data = await res.json();
//       setCategories(data.map(toCamelCase));
//     } catch (err) {
//       setError(err.message || 'Failed to load categories');
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Add or update category
//   const handleAddCategory = async () => {
//     if (!newCategory.code.trim() || !newCategory.name.trim()) {
//       alert('Category code and name are required.');
//       return;
//     }
//     try {
//       setError('');
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         alert('Authentication token missing. Please log in again.');
//         return;
//       }
//       const categoryData = {
//         code: newCategory.code,
//         name: newCategory.name,
//         status: newCategory.status,
//       };
//       const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       };
//       let res;
//       if (editingSino !== null) {
//         // Find by sino, get code (API expects code for PUT/DELETE)
//         const cat = categories.find(c => c.sino === editingSino);
//         if (!cat) throw new Error('Category not found');
//         res = await fetch(`${API_URL}/${cat.code}`, {
//           method: 'PUT',
//           headers,
//           body: JSON.stringify(categoryData),
//         });
//       } else {
//         res = await fetch(API_URL, {
//           method: 'POST',
//           headers,
//           body: JSON.stringify(categoryData),
//         });
//       }
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || 'Failed to add/update category');
//       }
//       await fetchCategories();
//       setNewCategory({ code: '', name: '', status: 'Active', sino: '' });
//       setEditingSino(null);
//       setIsAdding(false);
//     } catch (err) {
//       setError(err.message || 'Error saving category');
//     }
//   };

//   // Edit
//   const handleEdit = (category) => {
//     setNewCategory({
//       code: category.code,
//       name: category.name,
//       status: category.status,
//       sino: category.sino,
//     });
//     setEditingSino(category.sino);
//     setIsAdding(true);
//   };

//   // Delete
//   const handleDelete = async (sino) => {
//     if (!window.confirm('Are you sure you want to delete this category?')) return;
//     try {
//       setError('');
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         alert('Authentication token missing. Please log in again.');
//         return;
//       }
//       const cat = categories.find(c => c.sino === sino);
//       if (!cat) throw new Error('Category not found');
//       const res = await fetch(`${API_URL}/${cat.code}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error('Failed to delete category');
//       await fetchCategories();
//     } catch (err) {
//       setError(err.message || 'Failed to delete category');
//     }
//   };

//   // Toggle status
//   const toggleStatus = async (sino) => {
//     try {
//       setError('');
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         alert('Authentication token missing. Please log in again.');
//         return;
//       }
//       const cat = categories.find(c => c.sino === sino);
//       if (!cat) throw new Error('Category not found');
//       const updatedStatus = cat.status === 'Active' ? 'Inactive' : 'Active';
//       const res = await fetch(`${API_URL}/${cat.code}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           code: cat.code,
//           name: cat.name,
//           status: updatedStatus,
//         }),
//       });
//       if (!res.ok) throw new Error('Failed to update status');
//       await fetchCategories();
//     } catch (err) {
//       setError(err.message || 'Failed to update category status');
//     }
//   };

//   // Sorting & filtering
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

//   // Pagination controls
//   const goToPage = (pageNum) => {
//     if (pageNum >= 1 && pageNum <= totalPages) setCurrentPage(pageNum);
//   };

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
//         {error && (
//           <div className="mb-4 text-red-700 bg-red-100 px-4 py-2 rounded border border-red-200">{error}</div>
//         )}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Add Category Form */}
//           <div className="bg-white rounded-xl shadow-lg overflow-hidden lg:col-span-1">
//             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
//               <h2 className="text-xl font-bold text-white flex items-center">
//                 <Plus className="w-5 h-5 mr-2" />
//                 {editingSino ? 'Edit Category' : 'Add New Category'}
//               </h2>
//             </div>
//             <div className="p-6">
//               <div className="space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category Code <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     placeholder="Enter category code"
//                     value={newCategory.code}
//                     onChange={(e) => setNewCategory({...newCategory, code: e.target.value})}
//                   />
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
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Status
//                   </label>
//                   <select
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                     value={newCategory.status}
//                     onChange={e => setNewCategory({...newCategory, status: e.target.value})}
//                   >
//                     <option>Active</option>
//                     <option>Inactive</option>
//                   </select>
//                 </div>
//                 <div className="flex space-x-3 pt-2">
//                   <button
//                     onClick={handleAddCategory}
//                     className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1"
//                   >
//                     {editingSino ? 'Update Category' : 'Add Category'}
//                   </button>
//                   {editingSino && (
//                     <button
//                       onClick={() => {
//                         setIsAdding(false);
//                         setEditingSino(null);
//                         setNewCategory({ code: '', name: '', status: 'Active', sino: '' });
//                       }}
//                       className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors flex-1"
//                     >
//                       Cancel
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
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('sino')}>SINO</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('code')}>Category Code</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>Category Name</th>
//                     <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>Status</th>
//                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {currentCategories.length > 0 ? (
//                     currentCategories.map((category) => (
//                       <tr key={category.sino} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">{category.sino}</td>
//                         <td className="px-6 py-4 text-indigo-600">{category.code}</td>
//                         <td className="px-6 py-4">{category.name}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-center">
//                           <span
//                             onClick={() => toggleStatus(category.sino)}
//                             className={`cursor-pointer px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
//                           >
//                             {category.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right">
//                           <button onClick={() => handleEdit(category)} className="text-indigo-600 hover:text-indigo-900 mr-4">
//                             <Pencil className="w-5 h-5" />
//                           </button>
//                           <button onClick={() => handleDelete(category.sino)} className="text-red-600 hover:text-red-900">
//                             <Trash2 className="w-5 h-5" />
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="5" className="px-6 py-12 text-center">
//                         <Layers className="w-16 h-16 text-gray-300 mb-4" />
//                         <h4 className="text-lg font-medium text-gray-500">No categories found</h4>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             {/* Pagination */}
//             <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
//               <button
//                 onClick={() => goToPage(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 rounded border disabled:opacity-50"
//               >
//                 Prev
//               </button>
//               <span className="mx-2 text-xs text-gray-500">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 onClick={() => goToPage(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 rounded border disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategoryInformationPage;


import { useState, useEffect } from 'react';
import { Layers, Plus, Pencil, Trash2, Search } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/categories';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('Authentication required. Redirecting to login...');
    window.location.href = '/login';
    throw new Error('Authentication token missing');
  }
  return { 'Authorization': `Bearer ${token}` };
};

const CategoryInformationPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    code: '',
    name: '',
    status: 'Active',
    sino: '',
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingSino, setEditingSino] = useState(null);
  const [sortField, setSortField] = useState('sino');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [error, setError] = useState('');

  // Helper: convert API snake_case to camelCase
  const toCamelCase = (obj) => ({
    sino: obj.sino,
    code: obj.code,
    name: obj.name,
    status: obj.status,
    createdAt: obj.created_at,
    updatedAt: obj.updated_at,
  });

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setError('');
      const res = await fetch(API_URL, {
        headers: { ...getAuthHeaders() },
      });
      if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setCategories(data.map(toCamelCase));
    } catch (err) {
      setError(err.message || 'Failed to load categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add or update category
  const handleAddCategory = async () => {
    if (!newCategory.code.trim() || !newCategory.name.trim()) {
      alert('Category code and name are required.');
      return;
    }
    try {
      setError('');
      const categoryData = {
        code: newCategory.code,
        name: newCategory.name,
        status: newCategory.status,
      };
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      };
      let res;
      if (editingSino !== null) {
        // Update
        res = await fetch(`${API_URL}/${editingSino}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(categoryData),
        });
      } else {
        // Create
        res = await fetch(API_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify(categoryData),
        });
      }
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add/update category');
      }
      await fetchCategories();
      setNewCategory({ code: '', name: '', status: 'Active', sino: '' });
      setEditingSino(null);
      setIsAdding(false);
    } catch (err) {
      setError(err.message || 'Error saving category');
    }
  };

  // Edit
  const handleEdit = (category) => {
    setNewCategory({
      code: category.code,
      name: category.name,
      status: category.status,
      sino: category.sino,
    });
    setEditingSino(category.sino);
    setIsAdding(true);
  };

  // Delete
  const handleDelete = async (sino) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      setError('');
      const res = await fetch(`${API_URL}/${sino}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }
      await fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to delete category');
    }
  };

  // Toggle status
  const toggleStatus = async (sino) => {
    try {
      setError('');
      const cat = categories.find(c => c.sino === sino);
      if (!cat) throw new Error('Category not found');
      const updatedStatus = cat.status === 'Active' ? 'Inactive' : 'Active';
      const res = await fetch(`${API_URL}/${sino}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          code: cat.code,
          name: cat.name,
          status: updatedStatus,
        }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      await fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to update category status');
    }
  };

  // Sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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

  // Pagination controls
  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) setCurrentPage(pageNum);
  };

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
        {error && (
          <div className="mb-4 text-red-700 bg-red-100 px-4 py-2 rounded border border-red-200">{error}</div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Category Form */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden lg:col-span-1">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                {editingSino ? 'Edit Category' : 'Add New Category'}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={newCategory.status}
                    onChange={e => setNewCategory({...newCategory, status: e.target.value})}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={handleAddCategory}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1"
                  >
                    {editingSino ? 'Update Category' : 'Add Category'}
                  </button>
                  {editingSino && (
                    <button
                      onClick={() => {
                        setIsAdding(false);
                        setEditingSino(null);
                        setNewCategory({ code: '', name: '', status: 'Active', sino: '' });
                      }}
                      className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors flex-1"
                    >
                      Cancel
                    </button>
                  )}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('sino')}>SINO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('code')}>Category Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>Category Name</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentCategories.length > 0 ? (
                    currentCategories.map((category) => (
                      <tr key={category.sino} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{category.sino}</td>
                        <td className="px-6 py-4 text-indigo-600">{category.code}</td>
                        <td className="px-6 py-4">{category.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            onClick={() => toggleStatus(category.sino)}
                            className={`cursor-pointer px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {category.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button onClick={() => handleEdit(category)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(category.sino)} className="text-red-600 hover:text-red-900">
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
            {/* Pagination */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Prev
              </button>
              <span className="mx-2 text-xs text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryInformationPage;