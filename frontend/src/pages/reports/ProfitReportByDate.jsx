import React, { useState, useEffect } from 'react';
import {
  FileBarChart2, Search, Calendar, Printer, Plus, Pencil, Trash2, X,
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert
} from 'lucide-react';
import Select from 'react-select';

const ProfitReportByDate = () => {
  // State management
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-06-01');
  const [profitReports, setProfitReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('report_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [form, setForm] = useState({
    report_date: '',
    job_number: '',
    supplier_id: '',
    revenue: '',
    cost: '',
    profit: ''
  });

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

  const API_URL = 'http://localhost:5000/api/profit-report';

  // Auth header utility
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication token missing');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Date formatting helper
  function toDateInputValue(date) {
    if (!date) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    const d = new Date(date);
    const pad = n => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  // Fetch reports from backend
  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}?start_date=${startDate}&end_date=${endDate}`, getAuthHeaders());
      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      setProfitReports(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch reports');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Reset form
  const resetForm = () => {
    setForm({
      report_date: '',
      job_number: '',
      supplier_id: '',
      revenue: '',
      cost: '',
      profit: ''
    });
    setEditingId(null);
    setIsAdding(false);
    setError('');
    setSuccessMessage('');
  };

  // Fixed toggle function for Add Report button
  const handleToggleAddForm = () => {
    console.log('Button clicked, current state:', isAdding); // Debug log
    if (isAdding) {
      resetForm();
    } else {
      setIsAdding(true);
      setEditingId(null);
      setError('');
      setSuccessMessage('');
    }
  };

  // Handle search
  const handleSearch = () => {
    fetchReports();
    setSuccessMessage(`Found ${profitReports.length} report(s) for the selected date range`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate profit when revenue or cost changes
      if (name === 'revenue' || name === 'cost') {
        const revenue = parseFloat(name === 'revenue' ? value : updated.revenue) || 0;
        const cost = parseFloat(name === 'cost' ? value : updated.cost) || 0;
        updated.profit = (revenue - cost).toFixed(2);
      }
      
      return updated;
    });
  };

  // Create report
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.report_date || !form.job_number || !form.revenue || !form.cost) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        ...getAuthHeaders(),
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error('Failed to create report');
      
      resetForm();
      fetchReports();
      setSuccessMessage('Report created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to create report');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Edit report
  const handleEdit = (report) => {
    setForm({
      report_date: toDateInputValue(report.report_date),
      job_number: report.job_number,
      supplier_id: report.supplier_id,
      revenue: report.revenue,
      cost: report.cost,
      profit: report.profit
    });
    setEditingId(report.id);
    setIsAdding(true);
  };

  // Update report
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        ...getAuthHeaders(),
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error('Failed to update report');
      
      resetForm();
      fetchReports();
      setSuccessMessage('Report updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update report');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Delete report
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        ...getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to delete report');
      
      fetchReports();
      setSuccessMessage('Report deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete report');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Print handler
  const handlePrint = () => {
    window.print();
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

  // Sort reports
  const sortedReports = [...profitReports].sort((a, b) => {
    let valA, valB;
    if (sortField === 'report_date') {
      valA = new Date(a.report_date);
      valB = new Date(b.report_date);
    } else if (sortField === 'revenue' || sortField === 'cost' || sortField === 'profit') {
      valA = parseFloat(a[sortField]);
      valB = parseFloat(b[sortField]);
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
  const currentReports = sortedReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedReports.length / itemsPerPage);

  // Calculate totals
  const calculateTotal = (field) => {
    return profitReports.reduce((sum, report) => sum + (Number(report[field]) || 0), 0);
  };

  const totals = {
    revenue: calculateTotal('revenue'),
    cost: calculateTotal('cost'),
    profit: calculateTotal('profit')
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [profitReports]);

  if (isLoading && profitReports.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading profit report data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Matching AssignExpenses */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FileBarChart2 className="w-8 h-8 mr-3 text-indigo-600" />
              Profit Report by Date
            </h1>
            <p className="text-gray-600 mt-2">Analyze profitability by date range</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={handleToggleAddForm}
              className={`px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Cancel' : 'Add Report'}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center shadow-md"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print Report
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

        {/* Search Section - Matching AssignExpenses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH BY DATE RANGE
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm flex items-center justify-center"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Reports
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Report Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                {editingId ? 'Edit Profit Report' : 'Add New Profit Report'}
              </h2>
            </div>
            <div className="p-4">
              <form onSubmit={editingId ? handleUpdate : handleCreate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Report Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="report_date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        value={form.report_date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="job_number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Enter job number"
                        value={form.job_number}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supplier ID
                      </label>
                      <input
                        type="text"
                        name="supplier_id"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Enter supplier ID"
                        value={form.supplier_id}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Revenue <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="revenue"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="0.00"
                        value={form.revenue}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cost <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="cost"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="0.00"
                        value={form.cost}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profit (Auto-calculated)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="profit"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                        placeholder="0.00"
                        value={form.profit}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm"
                  >
                    {editingId ? 'Update Report' : 'Add Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Report Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Profit Summary ({startDate} to {endDate})
            </h2>
            <div className="text-sm font-medium text-gray-700">
              Net Profit: <span className={`font-bold ${totals.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${totals.profit.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Profit Reports Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'ID', key: 'id' },
                    { label: 'Date', key: 'report_date' },
                    { label: 'Job Number', key: 'job_number' },
                    { label: 'Supplier ID', key: 'supplier_id' },
                    { label: 'Revenue', key: 'revenue' },
                    { label: 'Cost', key: 'cost' },
                    { label: 'Profit', key: 'profit' },
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
                {currentReports.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FileBarChart2 className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No profit reports found</h4>
                        <p className="text-gray-400 mt-2">Try adjusting your search criteria or add a new report</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {new Date(report.report_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {report.job_number}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {report.supplier_id || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600 text-right">
                        ${Number(report.revenue).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-600 text-right">
                        ${Number(report.cost).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-right">
                        <span className={Number(report.profit) >= 0 ? 'text-green-600' : 'text-red-600'}>
                          ${Number(report.profit).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleEdit(report)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                
                {/* Total row */}
                {currentReports.length > 0 && (
                  <tr className="bg-gray-100 font-semibold">
                    <td colSpan="4" className="px-4 py-3 text-right text-sm text-gray-900">
                      <strong>TOTALS:</strong>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700 text-right font-bold">
                      ${totals.revenue.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-red-700 text-right font-bold">
                      ${totals.cost.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold">
                      <span className={totals.profit >= 0 ? 'text-green-700' : 'text-red-700'}>
                        ${totals.profit.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700 mb-2 md:mb-0">
                Showing {indexOfFirstItem + 1} to{' '}
                {Math.min(indexOfLastItem, sortedReports.length)} of {sortedReports.length} reports
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
                Net Profit: <span className={`font-bold ${totals.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${totals.profit.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfitReportByDate;
