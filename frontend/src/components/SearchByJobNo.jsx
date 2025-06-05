import React, { useState } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Pencil, Trash2, FileText, X, Plus } from 'lucide-react';

const JobNoSearch = () => {
  // Mock job data
  const [jobs, setJobs] = useState([
    { 
      id: 1, 
      jobNo: 'JOB-001', 
      customer: 'ABC Corporation', 
      origin: 'Jeddah', 
      destination: 'Riyadh', 
      type: 'Import', 
      status: 'In Transit',
      createdDate: '2025-05-15',
      eta: '2025-06-05'
    },
    { 
      id: 2, 
      jobNo: 'JOB-002', 
      customer: 'XYZ Trading', 
      origin: 'Dammam', 
      destination: 'Jubail', 
      type: 'Export', 
      status: 'Delivered',
      createdDate: '2025-05-18',
      eta: '2025-05-30'
    },
    { 
      id: 3, 
      jobNo: 'JOB-003', 
      customer: 'Global Logistics', 
      origin: 'Riyadh', 
      destination: 'Jeddah', 
      type: 'Domestic', 
      status: 'Pending',
      createdDate: '2025-06-01',
      eta: '2025-06-10'
    },
    { 
      id: 4, 
      jobNo: 'JOB-004', 
      customer: 'Saudi Industries', 
      origin: 'Medina', 
      destination: 'Khobar', 
      type: 'Import', 
      status: 'In Transit',
      createdDate: '2025-05-25',
      eta: '2025-06-08'
    },
    { 
      id: 5, 
      jobNo: 'JOB-005', 
      customer: 'Desert Trading', 
      origin: 'Tabuk', 
      destination: 'Hail', 
      type: 'Domestic', 
      status: 'Completed',
      createdDate: '2025-05-20',
      eta: '2025-05-28'
    },
    { 
      id: 6, 
      jobNo: 'JOB-006', 
      customer: 'Arabian Shipping', 
      origin: 'Jeddah', 
      destination: 'Dammam', 
      type: 'Export', 
      status: 'In Transit',
      createdDate: '2025-05-30',
      eta: '2025-06-12'
    },
    { 
      id: 7, 
      jobNo: 'JOB-007', 
      customer: 'Red Sea Imports', 
      origin: 'Yanbu', 
      destination: 'Riyadh', 
      type: 'Import', 
      status: 'Pending',
      createdDate: '2025-06-01',
      eta: '2025-06-15'
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('jobNo');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [newJob, setNewJob] = useState({
    jobNo: '',
    customer: '',
    origin: '',
    destination: '',
    type: '',
    status: 'Pending',
    createdDate: new Date().toISOString().split('T')[0],
    eta: ''
  });
  const itemsPerPage = 5;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredJobs = sortedJobs.filter(job => 
    job.jobNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const handleDelete = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const handleAddJob = () => {
    if (!newJob.jobNo.trim() || !newJob.customer.trim()) return;
    
    const newJobWithId = {
      ...newJob,
      id: jobs.length + 1,
    };
    setJobs([...jobs, newJobWithId]);
    
    setNewJob({
      jobNo: '',
      customer: '',
      origin: '',
      destination: '',
      type: '',
      status: 'Pending',
      createdDate: new Date().toISOString().split('T')[0],
      eta: ''
    });
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              JOB NO SEARCH
            </h1>
            <p className="text-gray-600 mt-2">Search and manage your logistics jobs</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="bg-transparent outline-none w-40 md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className={`px-5 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}
              `}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Close' : 'Add Job'}
            </button>
          </div>
        </div>

        {/* Add Job Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Add New Job
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter job number"
                      value={newJob.jobNo}
                      onChange={(e) => setNewJob({...newJob, jobNo: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter customer name"
                      value={newJob.customer}
                      onChange={(e) => setNewJob({...newJob, customer: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Origin
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter origin"
                      value={newJob.origin}
                      onChange={(e) => setNewJob({...newJob, origin: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destination
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter destination"
                      value={newJob.destination}
                      onChange={(e) => setNewJob({...newJob, destination: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={newJob.type}
                      onChange={(e) => setNewJob({...newJob, type: e.target.value})}
                    >
                      <option value="">Select type</option>
                      <option value="Import">Import</option>
                      <option value="Export">Export</option>
                      <option value="Domestic">Domestic</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ETA (Estimated Time of Arrival)
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={newJob.eta}
                      onChange={(e) => setNewJob({...newJob, eta: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-6">
                <button
                  onClick={handleAddJob}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1 shadow-md"
                >
                  Save Job Details
                </button>
                
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewJob({
                      jobNo: '',
                      customer: '',
                      origin: '',
                      destination: '',
                      type: '',
                      status: 'Pending',
                      createdDate: new Date().toISOString().split('T')[0],
                      eta: ''
                    });
                  }}
                  className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Job List Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">JOB LIST</h3>
            <div className="text-sm text-gray-500">
              Showing {Math.min(filteredJobs.length, itemsPerPage)} of {filteredJobs.length} jobs
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S1.No.
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('jobNo')}
                  >
                    <div className="flex items-center">
                      Job No
                      {sortField === 'jobNo' && (
                        sortDirection === 'asc' ? 
                        <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('customer')}
                  >
                    <div className="flex items-center">
                      Customer
                      {sortField === 'customer' && (
                        sortDirection === 'asc' ? 
                        <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('origin')}
                  >
                    <div className="flex items-center">
                      Origin
                      {sortField === 'origin' && (
                        sortDirection === 'asc' ? 
                        <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('destination')}
                  >
                    <div className="flex items-center">
                      Destination
                      {sortField === 'destination' && (
                        sortDirection === 'asc' ? 
                        <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentJobs.length > 0 ? (
                  currentJobs.map((job, index) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{job.jobNo}</div>
                            <div className="text-xs text-gray-500">{job.createdDate}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{job.customer}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{job.origin}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{job.destination}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          ETA: {job.eta}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${job.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                            job.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                            job.status === 'Completed' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                          {job.status}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {job.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(job.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No jobs found</h4>
                        <p className="text-gray-400 mt-1">Try adjusting your search or add a new job</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredJobs.length > itemsPerPage && (
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
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                ))}
                
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

export default JobNoSearch;