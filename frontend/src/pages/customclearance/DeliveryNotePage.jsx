import React, { useState, useEffect } from 'react';
import {
  Truck,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Loader,
} from 'lucide-react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const DeliveryNotePage = () => {

  
  // State variables
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDeliveryNote, setNewDeliveryNote] = useState({
    delivery_note_no: '',
    order_no: '',
    client_name: '',
    delivery_date: '',
    delivered_by: '',
    address: '',
  });

  // Sorting and pagination state
  const [sortField, setSortField] = useState('delivery_note_no');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Authentication helper
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error("Authentication token missing - please login");
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return null;
    }
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Custom styles for react-select
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

  // Fetch clients from backend
  const fetchClients = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${API_BASE_URL}/clients`, headers);
      
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }

      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to fetch clients: ' + error.message);
    }
  };

  // Fetch delivery notes from backend
  const fetchDeliveryNotes = async () => {
    try {
      setIsLoading(true);
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${API_BASE_URL}/delivery-notes`, headers);
      
      if (!response.ok) {
        throw new Error('Failed to fetch delivery notes');
      }

      const data = await response.json();
      setDeliveryNotes(data);
    } catch (error) {
      console.error('Error fetching delivery notes:', error);
      toast.error('Failed to fetch delivery notes: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch next delivery note number
  const fetchNextDNNumber = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${API_BASE_URL}/delivery-notes/next-dn`, headers);
      
      if (!response.ok) {
        throw new Error('Failed to fetch next DN number');
      }

      const data = await response.json();
      return data.nextDeliveryNoteNumber;
    } catch (error) {
      console.error('Error fetching next DN number:', error);
      toast.error('Failed to fetch next DN number');
      return 'DN-001'; // fallback
    }
  };

  useEffect(() => {
    fetchDeliveryNotes();
    fetchClients();
  }, []);

  // Form validation
  const validateForm = () => {
    if (!newDeliveryNote.delivery_note_no.trim()) {
      toast.error('Delivery Note No is required');
      return false;
    }
    if (!newDeliveryNote.delivery_date.trim()) {
      toast.error('Delivery Date is required');
      return false;
    }
    return true;
  };

  // Add or update delivery note handler
  const handleAddDeliveryNote = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading(editingId ? 'Updating delivery note...' : 'Creating delivery note...');

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const noteData = {
        delivery_note_no: newDeliveryNote.delivery_note_no,
        order_no: newDeliveryNote.order_no,
        client_name: newDeliveryNote.client_name,
        delivery_date: newDeliveryNote.delivery_date,
        delivered_by: newDeliveryNote.delivered_by,
        address: newDeliveryNote.address,
      };

      let response;
      if (editingId) {
        response = await fetch(`${API_BASE_URL}/delivery-notes/${editingId}`, {
          method: 'PUT',
          ...headers,
          body: JSON.stringify(noteData)
        });
      } else {
        response = await fetch(`${API_BASE_URL}/delivery-notes`, {
          method: 'POST',
          ...headers,
          body: JSON.stringify(noteData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save delivery note');
      }

      // Refresh data
      await fetchDeliveryNotes();

      // Reset form
      resetForm();

      toast.dismiss(loadingToast);
      toast.success(editingId ? 'Delivery note updated successfully' : 'Delivery note created successfully');

    } catch (error) {
      console.error('Error saving delivery note:', error);
      toast.dismiss(loadingToast);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a delivery note
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this delivery note?')) return;

    const loadingToast = toast.loading('Deleting delivery note...');

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${API_BASE_URL}/delivery-notes/${id}`, {
        method: 'DELETE',
        ...headers
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete delivery note');
      }

      // Refresh data
      await fetchDeliveryNotes();

      toast.dismiss(loadingToast);
      toast.success('Delivery note deleted successfully');

    } catch (error) {
      console.error('Error deleting delivery note:', error);
      toast.dismiss(loadingToast);
      toast.error(error.message);
    }
  };

  // Populate the form for editing
  const handleEdit = (note) => {
    setNewDeliveryNote({
      delivery_note_no: note.delivery_note_no,
      order_no: note.order_no || '',
      client_name: note.client_name || '',
      delivery_date: note.delivery_date ? note.delivery_date.split('T')[0] : '',
      delivered_by: note.delivered_by || '',
      address: note.address || '',
    });
    setEditingId(note.id);
    setIsAdding(true);
  };

  // Reset form
  const resetForm = () => {
    setNewDeliveryNote({
      delivery_note_no: '',
      order_no: '',
      client_name: '',
      delivery_date: '',
      delivered_by: '',
      address: '',
    });
    setEditingId(null);
    setIsAdding(false);
  };

  // Handle add button click - auto-generate DN number for new records
  const handleAddButtonClick = async () => {
    if (isAdding) {
      resetForm();
    } else {
      const nextDN = await fetchNextDNNumber();
      setNewDeliveryNote({
        delivery_note_no: nextDN,
        order_no: '',
        client_name: '',
        delivery_date: '',
        delivered_by: '',
        address: '',
      });
      setIsAdding(true);
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Prepare client options for dropdown
  const clientOptions = clients.map(client => ({
    value: client.name,
    label: client.name,
    client_id: client.client_id
  }));

  // Apply sorting and filtering based on the search term
  const sortedNotes = [...deliveryNotes].sort((a, b) => {
    let aValue = a[sortField] || '';
    let bValue = b[sortField] || '';
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredNotes = sortedNotes.filter(
    (note) =>
      note.delivery_note_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.order_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading delivery notes...</p>
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
              <Truck className="w-8 h-8 mr-3 text-indigo-600" />
              DELIVERY NOTES
            </h1>
            <p className="text-gray-600 mt-2">
              Manage delivery notes for your logistics operations
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search delivery notes..."
                  className="bg-transparent outline-none w-40"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <button
              onClick={handleAddButtonClick}
              className={`px-5 py-2  rounded-lg font-medium transition-all flex items-center shadow-md ${
                isAdding
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'from-white-600  hover:to-gray-100 text-indigo-600'
              }`}
            >
              {isAdding ? (
                <>
                  <X className="w-5 h-5 mr-2" />
                  Close
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Add Delivery Note
                </>
              )}
            </button>
          </div>
        </div>

        {/* Add/Edit Delivery Note Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                {editingId ? 'Edit Delivery Note' : 'Add Delivery Note'}
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleAddDeliveryNote(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Note No <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Auto-generated DN number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                        value={newDeliveryNote.delivery_note_no}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order No
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Order No"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={newDeliveryNote.order_no}
                        onChange={(e) =>
                          setNewDeliveryNote({ ...newDeliveryNote, order_no: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client Name
                      </label>
                      <Select
                        options={clientOptions}
                        value={clientOptions.find(option => option.value === newDeliveryNote.client_name)}
                        onChange={(selectedOption) => 
                          setNewDeliveryNote({ ...newDeliveryNote, client_name: selectedOption?.value || '' })
                        }
                        placeholder="Select Client"
                        isSearchable
                        isClearable
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={selectStyles}
                        className="w-full text-sm"
                      />
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={newDeliveryNote.delivery_date}
                        onChange={(e) =>
                          setNewDeliveryNote({ ...newDeliveryNote, delivery_date: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivered By
                      </label>
                      <input
                        type="text"
                        placeholder="Enter name of deliverer"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={newDeliveryNote.delivered_by}
                        onChange={(e) =>
                          setNewDeliveryNote({ ...newDeliveryNote, delivered_by: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        placeholder="Enter delivery address"
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={newDeliveryNote.address}
                        onChange={(e) =>
                          setNewDeliveryNote({ ...newDeliveryNote, address: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition flex items-center"
                  >
                    {isSubmitting && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                    {editingId ? 'Update Delivery Note' : 'Add Delivery Note'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delivery Notes Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-indigo-600 text-white text-sm font-semibold">
              <tr>
                {[
                  { label: 'SL', key: 'sl', noSort: true },
                  { label: 'Delivery Note No', key: 'delivery_note_no' },
                  { label: 'Order No', key: 'order_no' },
                  { label: 'Client Name', key: 'client_name' },
                  { label: 'Delivery Date', key: 'delivery_date' },
                  { label: 'Delivered By', key: 'delivered_by' },
                  { label: 'Address', key: 'address' },
                  { label: 'Actions', key: null },
                ].map(({ label, key, noSort }) => (
                  <th
                    key={label}
                    onClick={() => key && !noSort && handleSort(key)}
                    className={`px-4 py-3 text-left cursor-pointer select-none ${
                      key && !noSort ? 'hover:bg-indigo-700' : ''
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
              {currentNotes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Truck className="w-16 h-16 text-gray-300 mb-4" />
                      <h4 className="text-lg font-medium text-gray-500">No delivery notes found</h4>
                      <p className="text-gray-400 mt-2">Create your first delivery note to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentNotes.map((note, index) => (
                  <tr key={note.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-center text-gray-900">
                      {index + 1 + indexOfFirstItem}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">{note.delivery_note_no}</td>
                    <td className="px-4 py-3 text-gray-900">{note.order_no || '-'}</td>
                    <td className="px-4 py-3 text-gray-900">{note.client_name || '-'}</td>
                    <td className="px-4 py-3 text-gray-900">
                      {note.delivery_date ? new Date(note.delivery_date).toLocaleDateString('en-GB') : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{note.delivered_by || '-'}</td>
                    <td className="px-4 py-3 text-gray-900 max-w-xs truncate">{note.address || '-'}</td>
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
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredNotes.length)} of {filteredNotes.length} results
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
          )}
        </div>
      </div>
      
      {/* Toast Config Component */}
      <ToastConfig />
    </div>
  );
};

export default DeliveryNotePage;
