// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Edit3, Trash2, Check, X, ChevronLeft, ChevronRight, Plus, Loader2, Search as SearchIcon } from "lucide-react";


// const PolDetailsPage = () => {
//   const [polName, setPolName] = useState('');
//   const [editingId, setEditingId] = useState(null);
//   const [editingName, setEditingName] = useState('');
//   const [polList, setPolList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const [search, setSearch] = useState('');

//   const getAuthHeaders = () => {
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       alert('Authentication required. Redirecting to login...');
//       window.location.href = '/login';
//       throw new Error('Authentication token missing');
//     }
//     return { 'Authorization': `Bearer ${token}` };
//   };

//   const fetchPolList = async () => {
//     setLoading(true);
//     setErrorMsg('');
//     try {
//       const response = await axios.get('http://localhost:5000/api/ports', {
//         headers: getAuthHeaders(),
//       });
//       setPolList(response.data);
//     } catch (error) {
//       setErrorMsg("Error fetching POL list. Please login or try again.");
//       setPolList([]);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchPolList();
//   }, []);

//   const handleAddPol = async () => {
//     if (polName.trim()) {
//       try {
//         const response = await axios.post('http://localhost:5000/api/ports', 
//           { name: polName.trim() },
//           { headers: getAuthHeaders() }
//         );
//         setPolList(prev => [...prev, { id: response.data.id, name: response.data.name }]);
//         setPolName('');
//       } catch (error) {
//         setErrorMsg("Error adding POL. Please try again.");
//       }
//     } else {
//       setErrorMsg("POL name is required.");
//     }
//   };

//   const handleEditStart = (pol) => {
//     setEditingId(pol.id);
//     setEditingName(pol.name);
//     setErrorMsg('');
//   };

//   const handleEditSave = async (id) => {
//     if (editingName.trim()) {
//       try {
//         await axios.put(`http://localhost:5000/api/ports/${id}`, {
//           name: editingName.trim()
//         }, {
//           headers: getAuthHeaders()
//         });
//         setPolList(polList.map(pol =>
//           pol.id === id ? { ...pol, name: editingName.trim() } : pol
//         ));
//         setEditingId(null);
//         setEditingName('');
//       } catch (error) {
//         setErrorMsg("There was an error updating the POL name. Please try again.");
//       }
//     } else {
//       setErrorMsg("POL name cannot be empty.");
//     }
//   };

//   const handleEditCancel = () => {
//     setEditingId(null);
//     setEditingName('');
//     setErrorMsg('');
//   };

//   const handleKeyPress = (e, id) => {
//     if (e.key === 'Enter') {
//       handleEditSave(id);
//     } else if (e.key === 'Escape') {
//       handleEditCancel();
//     }
//   };

//   const handleDeletePol = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this POL?')) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/ports/${id}`, {
//         headers: getAuthHeaders(),
//       });
//       setPolList(prev => prev.filter(pol => pol.id !== id));
//     } catch (error) {
//       setErrorMsg("There was an error deleting the POL. Please try again.");
//     }
//   };

//   // Search filter
//   const filteredPols = polList.filter(pol =>
//     pol.name.toLowerCase().includes(search.trim().toLowerCase())
//   );

//   // Pagination logic
//   const totalPages = Math.ceil(filteredPols.length / itemsPerPage);
//   const paginatedPols = filteredPols.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   const handlePageChange = (direction) => {
//     if (direction === 'prev' && currentPage > 1) setCurrentPage(currentPage - 1);
//     if (direction === 'next' && currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   // Reset page if search or polList changes and current page is out of range
//   useEffect(() => {
//     if (currentPage > totalPages) setCurrentPage(1);
//     // eslint-disable-next-line
//   }, [search, polList]);

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <main className="flex-1 w-full pt-6 pb-12">
//         <div className="max-w-4xl mx-auto w-full px-2 sm:px-4">
//           {/* Card */}
//           <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
//             {/* Header */}
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-bold text-gray-700 tracking-tight flex items-center gap-3">
//                   <span className="px-3 py-1 rounded-lg text-white shadow-md text-xl bg-indigo-600">
//                     POL
//                   </span>
//                   <span className="ml-1">Port of Loading Management</span>
//                 </h1>
//                 <p className="mt-2 text-gray-500 text-base">
//                   Add, edit, search, and manage your list of Ports of Loading.
//                 </p>
//               </div>
//               <div>
//                 <div className="flex items-center">
//                   <input
//                     type="text"
//                     value={polName}
//                     onChange={(e) => setPolName(e.target.value)}
//                     className="w-48 md:w-64 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
//                     placeholder="Enter new POL name..."
//                   />
//                   <button
//                     onClick={handleAddPol}
//                     className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-md font-medium flex items-center transition"
//                     title="Add POL"
//                   >
//                     <Plus className="w-5 h-5 mr-1" />
//                     Add
//                   </button>
//                 </div>
//               </div>
//             </div>
//             {/* Search Bar */}
//             <div className="flex items-center mb-4 gap-2">
//               <div className="relative flex items-center w-full md:w-1/2">
//                 <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search POL name..."
//                   className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-400 text-gray-700 bg-gray-50"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                 />
//               </div>
//               <span className="ml-2 text-sm text-gray-400">
//                 {filteredPols.length} result{filteredPols.length !== 1 ? 's' : ''}
//               </span>
//             </div>
//             {errorMsg && (
//               <div className="mb-4 text-red-700 bg-red-100 px-4 py-2 rounded border border-red-200">{errorMsg}</div>
//             )}
//             {/* POL Table */}
//             <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm bg-white">
//               <table className="w-full rounded-xl text-[16px]">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-700 w-16">#</th>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-700">POL Name</th>
//                     <th className="px-4 py-3 text-right font-semibold text-gray-700 w-36">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loading ? (
//                     <tr>
//                       <td colSpan={3} className="py-10 text-center text-gray-400">
//                         <Loader2 className="animate-spin inline-block mr-2" /> Loading POLs...
//                       </td>
//                     </tr>
//                   ) : paginatedPols.length === 0 ? (
//                     <tr>
//                       <td colSpan={3} className="py-14 text-center text-gray-400">
//                         No POL entries found.<br />
//                         Add your first POL using the form above.
//                       </td>
//                     </tr>
//                   ) : (
//                     paginatedPols.map((pol, idx) => (
//                       <tr key={pol.id} className="hover:bg-gray-50 transition-all duration-200 rounded-xl">
//                         <td className="px-4 py-3 font-medium text-gray-800">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
//                         <td className="px-4 py-3">
//                           {editingId === pol.id ? (
//                             <input
//                               type="text"
//                               value={editingName}
//                               onChange={(e) => setEditingName(e.target.value)}
//                               onKeyDown={(e) => handleKeyPress(e, pol.id)}
//                               onBlur={() => handleEditSave(pol.id)}
//                               className="w-full px-3 py-2 border-2 border-indigo-300 rounded-lg focus:border-indigo-500 outline-none transition-all text-gray-800 font-medium bg-gray-50"
//                               autoFocus
//                             />
//                           ) : (
//                             <span className="font-medium text-gray-800">{pol.name}</span>
//                           )}
//                         </td>
//                         <td className="px-4 py-3 text-right">
//                           {editingId === pol.id ? (
//                             <div className="flex items-center justify-end space-x-2">
//                               <button
//                                 onClick={() => handleEditSave(pol.id)}
//                                 className="p-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
//                                 title="Save"
//                               >
//                                 <Check className="w-4 h-4" />
//                               </button>
//                               <button
//                                 onClick={handleEditCancel}
//                                 className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
//                                 title="Cancel"
//                               >
//                                 <X className="w-4 h-4" />
//                               </button>
//                             </div>
//                           ) : (
//                             <div className="flex items-center justify-end space-x-2">
//                               <button
//                                 onClick={() => handleEditStart(pol)}
//                                 className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded transition"
//                                 title="Edit"
//                               >
//                                 <Edit3 className="w-4 h-4" />
//                               </button>
//                               <button
//                                 onClick={() => handleDeletePol(pol.id)}
//                                 className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
//                                 title="Delete"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                               </button>
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             {/* Pagination */}
//             <div className="flex justify-between items-center px-2 py-6">
//               <button
//                 onClick={() => handlePageChange('prev')}
//                 disabled={currentPage === 1}
//                 className="flex items-center px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
//               >
//                 <ChevronLeft className="w-4 h-4 mr-1" /> Prev
//               </button>
//               <span className="text-gray-600 text-base">
//                 Page {currentPage} of {totalPages || 1}
//               </span>
//               <button
//                 onClick={() => handlePageChange('next')}
//                 disabled={currentPage === totalPages || totalPages === 0}
//                 className="flex items-center px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
//               >
//                 Next <ChevronRight className="w-4 h-4 ml-1" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default PolDetailsPage;


import { useState, useEffect } from "react";
import axios from "axios";
import {
  Edit3, Trash2, Check, X, ChevronLeft, ChevronRight, Plus, Loader2, Search as SearchIcon, Ship
} from "lucide-react";

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
  const [successMsg, setSuccessMsg] = useState('');

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
    // eslint-disable-next-line
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
        setSuccessMsg('POL added successfully!');
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
    setSuccessMsg('');
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
        setSuccessMsg('POL updated successfully!');
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
    setSuccessMsg('');
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
      setSuccessMsg('POL deleted successfully!');
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

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
    // eslint-disable-next-line
  }, [search, polList]);

  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg('');
        setErrorMsg('');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8 px-2 md:px-8">
      <main className="flex-1 w-full">
        <div className="max-w-4xl mx-auto w-full">
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-400 rounded-xl flex items-center justify-center shadow">
              <Ship className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
                Port of Loading
              </h1>
              <p className="text-gray-500 font-medium">Manage your list of POLs used in operations.</p>
            </div>
          </div>

          {/* Add POL Form */}
          <div className="bg-white shadow rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center border border-gray-100">
            <input
              type="text"
              value={polName}
              onChange={e => setPolName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-base"
              placeholder="Enter new POL name..."
              onKeyDown={e => e.key === 'Enter' ? handleAddPol() : null}
            />
            <button
              onClick={handleAddPol}
              className="flex items-center px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg font-semibold shadow transition disabled:opacity-70"
              disabled={loading || !polName.trim()}
              title="Add POL"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add POL
            </button>
          </div>

          {/* Success/Error Message */}
          {successMsg && (
            <div className="mb-4 text-green-700 bg-green-100 px-4 py-2 rounded border border-green-200 font-semibold flex items-center">
              <Check className="w-5 h-5 mr-2" /> {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mb-4 text-red-700 bg-red-100 px-4 py-2 rounded border border-red-200 font-semibold flex items-center">
              <X className="w-5 h-5 mr-2" /> {errorMsg}
            </div>
          )}

          {/* Search Bar & Result Count */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
            <div className="relative flex items-center w-full md:w-1/2">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search POL name..."
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-400 text-gray-700 bg-gray-50"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <span className="ml-2 text-sm text-gray-400">
              {filteredPols.length} result{filteredPols.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* POL Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm bg-white">
            <table className="w-full rounded-xl text-base">
              <thead className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold w-16">#</th>
                  <th className="px-4 py-3 text-left font-semibold">POL Name</th>
                  <th className="px-4 py-3 text-right font-semibold w-36">Actions</th>
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
                    <tr key={pol.id} className="hover:bg-indigo-50 transition-all duration-200 rounded-xl">
                      <td className="px-4 py-3 font-medium text-gray-800">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td className="px-4 py-3">
                        {editingId === pol.id ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={e => setEditingName(e.target.value)}
                            onKeyDown={e => handleKeyPress(e, pol.id)}
                            onBlur={() => handleEditSave(pol.id)}
                            className="w-full px-3 py-2 border-2 border-indigo-300 rounded-lg focus:border-indigo-500 outline-none transition-all text-gray-800 font-medium bg-indigo-50"
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
              className="flex items-center px-3 py-1 bg-gradient-to-r from-indigo-100 to-blue-100 hover:from-indigo-200 hover:to-blue-200 text-indigo-700 rounded shadow disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </button>
            <span className="text-gray-700 text-base font-medium">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => handlePageChange('next')}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center px-3 py-1 bg-gradient-to-r from-indigo-100 to-blue-100 hover:from-indigo-200 hover:to-blue-200 text-indigo-700 rounded shadow disabled:opacity-50"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PolDetailsPage;