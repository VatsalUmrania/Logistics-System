// import { useState, useEffect } from "react";
// import axios from "axios";

// const PolDetailsPage = () => {
//   const [polName, setPolName, slno] = useState('');
//   const [sortOrder, setSortOrder] = useState({ field: null, direction: 'asc' });
//   const [editingId, setEditingId] = useState(null);
//   const [editingName, setEditingName] = useState('');
//   const [polList, setPolList] = useState([]);

//   const getAuthHeaders = () => {
//     const token = localStorage.getItem('authToken');
//     if (!token) throw new Error('Authentication token missing');
//     return { 'Authorization': `Bearer ${token}` };
//   };

//   const fetchPolList = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/ports', {
//         headers: getAuthHeaders(),  // Add auth headers here
//       });
  
//       console.log("Fetched POL List response:", response);  // Log the full response
//       console.log("Fetched POL List data:", response.data); // Log the data
//       console.log("Fetched POL List data:", response.data[0]?.id);  // Access first item's id safely
  
//       // Ensure state is set properly
//       setPolList(prevPolList => {
//         console.log("Previous POL List:", prevPolList); // Log previous state to track updates
//         return response.data;
//       });
//     } catch (error) {
//       console.error("Error fetching POL list:", error);
//     }
//   };
  
//   // Fetch POL list from the API on component mount
//   useEffect(() => {
//     fetchPolList();
//   }, []);

//   const handleAddPol = async () => {
//     // Check if polName is defined and not empty
//     if (polName.trim()) {
//       try {
//         const response = await axios.post('http://localhost:5000/api/ports', 
//           { name: polName.trim() },  // Send only polName to the backend
//           {
//             headers: getAuthHeaders(), // Ensure the request includes the Authorization header
//           }
//         );
  
//         console.log("New POL response:", response.data); // Log the response from the backend
//         const newPol = { id: response.data.id, name: response.data.name };
        
//         // Update the state using the functional form to ensure the latest state is used
//         setPolList(prevPolList => {
//           const updatedList = [...prevPolList, newPol];
//           console.log("Updated POL List:", updatedList); // Log updated list to check the new state
//           return updatedList;
//         });
  
//         // Reset the polName input after successful submission
//         setPolName('');
//       } catch (error) {
//         console.error("Error adding POL:", error);
//       }
//     } else {
//       console.error("polName is undefined or empty.");
//       alert("POL name is required.");
//     }
//   };
  
//   const handleEditStart = (pol) => {
//     // Start editing by setting the current POL details
//     setEditingId(pol.id);
//     setEditingName(pol.name);  // Set the name of the POL to be edited
//   };
  
//   const handleEditSave = async (id) => {
//     // Ensure name is not empty before saving
//     if (editingName.trim()) {
//       try {
//         // Send PUT request to update the POL name
//         const response = await axios.put(`http://localhost:5000/api/ports/${id}`, {
//           name: editingName.trim()  // Trim and send the updated name
//         }, {
//           headers: getAuthHeaders()  // Include auth headers to authenticate the request
//         });
  
//         // Update frontend state with the new POL name
//         setPolList(polList.map(pol =>
//           pol.id === id ? { ...pol, name: editingName.trim().toUpperCase() } : pol
//         ));
  
//         // Reset editing state after successful save
//         setEditingId(null);
//         setEditingName('');
//       } catch (error) {
//         console.error("Error editing POL:", error);
//         alert("There was an error updating the POL name. Please try again.");
//       }
//     } else {
//       alert("POL name cannot be empty.");
//     }
//   };
  
//   const handleEditCancel = () => {
//     // Reset the editing state if user cancels the edit
//     setEditingId(null);
//     setEditingName('');
//   };
  
//   const handleKeyPress = (e, id) => {
//     if (e.key === 'Enter') {
//       handleEditSave(id);
//     } else if (e.key === 'Escape') {
//       handleEditCancel();
//     }
//   };

//   const handleSort = (field) => {
//     const direction = sortOrder.field === field && sortOrder.direction === 'asc' ? 'desc' : 'asc';
//     setSortOrder({ field, direction });
  
//     const sortedList = [...polList].sort((a, b) => {
//       if (field === 'id') {
//         return direction === 'asc' ? a.id - b.id : b.id - a.id;
//       } else if (field === 'name') {
//         return direction === 'asc' 
//           ? a.name.localeCompare(b.name)
//           : b.name.localeCompare(a.name);
//       }
//       return 0;
//     });
  
//     setPolList(sortedList);
//   };
  

//   const handleDeletePol = async (id) => {
//     try {
//       // Send DELETE request to backend with authentication headers
//       await axios.delete(`http://localhost:5000/api/ports/${id}`, {
//         headers: getAuthHeaders(), // Include auth token for authentication
//       });
  
//       // Remove the deleted POL from the frontend list by filtering out the POL with the deleted ID
//       setPolList(prevPolList => prevPolList.filter(pol => pol.id !== id));
  
//       console.log(`POL with ID ${id} deleted successfully`);
//     } catch (error) {
//       // If there's an error, log it to the console
//       console.error("Error deleting POL:", error);
//       alert("There was an error deleting the POL. Please try again.");
//     }
//   };
  
//   const getSortIcon = (field) => {
//     if (sortOrder.field !== field) return null;
//     return sortOrder.direction === 'asc' 
//       ? <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
//         </svg>
//       : <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//         </svg>;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white-50 via-white to-white-50 p-20 flex ">
//       <div className="max-w-7xl mx-auto">
//         {/* Page Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-black bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent text-center">
//             POL DETAILS
//           </h1>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Add POL Details Card */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//               <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
//                 <h2 className="text-white font-bold text-lg">Add Pol Details</h2>
//               </div>
              
//               <div className="p-6 space-y-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-3">
//                     Pol Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={polName}
//                     onChange={(e) => setPolName(e.target.value)}
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-300 text-gray-700 font-medium"
//                     placeholder="Enter POL name..."
//                   />
//                 </div>
                
//                 <button
//                   onClick={handleAddPol}
//                   className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                   </svg>
//                   <span>Add</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* POL List Card */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//               <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
//                 <h2 className="text-white font-bold text-lg">POL LIST</h2>
//               </div>
              
//               <div className="overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     {/* Table Header */}
//                     <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
//                       <tr>
//                         <th className="px-6 py-4 text-left">
//                           <button
//                             onClick={() => handleSort('sl')}
//                             className="flex items-center font-bold text-gray-700 hover:text-indigo-600 transition-colors group"
//                           >
//                             <span>Sl.No.</span>
//                             <div className="flex flex-col ml-1">
//                               {getSortIcon('sl')}
//                             </div>
//                           </button>
//                         </th>
//                         <th className="px-6 py-4 text-left">
//                           <button
//                             onClick={() => handleSort('name')}
//                             className="flex items-center font-bold text-gray-700 hover:text-indigo-600 transition-colors group"
//                           >
//                             <span>pol Name</span>
//                             <div className="flex flex-col ml-1">
//                               {getSortIcon('name')}
//                             </div>
//                           </button>
//                         </th>
//                         <th className="px-6 py-4 text-right">
//                           <span className="font-bold text-gray-700 flex items-center justify-end">
//                             <span>EDIT</span>
//                             <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
//                             </svg>
//                           </span>
//                         </th>
//                       </tr>
//                     </thead>

//                     {/* Table Body */}
//                     <tbody className="divide-y divide-gray-100">
//                       {polList.map((pol, index) => (
//                         <tr key={pol.id} className="hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300 group">
//                           <td className="px-6 py-4">
//                             <span className="font-semibold text-gray-700 group-hover:text-indigo-700">
//                             {pol.id}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4">
//                             {editingId === pol.id ? (
//                               <input
//                                 type="text"
//                                 value={editingName}
//                                 onChange={(e) => setEditingName(e.target.value)}
//                                 onKeyDown={(e) => handleKeyPress(e, pol.id)}
//                                 onBlur={() => handleEditSave(pol.id)}
//                                 className="w-full px-3 py-2 border-2 border-indigo-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-300 text-gray-800 font-medium bg-indigo-50"
//                                 autoFocus
//                               />
//                             ) : (
//                               <span className="font-medium text-gray-800 group-hover:text-indigo-800">
//                                 {pol.name}
//                               </span>
//                             )}
//                           </td>
//                           <td className="px-6 py-4 text-right">
//                             {editingId === pol.id ? (
//                               <div className="flex items-center justify-end space-x-2">
//                                 <button 
//                                   onClick={() => handleEditSave(pol.id)}
//                                   className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg group"
//                                   title="Save"
//                                 >
//                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                   </svg>
//                                 </button>
//                                 <button 
//                                   onClick={handleEditCancel}
//                                   className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg group"
//                                   title="Cancel"
//                                 >
//                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                   </svg>
//                                 </button>
//                               </div>
//                             ) : (
//                               <div className="flex items-center justify-end space-x-2">
//                                 <button 
//                                   onClick={() => handleEditStart(pol)}
//                                   className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg group"
//                                   title="Edit"
//                                 >
//                                   <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
//                                   </svg>
//                                 </button>
//                                 <button 
//                                   onClick={() => handleDeletePol(pol.id)}
//                                   className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg group"
//                                   title="Delete"
//                                 >
//                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                   </svg>
//                                 </button>
//                               </div>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
                
//                 {polList.length === 0 && (
//                   <div className="text-center py-12">
//                     <div className="text-gray-400 text-lg font-medium">
//                       No POL entries found
//                     </div>
//                     <div className="text-gray-300 text-sm mt-2">
//                       Add your first POL using the form on the left
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PolDetailsPage;


import { useState, useEffect } from "react";
import axios from "axios";
import { Edit3, Trash2, Check, X, ChevronLeft, ChevronRight, Plus, Loader2, Search as SearchIcon } from "lucide-react";


const PolDetailsPage = () => {
  const [polName, setPolName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [polList, setPolList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Authentication required. Redirecting to login...');
      window.location.href = '/login';
      throw new Error('Authentication token missing');
    }
    return { 'Authorization': `Bearer ${token}` };
  };

  const fetchPolList = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.get('http://localhost:5000/api/ports', {
        headers: getAuthHeaders(),
      });
      setPolList(response.data);
    } catch (error) {
      setErrorMsg("Error fetching POL list. Please login or try again.");
      setPolList([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPolList();
  }, []);

  const handleAddPol = async () => {
    if (polName.trim()) {
      try {
        const response = await axios.post('http://localhost:5000/api/ports', 
          { name: polName.trim() },
          { headers: getAuthHeaders() }
        );
        setPolList(prev => [...prev, { id: response.data.id, name: response.data.name }]);
        setPolName('');
      } catch (error) {
        setErrorMsg("Error adding POL. Please try again.");
      }
    } else {
      setErrorMsg("POL name is required.");
    }
  };

  const handleEditStart = (pol) => {
    setEditingId(pol.id);
    setEditingName(pol.name);
    setErrorMsg('');
  };

  const handleEditSave = async (id) => {
    if (editingName.trim()) {
      try {
        await axios.put(`http://localhost:5000/api/ports/${id}`, {
          name: editingName.trim()
        }, {
          headers: getAuthHeaders()
        });
        setPolList(polList.map(pol =>
          pol.id === id ? { ...pol, name: editingName.trim() } : pol
        ));
        setEditingId(null);
        setEditingName('');
      } catch (error) {
        setErrorMsg("There was an error updating the POL name. Please try again.");
      }
    } else {
      setErrorMsg("POL name cannot be empty.");
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName('');
    setErrorMsg('');
  };

  const handleKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      handleEditSave(id);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const handleDeletePol = async (id) => {
    if (!window.confirm('Are you sure you want to delete this POL?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/ports/${id}`, {
        headers: getAuthHeaders(),
      });
      setPolList(prev => prev.filter(pol => pol.id !== id));
    } catch (error) {
      setErrorMsg("There was an error deleting the POL. Please try again.");
    }
  };

  // Search filter
  const filteredPols = polList.filter(pol =>
    pol.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredPols.length / itemsPerPage);
  const paginatedPols = filteredPols.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) setCurrentPage(currentPage - 1);
    if (direction === 'next' && currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Reset page if search or polList changes and current page is out of range
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
    // eslint-disable-next-line
  }, [search, polList]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 w-full pt-6 pb-12">
        <div className="max-w-4xl mx-auto w-full px-2 sm:px-4">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-700 tracking-tight flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg text-white shadow-md text-xl bg-indigo-600">
                    POL
                  </span>
                  <span className="ml-1">Port of Loading Management</span>
                </h1>
                <p className="mt-2 text-gray-500 text-base">
                  Add, edit, search, and manage your list of Ports of Loading.
                </p>
              </div>
              <div>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={polName}
                    onChange={(e) => setPolName(e.target.value)}
                    className="w-48 md:w-64 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                    placeholder="Enter new POL name..."
                  />
                  <button
                    onClick={handleAddPol}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-md font-medium flex items-center transition"
                    title="Add POL"
                  >
                    <Plus className="w-5 h-5 mr-1" />
                    Add
                  </button>
                </div>
              </div>
            </div>
            {/* Search Bar */}
            <div className="flex items-center mb-4 gap-2">
              <div className="relative flex items-center w-full md:w-1/2">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search POL name..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-400 text-gray-700 bg-gray-50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <span className="ml-2 text-sm text-gray-400">
                {filteredPols.length} result{filteredPols.length !== 1 ? 's' : ''}
              </span>
            </div>
            {errorMsg && (
              <div className="mb-4 text-red-700 bg-red-100 px-4 py-2 rounded border border-red-200">{errorMsg}</div>
            )}
            {/* POL Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm bg-white">
              <table className="w-full rounded-xl text-[16px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 w-16">#</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">POL Name</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700 w-36">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="py-10 text-center text-gray-400">
                        <Loader2 className="animate-spin inline-block mr-2" /> Loading POLs...
                      </td>
                    </tr>
                  ) : paginatedPols.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-14 text-center text-gray-400">
                        No POL entries found.<br />
                        Add your first POL using the form above.
                      </td>
                    </tr>
                  ) : (
                    paginatedPols.map((pol, idx) => (
                      <tr key={pol.id} className="hover:bg-gray-50 transition-all duration-200 rounded-xl">
                        <td className="px-4 py-3 font-medium text-gray-800">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                        <td className="px-4 py-3">
                          {editingId === pol.id ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => handleKeyPress(e, pol.id)}
                              onBlur={() => handleEditSave(pol.id)}
                              className="w-full px-3 py-2 border-2 border-indigo-300 rounded-lg focus:border-indigo-500 outline-none transition-all text-gray-800 font-medium bg-gray-50"
                              autoFocus
                            />
                          ) : (
                            <span className="font-medium text-gray-800">{pol.name}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {editingId === pol.id ? (
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleEditSave(pol.id)}
                                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
                                title="Save"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleEditCancel}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleEditStart(pol)}
                                className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded transition"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePol(pol.id)}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-between items-center px-2 py-6">
              <button
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </button>
              <span className="text-gray-600 text-base">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => handlePageChange('next')}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex items-center px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PolDetailsPage;