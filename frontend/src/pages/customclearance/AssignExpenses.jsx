import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Plus, Pencil, Trash2, ChevronDown, Search, 
  ChevronLeft, ChevronRight, X, Settings 
} from 'lucide-react';
import Select from 'react-select';

const AssignExpenses = () => {
  // State management
  const [clients, setClients] = useState([]);
  const [operations, setOperations] = useState([]);
  const [expenseItems, setExpenseItems] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [searchForm, setSearchForm] = useState({
    operationNo: '',
    clientName: ''
  });
  const [expenseForm, setExpenseForm] = useState({
    operation_no: '',
    client_name: '',
    expense_item: '',
    actual_amount: '',
    vat_percent: 0,
    vat_amount: 0,
    total_amount: '',
    date_of_payment: ''
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('expense_item');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isManagingItems, setIsManagingItems] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [error, setError] = useState('');
  const itemsPerPage = 5;

  // Authentication helper
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication token missing');
    }
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Fetch all required data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch clients
        const clientsRes = await fetch(
          'http://localhost:5000/api/clients', 
          getAuthHeaders()
        );
        const clientsData = await clientsRes.json();
        setClients(clientsData);

        // Fetch expense items
        const itemsRes = await fetch(
          'http://localhost:5000/api/expense-item', 
          getAuthHeaders()
        );
        const itemsData = await itemsRes.json();
        setExpenseItems(itemsData.map(item => item.name));

        // Fetch expenses
        const expensesRes = await fetch(
          'http://localhost:5000/api/expense', // Added http://
          getAuthHeaders()
        );
        const expensesData = await expensesRes.json();
        setExpenses(expensesData);

        // Fetch job numbers from new endpoint
        try {
          const jobRes = await fetch(
            'http://localhost:5000/api/clearance-operations/job-numbers', 
            getAuthHeaders()
          );
          const jobData = await jobRes.json();
          if (jobData.success) {
            setOperations(jobData.data.map(item => item.job_no));
          }
        } catch (jobError) {
          console.log('Job numbers endpoint not available', jobError);
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Form handlers
  const handleSearchChange = (field, value) => {
    setSearchForm(prev => ({ ...prev, [field]: value }));
  };

  const handleExpenseChange = (field, value) => {
    setExpenseForm(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'actual_amount' || field === 'vat_percent') {
        const actualAmount = parseFloat(updated.actual_amount) || 0;
        const vatPercent = parseFloat(updated.vat_percent) || 0;
        const vatAmount = (actualAmount * vatPercent) / 100;
        
        updated.vat_amount = vatAmount;
        updated.total_amount = (actualAmount + vatAmount).toFixed(2);
      }
      
      return updated;
    });
  };

  // CRUD Operations
  const createExpense = async (expenseData) => {
    try {
      const response = await fetch('http://localhost:5000/api/expense', {
        method: 'POST',
        ...getAuthHeaders(),
        body: JSON.stringify(expenseData)
      });
      return await response.json();
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  const updateExpense = async (id, expenseData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/expense/${id}`, {
        method: 'PUT',
        ...getAuthHeaders(),
        body: JSON.stringify(expenseData)
      });
      return await response.json();
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/expense/${id}`, {
        method: 'DELETE',
        ...getAuthHeaders()
      });
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  // Add/Edit Expense Handler
  const handleAddExpense = async () => {
    if (!expenseForm.expense_item || !expenseForm.actual_amount) {
      alert('Please select an expense item and enter the actual amount.');
      return;
    }

    const expenseData = {
      operation_no: expenseForm.operation_no,
      client_name: expenseForm.client_name,
      expense_item: expenseForm.expense_item,
      actual_amount: parseFloat(expenseForm.actual_amount),
      vat_percent: parseFloat(expenseForm.vat_percent) || 0,
      vat_amount: parseFloat(expenseForm.vat_amount) || 0,
      date_of_payment: expenseForm.date_of_payment
    };

    try {
      let result;
      if (editingId) {
        result = await updateExpense(editingId, expenseData);
      } else {
        result = await createExpense(expenseData);
      }

      if (result) {
        // Refresh expenses
        const expensesRes = await fetch(
          'http://localhost:5000/api/expense', // Added http://
          getAuthHeaders()
        );
        const expensesData = await expensesRes.json();
        setExpenses(expensesData);
        
        // Reset form
        setExpenseForm({
          operation_no: '',
          client_name: '',
          expense_item: '',
          actual_amount: '',
          vat_percent: 0,
          vat_amount: 0,
          total_amount: '',
          date_of_payment: ''
        });
        
        setIsAdding(false);
        setEditingId(null);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Edit Handler
  const handleEdit = (expense) => {
    setExpenseForm({
      operation_no: expense.operation_no,
      client_name: expense.client_name,
      expense_item: expense.expense_item,
      actual_amount: expense.actual_amount.toString(),
      vat_percent: expense.vat_percent,
      vat_amount: expense.vat_amount,
      total_amount: expense.total_amount.toString(),
      date_of_payment: expense.date_of_payment
    });
    setEditingId(expense.id);
    setIsAdding(true);
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const success = await deleteExpense(id);
      if (success) {
        // Refresh expenses
        const expensesRes = await fetch(
          'http://localhost:5000/api/expense', 
          getAuthHeaders()
        );
        const expensesData = await expensesRes.json();
        setExpenses(expensesData);
      }
    }
  };

  // Expense Items Management
  const addExpenseItem = async () => {
    if (newItemName.trim() && !expenseItems.includes(newItemName)) {
      try {
        // Send new item to backend
        await fetch('http://localhost:5000/api/expense-item', {
          method: 'POST',
          ...getAuthHeaders(),
          body: JSON.stringify({ name: newItemName })
        });
        
        // Refresh expense items
        const itemsRes = await fetch(
          'http://localhost:5000/api/expense-item', 
          getAuthHeaders()
        );
        const itemsData = await itemsRes.json();
        setExpenseItems(itemsData.map(item => item.name));
        setNewItemName('');
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const removeExpenseItem = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item}"?`)) {
      try {
        // Find item ID
        const itemsRes = await fetch(
          'http://localhost:5000/api/expense-item', 
          getAuthHeaders()
        );
        const itemsData = await itemsRes.json();
        const itemToDelete = itemsData.find(i => i.name === item);
        
        if (itemToDelete) {
          // Delete from backend
          await fetch(
            `http://localhost:5000/api/expense-item/${itemToDelete.id}`, 
            { method: 'DELETE', ...getAuthHeaders() }
          );
          
          // Refresh expense items
          const updatedItems = itemsData.filter(i => i.id !== itemToDelete.id);
          setExpenseItems(updatedItems.map(i => i.name));
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  // Helper functions
  const getTotalAmount = () => {
    return expenses.reduce((sum, expense) => sum + parseFloat(expense.total_amount), 0).toFixed(2);
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

  // Prepare options for searchable dropdowns
  const clientOptions = clients.map(client => ({
    value: client.name,
    label: client.name
  }));

  const operationOptions = operations.map(op => ({
    value: op,
    label: op
  }));

  const expenseItemOptions = expenseItems.map(item => ({
    value: item,
    label: item
  }));

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
                  operation_no: '',
                  client_name: '',
                  expense_item: '',
                  actual_amount: '',
                  vat_percent: 0,
                  vat_amount: 0,
                  total_amount: '',
                  date_of_payment: ''
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
            
            <button
              onClick={() => setIsManagingItems(true)}
              className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center"
            >
              <Settings className="w-5 h-5 mr-2" />
              Manage Items
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

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
              {/* Client Name Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Select
                    options={clientOptions}
                    value={clientOptions.find(option => option.value === searchForm.clientName)}
                    onChange={(selectedOption) => handleSearchChange('clientName', selectedOption?.value || '')}
                    placeholder="Select Client"
                    isSearchable
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Operation No Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operation No <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Select
                    options={operationOptions}
                    value={operationOptions.find(option => option.value === searchForm.operationNo)}
                    onChange={(selectedOption) => handleSearchChange('operationNo', selectedOption?.value || '')}
                    placeholder="Select Operation"
                    isSearchable
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Items Management Modal */}
        {isManagingItems && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  MANAGE EXPENSE ITEMS
                </h2>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add New Expense Item
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter new item name"
                    />
                    <button
                      onClick={addExpenseItem}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Current Expense Items</h3>
                  <ul className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-60 overflow-y-auto">
                    {expenseItems.map((item, index) => (
                      <li key={index} className="flex justify-between items-center p-3 hover:bg-gray-50">
                        <span>{item}</span>
                        <button
                          onClick={() => removeExpenseItem(item)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setIsManagingItems(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                      Operation No <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={operationOptions}
                      value={operationOptions.find(option => option.value === expenseForm.operation_no)}
                      onChange={(selectedOption) => handleExpenseChange('operation_no', selectedOption?.value || '')}
                      placeholder="Select Operation"
                      isSearchable
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={clientOptions}
                      value={clientOptions.find(option => option.value === expenseForm.client_name)}
                      onChange={(selectedOption) => handleExpenseChange('client_name', selectedOption?.value || '')}
                      placeholder="Select Client"
                      isSearchable
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expense Item <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <Select
                        options={expenseItemOptions}
                        value={expenseItemOptions.find(option => option.value === expenseForm.expense_item)}
                        onChange={(selectedOption) => handleExpenseChange('expense_item', selectedOption?.value || '')}
                        placeholder="Select Expense Item"
                        isSearchable
                        className="flex-grow"
                      />
                      <button
                        onClick={() => setIsManagingItems(true)}
                        className="ml-2 px-3 bg-gray-200 hover:bg-gray-300 rounded-r-lg"
                        title="Manage Items"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actual Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={expenseForm.actual_amount}
                      onChange={(e) => handleExpenseChange('actual_amount', e.target.value)}
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
                      value={expenseForm.vat_percent}
                      onChange={(e) => handleExpenseChange('vat_percent', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      VAT Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={(parseFloat(expenseForm?.vat_amount) || 0).toFixed(2)}
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
                      value={expenseForm.total_amount}
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
                      value={expenseForm.date_of_payment}
                      onChange={(e) => handleExpenseChange('date_of_payment', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleAddExpense}
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
                  { label: 'Operation No', key: 'operation_no' },
                  { label: 'Client Name', key: 'client_name' },
                  { label: 'Expense Item', key: 'expense_item' },
                  { label: 'Actual Amount', key: 'actual_amount' },
                  { label: 'VAT(%)', key: 'vat_percent' },
                  { label: 'VAT Amount', key: 'vat_amount' },
                  { label: 'Total Amount', key: 'total_amount' },
                  { label: 'Date of Payment', key: 'date_of_payment' },
                  { label: 'Actions', key: null },
                ].map(({ label, key }) => (
                  <th
                    key={label}
                    className={`px-4 py-3 text-left cursor-pointer select-none ${key && 'hover:bg-indigo-700'}`}
                    onClick={() => key && handleSort(key)}
                  >
                    <div className="flex items-center">
                      {label}
                      {key && sortField === key && (
                        <ChevronDown
                          className={`w-4 h-4 ml-1 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`}
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
                  <td colSpan={9} className="text-center py-8 text-gray-500">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                currentExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{expense.operation_no}</td>
                    <td className="px-4 py-3">{expense.client_name}</td>
                    <td className="px-4 py-3">{expense.expense_item}</td>
                    <td className="px-4 py-3">{parseFloat(expense.actual_amount).toFixed(2)}</td>
                    <td className="px-4 py-3">{expense.vat_percent}</td>
                    <td className="px-4 py-3">{parseFloat(expense.vat_amount).toFixed(2)}</td>
                    <td className="px-4 py-3 text-green-600 font-medium">{parseFloat(expense.total_amount).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      {new Date(expense.date_of_payment).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 flex space-x-3">
                      <button
                        onClick={() => handleEdit(expense)}
                        title="Edit"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
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
