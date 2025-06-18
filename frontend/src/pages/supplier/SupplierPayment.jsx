// import React, { useState, useEffect } from 'react';
// import {
//   Search, Calendar, DollarSign, FileText, CheckCircle,
//   Plus, X, Edit, Trash2, Loader2, Eye, ChevronDown, ChevronUp
// } from 'lucide-react';

// // Auth header utility
// const getAuthHeaders = () => {
//   const token = localStorage.getItem('authToken');
//   if (!token) throw new Error('Authentication token missing');
//   return {
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json'
//   };
// };

// const API_URL = 'http://localhost:5000/api/supplier-payment/';
// const API_SUPPLIERS = 'http://localhost:5000/api/suppliers';

// const SupplierPayment = () => {
//   // Form state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [voucherNo, setVoucherNo] = useState('');
//   const [date, setDate] = useState('');
//   const [amount, setAmount] = useState('');
//   const [remarks, setRemarks] = useState('');
//   const [paymentType, setPaymentType] = useState('');
//   const [totalAmount, setTotalAmount] = useState('');
//   const [tableData, setTableData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [supplierPayments, setSupplierPayments] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [suppliers, setSuppliers] = useState([]);
//   const [viewPayment, setViewPayment] = useState(null);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [paymentTypes, setPaymentTypes] = useState([
//     { id: 1, name: 'Cash' },
//     { id: 2, name: 'Bank Transfer' },
//     { id: 3, name: 'Cheque' },
//     { id: 4, name: 'Card' }
//   ]);

//   useEffect(() => {
//     fetchPayments();
//     fetchSuppliers();
//   }, []);

//   // Fetch suppliers for dropdown
//   const fetchSuppliers = async () => {
//     try {
//       const res = await fetch(API_SUPPLIERS, { headers: getAuthHeaders() });
//       const data = await res.json();
//       setSuppliers(Array.isArray(data) ? data : data.data || []);
//     } catch (err) {
//       console.error('Failed to fetch suppliers:', err);
//       setSuppliers([]);
//     }
//   };

//   // Fetch all payments
//   const fetchPayments = async () => {
//     setIsLoading(true);
//     try {
//       const res = await fetch(API_URL, { headers: getAuthHeaders() });
//       const data = await res.json();
//       setSupplierPayments(Array.isArray(data) ? data : data.data || []);
//     } catch (err) {
//       setErrorMsg('Failed to fetch payments.');
//     }
//     setIsLoading(false);
//   };

//   // Search payments
//   const handleSearch = async () => {
//     if (!searchTerm.trim()) {
//       fetchPayments();
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       const res = await fetch(`${API_URL}?search=${encodeURIComponent(searchTerm)}`, {
//         headers: getAuthHeaders()
//       });
//       const data = await res.json();
//       setSupplierPayments(Array.isArray(data) ? data : data.data || []);
//     } catch (err) {
//       setErrorMsg('Search failed.');
//     }
//     setIsLoading(false);
//   };

//   // Add table row
//   const addTableRow = () => {
//     setTableData([
//       ...tableData,
//       {
//         id: Date.now(),
//         supplier_id: '',
//         operation_no: '',
//         receipt_no: '',
//         bill_amount: '',
//         paid_amount: '',
//         balance_amount: '',
//         amount: '',
//         checked: false,
//       },
//     ]);
//   };

//   // Remove table row
//   const removeTableRow = (id) => {
//     setTableData(tableData.filter((row) => row.id !== id));
//   };

//   // Reset form
//   const resetForm = () => {
//     setVoucherNo('');
//     setDate('');
//     setAmount('');
//     setRemarks('');
//     setPaymentType('');
//     setTotalAmount('');
//     setTableData([]);
//     setEditId(null);
//     setErrorMsg('');
//   };

//   // Submit payment (Create or Update)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Basic validation
//     if (!voucherNo || !date || !paymentType) {
//       setErrorMsg('Please fill all required fields');
//       return;
//     }
    
//     if (tableData.length === 0) {
//       setErrorMsg('Please add at least one payment detail');
//       return;
//     }
    
//     setIsLoading(true);
//     setErrorMsg('');
    
//     const payload = {
//       voucher_no: voucherNo,
//       payment_date: date,
//       amount: Number(totalAmount) || Number(amount) || 0,
//       payment_type_id: paymentType,
//       remarks: remarks,
//       details: tableData.map((row) => ({
//         supplier_id: row.supplier_id || 1,
//         operation_no: row.operation_no,
//         receipt_no: row.receipt_no,
//         bill_amount: Number(row.bill_amount) || Number(row.amount) || 0,
//         paid_amount: Number(row.paid_amount) || Number(row.amount) || 0,
//         balance_amount: Number(row.balance_amount) || 0,
//       })),
//     };

//     try {
//       let res, data;
//       const url = editId ? `${API_URL}${editId}` : API_URL;
//       const method = editId ? 'PUT' : 'POST';
      
//       res = await fetch(url, {
//         method,
//         headers: getAuthHeaders(),
//         body: JSON.stringify(payload),
//       });
      
//       data = await res.json();
      
//       if (res.ok) {
//         setShowSuccess(true);
//         fetchPayments();
//         resetForm();
//         setTimeout(() => setShowSuccess(false), 3000);
//       } else {
//         setErrorMsg(data.error || data.message || 'Failed to save payment.');
//       }
//     } catch (err) {
//       setErrorMsg('Save failed. Please check your connection.');
//     }
//     setIsLoading(false);
//   };

//   // Edit payment (load to form)
//   const handleEdit = (payment) => {
//     setEditId(payment.id);
//     setVoucherNo(payment.voucher_no || '');
//     setDate(payment.payment_date ? payment.payment_date.substring(0, 10) : '');
//     setAmount(payment.amount || '');
//     setRemarks(payment.remarks || '');
//     setPaymentType(payment.payment_type_id || '');
//     setTotalAmount(payment.amount || '');
//     setTableData(
//       (payment.details || []).map((d, i) => ({
//         id: d.id || Date.now() + i,
//         supplier_id: d.supplier_id,
//         operation_no: d.operation_no,
//         receipt_no: d.receipt_no,
//         bill_amount: d.bill_amount,
//         paid_amount: d.paid_amount,
//         balance_amount: d.balance_amount,
//         amount: d.paid_amount,
//         checked: false,
//       }))
//     );
//     setErrorMsg('');
//     setIsCollapsed(false);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // Delete payment
//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this payment?')) return;
//     setIsLoading(true);
//     try {
//       await fetch(`${API_URL}${id}`, {
//         method: 'DELETE',
//         headers: getAuthHeaders()
//       });
//       fetchPayments();
//     } catch (err) {
//       setErrorMsg('Delete failed.');
//     }
//     setIsLoading(false);
//   };

//   // Table row value change
//   const handleTableRowChange = (rowIndex, field, value) => {
//     const updated = [...tableData];
//     updated[rowIndex][field] = value;
    
//     // Calculate balance if bill amount or paid amount changes
//     if (field === 'bill_amount' || field === 'paid_amount') {
//       const bill = parseFloat(updated[rowIndex].bill_amount) || 0;
//       const paid = parseFloat(updated[rowIndex].paid_amount) || 0;
//       updated[rowIndex].balance_amount = (bill - paid).toFixed(2);
//     }
    
//     setTableData(updated);
//   };

//   // View details for a previous payment
//   const handleViewDetails = async (p) => {
//     setIsLoading(true);
//     try {
//       const res = await fetch(`${API_URL}${p.id}`, { headers: getAuthHeaders() });
//       const data = await res.json();
//       setViewPayment(data);
//     } catch {
//       setViewPayment(p); // fallback to current payment object
//     }
//     setIsLoading(false);
//   };

//   // Get supplier name by id
//   const getSupplierName = (id) => {
//     const supplier = suppliers.find(s => String(s.id) === String(id));
//     return supplier ? supplier.name : `Supplier ${id}`;
//   };

//   // Get payment type name by id
//   const getPaymentTypeName = (id) => {
//     const type = paymentTypes.find(t => t.id == id);
//     return type ? type.name : `Type ${id}`;
//   };

//   // Toggle form collapse
//   const toggleCollapse = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
//               <FileText className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 text-indigo-600" />
//               SUPPLIER PAYMENT
//             </h1>
//             <p className="text-gray-600 mt-1 text-sm md:text-base">
//               Manage supplier payments and voucher details.
//             </p>
//           </div>
          
//           <button
//             onClick={toggleCollapse}
//             className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
//           >
//             {isCollapsed ? (
//               <>
//                 <ChevronDown className="w-4 h-4" />
//                 <span>Show Form</span>
//               </>
//             ) : (
//               <>
//                 <ChevronUp className="w-4 h-4" />
//                 <span>Hide Form</span>
//               </>
//             )}
//           </button>
//         </div>

//         {/* Alerts */}
//         {errorMsg && (
//           <div className="mb-4 rounded px-4 py-3 bg-red-100 text-red-800 border border-red-200 text-center shadow">{errorMsg}</div>
//         )}
//         {showSuccess && (
//           <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-transform duration-300 animate-pulse">
//             <div className="flex items-center gap-2">
//               <CheckCircle className="w-5 h-5" />
//               <span>Payment processed successfully!</span>
//             </div>
//           </div>
//         )}

//         {/* Search Section */}
//         <Card>
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 md:p-6 rounded-t-xl">
//             <h2 className="text-white text-lg md:text-xl font-bold flex items-center">
//               <Search className="w-4 h-4 md:w-5 md:h-5 mr-2" />
//               Search Payments
//             </h2>
//           </div>
//           <div className="p-4 md:p-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-grow">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Supplier Name / Voucher No
//                 </label>
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Supplier Name or Voucher No"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800"
//                 />
//               </div>
//               <div className="flex items-end">
//                 <ActionButton onClick={handleSearch} disabled={isLoading} className="w-full md:w-auto">
//                   {isLoading ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     <Search className="w-4 h-4" />
//                   )}
//                   <span>Search</span>
//                 </ActionButton>
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Payment Form - Collapsible */}
//         {!isCollapsed && (
//           <form onSubmit={handleSubmit}>
//             {/* Payment Details Form */}
//             <Card>
//               <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 md:p-6 rounded-t-xl">
//                 <h2 className="text-white text-lg md:text-xl font-bold">Payment Details</h2>
//               </div>
//               <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//                 <TextInput
//                   label="Voucher No *"
//                   value={voucherNo}
//                   onChange={(e) => setVoucherNo(e.target.value)}
//                   required
//                 />
//                 <div className="space-y-1">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
//                   <div className="relative">
//                     <input
//                       type="date"
//                       value={date}
//                       onChange={(e) => setDate(e.target.value)}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800"
//                       required
//                     />
//                     <Calendar className="absolute right-3 top-3 w-4 h-4 md:w-5 md:h-5 text-gray-400 pointer-events-none" />
//                   </div>
//                 </div>
//                 <div className="space-y-1">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
//                   <div className="relative">
//                     <DollarSign className="absolute left-3 top-3 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
//                     <input
//                       type="number"
//                       value={amount}
//                       onChange={(e) => setAmount(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800"
//                       required
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-1 md:col-span-2 lg:col-span-1">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
//                   <div className="relative">
//                     <FileText className="absolute left-3 top-3 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
//                     <textarea
//                       value={remarks}
//                       onChange={(e) => setRemarks(e.target.value)}
//                       placeholder="Enter remarks"
//                       rows="2"
//                       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800 resize-none"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </Card>

//             {/* Payment Details Table */}
//             <Card>
//               <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 md:p-6 rounded-t-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
//                 <h2 className="text-white text-lg md:text-xl font-bold">Payment Details Table</h2>
//                 <ActionButton type="button" onClick={addTableRow} className="bg-cyan-500 text-white px-3 py-1 rounded inline-flex items-center space-x-1">
//                   <Plus className="w-4 h-4" />
//                   <span>Add Row</span>
//                 </ActionButton>
//               </div>
//               <div className="p-0 overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm font-semibold">
//                     <tr>
//                       <th className="px-3 py-2 md:px-4 md:py-3 text-left">Sl.No</th>
//                       <th className="px-3 py-2 md:px-4 md:py-3 text-left">Supplier</th>
//                       <th className="px-3 py-2 md:px-4 md:py-3 text-left hidden md:table-cell">Operation No</th>
//                       <th className="px-3 py-2 md:px-4 md:py-3 text-left hidden md:table-cell">Receipt No</th>
//                       <th className="px-3 py-2 md:px-4 md:py-3 text-left">Bill Amount</th>
//                       <th className="px-3 py-2 md:px-4 md:py-3 text-left">Paid Amount</th>
//                       <th className="px-3 py-2 md:px-4 md:py-3 text-left hidden md:table-cell">Balance</th>
//                       <th className="px-3 py-2 md:px-4 md:py-3 text-center">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {tableData.length === 0 ? (
//                       <tr>
//                         <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
//                           No payment details added. Click "Add Row" to add details.
//                         </td>
//                       </tr>
//                     ) : (
//                       tableData.map((row, index) => (
//                         <tr key={row.id} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-900">{index + 1}</td>
//                           <td className="px-3 py-2 md:px-4 md:py-3">
//                             <select
//                               value={row.supplier_id}
//                               onChange={e => handleTableRowChange(index, 'supplier_id', e.target.value)}
//                               className="w-full px-2 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-300 text-xs md:text-sm text-gray-800"
//                               required
//                             >
//                               <option value="">Select Supplier</option>
//                               {suppliers.map(sup => (
//                                 <option key={sup.id} value={sup.id}>{sup.name}</option>
//                               ))}
//                             </select>
//                           </td>
//                           <td className="px-3 py-2 md:px-4 md:py-3 hidden md:table-cell">
//                             <input
//                               type="text"
//                               placeholder="Op. No"
//                               value={row.operation_no}
//                               onChange={(e) => handleTableRowChange(index, 'operation_no', e.target.value)}
//                               className="w-full px-2 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-xs md:text-sm text-gray-800"
//                             />
//                           </td>
//                           <td className="px-3 py-2 md:px-4 md:py-3 hidden md:table-cell">
//                             <input
//                               type="text"
//                               placeholder="Receipt No"
//                               value={row.receipt_no}
//                               onChange={(e) => handleTableRowChange(index, 'receipt_no', e.target.value)}
//                               className="w-full px-2 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-xs md:text-sm text-gray-800"
//                             />
//                           </td>
//                           <td className="px-3 py-2 md:px-4 md:py-3">
//                             <input
//                               type="number"
//                               placeholder="0.00"
//                               value={row.bill_amount}
//                               onChange={(e) => handleTableRowChange(index, 'bill_amount', e.target.value)}
//                               className="w-full px-2 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-xs md:text-sm text-gray-800"
//                               min="0"
//                               step="0.01"
//                               required
//                             />
//                           </td>
//                           <td className="px-3 py-2 md:px-4 md:py-3">
//                             <input
//                               type="number"
//                               placeholder="0.00"
//                               value={row.paid_amount}
//                               onChange={(e) => handleTableRowChange(index, 'paid_amount', e.target.value)}
//                               className="w-full px-2 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-xs md:text-sm text-gray-800"
//                               min="0"
//                               step="0.01"
//                               required
//                             />
//                           </td>
//                           <td className="px-3 py-2 md:px-4 md:py-3 hidden md:table-cell">
//                             <input
//                               type="number"
//                               placeholder="0.00"
//                               value={row.balance_amount}
//                               readOnly
//                               className="w-full px-2 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs md:text-sm text-gray-800"
//                             />
//                           </td>
//                           <td className="px-3 py-2 md:px-4 md:py-3 text-center">
//                             <button
//                               type="button"
//                               onClick={() => removeTableRow(row.id)}
//                               className="text-red-500 hover:text-red-700 transition-colors duration-200"
//                               title="Remove row"
//                             >
//                               <X className="w-4 h-4" />
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </Card>

//             {/* Bottom Summary Section */}
//             <Card>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Payment Type *
//                   </label>
//                   <select
//                     value={paymentType}
//                     onChange={(e) => setPaymentType(e.target.value)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800"
//                     required
//                   >
//                     <option value="">--Select--</option>
//                     {paymentTypes.map(type => (
//                       <option key={type.id} value={type.id}>{type.name}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Total Amount
//                   </label>
//                   <div className="relative">
//                     <DollarSign className="absolute left-3 top-3 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
//                     <input
//                       type="number"
//                       value={totalAmount}
//                       onChange={(e) => setTotalAmount(e.target.value)}
//                       placeholder="0.00"
//                       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800"
//                       min="0"
//                       step="0.01"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-3 flex-wrap">
//                   <ActionButton
//                     type="button"
//                     onClick={resetForm}
//                     disabled={isLoading}
//                     className="bg-gray-500"
//                   >
//                     <X className="w-4 h-4 md:w-5 md:h-5" />
//                     Cancel
//                   </ActionButton>
//                   <ActionButton type="submit" disabled={isLoading}>
//                     {isLoading ? (
//                       <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
//                     ) : (
//                       <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
//                     )}
//                     <span>{editId ? 'Update Payment' : 'Submit Payment'}</span>
//                   </ActionButton>
//                 </div>
//               </div>
//             </Card>
//           </form>
//         )}

//         {/* All Payments List Table */}
//         <Card>
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 md:p-6 rounded-t-xl">
//             <h2 className="text-white text-lg md:text-xl font-bold">All Supplier Payments</h2>
//           </div>
//           <div className="p-0 overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-100 text-gray-700 text-xs md:text-sm font-semibold">
//                 <tr>
//                   <th className="px-3 py-2 md:px-4 md:py-3 text-left">Voucher No</th>
//                   <th className="px-3 py-2 md:px-4 md:py-3 text-left hidden md:table-cell">Date</th>
//                   <th className="px-3 py-2 md:px-4 md:py-3 text-left">Amount</th>
//                   <th className="px-3 py-2 md:px-4 md:py-3 text-left hidden sm:table-cell">Type</th>
//                   <th className="px-3 py-2 md:px-4 md:py-3 text-left hidden lg:table-cell">Remarks</th>
//                   <th className="px-3 py-2 md:px-4 md:py-3 text-left">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {isLoading ? (
//                   <tr>
//                     <td colSpan="6" className="px-4 py-8 text-center">
//                       <Loader2 className="w-8 h-8 mx-auto animate-spin text-indigo-600" />
//                     </td>
//                   </tr>
//                 ) : supplierPayments.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
//                       No payments found.
//                     </td>
//                   </tr>
//                 ) : (
//                   supplierPayments.map((payment) => (
//                     <tr key={payment.id} className="hover:bg-gray-50">
//                       <td className="px-3 py-2 md:px-4 md:py-3 text-sm font-medium text-gray-900">
//                         {payment.voucher_no}
//                       </td>
//                       <td className="px-3 py-2 md:px-4 md:py-3 hidden md:table-cell">
//                         {payment.payment_date?.substring(0, 10)}
//                       </td>
//                       <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-900">
//                         ${parseFloat(payment.amount).toFixed(2)}
//                       </td>
//                       <td className="px-3 py-2 md:px-4 md:py-3 hidden sm:table-cell">
//                         {getPaymentTypeName(payment.payment_type_id)}
//                       </td>
//                       <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-500 truncate max-w-xs hidden lg:table-cell">
//                         {payment.remarks || '-'}
//                       </td>
//                       <td className="px-3 py-2 md:px-4 md:py-3 text-sm">
//                         <div className="flex gap-1 md:gap-2">
//                           <button
//                             onClick={() => handleEdit(payment)}
//                             className="p-1 md:p-2 rounded-full hover:bg-indigo-100 text-indigo-600 hover:text-indigo-800"
//                             title="Edit"
//                           >
//                             <Edit className="w-4 h-4 md:w-5 md:h-5" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(payment.id)}
//                             className="p-1 md:p-2 rounded-full hover:bg-red-100 text-red-600 hover:text-red-800"
//                             title="Delete"
//                           >
//                             <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
//                           </button>
//                           <button
//                             onClick={() => handleViewDetails(payment)}
//                             className="p-1 md:p-2 rounded-full hover:bg-cyan-100 text-cyan-600 hover:text-cyan-800"
//                             title="View Details"
//                           >
//                             <Eye className="w-4 h-4 md:w-5 md:h-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </Card>

//         {/* Modal for payment details */}
//         {viewPayment && (
//           <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//               <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-t-xl flex justify-between items-center">
//                 <h3 className="text-white text-lg md:text-xl font-bold flex items-center gap-2">
//                   <FileText className="w-5 h-5" />
//                   Payment Details
//                 </h3>
//                 <button
//                   className="text-white text-xl hover:text-gray-200"
//                   onClick={() => setViewPayment(null)}
//                   aria-label="Close"
//                 >
//                   &times;
//                 </button>
//               </div>
//               <div className="p-4 md:p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <DetailItem label="Voucher No" value={viewPayment.voucher_no} />
//                   <DetailItem label="Date" value={viewPayment.payment_date?.substring(0, 10)} />
//                   <DetailItem 
//                     label="Amount" 
//                     value={`$${parseFloat(viewPayment.amount).toFixed(2)}`} 
//                   />
//                   <DetailItem 
//                     label="Type" 
//                     value={getPaymentTypeName(viewPayment.payment_type_id)} 
//                   />
//                   <div className="md:col-span-2">
//                     <DetailItem label="Remarks" value={viewPayment.remarks || '-'} />
//                   </div>
//                 </div>
                
//                 <h4 className="font-bold text-gray-800 mb-3">Payment Details:</h4>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full border">
//                     <thead className="bg-gray-100">
//                       <tr>
//                         <th className="border px-2 py-1 text-left">Supplier</th>
//                         <th className="border px-2 py-1 text-left hidden md:table-cell">Operation No</th>
//                         <th className="border px-2 py-1 text-left hidden sm:table-cell">Receipt No</th>
//                         <th className="border px-2 py-1 text-left">Bill Amount</th>
//                         <th className="border px-2 py-1 text-left">Paid Amount</th>
//                         <th className="border px-2 py-1 text-left hidden md:table-cell">Balance</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {(viewPayment.details || []).map((d, i) => (
//                         <tr key={i}>
//                           <td className="border px-2 py-1 text-sm">
//                             {getSupplierName(d.supplier_id)}
//                           </td>
//                           <td className="border px-2 py-1 text-sm hidden md:table-cell">
//                             {d.operation_no || '-'}
//                           </td>
//                           <td className="border px-2 py-1 text-sm hidden sm:table-cell">
//                             {d.receipt_no || '-'}
//                           </td>
//                           <td className="border px-2 py-1 text-sm">
//                             ${parseFloat(d.bill_amount).toFixed(2)}
//                           </td>
//                           <td className="border px-2 py-1 text-sm">
//                             ${parseFloat(d.paid_amount).toFixed(2)}
//                           </td>
//                           <td className="border px-2 py-1 text-sm hidden md:table-cell">
//                             ${parseFloat(d.balance_amount).toFixed(2)}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// /* Reusable Components */
// const Card = ({ children }) => (
//   <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
//     {children}
//   </div>
// );

// const TextInput = ({ label, value, onChange, required = false }) => (
//   <div className="space-y-1">
//     <label className="block text-sm font-medium text-gray-700">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <input
//       type="text"
//       value={value}
//       onChange={onChange}
//       required={required}
//       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800"
//     />
//   </div>
// );

// const ActionButton = ({ children, onClick, disabled, type, className = '' }) => (
//   <button
//     type={type || 'button'}
//     onClick={onClick}
//     disabled={disabled}
//     className={`flex items-center justify-center gap-1 md:gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
//   >
//     {children}
//   </button>
// );

// const DetailItem = ({ label, value }) => (
//   <div className="flex flex-col">
//     <span className="text-sm font-medium text-gray-600">{label}</span>
//     <span className="text-base font-semibold text-gray-800">{value || '-'}</span>
//   </div>
// );

// export default SupplierPayment;


import React, { useState, useEffect } from 'react';
import {
  Search, Calendar, DollarSign, FileText, CheckCircle,
  Plus, X, Edit, Trash2, Loader2, Eye, ChevronDown, ChevronUp
} from 'lucide-react';

// Auth header utility
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Authentication token missing');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const API_URL = 'http://localhost:5000/api/supplier-payment/';
const API_SUPPLIERS = 'http://localhost:5000/api/suppliers';

const SupplierPayment = () => {
  // Form state
  const [searchTerm, setSearchTerm] = useState('');
  const [voucherNo, setVoucherNo] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [supplierPayments, setSupplierPayments] = useState([]);
  const [editId, setEditId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [viewPayment, setViewPayment] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [paymentTypes, setPaymentTypes] = useState([
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Bank Transfer' },
    { id: 3, name: 'Cheque' },
    { id: 4, name: 'Card' }
  ]);

  useEffect(() => {
    fetchPayments();
    fetchSuppliers();
  }, []);

  // Fetch suppliers for dropdown
  const fetchSuppliers = async () => {
    try {
      const res = await fetch(API_SUPPLIERS, { headers: getAuthHeaders() });
      const data = await res.json();
      setSuppliers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
      setSuppliers([]);
    }
  };

  // Fetch all payments
  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL, { headers: getAuthHeaders() });
      const data = await res.json();
      setSupplierPayments(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setErrorMsg('Failed to fetch payments.');
    }
    setIsLoading(false);
  };

  // Fetch a single payment by ID
  const fetchPaymentById = async (id) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}${id}`, { headers: getAuthHeaders() });
      const data = await res.json();
      return data;
    } catch (err) {
      setErrorMsg('Failed to fetch payment details.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Search payments
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchPayments();
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}?search=${encodeURIComponent(searchTerm)}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setSupplierPayments(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setErrorMsg('Search failed.');
    }
    setIsLoading(false);
  };

  // Add table row
  const addTableRow = () => {
    setTableData([
      ...tableData,
      {
        id: Date.now(),
        supplier_id: '',
        operation_no: '',
        receipt_no: '',
        bill_amount: '',
        paid_amount: '',
        balance_amount: '',
        amount: '',
        checked: false,
      },
    ]);
  };

  // Remove table row
  const removeTableRow = (id) => {
    setTableData(tableData.filter((row) => row.id !== id));
  };

  // Reset form
  const resetForm = () => {
    setVoucherNo('');
    setDate('');
    setAmount('');
    setRemarks('');
    setPaymentType('');
    setTotalAmount('');
    setTableData([]);
    setEditId(null);
    setErrorMsg('');
  };

  // Submit payment (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!voucherNo || !date || !paymentType) {
      setErrorMsg('Please fill all required fields');
      return;
    }
    
    if (tableData.length === 0) {
      setErrorMsg('Please add at least one payment detail');
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');
    
    const payload = {
      voucher_no: voucherNo,
      payment_date: date,
      amount: Number(totalAmount) || Number(amount) || 0,
      payment_type_id: paymentType,
      remarks: remarks,
      details: tableData.map((row) => ({
        supplier_id: row.supplier_id || 1,
        operation_no: row.operation_no,
        receipt_no: row.receipt_no,
        bill_amount: Number(row.bill_amount) || 0,
        paid_amount: Number(row.paid_amount) || 0,
        balance_amount: Number(row.balance_amount) || 0,
      })),
    };

    try {
      let res, data;
      const url = editId ? `${API_URL}${editId}` : API_URL;
      const method = editId ? 'PUT' : 'POST';
      
      res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      
      data = await res.json();
      
      if (res.ok) {
        setShowSuccess(true);
        fetchPayments();
        resetForm();
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setErrorMsg(data.error || data.message || 'Failed to save payment.');
      }
    } catch (err) {
      setErrorMsg('Save failed. Please check your connection.');
    }
    setIsLoading(false);
  };

  // Edit payment (load to form)
  const handleEdit = async (payment) => {
    setIsLoading(true);
    try {
      // Fetch full payment details including line items
      const fullPayment = await fetchPaymentById(payment.id);
      
      if (fullPayment) {
        setEditId(fullPayment.id);
        setVoucherNo(fullPayment.voucher_no || '');
        setDate(fullPayment.payment_date ? fullPayment.payment_date.substring(0, 10) : '');
        setAmount(fullPayment.amount || '');
        setRemarks(fullPayment.remarks || '');
        setPaymentType(fullPayment.payment_type_id || '');
        setTotalAmount(fullPayment.amount || '');
        
        // Set table data with full details
        setTableData(
          (fullPayment.details || []).map((d, i) => ({
            id: d.id || Date.now() + i,
            supplier_id: d.supplier_id,
            operation_no: d.operation_no,
            receipt_no: d.receipt_no,
            bill_amount: d.bill_amount,
            paid_amount: d.paid_amount,
            balance_amount: d.balance_amount,
            amount: d.paid_amount,
            checked: false,
          }))
        );
        
        setErrorMsg('');
        setIsCollapsed(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setErrorMsg('Failed to load payment details for editing.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete payment
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) return;
    setIsLoading(true);
    try {
      await fetch(`${API_URL}${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      fetchPayments();
    } catch (err) {
      setErrorMsg('Delete failed.');
    }
    setIsLoading(false);
  };

  // Table row value change
  const handleTableRowChange = (rowIndex, field, value) => {
    const updated = [...tableData];
    updated[rowIndex][field] = value;
    
    // Calculate balance if bill amount or paid amount changes
    if (field === 'bill_amount' || field === 'paid_amount') {
      const bill = parseFloat(updated[rowIndex].bill_amount) || 0;
      const paid = parseFloat(updated[rowIndex].paid_amount) || 0;
      updated[rowIndex].balance_amount = (bill - paid).toFixed(2);
    }
    
    setTableData(updated);
  };

  // View details for a previous payment
  const handleViewDetails = async (p) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}${p.id}`, { headers: getAuthHeaders() });
      const data = await res.json();
      setViewPayment(data);
    } catch {
      setViewPayment(p); // fallback to current payment object
    }
    setIsLoading(false);
  };

  // Get supplier name by id
  const getSupplierName = (id) => {
    const supplier = suppliers.find(s => String(s.id) === String(id));
    return supplier ? supplier.name : `Supplier ${id}`;
  };

  // Get payment type name by id
  const getPaymentTypeName = (id) => {
    const type = paymentTypes.find(t => t.id == id);
    return type ? type.name : `Type ${id}`;
  };

  // Toggle form collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 text-indigo-600" />
              SUPPLIER PAYMENT
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Manage supplier payments and voucher details.
            </p>
          </div>
          
          <button
            onClick={toggleCollapse}
            className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Show Form</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Hide Form</span>
              </>
            )}
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 rounded px-4 py-3 bg-red-100 text-red-800 border border-red-200 text-center shadow">{errorMsg}</div>
        )}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-transform duration-300 animate-pulse">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Payment processed successfully!</span>
            </div>
          </div>
        )}

        {/* Search Section */}
        <Card>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 md:p-6 rounded-t-xl">
            <h2 className="text-white text-lg md:text-xl font-bold flex items-center">
              <Search className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Search Payments
            </h2>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier Name / Voucher No
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Supplier Name or Voucher No"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800"
                />
              </div>
              <div className="flex items-end">
                <ActionButton onClick={handleSearch} disabled={isLoading} className="w-full md:w-auto">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>Search</span>
                </ActionButton>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Form - Collapsible */}
        {!isCollapsed && (
          <form onSubmit={handleSubmit}>
            {/* Payment Details Form */}
            <Card>
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 md:p-6 rounded-t-xl">
                <h2 className="text-white text-lg md:text-xl font-bold">
                  {editId ? 'Edit Payment' : 'Create New Payment'}
                </h2>
              </div>
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <TextInput
                  label="Voucher No *"
                  value={voucherNo}
                  onChange={(e) => setVoucherNo(e.target.value)}
                  required
                />
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800"
                      required
                    />
                    <Calendar className="absolute right-3 top-3 w-4 h-4 md:w-5 md:h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="space-y-1 md:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Enter remarks"
                      rows="2"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800 resize-none"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Details Table */}
            <Card>
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 md:p-6 rounded-t-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <h2 className="text-white text-lg md:text-xl font-bold">Payment Details Table</h2>
                <ActionButton type="button" onClick={addTableRow} className="bg-cyan-500 text-white px-3 py-1 rounded inline-flex items-center space-x-1">
                  <Plus className="w-4 h-4" />
                  <span>Add Row</span>
                </ActionButton>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm font-semibold">
                    <tr>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-left">Sl.No</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-left">Supplier</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-left hidden md:table-cell">Operation No</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-left hidden md:table-cell">Receipt No</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-left">Bill Amount</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-left">Paid Amount</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-left hidden md:table-cell">Balance</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tableData.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                          No payment details added. Click "Add Row" to add details.
                        </td>
                      </tr>
                    ) : (
                      tableData.map((row, index) => (
                        <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-900">{index + 1}</td>
                          <td className="px-3 py-2 md:px-4 md:py-3">
                            <select
                              value={row.supplier_id}
                              onChange={e => handleTableRowChange(index, 'supplier_id', e.target.value)}
                              className="w-full px-2 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-300 text-xs md:text-sm text-gray-800"
                              required
                            >
                              <option value="">Select Supplier</option>
                              {suppliers.map(sup => (
                                <option key={sup.id} value={sup.id}>{sup.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2 md:px-4 md:py-3 hidden md:table-cell">
                            <input
                              type="text"
                              placeholder="Op. No"
                              value={row.operation_no}
                              onChange={(e) => handleTableRowChange(index, 'operation_no', e.target.value)}
                              className="w-full px-2 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-xs md:text-sm text-gray-800"
                            />
                          </td>
                          <td className="px-3 py-2 md:px-4 md:py-3 hidden md:table-cell">
                            <input
                              type="text"
                              placeholder="Receipt No"
                              value={row.receipt_no}
                              onChange={(e) => handleTableRowChange(index, 'receipt_no', e.target.value)}
                              className="w-full px-2 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-xs md:text-sm text-gray-800"
                            />
                          </td>
                          <td className="px-3 py-2 md:px-4 md:py-3">
                            <input
                              type="number"
                              placeholder="0.00"
                              value={row.bill_amount}
                              onChange={(e) => handleTableRowChange(index, 'bill_amount', e.target.value)}
                              className="w-full px-2 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-xs md:text-sm text-gray-800"
                              min="0"
                              step="0.01"
                              required
                            />
                          </td>
                          <td className="px-3 py-2 md:px-4 md:py-3">
                            <input
                              type="number"
                              placeholder="0.00"
                              value={row.paid_amount}
                              onChange={(e) => handleTableRowChange(index, 'paid_amount', e.target.value)}
                              className="w-full px-2 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-xs md:text-sm text-gray-800"
                              min="0"
                              step="0.01"
                              required
                            />
                          </td>
                          <td className="px-3 py-2 md:px-4 md:py-3 hidden md:table-cell">
                            <input
                              type="number"
                              placeholder="0.00"
                              value={row.balance_amount}
                              readOnly
                              className="w-full px-2 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs md:text-sm text-gray-800"
                            />
                          </td>
                          <td className="px-3 py-2 md:px-4 md:py-3 text-center">
                            <button
                              type="button"
                              onClick={() => removeTableRow(row.id)}
                              className="text-red-500 hover:text-red-700 transition-colors duration-200"
                              title="Remove row"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Bottom Summary Section */}
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Type *
                  </label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800"
                    required
                  >
                    <option value="">--Select--</option>
                    {paymentTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <input
                      type="number"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 flex-wrap">
                  <ActionButton
                    type="button"
                    onClick={resetForm}
                    disabled={isLoading}
                    className="bg-gray-500"
                  >
                    <X className="w-4 h-4 md:w-5 md:h-5" />
                    Cancel
                  </ActionButton>
                  <ActionButton type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                    <span>{editId ? 'Update Payment' : 'Submit Payment'}</span>
                  </ActionButton>
                </div>
              </div>
            </Card>
          </form>
        )}

        {/* All Payments List Table */}
        <Card>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 md:p-6 rounded-t-xl">
            <h2 className="text-white text-lg md:text-xl font-bold">All Supplier Payments</h2>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 text-gray-700 text-xs md:text-sm font-semibold">
                <tr>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left">Voucher No</th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left hidden md:table-cell">Date</th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left">Amount</th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left hidden sm:table-cell">Type</th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left hidden lg:table-cell">Remarks</th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center">
                      <Loader2 className="w-8 h-8 mx-auto animate-spin text-indigo-600" />
                    </td>
                  </tr>
                ) : supplierPayments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  supplierPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 md:px-4 md:py-3 text-sm font-medium text-gray-900">
                        {payment.voucher_no}
                      </td>
                      <td className="px-3 py-2 md:px-4 md:py-3 hidden md:table-cell">
                        {payment.payment_date?.substring(0, 10)}
                      </td>
                      <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-900">
                        ${parseFloat(payment.amount).toFixed(2)}
                      </td>
                      <td className="px-3 py-2 md:px-4 md:py-3 hidden sm:table-cell">
                        {getPaymentTypeName(payment.payment_type_id)}
                      </td>
                      <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-500 truncate max-w-xs hidden lg:table-cell">
                        {payment.remarks || '-'}
                      </td>
                      <td className="px-3 py-2 md:px-4 md:py-3 text-sm">
                        <div className="flex gap-1 md:gap-2">
                          <button
                            onClick={() => handleEdit(payment)}
                            className="p-1 md:p-2 rounded-full hover:bg-indigo-100 text-indigo-600 hover:text-indigo-800"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(payment.id)}
                            className="p-1 md:p-2 rounded-full hover:bg-red-100 text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <button
                            onClick={() => handleViewDetails(payment)}
                            className="p-1 md:p-2 rounded-full hover:bg-cyan-100 text-cyan-600 hover:text-cyan-800"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal for payment details */}
        {viewPayment && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-t-xl flex justify-between items-center">
                <h3 className="text-white text-lg md:text-xl font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Payment Details
                </h3>
                <button
                  className="text-white text-xl hover:text-gray-200"
                  onClick={() => setViewPayment(null)}
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <DetailItem label="Voucher No" value={viewPayment.voucher_no} />
                  <DetailItem label="Date" value={viewPayment.payment_date?.substring(0, 10)} />
                  <DetailItem 
                    label="Amount" 
                    value={`$${parseFloat(viewPayment.amount).toFixed(2)}`} 
                  />
                  <DetailItem 
                    label="Type" 
                    value={getPaymentTypeName(viewPayment.payment_type_id)} 
                  />
                  <div className="md:col-span-2">
                    <DetailItem label="Remarks" value={viewPayment.remarks || '-'} />
                  </div>
                </div>
                
                <h4 className="font-bold text-gray-800 mb-3">Payment Details:</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1 text-left">Supplier</th>
                        <th className="border px-2 py-1 text-left hidden md:table-cell">Operation No</th>
                        <th className="border px-2 py-1 text-left hidden sm:table-cell">Receipt No</th>
                        <th className="border px-2 py-1 text-left">Bill Amount</th>
                        <th className="border px-2 py-1 text-left">Paid Amount</th>
                        <th className="border px-2 py-1 text-left hidden md:table-cell">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(viewPayment.details || []).map((d, i) => (
                        <tr key={i}>
                          <td className="border px-2 py-1 text-sm">
                            {getSupplierName(d.supplier_id)}
                          </td>
                          <td className="border px-2 py-1 text-sm hidden md:table-cell">
                            {d.operation_no || '-'}
                          </td>
                          <td className="border px-2 py-1 text-sm hidden sm:table-cell">
                            {d.receipt_no || '-'}
                          </td>
                          <td className="border px-2 py-1 text-sm">
                            ${parseFloat(d.bill_amount).toFixed(2)}
                          </td>
                          <td className="border px-2 py-1 text-sm">
                            ${parseFloat(d.paid_amount).toFixed(2)}
                          </td>
                          <td className="border px-2 py-1 text-sm hidden md:table-cell">
                            ${parseFloat(d.balance_amount).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

/* Reusable Components */
const Card = ({ children }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
    {children}
  </div>
);

const TextInput = ({ label, value, onChange, required = false }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800"
    />
  </div>
);

const ActionButton = ({ children, onClick, disabled, type, className = '' }) => (
  <button
    type={type || 'button'}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center gap-1 md:gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

const DetailItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm font-medium text-gray-600">{label}</span>
    <span className="text-base font-semibold text-gray-800">{value || '-'}</span>
  </div>
);

export default SupplierPayment;