import React, { useState } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Pencil, 
  Trash2, 
  ChevronDown, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  X 
} from 'lucide-react';

const AssignExpenses = () => {
  const [searchForm, setSearchForm] = useState({
    operationNo: '',
    clientName: ''
  });

  const [expenseForm, setExpenseForm] = useState({
    item: '',
    actualAmount: '',
    vatPercentage: 0,
    vatAmount: 0,
    amount: '',
    dateOfPayment: ''
  });

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      item: 'Container Claims (مطالبة الحويات)',
      actualAmount: 90.85,
      vatPercentage: 0,
      vatAmount: 0.00,
      amount: 90.85,
      dateOfPayment: '2025-02-05'
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('item');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const expenseItems = [
    'Container Claims (مطالبة الحويات)',
    'Transportation Costs',
    'Storage Fees',
    'Handling Charges',
    'Documentation Fees',
    'Customs Clearance',
    'Port Charges',
    'Insurance Premium',
    'Demurrage Charges',
    'Other Expenses'
  ];

  const handleSearchChange = (field, value) => {
    setSearchForm(prev => ({ ...prev, [field]: value }));
  };

  const handleExpenseChange = (field, value) => {
    setExpenseForm(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'actualAmount' || field === 'vatPercentage') {
        const actualAmount = parseFloat(updated.actualAmount) || 0;
        const vatPercentage = parseFloat(updated.vatPercentage) || 0;
        const vatAmount = (actualAmount * vatPercentage) / 100;
        
        updated.vatAmount = vatAmount;
        updated.amount = (actualAmount + vatAmount).toFixed(2);
      }
      
      return updated;
    });
  };

  const addExpense = () => {
    if (!expenseForm.item || !expenseForm.actualAmount) {
      alert('Please select an expense item and enter the actual amount.');
      return;
    }

    const newExpense = {
      id: Date.now(),
      item: expenseForm.item,
      actualAmount: parseFloat(expenseForm.actualAmount),
      vatPercentage: parseFloat(expenseForm.vatPercentage) || 0,
      vatAmount: parseFloat(expenseForm.vatAmount) || 0,
      amount: parseFloat(expenseForm.amount) || parseFloat(expenseForm.actualAmount),
      dateOfPayment: expenseForm.dateOfPayment
    };

    setExpenses(prev => [...prev, newExpense]);
    
    setExpenseForm({
      item: '',
      actualAmount: '',
      vatPercentage: 0,
      vatAmount: 0,
      amount: '',
      dateOfPayment: ''
    });
    
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (expense) => {
    setExpenseForm({
      item: expense.item,
      actualAmount: expense.actualAmount.toString(),
      vatPercentage: expense.vatPercentage,
      vatAmount: expense.vatAmount,
      amount: expense.amount.toString(),
      dateOfPayment: expense.dateOfPayment
    });
    setEditingId(expense.id);
    setIsAdding(true);
  };

  const removeExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const getTotalAmount = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2);
  };

  const handleSearch = () => {
    console.log('Searching with:', searchForm);
  };

  // Sorting logic
  const sortedExpenses = [...expenses].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExpenses = sortedExpenses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <ClipboardList className="w-8 h-8 mr-3 text-indigo-600" />
              ASSIGN EXPENSES
            </h1>
            <p className="text-gray-600 mt-2">Manage expense assignments for your logistics operations</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => {
                setIsAdding(!isAdding);
                setEditingId(null);
                setExpenseForm({
                  item: '',
                  actualAmount: '',
                  vatPercentage: 0,
                  vatAmount: 0,
                  amount: '',
                  dateOfPayment: ''
                });
              }}
              className={`px-5 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAdding 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}`}
            >
              {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAdding ? 'Close' : 'Add Expense'}
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH OPERATIONS
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operation No <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter Operation No"
                    value={searchForm.operationNo}
                    onChange={(e) => handleSearchChange('operationNo', e.target.value)}
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button 
                    onClick={handleSearch} 
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                  >
                    <Search className="w-5 h-5 text-indigo-600" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Client name"
                    value={searchForm.clientName}
                    onChange={(e) => handleSearchChange('clientName', e.target.value)}
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button 
                    onClick={handleSearch} 
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                  >
                    <Search className="w-5 h-5 text-indigo-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Expense Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <ClipboardList className="w-5 h-5 mr-2" />
                {editingId ? 'Edit Expense Details' : 'Add Expense Details'}
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expense Item <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={expenseForm.item}
                      onChange={(e) => handleExpenseChange('item', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select Expense Item</option>
                      {expenseItems.map((item, index) => (
                        <option key={index} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actual Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={expenseForm.actualAmount}
                      onChange={(e) => handleExpenseChange('actualAmount', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      VAT(%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={expenseForm.vatPercentage}
                      onChange={(e) => handleExpenseChange('vatPercentage', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      VAT Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={expenseForm.vatAmount.toFixed(2)}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={expenseForm.amount}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Payment
                    </label>
                    <input
                      type="date"
                      value={expenseForm.dateOfPayment}
                      onChange={(e) => handleExpenseChange('dateOfPayment', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={addExpense}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
                >
                  {editingId ? 'Update Expense' : 'Add Expense'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Expenses Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-indigo-600 text-white text-sm font-semibold">
              <tr>
                {[
                  { label: 'Expense Item', key: 'item' },
                  { label: 'Actual Amount', key: 'actualAmount' },
                  { label: 'VAT(%)', key: 'vatPercentage' },
                  { label: 'VAT Amount', key: 'vatAmount' },
                  { label: 'Amount', key: 'amount' },
                  { label: 'Date of Payment', key: 'dateOfPayment' },
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
              {currentExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                currentExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{expense.item}</td>
                    <td className="px-4 py-3">{expense.actualAmount.toFixed(2)}</td>
                    <td className="px-4 py-3">{expense.vatPercentage}</td>
                    <td className="px-4 py-3">{expense.vatAmount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-green-600 font-medium">{expense.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">{expense.dateOfPayment || '-'}</td>
                    <td className="px-4 py-3 flex space-x-3">
                      <button
                        onClick={() => handleEdit(expense)}
                        title="Edit"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => removeExpense(expense.id)}
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

          {/* Pagination and Total */}
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to{' '}
              {Math.min(indexOfLastItem, sortedExpenses.length)} of {sortedExpenses.length} results
            </div>
            <div className="flex items-center">
              <div className="mr-4 text-sm font-medium text-gray-700">
                Total: <span className="text-green-600 font-bold">${getTotalAmount()}</span>
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
    </div>
  );
};

export default AssignExpenses;