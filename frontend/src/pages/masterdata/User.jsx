import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { User, Plus, Pencil, Trash2, Eye, EyeOff, ChevronDown, Lock, Phone, Home, CreditCard, Globe, X } from 'lucide-react';


const UserManagementPage = () => {
  const [users, setUsers] = useState([
    { 
      id: 1, 
      employeeName: 'John Smith', 
      username: 'john.smith', 
      password: 'password123', 
      nationality: 'USA', 
      passportIqama: 'AB1234567', 
      address: '123 Main St, New York', 
      phone: '+1 234 567 8901', 
      licenseNo: 'DL-987654' 
    },
    { 
      id: 2, 
      employeeName: 'Sarah Johnson', 
      username: 'sarah.j', 
      password: 'securePass!', 
      nationality: 'Canada', 
      passportIqama: 'CA7654321', 
      address: '456 Maple Ave, Toronto', 
      phone: '+1 345 678 9012', 
      licenseNo: 'DL-123456' 
    },
    { 
      id: 3, 
      employeeName: 'David Wilson', 
      username: 'd.wilson', 
      password: 'davidPass', 
      nationality: 'UK', 
      passportIqama: 'UK5432167', 
      address: '789 Oak Rd, London', 
      phone: '+44 123 456 7890', 
      licenseNo: 'DL-456789' 
    },
  ]);
  
  const [newUser, setNewUser] = useState({
    employeeName: '',
    username: '',
    password: '',
    confirmPassword: '',
    nationality: '',
    passportIqama: '',
    address: '',
    phone: '',
    licenseNo: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const nationalities = [
    'USA', 'Canada', 'UK', 'Australia', 'Germany', 
    'France', 'Japan', 'India', 'Brazil', 'South Africa'
  ];

  const handleAddUser = () => {
    if (!newUser.employeeName.trim() || !newUser.username.trim() || !newUser.password) return;
    
    if (newUser.password !== newUser.confirmPassword) {
      setPasswordMatchError(true);
      return;
    }
    
    setPasswordMatchError(false);
    
    if (editingId !== null) {
      // Update existing user
      setUsers(users.map(u => 
        u.id === editingId ? { ...u, ...newUser } : u
      ));
      setEditingId(null);
    } else {
      // Add new user
      const newUserWithId = {
        ...newUser,
        id: users.length + 1,
      };
      setUsers([...users, newUserWithId]);
    }
    
    setNewUser({
      employeeName: '',
      username: '',
      password: '',
      confirmPassword: '',
      nationality: '',
      passportIqama: '',
      address: '',
      phone: '',
      licenseNo: '',
    });
    
    setIsAdding(false);
  };

  const handleEdit = (user) => {
    setNewUser({
      employeeName: user.employeeName,
      username: user.username,
      password: user.password,
      confirmPassword: user.password,
      nationality: user.nationality,
      passportIqama: user.passportIqama,
      address: user.address,
      phone: user.phone,
      licenseNo: user.licenseNo,
    });
    
    setEditingId(user.id);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <User className="w-8 h-8 mr-3 text-indigo-600" />
              USER MANAGEMENT
            </h1>
            <p className="text-gray-600 mt-2">Manage system users and their permissions</p>
          </div>
          
          <div className="mt-4 md:mt-0">
          <button
              onClick={() => setIsAdding(!isAdding)}
              className={`px-5 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}
              `}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Close' : 'Add Bank'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Add User Form */}
          {(isAdding || editingId !== null) && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  {editingId ? 'Edit User Details' : 'Add New User'}
                </h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-4">
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
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter full name"
                          value={newUser.employeeName}
                          onChange={(e) => setNewUser({...newUser, employeeName: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        User Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        />
                        <button 
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? 
                            <EyeOff className="w-5 h-5 text-gray-400" /> : 
                            <Eye className="w-5 h-5 text-gray-400" />
                          }
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
                          className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            passwordMatchError ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Confirm password"
                          value={newUser.confirmPassword}
                          onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                        />
                        <button 
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? 
                            <EyeOff className="w-5 h-5 text-gray-400" /> : 
                            <Eye className="w-5 h-5 text-gray-400" />
                          }
                        </button>
                      </div>
                      {passwordMatchError && (
                        <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nationality
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="w-5 h-5 text-gray-400" />
                        </div>
                        <select
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                          value={newUser.nationality}
                          onChange={(e) => setNewUser({...newUser, nationality: e.target.value})}
                        >
                          <option value="">Select nationality</option>
                          {nationalities.map(nat => (
                            <option key={nat} value={nat}>{nat}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
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
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter ID number"
                          value={newUser.passportIqama}
                          onChange={(e) => setNewUser({...newUser, passportIqama: e.target.value})}
                        />
                      </div>
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
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter full address"
                          rows="2"
                          value={newUser.address}
                          onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                        ></textarea>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone No.
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter phone number"
                          value={newUser.phone}
                          onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        License No.
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter license number"
                        value={newUser.licenseNo}
                        onChange={(e) => setNewUser({...newUser, licenseNo: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-6">
                  <button
                    onClick={handleAddUser}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1 shadow-md"
                  >
                    {editingId ? 'Update User' : 'Save User'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setEditingId(null);
                      setNewUser({
                        employeeName: '',
                        username: '',
                        password: '',
                        confirmPassword: '',
                        nationality: '',
                        passportIqama: '',
                        address: '',
                        phone: '',
                        licenseNo: '',
                      });
                      setPasswordMatchError(false);
                    }}
                  >
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Users Table */}
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">System Users</h3>
            <div className="text-sm text-gray-500">
              Showing all {users.length} users
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nationality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone No.
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mr-3">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.employeeName}</div>
                            <div className="text-xs text-gray-500">{user.licenseNo}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{user.nationality}</div>
                        <div className="text-xs text-gray-500">{user.passportIqama}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{user.phone}</div>
                        <div className="text-xs text-gray-500">{user.address.substring(0, 20)}...</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEdit(user)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <User className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No users found</h4>
                        <p className="text-gray-400 mt-1">Add a new user to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;