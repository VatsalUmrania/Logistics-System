import { useState, useEffect } from 'react';
import {
  User, Globe, MapPin, Mail, Edit, Trash2, ChevronDown,
  Search, Plus, X, ChevronLeft, ChevronRight
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api/clients';

const ClientManagementPage = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    clientId: '', name: '', industryType: '', phone1: '', phone2: '', phone3: '', creditLimit: '',
    valNo: '', commercialRegNo: '', cp1: '', notes: '', shipper: '', arName: '', cp1Position: '',
    agentName: '', address: '', country: '', cp1Email: '', agentEnName: '', city: '', agentArName: ''
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const countries = [
    'United Arab Emirates', 'Saudi Arabia', 'Oman',
    'Qatar', 'Kuwait', 'Bahrain', 'Egypt', 'Jordan'
  ];

  // Convert API snake_case object to camelCase
  const toCamelCaseClient = (obj) => ({
    clientId: obj.client_id,
    name: obj.name,
    industryType: obj.industry_type,
    phone1: obj.phone1,
    phone2: obj.phone2,
    phone3: obj.phone3,
    creditLimit: obj.credit_limit,
    valNo: obj.val_no,
    commercialRegNo: obj.commercial_reg_no,
    cp1: obj.cp1,
    notes: obj.notes,
    shipper: obj.shipper,
    arName: obj.ar_name,
    cp1Position: obj.cp1_position,
    agentName: obj.agent_name,
    address: obj.address,
    country: obj.country,
    cp1Email: obj.cp1_email,
    agentEnName: obj.agent_en_name,
    city: obj.city,
    agentArName: obj.agent_ar_name
  });

  // Convert camelCase to snake_case for API
  const formatToSnakeCaseClient = (client) => ({
    client_id: client.clientId,
    name: client.name,
    industry_type: client.industryType,
    phone1: client.phone1,
    phone2: client.phone2,
    phone3: client.phone3,
    credit_limit: client.creditLimit,
    val_no: client.valNo,
    commercial_reg_no: client.commercialRegNo,
    cp1: client.cp1,
    notes: client.notes,
    shipper: client.shipper,
    ar_name: client.arName,
    cp1_position: client.cp1Position,
    agent_name: client.agentName,
    address: client.address,
    country: client.country,
    cp1_email: client.cp1Email,
    agent_en_name: client.agentEnName,
    city: client.city,
    agent_ar_name: client.agentArName
  });

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('Authentication token missing');
        return;
      }
      const res = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`Error fetching clients: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setClients(data.map(toCamelCaseClient));
    } catch (err) {
      console.error('Failed to fetch clients:', err);
      alert('Failed to fetch clients. Please check your connection and try again.');
    }
  };

  useEffect(() => { fetchClients(); }, []);

  const handleAddClient = async () => {
    if (!newClient.clientId || !newClient.name) {
      alert('Client ID and Name are required fields');
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Authentication token missing. Please login again.');
        return;
      }
      const payload = formatToSnakeCaseClient(newClient);
      // Convert credit_limit to number if it's not empty
      if (payload.credit_limit) {
        payload.credit_limit = parseFloat(payload.credit_limit);
        if (isNaN(payload.credit_limit)) {
          alert('Credit limit must be a valid number');
          return;
        }
      }
      // Convert empty strings to null for optional fields
      Object.keys(payload).forEach(key => { if (payload[key] === "") payload[key] = null; });

      let response;
      if (editingId !== null) {
        const { client_id, ...updatePayload } = payload;
        response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(updatePayload),
        });
      } else {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error ${response.status}: ${errorData}`);
      }
      await fetchClients();
      setIsAdding(false);
      setNewClient({
        clientId: '', name: '', industryType: '', phone1: '', phone2: '', phone3: '', creditLimit: '',
        valNo: '', commercialRegNo: '', cp1: '', notes: '', shipper: '', arName: '', cp1Position: '',
        agentName: '', address: '', country: '', cp1Email: '', agentEnName: '', city: '', agentArName: ''
      });
      setEditingId(null);
      alert(editingId ? 'Client updated successfully!' : 'Client added successfully!');
    } catch (err) {
      console.error('Error saving client:', err);
      alert(`Error saving client: ${err.message}`);
    }
  };

  const handleDelete = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Authentication token missing. Please login again.');
        return;
      }
      const response = await fetch(`${API_URL}/${clientId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error ${response.status}: ${errorData}`);
      }
      await fetchClients();
      alert('Client deleted successfully!');
    } catch (err) {
      console.error('Failed to delete client:', err);
      alert(`Failed to delete client: ${err.message}`);
    }
  };

  const handleEdit = (client) => {
    setNewClient({
      clientId: client.clientId,
      name: client.name,
      industryType: client.industryType || '',
      phone1: client.phone1 || '',
      phone2: client.phone2 || '',
      phone3: client.phone3 || '',
      creditLimit: client.creditLimit || '',
      valNo: client.valNo || '',
      commercialRegNo: client.commercialRegNo || '',
      cp1: client.cp1 || '',
      notes: client.notes || '',
      shipper: client.shipper || '',
      arName: client.arName || '',
      cp1Position: client.cp1Position || '',
      agentName: client.agentName || '',
      address: client.address || '',
      country: client.country || '',
      cp1Email: client.cp1Email || '',
      agentEnName: client.agentEnName || '',
      city: client.city || '',
      agentArName: client.agentArName || ''
    });
    setEditingId(client.clientId);
    setIsAdding(true);
  };

  // Filter and search functionality
  const filteredClients = clients.filter(client =>
    (client.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.clientId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.country || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 py-8 px-2 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent flex items-center">
              <User className="w-8 h-8 mr-3 text-indigo-600" />
              CLIENTS MANAGEMENT
            </h1>
            <p className="text-gray-600 mt-2">Manage your client information and relationships</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  className="bg-transparent outline-none w-40"
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
              {isAdding ? 'Close' : 'Add Client'}
            </button>
          </div>
        </div>

        {/* Add Client Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                {editingId ? 'Edit Client Details' : 'Add New Client'}
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client ID <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter client id"
                        value={newClient.clientId}
                        onChange={(e) => setNewClient({...newClient, clientId: e.target.value})}
                      />
                    </div>
                  </div>
                  {/* ...the rest of the left column fields as in your last message... */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter client name"
                      value={newClient.name}
                      onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry Type
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter industry type"
                      value={newClient.industryType}
                      onChange={(e) => setNewClient({...newClient, industryType: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Numbers
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Phone 1"
                        value={newClient.phone1}
                        onChange={(e) => setNewClient({...newClient, phone1: e.target.value})}
                      />
                      <input
                        type="text"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Phone 2"
                        value={newClient.phone2}
                        onChange={(e) => setNewClient({...newClient, phone2: e.target.value})}
                      />
                      <input
                        type="text"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Phone 3"
                        value={newClient.phone3}
                        onChange={(e) => setNewClient({...newClient, phone3: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credit Limit
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter credit limit"
                      value={newClient.creditLimit}
                      onChange={(e) => setNewClient({...newClient, creditLimit: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Val No.
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter val no"
                      value={newClient.valNo}
                      onChange={(e) => setNewClient({...newClient, valNo: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Commercial Reg No.
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter commercial reg no"
                      value={newClient.commercialRegNo}
                      onChange={(e) => setNewClient({...newClient, commercialRegNo: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      C.P1
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter cp1"
                      value={newClient.cp1}
                      onChange={(e) => setNewClient({...newClient, cp1: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter notes"
                      rows="2"
                      value={newClient.notes}
                      onChange={(e) => setNewClient({...newClient, notes: e.target.value})}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shipper
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter shipper"
                      value={newClient.shipper}
                      onChange={(e) => setNewClient({...newClient, shipper: e.target.value})}
                    />
                  </div>
                </div>
                {/* Column 2 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ar.Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter Ar.Name"
                      value={newClient.arName}
                      onChange={(e) => setNewClient({...newClient, arName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      C.P1 Position
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter cp1 position"
                      value={newClient.cp1Position}
                      onChange={(e) => setNewClient({...newClient, cp1Position: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agent Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter agent name"
                      value={newClient.agentName}
                      onChange={(e) => setNewClient({...newClient, agentName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Address
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter client address"
                      rows="2"
                      value={newClient.address}
                      onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="w-5 h-5 text-gray-400" />
                      </div>
                      <select
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                        value={newClient.country}
                        onChange={(e) => setNewClient({...newClient, country: e.target.value})}
                      >
                        <option value="">Select country</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      C.P1 Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter cp1 email"
                        value={newClient.cp1Email}
                        onChange={(e) => setNewClient({...newClient, cp1Email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agent En.Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter agent English name"
                      value={newClient.agentEnName}
                      onChange={(e) => setNewClient({...newClient, agentEnName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter city"
                        value={newClient.city}
                        onChange={(e) => setNewClient({...newClient, city: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agent Ar.Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter agent Arabic name"
                      value={newClient.agentArName}
                      onChange={(e) => setNewClient({...newClient, agentArName: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 pt-6">
                <button
                  onClick={handleAddClient}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1 shadow-md"
                >
                  {editingId ? 'Update Client' : 'Save Client Details'}
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setNewClient({
                      clientId: '', name: '', industryType: '', phone1: '', phone2: '', phone3: '', creditLimit: '',
                      valNo: '', commercialRegNo: '', cp1: '', notes: '', shipper: '', arName: '', cp1Position: '',
                      agentName: '', address: '', country: '', cp1Email: '', agentEnName: '', city: '', agentArName: ''
                    });
                  }}
                  className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clients List Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">CLIENTS LIST</h3>
            <div className="text-sm text-gray-500">
              Showing {Math.min(filteredClients.length, itemsPerPage)} of {filteredClients.length} clients
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Client ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Commercial Reg No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Val No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Ar.Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Industry Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentClients.length > 0 ? (
                  currentClients.map((client, index) => (
                    <tr key={client.clientId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-indigo-600">{client.clientId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                            <div className="text-xs text-gray-500">{client.industryType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><div className="text-sm text-gray-900">{client.commercialRegNo}</div></td>
                      <td className="px-6 py-4"><div className="text-sm text-gray-900">{client.valNo}</div></td>
                      <td className="px-6 py-4"><div className="text-sm text-gray-900">{client.arName}</div></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 text-gray-500 mr-1" />
                          <div className="text-sm text-gray-900">{client.country}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                          <div className="text-sm text-gray-900">{client.city}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><div className="text-sm text-gray-900">{client.industryType}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEdit(client)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(client.clientId)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <User className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No clients found</h4>
                        <p className="text-gray-400 mt-1">Add a new client to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {filteredClients.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 via-white to-purple-50 flex items-center justify-between">
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

export default ClientManagementPage;