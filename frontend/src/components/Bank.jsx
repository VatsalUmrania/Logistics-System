import { useState } from 'react';
import { Building2, Landmark, Plus, Pencil, Trash2, ChevronDown, Search, ChevronLeft, ChevronRight,X } from 'lucide-react';

const BankInformationPage = () => {
  const [banks, setBanks] = useState([
    { 
      id: 1, 
      bankName: 'National Commercial Bank', 
      branchNo: 'JED-001', 
      accountName: 'Logistics Operations', 
      accountNo: 'SA0380000000608010203333', 
      iban: 'SA03 8000 0000 6080 1020 3333', 
      address: 'King Abdullah Road, Jeddah, Saudi Arabia' 
    },
    { 
      id: 2, 
      bankName: 'Al Rajhi Bank', 
      branchNo: 'RYD-045', 
      accountName: 'International Shipping', 
      accountNo: 'SA0380000000608010204444', 
      iban: 'SA03 8000 0000 6080 1020 4444', 
      address: 'Olaya Street, Riyadh, Saudi Arabia' 
    },
    { 
      id: 3, 
      bankName: 'Saudi British Bank', 
      branchNo: 'DMM-022', 
      accountName: 'Cargo Fleet Maintenance', 
      accountNo: 'SA0380000000608010205555', 
      iban: 'SA03 8000 0000 6080 1020 5555', 
      address: 'Prince Mohammed Street, Dammam, Saudi Arabia' 
    },
  ]);
  
  const [newBank, setNewBank] = useState({
    bankName: '',
    branchNo: '',
    accountName: '',
    accountNo: '',
    iban: '',
    address: '',
  });
  
  const [isAdding, setIsAdding] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('bankName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleAddBank = () => {
    if (!newBank.bankName.trim() || !newBank.accountNo.trim()) return;
    
    if (editingId !== null) {
      // Update existing bank
      setBanks(banks.map(b => 
        b.id === editingId ? { ...b, ...newBank } : b
      ));
      setEditingId(null);
    } else {
      // Add new bank
      const newBankWithId = {
        ...newBank,
        id: banks.length + 1,
      };
      setBanks([...banks, newBankWithId]);
    }
    
    setNewBank({
      bankName: '',
      branchNo: '',
      accountName: '',
      accountNo: '',
      iban: '',
      address: '',
    });
  };

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

  const handleDelete = (id) => {
    setBanks(banks.filter(b => b.id !== id));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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
              {isAdding ? 'Close' : 'Add Bank'}
            </button>
          </div>
        </div>

        {/* Add Bank Form */}
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
                      Account Name <span className="text-red-500">*</span>
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
                      IBAN Code
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter IBAN code"
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
                      placeholder="Enter bank address"
                      rows="2"
                      value={newBank.address}
                      onChange={(e) => setNewBank({...newBank, address: e.target.value})}
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-6">
                <button
                  onClick={handleAddBank}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1 shadow-md"
                >
                  {editingId ? 'Update Bank' : 'Save Bank Details'}
                </button>
                
                <button
                  onClick={() => {
                    setIsAdding(false);
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
                />
              </div>
            </div>
          </div>
        )}

        {/* Bank List Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">BANK LIST</h3>
            <div className="text-sm text-gray-500">
              Showing {Math.min(filteredBanks.length, itemsPerPage)} of {filteredBanks.length} banks
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S1.No.
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('bankName')}
                  >
                    <div className="flex items-center">
                      Bank Name
                      {sortField === 'bankName' && (
                        sortDirection === 'asc' ? 
                        <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentBanks.length > 0 ? (
                  currentBanks.map((bank, index) => (
                    <tr key={bank.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{bank.bankName}</div>
                            <div className="text-xs text-gray-500">Branch: {bank.branchNo}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{bank.address}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {bank.accountName} • {bank.accountNo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEdit(bank)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(bank.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Landmark className="w-16 h-16 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-500">No banks found</h4>
                        <p className="text-gray-400 mt-1">Add a new bank to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredBanks.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
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

export default BankInformationPage;