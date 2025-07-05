import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Plus, Pencil, Trash2, ChevronDown, Search, 
  ChevronLeft, ChevronRight, X, CreditCard
} from 'lucide-react';
import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreditNotePage = () => {
  // State variables
  const [creditNotes, setCreditNotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [jobNumbers, setJobNumbers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCreditNote, setNewCreditNote] = useState({
    credit_note_no: '',
    operation_no: '',
    client_name: '',
    client_name_ar: '',
    amount: '',
    date: new Date()
  });
  const [sortField, setSortField] = useState('credit_note_no');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  // Authentication helper
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

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const headers = getAuthHeaders();
        if (Object.keys(headers).length > 0) {
          // Credit notes
          const notesRes = await axios.get(
            'http://localhost:5000/api/credit-note',
            headers
          );
          setCreditNotes(notesRes.data);

          // Clients
          const clientsRes = await axios.get(
            'http://localhost:5000/api/clients',
            headers
          );
          setClients(clientsRes.data);

          // Job numbers
          const jobsRes = await axios.get(
            'http://localhost:5000/api/clearance-operations/job-numbers',
            headers
          );
          setJobNumbers(jobsRes.data.data.map(job => ({
            value: job.job_no,
            label: job.job_no
          })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle search
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    // Optionally implement backend search here
  };

  // Sorting handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // CRUD Operations
  const handleAddCreditNote = async () => {
    try {
      const headers = getAuthHeaders();
      if (Object.keys(headers).length > 0) {
        if (editingId) {
          // Update existing
          await axios.put(
            `http://localhost:5000/api/credit-note/${editingId}`,
            {
              ...newCreditNote,
              date: newCreditNote.date.toISOString().split('T')[0]
            },
            headers
          );
        } else {
          // Create new
          await axios.post(
            'http://localhost:5000/api/credit-note',
            {
              ...newCreditNote,
              date: newCreditNote.date.toISOString().split('T')[0]
            },
            headers
          );
        }
        // Refresh data
        const res = await axios.get(
          'http://localhost:5000/api/credit-note',
          headers
        );
        setCreditNotes(res.data);
        setIsAdding(false);
        setEditingId(null);
        setNewCreditNote({
          credit_note_no: '',
          operation_no: '',
          client_name: '',
          client_name_ar: '',
          amount: '',
          date: new Date()
        });
      }
    } catch (error) {
      console.error('Error saving credit note:', error);
      setError('Failed to save credit note. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this credit note?')) return;
    try {
      const headers = getAuthHeaders();
      if (Object.keys(headers).length > 0) {
        await axios.delete(
          `http://localhost:5000/api/credit-note/${id}`,
          headers
        );
        // Refresh data
        const res = await axios.get(
          'http://localhost:5000/api/credit-note',
          headers
        );
        setCreditNotes(res.data);
      }
    } catch (error) {
      console.error('Error deleting credit note:', error);
      setError('Failed to delete credit note. Please try again.');
    }
  };

  const handleEdit = (note) => {
    setNewCreditNote({
      credit_note_no: note.credit_note_no,
      operation_no: note.operation_no,
      client_name: note.client_name,
      client_name_ar: note.client_name_ar,
      amount: note.amount,
      date: new Date(note.date)
    });
    setEditingId(note.id);
    setIsAdding(true);
  };

  // Sorting and filtering
  const sortedCreditNotes = [...creditNotes].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredCreditNotes = sortedCreditNotes.filter(note => 
    note.credit_note_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.operation_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCreditNotes = filteredCreditNotes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCreditNotes.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading credit notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-red-500 mb-4">
            <CreditCard className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
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
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <ClipboardList className="w-8 h-8 mr-3 text-indigo-600" />
              CREDIT NOTES
            </h1>
            <p className="text-gray-600 mt-2">Manage credit notes for your business</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search credit notes..."
                  className="bg-transparent outline-none w-40"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <button
              onClick={() => {
                setIsAdding(!isAdding);
                setEditingId(null);
                setNewCreditNote({
                  credit_note_no: '',
                  operation_no: '',
                  client_name: '',
                  client_name_ar: '',
                  amount: '',
                  date: new Date()
                });
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center shadow-md 
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-white-600 hover:bg-gray-100 text-indigo-600'}`}
            >
              {isAdding ? (
                <>
                  <X className="w-5 h-5 mr-2" />
                  Close
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Add Credit Note
                </>
              )}
            </button>
          </div>
        </div>

        {/* Add/Edit Credit Note Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <ClipboardList className="w-5 h-5 mr-2" />
                {editingId ? 'Edit Credit Note' : 'Add Credit Note'}
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credit Note No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Credit Note No"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={newCreditNote.credit_note_no}
                      onChange={(e) =>
                        setNewCreditNote({ ...newCreditNote, credit_note_no: e.target.value })
                      }
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Operation No
                    </label>
                    <Select
                      options={jobNumbers}
                      value={jobNumbers.find(option => option.value === newCreditNote.operation_no)}
                      onChange={(selected) =>
                        setNewCreditNote({ ...newCreditNote, operation_no: selected.value })
                      }
                      placeholder="Select Operation No"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={newCreditNote.client_name}
                      onChange={(e) => {
                        const selectedClient = clients.find(c => c.name === e.target.value);
                        if (selectedClient) {
                          setNewCreditNote({
                            ...newCreditNote,
                            client_name: selectedClient.name,
                            client_name_ar: selectedClient.ar_name
                          });
                        }
                      }}
                    >
                      <option value="">Select Client</option>
                      {clients.map(client => (
                        <option key={client.client_id} value={client.name}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name (Arabic)
                    </label>
                    <input
                      type="text"
                      placeholder="Client Name in Arabic"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={newCreditNote.client_name_ar}
                      onChange={(e) =>
                        setNewCreditNote({ ...newCreditNote, client_name_ar: e.target.value })
                      }
                      dir="rtl"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter Amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={newCreditNote.amount}
                      onChange={(e) =>
                        setNewCreditNote({ ...newCreditNote, amount: e.target.value })
                      }
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <DatePicker
                      selected={newCreditNote.date}
                      onChange={(date) => setNewCreditNote({ ...newCreditNote, date })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleAddCreditNote}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
                >
                  {editingId ? 'Update Credit Note' : 'Add Credit Note'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Credit Notes Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-white-600 text-indigo-500 text-sm font-semibold">
              <tr>
                {[
                  { label: 'SL', key: 'sl', noSort: true },
                  { label: 'Credit Note No', key: 'credit_note_no' },
                  { label: 'Operation No', key: 'operation_no' },
                  { label: 'Client Name', key: 'client_name' },
                  { label: 'Amount', key: 'amount' },
                  { label: 'Date', key: 'date' },
                  { label: 'Actions', key: null },
                ].map(({ label, key, noSort }) => (
                  <th
                    key={label}
                    onClick={() => key && !noSort && handleSort(key)}
                    className={`px-4 py-3 text-left cursor-pointer select-none ${
                      key && !noSort ? 'hover:bg-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      {label}
                      {key && !noSort && sortField === key && (
                        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentCreditNotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    No credit notes found
                    {searchTerm && (
                      <div className="mt-2 text-sm text-gray-400">
                        Try adjusting your search criteria
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                currentCreditNotes.map((note, index) => (
                  <tr key={note.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-center text-gray-900">{indexOfFirstItem + index + 1}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{note.credit_note_no}</td>
                    <td className="px-4 py-3 text-gray-900">{note.operation_no}</td>
                    <td className="px-4 py-3">
                      <div className="leading-tight">
                        <div className="font-semibold text-gray-900 mb-1">{note.client_name}</div>
                        <div className="text-xs text-gray-500 italic" style={{ direction: 'rtl' }}>
                          {note.client_name_ar}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                      SAR {parseFloat(note.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {new Date(note.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-3 flex space-x-3">
                      <button
                        onClick={() => handleEdit(note)}
                        title="Edit"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        title="Delete"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* Pagination Controls */}
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCreditNotes.length)} of {filteredCreditNotes.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
                title="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
                title="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditNotePage;


