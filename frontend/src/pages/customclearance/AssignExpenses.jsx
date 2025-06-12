// import React, { useState } from 'react';
// import { Search } from 'lucide-react';

// const AssignExpenses = () => {
//   const [searchForm, setSearchForm] = useState({
//     operationNo: '',
//     clientName: ''
//   });

//   const [expenseForm, setExpenseForm] = useState({
//     item: '',
//     actualAmount: '',
//     vatPercentage: 0,
//     vatAmount: 0,
//     amount: '',
//     dateOfPayment: ''
//   });

//   const [expenses, setExpenses] = useState([
//     {
//       id: 1,
//       item: 'Container Claims (مطالبة الحويات)',
//       actualAmount: 90.85,
//       vatPercentage: 0,
//       vatAmount: 0.00,
//       amount: 90.85,
//       dateOfPayment: '2025-02-05'
//     }
//   ]);

//   const expenseItems = [
//     'Container Claims (مطالبة الحويات)',
//     'Transportation Costs',
//     'Storage Fees',
//     'Handling Charges',
//     'Documentation Fees',
//     'Customs Clearance',
//     'Port Charges',
//     'Insurance Premium',
//     'Demurrage Charges',
//     'Other Expenses'
//   ];

//   const handleSearchChange = (field, value) => {
//     setSearchForm(prev => ({ ...prev, [field]: value }));
//   };

//   const handleExpenseChange = (field, value) => {
//     setExpenseForm(prev => {
//       const updated = { ...prev, [field]: value };
      
//       if (field === 'actualAmount' || field === 'vatPercentage') {
//         const actualAmount = parseFloat(updated.actualAmount) || 0;
//         const vatPercentage = parseFloat(updated.vatPercentage) || 0;
//         const vatAmount = (actualAmount * vatPercentage) / 100;
        
//         updated.vatAmount = vatAmount;
//         updated.amount = (actualAmount + vatAmount).toFixed(2);
//       }
      
//       return updated;
//     });
//   };

//   const addExpense = () => {
//     if (!expenseForm.item || !expenseForm.actualAmount) {
//       alert('Please select an expense item and enter the actual amount.');
//       return;
//     }

//     const newExpense = {
//       id: Date.now(),
//       item: expenseForm.item,
//       actualAmount: parseFloat(expenseForm.actualAmount),
//       vatPercentage: parseFloat(expenseForm.vatPercentage) || 0,
//       vatAmount: parseFloat(expenseForm.vatAmount) || 0,
//       amount: parseFloat(expenseForm.amount) || parseFloat(expenseForm.actualAmount),
//       dateOfPayment: expenseForm.dateOfPayment
//     };

//     setExpenses(prev => [...prev, newExpense]);
    
//     setExpenseForm({
//       item: '',
//       actualAmount: '',
//       vatPercentage: 0,
//       vatAmount: 0,
//       amount: '',
//       dateOfPayment: ''
//     });
//   };

//   const removeExpense = (id) => {
//     setExpenses(prev => prev.filter(expense => expense.id !== id));
//   };

//   const getTotalAmount = () => {
//     return expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2);
//   };

//   const handleSearch = () => {
//     console.log('Searching with:', searchForm);
//   };

//   return (
//     <div className="max-w-12xl mx-auto p-8 font-sans bg-white-300 min-h-screen">
//       {/* Page Title */}
//       <h1 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight text-center">ASSIGN EXPENSE</h1>

//       {/* Search Section */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-300 mb-3 overflow-hidden">
//         <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-2 flex justify-between items-center">
//           <span className="text-xs font-semibold uppercase tracking-wider">Search</span>
//         </div>
//         <div className="p-3">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Operation No *</label>
//               <div className="flex gap-1">
//                 <input
//                   type="text"
//                   placeholder="Enter Operation No"
//                   value={searchForm.operationNo}
//                   onChange={(e) => handleSearchChange('operationNo', e.target.value)}
//                   className="flex-1 px-2 py-1.5 border-2 border-gray-300 rounded text-xs font-medium h-8 focus:outline-none focus:border-blue-500 transition-all"
//                 />
//                 <button 
//                   onClick={handleSearch} 
//                   className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none px-2.5 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 h-8 min-w-8 flex items-center justify-center"
//                 >
//                   <Search size={14} />
//                 </button>
//               </div>
//             </div>
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Client Name *</label>
//               <div className="flex gap-1">
//                 <input
//                   type="text"
//                   placeholder="Client name"
//                   value={searchForm.clientName}
//                   onChange={(e) => handleSearchChange('clientName', e.target.value)}
//                   className="flex-1 px-2 py-1.5 border-2 border-gray-300 rounded text-xs font-medium h-8 focus:outline-none focus:border-blue-500 transition-all"
//                 />
//                 <button 
//                   onClick={handleSearch} 
//                   className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none px-2.5 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 h-8 min-w-8 flex items-center justify-center"
//                 >
//                   <Search size={14} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Expense Head Section*/}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-300 mb-3 overflow-hidden">
//         <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-2 flex justify-between items-center">
//           <span className="text-xs font-semibold uppercase tracking-wider">Expense Head</span>
//         </div>
//         <div className="p-3">
//           {/* Compact Single Row Layout */}
//           <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 mb-3 items-end">
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Item</label>
//               <select
//                 value={expenseForm.item}
//                 onChange={(e) => handleExpenseChange('item', e.target.value)}
//                 className="px-2 py-1.5 border-2 border-gray-300 rounded text-xs font-medium h-8 focus:outline-none focus:border-blue-500 transition-all bg-white w-full"
//               >
//                 <option value="">Select</option>
//                 {expenseItems.map((item, index) => (
//                   <option key={index} value={item}>{item}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Actual Amount</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 value={expenseForm.actualAmount}
//                 onChange={(e) => handleExpenseChange('actualAmount', e.target.value)}
//                 className="px-2 py-1.5 border-2 border-gray-300 rounded text-xs font-medium h-8 focus:outline-none focus:border-blue-500 transition-all w-full"
//                 placeholder="0.00"
//               />
//             </div>
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">VAT(%)</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 value={expenseForm.vatPercentage}
//                 onChange={(e) => handleExpenseChange('vatPercentage', e.target.value)}
//                 className="px-2 py-1.5 border-2 border-gray-300 rounded text-xs font-medium h-8 focus:outline-none focus:border-blue-500 transition-all w-full"
//                 placeholder="0"
//               />
//             </div>
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">VAT Amount</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 value={expenseForm.vatAmount.toFixed(2)}
//                 readOnly
//                 className="px-2 py-1.5 border-2 border-gray-300 rounded text-xs font-medium h-8 bg-gray-100 text-gray-600 cursor-not-allowed w-full"
//                 placeholder="0.00"
//               />
//             </div>
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Amount</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 value={expenseForm.amount}
//                 readOnly
//                 className="px-2 py-1.5 border-2 border-gray-300 rounded text-xs font-medium h-8 bg-gray-100 text-gray-600 cursor-not-allowed w-full"
//                 placeholder="0.00"
//               />
//             </div>
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Date of Payment</label>
//               <input
//                 type="date"
//                 value={expenseForm.dateOfPayment}
//                 onChange={(e) => handleExpenseChange('dateOfPayment', e.target.value)}
//                 className="px-2 py-1.5 border-2 border-gray-300 rounded text-xs font-medium h-8 focus:outline-none focus:border-blue-500 transition-all w-full"
//               />
//             </div>
//           </div>

//           {/* Compact Add Button */}
//           <div className="flex justify-end pt-2 border-t border-gray-200">
//             <button 
//               onClick={addExpense} 
//               className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 uppercase tracking-wide h-7 flex items-center gap-1"
//             >
//               + Expense
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Expense Items Table */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 flex justify-between items-center">
//           <span className="text-xs font-semibold uppercase tracking-wider">Expense Items</span>
//           <div className="bg-white bg-opacity-25 px-3 py-1 rounded text-sm font-bold uppercase tracking-wide">
//             Total: ${getTotalAmount()}
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse text-sm bg-white">
//             <thead>
//               <tr>
//                 <th className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 text-left font-bold text-gray-700 text-xs uppercase tracking-wider border-b-2 border-gray-300 whitespace-nowrap">Expense Item</th>
//                 <th className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 text-left font-bold text-gray-700 text-xs uppercase tracking-wider border-b-2 border-gray-300 whitespace-nowrap">Actual Amount</th>
//                 <th className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 text-left font-bold text-gray-700 text-xs uppercase tracking-wider border-b-2 border-gray-300 whitespace-nowrap">VAT(%)</th>
//                 <th className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 text-left font-bold text-gray-700 text-xs uppercase tracking-wider border-b-2 border-gray-300 whitespace-nowrap">VAT Amount</th>
//                 <th className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 text-left font-bold text-gray-700 text-xs uppercase tracking-wider border-b-2 border-gray-300 whitespace-nowrap">Amount</th>
//                 <th className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 text-left font-bold text-gray-700 text-xs uppercase tracking-wider border-b-2 border-gray-300 whitespace-nowrap">Date of Payment</th>
//                 <th className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 text-left font-bold text-gray-700 text-xs uppercase tracking-wider border-b-2 border-gray-300 whitespace-nowrap w-16"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {expenses.map((expense) => (
//                 <tr key={expense.id} className="transition-all hover:bg-gray-50">
//                   <td className="px-4 py-3 border-b border-gray-200 text-gray-800 font-medium">{expense.item}</td>
//                   <td className="px-4 py-3 border-b border-gray-200 text-gray-800 font-medium">{expense.actualAmount.toFixed(2)}</td>
//                   <td className="px-4 py-3 border-b border-gray-200 text-gray-800 font-medium">{expense.vatPercentage}</td>
//                   <td className="px-4 py-3 border-b border-gray-200 text-gray-800 font-medium">{expense.vatAmount.toFixed(2)}</td>
//                   <td className="px-4 py-3 border-b border-gray-200 text-green-600 font-bold">{expense.amount.toFixed(2)}</td>
//                   <td className="px-4 py-3 border-b border-gray-200 text-gray-800 font-medium">{expense.dateOfPayment || '-'}</td>
//                   <td className="px-4 py-3 border-b border-gray-200 text-center">
//                     <button 
//                       onClick={() => removeExpense(expense.id)}
//                       className="bg-gradient-to-r from-red-500 to-red-600 text-white border-none p-1.5 rounded cursor-pointer transition-all hover:scale-110 hover:shadow-md w-6 h-6 flex items-center justify-center text-sm"
//                       title="Remove expense"
//                     >
//                       ×
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {expenses.length === 0 && (
//                 <tr>
//                   <td colSpan="7" className="text-center py-8 text-gray-500 italic bg-gray-50">
//                     No expenses added yet
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssignExpenses;


// // import { useState, useEffect } from 'react';
// // import {
// //   ClipboardList,
// //   Plus,
// //   Pencil,
// //   Trash2,
// //   ChevronDown,
// //   Search,
// //   ChevronLeft,
// //   ChevronRight,
// //   X,
// // } from 'lucide-react';

// // const API_URL = 'http://localhost:5000/api/assign-expenses';

// // const AssignExpensesPage = () => {
// //   const [expenses, setExpenses] = useState([]);
// //   const [newExpense, setNewExpense] = useState({
// //     expenseName: '',
// //     expenseAmount: '',
// //     expenseCategory: '',
// //     expenseDate: '',
// //     description: '',
// //   });
// //   const [isAdding, setIsAdding] = useState(false);
// //   const [editingId, setEditingId] = useState(null);
// //   const [sortField, setSortField] = useState('expenseName');
// //   const [sortDirection, setSortDirection] = useState('asc');
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 5;

// //   // Convert API snake_case object to camelCase
// //   const toCamelCase = (obj) => ({
// //     id: obj.id,
// //     expenseName: obj.expense_name,
// //     expenseAmount: obj.expense_amount,
// //     expenseCategory: obj.expense_category,
// //     expenseDate: obj.expense_date,
// //     description: obj.description,
// //     createdAt: obj.created_at,
// //   });

// //   // Convert camelCase to snake_case for API
// //   const formatToSnakeCase = (expense) => ({
// //     expense_name: expense.expenseName,
// //     expense_amount: expense.expenseAmount,
// //     expense_category: expense.expenseCategory,
// //     expense_date: expense.expenseDate,
// //     description: expense.description,
// //   });

// //   // Fetch expenses from backend
// //   const fetchExpenses = async () => {
// //     try {
// //       const res = await fetch(API_URL);
// //       const data = await res.json();
// //       setExpenses(data.map(toCamelCase));
// //     } catch (err) {
// //       console.error('Failed to fetch expenses:', err);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchExpenses();
// //   }, []);

// //   // Add or update expense handler
// //   const handleAddExpense = async () => {
// //     // Basic validation for required fields
// //     if (!newExpense.expenseName.trim() || !newExpense.expenseAmount.trim()) return;

// //     try {
// //       let res;
// //       if (editingId !== null) {
// //         // Update the existing expense
// //         res = await fetch(`${API_URL}/${editingId}`, {
// //           method: 'PUT',
// //           headers: { 'Content-Type': 'application/json' },
// //           body: JSON.stringify(formatToSnakeCase(newExpense)),
// //         });
// //         if (!res.ok) throw new Error('Failed to update expense');
// //       } else {
// //         // Create a new expense
// //         res = await fetch(API_URL, {
// //           method: 'POST',
// //           headers: { 'Content-Type': 'application/json' },
// //           body: JSON.stringify(formatToSnakeCase(newExpense)),
// //         });
// //         if (!res.ok) throw new Error('Failed to add expense');
// //       }

// //       // Refresh the list of expenses
// //       await fetchExpenses();

// //       setNewExpense({
// //         expenseName: '',
// //         expenseAmount: '',
// //         expenseCategory: '',
// //         expenseDate: '',
// //         description: '',
// //       });
// //       setEditingId(null);
// //       setIsAdding(false);
// //     } catch (err) {
// //       console.error(err);
// //       alert(err.message);
// //     }
// //   };

// //   // Delete expense handler
// //   const handleDelete = async (id) => {
// //     if (!window.confirm('Are you sure you want to delete this expense?')) return;

// //     try {
// //       const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
// //       if (!res.ok) throw new Error('Failed to delete expense');
// //       await fetchExpenses();
// //     } catch (err) {
// //       console.error(err);
// //       alert(err.message);
// //     }
// //   };

// //   // Edit expense handler — populates the form with the selected expense data
// //   const handleEdit = (expense) => {
// //     setNewExpense({
// //       expenseName: expense.expenseName,
// //       expenseAmount: expense.expenseAmount,
// //       expenseCategory: expense.expenseCategory,
// //       expenseDate: expense.expenseDate,
// //       description: expense.description,
// //     });
// //     setEditingId(expense.id);
// //     setIsAdding(true);
// //   };

// //   // Sort handler updates the sort field/direction
// //   const handleSort = (field) => {
// //     if (sortField === field) {
// //       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
// //     } else {
// //       setSortField(field);
// //       setSortDirection('asc');
// //     }
// //   };

// //   // Sorted & filtered expenses based on search term
// //   const sortedExpenses = [...expenses].sort((a, b) => {
// //     if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
// //     if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
// //     return 0;
// //   });

// //   const filteredExpenses = sortedExpenses.filter(
// //     (expense) =>
// //       expense.expenseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       expense.expenseCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       expense.description.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   // Pagination calculations
// //   const indexOfLastItem = currentPage * itemsPerPage;
// //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// //   const currentExpenses = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);
// //   const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
// //       <div className="max-w-7xl mx-auto">
// //         {/* Header Section */}
// //         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
// //           <div>
// //             <h1 className="text-3xl font-bold text-gray-800 flex items-center">
// //               <ClipboardList className="w-8 h-8 mr-3 text-indigo-600" />
// //               ASSIGN EXPENSES
// //             </h1>
// //             <p className="text-gray-600 mt-2">
// //               Manage expense assignments for your business
// //             </p>
// //           </div>
// //           <div className="mt-4 md:mt-0 flex space-x-3">
// //             <div className="relative">
// //               <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
// //                 <Search className="w-5 h-5 text-gray-400 mr-2" />
// //                 <input
// //                   type="text"
// //                   placeholder="Search expenses..."
// //                   className="bg-transparent outline-none w-40"
// //                   value={searchTerm}
// //                   onChange={(e) => {
// //                     setSearchTerm(e.target.value);
// //                     setCurrentPage(1);
// //                   }}
// //                 />
// //               </div>
// //             </div>
// //             <button
// //               onClick={() => {
// //                 setIsAdding(!isAdding);
// //                 setEditingId(null);
// //                 setNewExpense({
// //                   expenseName: '',
// //                   expenseAmount: '',
// //                   expenseCategory: '',
// //                   expenseDate: '',
// //                   description: '',
// //                 });
// //               }}
// //               className={`px-5 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md ${
// //                 isAdding
// //                   ? 'bg-red-600 hover:bg-red-700'
// //                   : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
// //               }`}
// //             >
// //               {isAdding ? (
// //                 <>
// //                   <X className="w-5 h-5 mr-2" />
// //                   Close
// //                 </>
// //               ) : (
// //                 <>
// //                   <Plus className="w-5 h-5 mr-2" />
// //                   Add Expense
// //                 </>
// //               )}
// //             </button>
// //           </div>
// //         </div>

// //         {/* Add/Edit Expense Form */}
// //         {isAdding && (
// //           <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
// //             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
// //               <h2 className="text-xl font-bold text-white flex items-center">
// //                 <ClipboardList className="w-5 h-5 mr-2" />
// //                 {editingId ? 'Edit Expense' : 'Add Expense'}
// //               </h2>
// //             </div>
// //             <div className="p-6">
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                 {/* Left Column */}
// //                 <div className="space-y-4">
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">
// //                       Expense Name <span className="text-red-500">*</span>
// //                     </label>
// //                     <div className="relative">
// //                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                         <ClipboardList className="w-5 h-5 text-gray-400" />
// //                       </div>
// //                       <input
// //                         type="text"
// //                         placeholder="Enter expense name"
// //                         className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
// //                         value={newExpense.expenseName}
// //                         onChange={(e) =>
// //                           setNewExpense({ ...newExpense, expenseName: e.target.value })
// //                         }
// //                       />
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">
// //                       Expense Amount <span className="text-red-500">*</span>
// //                     </label>
// //                     <input
// //                       type="text"
// //                       placeholder="Enter expense amount"
// //                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
// //                       value={newExpense.expenseAmount}
// //                       onChange={(e) =>
// //                         setNewExpense({ ...newExpense, expenseAmount: e.target.value })
// //                       }
// //                     />
// //                   </div>
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">
// //                       Expense Category
// //                     </label>
// //                     <input
// //                       type="text"
// //                       placeholder="Enter expense category"
// //                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
// //                       value={newExpense.expenseCategory}
// //                       onChange={(e) =>
// //                         setNewExpense({ ...newExpense, expenseCategory: e.target.value })
// //                       }
// //                     />
// //                   </div>
// //                 </div>
// //                 {/* Right Column */}
// //                 <div className="space-y-4">
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">
// //                       Expense Date
// //                     </label>
// //                     <input
// //                       type="date"
// //                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
// //                       value={newExpense.expenseDate}
// //                       onChange={(e) =>
// //                         setNewExpense({ ...newExpense, expenseDate: e.target.value })
// //                       }
// //                     />
// //                   </div>
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">
// //                       Description
// //                     </label>
// //                     <textarea
// //                       placeholder="Enter description"
// //                       rows={3}
// //                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
// //                       value={newExpense.description}
// //                       onChange={(e) =>
// //                         setNewExpense({ ...newExpense, description: e.target.value })
// //                       }
// //                     />
// //                   </div>
// //                 </div>
// //               </div>
// //               <div className="mt-6 flex justify-end">
// //                 <button
// //                   onClick={handleAddExpense}
// //                   className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
// //                 >
// //                   {editingId ? 'Update Expense' : 'Add Expense'}
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* Expenses Table */}
// //         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
// //           <table className="min-w-full table-auto border-collapse">
// //             <thead className="bg-indigo-600 text-white text-sm font-semibold">
// //               <tr>
// //                 {[
// //                   { label: 'Expense Name', key: 'expenseName' },
// //                   { label: 'Expense Amount', key: 'expenseAmount' },
// //                   { label: 'Expense Category', key: 'expenseCategory' },
// //                   { label: 'Expense Date', key: 'expenseDate' },
// //                   { label: 'Description', key: 'description' },
// //                   { label: 'Actions', key: null },
// //                 ].map(({ label, key }) => (
// //                   <th
// //                     key={label}
// //                     onClick={() => key && handleSort(key)}
// //                     className={`px-4 py-3 text-left cursor-pointer select-none ${
// //                       key ? 'hover:bg-indigo-700' : ''
// //                     }`}
// //                   >
// //                     <div className="flex items-center">
// //                       {label}
// //                       {key && sortField === key && (
// //                         <ChevronDown
// //                           className={`w-4 h-4 ml-1 transition-transform ${
// //                             sortDirection === 'asc' ? 'rotate-180' : ''
// //                           }`}
// //                         />
// //                       )}
// //                     </div>
// //                   </th>
// //                 ))}
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {currentExpenses.length === 0 ? (
// //                 <tr>
// //                   <td colSpan={6} className="text-center py-8 text-gray-500">
// //                     No expense records found.
// //                   </td>
// //                 </tr>
// //               ) : (
// //                 currentExpenses.map((expense) => (
// //                   <tr
// //                     key={expense.id}
// //                     className="border-b border-gray-200 hover:bg-gray-50 transition"
// //                   >
// //                     <td className="px-4 py-3">{expense.expenseName}</td>
// //                     <td className="px-4 py-3">{expense.expenseAmount}</td>
// //                     <td className="px-4 py-3">{expense.expenseCategory}</td>
// //                     <td className="px-4 py-3">{expense.expenseDate}</td>
// //                     <td className="px-4 py-3">{expense.description}</td>
// //                     <td className="px-4 py-3 flex space-x-3">
// //                       <button
// //                         onClick={() => handleEdit(expense)}
// //                         title="Edit"
// //                         className="text-indigo-600 hover:text-indigo-800"
// //                       >
// //                         <Pencil className="w-5 h-5" />
// //                       </button>
// //                       <button
// //                         onClick={() => handleDelete(expense.id)}
// //                         title="Delete"
// //                         className="text-red-600 hover:text-red-800"
// //                       >
// //                         <Trash2 className="w-5 h-5" />
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))
// //               )}
// //             </tbody>
// //           </table>

// //           {/* Pagination Controls */}
// //           <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
// //             <div className="text-sm text-gray-700">
// //               Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredExpenses.length)} of {filteredExpenses.length} results
// //             </div>
// //             <div className="flex space-x-2">
// //               <button
// //                 onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
// //                 disabled={currentPage === 1}
// //                 className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
// //                 title="Previous"
// //               >
// //                 <ChevronLeft className="w-5 h-5" />
// //               </button>
// //               <button
// //                 onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
// //                 disabled={currentPage === totalPages || totalPages === 0}
// //                 className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
// //                 title="Next"
// //               >
// //                 <ChevronRight className="w-5 h-5" />
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AssignExpensesPage;

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