
import { useState, useEffect } from 'react';
import { Building2, Landmark, Plus, Pencil, Trash2, ChevronDown, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/banks';

const BankInformationPage = () => {
  const [banks, setBanks] = useState([]);
  
  const [newBank, setNewBank] = useState({
    bankName: '',
    branchNo: '',
    accountName: '',
    accountNo: '',
    iban: '',
    address: '',
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('bankName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    return { 'Authorization': `Bearer ${token}` };
  };
  
  // Fetch banks from backend
  const fetchBanks = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: getAuthHeaders()
      });
  
      if (!res.ok) {
        throw new Error(`Failed to fetch banks: ${res.status} ${res.statusText}`);
      }
  
      const data = await res.json();
      setBanks(data.map(toCamelCase));
    } catch (err) {
      console.error('Failed to fetch banks:', err);
      setError('Failed to load banks');
    }
  };
  

  useEffect(() => {
    fetchBanks();
  }, []);

  // Add or update bank handler
  const handleAddBank = async () => {
    if (!newBank.bankName.trim() || !newBank.accountNo.trim()) return;
  
    try {
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      };
  
      let res;
      if (editingId !== null) {
        // Update existing bank
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(formatToSnakeCase(newBank)),
        });
  
        if (!res.ok) throw new Error('Failed to update bank');
      } else {
        // Add new bank
        res = await fetch(API_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify(formatToSnakeCase(newBank)),
        });
  
        if (!res.ok) throw new Error('Failed to add bank');
      }
  
      await fetchBanks();
  
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
    } catch (err) {
      console.error(err);
      alert(err.message);
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
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete bank: ${errorText}`);
      }
  
      await fetchBanks();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete bank');
    }
  };
  

  // Edit bank handler (populate form)
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
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sorted & filtered banks for display
  const sortedBanks = [...banks].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredBanks = sortedBanks.filter(bank => 
    bank.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.accountNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBanks = filteredBanks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBanks.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Landmark className="w-8 h-8 mr-3 text-indigo-600" />
              BANK INFORMATION
            </h1>
            <p className="text-gray-600 mt-2">Manage bank details for your logistics operations</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search banks..."
                  className="bg-transparent outline-none w-40"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>
            <button
              onClick={() => {
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
              className={`px-5 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}`}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Close' : 'Add Bank'}
            </button>
          </div>
        </div>

        {/* Add/Edit Bank Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                {editingId ? 'Edit Bank Details' : 'Add Bank Details'}
              </h2>
            </div>
            
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Landmark className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter bank name"
                        value={newBank.bankName}
                        onChange={(e) => setNewBank({...newBank, bankName: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch No
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter branch number"
                      value={newBank.branchNo}
                      onChange={(e) => setNewBank({...newBank, branchNo: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter account name"
                      value={newBank.accountName}
                      onChange={(e) => setNewBank({...newBank, accountName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter account number"
                      value={newBank.accountNo}
                      onChange={(e) => setNewBank({...newBank, accountNo: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IBAN
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter IBAN"
                      value={newBank.iban}
                      onChange={(e) => setNewBank({...newBank, iban: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter address"
                      rows={3}
                      value={newBank.address}
                      onChange={(e) => setNewBank({...newBank, address: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleAddBank}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
                >
                  {editingId ? 'Update Bank' : 'Add Bank'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Banks Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-indigo-600 text-white text-sm font-semibold">
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
                    className={`px-4 py-3 text-left cursor-pointer select-none ${
                      key && 'hover:bg-indigo-700'
                    }`}
                    onClick={() => key && handleSort(key)}
                  >
                    <div className="flex items-center">
                      {label}
                      {key && sortField === key && (
                        <ChevronDown
                          className={`w-4 h-4 ml-1 transition-transform ${
                            sortDirection === 'asc' ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {currentBanks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No bank records found.
                  </td>
                </tr>
              ) : (
                currentBanks.map((bank) => (
                  <tr
                    key={bank.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{bank.bankName}</td>
                    <td className="px-4 py-3">{bank.branchNo}</td>
                    <td className="px-4 py-3">{bank.accountName}</td>
                    <td className="px-4 py-3">{bank.accountNo}</td>
                    <td className="px-4 py-3">{bank.iban}</td>
                    <td className="px-4 py-3">{bank.address}</td>
                    <td className="px-4 py-3 flex space-x-3">
                      <button
                        onClick={() => handleEdit(bank)}
                        title="Edit"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(bank.id)}
                        title="Delete"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to{' '}
              {Math.min(indexOfLastItem, filteredBanks.length)} of {filteredBanks.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
                title="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
                title="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankInformationPage;
