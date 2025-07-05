import React, { useState, useEffect, useMemo } from "react";
import {
  ClipboardList,
  Plus,
  X,
  FileText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Pencil,
  Trash2,
  Activity,
  Users,
  CheckCircle2,
  Loader,
  Check,
  AlertCircle as Alert,
} from "lucide-react";
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import Select from 'react-select';

// API Configuration
const API_URL = "http://localhost:5000/api";

// Authentication helper function
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Authentication token missing');
  }
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// API Services with authentication
const clearanceOperationsAPI = {
  getAll: () => axios.get(`${API_URL}/clearance-operations`, getAuthHeaders()),
  getById: (id) => axios.get(`${API_URL}/clearance-operations/${id}`, getAuthHeaders()),
  create: (data) => axios.post(`${API_URL}/clearance-operations`, data, getAuthHeaders()),
  update: (id, data) => axios.put(`${API_URL}/clearance-operations/${id}`, data, getAuthHeaders()),
  delete: (id) => axios.delete(`${API_URL}/clearance-operations/${id}`, getAuthHeaders()),
  updateStatus: (id, status) => 
    axios.patch(`${API_URL}/clearance-operations/${id}/status`, { status }, getAuthHeaders())
};

const billsAPI = {
  getByOperationId: (operationId) => axios.get(`${API_URL}/bills/operation/${operationId}`, getAuthHeaders()),
  create: (data) => axios.post(`${API_URL}/bills`, data, getAuthHeaders()),
  update: (id, data) => axios.put(`${API_URL}/bills/${id}`, data, getAuthHeaders()),
  delete: (id) => axios.delete(`${API_URL}/bills/${id}`, getAuthHeaders()),
};

// Client API service
const clientsAPI = {
  getAll: () => axios.get(`${API_URL}/clients`, getAuthHeaders()),
};

// Ports API service
const portsAPI = {
  getAll: () => axios.get(`${API_URL}/ports`, getAuthHeaders()),
};

// Vessels API service
const vesselsAPI = {
  getAll: () => axios.get(`${API_URL}/vessels`, getAuthHeaders()),
};

// Containers API service
const containersAPI = {
  getAll: () => axios.get(`${API_URL}/containers`, getAuthHeaders()),
};

// Commodities API service
const commoditiesAPI = {
  getAll: () => axios.get(`${API_URL}/commodities`, getAuthHeaders()),
};
const JobAPI = {
  getAll: () => axios.get(`${API_URL}/invoices/job-numbers`, getAuthHeaders()),
};
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

// Toggle Switch Component
const ToggleSwitch = ({ value, onChange, disabled = false }) => {
  const isActive = value === "Active";
  
  return (
    <div className="flex items-center">
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${isActive ? 'bg-green-500' : 'bg-gray-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => !disabled && onChange(isActive ? "Inactive" : "Active")}
        disabled={disabled}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
      <span className="ml-2 text-sm font-medium text-gray-700">
        {isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
  );
};

// Initial form data structure
const initialFormData = {
  operation_type: "Import",
  transport_mode: "Sea",
  client: "",
  job_no: "",
  commodity: "",
  no_of_packages: "",
  pod: "",
  line: "",
  vessel: "",
  net_weight: "",
  gross_weight: "",
  shipper: "",
  client_ref_name: "",
  line_agent: "",
  representative: "",
  receiving_rep: "",
  pol: "",
  bayan_no: "",
  bayan_date: "",
  payment_date: "",
  group_name: "",
  eta: "",
  date: "",
  yard_date: "",
  hijri_date: "",
  end_date: "",
  release_date: "",
  status: "",
  notes: "",
  bl: "",
  po_no: "",
};

function ClearanceOperation() {
  const [formData, setFormData] = useState(initialFormData);
  const [containers, setContainers] = useState([
    { id: Date.now(), container: "", qty: "", type: "" },
  ]);
  const [bills, setBills] = useState([
    { id: null, clientRef: "", doDate: "", doNo: "", endorseNo: "", billNo: "" },
  ]);
  const [originalBills, setOriginalBills] = useState([]);
  const [operations, setOperations] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [currentOperationId, setCurrentOperationId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("client");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [vesselOptions, setVesselOptions] = useState([]);
  const [portOptions, setPortOptions] = useState([]);
  const [containerOptions, setContainerOptions] = useState([]);
  const [commodityOptions, setCommodityOptions] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    vessels: false,
    ports: false,
    containers: false,
    commodities: false
  });
  const [jobNumberOptions, setJobNumberOptions] = useState([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState({});
  const itemsPerPage = 10;

  // Fetch ports function
  const fetchPorts = async () => {
    setLoadingStates(prev => ({ ...prev, ports: true }));
    try {
      const response = await portsAPI.getAll();
      const portDropdownOptions = response.data.map(port => ({
        value: port.name,
        label: port.name
      }));
      setPortOptions(portDropdownOptions);
    } catch (error) {
      console.error("Error fetching ports:", error);
      setPortOptions([
        { value: "Jeddah", label: "Jeddah" },
        { value: "Dubai", label: "Dubai" },
        { value: "Shanghai", label: "Shanghai" },
        { value: "Rotterdam", label: "Rotterdam" },
      ]);
    } finally {
      setLoadingStates(prev => ({ ...prev, ports: false }));
    }
  };

  // Fetch vessels function
  const fetchVessels = async () => {
    setLoadingStates(prev => ({ ...prev, vessels: true }));
    try {
      const response = await vesselsAPI.getAll();
      const vesselDropdownOptions = response.data.map(vessel => ({
        value: vessel.name,
        label: `${vessel.name} (${vessel.number})`
      }));
      setVesselOptions(vesselDropdownOptions);
    } catch (error) {
      console.error("Error fetching vessels:", error);
      setVesselOptions([
        { value: "MV Ocean Explorer", label: "MV Ocean Explorer (OX-2391)" },
        { value: "SS Pacific Breeze", label: "SS Pacific Breeze (PB-7732)" },
        { value: "MV Atlantic Star", label: "MV Atlantic Star (AS-9850)" },
      ]);
    } finally {
      setLoadingStates(prev => ({ ...prev, vessels: false }));
    }
  };

  // Fetch containers function
  const fetchContainers = async () => {
    setLoadingStates(prev => ({ ...prev, containers: true }));
    try {
      const response = await containersAPI.getAll();
      const containerDropdownOptions = response.data.map(container => ({
        value: container.name,
        label: container.name
      }));
      setContainerOptions(containerDropdownOptions);
    } catch (error) {
      console.error("Error fetching containers:", error);
      setContainerOptions([
        { value: "CONT-1001", label: "CONT-1001" },
        { value: "CONT-1002", label: "CONT-1002" },
        { value: "CONT-1003", label: "CONT-1003" },
      ]);
    } finally {
      setLoadingStates(prev => ({ ...prev, containers: false }));
    }
  };

  // Fetch commodities function
  const fetchCommodities = async () => {
    setLoadingStates(prev => ({ ...prev, commodities: true }));
    try {
      const response = await commoditiesAPI.getAll();
      const commodityDropdownOptions = response.data.map(commodity => ({
        value: commodity.name,
        label: commodity.name
      }));
      setCommodityOptions(commodityDropdownOptions);
    } catch (error) {
      console.error("Error fetching commodities:", error);
      setCommodityOptions([
        { value: "Electronics", label: "Electronics" },
        { value: "Food", label: "Food" },
      ]);
    } finally {
      setLoadingStates(prev => ({ ...prev, commodities: false }));
    }
  };

  // Fetch all operations on component mount
  useEffect(() => {
    fetchOperations();
    fetchClients();
    fetchPorts();
    fetchVessels();
    fetchContainers();
    fetchCommodities();
    fetchJobNumbers();
  }, []);

  const fetchOperations = async () => {
    setIsLoading(true);
    try {
      const response = await clearanceOperationsAPI.getAll();
      setOperations(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch operations');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch clients function
  const fetchClients = async () => {
    try {
      const response = await clientsAPI.getAll();
      const clientDropdownOptions = response.data.map(client => ({
        value: client.name,
        label: client.name
      }));
      setClientOptions(clientDropdownOptions);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClientOptions([
        { value: "Client A", label: "Client A" },
        { value: "Client B", label: "Client B" },
      ]);
    }
  };
  const fetchJobNumbers = async () => {
    try {
      const response = await JobAPI.getAll();
      const JobNoOptions = response.data.map(jobNumber => ({
        value: jobNumber.name,
        label: jobNumber.name
      }));
      setClientOptions(JobNoOptions);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClientOptions([
        { value: "Client A", label: "Client A" },
        { value: "Client B", label: "Client B" },
      ]);
    }
  };

  
  // Add this function to handle status toggles from the table
  const handleStatusChange = async (operationId, newStatus) => {
    setIsUpdatingStatus(prev => ({ ...prev, [operationId]: true }));
    
    try {
      // Optimistic UI update
      setOperations(prev => 
        prev.map(op => op.id === operationId ? { ...op, status: newStatus } : op)
      );
      
      await clearanceOperationsAPI.updateStatus(operationId, newStatus);
      setSuccessMessage('Status updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error updating status:", error);
      setError('Failed to update status');
      setTimeout(() => setError(''), 3000);
      // Revert optimistic update on error
      setOperations(prev => 
        prev.map(op => op.id === operationId ? { ...op, status: op.status } : op)
      );
    } finally {
      setIsUpdatingStatus(prev => ({ ...prev, [operationId]: false }));
    }
  };

  // Handlers
  const handleFormChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const addContainer = () => {
    setContainers((prev) => [
      ...prev,
      { id: Date.now(), container: "", qty: "", type: "" },
    ]);
  };
  
  const removeContainer = (id) => {
    if (containers.length > 1)
      setContainers((prev) => prev.filter((container) => container.id !== id));
  };
  
  const updateContainer = (id, field, value) => {
    setContainers((prev) =>
      prev.map((container) =>
        container.id === id ? { ...container, [field]: value } : container
      )
    );
  };

  const addBill = () => {
    setBills((prev) => [
      ...prev,
      {
        id: null,
        clientRef: "",
        doDate: "",
        doNo: "",
        endorseNo: "",
        billNo: "",
      },
    ]);
  };
  
  const removeBill = (id) => {
    if (bills.length > 1)
      setBills((prev) => prev.filter((bill) => bill.id !== id));
  };
  
  const updateBill = (id, field, value) => {
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === id ? { ...bill, [field]: value } : bill
      )
    );
  };

  // Prepare data in the exact format you specified
  const prepareOperationData = (data) => {
    const result = { ...data };
    
    // Convert numeric fields - keep as numbers, not strings
    const numericFields = ['net_weight', 'no_of_packages', 'gross_weight'];
    numericFields.forEach(field => {
      if (result[field] === '' || result[field] === null || result[field] === undefined) {
        result[field] = null;
      } else {
        // For no_of_packages, keep as integer
        if (field === 'no_of_packages') {
          result[field] = parseInt(result[field]) || null;
        } else {
          // For weights, keep as float with 2 decimal places
          result[field] = parseFloat(result[field]).toFixed(2);
        }
      }
    });
    
    // Handle date fields properly
    const dateFields = [
      'date', 'yard_date', 'bayan_date', 'payment_date', 
      'end_date', 'release_date'
    ];
    
    dateFields.forEach(field => {
      if (result[field] && result[field] !== '') {
        // Convert from YYYY-MM-DD to ISO string with time
        result[field] = new Date(result[field] + 'T18:30:00.000Z').toISOString();
      } else {
        result[field] = null;
      }
    });
    
    // Handle ETA field separately (keep as YYYY-MM-DD format)
    if (result.eta && result.eta !== '') {
      result.eta = result.eta; // Keep as is (YYYY-MM-DD)
    } else {
      result.eta = null;
    }
    
    // Convert empty strings to null for all other fields
    Object.keys(result).forEach(key => {
      if (result[key] === "" || result[key] === undefined) {
        result[key] = null;
      }
    });
    
    return result;
  };

  const prepareBillData = (bill) => {
    const result = { ...bill };
    
    // Convert date field
    if (result.doDate && result.doDate !== '') {
      result.doDate = new Date(result.doDate + 'T18:30:00.000Z').toISOString();
    } else {
      result.doDate = null;
    }
    
    // Convert empty strings to null
    Object.keys(result).forEach(key => {
      if (result[key] === "" || result[key] === undefined) {
        result[key] = null;
      }
    });
    
    return result;
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const opData = prepareOperationData(formData);
      
      let operationId = currentOperationId;

      if (!operationId) {
        // Create new operation
        const createRes = await clearanceOperationsAPI.create(opData);
        operationId = createRes.data.id;
        
        // Create bills
        for (const bill of bills) {
          if (bill.clientRef || bill.doNo || bill.billNo) {
            const preparedBill = prepareBillData(bill);
            await billsAPI.create({ ...preparedBill, operation_id: operationId });
          }
        }
        setSuccessMessage('Operation created successfully');
      } else {
        // Update existing operation
        await clearanceOperationsAPI.update(operationId, opData);
        
        // Process bills
        const currentBills = [...bills];
        const originalBillsIds = originalBills.map(b => b.id);

        // Update/Create bills
        for (const bill of currentBills) {
          if (bill.id) {
            const preparedBill = prepareBillData(bill);
            await billsAPI.update(bill.id, preparedBill);
          } else if (bill.clientRef || bill.doNo || bill.billNo) {
            const preparedBill = prepareBillData(bill);
            await billsAPI.create({ ...preparedBill, operation_id: operationId });
          }
        }

        // Delete removed bills
        const currentBillsIds = currentBills.filter(b => b.id).map(b => b.id);
        const billsToDeleteIds = originalBillsIds.filter(id => !currentBillsIds.includes(id));
        for (const id of billsToDeleteIds) {
          await billsAPI.delete(id);
        }
        setSuccessMessage('Operation updated successfully');
      }

      // Refresh data and reset form
      await fetchOperations();
      resetForm();
      setIsAdding(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Failed to save operation');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (operation) => {
    setIsLoading(true);
    try {
      // Fetch operation details and bills
      const opRes = await clearanceOperationsAPI.getById(operation.id);
      const billsRes = await billsAPI.getByOperationId(operation.id);
      
      // Format dates for form inputs
      const formattedOperation = { ...opRes.data };
      const dateFields = [
        'date', 'yard_date', 'bayan_date', 'payment_date', 
        'end_date', 'release_date'
      ];
      
      dateFields.forEach(field => {
        if (formattedOperation[field]) {
          formattedOperation[field] = formatDateForInput(formattedOperation[field]);
        }
      });
      
      // Handle ETA separately
      if (formattedOperation.eta) {
        formattedOperation.eta = formattedOperation.eta;
      }
      
      setFormData(formattedOperation);
      
      // Format bill dates
      const formattedBills = billsRes.data.map(bill => {
        if (bill.doDate) {
          return { ...bill, doDate: formatDateForInput(bill.doDate) };
        }
        return bill;
      });
      
      setBills(formattedBills);
      setOriginalBills(billsRes.data);
      setCurrentOperationId(operation.id);
      setIsAdding(true);
    } catch (error) {
      setError('Failed to load operation for editing');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this operation?")) {
      setIsLoading(true);
      try {
        // Delete associated bills first
        const billsRes = await billsAPI.getByOperationId(id);
        for (const bill of billsRes.data) {
          await billsAPI.delete(bill.id);
        }
        
        // Delete operation
        await clearanceOperationsAPI.delete(id);
        
        // Refresh operations list
        await fetchOperations();
        setSuccessMessage('Operation deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Failed to delete operation');
        setTimeout(() => setError(''), 3000);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setContainers([{ id: Date.now(), container: "", qty: "", type: "" }]);
    setBills([
      { id: null, clientRef: "", doDate: "", doNo: "", endorseNo: "", billNo: "" },
    ]);
    setOriginalBills([]);
    setCurrentOperationId(null);
  };

  // Sorting
  const handleSort = (field) => {
    if (sortField === field) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  // Render sort icon
  const renderSortIcon = (field) => {
    if (sortField !== field) return <ChevronDown className="w-3 h-3 text-gray-400 inline" />;
    return sortDirection === 'asc' ?
      <ChevronDown className="w-3 h-3 text-indigo-600 inline rotate-180" /> :
      <ChevronDown className="w-3 h-3 text-indigo-600 inline" />;
  };

  // Pagination & sorting for operations
  const sortedOperations = [...operations].sort((a, b) => {
    const aValue = a[sortField] || "";
    const bValue = b[sortField] || "";
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const filteredOperations = sortedOperations.filter(
    (op) =>
      op.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.job_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.operation_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.transport_mode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.vessel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.pol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastOperation = currentPage * itemsPerPage;
  const indexOfFirstOperation = indexOfLastOperation - itemsPerPage;
  const currentOperations = filteredOperations.slice(indexOfFirstOperation, indexOfLastOperation);
  const totalPages = Math.ceil(filteredOperations.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Format date for input fields (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      return format(parseISO(dateString), "yyyy-MM-dd");
    } catch {
      return "";
    }
  };

  // Constants
  const containerTypes = ["20GP", "40GP", "40HC", "45HC", "20RF", "40RF"];
  const completedOps = operations.filter((o) => o.status === "Completed").length;
  const activeOps = operations.filter((o) => o.status === "In Progress").length;

  if (isLoading && operations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading clearance operations...</p>
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
              <ClipboardList className="w-8 h-8 mr-3 text-indigo-600" />
              Clearance Operations
            </h1>
            <p className="text-gray-600 mt-2">Manage clearance jobs, containers and documents</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={() => {
                if (isAdding) {
                  resetForm();
                  setIsAdding(false);
                } else {
                  setIsAdding(true);
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center shadow-md 
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-white-600 hover:bg-gray-100 text-indigo-600'}`}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Cancel' : 'Add Operation'}
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
              SEARCH OPERATIONS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Client, Job No, Type, Mode, Vessel, Port, or Status
                </label>
                <input
                  type="text"
                  placeholder="Search operations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Operation Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                {currentOperationId ? 'Edit Clearance Operation' : 'Add New Clearance Operation'}
              </h2>
            </div>
            <div className="p-4">
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                {/* Basic Information */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Operation Type <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4">
                          {["Export", "Import"].map((t) => (
                            <label key={t} className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                              <input
                                type="radio"
                                name="operation_type"
                                value={t}
                                checked={formData.operation_type === t}
                                onChange={(e) => handleFormChange("operation_type", e.target.value)}
                                className="accent-indigo-600"
                                required
                              />
                              {t}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Transport Mode <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4">
                          {["Land", "Air", "Sea"].map((t) => (
                            <label key={t} className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                              <input
                                type="radio"
                                name="transport_mode"
                                value={t}
                                checked={formData.transport_mode === t}
                                onChange={(e) => handleFormChange("transport_mode", e.target.value)}
                                className="accent-indigo-600"
                                required
                              />
                              {t}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Client <span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={clientOptions}
                          value={clientOptions.find(option => option.value === formData.client)}
                          onChange={(selectedOption) => handleFormChange('client', selectedOption?.value || '')}
                          placeholder="Select Client"
                          isSearchable
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          styles={selectStyles}
                          className="w-full text-sm"
                        />
                      </div>
                      
                      {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="Enter job number"
                          value={formData.job_no}
                          onChange={(e) => handleFormChange("job_no", e.target.value)}
                          required
                        />
                      </div> */}
                      <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Job Number <span className="text-red-500">*</span>
  </label>
  <Select
    options={jobNumberOptions} // This should contain the job number options fetched from your API
    value={jobNumberOptions.find(option => option.value === formData.jobNumber)} // Assuming `formData.jobNumber` contains the selected job number
    onChange={(selectedOption) => handleFormChange('jobNumber', selectedOption?.value || '')} // handleFormChange updates the form state
    placeholder="Select Job Number"
    isSearchable
    menuPortalTarget={document.body}
    menuPosition="fixed"
    styles={selectStyles} // Custom styles for the select dropdown (optional)
    className="w-full text-sm"
  />
</div>

                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Client Reference
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="Enter client reference"
                          value={formData.client_ref_name}
                          onChange={(e) => handleFormChange("client_ref_name", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bayan No
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="Enter bayan number"
                          value={formData.bayan_no}
                          onChange={(e) => handleFormChange("bayan_no", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <ToggleSwitch 
                          value={formData.status} 
                          onChange={(value) => handleFormChange("status", value)} 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PO Number
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="Enter PO number"
                          value={formData.po_no}
                          onChange={(e) => handleFormChange("po_no", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping & Logistics */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    Shipping & Logistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Shipping Line
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="Enter shipping line"
                          value={formData.line}
                          onChange={(e) => handleFormChange("line", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vessel
                        </label>
                        <Select
                          options={vesselOptions}
                          value={vesselOptions.find(option => option.value === formData.vessel)}
                          onChange={(selectedOption) => handleFormChange('vessel', selectedOption?.value || '')}
                          placeholder="Select Vessel"
                          isSearchable
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          styles={selectStyles}
                          className="w-full text-sm"
                          isLoading={loadingStates.vessels}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Line Agent
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="Enter line agent"
                          value={formData.line_agent}
                          onChange={(e) => handleFormChange("line_agent", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ETA
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                          value={formData.eta}
                          onChange={(e) => handleFormChange("eta", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Port of Loading (POL)
                        </label>
                        <Select
                          options={portOptions}
                          value={portOptions.find(option => option.value === formData.pol)}
                          onChange={(selectedOption) => handleFormChange('pol', selectedOption?.value || '')}
                          placeholder="Select Port"
                          isSearchable
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          styles={selectStyles}
                          className="w-full text-sm"
                          isLoading={loadingStates.ports}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Port of Discharge (POD)
                        </label>
                        <Select
                          options={portOptions}
                          value={portOptions.find(option => option.value === formData.pod)}
                          onChange={(selectedOption) => handleFormChange('pod', selectedOption?.value || '')}
                          placeholder="Select Port"
                          isSearchable
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          styles={selectStyles}
                          className="w-full text-sm"
                          isLoading={loadingStates.ports}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Representative
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="Enter representative"
                          value={formData.representative}
                          onChange={(e) => handleFormChange("representative", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Receiving Representative
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="Enter receiving representative"
                          value={formData.receiving_rep}
                          onChange={(e) => handleFormChange("receiving_rep", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cargo Information */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    Cargo Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Commodity
                        </label>
                        <Select
                          options={commodityOptions}
                          value={commodityOptions.find(option => option.value === formData.commodity)}
                          onChange={(selectedOption) => handleFormChange('commodity', selectedOption?.value || '')}
                          placeholder="Select Commodity"
                          isSearchable
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          styles={selectStyles}
                          className="w-full text-sm"
                          isLoading={loadingStates.commodities}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Number of Packages
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="Enter number of packages"
                          value={formData.no_of_packages}
                          onChange={(e) => handleFormChange("no_of_packages", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Shipper
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="Enter shipper"
                          value={formData.shipper}
                          onChange={(e) => handleFormChange("shipper", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bill of Lading
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="Enter bill of lading"
                          value={formData.bl}
                          onChange={(e) => handleFormChange("bl", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Net Weight (KG)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="Enter net weight"
                          value={formData.net_weight}
                          onChange={(e) => handleFormChange("net_weight", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gross Weight (KG)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="Enter gross weight"
                          value={formData.gross_weight}
                          onChange={(e) => handleFormChange("gross_weight", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Container Information */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Container Information
                    </h3>
                    <button
                      type="button"
                      onClick={addContainer}
                      className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-indigo-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add Container
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Container</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {containers.map((container) => (
                          <tr key={container.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <Select
                                options={containerOptions}
                                value={containerOptions.find(option => option.value === container.container)}
                                onChange={(selectedOption) => updateContainer(container.id, "container", selectedOption?.value || '')}
                                placeholder="Select container"
                                isSearchable
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                styles={selectStyles}
                                className="w-full text-sm"
                                isLoading={loadingStates.containers}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                value={container.qty}
                                onChange={(e) => updateContainer(container.id, "qty", e.target.value)}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <select
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                value={container.type}
                                onChange={(e) => updateContainer(container.id, "type", e.target.value)}
                              >
                                <option value="">Select</option>
                                {containerTypes.map((type, idx) => (
                                  <option key={idx} value={type}>{type}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => removeContainer(container.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Remove container"
                                disabled={containers.length <= 1}
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

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : currentOperationId ? 'Update Operation' : 'Create Operation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Operations Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600">Total Operations</h3>
              <p className="text-2xl font-bold text-indigo-600">{operations.length}</p>
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
              <p className="text-2xl font-bold text-yellow-600">{activeOps}</p>
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600">Completed</h3>
              <p className="text-2xl font-bold text-green-600">{completedOps}</p>
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600">Clients</h3>
              <p className="text-2xl font-bold text-purple-600">{new Set(operations.map((o) => o.client)).size}</p>
            </div>
          </div>
        </div>

        {/* Operations Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'Job No', key: 'job_no' },
                    { label: 'Client', key: 'client' },
                    { label: 'Type', key: 'operation_type' },
                    { label: 'Mode', key: 'transport_mode' },
                    { label: 'Vessel', key: 'vessel' },
                    { label: 'POL', key: 'pol' },
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
                {currentOperations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <ClipboardList className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No operations found</h4>
                        <p className="text-gray-400 mt-2">Create your first clearance operation to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentOperations.map((operation) => (
                    <tr key={operation.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">
                        {operation.job_no}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {operation.client}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          operation.operation_type === 'Import' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {operation.operation_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {operation.transport_mode}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {operation.vessel || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {operation.pol || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <ToggleSwitch
                          value={operation.status}
                          onChange={(newStatus) => handleStatusChange(operation.id, newStatus)}
                          disabled={isUpdatingStatus[operation.id]}
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleEdit(operation)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(operation.id)}
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
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700 mb-2 md:mb-0">
                Showing {indexOfFirstOperation + 1} to{' '}
                {Math.min(indexOfLastOperation, filteredOperations.length)} of {filteredOperations.length} operations
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
                Total: <span className="text-green-600 font-bold">{filteredOperations.length} operations</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClearanceOperation;

