import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert, Building2, Phone, Mail, Globe, MapPin
} from 'lucide-react';
import Select from 'react-select';

const API_URL = 'http://localhost:5000/api/clients';

const ClientsPage = () => {
  // State management
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [newClient, setNewClient] = useState({
    client_id: '',
    name: '',
    industry_type: '',
    phone1: '',
    phone2: '',
    phone3: '',
    credit_limit: '',
    val_no: '',
    commercial_reg_no: '',
    cpi: '',
    notes: '',
    shipper: '',
    ar_name: '',
    cpi_position: '',
    agent_name: '',
    address: '',
    country: '',
    cp1_email: '',
    agent_en_name: '',
    city: '',
    agent_ar_name: '',
    cp1: '',
    cp1_position: ''
  });

  // Country options
  const countries = [
    'United Arab Emirates', 'Saudi Arabia', 'Oman', 'Qatar', 'Kuwait', 
    'Bahrain', 'Egypt', 'Jordan', 'Holy See (Vatican City State)'
  ];

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

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication token missing');
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch clients from backend
  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_URL, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`Failed to fetch clients: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setClients(Array.isArray(data) ? data : data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Reset form
  const resetForm = () => {
    setNewClient({
      client_id: '',
      name: '',
      industry_type: '',
      phone1: '',
      phone2: '',
      phone3: '',
      credit_limit: '',
      val_no: '',
      commercial_reg_no: '',
      cpi: '',
      notes: '',
      shipper: '',
      ar_name: '',
      cpi_position: '',
      agent_name: '',
      address: '',
      country: '',
      cp1_email: '',
      agent_en_name: '',
      city: '',
      agent_ar_name: '',
      cp1: '',
      cp1_position: ''
    });
    setEditingId(null);
    setIsAdding(false);
    setError('');
    setSuccessMessage('');
  };

  // Fixed toggle function for Add Client button
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

  // Add or update client handler
  const handleAddClient = async () => {
    if (!newClient.name.trim()) {
      setError('Client name is required');
      return;
    }

    // Email validation if provided
    if (newClient.cp1_email && !/\S+@\S+\.\S+/.test(newClient.cp1_email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const headers = getAuthHeaders();
      let res;

      // Prepare payload - convert credit_limit to number if provided
      const payload = { ...newClient };
      if (payload.credit_limit) {
        payload.credit_limit = parseFloat(payload.credit_limit);
        if (isNaN(payload.credit_limit)) {
          setError('Credit limit must be a valid number');
          return;
        }
      }

      // Convert empty strings to null for optional fields
      Object.keys(payload).forEach(key => {
        if (payload[key] === '') payload[key] = null;
      });

      if (editingId !== null) {
        // For update, remove client_id from payload
        const { client_id, ...updatePayload } = payload;
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(updatePayload),
        });
        if (!res.ok) throw new Error('Failed to update client');
        setSuccessMessage('Client updated successfully!');
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to add client');
        setSuccessMessage('Client added successfully!');
      }

      await fetchClients();
      resetForm();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save client');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Delete client handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete client');
      
      await fetchClients();
      setSuccessMessage('Client deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete client');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Edit client handler
  const handleEdit = (client) => {
    setNewClient({
      client_id: client.client_id || '',
      name: client.name || '',
      industry_type: client.industry_type || '',
      phone1: client.phone1 || '',
      phone2: client.phone2 || '',
      phone3: client.phone3 || '',
      credit_limit: client.credit_limit || '',
      val_no: client.val_no || '',
      commercial_reg_no: client.commercial_reg_no || '',
      cpi: client.cpi || '',
      notes: client.notes || '',
      shipper: client.shipper || '',
      ar_name: client.ar_name || '',
      cpi_position: client.cpi_position || '',
      agent_name: client.agent_name || '',
      address: client.address || '',
      country: client.country || '',
      cp1_email: client.cp1_email || '',
      agent_en_name: client.agent_en_name || '',
      city: client.city || '',
      agent_ar_name: client.agent_ar_name || '',
      cp1: client.cp1 || '',
      cp1_position: client.cp1_position || ''
    });
    setEditingId(client.client_id);
    setIsAdding(true);
  };

  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
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

  // Sorted & filtered clients for display
  const sortedClients = [...clients].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredClients = sortedClients.filter(client =>
    (client.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.client_id || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.country || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.industry_type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, clients]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading client information...</p>
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
              <Users className="w-8 h-8 mr-3 text-indigo-600" />
              Client Management
            </h1>
            <p className="text-gray-600 mt-2">Manage and organize your client database</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            {/* Fixed Add Client Button */}
            <button
              type="button"
              onClick={handleToggleAddForm}
              className={`px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Cancel' : 'Add Client'}
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
              SEARCH CLIENTS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Name, Client ID, City, Country, or Industry
                </label>
                <input
                  type="text"
                  placeholder="Search clients..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Client Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                {editingId ? 'Edit Client' : 'Add New Client'}
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter client name"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry Type
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter industry type"
                      value={newClient.industry_type}
                      onChange={(e) => setNewClient({ ...newClient, industry_type: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Numbers
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <input
                        type="text"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Primary phone"
                        value={newClient.phone1}
                        onChange={(e) => setNewClient({ ...newClient, phone1: e.target.value })}
                      />
                      <input
                        type="text"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Secondary phone"
                        value={newClient.phone2}
                        onChange={(e) => setNewClient({ ...newClient, phone2: e.target.value })}
                      />
                      <input
                        type="text"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Third phone"
                        value={newClient.phone3}
                        onChange={(e) => setNewClient({ ...newClient, phone3: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credit Limit
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter credit limit"
                      value={newClient.credit_limit}
                      onChange={(e) => setNewClient({ ...newClient, credit_limit: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      VAL Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter VAL number"
                      value={newClient.val_no}
                      onChange={(e) => setNewClient({ ...newClient, val_no: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Commercial Registration No
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter commercial reg no"
                      value={newClient.commercial_reg_no}
                      onChange={(e) => setNewClient({ ...newClient, commercial_reg_no: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person (CPI)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter contact person"
                      value={newClient.cpi}
                      onChange={(e) => setNewClient({ ...newClient, cpi: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter contact email"
                      value={newClient.cp1_email}
                      onChange={(e) => setNewClient({ ...newClient, cp1_email: e.target.value })}
                    />
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arabic Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter Arabic name"
                      value={newClient.ar_name}
                      onChange={(e) => setNewClient({ ...newClient, ar_name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person Position
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter position"
                      value={newClient.cpi_position}
                      onChange={(e) => setNewClient({ ...newClient, cpi_position: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agent Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter agent name"
                      value={newClient.agent_name}
                      onChange={(e) => setNewClient({ ...newClient, agent_name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agent English Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter agent English name"
                      value={newClient.agent_en_name}
                      onChange={(e) => setNewClient({ ...newClient, agent_en_name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agent Arabic Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter agent Arabic name"
                      value={newClient.agent_ar_name}
                      onChange={(e) => setNewClient({ ...newClient, agent_ar_name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      value={newClient.country}
                      onChange={(e) => setNewClient({ ...newClient, country: e.target.value })}
                    >
                      <option value="">Select country</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter city"
                      value={newClient.city}
                      onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
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
                      value={newClient.shipper}
                      onChange={(e) => setNewClient({ ...newClient, shipper: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                  placeholder="Enter full address"
                  rows="3"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                />
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                  placeholder="Enter additional notes"
                  rows="3"
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                />
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAddClient}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm"
                >
                  {editingId ? 'Update Client' : 'Add Client'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Client Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Client Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">{filteredClients.length} clients</span>
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'ID', key: 'client_id' },
                    { label: 'Name', key: 'name' },
                    { label: 'Industry', key: 'industry_type' },
                    { label: 'Phone', key: 'phone1' },
                    { label: 'City', key: 'city' },
                    { label: 'Country', key: 'country' },
                    { label: 'Credit Limit', key: 'credit_limit' },
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
                {currentClients.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                      No client records found
                    </td>
                  </tr>
                ) : (
                  currentClients.map((client) => (
                    <tr key={client.client_id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">
                        {client.client_id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-indigo-600 mr-2" />
                          {client.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {client.industry_type || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          {client.phone1 || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          {client.city || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 text-gray-400 mr-2" />
                          {client.country || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                        {client.credit_limit ? `$${parseFloat(client.credit_limit).toFixed(2)}` : 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleEdit(client)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(client.client_id)}
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
                Showing {indexOfFirstItem + 1} to{' '}
                {Math.min(indexOfLastItem, filteredClients.length)} of {filteredClients.length} clients
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
                Total: <span className="text-green-600 font-bold">{filteredClients.length} clients</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
