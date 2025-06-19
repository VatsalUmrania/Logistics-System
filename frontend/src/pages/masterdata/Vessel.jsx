// import { useState, useEffect } from 'react';
// import { Truck, Plus, Pencil, Trash2, ChevronDown, ChevronUp, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

// // Helper to convert snake_case or other keys to camelCase (basic version)
// function toCamelCase(obj) {
//   const newObj = {};
//   for (const key in obj) {
//     const camelKey = key.replace(/([-_][a-z])/gi, s => s.toUpperCase().replace('-', '').replace('_', ''));
//     newObj[camelKey] = obj[key];
//   }
//   return newObj;
// }

// const VesselDetailsPage = () => {
//   const [vessels, setVessels] = useState([]);
//   const [newVessel, setNewVessel] = useState({ vesselNo: '', vesselName: '' });
//   const [isAdding, setIsAdding] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [sortField, setSortField] = useState('vesselNo');
//   const [sortDirection, setSortDirection] = useState('asc');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // Fetch vessels on mount
//   const getAuthHeaders = () => {
//     const token = localStorage.getItem('authToken');
//     if (!token) throw new Error('Authentication token missing');
//     return { 'Authorization': `Bearer ${token}` };
//   };

//   // Fetch vessels from the backend
//   const fetchVessels = async () => {
//     // Start loading before the fetch

//     try {
//       const res = await fetch('http://localhost:5000/api/vessels/', {
//         headers: getAuthHeaders(),
//       });

//       if (!res.ok) {
//         throw new Error(`Failed to fetch vessels: ${res.status} ${res.statusText}`);
//       }

//       const data = await res.json();

//       // Format the vessel data
//       const formatted = data.map(item => ({
//         id: item.id,
//         vesselName: item.name,
//         vesselNo: item.number,
//         status: item.status || 'Active',
//       }));

//       setVessels(formatted); // Update the state with the vessels data
//     } catch (err) {
//       console.error('Failed to fetch vessels:', err);
//       setError('Failed to load vessels'); // Set error message
//     } 
//   };

//   useEffect(() => {
//     fetchVessels(); // Fetch vessels when the component mounts
//   }, []);
  
//   const handleAddVessel = async () => {
//     // Basic validation
//     if (!newVessel.vesselName.trim()) {
//       alert("Vessel name is required.");
//       return;
//     }
    
//     try {
//       const headers = getAuthHeaders(); // Get the Authorization header
  
//       if (editingId !== null) {
//         // Update existing vessel on backend
//         const res = await fetch(`http://localhost:5000/api/vessels/${editingId}`, {
//           method: 'PUT',
//           headers: { 
//             'Content-Type': 'application/json',
//             ...headers, // Include the Authorization header
//           },
//           body: JSON.stringify({
//             name: newVessel.vesselName,
//             number: newVessel.vesselNo,
//           }),
//         });
  
//         if (!res.ok) {
//           throw new Error(`Failed to update vessel: ${res.status} ${res.statusText}`);
//         }
  
//         // Update frontend state
//         setVessels(vessels.map(v =>
//           v.id === editingId ? { ...v, vesselName: newVessel.vesselName, vesselNo: newVessel.vesselNo } : v
//         ));
  
//         setEditingId(null); // Clear editing state
//       } else {
//         // Create new vessel on backend
//         const res = await fetch('http://localhost:5000/api/vessels/', {
//           method: 'POST',
//           headers: { 
//             'Content-Type': 'application/json',
//             ...getAuthHeaders(), // Include the Authorization header
//           },
//           body: JSON.stringify({
//             name: newVessel.vesselName,
//             number: newVessel.vesselNo,
//           }),
//         });
  
//         if (!res.ok) {
//           throw new Error(`Failed to create vessel: ${res.status} ${res.statusText}`);
//         }
  
//         const created = await res.json();
  
//         // Add new vessel to frontend state, mapping backend keys
//         setVessels([...vessels, {
//           id: created.id,
//           vesselName: created.name,
//           vesselNo: created.number,
//           status: created.status || 'Active',
//         }]);
//       }
  
//       // Reset form and state
//       setNewVessel({ vesselNo: '', vesselName: '' });
//       setIsAdding(false);
//     } catch (err) {
//       console.error('Error adding/updating vessel:', err);
//       setError(err.message || 'An error occurred while adding or updating the vessel.');
//     } 
//   };
  

//   const handleEdit = (vessel) => {
//     if (!vessel) {
//       console.error("Vessel object is missing or undefined.");
//       return;
//     }
  
//     setNewVessel({
//       vesselNo: vessel.vesselNo || '',
//       vesselName: vessel.vesselName || '',
//     });
  
//     setEditingId(vessel.id);  // Set the ID of the vessel to edit
//   };

//   const handleDelete = async (id) => {
//     try {
//       // Make DELETE request with authorization header
//       const res = await fetch(`http://localhost:5000/api/vessels/${id}`, {
//         method: 'DELETE',
//         headers: getAuthHeaders(), // Add authorization header
//       });
  
//       // Check if the deletion was successful
//       if (!res.ok) {
//         throw new Error(`Failed to delete vessel with id ${id}`);
//       }
  
//       // Remove the deleted vessel from frontend state
//       setVessels(vessels.filter(v => v.id !== id));
//     } catch (err) {
//       console.error('Error deleting vessel:', err);
//       // Optionally handle the error (e.g., show a message to the user)
//     }
//   };

//   const toggleStatus = async (id) => {
//     try {
//       const vessel = vessels.find(v => v.id === id);
//       const newStatus = vessel.status === 'Active' ? 'Inactive' : 'Active';
  
//       // Send the PUT request with Authorization header
//       const res = await fetch(`http://localhost:5000/api/vessels/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           ...getAuthHeaders(), // Add authorization header
//         },
//         body: JSON.stringify({
//           name: vessel.vesselName,
//           number: vessel.vesselNo,
//           status: newStatus,
//         }),
//       });
  
//       if (!res.ok) {
//         throw new Error(`Failed to update vessel status with id ${id}`);
//       }
  
//       // Update the vessel status in frontend state
//       setVessels(vessels.map(v =>
//         v.id === id ? { ...v, status: newStatus } : v
//       ));
//     } catch (err) {
//       console.error('Error toggling status:', err);
//       // Optionally, handle the error (e.g., show a message to the user)
//     }
//   };
  
//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   // Sort vessels by selected field and direction
//   const sortedVessels = [...vessels].sort((a, b) => {
//     const aVal = a[sortField] ? a[sortField].toLowerCase() : '';
//     const bVal = b[sortField] ? b[sortField].toLowerCase() : '';
//     if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
//     if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
//     return 0;
//   });

//   // Filter vessels safely with lowercase and checking for undefined fields
//   const filteredVessels = sortedVessels.filter(vessel =>
//     (vessel.vesselName && vessel.vesselName.toLowerCase().includes(searchTerm.toLowerCase())) ||
//     (vessel.vesselNo && vessel.vesselNo.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   // Pagination calculations
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentVessels = filteredVessels.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredVessels.length / itemsPerPage);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//               <Truck className="w-8 h-8 mr-3 text-indigo-600" />
//               VESSEL DETAILS
//             </h1>
//             <p className="text-gray-600 mt-2">Manage all vessel information in your logistics system</p>
//           </div>

//           <div className="mt-4 md:mt-0 flex space-x-3">
//             <div className="relative">
//               <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
//                 <Search className="w-5 h-5 text-gray-400 mr-2" />
//                 <input
//                   type="text"
//                   placeholder="Search vessels..."
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
//           {/* Add Vessel Form */}
//           <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
//               <h2 className="text-xl font-bold text-white flex items-center">
//                 <Plus className="w-5 h-5 mr-2" />
//                 {editingId ? 'Edit Vessel Details' : 'Add Vessel Details'}
//               </h2>
//             </div>

//             <div className="p-6">
//               <div className="space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Vessel Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     placeholder="Enter vessel name"
//                     value={newVessel.vesselName}
//                     onChange={(e) => setNewVessel({ ...newVessel, vesselName: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Vessel Number
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     placeholder="Enter vessel number"
//                     value={newVessel.vesselNo}
//                     onChange={(e) => setNewVessel({ ...newVessel, vesselNo: e.target.value })}
//                   />
//                 </div>

//                 <button
//                   onClick={handleAddVessel}
//                   className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition duration-150"
//                 >
//                   {editingId ? 'Update Vessel' : 'Add Vessel'}
//                 </button>
//                 {isAdding && (
//                   <button
//                     onClick={() => {
//                       setIsAdding(false);
//                       setEditingId(null);
//                       setNewVessel({ vesselNo: '', vesselName: '' });
//                     }}
//                     className="mt-2 w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-semibold transition duration-150"
//                   >
//                     Cancel
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Vessel List Table */}
//           <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th
//                     onClick={() => handleSort('vesselNo')}
//                     className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider select-none"
//                   >
//                     Vessel Number
//                     {sortField === 'vesselNo' && (sortDirection === 'asc' ? <ChevronUp className="inline ml-1 w-3 h-3" /> : <ChevronDown className="inline ml-1 w-3 h-3" />)}
//                   </th>
//                   <th
//                     onClick={() => handleSort('vesselName')}
//                     className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider select-none"
//                   >
//                     Vessel Name
//                     {sortField === 'vesselName' && (sortDirection === 'asc' ? <ChevronUp className="inline ml-1 w-3 h-3" /> : <ChevronDown className="inline ml-1 w-3 h-3" />)}
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider select-none">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider select-none">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {currentVessels.length === 0 && (
//                   <tr>
//                     <td colSpan={4} className="text-center py-6 text-gray-400">
//                       No vessels found.
//                     </td>
//                   </tr>
//                 )}
//                 {currentVessels.map((vessel) => (
//                   <tr key={vessel.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{vessel.vesselNo || '-'}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{vessel.vesselName || '-'}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <button
//                         onClick={() => toggleStatus(vessel.id)}
//                         className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           vessel.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}
//                       >
//                         {vessel.status}
//                       </button>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-3">
//                       <button
//                         onClick={() => handleEdit(vessel)}
//                         title="Edit Vessel"
//                         className="text-indigo-600 hover:text-indigo-900"
//                       >
//                         <Pencil className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(vessel.id)}
//                         title="Delete Vessel"
//                         className="text-red-600 hover:text-red-900"
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             <div className="flex justify-between items-center p-4">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className={`px-3 py-1 rounded-md border border-gray-300 ${
//                   currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 <ChevronLeft className="w-4 h-4 inline" /> Previous
//               </button>
//               <div className="text-sm text-gray-600">
//                 Page {currentPage} of {totalPages}
//               </div>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages || totalPages === 0}
//                 className={`px-3 py-1 rounded-md border border-gray-300 ${
//                   currentPage === totalPages || totalPages === 0
//                     ? 'text-gray-300 cursor-not-allowed'
//                     : 'text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 Next <ChevronRight className="w-4 h-4 inline" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VesselDetailsPage;


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