import React, { useState, useEffect } from 'react';
import { 
  User, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, Loader, AlertTriangle, Eye, EyeOff, 
  Lock, Phone, Home, CreditCard, Globe, Shield
} from 'lucide-react';
import Select from 'react-select';
import axios from 'axios';
import toast from 'react-hot-toast';
import ToastConfig from '../../components/ToastConfig';

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
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('employeeName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState(false);
  const itemsPerPage = 10;

  const [newUser, setNewUser] = useState({
    employeeName: '',
    username: '',
    email: '',
    currentPassword: '',
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

  // Auth header
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

  // Handle authentication errors using ToastConfig styles
  const handleAuthError = (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401 || error.message.includes('Authentication')) {
      toast.error('🔐 Authentication failed. Please login again.');
    } else if (error.response?.status === 404 || error.message.includes('404')) {
      toast.error('🔍 API endpoint not found. Please check if the server is running.');
    } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      toast.error('🌐 Cannot connect to server. Please ensure the backend server is running on port 5000.');
    } else if (error.response?.status === 500 || error.message.includes('500')) {
      toast.error('⚠️ Server error occurred. Please try again later.');
    } else {
      toast.error(`❌ ${error.message || 'An unexpected error occurred'}`);
    }
  };

  // Validation function using ToastConfig warning style
  const validateUserForm = () => {
    const errors = [];
    
    if (!newUser.employeeName.trim()) {
      errors.push('Employee name is required');
    } else if (newUser.employeeName.trim().length < 2) {
      errors.push('Employee name must be at least 2 characters');
    }
    
    if (!newUser.username.trim()) {
      errors.push('Username is required');
    } else if (newUser.username.trim().length < 3) {
      errors.push('Username must be at least 3 characters');
    }
    
    if (!newUser.email.trim()) {
      errors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (!newUser.password || newUser.password === '') {
      errors.push('Password is required');
    } else if (newUser.password !== '***' && newUser.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    
    if (newUser.password !== newUser.confirmPassword) {
      errors.push('Passwords do not match');
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }
    
    // For editing users, require current password if changing password
    if (editingId && newUser.password !== '***' && !newUser.currentPassword) {
      errors.push('Current password is required to change password');
      setCurrentPasswordError(true);
    } else {
      setCurrentPasswordError(false);
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

  // Check if current user is admin
  const checkAdminAccess = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/users/me', {
        headers: getAuthHeaders(),
      });
      
      if (response.data.success) {
        const userData = convertObjectKeys(response.data.data, toCamelCase);
        setCurrentUser(userData);
        
        if (userData.isAdmin === 1) {
          setIsAdmin(true);
          setAccessDenied(false);
          // If user is admin, fetch all users
          await fetchUsers();
          toast.success('✅ Admin access verified');
        } else {
          setIsAdmin(false);
          setAccessDenied(true);
          toast.error('❌ Access denied - Administrator privileges required');
        }
      } else {
        toast.error('❌ Failed to verify user permissions');
        setAccessDenied(true);
      }
    } catch (err) {
      console.error('Admin check error:', err);
      setAccessDenied(true);
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users from backend (only called if user is admin)
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/', {
        headers: getAuthHeaders(),
      });
      const camelCaseUsers = convertObjectKeys(response.data, toCamelCase);
      setUsers(camelCaseUsers.filter(user => user.password !== ''));
      console.log('Users loaded successfully:', camelCaseUsers.length, 'records');
      
      // Using ToastConfig success style
      if (camelCaseUsers.length > 0) {
        toast.success(`✅ Successfully loaded ${camelCaseUsers.length} user${camelCaseUsers.length > 1 ? 's' : ''}`);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      handleAuthError(err);
    }
  };

  useEffect(() => {
    checkAdminAccess();
  }, []);

  // Reset form
  const resetForm = () => {
    setNewUser({
      employeeName: '',
      username: '',
      email: '',
      currentPassword: '',
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
    setCurrentPasswordError(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowCurrentPassword(false);
  };

  // Toggle add form using ToastConfig custom style
  const handleToggleAddForm = () => {
    if (isAdding) {
      resetForm();
      // Using ToastConfig custom style
      toast((t) => (
        <div className="flex items-center">
          <X className="w-5 h-5 mr-2" />
          Form cancelled
        </div>
      ), {
        duration: 2000,
      });
    } else {
      setIsAdding(true);
      setEditingId(null);
      
      // Using ToastConfig custom style
      toast((t) => (
        <div className="flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Ready to add new user
        </div>
      ), {
        duration: 2000,
      });
    }
  };

  // Add or update user using ToastConfig styles
  const handleAddUser = async () => {
    if (!validateUserForm()) {
      return;
    }

    // Using ToastConfig loading style
    const loadingToast = toast.loading(
      editingId ? '🔄 Updating user...' : '💾 Adding new user...'
    );

    try {
      setIsLoading(true);
      const userPayload = {
        employee_name: newUser.employeeName || null,
        username: newUser.username || null,
        email: newUser.email || null,
        nationality: newUser.nationality || null,
        passport_no: newUser.passportIqama || null,
        address: newUser.address || null,
        phone_no: newUser.phone || null,
        license_no: newUser.licenseNo || null,
        is_admin: newUser.isAdmin ?? 0,
        is_protected: newUser.isProtected ?? 0,
      };

      // Only include password fields if password is being changed
      if (newUser.password !== '***') {
        userPayload.password = newUser.password;
        if (editingId && newUser.currentPassword) {
          userPayload.currentPassword = newUser.currentPassword;
        }
      }

      let res;
      if (editingId !== null) {
        res = await axios.put(`http://localhost:5000/api/users/${editingId}`, userPayload, {
          headers: getAuthHeaders(),
        });
        
        toast.dismiss(loadingToast);
        // Using ToastConfig success style
        toast.success(`✅ "${newUser.employeeName}" updated successfully!`);
      } else {
        res = await axios.post('http://localhost:5000/api/users/', userPayload, {
          headers: getAuthHeaders(),
        });
        
        toast.dismiss(loadingToast);
        // Using ToastConfig success style
        toast.success(`🎉 "${newUser.employeeName}" added successfully!`);
      }

      await fetchUsers();
      resetForm();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error saving user:', err);
      
      if (err.response?.status === 400 && err.response.data.message.includes('current password')) {
        setCurrentPasswordError(true);
        // Using ToastConfig warning style
        toast((t) => (
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Current password is incorrect
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
      } else if (err.response?.status === 409) {
        // Using ToastConfig warning style
        toast((t) => (
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Username or email already exists
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
        // Using ToastConfig error style
        toast.error(`❌ ${err.response ? err.response.data.message : err.message}`);
      }
      
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit user using ToastConfig custom style
  const handleEdit = (user) => {
    setNewUser({
      employeeName: user.employeeName || '',
      username: user.username || '',
      email: user.email || '',
      currentPassword: '',
      password: '***',
      confirmPassword: '***',
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
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowCurrentPassword(false);
    
    // Using ToastConfig custom style
    toast((t) => (
      <div className="flex items-center">
        <Pencil className="w-5 h-5 mr-2" />
        Editing: {user.employeeName}
      </div>
    ), {
      duration: 2500,
    });
  };

  // Delete user using ToastConfig styles
  const handleDelete = async (id) => {
    const user = users.find(u => u.id === id);
    const userName = user ? user.employeeName : 'this user';
    
    if (!window.confirm(`⚠️ Are you sure you want to delete "${userName}"?\n\nThis action cannot be undone.`)) {
      // Using ToastConfig custom style
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

    // Using ToastConfig loading style
    const loadingToast = toast.loading(`🗑️ Deleting "${userName}"...`);

    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: getAuthHeaders(),
      });
      
      toast.dismiss(loadingToast);
      // Using ToastConfig success style
      toast.success(`🗑️ "${userName}" deleted successfully!`);
      
      await fetchUsers();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error deleting user:', err);
      
      // Using ToastConfig error style
      toast.error(`❌ ${err.message || 'Failed to delete user'}`);
      handleAuthError(err);
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

  // Handle search using ToastConfig styles
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
    
    // Show toast for search results
    setTimeout(() => {
      const filteredResults = users.filter(user =>
        (user.employeeName || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        (user.username || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        (user.nationality || '').toLowerCase().includes(searchValue.toLowerCase())
      );
      
      if (filteredResults.length === 0 && searchValue.trim()) {
        // Using ToastConfig warning style
        toast((t) => (
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            No users found for "{searchValue}"
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
        // Using ToastConfig custom style
        toast((t) => (
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Found {filteredResults.length} user{filteredResults.length > 1 ? 's' : ''}
          </div>
        ), {
          duration: 2000,
        });
      }
    }, 100);
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

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== '') {
        handleSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Loading state
  if (isLoading && !accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // Access denied screen for non-admin users
  if (accessDenied || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
            <p className="text-gray-600">You cannot access this page</p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800 font-medium">Administrator Access Required</span>
            </div>
            <p className="text-red-700 text-sm">
              This page is restricted to administrators only. Please contact your system administrator if you believe you should have access.
            </p>
          </div>

          {currentUser && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Current User</h3>
              <div className="text-sm text-gray-600">
                <p><strong>Name:</strong> {currentUser.employeeName}</p>
                <p><strong>Username:</strong> {currentUser.username}</p>
                <p><strong>Role:</strong> {currentUser.isAdmin ? 'Administrator' : 'User'}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('authToken');
                window.location.href = '/login';
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Toast Configuration for access denied page */}
        <ToastConfig position="bottom-right" />
      </div>
    );
  }

  // Main component render (only for admin users)
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <User className="w-8 h-8 mr-3 text-indigo-600" />
              User Management
            </h1>
            <p className="text-gray-600 mt-2">Manage system users and their permissions</p>
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
              {isAdding ? 'Cancel' : 'Add User'}
            </button>
          </div>
        </div>

        {/* Search Section */}
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

                  {/* Current Password Field - Only show when editing and changing password */}
                  {editingId && newUser.password !== '***' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-500 ml-2">
                          (Required to change password)
                        </span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm ${
                            currentPasswordError ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter current password"
                          value={newUser.currentPassword}
                          onChange={(e) => setNewUser({ ...newUser, currentPassword: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                        </button>
                      </div>
                      {currentPasswordError && (
                        <p className="text-red-500 text-xs mt-1">Current password is required to change password</p>
                      )}
                    </div>
                  )}
                  
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
              
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={handleToggleAddForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm"
                >
                  Cancel
                </button>
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

        {/* Users Table - Password column removed and better layout */}
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
                    { label: 'License No', key: 'licenseNo' },
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
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <User className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No user records found</h4>
                        <p className="text-gray-400 mt-2">
                          {searchTerm ? 'Try adjusting your search criteria' : 'Create your first user to get started'}
                        </p>
                      </div>
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
                            <div className="text-xs text-gray-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-medium">{user.username}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <span className="truncate max-w-[200px]" title={user.email}>
                            {user.email}
                          </span>
                        </div>
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
                        <span className="text-gray-600">{user.licenseNo || 'N/A'}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isAdmin 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.isAdmin ? 'Admin' : 'User'}
                          </span>
                          {user.isProtected && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Protected
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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

      {/* Toast Configuration */}
      <ToastConfig position="bottom-right" />
    </div>
  );
};

export default UserManagementPage;
