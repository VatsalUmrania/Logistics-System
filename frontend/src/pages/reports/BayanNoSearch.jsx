import React, { useState } from 'react';
import { Search, FileText, ChevronDown, Download } from 'lucide-react';

const BayanNoSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bayanData, setBayanData] = useState([
    {
      id: 1,
      bayanNo: 'BYN-2024-001',
      date: '2024-10-15',
      client: 'EASTERN POWER SUPPORT TRADING EST.',
      origin: 'Jeddah',
      destination: 'Riyadh',
      status: 'Cleared'
    },
    {
      id: 2,
      bayanNo: 'BYN-2024-002',
      date: '2024-10-18',
      client: 'Overseas Development Company Limited',
      origin: 'Dammam',
      destination: 'Jubail',
      status: 'Pending'
    },
    {
      id: 3,
      bayanNo: 'BYN-2024-003',
      date: '2024-10-22',
      client: 'PIVOT SHIPPING COMPANY LIMITED',
      origin: 'Riyadh',
      destination: 'Jeddah',
      status: 'In Transit'
    },
    {
      id: 4,
      bayanNo: 'BYN-2024-004',
      date: '2024-10-25',
      client: 'RAISCO TRADING COMPANY',
      origin: 'Medina',
      destination: 'Khobar',
      status: 'Cleared'
    },
    {
      id: 5,
      bayanNo: 'BYN-2024-005',
      date: '2024-10-28',
      client: 'GLOBAL LOGISTICS PARTNERS',
      origin: 'Tabuk',
      destination: 'Hail',
      status: 'Rejected'
    }
  ]);
  
  const [filteredBayans, setFilteredBayans] = useState(bayanData);
  const [sortField, setSortField] = useState('bayanNo');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredBayans(bayanData);
      return;
    }
    
    const results = bayanData.filter(bayan => 
      bayan.bayanNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bayan.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bayan.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bayan.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredBayans(results);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedBayans = [...filteredBayans].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBayans = sortedBayans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedBayans.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              BAYAN NO SEARCH
            </h1>
            <p className="text-gray-600 mt-2">Search and manage Bayan documents</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Search Bayan Documents
            </h2>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bayan No
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter Bayan number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center shadow-md"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">BAYAN DOCUMENTS</h3>
            <div className="text-sm text-gray-500">
              Showing {Math.min(filteredBayans.length, itemsPerPage)} of {filteredBayans.length} bayans
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('bayanNo')}
                  >
                    <div className="flex items-center">
                      Bayan No
                      {sortField === 'bayanNo' && (
                        sortDirection === 'asc' ? 
                        <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Date
                      {sortField === 'date' && (
                        sortDirection === 'asc' ? 
                        <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('client')}
                  >
                    <div className="flex items-center">
                      Client
                      {sortField === 'client' && (
                        sortDirection === 'asc' ? 
                        <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Origin/Destination
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortField === 'status' && (
                        sortDirection === 'asc' ? 
                        <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentBayans.length > 0 ? (
                  currentBayans.map((bayan, index) => (
                    <tr key={bayan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">{bayan.bayanNo}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{bayan.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{bayan.client}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{bayan.origin}</div>
                        <div className="text-xs text-gray-500">to {bayan.destination}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${bayan.status === 'Cleared' ? 'bg-green-100 text-green-800' : 
                            bayan.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            bayan.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'}`}>
                          {bayan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center mx-auto">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No Bayan documents found</h4>
                        <p className="text-gray-400 mt-1">Try a different search term</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredBayans.length > itemsPerPage && (
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
                  ←
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
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BayanNoSearch;