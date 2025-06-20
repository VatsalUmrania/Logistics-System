// import { Search, Eye, Calendar, FileText, DollarSign, Hash, User, Trash2, Edit, Plus } from 'lucide-react';
// import React, { useState, useEffect } from 'react';

// const API_URL = 'http://localhost:5000/api';

// const getAuthHeaders = () => {
//   const token = localStorage.getItem('authToken');
//   if (!token) throw new Error('Authentication token missing');
//   return {
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json'
//   };
// };

// const SupplierInvoiceEdit = () => {
//   const [supplierName, setSupplierName] = useState('');
//   const [jobNo, setJobNo] = useState('');
//   const [invoiceNo, setInvoiceNo] = useState('');
//   const [isLoading, setIsLoading] = useState({
//     supplier: false,
//     job: false,
//     invoice: false,
//     table: false
//   });
//   const [invoices, setInvoices] = useState([]);
//   const [suppliers, setSuppliers] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentInvoice, setCurrentInvoice] = useState(null);
//   const [isViewMode, setIsViewMode] = useState(false);
//   const [vatInputMode, setVatInputMode] = useState('value'); // 'value' or 'percent'

//   // Fetch invoices and suppliers
//   useEffect(() => {
//     fetchInvoices();
//     fetchSuppliers();
//     // eslint-disable-next-line
//   }, []);

//   const fetchInvoices = async (params = {}) => {
//     setIsLoading(prev => ({ ...prev, table: true }));
//     try {
//       let url = `${API_URL}/invoices`;
//       if (Object.keys(params).length) {
//         const query = new URLSearchParams(params).toString();
//         url += `?${query}`;
//       }
//       const response = await fetch(url, { headers: getAuthHeaders() });
//       const data = await response.json();
//       setInvoices(Array.isArray(data) ? data : data.data || []);
//     } catch (error) {
//       console.error('Error fetching invoices:', error);
//       setInvoices([]);
//     } finally {
//       setIsLoading(prev => ({ ...prev, table: false }));
//     }
//   };

//   const fetchSuppliers = async () => {
//     try {
//       const response = await fetch(`${API_URL}/suppliers`, { headers: getAuthHeaders() });
//       const data = await response.json();
//       setSuppliers(Array.isArray(data) ? data : data.data || []);
//     } catch (error) {
//       console.error('Error fetching suppliers:', error);
//       setSuppliers([]);
//     }
//   };

//   const handleSearch = (type) => {
//     setIsLoading(prev => ({ ...prev, [type]: true }));

//     const params = {};
//     if (type === 'supplier' && supplierName) params.supplier = supplierName;
//     if (type === 'job' && jobNo) params.job_no = jobNo;
//     if (type === 'invoice' && invoiceNo) params.invoice_no = invoiceNo;

//     fetchInvoices(params);
//     setIsLoading(prev => ({ ...prev, [type]: false }));
//   };

//   const handleCreate = () => {
//     setCurrentInvoice({
//       job_number: '',
//       invoice_no: '',
//       invoice_date: new Date().toISOString().split('T')[0],
//       bill_amount_without_vat: '',
//       vat_amount: '',
//       bill_amount: '',
//       supplier_id: ''
//     });
//     setVatInputMode('value');
//     setIsViewMode(false);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (invoice) => {
//     setCurrentInvoice({
//       ...invoice,
//       invoice_date: invoice.invoice_date // Should be YYYY-MM-DD already
//     });
//     setVatInputMode('value');
//     setIsViewMode(false);
//     setIsModalOpen(true);
//   };

//   const handleView = (invoice) => {
//     setCurrentInvoice(invoice);
//     setIsViewMode(true);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this invoice?')) {
//       try {
//         await fetch(`${API_URL}/invoices/${id}`, {
//           method: 'DELETE',
//           headers: getAuthHeaders()
//         });
//         fetchInvoices();
//       } catch (error) {
//         console.error('Error deleting invoice:', error);
//       }
//     }
//   };

//   // Auto-calculate Bill Amount and VAT (if percent mode)
//   useEffect(() => {
//     if (!currentInvoice) return;
//     let billWithoutVat = parseFloat(currentInvoice.bill_amount_without_vat) || 0;
//     let vatAmount = parseFloat(currentInvoice.vat_amount) || 0;

//     if (vatInputMode === 'percent') {
//       // If percent (e.g., you input 5, means 5%)
//       vatAmount = billWithoutVat * ((parseFloat(currentInvoice.vat_amount) || 0) / 100);
//     }
//     const billAmount = billWithoutVat + vatAmount;

//     setCurrentInvoice(inv => ({
//       ...inv,
//       bill_amount: isNaN(billAmount) ? '' : billAmount.toFixed(2),
//       vat_amount: vatInputMode === 'percent' ? (inv.vat_amount || '') : (isNaN(vatAmount) ? '' : vatAmount.toFixed(2))
//     }));
//     // eslint-disable-next-line
//   }, [currentInvoice?.bill_amount_without_vat, currentInvoice?.vat_amount, vatInputMode]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentInvoice(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleVatModeChange = (e) => {
//     setVatInputMode(e.target.value);
//     // When switching VAT mode, reset vat_amount to empty
//     setCurrentInvoice(inv => ({
//       ...inv,
//       vat_amount: ''
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Calculate final vat_amount value (in value, not percent)
//     let billWithoutVat = parseFloat(currentInvoice.bill_amount_without_vat) || 0;
//     let vatAmount = parseFloat(currentInvoice.vat_amount) || 0;
//     if (vatInputMode === 'percent') {
//       vatAmount = billWithoutVat * ((parseFloat(currentInvoice.vat_amount) || 0) / 100);
//     }

//     const invoiceData = {
//       job_number: currentInvoice.job_number,
//       invoice_no: currentInvoice.invoice_no,
//       invoice_date: currentInvoice.invoice_date,
//       bill_amount_without_vat: billWithoutVat,
//       vat_amount: vatAmount,
//       bill_amount: billWithoutVat + vatAmount,
//       supplier_id: currentInvoice.supplier_id || null
//     };

//     try {
//       if (currentInvoice.id) {
//         await fetch(`${API_URL}/invoices/${currentInvoice.id}`, {
//           method: 'PUT',
//           headers: getAuthHeaders(),
//           body: JSON.stringify(invoiceData)
//         });
//       } else {
//         await fetch(`${API_URL}/invoices`, {
//           method: 'POST',
//           headers: getAuthHeaders(),
//           body: JSON.stringify(invoiceData)
//         });
//       }
//       setIsModalOpen(false);
//       fetchInvoices();
//     } catch (error) {
//       console.error('Error saving invoice:', error);
//     }
//   };

//   const calculateTotal = (field) => {
//     return invoices.reduce((sum, invoice) => sum + parseFloat(invoice[field] || 0), 0).toFixed(2);
//   };

//   const SearchCard = ({ title, placeholder, value, onChange, searchType, icon: Icon }) => (
//     <div className="bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
//       <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-4 rounded-xl mb-6 flex items-center gap-3">
//         <Icon className="w-5 h-5" />
//         <h3 className="text-lg font-semibold">{title}</h3>
//       </div>
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             {title.replace('Search By ', '')} <span className="text-red-500">*</span>
//           </label>
//           <div className="flex gap-3">
//             <div className="relative flex-1">
//               <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 value={value}
//                 onChange={onChange}
//                 placeholder={placeholder}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
//               />
//             </div>
//             <button
//               onClick={() => handleSearch(searchType)}
//               disabled={isLoading[searchType]}
//               className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//             >
//               {isLoading[searchType] ? (
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//               ) : (
//                 <Search className="w-4 h-4" />
//               )}
//               Search
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Supplier Invoices</h1>
//             <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
//           </div>
//           <button
//             onClick={handleCreate}
//             className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:from-green-600 hover:to-green-700 flex items-center gap-2 self-start"
//           >
//             <Plus className="w-4 h-4" />
//             Add New Invoice
//           </button>
//         </div>
        
//         {/* Invoice Table */}
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
//           <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4">
//             <h2 className="text-xl font-semibold text-white flex items-center gap-3">
//               <FileText className="w-5 h-5 md:w-6 md:h-6" />
//               Invoice Records
//             </h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1000px] md:min-w-0">
//               <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//                 <tr>
//                   <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl.No</th>
//                   <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Number</th>
//                   <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice No</th>
//                   <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Date</th>
//                   <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Amt Without Vat</th>
//                   <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vat Amount</th>
//                   <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Amount</th>
//                   <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {invoices.length > 0 ? (
//                   invoices.map((invoice) => (
//                     <tr
//                       key={invoice.id}
//                       className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300"
//                     >
//                       <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {invoice.id}
//                       </td>
//                       <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
//                         {invoice.job_number}
//                       </td>
//                       <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
//                         {invoice.invoice_no}
//                       </td>
//                       <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center gap-2">
//                           <Calendar className="w-4 h-4 text-gray-400" />
//                           {invoice.invoice_date}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center gap-2">
//                           <DollarSign className="w-4 h-4 text-green-500" />
//                           <span className="font-medium">{parseFloat(invoice.bill_amount_without_vat || 0).toFixed(2)}</span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center gap-2">
//                           <DollarSign className="w-4 h-4 text-orange-500" />
//                           <span className="font-medium">{parseFloat(invoice.vat_amount || 0).toFixed(2)}</span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center gap-2">
//                           <DollarSign className="w-4 h-4 text-blue-500" />
//                           <span className="font-bold text-blue-600">{parseFloat(invoice.bill_amount || 0).toFixed(2)}</span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm flex gap-2">
//                         <button
//                           onClick={() => handleView(invoice)}
//                           className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded-lg hover:from-green-600 hover:to-green-700 transform transition-all duration-200 hover:scale-110 active:scale-95"
//                           title="View"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleEdit(invoice)}
//                           className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transform transition-all duration-200 hover:scale-110 active:scale-95"
//                           title="Edit"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(invoice.id)}
//                           className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2 rounded-lg hover:from-red-600 hover:to-red-700 transform transition-all duration-200 hover:scale-110 active:scale-95"
//                           title="Delete"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
//                       {isLoading.table ? 'Loading invoices...' : 'No invoices found'}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           {/* Table Footer */}
//           <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 md:px-6 md:py-4">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-sm text-gray-600">
//               <span>Showing {invoices.length} entries</span>
//               <div className="flex flex-wrap gap-4">
//                 <div className="flex items-center gap-2">
//                   <span className="font-medium">Total Without VAT:</span>
//                   <span className="font-bold text-green-600">
//                     ${calculateTotal('bill_amount_without_vat')}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="font-medium">Total VAT:</span>
//                   <span className="font-bold text-orange-600">
//                     ${calculateTotal('vat_amount')}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="font-medium">Grand Total:</span>
//                   <span className="font-bold text-blue-600 text-lg">
//                     ${calculateTotal('bill_amount')}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Invoice Modal */}
//       {isModalOpen && currentInvoice && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className={`p-4 rounded-t-2xl text-white flex justify-between items-center
//               ${isViewMode ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}>
//               <h2 className="text-xl font-semibold">
//                 {isViewMode ? 'Invoice Details' : (currentInvoice.id ? 'Edit Invoice' : 'Create Invoice')}
//               </h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-white hover:text-gray-200 text-2xl"
//               >
//                 &times;
//               </button>
//             </div>
//             <div className="p-4 md:p-6">
//               {isViewMode ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-1">
//                     <label className="block text-sm text-gray-600">Supplier Name</label>
//                     <p className="font-medium">{currentInvoice.supplier_name || 'N/A'}</p>
//                   </div>
//                   <div className="space-y-1">
//                     <label className="block text-sm text-gray-600">Job Number</label>
//                     <p className="font-mono font-medium">{currentInvoice.job_number}</p>
//                   </div>
//                   <div className="space-y-1">
//                     <label className="block text-sm text-gray-600">Invoice Number</label>
//                     <p className="font-semibold">{currentInvoice.invoice_no}</p>
//                   </div>
//                   <div className="space-y-1">
//                     <label className="block text-sm text-gray-600">Invoice Date</label>
//                     <p className="flex items-center gap-2">
//                       <Calendar className="w-4 h-4 text-gray-400" />
//                       {currentInvoice.invoice_date}
//                     </p>
//                   </div>
//                   <div className="space-y-1">
//                     <label className="block text-sm text-gray-600">Bill Amount Without VAT</label>
//                     <p className="flex items-center gap-2">
//                       <DollarSign className="w-4 h-4 text-green-500" />
//                       <span className="font-medium">{parseFloat(currentInvoice.bill_amount_without_vat || 0).toFixed(2)}</span>
//                     </p>
//                   </div>
//                   <div className="space-y-1">
//                     <label className="block text-sm text-gray-600">VAT Amount</label>
//                     <p className="flex items-center gap-2">
//                       <DollarSign className="w-4 h-4 text-orange-500" />
//                       <span className="font-medium">{parseFloat(currentInvoice.vat_amount || 0).toFixed(2)}</span>
//                     </p>
//                   </div>
//                   <div className="space-y-1">
//                     <label className="block text-sm text-gray-600">Bill Amount</label>
//                     <p className="flex items-center gap-2">
//                       <DollarSign className="w-4 h-4 text-blue-500" />
//                       <span className="font-bold text-blue-600">{parseFloat(currentInvoice.bill_amount || 0).toFixed(2)}</span>
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 <form onSubmit={handleSubmit}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">
//                         Supplier Name
//                       </label>
//                       <select
//                         name="supplier_id"
//                         value={currentInvoice.supplier_id || ''}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       >
//                         <option value="">Select Supplier</option>
//                         {suppliers.map(supplier => (
//                           <option key={supplier.id} value={supplier.id}>
//                             {supplier.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">
//                         Job Number <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="job_number"
//                         value={currentInvoice.job_number}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">
//                         Invoice Number <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="invoice_no"
//                         value={currentInvoice.invoice_no}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">
//                         Invoice Date <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="date"
//                         name="invoice_date"
//                         value={currentInvoice.invoice_date}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">
//                         Bill Amount Without VAT <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="number"
//                         step="0.01"
//                         name="bill_amount_without_vat"
//                         value={currentInvoice.bill_amount_without_vat}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">
//                         VAT Amount <span className="text-red-500">*</span>
//                       </label>
//                       <div className="flex gap-2">
//                         <input
//                           type="number"
//                           step="0.01"
//                           name="vat_amount"
//                           value={currentInvoice.vat_amount}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           placeholder={vatInputMode === "percent" ? "VAT %" : "VAT Value"}
//                         />
//                         <select
//                           value={vatInputMode}
//                           onChange={handleVatModeChange}
//                           className="px-2 py-1 border rounded"
//                         >
//                           <option value="value">Value</option>
//                           <option value="percent">Percent</option>
//                         </select>
//                       </div>
//                     </div>
//                     <div className="space-y-2 md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700">
//                         Bill Amount <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="number"
//                         step="0.01"
//                         name="bill_amount"
//                         value={currentInvoice.bill_amount}
//                         readOnly
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
//                       />
//                     </div>
//                   </div>
//                   <div className="mt-6 flex justify-end gap-3">
//                     <button
//                       type="button"
//                       onClick={() => setIsModalOpen(false)}
//                       className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700"
//                     >
//                       Save Invoice
//                     </button>
//                   </div>
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SupplierInvoiceEdit;


import { Search, Eye, Calendar, FileText, DollarSign, Hash, User, Trash2, Edit, Plus, X, ArrowUp, ArrowDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Authentication token missing');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const PAGE_SIZE = 10;

const SupplierInvoiceEdit = () => {
  const [supplierName, setSupplierName] = useState('');
  const [jobNo, setJobNo] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [slNoFilter, setSlNoFilter] = useState('');
  const [invoiceNoFilter, setInvoiceNoFilter] = useState('');
  const [isLoading, setIsLoading] = useState({
    supplier: false,
    job: false,
    invoice: false,
    table: false
  });
  const [invoices, setInvoices] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [vatInputMode, setVatInputMode] = useState('value');
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting state
  const [sortColumn, setSortColumn] = useState('slNo'); // 'slNo' or 'invoice_no'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  // Fetch invoices and suppliers
  useEffect(() => {
    fetchInvoices();
    fetchSuppliers();
    // eslint-disable-next-line
  }, []);

  const fetchInvoices = async (params = {}) => {
    setIsLoading(prev => ({ ...prev, table: true }));
    try {
      let url = `${API_URL}/invoices`;
      if (Object.keys(params).length) {
        const query = new URLSearchParams(params).toString();
        url += `?${query}`;
      }
      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await response.json();
      setInvoices(Array.isArray(data) ? data : data.data || []);
      setCurrentPage(1); // Reset to first page on new fetch
    } catch (error) {
      setInvoices([]);
    } finally {
      setIsLoading(prev => ({ ...prev, table: false }));
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${API_URL}/suppliers`, { headers: getAuthHeaders() });
      const data = await response.json();
      setSuppliers(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      setSuppliers([]);
    }
  };

  const handleSearch = (type) => {
    setIsLoading(prev => ({ ...prev, [type]: true }));

    const params = {};
    if (type === 'supplier' && supplierName) params.supplier = supplierName;
    if (type === 'job' && jobNo) params.job_no = jobNo;
    if (type === 'invoice' && invoiceNo) params.invoice_no = invoiceNo;

    fetchInvoices(params);
    setIsLoading(prev => ({ ...prev, [type]: false }));
  };

  const handleCreate = () => {
    setCurrentInvoice({
      job_number: '',
      invoice_no: '',
      invoice_date: new Date().toISOString().split('T')[0],
      bill_amount_without_vat: '',
      vat_amount: '',
      bill_amount: '',
      supplier_id: ''
    });
    setVatInputMode('value');
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (invoice) => {
    setCurrentInvoice({
      ...invoice,
      invoice_date: invoice.invoice_date
    });
    setVatInputMode('value');
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (invoice) => {
    setCurrentInvoice(invoice);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await fetch(`${API_URL}/invoices/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        fetchInvoices();
      } catch (error) {}
    }
  };

  // Auto-calculate Bill Amount and VAT (if percent mode)
  useEffect(() => {
    if (!currentInvoice) return;
    let billWithoutVat = parseFloat(currentInvoice.bill_amount_without_vat) || 0;
    let vatAmount = parseFloat(currentInvoice.vat_amount) || 0;

    if (vatInputMode === 'percent') {
      vatAmount = billWithoutVat * ((parseFloat(currentInvoice.vat_amount) || 0) / 100);
    }
    const billAmount = billWithoutVat + vatAmount;

    setCurrentInvoice(inv => ({
      ...inv,
      bill_amount: isNaN(billAmount) ? '' : billAmount.toFixed(2),
      vat_amount: vatInputMode === 'percent' ? (inv.vat_amount || '') : (isNaN(vatAmount) ? '' : vatAmount.toFixed(2))
    }));
    // eslint-disable-next-line
  }, [currentInvoice?.bill_amount_without_vat, currentInvoice?.vat_amount, vatInputMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentInvoice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVatModeChange = (e) => {
    setVatInputMode(e.target.value);
    setCurrentInvoice(inv => ({
      ...inv,
      vat_amount: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let billWithoutVat = parseFloat(currentInvoice.bill_amount_without_vat) || 0;
    let vatAmount = parseFloat(currentInvoice.vat_amount) || 0;
    if (vatInputMode === 'percent') {
      vatAmount = billWithoutVat * ((parseFloat(currentInvoice.vat_amount) || 0) / 100);
    }

    const invoiceData = {
      job_number: currentInvoice.job_number,
      invoice_no: currentInvoice.invoice_no,
      invoice_date: currentInvoice.invoice_date,
      bill_amount_without_vat: billWithoutVat,
      vat_amount: vatAmount,
      bill_amount: billWithoutVat + vatAmount,
      supplier_id: currentInvoice.supplier_id || null
    };

    try {
      if (currentInvoice.id) {
        await fetch(`${API_URL}/invoices/${currentInvoice.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(invoiceData)
        });
      } else {
        await fetch(`${API_URL}/invoices`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(invoiceData)
        });
      }
      setIsModalOpen(false);
      fetchInvoices();
    } catch (error) {}
  };

  const calculateTotal = (field) => {
    return invoices.reduce((sum, invoice) => sum + parseFloat(invoice[field] || 0), 0).toFixed(2);
  };

  // Filtering (client-side, for SL.No and Invoice No)
  const withSlNo = invoices.map((invoice, idx) => ({ ...invoice, slNo: idx + 1 }));
  let filteredInvoices = withSlNo.filter(inv => {
    if (slNoFilter && String(inv.slNo) !== String(slNoFilter)) return false;
    if (invoiceNoFilter && !inv.invoice_no?.toLowerCase().includes(invoiceNoFilter.toLowerCase())) return false;
    return true;
  });

  // Sorting
  filteredInvoices = filteredInvoices.sort((a, b) => {
    let valA, valB;
    if (sortColumn === 'slNo') {
      valA = a.slNo;
      valB = b.slNo;
    } else if (sortColumn === 'invoice_no') {
      valA = a.invoice_no ? a.invoice_no.toLowerCase() : '';
      valB = b.invoice_no ? b.invoice_no.toLowerCase() : '';
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / PAGE_SIZE);
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [slNoFilter, invoiceNoFilter, sortColumn, sortOrder]);

  // Sorting toggle
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  // Render sort icon
  const renderSortIcon = (column) => {
    if (sortColumn !== column) return <ArrowUp className="inline w-3 h-3 text-gray-400" />;
    return sortOrder === 'asc' ?
      <ArrowUp className="inline w-3 h-3 text-blue-600" /> :
      <ArrowDown className="inline w-3 h-3 text-blue-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Supplier Invoices</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </div>
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:from-green-600 hover:to-green-700 flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4" />
            Add New Invoice
          </button>
        </div>
        {/* Filters for SL.No and Invoice No */}
        <div className="flex gap-4 mb-4 items-center flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">SL.No</label>
            <input
              type="number"
              min="1"
              value={slNoFilter}
              onChange={e => setSlNoFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
              placeholder="SL.No"
            />
            {slNoFilter && (
              <button className="ml-1 p-1 rounded hover:bg-gray-200" onClick={() => setSlNoFilter('')}>
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Invoice No</label>
            <input
              type="text"
              value={invoiceNoFilter}
              onChange={e => setInvoiceNoFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent w-36"
              placeholder="Invoice No"
            />
            {invoiceNoFilter && (
              <button className="ml-1 p-1 rounded hover:bg-gray-200" onClick={() => setInvoiceNoFilter('')}>
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>
        {/* Invoice Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <FileText className="w-5 h-5 md:w-6 md:h-6" />
              Invoice Records
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] md:min-w-0">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('slNo')}>
                    Sl.No {renderSortIcon('slNo')}
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Number</th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('invoice_no')}>
                    Invoice No {renderSortIcon('invoice_no')}
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Date</th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Amt Without Vat</th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vat Amount</th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Amount</th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedInvoices.length > 0 ? (
                  paginatedInvoices.map((invoice, idx) => (
                    <tr
                      key={invoice.id}
                      className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300"
                    >
                      <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.slNo}
                      </td>
                      <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                        {invoice.job_number}
                      </td>
                      <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                        {invoice.invoice_no}
                      </td>
                      <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {invoice.invoice_date}
                        </div>
                      </td>
                      <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="font-medium">{parseFloat(invoice.bill_amount_without_vat || 0).toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">{parseFloat(invoice.vat_amount || 0).toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-blue-500" />
                          <span className="font-bold text-blue-600">{parseFloat(invoice.bill_amount || 0).toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm flex gap-2">
                        <button
                          onClick={() => handleView(invoice)}
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded-lg hover:from-green-600 hover:to-green-700 transform transition-all duration-200 hover:scale-110 active:scale-95"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transform transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2 rounded-lg hover:from-red-600 hover:to-red-700 transform transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      {isLoading.table ? 'Loading invoices...' : 'No invoices found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center px-4 py-2 border-t border-gray-100 bg-white">
            <span className="text-sm text-gray-600">Page {currentPage} of {totalPages || 1}</span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className={`px-3 py-1.5 rounded transition text-sm font-medium ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
              >Previous</button>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className={`px-3 py-1.5 rounded transition text-sm font-medium ${currentPage === totalPages || totalPages === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
              >Next</button>
            </div>
          </div>
          {/* Table Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 md:px-6 md:py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-sm text-gray-600">
              <span>Showing {paginatedInvoices.length} of {filteredInvoices.length} entries</span>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Total Without VAT:</span>
                  <span className="font-bold text-green-600">
                    ${calculateTotal('bill_amount_without_vat')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Total VAT:</span>
                  <span className="font-bold text-orange-600">
                    ${calculateTotal('vat_amount')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Grand Total:</span>
                  <span className="font-bold text-blue-600 text-lg">
                    ${calculateTotal('bill_amount')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Invoice Modal */}
      {isModalOpen && currentInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className={`p-4 rounded-t-2xl text-white flex justify-between items-center
              ${isViewMode ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}>
              <h2 className="text-xl font-semibold">
                {isViewMode ? 'Invoice Details' : (currentInvoice.id ? 'Edit Invoice' : 'Create Invoice')}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-200 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-4 md:p-6">
              {isViewMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm text-gray-600">Supplier Name</label>
                    <p className="font-medium">{currentInvoice.supplier_name || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm text-gray-600">Job Number</label>
                    <p className="font-mono font-medium">{currentInvoice.job_number}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm text-gray-600">Invoice Number</label>
                    <p className="font-semibold">{currentInvoice.invoice_no}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm text-gray-600">Invoice Date</label>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {currentInvoice.invoice_date}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm text-gray-600">Bill Amount Without VAT</label>
                    <p className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{parseFloat(currentInvoice.bill_amount_without_vat || 0).toFixed(2)}</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm text-gray-600">VAT Amount</label>
                    <p className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-orange-500" />
                      <span className="font-medium">{parseFloat(currentInvoice.vat_amount || 0).toFixed(2)}</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm text-gray-600">Bill Amount</label>
                    <p className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-blue-600">{parseFloat(currentInvoice.bill_amount || 0).toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Supplier Name
                      </label>
                      <select
                        name="supplier_id"
                        value={currentInvoice.supplier_id || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Supplier</option>
                        {suppliers.map(supplier => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Job Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="job_number"
                        value={currentInvoice.job_number}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Invoice Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="invoice_no"
                        value={currentInvoice.invoice_no}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Invoice Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="invoice_date"
                        value={currentInvoice.invoice_date}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Bill Amount Without VAT <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="bill_amount_without_vat"
                        value={currentInvoice.bill_amount_without_vat}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        VAT Amount <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.01"
                          name="vat_amount"
                          value={currentInvoice.vat_amount}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={vatInputMode === "percent" ? "VAT %" : "VAT Value"}
                        />
                        <select
                          value={vatInputMode}
                          onChange={handleVatModeChange}
                          className="px-2 py-1 border rounded"
                        >
                          <option value="value">Value</option>
                          <option value="percent">Percent</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Bill Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="bill_amount"
                        value={currentInvoice.bill_amount}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700"
                    >
                      Save Invoice
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierInvoiceEdit;