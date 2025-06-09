// import { useState } from 'react';
// import { Truck, Plus, Pencil, Trash2, ChevronDown, ChevronUp, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

// const VesselDetailsPage = () => {
//   const [vessels, setVessels] = useState([
//     { id: 1, vesselNo: 'VS001', vesselName: 'Ocean Voyager', status: 'Active' },
//     { id: 2, vesselNo: 'VS002', vesselName: 'Sea Explorer', status: 'Active' },
//     { id: 3, vesselNo: 'VS003', vesselName: 'Marine Carrier', status: 'Inactive' },
//     { id: 4, vesselNo: 'VS004', vesselName: 'Cargo Express', status: 'Active' },
//     { id: 5, vesselNo: 'VS005', vesselName: 'Atlantic Trader', status: 'Active' },
//     { id: 6, vesselNo: 'VS006', vesselName: 'Pacific Navigator', status: 'Inactive' },
//   ]);
  
//   const [newVessel, setNewVessel] = useState({ vesselNo: '', vesselName: '' });
//   const [isAdding, setIsAdding] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [sortField, setSortField] = useState('vesselNo');
//   const [sortDirection, setSortDirection] = useState('asc');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const handleAddVessel = () => {
//     if (!newVessel.vesselName.trim()) return;
    
//     if (editingId !== null) {
//       // Update existing vessel
//       setVessels(vessels.map(v => 
//         v.id === editingId ? { ...v, ...newVessel } : v
//       ));
//       setEditingId(null);
//     } else {
//       // Add new vessel
//       const newVesselWithId = {
//         ...newVessel,
//         id: vessels.length + 1,
//         status: 'Active'
//       };
//       setVessels([...vessels, newVesselWithId]);
//     }
    
//     setNewVessel({ vesselNo: '', vesselName: '' });
//     setIsAdding(false);
//   };

//   const handleEdit = (vessel) => {
//     setNewVessel({ vesselNo: vessel.vesselNo, vesselName: vessel.vesselName });
//     setEditingId(vessel.id);
//     setIsAdding(true);
//   };

//   const handleDelete = (id) => {
//     setVessels(vessels.filter(v => v.id !== id));
//   };

//   const toggleStatus = (id) => {
//     setVessels(vessels.map(v => 
//       v.id === id ? { ...v, status: v.status === 'Active' ? 'Inactive' : 'Active' } : v
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

//   const sortedVessels = [...vessels].sort((a, b) => {
//     if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
//     if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
//     return 0;
//   });

//   const filteredVessels = sortedVessels.filter(vessel => 
//     vessel.vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     vessel.vesselNo.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination
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
//                     onChange={(e) => setNewVessel({...newVessel, vesselName: e.target.value})}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Vessel No.
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     placeholder="Enter vessel number"
//                     value={newVessel.vesselNo}
//                     onChange={(e) => setNewVessel({...newVessel, vesselNo: e.target.value})}
//                   />
//                 </div>
                
//                 <div className="flex space-x-3 pt-2">
//                   <button
//                     onClick={handleAddVessel}
//                     className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1"
//                   >
//                     {editingId ? 'Update Vessel' : 'Add Vessel'}
//                   </button>
                  
//                   {isAdding && (
//                     <button
//                       onClick={() => {
//                         setIsAdding(false);
//                         setEditingId(null);
//                         setNewVessel({ vesselNo: '', vesselName: '' });
//                       }}
//                       className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Stats Overview */}
//           <div className="grid grid-cols-2 gap-5">
//             <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
//               <div className="text-3xl font-bold">{vessels.length}</div>
//               <div className="text-sm mt-1">Total Vessels</div>
//               <div className="mt-4 flex items-center">
//                 <div className="text-xs bg-white/20 rounded-full px-2 py-1">
//                   +12% from last month
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
//               <div className="text-3xl font-bold">
//                 {vessels.filter(v => v.status === 'Active').length}
//               </div>
//               <div className="text-sm mt-1">Active Vessels</div>
//               <div className="mt-4 flex items-center">
//                 <div className="text-xs bg-white/20 rounded-full px-2 py-1">
//                   +8% from last month
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
//               <div className="text-3xl font-bold">
//                 {vessels.filter(v => v.status === 'Inactive').length}
//               </div>
//               <div className="text-sm mt-1">Inactive Vessels</div>
//               <div className="mt-4 flex items-center">
//                 <div className="text-xs bg-white/20 rounded-full px-2 py-1">
//                   -3% from last month
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
//               <div className="text-3xl font-bold">24</div>
//               <div className="text-sm mt-1">Active Routes</div>
//               <div className="mt-4 flex items-center">
//                 <div className="text-xs bg-white/20 rounded-full px-2 py-1">
//                   +15% from last month
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Vessels Table */}
//         <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//             <h3 className="text-lg font-semibold text-gray-800">All Vessels</h3>
//             <div className="text-sm text-gray-500">
//               Showing {Math.min(filteredVessels.length, itemsPerPage)} of {filteredVessels.length} vessels
//             </div>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                     onClick={() => handleSort('vesselNo')}
//                   >
//                     <div className="flex items-center">
//                       Vessel No.
//                       {sortField === 'vesselNo' && (
//                         sortDirection === 'asc' ? 
//                         <ChevronUp className="w-4 h-4 ml-1" /> :
//                         <ChevronDown className="w-4 h-4 ml-1" />
//                       )}
//                     </div>
//                   </th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                     onClick={() => handleSort('vesselName')}
//                   >
//                     <div className="flex items-center">
//                       Vessel Name
//                       {sortField === 'vesselName' && (
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
//                 {currentVessels.length > 0 ? (
//                   currentVessels.map((vessel) => (
//                     <tr key={vessel.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">{vessel.vesselNo}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-gray-900">{vessel.vesselName}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span 
//                           className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
//                             vessel.status === 'Active' 
//                               ? 'bg-green-100 text-green-800' 
//                               : 'bg-red-100 text-red-800'
//                           }`}
//                           onClick={() => toggleStatus(vessel.id)}
//                         >
//                           {vessel.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button 
//                           onClick={() => handleEdit(vessel)}
//                           className="text-indigo-600 hover:text-indigo-900 mr-4"
//                         >
//                           <Pencil className="w-5 h-5" />
//                         </button>
//                         <button 
//                           onClick={() => handleDelete(vessel.id)}
//                           className="text-red-600 hover:text-red-900"
//                         >
//                           <Trash2 className="w-5 h-5" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="4" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <Truck className="w-16 h-16 text-gray-300 mb-4" />
//                         <h4 className="text-lg font-medium text-gray-500">No vessels found</h4>
//                         <p className="text-gray-400 mt-1">Add a new vessel to get started</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
          
//           {/* Pagination */}
//           {filteredVessels.length > itemsPerPage && (
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

// export default VesselDetailsPage;

import { useState, useEffect } from 'react';
import { Truck, Plus, Pencil, Trash2, ChevronDown, ChevronUp, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

// Helper to convert snake_case or other keys to camelCase (basic version)
function toCamelCase(obj) {
  const newObj = {};
  for (const key in obj) {
    const camelKey = key.replace(/([-_][a-z])/gi, s => s.toUpperCase().replace('-', '').replace('_', ''));
    newObj[camelKey] = obj[key];
  }
  return newObj;
}

const VesselDetailsPage = () => {
  const [vessels, setVessels] = useState([]);
  const [newVessel, setNewVessel] = useState({ vesselNo: '', vesselName: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('vesselNo');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch vessels on mount
  useEffect(() => {
    fetchVessels();
  }, []);

  const fetchVessels = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/vessels/');
      const data = await res.json();
      // Convert backend keys (name, number) to vesselName, vesselNo + keep id and status
      const formatted = data.map(item => ({
        id: item.id,
        vesselName: item.name,
        vesselNo: item.number,
        status: item.status || 'Active'
      }));
      setVessels(formatted);
    } catch (err) {
      console.error('Failed to fetch vessels:', err);
    }
  };

  const handleAddVessel = async () => {
    if (!newVessel.vesselName.trim()) return;

    try {
      if (editingId !== null) {
        // Update existing vessel on backend
        await fetch(`http://localhost:5000/api/vessels/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newVessel.vesselName,
            number: newVessel.vesselNo
          }),
        });

        // Update frontend state
        setVessels(vessels.map(v =>
          v.id === editingId ? { ...v, vesselName: newVessel.vesselName, vesselNo: newVessel.vesselNo } : v
        ));
        setEditingId(null);
      } else {
        // Create new vessel on backend
        const res = await fetch('http://localhost:5000/api/vessels/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newVessel.vesselName,
            number: newVessel.vesselNo
          }),
        });
        const created = await res.json();

        // Add new vessel to frontend state, mapping backend keys
        setVessels([...vessels, {
          id: created.id,
          vesselName: created.name,
          vesselNo: created.number,
          status: created.status || 'Active',
        }]);
      }

      setNewVessel({ vesselNo: '', vesselName: '' });
      setIsAdding(false);
    } catch (err) {
      console.error('Error adding/updating vessel:', err);
    }
  };

  const handleEdit = (vessel) => {
    setNewVessel({ vesselNo: vessel.vesselNo, vesselName: vessel.vesselName });
    setEditingId(vessel.id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/vessels/${id}`, { method: 'DELETE' });
      setVessels(vessels.filter(v => v.id !== id));
    } catch (err) {
      console.error('Error deleting vessel:', err);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const vessel = vessels.find(v => v.id === id);
      const newStatus = vessel.status === 'Active' ? 'Inactive' : 'Active';

      await fetch(`http://localhost:5000/api/vessels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: vessel.vesselName,
          number: vessel.vesselNo,
          status: newStatus,
        }),
      });

      setVessels(vessels.map(v =>
        v.id === id ? { ...v, status: newStatus } : v
      ));
    } catch (err) {
      console.error('Error toggling status:', err);
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

  // Sort vessels by selected field and direction
  const sortedVessels = [...vessels].sort((a, b) => {
    const aVal = a[sortField] ? a[sortField].toLowerCase() : '';
    const bVal = b[sortField] ? b[sortField].toLowerCase() : '';
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Filter vessels safely with lowercase and checking for undefined fields
  const filteredVessels = sortedVessels.filter(vessel =>
    (vessel.vesselName && vessel.vesselName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (vessel.vesselNo && vessel.vesselNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVessels = filteredVessels.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVessels.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Truck className="w-8 h-8 mr-3 text-indigo-600" />
              VESSEL DETAILS
            </h1>
            <p className="text-gray-600 mt-2">Manage all vessel information in your logistics system</p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search vessels..."
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
          {/* Add Vessel Form */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                {editingId ? 'Edit Vessel Details' : 'Add Vessel Details'}
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vessel Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter vessel name"
                    value={newVessel.vesselName}
                    onChange={(e) => setNewVessel({ ...newVessel, vesselName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vessel Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter vessel number"
                    value={newVessel.vesselNo}
                    onChange={(e) => setNewVessel({ ...newVessel, vesselNo: e.target.value })}
                  />
                </div>

                <button
                  onClick={handleAddVessel}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition duration-150"
                >
                  {editingId ? 'Update Vessel' : 'Add Vessel'}
                </button>
                {isAdding && (
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setEditingId(null);
                      setNewVessel({ vesselNo: '', vesselName: '' });
                    }}
                    className="mt-2 w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-semibold transition duration-150"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Vessel List Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    onClick={() => handleSort('vesselNo')}
                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider select-none"
                  >
                    Vessel Number
                    {sortField === 'vesselNo' && (sortDirection === 'asc' ? <ChevronUp className="inline ml-1 w-3 h-3" /> : <ChevronDown className="inline ml-1 w-3 h-3" />)}
                  </th>
                  <th
                    onClick={() => handleSort('vesselName')}
                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider select-none"
                  >
                    Vessel Name
                    {sortField === 'vesselName' && (sortDirection === 'asc' ? <ChevronUp className="inline ml-1 w-3 h-3" /> : <ChevronDown className="inline ml-1 w-3 h-3" />)}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider select-none">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider select-none">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentVessels.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-400">
                      No vessels found.
                    </td>
                  </tr>
                )}
                {currentVessels.map((vessel) => (
                  <tr key={vessel.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{vessel.vesselNo || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{vessel.vesselName || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => toggleStatus(vessel.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          vessel.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md border border-gray-300 ${
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-4 h-4 inline" /> Previous
              </button>
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-3 py-1 rounded-md border border-gray-300 ${
                  currentPage === totalPages || totalPages === 0
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Next <ChevronRight className="w-4 h-4 inline" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VesselDetailsPage;
