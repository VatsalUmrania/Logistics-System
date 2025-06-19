// // User.jsx
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   User, Plus, Pencil, Trash2, Eye, EyeOff, ChevronDown, 
//   Lock, Phone, Home, CreditCard, Globe, X 
// } from 'lucide-react';

// // Helper functions for case conversion
// const toCamelCase = (str) => {
//   return str.replace(/([-_][a-z])/ig, ($1) => {
//     return $1.toUpperCase().replace('-', '').replace('_', '');
//   });
// };

// const formatToSnakeCase = (str) => {
//   return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
// };

// // Convert object keys between cases
// const convertObjectKeys = (obj, converter) => {
//   if (obj === null || typeof obj !== 'object') return obj;
  
//   if (Array.isArray(obj)) {
//     return obj.map(item => convertObjectKeys(item, converter));
//   }
  
//   return Object.keys(obj).reduce((acc, key) => {
//     const newKey = converter(key);
//     acc[newKey] = convertObjectKeys(obj[key], converter);
//     return acc;
//   }, {});
// };

// const UserManagementPage = () => {
  
//   // State variables
//   const [users, setUsers] = useState([]);
//   const [newUser, setNewUser] = useState({
//     employeeName: '',
//     username: '',
//     password: '',
//     confirmPassword: '',
//     nationality: '',
//     passportIqama: '',
//     address: '',
//     phone: '',
//     licenseNo: '',
//   });
  
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isAdding, setIsAdding] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [passwordMatchError, setPasswordMatchError] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const nationalities = [
//     'USA', 'Canada', 'UK', 'Australia', 'Germany', 
//     'France', 'Japan', 'India', 'Brazil', 'South Africa'
//   ];

//   const getAuthHeaders = () => {
//     const token = localStorage.getItem('authToken');
    
//     if (!token) {
//       // Token is missing, handle it by logging out the user or redirecting to the login page.
//       alert('Authentication required. Redirecting to login...');
//       window.location.href = '/login';  // Or any other route for login
//       throw new Error('Authentication token missing');
//     }
  
//     return { 'Authorization': `Bearer ${token}` };
//   };

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await axios.get('http://localhost:5000/api/users/', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
  
//       // Assuming 'response.data' is an array of users.
//       // Convert snake_case to camelCase (if needed)
//       const camelCaseUsers = convertObjectKeys(response.data, toCamelCase);
  
//       // Optionally, you can filter out passwords here if you don't want them in the response.
//       const usersWithoutPasswords = camelCaseUsers.map(user => {
//         const { password, ...userWithoutPassword } = user; // Remove password from the user object
//         return userWithoutPassword;
//       });
  
//       setUsers(usersWithoutPasswords);  // Set the users list without passwords
//     } catch (err) {
//       if (err.response && err.response.status === 401) {
//         // Handle 401 Unauthorized
//         alert('Session expired or invalid token. Please log in again.');
//         window.location.href = '/login';  // Redirect to login
//       } else {
//         setError('Error fetching users: ' + err.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Handle add/update user
//   const handleAddUser = async () => {
//     // Basic validation
//     if (!newUser.employeeName.trim() || !newUser.username.trim() || !newUser.password) {
//       setError("Please fill out all required fields.");
//       return;
//     }
  
//     if (newUser.password !== newUser.confirmPassword) {
//       setPasswordMatchError(true);
//       return;
//     }
  
//     setPasswordMatchError(false);
  
//     try {
//       setLoading(true);
  
//       // Create the user payload matching the backend's expected field names
//       const userPayload = {
//         employee_name: newUser.employeeName || null,
//         username: newUser.username || null,
//         email: newUser.email || null,
//         password: newUser.password || null,
//         nationality: newUser.nationality || null,
//         passport_no: newUser.passportIqama || null,
//         address: newUser.address || null,
//         phone_no: newUser.phone || null,
//         license_no: newUser.licenseNo || null,
//         is_admin: newUser.isAdmin ?? 0,
//         is_protected: newUser.isProtected ?? 0,
//       };
  
//       console.log("Payload to send:", userPayload);
  
//       // Make the API call to either add or update the user
//       let res;
//       if (editingId !== null) {
//         // Update user
//         res = await axios.put(`http://localhost:5000/api/users/${editingId}`, userPayload, {
//           headers: getAuthHeaders(),
//         });
//       } else {
//         // Add new user
//         res = await axios.post('http://localhost:5000/api/users/', userPayload, {
//           headers: getAuthHeaders(),
//         });
//       }
  
//       // If the request is successful (200 or 201), reset form and refresh users
//       if (res.status === 200 || res.status === 201) {
//         setNewUser({
//           employeeName: '',
//           username: '',
//           email: '',
//           password: '',
//           confirmPassword: '',
//           nationality: '',
//           passportIqama: '',
//           address: '',
//           phone: '',
//           licenseNo: '',
//           isAdmin: 0,
//           isProtected: 0,
//         });
  
//         setIsAdding(false);
//         setEditingId(null);
//         fetchUsers();  // Refresh the user list
//       } else {
//         setError('Failed to save user. Please try again.');
//       }
  
//     } catch (err) {
//       // Handle token expiration (401 error)
//       if (err.response && err.response.status === 401) {
//         alert('Session expired or invalid token. Please log in again.');
//         window.location.href = '/login';  // Redirect to login page
//       } else {
//         setError('Error saving user: ' + (err.response ? err.response.data.message : err.message));
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   // Handle edit user
//   const handleEdit = (user) => {
//     setNewUser({
//       employeeName: user.employeeName,
//       username: user.username,
//       password: '',  // Leave password empty for security
//       confirmPassword: '',  // Leave confirmPassword empty for security
//       nationality: user.nationality,
//       passportIqama: user.passportIqama,
//       address: user.address,
//       phone: user.phone,
//       licenseNo: user.licenseNo,
//     });
  
//     setEditingId(user.id);  // Set the ID of the user being edited
//     setIsAdding(true);  // Set the form to "adding" state, though it's really "editing"
//   };
  

//   // Handle delete user
//   const handleDelete = async (id) => {
//     try {
//       setLoading(true);
      
//       // Get the auth token from localStorage or another secure source
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         setError('No authentication token found.');
//         return;
//       }
  
//       // Perform the DELETE request with the Authorization header
//       await axios.delete(`http://localhost:5000/api/users/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
  
//       // Refresh the user list after successful deletion
//       fetchUsers();
//     } catch (err) {
//       setError('Error deleting user: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Password visibility toggles
//   const togglePasswordVisibility = () => setShowPassword(!showPassword);
//   const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading users...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//               <User className="w-8 h-8 mr-3 text-indigo-600" />
//               USER MANAGEMENT
//             </h1>
//             <p className="text-gray-600 mt-2">Manage system users and their permissions</p>
//           </div>
          
//           <div className="mt-4 md:mt-0">
//             <button
//               onClick={() => setIsAdding(!isAdding)}
//               className={`px-5 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
//                 ${isAdding 
//                   ? 'bg-red-600 hover:bg-red-700' 
//                   : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}
//               `}
//             >
//               {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
//               {isAdding ? 'Close' : 'Add User'}
//             </button>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
//             <span className="block sm:inline">{error}</span>
//             <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
//               <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
//                 <title>Close</title>
//                 <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
//               </svg>
//             </span>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
//           {/* Add User Form */}
//           {(isAdding || editingId !== null) && (
//             <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//               <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
//                 <h2 className="text-xl font-bold text-white flex items-center">
//                   <Plus className="w-5 h-5 mr-2" />
//                   {editingId ? 'Edit User Details' : 'Add New User'}
//                 </h2>
//               </div>
              
//               <div className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Employee Name <span className="text-red-500">*</span>
//                       </label>
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <User className="w-5 h-5 text-gray-400" />
//                         </div>
//                         <input
//                           type="text"
//                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                           placeholder="Enter full name"
//                           value={newUser.employeeName}
//                           onChange={(e) => setNewUser({...newUser, employeeName: e.target.value})}
//                         />
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         User Name <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                         placeholder="Enter username"
//                         value={newUser.username}
//                         onChange={(e) => setNewUser({...newUser, username: e.target.value})}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Email <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="email"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                         placeholder="Enter email"
//                         value={newUser.email}
//                         onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Password <span className="text-red-500">*</span>
//                       </label>
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <Lock className="w-5 h-5 text-gray-400" />
//                         </div>
//                         <input
//                           type={showPassword ? "text" : "password"}
//                           className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                           placeholder="Enter password"
//                           value={newUser.password}
//                           onChange={(e) => setNewUser({...newUser, password: e.target.value})}
//                         />
//                         <button 
//                           onClick={togglePasswordVisibility}
//                           className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                         >
//                           {showPassword ? 
//                             <EyeOff className="w-5 h-5 text-gray-400" /> : 
//                             <Eye className="w-5 h-5 text-gray-400" />
//                           }
//                         </button>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Confirm Password <span className="text-red-500">*</span>
//                       </label>
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <Lock className="w-5 h-5 text-gray-400" />
//                         </div>
//                         <input
//                           type={showConfirmPassword ? "text" : "password"}
//                           className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
//                             passwordMatchError ? 'border-red-500' : 'border-gray-300'
//                           }`}
//                           placeholder="Confirm password"
//                           value={newUser.confirmPassword}
//                           onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
//                         />
//                         <button 
//                           onClick={toggleConfirmPasswordVisibility}
//                           className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                         >
//                           {showConfirmPassword ? 
//                             <EyeOff className="w-5 h-5 text-gray-400" /> : 
//                             <Eye className="w-5 h-5 text-gray-400" />
//                           }
//                         </button>
//                       </div>
//                       {passwordMatchError && (
//                         <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Nationality
//                       </label>
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <Globe className="w-5 h-5 text-gray-400" />
//                         </div>
//                         <select
//                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
//                           value={newUser.nationality}
//                           onChange={(e) => setNewUser({...newUser, nationality: e.target.value})}
//                         >
//                           <option value="">Select nationality</option>
//                           {nationalities.map(nat => (
//                             <option key={nat} value={nat}>{nat}</option>
//                           ))}
//                         </select>
//                         <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                           <ChevronDown className="w-4 h-4 text-gray-400" />
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Passport No. / Iqama
//                       </label>
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <CreditCard className="w-5 h-5 text-gray-400" />
//                         </div>
//                         <input
//                           type="text"
//                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                           placeholder="Enter ID number"
//                           value={newUser.passportIqama}
//                           onChange={(e) => setNewUser({...newUser, passportIqama: e.target.value})}
//                         />
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Address
//                       </label>
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 pt-2.5 flex items-start pointer-events-none">
//                           <Home className="w-5 h-5 text-gray-400" />
//                         </div>
//                         <textarea
//                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                           placeholder="Enter full address"
//                           rows="2"
//                           value={newUser.address}
//                           onChange={(e) => setNewUser({...newUser, address: e.target.value})}
//                         ></textarea>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Phone No.
//                       </label>
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <Phone className="w-5 h-5 text-gray-400" />
//                         </div>
//                         <input
//                           type="text"
//                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                           placeholder="Enter phone number"
//                           value={newUser.phone}
//                           onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
//                         />
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         License No.
//                       </label>
//                       <input
//                         type="text"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                         placeholder="Enter license number"
//                         value={newUser.licenseNo}
//                         onChange={(e) => setNewUser({...newUser, licenseNo: e.target.value})}
//                       />
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex space-x-3 pt-6">
//                   <button
//                     onClick={handleAddUser}
//                     className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1 shadow-md"
//                   >
//                     {editingId ? 'Update User' : 'Save User'}
//                   </button>
                  
//                   <button
//                     onClick={() => {
//                       setIsAdding(false);
//                       setEditingId(null);
//                       setNewUser({
//                         employeeName: '',
//                         username: '',
//                         password: '',
//                         confirmPassword: '',
//                         nationality: '',
//                         passportIqama: '',
//                         address: '',
//                         phone: '',
//                         licenseNo: '',
//                       });
//                       setPasswordMatchError(false);
//                     }}
//                     className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors flex-1"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Users Table */}
//         <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//             <h3 className="text-lg font-semibold text-gray-800">System Users</h3>
//             <div className="text-sm text-gray-500">
//               Showing all {users.length} users
//             </div>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Employee Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     User Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Nationality
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Phone No.
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {users.length > 0 ? (
//                   users.map((user) => (
//                     <tr key={user.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mr-3">
//                             <User className="w-4 h-4 text-white" />
//                           </div>
//                           <div>
//                             <div className="text-sm font-medium text-gray-900">{user.employeeName}</div>
//                             <div className="text-xs text-gray-500">{user.licenseNo}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-gray-900">{user.username}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900">{user.nationality}</div>
//                         <div className="text-xs text-gray-500">{user.passportIqama}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900">{user.phone}</div>
//                         <div className="text-xs text-gray-500">{user.address && user.address.substring(0, 20)}...</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button 
//                           onClick={() => handleEdit(user)}
//                           className="text-indigo-600 hover:text-indigo-900 mr-4"
//                         >
//                           <Pencil className="w-5 h-5" />
//                         </button>
//                         <button 
//                           onClick={() => handleDelete(user.id)}
//                           className="text-red-600 hover:text-red-900"
//                         >
//                           <Trash2 className="w-5 h-5" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <User className="w-16 h-16 text-gray-300 mb-4" />
//                         <h4 className="text-lg font-medium text-gray-500">No users found</h4>
//                         <p className="text-gray-400 mt-1">Add a new user to get started</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserManagementPage;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Plus, Pencil, Trash2, Eye, EyeOff, ChevronDown, 
  Lock, Phone, Home, CreditCard, Globe, X, ChevronLeft, ChevronRight
} from 'lucide-react';

// Helper functions for case conversion
const toCamelCase = (str) => {
  return str.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
};

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

const PAGE_SIZE = 10;

const UserManagementPage = () => {
  // State variables
  const [users, setUsers] = useState([]);
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentTab, setCurrentTab] = useState(0); // 0: first page, 1: second page, etc.
  const totalTabs = Math.ceil(users.length / PAGE_SIZE);

  const nationalities = [
    'USA', 'Canada', 'UK', 'Australia', 'Germany', 
    'France', 'Japan', 'India', 'Brazil', 'South Africa'
  ];

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Authentication required. Redirecting to login...');
      window.location.href = '/login';
      throw new Error('Authentication token missing');
    }
    return { 'Authorization': `Bearer ${token}` };
  };

  // const fetchUsers = async () => {
  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem('authToken');
  //     const response = await axios.get('http://localhost:5000/api/users/', {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     const camelCaseUsers = convertObjectKeys(response.data, toCamelCase);
  //     setUsers(camelCaseUsers);
  //     const usersWithoutPasswords = camelCaseUsers.map(user => {
  //       const { password, ...userWithoutPassword } = user;
  //       return userWithoutPassword;
  //     });
  //     setUsers(usersWithoutPasswords);
  //   } catch (err) {
  //     if (err.response && err.response.status === 401) {
  //       alert('Session expired or invalid token. Please log in again.');
  //       window.location.href = '/login';
  //     } else {
  //       setError('Error fetching users: ' + err.message);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('No authToken found. Please login first.');
        return;
      }
  
      // Fetch users using the token
      const response = await axios.get('http://localhost:5000/api/users/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const camelCaseUsers = convertObjectKeys(response.data, toCamelCase);
  
      // Validate that all users have a password
      const filteredUsers = camelCaseUsers.filter(user => user.password !== '');
  
      // Ensure no valid users were removed by checking lengths
      if (filteredUsers.length !== camelCaseUsers.length) {
        setError('Some users do not have a password set.');
        return;
      }
  
      setUsers(filteredUsers);
    } catch (err) {
      // Handle different error scenarios with detailed messages
      if (err.response && err.response.status === 401) {
        alert('Session expired or invalid token. Please log in again.');
        window.location.href = '/login';
      } else if (err.response) {
        const message = 'Error fetching users: ' + (err.response?.message || '');
        setError(message);
        console.error('Error:', err);
      }
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle add/update user
  const handleAddUser = async () => {
    if (!newUser.employeeName.trim() || !newUser.username.trim() || !newUser.password) {
      setError("Please fill out all required fields.");
      return;
    }
    if (newUser.password !== newUser.confirmPassword) {
      setPasswordMatchError(true);
      return;
    }
    setPasswordMatchError(false);
    try {
      setLoading(true);
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
      } else {
        res = await axios.post('http://localhost:5000/api/users/', userPayload, {
          headers: getAuthHeaders(),
        });
      }
      if (res.status === 200 || res.status === 201) {
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
        setIsAdding(false);
        setEditingId(null);
        fetchUsers();
      } else {
        setError('Failed to save user. Please try again.');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert('Session expired or invalid token. Please log in again.');
        window.location.href = '/login';
      } else {
        setError('Error saving user: ' + (err.response ? err.response.data.message : err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle edit user
  // const handleEdit = (user) => {
  //   setNewUser({
  //     employeeName: user.employeeName,
  //     username: user.username,
  //     email: user.email,
  //     password: '',
  //     confirmPassword: '',
  //     nationality: user.nationality,
  //     passportIqama: user.passportIqama,
  //     address: user.address,
  //     phone: user.phone,
  //     licenseNo: user.licenseNo,
  //     isAdmin: user.isAdmin ?? 0,
  //     isProtected: user.isProtected ?? 0,
  //   });
  //   setEditingId(user.id);
  //   setIsAdding(true);
  // };

  const handleEdit = (user) => {
    try {
      setNewUser({
        employeeName: user.employeeName || "",
        username: user.username || "",
        email: user.email || "",
        password: user.password || "",
        nationality: user.nationality || "",
        passportIqama: user.passportIqama || "",
        address: user.address || "",
        phone: user.phone || "",
        licenseNo: user.licenseNo || "",
        isAdmin: user.isAdmin ?? 0,
        isProtected: user.isProtected ?? 0,
      });
      setEditingId(user.id);
      setIsAdding(true);
    } catch (error) {
      console.error('Error during edit:', error.message);
      // Handle the error as needed
    }
  };
  // Handle delete user
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found.');
        return;
      }
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (err) {
      setError('Error deleting user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Password visibility toggles
  const togglePasswordVisibility = (e) => { e.preventDefault(); setShowPassword(!showPassword); };
  const toggleConfirmPasswordVisibility = (e) => { e.preventDefault(); setShowConfirmPassword(!showConfirmPassword); };

  // Pagination logic
  const pagedUsers = users.slice(currentTab * PAGE_SIZE, (currentTab + 1) * PAGE_SIZE);

  // Reset to first tab when users change (e.g. after add/delete)
  useEffect(() => {
    if (currentTab > 0 && currentTab >= totalTabs) setCurrentTab(0);
  }, [users, totalTabs, currentTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

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
              onClick={() => {
                setIsAdding(!isAdding);
                setEditingId(null);
                setPasswordMatchError(false);
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
              }}
              className={`px-5 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}
              `}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Close' : 'Add User'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </span>
          </div>
        )}

        {/* Add User Form */}
        {(isAdding || editingId !== null) && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                {editingId ? 'Edit User Details' : 'Add New User'}
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  {/* Employee Name */}
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
                  {/* Username */}
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
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </div>
                  {/* Password */}
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
                        tabIndex={-1}
                        type="button"
                      >
                        {showPassword ? 
                          <EyeOff className="w-5 h-5 text-gray-400" /> : 
                          <Eye className="w-5 h-5 text-gray-400" />
                        }
                      </button>
                    </div>
                  </div>
                  {/* Confirm Password */}
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
                        tabIndex={-1}
                        type="button"
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
                  {/* Nationality */}
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
                  {/* Passport No / Iqama */}
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
                  {/* Address */}
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
                  {/* Phone */}
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
                  {/* License No. */}
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
                    setPasswordMatchError(false);
                  }}
                  className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors flex-1"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs for users */}
        {users.length > PAGE_SIZE && (
          <div className="flex items-center space-x-2 mb-2">
            {[...Array(totalTabs)].map((_, idx) => (
              <button
                key={idx}
                className={`px-4 py-1 rounded-full border font-semibold text-xs 
                  ${idx === currentTab ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-gray-200'}
                `}
                onClick={() => setCurrentTab(idx)}
              >
                {idx + 1}
              </button>
            ))}
            <span className="text-gray-500 text-xs ml-2">({users.length} users)</span>
          </div>
        )}

        {/* Users Table */}
        <div className="mt-4 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">System Users</h3>
            <div className="text-sm text-gray-500">
              Showing {users.length === 0 ? 0 : currentTab*PAGE_SIZE+1}
              {" "}to{" "}
              {Math.min((currentTab+1)*PAGE_SIZE, users.length)} of {users.length} users
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
                {pagedUsers.length > 0 ? (
                  pagedUsers.map((user) => (
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
                        <div className="text-xs text-gray-500">{user.address && user.address.substring(0, 20)}...</div>
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
          {/* Table Pagination - arrows */}
          {users.length > PAGE_SIZE && (
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setCurrentTab((tab) => Math.max(tab - 1, 0))}
                disabled={currentTab === 0}
                className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {[...Array(totalTabs)].map((_, idx) => (
                  <button
                    key={idx}
                    className={`px-3 py-1 rounded-full border font-semibold text-xs 
                      ${idx === currentTab ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-gray-200'}
                    `}
                    onClick={() => setCurrentTab(idx)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentTab((tab) => Math.min(tab + 1, totalTabs - 1))}
                disabled={currentTab === totalTabs - 1}
                className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;