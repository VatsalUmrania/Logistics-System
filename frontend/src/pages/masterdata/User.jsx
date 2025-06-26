import React, { useState, useEffect } from 'react';
import { 
  User, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert, Eye, EyeOff, 
  Lock, Phone, Home, CreditCard, Globe, Shield
} from 'lucide-react';
import Select from 'react-select';
import axios from 'axios';

// Helper functions for case conversion
const toCamelCase = (str) =>
  str.replace(/([-_][a-z])/ig, ($1) =>
    $1.toUpperCase().replace('-', '').replace('_', '')
  );

const convertObjectKeys = (obj, converter) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => convertObjectKeys(item, converter));
  }
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = converter(key);
    acc[newKey] = convertObjectKeys(obj[key], converter);
    return acc;
  }, {});
};

const nationalities = [
  'USA', 'Canada', 'UK', 'Australia', 'Germany',
  'France', 'Japan', 'India', 'Brazil', 'South Africa'
];

const UserManagementPage = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('employeeName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const itemsPerPage = 10;

  const [newUser, setNewUser] = useState({
    employeeName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nationality: '',
    passportIqama: '',
    address: '',
    phone: '',
    licenseNo: '',
    isAdmin: 0,
    isProtected: 0,
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

  // Auth header
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication token missing');
    }
    return { 'Authorization': `Bearer ${token}` };
  };

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/users/', {
        headers: getAuthHeaders(),
      });
      const camelCaseUsers = convertObjectKeys(response.data, toCamelCase);
      setUsers(camelCaseUsers.filter(user => user.password !== ''));
      setError('');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to load users');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset form
  const resetForm = () => {
    setNewUser({
      employeeName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      nationality: '',
      passportIqama: '',
      address: '',
      phone: '',
      licenseNo: '',
      isAdmin: 0,
      isProtected: 0,
    });
    setEditingId(null);
    setIsAdding(false);
    setPasswordMatchError(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError('');
    setSuccessMessage('');
  };

  // Fixed toggle function for Add User button
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

  // Add or update user
  const handleAddUser = async () => {
    setError('');
    setSuccessMessage('');
    
    if (!newUser.employeeName.trim() || !newUser.username.trim() || !newUser.password) {
      setError('Please fill out all required fields.');
      return;
    }
    
    if (newUser.password !== newUser.confirmPassword) {
      setPasswordMatchError(true);
      return;
    }
    
    setPasswordMatchError(false);

    try {
      setIsLoading(true);
      const userPayload = {
        employee_name: newUser.employeeName || null,
        username: newUser.username || null,
        email: newUser.email || null,
        password: newUser.password || null,
        nationality: newUser.nationality || null,
        passport_no: newUser.passportIqama || null,
        address: newUser.address || null,
        phone_no: newUser.phone || null,
        license_no: newUser.licenseNo || null,
        is_admin: newUser.isAdmin ?? 0,
        is_protected: newUser.isProtected ?? 0,
      };

      let res;
      if (editingId !== null) {
        res = await axios.put(`http://localhost:5000/api/users/${editingId}`, userPayload, {
          headers: getAuthHeaders(),
        });
        setSuccessMessage('User updated successfully!');
      } else {
        res = await axios.post('http://localhost:5000/api/users/', userPayload, {
          headers: getAuthHeaders(),
        });
        setSuccessMessage('User added successfully!');
      }

      await fetchUsers();
      resetForm();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Error saving user: ' + (err.response ? err.response.data.message : err.message));
      }
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit user - FIXED to show *** for password
  const handleEdit = (user) => {
    setNewUser({
      employeeName: user.employeeName || '',
      username: user.username || '',
      email: user.email || '',
      password: '***', // Show *** for existing password
      confirmPassword: '***', // Show *** for confirm password
      nationality: user.nationality || '',
      passportIqama: user.passportIqama || '',
      address: user.address || '',
      phone: user.phone || '',
      licenseNo: user.licenseNo || '',
      isAdmin: user.isAdmin ?? 0,
      isProtected: user.isProtected ?? 0,
    });
    setEditingId(user.id);
    setIsAdding(true);
    setShowPassword(false); // Hide password by default
    setShowConfirmPassword(false);
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: getAuthHeaders(),
      });
      
      await fetchUsers();
      setSuccessMessage('User deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete user');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoading(false);
    }
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

  // Filtered and sorted users
  const filteredUsers = users.filter(user =>
    (user.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.nationality || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  // Prepare options for dropdowns
  const nationalityOptions = nationalities.map(nationality => ({
    value: nationality,
    label: nationality
  }));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, users]);

  if (isLoading && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading user data...</p>
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
              <User className="w-8 h-8 mr-3 text-indigo-600" />
              User Management
            </h1>
            <p className="text-gray-600 mt-2">Manage system users and their permissions</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            {/* Fixed Add User Button */}
            <button
              type="button"
              onClick={handleToggleAddForm}
              className={`px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Cancel' : 'Add User'}
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
              SEARCH USERS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Name, Username, Email, or Nationality
                </label>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit User Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                {editingId ? 'Edit User' : 'Add New User'}
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Enter full name"
                        value={newUser.employeeName}
                        onChange={(e) => setNewUser({ ...newUser, employeeName: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter username"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password <span className="text-red-500">*</span>
                      {editingId && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Leave as *** to keep current password)
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Enter password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm ${
                          passwordMatchError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Confirm password"
                        value={newUser.confirmPassword}
                        onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                      </button>
                    </div>
                    {passwordMatchError && (
                      <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nationality
                    </label>
                    <Select
                      options={nationalityOptions}
                      value={nationalityOptions.find(option => option.value === newUser.nationality)}
                      onChange={(selectedOption) => setNewUser({ ...newUser, nationality: selectedOption?.value || '' })}
                      placeholder="Select Nationality"
                      isSearchable
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      styles={selectStyles}
                      className="w-full text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Passport No. / Iqama
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Enter ID number"
                        value={newUser.passportIqama}
                        onChange={(e) => setNewUser({ ...newUser, passportIqama: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Enter phone number"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter license number"
                      value={newUser.licenseNo}
                      onChange={(e) => setNewUser({ ...newUser, licenseNo: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 pt-2.5 flex items-start pointer-events-none">
                        <Home className="w-5 h-5 text-gray-400" />
                      </div>
                      <textarea
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                        placeholder="Enter full address"
                        rows="2"
                        value={newUser.address}
                        onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center space-x-2 select-none cursor-pointer">
                      <Shield className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm text-gray-700">Admin</span>
                      <input
                        type="checkbox"
                        checked={!!newUser.isAdmin}
                        onChange={() => setNewUser({ ...newUser, isAdmin: newUser.isAdmin ? 0 : 1 })}
                        className="accent-indigo-600 ml-1"
                      />
                    </label>
                    <label className="flex items-center space-x-2 select-none cursor-pointer">
                      <Lock className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-700">Protected</span>
                      <input
                        type="checkbox"
                        checked={!!newUser.isProtected}
                        onChange={() => setNewUser({ ...newUser, isProtected: newUser.isProtected ? 0 : 1 })}
                        className="accent-purple-600 ml-1"
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAddUser}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm"
                >
                  {editingId ? 'Update User' : 'Add User'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">User Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">{filteredUsers.length} users</span>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'Employee Name', key: 'employeeName' },
                    { label: 'Username', key: 'username' },
                    { label: 'Email', key: 'email' },
                    { label: 'Nationality', key: 'nationality' },
                    { label: 'Phone', key: 'phone' },
                    { label: 'Role', key: 'isAdmin' },
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
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                      No user records found
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3
                            ${user.isAdmin ? 'bg-gradient-to-br from-pink-500 to-purple-500' : 'bg-gradient-to-br from-emerald-400 to-teal-500'}`}>
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{user.employeeName}</div>
                            <div className="text-xs text-gray-500">{user.licenseNo}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {user.username}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-indigo-400" />
                          <span>{user.nationality || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{user.phone || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isAdmin 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                        {user.isProtected && (
                          <span className="ml-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Protected
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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
                {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
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
                Total: <span className="text-green-600 font-bold">{filteredUsers.length} users</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
