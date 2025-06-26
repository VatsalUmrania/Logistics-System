// import React from 'react';
// import { useState, useEffect } from 'react';
// import { 
//   Truck, Plus, Pencil, Trash2, ChevronDown, Search, ChevronLeft, 
//   ChevronRight, X, Building2, Phone, Mail, FileText, Calendar,
//   Filter, Download, Upload, AlertCircle, CheckCircle, Loader2
// } from 'lucide-react';

// const AddSupplierPage = () => {
//   const API_URL = 'http://localhost:5000/api/suppliers';

//   // State management
//   const [suppliers, setSuppliers] = useState([]);
//   const [newSupplier, setNewSupplier] = useState({
//     name: '',
//     address: '',
//     phone: '',
//     email: '',
//     vat_number: '',
//     registration_number: '',
//     registration_date: '',
//   });

//   const [isAdding, setIsAdding] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [sortField, setSortField] = useState('name');
//   const [sortDirection, setSortDirection] = useState('asc');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [showFilters, setShowFilters] = useState(false);
//   const itemsPerPage = 10;

//   // Helper function to get authorization headers
//   const getAuthHeaders = () => {
//     const token = localStorage.getItem('authToken');
//     if (!token) throw new Error('Authentication token missing');
//     return { 'Authorization': `Bearer ${token}` };
//   };

//   // Clear messages after timeout
//   useEffect(() => {
//     if (error || successMessage) {
//       const timer = setTimeout(() => {
//         setError('');
//         setSuccessMessage('');
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, successMessage]);

//   // Fetch suppliers from backend
//   const fetchSuppliers = async () => {
//     setIsLoading(true);
//     try {
//       const res = await fetch(API_URL, {
//         headers: getAuthHeaders(),
//       });

//       if (!res.ok) throw new Error('Failed to fetch suppliers');
//       const data = await res.json();
//       setSuppliers(data);
//       setError('');
//     } catch (err) {
//       console.error('Error fetching suppliers:', err);
//       setError('Failed to fetch suppliers. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSuppliers();
//   }, []);

//   // Form validation
//   const validateForm = () => {
//     if (!newSupplier.name.trim()) {
//       setError('Supplier name is required');
//       return false;
//     }
//     if (newSupplier.email && !/\S+@\S+\.\S+/.test(newSupplier.email)) {
//       setError('Please enter a valid email address');
//       return false;
//     }
//     return true;
//   };

//   // Create or update supplier
//   const handleAddSupplier = async () => {
//     if (!validateForm()) return;

//     setIsLoading(true);
//     try {
//       const headers = {
//         ...getAuthHeaders(),
//         'Content-Type': 'application/json',
//       };
//       let res;

//       if (editingId !== null) {
//         res = await fetch(`${API_URL}/${editingId}`, {
//           method: 'PUT',
//           headers,
//           body: JSON.stringify(newSupplier),
//         });
//         if (!res.ok) throw new Error('Failed to update supplier');
//         setSuccessMessage('Supplier updated successfully!');
//       } else {
//         res = await fetch(API_URL, {
//           method: 'POST',
//           headers,
//           body: JSON.stringify(newSupplier),
//         });
//         if (!res.ok) throw new Error('Failed to add supplier');
//         setSuccessMessage('Supplier added successfully!');
//       }

//       await fetchSuppliers();
//       resetForm();
//     } catch (err) {
//       console.error('Error saving supplier:', err);
//       setError(err.message || 'Failed to save supplier');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setNewSupplier({
//       name: '',
//       address: '',
//       phone: '',
//       email: '',
//       vat_number: '',
//       registration_number: '',
//       registration_date: '',
//     });
//     setEditingId(null);
//     setIsAdding(false);
//     setError('');
//   };

//   // Delete supplier
//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this supplier?')) return;

//     setIsLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/${id}`, {
//         method: 'DELETE',
//         headers: getAuthHeaders(),
//       });

//       if (!res.ok) throw new Error('Failed to delete supplier');
      
//       await fetchSuppliers();
//       setSuccessMessage('Supplier deleted successfully!');
//     } catch (err) {
//       console.error('Error deleting supplier:', err);
//       setError('Failed to delete supplier');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Edit supplier
//   const handleEdit = (supplier) => {
//     setNewSupplier({ ...supplier });
//     setEditingId(supplier.id);
//     setIsAdding(true);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // Sorting
//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   // Filter and sort suppliers
//   const sortedSuppliers = [...suppliers].sort((a, b) => {
//     const aValue = a[sortField] || '';
//     const bValue = b[sortField] || '';
    
//     if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
//     if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
//     return 0;
//   });

//   const filteredSuppliers = sortedSuppliers.filter(supplier => 
//     supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     supplier.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     supplier.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     supplier.vat_number?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentSuppliers = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

//   const getSortIcon = (field) => {
//     if (sortField !== field) return <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />;
//     return (
//       <ChevronDown 
//         className={`w-4 h-4 ml-1 text-indigo-600 transition-transform ${
//           sortDirection === 'asc' ? 'rotate-180' : ''
//         }`} 
//       />
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        
//         {/* Header Section */}
//         <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 mb-8">
//           <div className="px-8 py-6">
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
//               <div className="flex items-center space-x-4">
//                 <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
//                   <Truck className="w-7 h-7 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-black bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent">
//                     SUPPLIER MANAGEMENT
//                   </h1>
//                   <p className="text-sm text-gray-500 font-medium tracking-wide">
//                     Manage and organize your supplier network
//                   </p>
//                 </div>
//               </div>
              
//               <div className="flex items-center space-x-3">
//                 {/* Search Bar */}
//                 <form className="flex items-center bg-gray-100 rounded-full px-4 py-2.5 w-72 transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-300 focus-within:bg-white shadow-sm">
//                   <Search className="w-4 h-4 text-gray-500 mr-2" />
//                   <input 
//                     type="text" 
//                     placeholder="Search suppliers..." 
//                     className="bg-transparent flex-1 text-sm text-gray-700 placeholder-gray-500 outline-none"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </form>
                
//                 {/* Action Buttons */}
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="p-2.5 bg-gray-100 hover:bg-indigo-50 rounded-xl transition-colors shadow-sm"
//                   title="Toggle Filters"
//                 >
//                   <Filter className="w-5 h-5 text-gray-600" />
//                 </button>
                
//                 <button
//                   onClick={() => setIsAdding(!isAdding)}
//                   className={`px-6 py-2.5 text-white rounded-xl font-medium transition-all flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
//                     isAdding 
//                       ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
//                       : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
//                   }`}
//                 >
//                   {isAdding ? (
//                     <>
//                       <X className="w-5 h-5 mr-2" />
//                       Cancel
//                     </>
//                   ) : (
//                     <>
//                       <Plus className="w-5 h-5 mr-2" />
//                       Add Supplier
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Success/Error Messages */}
//         {(error || successMessage) && (
//           <div className={`mb-6 p-4 rounded-xl border flex items-center space-x-3 animate-fade-in ${
//             error 
//               ? 'bg-red-50 text-red-700 border-red-200' 
//               : 'bg-green-50 text-green-700 border-green-200'
//           }`}>
//             {error ? (
//               <AlertCircle className="w-5 h-5 flex-shrink-0" />
//             ) : (
//               <CheckCircle className="w-5 h-5 flex-shrink-0" />
//             )}
//             <span className="font-medium">{error || successMessage}</span>
//           </div>
//         )}

//         {/* Add/Edit Supplier Form */}
//         {isAdding && (
//           <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 mb-8 animate-fade-in">
//             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 rounded-t-2xl">
//               <h2 className="text-xl font-bold text-white flex items-center">
//                 <Building2 className="w-6 h-6 mr-3" />
//                 {editingId ? 'Edit Supplier Details' : 'Add New Supplier'}
//               </h2>
//             </div>
            
//             <div className="p-8">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Left Column */}
//                 <div className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Supplier Name <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                       <input
//                         type="text"
//                         className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
//                         placeholder="Enter supplier name"
//                         value={newSupplier.name}
//                         onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
//                       />
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Email Address
//                     </label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                       <input
//                         type="email"
//                         className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
//                         placeholder="Enter email address"
//                         value={newSupplier.email}
//                         onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
//                       />
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Phone Number
//                     </label>
//                     <div className="relative">
//                       <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                       <input
//                         type="tel"
//                         className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
//                         placeholder="Enter phone number"
//                         value={newSupplier.phone}
//                         onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
//                       />
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Right Column */}
//                 <div className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Address
//                     </label>
//                     <textarea
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm resize-none"
//                       placeholder="Enter supplier address"
//                       rows="3"
//                       value={newSupplier.address}
//                       onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
//                     ></textarea>
//                   </div>
                  
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         VAT Number
//                       </label>
//                       <div className="relative">
//                         <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                         <input
//                           type="text"
//                           className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
//                           placeholder="VAT number"
//                           value={newSupplier.vat_number}
//                           onChange={(e) => setNewSupplier({...newSupplier, vat_number: e.target.value})}
//                         />
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Registration Number
//                       </label>
//                       <div className="relative">
//                         <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                         <input
//                           type="text"
//                           className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
//                           placeholder="Registration number"
//                           value={newSupplier.registration_number}
//                           onChange={(e) => setNewSupplier({...newSupplier, registration_number: e.target.value})}
//                         />
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Registration Date
//                     </label>
//                     <div className="relative">
//                       <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                       <input
//                         type="date"
//                         className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
//                         value={newSupplier.registration_date}
//                         onChange={(e) => setNewSupplier({...newSupplier, registration_date: e.target.value})}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-8">
//                 <button
//                   onClick={handleAddSupplier}
//                   disabled={isLoading}
//                   className="flex-1 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                       {editingId ? 'Updating...' : 'Adding...'}
//                     </>
//                   ) : (
//                     <>
//                       {editingId ? 'Update Supplier' : 'Add Supplier'}
//                     </>
//                   )}
//                 </button>
                
//                 <button
//                   onClick={resetForm}
//                   className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all shadow-sm"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Suppliers Table */}
//         <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100">
//           <div className="px-8 py-6 border-b border-gray-100">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
//               <div>
//                 <h3 className="text-xl font-bold text-gray-800">SUPPLIER DIRECTORY</h3>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {isLoading ? (
//                     <span className="flex items-center">
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                       Loading suppliers...
//                     </span>
//                   ) : (
//                     `${filteredSuppliers.length} suppliers found`
//                   )}
//                 </p>
//               </div>
              
//               <div className="flex items-center space-x-3">
//                 <button className="p-2.5 bg-gray-100 hover:bg-green-50 rounded-xl transition-colors shadow-sm">
//                   <Download className="w-5 h-5 text-gray-600" />
//                 </button>
//                 <button className="p-2.5 bg-gray-100 hover:bg-blue-50 rounded-xl transition-colors shadow-sm">
//                   <Upload className="w-5 h-5 text-gray-600" />
//                 </button>
//               </div>
//             </div>
//           </div>
          
//           {/* Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50/50">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     #
//                   </th>
//                   <th 
//                     className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
//                     onClick={() => handleSort('name')}
//                   >
//                     <div className="flex items-center">
//                       Supplier Name
//                       {getSortIcon('name')}
//                     </div>
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Contact Info
//                   </th>
//                   <th 
//                     className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
//                     onClick={() => handleSort('registration_date')}
//                   >
//                     <div className="flex items-center">
//                       Registration
//                       {getSortIcon('registration_date')}
//                     </div>
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Documents
//                   </th>
//                   <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {isLoading ? (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-16 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
//                         <h4 className="text-lg font-medium text-gray-500">Loading suppliers...</h4>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : currentSuppliers.length > 0 ? (
//                   currentSuppliers.map((supplier, index) => (
//                     <tr key={supplier.id} className="hover:bg-gray-50/50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
//                           <span className="text-sm font-semibold text-indigo-700">
//                             {(currentPage - 1) * itemsPerPage + index + 1}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center space-x-3">
//                           <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
//                             <Building2 className="w-5 h-5 text-white" />
//                           </div>
//                           <div>
//                             <div className="text-sm font-semibold text-gray-900">{supplier.name}</div>
//                             <div className="text-xs text-gray-500 max-w-xs truncate">{supplier.address}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="space-y-1">
//                           {supplier.phone && (
//                             <div className="flex items-center text-sm text-gray-600">
//                               <Phone className="w-4 h-4 mr-2 text-gray-400" />
//                               {supplier.phone}
//                             </div>
//                           )}
//                           {supplier.email && (
//                             <div className="flex items-center text-sm text-gray-600">
//                               <Mail className="w-4 h-4 mr-2 text-gray-400" />
//                               {supplier.email}
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900">
//                           {supplier.registration_date ? (
//                             <div className="flex items-center">
//                               <Calendar className="w-4 h-4 mr-2 text-gray-400" />
//                               {new Date(supplier.registration_date).toLocaleDateString()}
//                             </div>
//                           ) : (
//                             <span className="text-gray-400">N/A</span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="space-y-1">
//                           {supplier.vat_number && (
//                             <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
//                               VAT: {supplier.vat_number}
//                             </div>
//                           )}
//                           {supplier.registration_number && (
//                             <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
//                               REG: {supplier.registration_number}
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right">
//                         <div className="flex items-center justify-end space-x-2">
//                           <button 
//                             onClick={() => handleEdit(supplier)}
//                             className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
//                             title="Edit Supplier"
//                           >
//                             <Pencil className="w-4 h-4" />
//                           </button>
//                           <button 
//                             onClick={() => handleDelete(supplier.id)}
//                             className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
//                             title="Delete Supplier"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-16 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                           <Truck className="w-10 h-10 text-gray-400" />
//                         </div>
//                         <h4 className="text-lg font-medium text-gray-500 mb-2">No suppliers found</h4>
//                         <p className="text-gray-400 mb-4">
//                           {searchTerm ? 'Try adjusting your search terms' : 'Add your first supplier to get started'}
//                         </p>
//                         {!searchTerm && (
//                           <button
//                             onClick={() => setIsAdding(true)}
//                             className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
//                           >
//                             Add First Supplier
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
          
//           {/* Pagination */}
//           {filteredSuppliers.length > itemsPerPage && !isLoading && (
//             <div className="px-8 py-6 border-t border-gray-100">
//               <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
//                 {/* Page info */}
//                 <div className="text-sm text-gray-600">
//                   Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSuppliers.length)} of {filteredSuppliers.length} suppliers
//                 </div>

//                 {/* Page navigation */}
//                 <div className="flex items-center space-x-2">
//                   {/* Previous page button */}
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                     className={`p-2.5 rounded-xl border transition-all ${
//                       currentPage === 1
//                         ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200'
//                         : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm'
//                     }`}
//                   >
//                     <ChevronLeft className="w-5 h-5" />
//                   </button>

//                   {/* Page numbers */}
//                   <div className="flex items-center space-x-2">
//                     {Array.from({ length: totalPages }, (_, i) => i + 1)
//                       .filter(page => {
//                         // Show first page, last page, current page, and pages around current
//                         return (
//                           page === 1 ||
//                           page === totalPages ||
//                           Math.abs(currentPage - page) <= 1
//                         );
//                       })
//                       .map((page, index, array) => (
//                         <React.Fragment key={page}>
//                           {index > 0 && array[index - 1] !== page - 1 && (
//                             <span className="px-2 text-gray-400">...</span>
//                           )}
//                           <button
//                             onClick={() => setCurrentPage(page)}
//                             className={`min-w-[40px] h-10 rounded-xl border font-medium transition-all ${
//                               currentPage === page
//                                 ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg'
//                                 : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm'
//                             }`}
//                           >
//                             {page}
//                           </button>
//                         </React.Fragment>
//                       ))}
//                   </div>

//                   {/* Next page button */}
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     className={`p-2.5 rounded-xl border transition-all ${
//                       currentPage === totalPages
//                         ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200'
//                         : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm'
//                     }`}
//                   >
//                     <ChevronRight className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddSupplierPage;

import React, { useState, useEffect } from 'react';
import { 
  Truck, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, CheckCircle, AlertTriangle, Building2, Phone, 
  Mail, FileText, Calendar, Loader, Check, AlertCircle as Alert
} from 'lucide-react';

const AddSupplierPage = () => {
  const API_URL = 'http://localhost:5000/api/suppliers';

  // State management
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    vat_number: '',
    registration_number: '',
    registration_date: '',
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const itemsPerPage = 10;

  // Helper function to get authorization headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication token missing');
    return { 'Authorization': `Bearer ${token}` };
  };

  // Fetch suppliers from backend
  const fetchSuppliers = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error('Failed to fetch suppliers');
      const data = await res.json();
      setSuppliers(data);
      setError('');
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError('Failed to fetch suppliers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Form validation
  const validateForm = () => {
    if (!newSupplier.name.trim()) {
      setError('Supplier name is required');
      return false;
    }
    if (newSupplier.email && !/\S+@\S+\.\S+/.test(newSupplier.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  // Create or update supplier
  const handleAddSupplier = async () => {
    if (!validateForm()) return;

    try {
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      };
      let res;

      if (editingId !== null) {
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(newSupplier),
        });
        if (!res.ok) throw new Error('Failed to update supplier');
        setSuccessMessage('Supplier updated successfully!');
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify(newSupplier),
        });
        if (!res.ok) throw new Error('Failed to add supplier');
        setSuccessMessage('Supplier added successfully!');
      }

      await fetchSuppliers();
      resetForm();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Error saving supplier:', err);
      setError(err.message || 'Failed to save supplier');
      setTimeout(() => setError(''), 5000);
    }
  };

  // Reset form
  const resetForm = () => {
    setNewSupplier({
      name: '',
      address: '',
      phone: '',
      email: '',
      vat_number: '',
      registration_number: '',
      registration_date: '',
    });
    setEditingId(null);
    setIsAdding(false);
    setError('');
  };

  // Delete supplier
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error('Failed to delete supplier');
      
      await fetchSuppliers();
      setSuccessMessage('Supplier deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting supplier:', err);
      setError('Failed to delete supplier');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Edit supplier
  const handleEdit = (supplier) => {
    setNewSupplier({ ...supplier });
    setEditingId(supplier.id);
    setIsAdding(true);
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

  // Filter and sort suppliers
  const sortedSuppliers = [...suppliers].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredSuppliers = sortedSuppliers.filter(supplier => 
    supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.vat_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading suppliers...</p>
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
              Supplier Management
            </h1>
            <p className="text-gray-600 mt-2">Manage and organize your supplier network</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            {/* <button
              onClick={() => {
                handleAddSupplier
                setIsAdding(!isAdding);
                setEditingId(null);
                resetForm();
              }}
              className={`px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Cancel' : 'Add Supplier'}
            </button> */}
            <button
  onClick={() => {
    if (isAdding) {
      resetForm();
    } else {
      resetForm();
      setIsAdding(true);
    }
  }}
  className={`px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
    ${isAdding 
      ? 'bg-red-600 hover:bg-red-700' 
      : 'bg-indigo-600 hover:bg-indigo-700'}`}
>
  {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
  {isAdding ? 'Cancel' : 'Add Supplier'}
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
              SEARCH SUPPLIERS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Name, Address, Phone, or VAT Number
                </label>
                <input
                  type="text"
                  placeholder="Search suppliers..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Supplier Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                {editingId ? 'Edit Supplier' : 'Add New Supplier'}
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter supplier name"
                      value={newSupplier.name}
                      onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter email address"
                      value={newSupplier.email}
                      onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter phone number"
                      value={newSupplier.phone}
                      onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                      placeholder="Enter supplier address"
                      rows="3"
                      value={newSupplier.address}
                      onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                    ></textarea>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      VAT Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="VAT number"
                      value={newSupplier.vat_number}
                      onChange={(e) => setNewSupplier({...newSupplier, vat_number: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Registration number"
                      value={newSupplier.registration_number}
                      onChange={(e) => setNewSupplier({...newSupplier, registration_number: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      value={newSupplier.registration_date}
                      onChange={(e) => setNewSupplier({...newSupplier, registration_date: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAddSupplier}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm"
                >
                  {editingId ? 'Update Supplier' : 'Add Supplier'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Supplier Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Supplier Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">{filteredSuppliers.length} suppliers</span>
            </div>
          </div>
        </div>

        {/* Suppliers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'Name', key: 'name' },
                    { label: 'Contact', key: 'phone' },
                    { label: 'Email', key: 'email' },
                    { label: 'VAT Number', key: 'vat_number' },
                    { label: 'Registration', key: 'registration_date' },
                    { label: 'Actions', key: null },
                  ].map(({ label, key }) => (
                    <th
                      key={label}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => key && handleSort(key)}
                    >
                      <div className="flex items-center">
                        {label}
                        {key && sortField === key && (
                          <ArrowUp
                            className={`w-4 h-4 ml-1 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      No supplier records found
                    </td>
                  </tr>
                ) : (
                  currentSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {supplier.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {supplier.phone || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {supplier.email || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {supplier.vat_number || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {supplier.registration_date ? new Date(supplier.registration_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleEdit(supplier)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(supplier.id)}
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
          <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-700 mb-2 md:mb-0">
              Showing {indexOfFirstItem + 1} to{' '}
              {Math.min(indexOfLastItem, filteredSuppliers.length)} of {filteredSuppliers.length} suppliers
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
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                  title="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="hidden md:block text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">{filteredSuppliers.length} suppliers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSupplierPage;
