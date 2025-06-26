import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, ChevronLeft, ChevronRight, Download, 
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert
} from 'lucide-react';
import Select from 'react-select';

const BayanNoSearch = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const itemsPerPage = 10;

  // Custom styles for react-select dropdowns (matching AssignExpenses)
  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: '42px',
      borderRadius: '8px',
      borderColor: '#d1d5db',
      '&:hover': {
        borderColor: '#9ca3af'
      }
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({ ...base, zIndex: 9999 })
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = bayanData;

    // Apply search term filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(bayan => 
        bayan.bayanNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bayan.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bayan.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bayan.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply client filter
    if (clientFilter) {
      filtered = filtered.filter(bayan => 
        bayan.client.toLowerCase().includes(clientFilter.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(bayan => bayan.status === statusFilter);
    }

    setFilteredBayans(filtered);
    setCurrentPage(1);
  }, [searchTerm, clientFilter, statusFilter, bayanData]);

  // Search handler
  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(`Found ${filteredBayans.length} Bayan document(s)`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 500);
  };

  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Render sort icon
  const renderSortIcon = (field) => {
    if (sortField !== field) return <ArrowUp className="w-3 h-3 text-gray-400 inline" />;
    return sortDirection === 'asc' ?
      <ArrowUp className="w-3 h-3 text-indigo-600 inline" /> :
      <ArrowDown className="w-3 h-3 text-indigo-600 inline" />;
  };

  // Sort the filtered data
  const sortedBayans = [...filteredBayans].sort((a, b) => {
    let valA, valB;
    if (sortField === 'date') {
      valA = new Date(a.date);
      valB = new Date(b.date);
    } else {
      valA = a[sortField] ? a[sortField].toLowerCase() : '';
      valB = b[sortField] ? b[sortField].toLowerCase() : '';
    }
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBayans = sortedBayans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedBayans.length / itemsPerPage);

  // Download handler
  const handleDownload = (bayan) => {
    setSuccessMessage(`Downloading ${bayan.bayanNo}...`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Prepare options for dropdowns
  const clientOptions = [...new Set(bayanData.map(bayan => bayan.client))].map(client => ({
    value: client,
    label: client
  }));

  const statusOptions = [
    { value: 'Cleared', label: 'Cleared' },
    { value: 'Pending', label: 'Pending' },
    { value: 'In Transit', label: 'In Transit' },
    { value: 'Rejected', label: 'Rejected' }
  ];

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredBayans]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Matching AssignExpenses */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              Bayan Document Search
            </h1>
            <p className="text-gray-600 mt-2">Search and manage Bayan documents efficiently</p>
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

        {/* Search Section - Matching AssignExpenses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH BAYAN DOCUMENTS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bayan Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Bayan number..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client
                </label>
                <Select
                  options={clientOptions}
                  value={clientOptions.find(option => option.value === clientFilter)}
                  onChange={(selectedOption) => setClientFilter(selectedOption?.value || '')}
                  placeholder="Select Client"
                  isSearchable
                  isClearable
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={selectStyles}
                  className="w-full text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                  options={statusOptions}
                  value={statusOptions.find(option => option.value === statusFilter)}
                  onChange={(selectedOption) => setStatusFilter(selectedOption?.value || '')}
                  placeholder="Select Status"
                  isClearable
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={selectStyles}
                  className="w-full text-sm"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm flex items-center disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Bayan Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Document Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">{filteredBayans.length} documents</span>
            </div>
          </div>
        </div>

        {/* Bayan Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'Bayan No', key: 'bayanNo' },
                    { label: 'Date', key: 'date' },
                    { label: 'Client', key: 'client' },
                    { label: 'Route', key: 'origin' },
                    { label: 'Status', key: 'status' },
                    { label: 'Actions', key: null },
                  ].map(({ label, key }) => (
                    <th
                      key={label}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => key && handleSort(key)}
                    >
                      <div className="flex items-center">
                        {label}
                        {key && renderSortIcon(key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBayans.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No Bayan documents found</h4>
                        <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentBayans.map((bayan) => (
                    <tr key={bayan.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">{bayan.bayanNo}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {new Date(bayan.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                        {bayan.client}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="text-sm text-gray-900">{bayan.origin}</div>
                        <div className="text-xs text-gray-500">to {bayan.destination}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${bayan.status === 'Cleared' ? 'bg-green-100 text-green-800' : 
                            bayan.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            bayan.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'}`}>
                          {bayan.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleDownload(bayan)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all flex items-center text-xs"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700 mb-2 md:mb-0">
                Showing {indexOfFirstItem + 1} to{' '}
                {Math.min(indexOfLastItem, filteredBayans.length)} of {filteredBayans.length} documents
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
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                    title="Next"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="hidden md:block text-sm font-medium text-gray-700">
                Total: <span className="text-green-600 font-bold">{filteredBayans.length} documents</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BayanNoSearch;
