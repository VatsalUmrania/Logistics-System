import { useState, useEffect } from 'react';
import { 
  Truck, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, CheckCircle, AlertTriangle, Eye, FileText, 
  Calculator, Settings, Loader, Check, AlertCircle as Alert
} from 'lucide-react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';

const AddSupplierPage = () => {
  // API endpoints
  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;
  const API_URL = `${API_BASE_URL}/suppliers`;
  const INVOICE_API_URL = `${API_BASE_URL}/supplier-assignments`;
  const INVOICE_NUMBERS_API = `${API_BASE_URL}/invoices/invoice-numbers`;
  const JOB_NUMBERS_API = `${API_BASE_URL}/invoices/job-numbers`;

  // State management
  const [suppliers, setSuppliers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [invoiceNumbers, setInvoiceNumbers] = useState([]);
  const [jobNumbers, setJobNumbers] = useState([]);
  
  const [newInvoice, setNewInvoice] = useState({
    selectedSupplierId: '',
    supplierInvoiceNo: '',
    jobNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    vatRate: 0.15,
    totalAmount: 0,
    vatAmount: 0,
    billTotalWithVAT: 0,
    items: [{ purpose: '', item: '', quantity: 1, amount: 0 }]
  });

  const [isAddingInvoice, setIsAddingInvoice] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [invoicePage, setInvoicePage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const invoiceItemsPerPage = 10;

  // Sorting state for assignments
  const [sortAssignmentField, setSortAssignmentField] = useState('invoice_date');
  const [sortAssignmentDirection, setSortAssignmentDirection] = useState('desc');

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

  // Helper: Get auth headers
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
  const validateInvoiceForm = () => {
    const errors = [];
    
    if (!newInvoice.selectedSupplierId) {
      errors.push('Please select a supplier');
    }
    
    if (!newInvoice.supplierInvoiceNo) {
      errors.push('Invoice number is required');
    }
    
    if (newInvoice.items.some(item => !item.purpose || !item.item || item.quantity <= 0 || item.amount <= 0)) {
      errors.push('Please fill all item details with valid values');
    }
    
    if (newInvoice.items.length === 0) {
      errors.push('At least one item is required');
    }
    
    if (errors.length > 0) {
      errors.forEach(error => {
        // Using custom warning toast with ToastConfig styling
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

  // Fetch suppliers with enhanced feedback
  const fetchSuppliers = async () => {
    try {
      const res = await fetch(API_URL, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`Failed to fetch suppliers: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setSuppliers(data);
      
      // Success feedback for data loading
      if (data.length > 0) {
        toast((t) => (
          <div className="flex items-center">
            <Truck className="w-5 h-5 mr-2" />
            Loaded {data.length} supplier{data.length > 1 ? 's' : ''}
          </div>
        ), {
          duration: 2000,
        });
      }
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      handleAuthError(err);
      setSuppliers([]);
    }
  }; 

  // Fetch invoices with enhanced error handling
  const fetchInvoices = async () => {
    try {
      const res = await fetch(INVOICE_API_URL, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`Failed to fetch invoices: ${res.status} ${res.statusText}`);
      const responseData = await res.json();
      setInvoices(responseData.data || []);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      toast.error('📋 Failed to fetch assignments. Please try again.');
      handleAuthError(err);
    }
  };

  // Fetch invoice numbers
  const fetchInvoiceNumbers = async () => {
    try {
      const res = await fetch(INVOICE_NUMBERS_API, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch invoice numbers');
      const data = await res.json();
      setInvoiceNumbers(data);
    } catch (err) {
      console.error('Error fetching invoice numbers:', err);
      setInvoiceNumbers([]);
      handleAuthError(err);
    }
  };

  // Fetch job numbers
  const fetchJobNumbers = async () => {
    try {
      const res = await fetch(JOB_NUMBERS_API, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch job numbers');
      const data = await res.json();
      setJobNumbers(data);
    } catch (err) {
      console.error('Error fetching job numbers:', err);
      setJobNumbers([]);
      handleAuthError(err);
    }
  };

  // Enhanced toggle form with custom toast
  const toggleForm = () => {
    if (isAddingInvoice) {
      resetForm();
      setIsAddingInvoice(false);
      // Custom toast for form cancellation
      toast((t) => (
        <div className="flex items-center">
          <X className="w-5 h-5 mr-2" />
          Assignment form closed
        </div>
      ), {
        duration: 2000,
      });
    } else {
      setIsAddingInvoice(true);
      setEditingInvoiceId(null);
      // Initialize a fresh form state
      setNewInvoice({
        selectedSupplierId: '',
        supplierInvoiceNo: '',
        jobNumber: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        vatRate: 0.15,
        totalAmount: 0,
        vatAmount: 0,
        billTotalWithVAT: 0,
        items: [{ purpose: '', item: '', quantity: 1, amount: 0 }]
      });
      // Custom toast for form opening
      toast((t) => (
        <div className="flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Ready to create new assignment
        </div>
      ), {
        duration: 2000,
      });
    }
  };

  // Invoice form changes
  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "vatRate") {
      newValue = parseFloat(value);
      if (newValue > 1) newValue = newValue / 100;
    }
    setNewInvoice(prev => {
      const updated = { ...prev, [name]: newValue };
      // Recalculate totals when VAT rate changes
      if (name === "vatRate") {
        const totalAmount = updated.items.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
        const vatAmount = totalAmount * newValue;
        const billTotalWithVAT = totalAmount + vatAmount;
        return { ...updated, totalAmount, vatAmount, billTotalWithVAT };
      }
      return updated;
    });
  };

  // Invoice item changes
  const handleItemChange = (index, field, value) => {
    const newItems = [...newInvoice.items];
    newItems[index][field] = field === 'quantity' ? parseInt(value) || 1 : field === 'amount' ? parseFloat(value) || 0 : value;
    const totalAmount = newItems.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
    const vatAmount = totalAmount * newInvoice.vatRate;
    const billTotalWithVAT = totalAmount + vatAmount;
    setNewInvoice(prev => ({
      ...prev,
      items: newItems,
      totalAmount,
      vatAmount,
      billTotalWithVAT
    }));
  };

  // Add new invoice item with feedback
  const addItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { purpose: '', item: '', quantity: 1, amount: 0 }]
    }));
    
    // Custom toast for item addition
    toast((t) => (
      <div className="flex items-center">
        <Plus className="w-4 h-4 mr-2" />
        New item added
      </div>
    ), {
      duration: 1500,
    });
  };

  // Remove invoice item with confirmation
  const removeItem = (index) => {
    if (newInvoice.items.length <= 1) {
      // Warning toast for minimum items
      toast((t) => (
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          At least one item is required
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
    
    const newItems = newInvoice.items.filter((_, i) => i !== index);
    const totalAmount = newItems.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
    const vatAmount = totalAmount * newInvoice.vatRate;
    const billTotalWithVAT = totalAmount + vatAmount;
    setNewInvoice(prev => ({
      ...prev,
      items: newItems,
      totalAmount,
      vatAmount,
      billTotalWithVAT
    }));
    
    // Success toast for item removal
    toast((t) => (
      <div className="flex items-center">
        <Trash2 className="w-4 h-4 mr-2" />
        Item removed
      </div>
    ), {
      duration: 1500,
    });
  };

  // Reset form
  const resetForm = () => {
    setNewInvoice({
      selectedSupplierId: '',
      supplierInvoiceNo: '',
      jobNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      vatRate: 0.15,
      totalAmount: 0,
      vatAmount: 0,
      billTotalWithVAT: 0,
      items: [{ purpose: '', item: '', quantity: 1, amount: 0 }]
    });
    setEditingInvoiceId(null);
    setIsAddingInvoice(false);
  };

  // Enhanced submit with detailed loading and success messages
  const handleSubmitInvoice = async () => {
    if (!validateInvoiceForm()) {
      return;
    }

    const supplierName = suppliers.find(s => s.id == newInvoice.selectedSupplierId)?.name || 'Unknown';
    const loadingMessage = editingInvoiceId 
      ? `🔄 Updating assignment for ${supplierName}...` 
      : `💾 Creating assignment for ${supplierName}...`;
    
    const loadingToast = toast.loading(loadingMessage);

    try {
      const headers = getAuthHeaders();
      const payload = {
        ...newInvoice,
        selectedSupplierId: parseInt(newInvoice.selectedSupplierId)
      };

      let res;
      if (editingInvoiceId !== null) {
        res = await fetch(`${INVOICE_API_URL}/${editingInvoiceId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to update assignment');
        }
        toast.dismiss(loadingToast);
        toast.success(`✅ Assignment for "${supplierName}" updated successfully!`);
      } else {
        res = await fetch(INVOICE_API_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          if (res.status === 409) {
            throw new Error('Assignment with this invoice number already exists');
          }
          throw new Error(errorData.message || 'Failed to create assignment');
        }
        toast.dismiss(loadingToast);
        toast.success(`🎉 Assignment for "${supplierName}" created successfully!`);
      }
      
      resetForm();
      fetchInvoices();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error saving assignment:', err);
      
      if (err.message.includes('already exists')) {
        // Custom warning toast for duplicates
        toast((t) => (
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Assignment already exists with this invoice number
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
        toast.error(`❌ ${err.message || 'Failed to save assignment'}`);
      }
      
      handleAuthError(err);
    }
  };

  // Enhanced view invoice with loading feedback
  const handleViewInvoice = async (invoice) => {
    const supplierName = suppliers.find(s => s.id === invoice.supplier_id)?.name || 'Unknown';
    const loadingToast = toast.loading(`👁️ Loading details for ${supplierName}...`);
    
    try {
      const res = await fetch(`${INVOICE_API_URL}/${invoice.id}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch assignment details');
      const fullInvoice = await res.json();
      setViewingInvoice(fullInvoice);
      toast.dismiss(loadingToast);
      
      // Success toast for view
      toast((t) => (
        <div className="flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          Viewing: {supplierName}
        </div>
      ), {
        duration: 2000,
      });
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('❌ Failed to load assignment details');
      handleAuthError(err);
    }
  };

  // Enhanced edit with custom toast
  const handleEditInvoice = async (invoice) => {
    const supplierName = suppliers.find(s => s.id === invoice.supplier_id)?.name || 'Unknown';
    const loadingToast = toast.loading(`📝 Loading assignment for editing...`);
    
    try {
      const res = await fetch(`${INVOICE_API_URL}/${invoice.id}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch assignment details');
      const fullInvoice = await res.json();

      setNewInvoice({
        selectedSupplierId: fullInvoice.supplier_id?.toString() || '',
        supplierInvoiceNo: fullInvoice.supplier_invoice_no || '',
        jobNumber: fullInvoice.job_number || '',
        invoiceDate: fullInvoice.invoice_date
          ? new Date(fullInvoice.invoice_date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        vatRate: Number(fullInvoice.vat_rate) || 0.15,
        totalAmount: Number(fullInvoice.total_amount) || 0,
        vatAmount: Number(fullInvoice.vat_amount) || 0,
        billTotalWithVAT: Number(fullInvoice.bill_total_with_vat) || 0,
        items: Array.isArray(fullInvoice.items) && fullInvoice.items.length > 0
          ? fullInvoice.items.map(item => ({
              purpose: item.purpose || '',
              item: item.item || '',
              quantity: Number(item.quantity) || 1,
              amount: Number(item.amount) || 0
            }))
          : [{ purpose: '', item: '', quantity: 1, amount: 0 }]
      });
      setEditingInvoiceId(fullInvoice.id);
      setIsAddingInvoice(true);
      toast.dismiss(loadingToast);
      
      // Custom edit toast
      toast((t) => (
        <div className="flex items-center">
          <Pencil className="w-5 h-5 mr-2" />
          Editing: {supplierName}
        </div>
      ), {
        duration: 2500,
      });
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(`❌ Failed to load assignment for editing`);
      handleAuthError(err);
    }
  };

  // Enhanced delete with confirmation and detailed feedback
  const handleDeleteInvoice = async (id) => {
    const invoice = invoices.find(inv => inv.id === id);
    const supplierName = suppliers.find(s => s.id === invoice?.supplier_id)?.name || 'Unknown';
    const invoiceNo = invoice?.supplier_invoice_no || 'Unknown';
    
    if (!window.confirm(`⚠️ Are you sure you want to delete the assignment for "${supplierName}" (Invoice: ${invoiceNo})?\n\nThis action cannot be undone.`)) {
      // Cancellation toast
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
    
    const loadingToast = toast.loading(`🗑️ Deleting assignment for ${supplierName}...`);
    
    try {
      const res = await fetch(`${INVOICE_API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete assignment');
      }
      
      await fetchInvoices();
      toast.dismiss(loadingToast);
      toast.success(`🗑️ Assignment for "${supplierName}" deleted successfully!`);
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error deleting assignment:', err);
      toast.error(`❌ Failed to delete assignment`);
      handleAuthError(err);
    }
  };

  // Enhanced search with result feedback
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setInvoicePage(1);
    
    // Show toast for search results after a brief delay
    setTimeout(() => {
      const filteredResults = sortedAssignments.filter(invoice => {
        const supplierName = suppliers.find(s => s.id === invoice.supplier_id)?.name?.toLowerCase() || '';
        return (
          (invoice.supplier_invoice_no?.toLowerCase() || '').includes(searchValue.toLowerCase()) ||
          supplierName.includes(searchValue.toLowerCase()) ||
          (invoice.job_number?.toLowerCase() || '').includes(searchValue.toLowerCase())
        );
      });
      
      if (filteredResults.length === 0 && searchValue.trim()) {
        // No results warning toast
        toast((t) => (
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            No assignments found for "{searchValue}"
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
        // Results found toast
        toast((t) => (
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Found {filteredResults.length} assignment{filteredResults.length > 1 ? 's' : ''}
          </div>
        ), {
          duration: 2000,
        });
      }
    }, 100);
  };

  // Initial data loading with comprehensive feedback
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const loadingToast = toast.loading('🔄 Loading supplier assignment data...');
        
        await Promise.all([
          fetchSuppliers(),
          fetchInvoices(),
          fetchInvoiceNumbers(),
          fetchJobNumbers()
        ]);
        
        toast.dismiss(loadingToast);
        toast.success('✅ All data loaded successfully!');
      } catch (err) {
        console.error('Error loading data:', err);
        toast.error('❌ Failed to load some data. Please refresh the page.');
        handleAuthError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sorting handler for assignments
  const handleSortAssignments = (field) => {
    if (sortAssignmentField === field) {
      setSortAssignmentDirection(sortAssignmentDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortAssignmentField(field);
      setSortAssignmentDirection('asc');
    }
    setInvoicePage(1);
  };

  // Assignment search
  const filteredInvoices = invoices.filter(invoice => {
    const supplierName = suppliers.find(s => s.id === invoice.supplier_id)?.name?.toLowerCase() || '';
    return (
      (invoice.supplier_invoice_no?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      supplierName.includes(searchTerm.toLowerCase()) ||
      (invoice.job_number?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  });

  // Assignment sorting
  const sortedAssignments = [...filteredInvoices].sort((a, b) => {
    let valA, valB;
    if (sortAssignmentField === 'supplier_invoice_no') {
      valA = a.supplier_invoice_no?.toLowerCase() || '';
      valB = b.supplier_invoice_no?.toLowerCase() || '';
    } else if (sortAssignmentField === 'invoice_date') {
      valA = a.invoice_date || '';
      valB = b.invoice_date || '';
    } else {
      valA = a[sortAssignmentField] || '';
      valB = b[sortAssignmentField] || '';
    }
    if (valA < valB) return sortAssignmentDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortAssignmentDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Assignment pagination
  const invoiceTotalPages = Math.ceil(sortedAssignments.length / invoiceItemsPerPage);
  const indexOfLastInvoice = invoicePage * invoiceItemsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoiceItemsPerPage;
  const currentInvoices = sortedAssignments.slice(indexOfFirstInvoice, indexOfLastInvoice);

  // Reset assignment pagination on search or sort
  useEffect(() => { setInvoicePage(1); }, [searchTerm, invoices, sortAssignmentField, sortAssignmentDirection]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== '') {
        handleSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Prepare options for searchable dropdowns
  const supplierOptions = suppliers.map(supplier => ({
    value: supplier.id,
    label: supplier.name
  }));

  const invoiceNumberOptions = invoiceNumbers.map(inv => ({
    value: inv.invoice_no,
    label: inv.invoice_no
  }));

  const jobNumberOptions = jobNumbers.map(job => ({
    value: job.job_number,
    label: job.job_number
  }));

  // Get total amount
  const getTotalAmount = () => {
    return sortedAssignments.reduce((sum, invoice) => sum + parseFloat(invoice.bill_total_with_vat || 0), 0).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading supplier assignments...</p>
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
              <Truck className="w-8 h-8 mr-3 text-indigo-600" />
              Supplier Assignment Management
            </h1>
            <p className="text-gray-600 mt-2">Manage and track all supplier invoice assignments</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={toggleForm}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center shadow-md 
                ${isAddingInvoice 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-white-600 hover:bg-gray-100 text-indigo-600'}`}
            >
              {isAddingInvoice ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAddingInvoice ? 'Cancel' : 'Add Assignment'}
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH ASSIGNMENTS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Invoice Number, Supplier, or Job Number
                </label>
                <input
                  type="text"
                  placeholder="Search assignments..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Assignment Form */}
        {isAddingInvoice && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                {editingInvoiceId ? 'Edit Assignment' : 'Add New Assignment'}
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
                      value={supplierOptions.find(option => option.value == newInvoice.selectedSupplierId)}
                      onChange={(selectedOption) => setNewInvoice(prev => ({...prev, selectedSupplierId: selectedOption?.value || ''}))}
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
                      Invoice Number <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={invoiceNumberOptions}
                      value={invoiceNumberOptions.find(option => option.value === newInvoice.supplierInvoiceNo)}
                      onChange={(selectedOption) => setNewInvoice(prev => ({...prev, supplierInvoiceNo: selectedOption?.value || ''}))}
                      placeholder="Select Invoice Number"
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
                    <Select
                      options={jobNumberOptions}
                      value={jobNumberOptions.find(option => option.value === newInvoice.jobNumber)}
                      onChange={(selectedOption) => setNewInvoice(prev => ({...prev, jobNumber: selectedOption?.value || ''}))}
                      placeholder="Select Job Number"
                      isSearchable
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      styles={selectStyles}
                      className="w-full text-sm"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      name="invoiceDate"
                      value={newInvoice.invoiceDate}
                      onChange={handleInvoiceChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">VAT Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter VAT rate"
                      name="vatRate"
                      value={newInvoice.vatRate * 100}
                      onChange={handleInvoiceChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">VAT Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        value={(parseFloat(newInvoice?.vatAmount) || 0).toFixed(2)}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newInvoice.billTotalWithVAT.toFixed(2)}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Invoice Items */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-gray-800">Invoice Items</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-3 py-1 bg-white-600 text-indigo-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm border border-indigo-300"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Item
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price (SAR)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (SAR)</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {newInvoice.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                              placeholder="Purpose"
                              value={item.purpose}
                              onChange={(e) => handleItemChange(index, 'purpose', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                              placeholder="Item description"
                              value={item.item}
                              onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              min="1"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                              value={item.amount}
                              onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-gray-900">
                              {(item.quantity * item.amount).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-900"
                              disabled={newInvoice.items.length <= 1}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSubmitInvoice}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm"
                >
                  {editingInvoiceId ? 'Update Assignment' : 'Add Assignment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assignment Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Assignment Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">SAR {getTotalAmount()}</span>
            </div>
          </div>
        </div>

        {/* Assignments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'Invoice No', key: 'supplier_invoice_no' },
                    { label: 'Supplier', key: 'supplier_name' },
                    { label: 'Job Number', key: 'job_number' },
                    { label: 'Invoice Date', key: 'invoice_date' },
                    { label: 'Total Amount', key: 'bill_total_with_vat' },
                    { label: 'Actions', key: null },
                  ].map(({ label, key }) => (
                    <th
                      key={label}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => key && handleSortAssignments(key)}
                    >
                      <div className="flex items-center">
                        {label}
                        {key && sortAssignmentField === key && (
                          <ArrowUp
                            className={`w-4 h-4 ml-1 transition-transform ${sortAssignmentDirection === 'desc' ? 'rotate-180' : ''}`}
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Truck className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No assignment records found</h4>
                        <p className="text-gray-400 mt-2">
                          {searchTerm ? 'Try adjusting your search criteria' : 'Create your first assignment to get started'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.supplier_invoice_no}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {suppliers.find(s => s.id === invoice.supplier_id)?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {invoice.job_number || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                        SAR {parseFloat(invoice.bill_total_with_vat || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditInvoice(invoice)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
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
              Showing {indexOfFirstInvoice + 1} to{' '}
              {Math.min(indexOfLastInvoice, sortedAssignments.length)} of {sortedAssignments.length} assignments
            </div>
            <div className="flex items-center">
              <div className="flex space-x-1">
                <button
                  onClick={() => setInvoicePage((p) => Math.max(p - 1, 1))}
                  disabled={invoicePage === 1}
                  className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                  title="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setInvoicePage((p) => Math.min(p + 1, invoiceTotalPages))}
                  disabled={invoicePage === invoiceTotalPages || invoiceTotalPages === 0}
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

        {/* View Invoice Modal */}
        {viewingInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="bg-indigo-600 p-4 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white">Assignment Details</h2>
                  <button
                    onClick={() => setViewingInvoice(null)}
                    className="text-white hover:text-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600">Invoice Number:</span>
                        <span className="ml-2 font-medium">{viewingInvoice.supplier_invoice_no}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Supplier:</span>
                        <span className="ml-2 font-medium">
                          {suppliers.find(s => s.id === viewingInvoice.supplier_id)?.name || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Job Number:</span>
                        <span className="ml-2 font-medium">{viewingInvoice.job_number || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Invoice Date:</span>
                        <span className="ml-2 font-medium">
                          {viewingInvoice.invoice_date ? new Date(viewingInvoice.invoice_date).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Summary</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">SAR {parseFloat(viewingInvoice.total_amount || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">VAT ({((viewingInvoice.vat_rate || 0) * 100).toFixed(1)}%):</span>
                        <span className="font-medium">SAR {parseFloat(viewingInvoice.vat_amount || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-3">
                        <span className="font-semibold text-gray-800">Total with VAT:</span>
                        <span className="font-bold text-indigo-600">SAR {parseFloat(viewingInvoice.bill_total_with_vat || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Items */}
                {viewingInvoice.items && viewingInvoice.items.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice Items</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Purpose</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Item</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unit Price</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewingInvoice.items.map((item, index) => (
                            <tr key={index} className="border-t border-gray-200">
                              <td className="px-4 py-3 text-sm">{item.purpose}</td>
                              <td className="px-4 py-3 text-sm">{item.item}</td>
                              <td className="px-4 py-3 text-sm">{item.quantity}</td>
                              <td className="px-4 py-3 text-sm">SAR {parseFloat(item.amount || 0).toFixed(2)}</td>
                              <td className="px-4 py-3 text-sm font-medium">SAR {(item.quantity * item.amount).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddSupplierPage;
