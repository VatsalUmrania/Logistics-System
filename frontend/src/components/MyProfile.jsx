import React, { useState, useEffect } from 'react';
import { 
  User, Edit3, Save, X, Eye, EyeOff, Phone, Mail, MapPin, 
  CreditCard, Shield, Calendar, Check, AlertCircle as Alert, Loader
} from 'lucide-react';
import Select from 'react-select';

const MyProfile = () => {
  // State management
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    employee_name: '',
    username: '',
    email: '',
    nationality: '',
    passport_no: '',
    address: '',
    phone_no: '',
    license_no: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
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

  // Nationality options
  const nationalityOptions = [
    { value: 'Saudi Arabia', label: 'Saudi Arabia' },
    { value: 'United Arab Emirates', label: 'United Arab Emirates' },
    { value: 'Kuwait', label: 'Kuwait' },
    { value: 'Qatar', label: 'Qatar' },
    { value: 'Bahrain', label: 'Bahrain' },
    { value: 'Oman', label: 'Oman' },
    { value: 'Egypt', label: 'Egypt' },
    { value: 'Jordan', label: 'Jordan' },
    { value: 'Lebanon', label: 'Lebanon' },
    { value: 'Syria', label: 'Syria' },
    { value: 'Iraq', label: 'Iraq' },
    { value: 'Yemen', label: 'Yemen' },
    { value: 'Palestine', label: 'Palestine' },
    { value: 'Libya', label: 'Libya' },
    { value: 'Tunisia', label: 'Tunisia' },
    { value: 'Algeria', label: 'Algeria' },
    { value: 'Morocco', label: 'Morocco' },
    { value: 'Sudan', label: 'Sudan' },
    { value: 'India', label: 'India' },
    { value: 'Pakistan', label: 'Pakistan' },
    { value: 'Bangladesh', label: 'Bangladesh' },
    { value: 'Philippines', label: 'Philippines' },
    { value: 'Indonesia', label: 'Indonesia' },
    { value: 'Sri Lanka', label: 'Sri Lanka' },
    { value: 'Nepal', label: 'Nepal' },
    { value: 'Other', label: 'Other' }
  ];

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

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/users/me', getAuthHeaders());
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.data);
        setFormData({
          employee_name: data.data.employee_name || '',
          username: data.data.username || '',
          email: data.data.email || '',
          nationality: data.data.nationality || '',
          passport_no: data.data.passport_no || '',
          address: data.data.address || '',
          phone_no: data.data.phone_no || '',
          license_no: data.data.license_no || '',
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        setError('');
      } else {
        throw new Error(data.message || 'Failed to fetch user profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSave = async () => {
    // Validation
    if (!formData.employee_name.trim()) {
      setError('Employee name is required');
      return;
    }
    
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Password validation if changing password
    if (formData.new_password) {
      if (!formData.current_password) {
        setError('Current password is required to change password');
        return;
      }
      
      if (formData.new_password.length < 6) {
        setError('New password must be at least 6 characters long');
        return;
      }
      
      if (formData.new_password !== formData.confirm_password) {
        setError('New password and confirm password do not match');
        return;
      }
    }

    setSaving(true);
    try {
      const updateData = {
        employee_name: formData.employee_name,
        username: formData.username,
        email: formData.email,
        nationality: formData.nationality,
        passport_no: formData.passport_no,
        address: formData.address,
        phone_no: formData.phone_no,
        license_no: formData.license_no
      };

      // Add password fields if changing password
      if (formData.new_password) {
        updateData.current_password = formData.current_password;
        updateData.new_password = formData.new_password;
      }

      const response = await fetch('http://localhost:5000/api/users/me', {
        method: 'PUT',
        ...getAuthHeaders(),
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      
      if (data.success) {
        setUser(data.data);
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
        setError('');
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          current_password: '',
          new_password: '',
          confirm_password: ''
        }));
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    // Reset form data to original user data
    if (user) {
      setFormData({
        employee_name: user.employee_name || '',
        username: user.username || '',
        email: user.email || '',
        nationality: user.nationality || '',
        passport_no: user.passport_no || '',
        address: user.address || '',
        phone_no: user.phone_no || '',
        license_no: user.license_no || '',
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header - Matching AssignExpenses */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <User className="w-8 h-8 mr-3 text-indigo-600" />
              My Profile
            </h1>
            <p className="text-gray-600 mt-2">Manage your personal information and account settings</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center shadow-md"
              >
                <Edit3 className="w-5 h-5 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center shadow-md disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center shadow-md"
                >
                  <X className="w-5 h-5 mr-2" />
                  Cancel
                </button>
              </div>
            )}
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

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl mr-4">
                {getUserInitials(user?.employee_name)}
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{user?.employee_name}</h2>
                <p className="text-indigo-100">@{user?.username}</p>
                <div className="flex items-center mt-2">
                  {user?.is_admin ? (
                    <div className="flex items-center bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                      <Shield className="w-3 h-3 mr-1" />
                      Administrator
                    </div>
                  ) : (
                    <div className="flex items-center bg-green-500 text-green-900 px-2 py-1 rounded-full text-xs font-medium">
                      <User className="w-3 h-3 mr-1" />
                      User
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Personal Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.employee_name}
                      onChange={(e) => handleInputChange('employee_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user?.employee_name || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter username"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      {user?.username || 'N/A'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter email address"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      {user?.email || 'N/A'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nationality
                  </label>
                  {isEditing ? (
                    <Select
                      options={nationalityOptions}
                      value={nationalityOptions.find(option => option.value === formData.nationality)}
                      onChange={(selectedOption) => handleInputChange('nationality', selectedOption?.value || '')}
                      placeholder="Select Nationality"
                      isSearchable
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      styles={selectStyles}
                      className="w-full text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user?.nationality || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone_no}
                      onChange={(e) => handleInputChange('phone_no', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      {user?.phone_no || 'N/A'}
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Additional Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                      rows="3"
                      placeholder="Enter address"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg flex items-start">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
                      {user?.address || 'N/A'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passport Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.passport_no}
                      onChange={(e) => handleInputChange('passport_no', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter passport number"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                      {user?.passport_no || 'N/A'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.license_no}
                      onChange={(e) => handleInputChange('license_no', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter license number"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user?.license_no || 'N/A'}</p>
                  )}
                </div>

                {/* Account Information */}
                <div className="pt-4">
                  <h4 className="text-md font-semibold text-gray-700 mb-3">Account Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Account Created:</span>
                      <span className="text-gray-900 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(user?.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="text-gray-900">{formatDate(user?.updated_at)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">User ID:</span>
                      <span className="text-gray-900 font-mono">#{user?.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change Section - Only visible when editing */}
            {isEditing && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.current_password}
                        onChange={(e) => handleInputChange('current_password', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.new_password}
                      onChange={(e) => handleInputChange('new_password', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.confirm_password}
                      onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Leave password fields empty if you don't want to change your password.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
