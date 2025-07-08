import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, CheckCircle, AlertTriangle, Eye, Calculator, Settings,
  Loader, Check, AlertCircle as Alert, TrendingUp, Filter
} from 'lucide-react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.warn('No authentication token found');
    return {
      'Content-Type': 'application/json'
    };
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const PAGE_SIZE = 10;

const SupplierCreditNote = () => {
  // State management
  const [suppliers, setSuppliers] = useState([]);
  const [ports, setPorts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [creditNotes, setCreditNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('credit_note_date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    supplier_id: '',
    credit_note_no: ``,
    credit_note_date: new Date().toISOString().split('T')[0],
    total_amount: '',
    vat_amount: '',
    grand_total: '',
    assignment_id: '',
    port_id: '',
    job_number: ''
  });
  
  const [lineItems, setLineItems] = useState([
    { id: 1, description: '', quantity: '', unit_price: '', amount: '' }
  ]);

  // Custom styles for react-select dropdowns
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

  // Enhanced error handling with emojis and specific error types
  const handleAuthError = (error) => {
    console.error('API Error:', error);
    
    if (error.message.includes('401') || error.message.includes('Authentication')) {
      toast.error('🔐 Authentication failed. Please login again.');
    } else if (error.message.includes('404')) {
      toast.error('🔍 API endpoint not found. Please check if the server is running.');
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('Network Error')) {
      toast.error('🌐 Cannot connect to server. Please ensure the backend server is running on port 5000.');
    } else if (error.message.includes('500')) {
      toast.error('⚠️ Server error occurred. Please try again later.');
    } else {
      toast.error(`❌ ${error.message || 'An unexpected error occurred'}`);
    }
  };

  // Enhanced validation with custom warning toasts
  const validateForm = () => {
    const errors = [];
    
    if (!formData.supplier_id) {
      errors.push('Please select a supplier');
    }
    
    if (!formData.credit_note_no) {
      errors.push('Credit note number is required');
    }
    
    if (!formData.credit_note_date) {
      errors.push('Credit note date is required');
    }
    
    if (lineItems.some(item => !item.description || !item.quantity || !item.unit_price)) {
      errors.push('Please fill all line item details');
    }
    
    if (lineItems.length === 0) {
      errors.push('At least one line item is required');
    }
    
    if (errors.length > 0) {
      errors.forEach(error => {
        toast((t) => (
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        ), {
          duration: 4500,
          style: {
            background: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%)',
            color: '#ffffff',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1)',
          },
        });
      });
      return false;
    }
    
    return true;
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const loadingToast = toast.loading('🔄 Loading credit note data...');
  
      const [suppliersRes, portsRes, assignmentsRes, creditNotesRes, nextCreditNoteRes] = await Promise.all([
        fetch(`${API_BASE_URL}/suppliers`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/ports`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/supplier-assignments`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/supplier-credit-notes`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/supplier-credit-notes/next-credit-note-no`, { headers: getAuthHeaders() })
      ]);
  
      if (
        !suppliersRes.ok || !portsRes.ok || !assignmentsRes.ok ||
        !creditNotesRes.ok || !nextCreditNoteRes.ok
      ) {
        throw new Error('Failed to fetch some data');
      }
  
      const suppliersData = await suppliersRes.json();
      const portsData = await portsRes.json();
      const assignmentsData = await assignmentsRes.json();
      const creditNotesData = await creditNotesRes.json();
      const nextCreditNoteData = await nextCreditNoteRes.json();
  
      const suppliersList = Array.isArray(suppliersData) ? suppliersData : suppliersData.data || [];
      const portsList = Array.isArray(portsData) ? portsData : portsData.data || [];
      const assignmentsList = assignmentsData.data || [];
      const creditNotesList = creditNotesData.data || [];
      const nextCreditNoteNo = nextCreditNoteData.next_credit_note_no || '';
  
      setSuppliers(suppliersList);
      setPorts(portsList);
      setAssignments(assignmentsList);
      setCreditNotes(creditNotesList);
  
      // ✅ Set auto-generated credit note number
      setFormData(prev => ({
        ...prev,
        credit_note_no: nextCreditNoteNo
      }));
  
      toast.dismiss(loadingToast);
  
      toast((t) => (
        <div className="flex items-center">
          <Check className="w-5 h-5 mr-2" />
          Loaded {suppliersList.length} suppliers, {assignmentsList.length} assignments, {creditNotesList.length} credit notes
        </div>
      ), {
        duration: 3000,
      });
  
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('❌ Failed to load data. Please refresh the page.');
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };
  

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Calculate line item amounts and totals with feedback
  useEffect(() => {
    const updated = lineItems.map(item => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unit_price) || 0;
      return { ...item, amount: (quantity * unitPrice).toFixed(2) };
    });
    
    const subTotal = updated.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
    const vatAmount = subTotal * 0.15; // 15% VAT
    const totalAmount = subTotal + vatAmount;
    
    setFormData(prev => ({
      ...prev,
      total_amount: subTotal.toFixed(2),
      vat_amount: vatAmount.toFixed(2),
      grand_total: totalAmount.toFixed(2)
    }));
    
    setLineItems(updated);
  }, [lineItems.map(item => `${item.quantity}-${item.unit_price}`).join(',')]);

  // Enhanced form handlers with feedback
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Provide feedback for specific field changes
    if (field === 'supplier_id' && value) {
      const supplier = suppliers.find(s => s.id == value);
      if (supplier) {
        toast((t) => (
          <div className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Supplier selected: {supplier.name}
          </div>
        ), {
          duration: 1500,
        });
      }
    }
  };

  // Enhanced toggle form with custom toast
  const handleToggleAddForm = (e) => {
    e.preventDefault();
    
    if (isAdding) {
      resetForm();
      toast((t) => (
        <div className="flex items-center">
          <X className="w-5 h-5 mr-2" />
          Credit note form closed
        </div>
      ), {
        duration: 2000,
      });
    } else {
      setIsAdding(true);
      setEditingId(null);
      toast((t) => (
        <div className="flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Ready to create new credit note
        </div>
      ), {
        duration: 2000,
      });
    }
  };
  
  const handleLineItemChange = (id, field, value) => {
    setLineItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Enhanced add line item with feedback
  const addLineItem = () => {
    const newId = lineItems.length > 0
      ? Math.max(...lineItems.map(item => item.id)) + 1
      : 1;
    setLineItems([
      ...lineItems,
      { id: newId, description: '', quantity: '', unit_price: '', amount: '' }
    ]);
    
    toast((t) => (
      <div className="flex items-center">
        <Plus className="w-4 h-4 mr-2" />
        New line item added
      </div>
    ), {
      duration: 1500,
    });
  };

  // Enhanced remove line item with validation
  const removeLineItem = (id) => {
    if (lineItems.length <= 1) {
      toast((t) => (
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          At least one line item is required
        </div>
      ), {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%)',
          color: '#ffffff',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1)',
        },
      });
      return;
    }
    
    setLineItems(lineItems.filter(item => item.id !== id));
    
    toast((t) => (
      <div className="flex items-center">
        <Trash2 className="w-4 h-4 mr-2" />
        Line item removed
      </div>
    ), {
      duration: 1500,
    });
  };

  // Reset form with feedback
  const resetForm = () => {
    setFormData({
      supplier_id: '',
      credit_note_no: `CN-${Math.floor(Math.random() * 1000)}`,
      credit_note_date: new Date().toISOString().split('T')[0],
      total_amount: '',
      vat_amount: '',
      grand_total: '',
      assignment_id: '',
      port_id: '',
      job_number: ''
    });
    setLineItems([{ id: 1, description: '', quantity: '', unit_price: '', amount: '' }]);
    setEditingId(null);
    setIsAdding(false);
  };

  // Enhanced submit with detailed feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const supplierName = suppliers.find(s => s.id == formData.supplier_id)?.name || 'Unknown';
    const loadingMessage = editingId 
      ? `🔄 Updating credit note for ${supplierName}...` 
      : `💾 Creating credit note for ${supplierName}...`;
    
    const loadingToast = toast.loading(loadingMessage);

    try {
      const selectedAssignment = assignments.find(a => String(a.id) === String(formData.assignment_id));
      const payload = {
        supplier_id: formData.supplier_id,
        credit_note_no: formData.credit_note_no,
        credit_note_date: formData.credit_note_date,
        total_amount: formData.total_amount,
        vat_amount: formData.vat_amount,
        grand_total: formData.grand_total,
        supplier_invoice_no: selectedAssignment ? selectedAssignment.supplier_invoice_no : undefined,
        job_number: selectedAssignment ? selectedAssignment.job_number : formData.job_number,
        port_id: formData.port_id,
        assignment_id: formData.assignment_id,
        lineItems: lineItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount
        }))
      };

      let res;
      if (editingId) {
        res = await fetch(`${API_BASE_URL}/supplier-credit-notes/${editingId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to update credit note');
        }
        toast.dismiss(loadingToast);
        toast.success(`✅ Credit note for "${supplierName}" updated successfully!`);
      } else {
        res = await fetch(`${API_BASE_URL}/supplier-credit-notes`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          if (res.status === 409) {
            throw new Error('Credit note with this number already exists');
          }
          throw new Error(errorData.message || 'Failed to create credit note');
        }
        toast.dismiss(loadingToast);
        toast.success(`🎉 Credit note for "${supplierName}" created successfully!`);
      }

      // Refresh credit notes
      const creditNotesRes = await fetch(`${API_BASE_URL}/supplier-credit-notes`, { headers: getAuthHeaders() });
      const creditNotesData = await creditNotesRes.json();
      setCreditNotes(creditNotesData.data || []);
      resetForm();

    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error saving credit note:', err);
      
      if (err.message.includes('already exists')) {
        toast((t) => (
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Credit note already exists with this number
          </div>
        ), {
          duration: 4500,
          style: {
            background: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%)',
            color: '#ffffff',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1)',
          },
        });
      } else {
        toast.error(`❌ ${err.message || 'Failed to save credit note'}`);
      }
      
      handleAuthError(err);
    }
  };

  // Enhanced edit with custom toast
  const handleEdit = (note) => {
    setEditingId(note.id);
    setFormData({
      supplier_id: note.supplier_id,
      credit_note_no: note.credit_note_no,
      credit_note_date: note.credit_note_date?.substring(0, 10),
      total_amount: note.total_amount,
      vat_amount: note.vat_amount,
      grand_total: note.grand_total,
      assignment_id: note.assignment_id || '',
      port_id: note.port_id || '',
      job_number: note.job_number || ''
    });
    setLineItems(note.lineItems?.map((li, idx) => ({
      id: idx + 1,
      description: li.description,
      quantity: li.quantity,
      unit_price: li.unit_price,
      amount: li.amount
    })) || [{ id: 1, description: '', quantity: '', unit_price: '', amount: '' }]);
    setIsAdding(true);
    
    const supplierName = getSupplierName(note.supplier_id);
    toast((t) => (
      <div className="flex items-center">
        <Pencil className="w-5 h-5 mr-2" />
        Editing credit note: {note.credit_note_no} ({supplierName})
      </div>
    ), {
      duration: 2500,
    });
  };

  // Enhanced delete with confirmation and detailed feedback
  const handleDelete = async (id) => {
    const note = creditNotes.find(n => n.id === id);
    const supplierName = getSupplierName(note?.supplier_id);
    const creditNoteNo = note?.credit_note_no || 'Unknown';
    
    if (!window.confirm(`⚠️ Are you sure you want to delete credit note "${creditNoteNo}" for "${supplierName}"?\n\nThis action cannot be undone.`)) {
      toast((t) => (
        <div className="flex items-center">
          <X className="w-5 h-5 mr-2" />
          Deletion cancelled
        </div>
      ), {
        duration: 2000,
      });
      return;
    }
    
    const loadingToast = toast.loading(`🗑️ Deleting credit note ${creditNoteNo}...`);
    
    try {
      const res = await fetch(`${API_BASE_URL}/supplier-credit-notes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete credit note');
      }
      
      // Refresh credit notes
      const creditNotesRes = await fetch(`${API_BASE_URL}/supplier-credit-notes`, { headers: getAuthHeaders() });
      const creditNotesData = await creditNotesRes.json();
      setCreditNotes(creditNotesData.data || []);
      
      toast.dismiss(loadingToast);
      toast.success(`🗑️ Credit note "${creditNoteNo}" deleted successfully!`);
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error deleting credit note:', err);
      toast.error(`❌ Failed to delete credit note`);
      handleAuthError(err);
    }
  };

  // Enhanced search with result feedback
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
    
    // Show toast for search results after a brief delay
    setTimeout(() => {
      const filteredResults = creditNotes.filter(note => {
        const supplierName = getSupplierName(note.supplier_id).toLowerCase();
        const creditNoteNo = (note.credit_note_no || '').toLowerCase();
        const jobNumber = (note.job_number || '').toLowerCase();
        const searchLower = searchValue.toLowerCase();
        
        return supplierName.includes(searchLower) || 
               creditNoteNo.includes(searchLower) || 
               jobNumber.includes(searchLower);
      });
      
      if (filteredResults.length === 0 && searchValue.trim()) {
        toast((t) => (
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            No credit notes found for "{searchValue}"
          </div>
        ), {
          duration: 3000,
          style: {
            background: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%)',
            color: '#ffffff',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1)',
          },
        });
      } else if (filteredResults.length > 0 && searchValue.trim()) {
        toast((t) => (
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Found {filteredResults.length} credit note{filteredResults.length > 1 ? 's' : ''}
          </div>
        ), {
          duration: 2000,
        });
      }
    }, 100);
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== '') {
        handleSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Helper functions
  const getSupplierName = (id) => {
    const supplier = suppliers.find(s => String(s.id) === String(id));
    return supplier ? supplier.name : 'N/A';
  };

  const getPortName = (id) => {
    const port = ports.find(p => String(p.id) === String(id));
    return port ? port.name : 'N/A';
  };

  const getTotalAmount = () => {
    return creditNotes.reduce((sum, note) => sum + parseFloat(note.grand_total || 0), 0).toFixed(2);
  };

  // Filtering and sorting
  const filteredCreditNotes = creditNotes.filter(note => {
    const supplierName = getSupplierName(note.supplier_id).toLowerCase();
    const creditNoteNo = (note.credit_note_no || '').toLowerCase();
    const jobNumber = (note.job_number || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return supplierName.includes(searchLower) || 
           creditNoteNo.includes(searchLower) || 
           jobNumber.includes(searchLower);
  });

  const sortedCreditNotes = [...filteredCreditNotes].sort((a, b) => {
    let valA, valB;
    if (sortColumn === 'credit_note_no') {
      valA = a.credit_note_no ? a.credit_note_no.toLowerCase() : '';
      valB = b.credit_note_no ? b.credit_note_no.toLowerCase() : '';
    } else if (sortColumn === 'credit_note_date') {
      valA = a.credit_note_date || '';
      valB = b.credit_note_date || '';
    } else {
      valA = a[sortColumn] || '';
      valB = b[sortColumn] || '';
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedCreditNotes.length / PAGE_SIZE);
  const paginatedCreditNotes = sortedCreditNotes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Enhanced sorting handler with feedback
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);

    toast((t) => (
      <div className="flex items-center">
        <ArrowUp className="w-4 h-4 mr-2" />
        Sorted by {column} ({sortOrder === 'asc' ? 'descending' : 'ascending'})
      </div>
    ), {
      duration: 1500,
    });
  };

  // Render sort icon
  const renderSortIcon = (column) => {
    if (sortColumn !== column) return <ArrowUp className="w-3 h-3 text-gray-400 inline" />;
    return sortOrder === 'asc' ?
      <ArrowUp className="w-3 h-3 text-indigo-600 inline" /> :
      <ArrowDown className="w-3 h-3 text-indigo-600 inline" />;
  };

  // Prepare options for dropdowns
  const supplierOptions = suppliers.map(supplier => ({
    value: supplier.id,
    label: supplier.name
  }));

  const portOptions = ports.map(port => ({
    value: port.id,
    label: port.name
  }));

  const assignmentOptions = assignments
    .filter(a => !formData.supplier_id || String(a.supplier_id) === String(formData.supplier_id))
    .map(a => ({
      value: a.id,
      label: `${a.supplier_invoice_no} (${a.job_number})`
    }));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, creditNotes]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading supplier credit notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Toast Configuration */}
      <ToastConfig position="bottom-right" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              Supplier Credit Note Management
            </h1>
            <p className="text-gray-600 mt-2">Create and manage supplier credit notes</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleToggleAddForm}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-white-600 hover:bg-gray-100 text-indigo-600'}`}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Cancel' : 'Add Credit Note'}
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH CREDIT NOTES
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Credit Note No, Supplier, or Job Number
                </label>
                <input
                  type="text"
                  placeholder="Search credit notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Credit Note Form */}
        {isAdding && (
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700">
                  {editingId ? 'Edit Credit Note' : 'Add New Credit Note'}
                </h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supplier <span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={supplierOptions}
                        value={supplierOptions.find(option => option.value == formData.supplier_id)}
                        onChange={(selectedOption) => handleInputChange('supplier_id', selectedOption?.value || '')}
                        placeholder="Select Supplier"
                        isSearchable
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={selectStyles}
                        className="w-full text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Credit Note No <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.credit_note_no}
                        onChange={(e) => handleInputChange('credit_note_no', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Enter credit note number"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Credit Note Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.credit_note_date}
                        onChange={(e) => handleInputChange('credit_note_date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supplier Invoice No
                      </label>
                      <Select
                        options={assignmentOptions}
                        value={assignmentOptions.find(option => option.value == formData.assignment_id)}
                        onChange={(selectedOption) => handleInputChange('assignment_id', selectedOption?.value || '')}
                        placeholder="Select Invoice"
                        isSearchable
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={selectStyles}
                        className="w-full text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Number
                      </label>
                      <input
                        type="text"
                        value={formData.job_number}
                        onChange={(e) => handleInputChange('job_number', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Enter job number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Port
                      </label>
                      <Select
                        options={portOptions}
                        value={portOptions.find(option => option.value == formData.port_id)}
                        onChange={(selectedOption) => handleInputChange('port_id', selectedOption?.value || '')}
                        placeholder="Select Port"
                        isSearchable
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={selectStyles}
                        className="w-full text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Line Items */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-semibold text-gray-800">Line Items</h3>
                    <button
                      type="button"
                      onClick={addLineItem}
                      className="px-3 py-1 bg-white-600 text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center text-sm border border-indigo-600"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Item
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {lineItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                placeholder="Description"
                                value={item.description}
                                onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                                required
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                placeholder="Quantity"
                                value={item.quantity}
                                onChange={(e) => handleLineItemChange(item.id, 'quantity', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                                min="0"
                                step="0.01"
                                required
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                placeholder="Unit Price"
                                value={item.unit_price}
                                onChange={(e) => handleLineItemChange(item.id, 'unit_price', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                                min="0"
                                step="0.01"
                                required
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={item.amount}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-50 text-sm font-medium"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => removeLineItem(item.id)}
                                disabled={lineItems.length <= 1}
                                className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        
                        {/* Totals */}
                        <tr className="bg-gray-50 font-medium">
                          <td colSpan={3} className="px-4 py-3 text-right">Subtotal:</td>
                          <td className="px-4 py-3">SAR {formData.total_amount}</td>
                          <td></td>
                        </tr>
                        <tr className="bg-gray-50 font-medium">
                          <td colSpan={3} className="px-4 py-3 text-right">VAT (15%):</td>
                          <td className="px-4 py-3">SAR {formData.vat_amount}</td>
                          <td></td>
                        </tr>
                        <tr className="bg-gray-100 font-bold text-indigo-800">
                          <td colSpan={3} className="px-4 py-3 text-right">Grand Total:</td>
                          <td className="px-4 py-3">SAR {formData.grand_total}</td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg shadow transition text-sm"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm"
                  >
                    {editingId ? 'Update Credit Note' : 'Add Credit Note'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Credit Note Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Credit Note Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">SAR {getTotalAmount()}</span>
            </div>
          </div>
        </div>

        {/* Credit Notes Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'Credit Note No', key: 'credit_note_no' },
                    { label: 'Date', key: 'credit_note_date' },
                    { label: 'Supplier', key: 'supplier_name' },
                    { label: 'Job Number', key: 'job_number' },
                    { label: 'Grand Total', key: 'grand_total' },
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
                {paginatedCreditNotes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No credit note records found</h4>
                        <p className="text-gray-400 mt-2">
                          {searchTerm ? 'Try adjusting your search criteria' : 'Create your first credit note to get started'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedCreditNotes.map((note) => (
                    <tr key={note.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {note.credit_note_no}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {note.credit_note_date ? new Date(note.credit_note_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {getSupplierName(note.supplier_id)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {note.job_number || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                        SAR {parseFloat(note.grand_total || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleEdit(note)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-700 mb-2 md:mb-0">
              Showing {((currentPage - 1) * PAGE_SIZE) + 1} to{' '}
              {Math.min(currentPage * PAGE_SIZE, sortedCreditNotes.length)} of {sortedCreditNotes.length} credit notes
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
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                  title="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="hidden md:block text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">SAR {getTotalAmount()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierCreditNote;
