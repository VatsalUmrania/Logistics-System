// import React, { useState } from 'react';
// import { Search, User, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

// const ClientsSearch = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectAll, setSelectAll] = useState(false);
//   const [sortField, setSortField] = useState('id');
//   const [sortDirection, setSortDirection] = useState('asc');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
  
//   // Mock client data
//   const clients = [
//     { id: 1, name: 'AL ETRAMAIL KHALUI COMMERCIAL LTD.CO', location: 'Riyadh, Saudi Arabia', industry: 'Shipping & Logistics' },
//     { id: 2, name: 'SHARAF SHIPPING CO.', location: 'Dubai, UAE', industry: 'Marine Transport' },
//     { id: 3, name: 'JIGGH', location: 'Jeddah, Saudi Arabia', industry: 'Import/Export' },
//     { id: 4, name: 'FOCUZ LINE', location: 'Dammam, Saudi Arabia', industry: 'Freight Forwarding' },
//     { id: 5, name: 'EASTERN POWER SUPPORT TRADING EST.', location: 'Khobar, Saudi Arabia', industry: 'Energy & Logistics' },
//     { id: 6, name: 'PIVOT SHIPPING COMPANY LIMITED', location: 'Manama, Bahrain', industry: 'Shipping' },
//     { id: 7, name: 'RAISCO TRADING COMPANY', location: 'Riyadh, Saudi Arabia', industry: 'Trading' },
//     { id: 8, name: 'GLOBAL LOGISTICS PARTNERS', location: 'Dubai, UAE', industry: 'Logistics' },
//     { id: 9, name: 'MIDDLE EAST TRADING GROUP', location: 'Abu Dhabi, UAE', industry: 'Trading' },
//     { id: 10, name: 'ARABIAN GULF SHIPPING', location: 'Doha, Qatar', industry: 'Shipping' },
//     { id: 11, name: 'RED SEA IMPORT EXPORT', location: 'Jeddah, Saudi Arabia', industry: 'Import/Export' },
//     { id: 12, name: 'DESERT CARGO SERVICES', location: 'Riyadh, Saudi Arabia', industry: 'Cargo Services' },
//     { id: 13, name: 'OCEAN FREIGHT SOLUTIONS', location: 'Muscat, Oman', industry: 'Freight' },
//     { id: 14, name: 'SAUDI INDUSTRIAL SUPPLIERS', location: 'Jubail, Saudi Arabia', industry: 'Industrial' },
//     { id: 15, name: 'GULF TRANSPORT & LOGISTICS', location: 'Kuwait City, Kuwait', industry: 'Transport' },
//   ];

//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   const sortedClients = [...clients].sort((a, b) => {
//     if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
//     if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
//     return 0;
//   });

//   const filteredClients = sortedClients.filter(client => 
//     client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     client.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     client.industry.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//             <User className="w-8 h-8 mr-3 text-indigo-600" />
//             CLIENTS SEARCH
//           </h1>
//           <p className="text-gray-600 mt-2">Manage and search your client database</p>
//         </div>

//         {/* Search Section */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
//             <h2 className="text-xl font-bold text-white flex items-center">
//               <Search className="w-5 h-5 mr-2" />
//               Search
//             </h2>
//           </div>
          
//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Client Name
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User className="w-5 h-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     placeholder="Enter client name"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     disabled={selectAll}
//                   />
//                 </div>
//               </div>
              
//               <div className="flex items-end">
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="selectAll"
//                     className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
//                     checked={selectAll}
//                     onChange={(e) => setSelectAll(e.target.checked)}
//                   />
//                   <label htmlFor="selectAll" className="ml-2 text-sm font-medium text-gray-700">
//                     Select all clients
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Clients Table */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800">Client List</h3>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                     onClick={() => handleSort('id')}
//                   >
//                     <div className="flex items-center">
//                       SL.No
//                       {sortField === 'id' && (
//                         sortDirection === 'asc' ? 
//                         <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
//                         <ChevronDown className="w-4 h-4 ml-1" />
//                       )}
//                     </div>
//                   </th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                     onClick={() => handleSort('name')}
//                   >
//                     <div className="flex items-center">
//                       Name
//                       {sortField === 'name' && (
//                         sortDirection === 'asc' ? 
//                         <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
//                         <ChevronDown className="w-4 h-4 ml-1" />
//                       )}
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Details
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {currentClients.map((client, index) => (
//                   <tr key={client.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">
//                         {(currentPage - 1) * itemsPerPage + index + 1}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
//                           <User className="w-5 h-5 text-white" />
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{client.name}</div>
//                           <div className="text-xs text-gray-500">{client.industry}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
//                           <div className="w-6 h-6 flex items-center justify-center text-indigo-600">
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
//                               <path fillRule="evenodd" d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
//                             </svg>
//                           </div>
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
          
//           {/* Pagination */}
//           {filteredClients.length > itemsPerPage && (
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
                
//                 {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
//                   let page;
//                   if (totalPages <= 5) {
//                     page = i + 1;
//                   } else {
//                     if (currentPage <= 3) {
//                       page = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       page = totalPages - 4 + i;
//                     } else {
//                       page = currentPage - 2 + i;
//                     }
//                   }
                  
//                   return (
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
//                   );
//                 })}
                
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

// export default ClientsSearch;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  User, Search, ChevronDown, ChevronLeft, ChevronRight, Phone, MapPin, Mail
} from 'lucide-react';

// Auth header utility
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error("Authentication token missing - redirecting to login");
    window.location.href = '/login';
    return {};
  }
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

const ClientsPage = () => {
  // State
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const itemsPerPage = 8;

  // Fetch data
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get('http://localhost:5000/api/clients', getAuthHeaders());
        setClients(res.data);
      } catch (err) {
        setError('Failed to load clients. Please login again or try later.');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  // Sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedClients = [...clients].sort((a, b) => {
    const aValue = (a[sortField] || '').toString().toLowerCase();
    const bValue = (b[sortField] || '').toString().toLowerCase();
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Searching (frontend only)
  const filteredClients = sortedClients.filter(client =>
    (client.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.industry_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.country || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.phone1 || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem);

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading clients...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-red-500 mb-4">
            <User className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <User className="w-8 h-8 mr-3 text-indigo-600" />
              CLIENTS
            </h1>
            <p className="text-gray-600 mt-2">Browse and manage your client database</p>
          </div>
          {/* Search bar */}
          <div className="mt-4 md:mt-0">
            <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search clients..."
                className="bg-transparent outline-none w-56"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Client List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('client_id')}
                  >
                    <div className="flex items-center">
                      SL.No
                      {sortField === 'client_id' && (
                        <ChevronDown className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortField === 'name' && (
                        <ChevronDown className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentClients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">
                      No clients found.
                    </td>
                  </tr>
                ) : (
                  currentClients.map((client, idx) => (
                    <tr key={client.client_id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{client.name}</div>
                            <div className="text-xs text-gray-500 italic" style={{ direction: 'rtl' }}>
                              {client.ar_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{client.industry_type || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-sm">
                          {client.phone1 && (
                            <span className="flex items-center gap-1 text-gray-700">
                              <Phone className="w-4 h-4 text-indigo-500" />
                              {client.phone1}
                            </span>
                          )}
                          {client.cp1_email && (
                            <span className="flex items-center gap-1 text-gray-700">
                              <Mail className="w-4 h-4 text-indigo-500" />
                              {client.cp1_email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-sm">
                          <span className="flex items-center gap-1 text-gray-700">
                            <MapPin className="w-4 h-4 text-indigo-500" />
                            {client.city}, {client.country}
                          </span>
                          <span className="text-xs text-gray-500">{client.address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">
                        {client.credit_limit ? `SAR ${Number(client.credit_limit).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {filteredClients.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredClients.length)} of {filteredClients.length}
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
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else {
                    if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                  }
                  return (
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
                  );
                })}
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

export default ClientsPage;
