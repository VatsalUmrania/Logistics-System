import React, { useState, useEffect } from 'react';
import { 
  Landmark, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert, Building2
} from 'lucide-react';
import Select from 'react-select';

const API_URL = 'http://localhost:5000/api/banks';

const BankInformationPage = () => {
  // State management
  const [banks, setBanks] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('bankName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [newBank, setNewBank] = useState({
    bankName: '',
    branchNo: '',
    accountName: '',
    accountNo: '',
    iban: '',
    address: '',
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

  // Convert API snake_case object to camelCase
  const toCamelCase = (obj) => ({
    id: obj.id,
    bankName: obj.name,
    branchNo: obj.branch_no,
    accountName: obj.account_name,
    accountNo: obj.account_no,
    iban: obj.iban,
    address: obj.address,
    createdAt: obj.created_at,
  });

  // Convert camelCase to snake_case for API
  const formatToSnakeCase = (bank) => ({
    name: bank.bankName,
    branch_no: bank.branchNo,
    account_name: bank.accountName,
    account_no: bank.accountNo,
    iban: bank.iban,
    address: bank.address,
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication token missing');
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch banks from backend
  const fetchBanks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_URL, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`Failed to fetch banks: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setBanks(data.map(toCamelCase));
      setError('');
    } catch (err) {
      setError('Failed to load banks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  // Reset form
  const resetForm = () => {
    setNewBank({
      bankName: '',
      branchNo: '',
      accountName: '',
      accountNo: '',
      iban: '',
      address: '',
    });
    setEditingId(null);
    setIsAdding(false);
    setError('');
    setSuccessMessage('');
  };

  // Add or update bank handler
  const handleAddBank = async () => {
    if (!newBank.bankName.trim() || !newBank.accountNo.trim()) {
      setError('Bank name and account number are required');
      return;
    }

    try {
      const headers = getAuthHeaders();
      let res;

      if (editingId !== null) {
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(formatToSnakeCase(newBank)),
        });
        if (!res.ok) throw new Error('Failed to update bank');
        setSuccessMessage('Bank updated successfully!');
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify(formatToSnakeCase(newBank)),
        });
        if (!res.ok) throw new Error('Failed to add bank');
        setSuccessMessage('Bank added successfully!');
      }

      await fetchBanks();
      resetForm();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save bank');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Delete bank handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bank?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete bank');
      
      await fetchBanks();
      setSuccessMessage('Bank deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete bank');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Edit bank handler
  const handleEdit = (bank) => {
    setNewBank({
      bankName: bank.bankName,
      branchNo: bank.branchNo,
      accountName: bank.accountName,
      accountNo: bank.accountNo,
      iban: bank.iban,
      address: bank.address,
    });
    setEditingId(bank.id);
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

  // Sorted & filtered banks for display
  const sortedBanks = [...banks].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredBanks = sortedBanks.filter(bank =>
    bank.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.accountNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (bank.address || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBanks = filteredBanks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBanks.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, banks]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading bank information...</p>
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
              <Landmark className="w-8 h-8 mr-3 text-indigo-600" />
              Bank Information Management
            </h1>
            <p className="text-gray-600 mt-2">Manage bank details for your logistics operations</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
        
            <button
              type="button"
              onClick={() => {
                console.log('Add Bank button clicked, current isAdding:', isAdding); // Debug log
                setIsAdding(!isAdding);
                setEditingId(null);
                setNewBank({
                  bankName: '',
                  branchNo: '',
                  accountName: '',
                  accountNo: '',
                  iban: '',
                  address: '',
                });
              }}
              className={`px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Cancel' : 'Add Bank'}
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
              SEARCH BANKS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Bank Name, Account Number, or Address
                </label>
                <input
                  type="text"
                  placeholder="Search banks..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Bank Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                {editingId ? 'Edit Bank' : 'Add New Bank'}
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter bank name"
                      value={newBank.bankName}
                      onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter branch number"
                      value={newBank.branchNo}
                      onChange={(e) => setNewBank({ ...newBank, branchNo: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter account name"
                      value={newBank.accountName}
                      onChange={(e) => setNewBank({ ...newBank, accountName: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter account number"
                      value={newBank.accountNo}
                      onChange={(e) => setNewBank({ ...newBank, accountNo: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IBAN
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter IBAN"
                      value={newBank.iban}
                      onChange={(e) => setNewBank({ ...newBank, iban: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                      placeholder="Enter address"
                      rows="3"
                      value={newBank.address}
                      onChange={(e) => setNewBank({ ...newBank, address: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAddBank}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm"
                >
                  {editingId ? 'Update Bank' : 'Add Bank'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bank Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Bank Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">{filteredBanks.length} banks</span>
            </div>
          </div>
        </div>

        {/* Banks Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'Bank Name', key: 'bankName' },
                    { label: 'Branch No', key: 'branchNo' },
                    { label: 'Account Name', key: 'accountName' },
                    { label: 'Account No', key: 'accountNo' },
                    { label: 'IBAN', key: 'iban' },
                    { label: 'Address', key: 'address' },
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
                {currentBanks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                      No bank records found
                    </td>
                  </tr>
                ) : (
                  currentBanks.map((bank) => (
                    <tr key={bank.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bank.bankName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {bank.branchNo || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {bank.accountName || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {bank.accountNo}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {bank.iban || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                        {bank.address || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleEdit(bank)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(bank.id)}
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
                {Math.min(indexOfLastItem, filteredBanks.length)} of {filteredBanks.length} banks
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
                Total: <span className="text-green-600 font-bold">{filteredBanks.length} banks</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankInformationPage;
