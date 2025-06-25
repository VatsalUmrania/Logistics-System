// import { useState, useEffect } from 'react';
// import { Truck, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, ArrowUp, ArrowDown, CheckCircle, AlertTriangle, Eye, FileText, Calculator } from 'lucide-react';

// const AddSupplierPage = () => {
//   // API endpoints
//   const API_URL = 'http://localhost:5000/api/suppliers';
//   const INVOICE_API_URL = 'http://localhost:5000/api/supplier-assignments';
//   const INVOICE_NUMBERS_API = 'http://localhost:5000/api/invoices/invoice-numbers';
//   const JOB_NUMBERS_API = 'http://localhost:5000/api/invoices/job-numbers';

//   // State management
//   const [suppliers, setSuppliers] = useState([]);
//   const [invoices, setInvoices] = useState([]);
//   const [invoiceNumbers, setInvoiceNumbers] = useState([]);
//   const [jobNumbers, setJobNumbers] = useState([]);
  
//   const [newInvoice, setNewInvoice] = useState({
//     selectedSupplierId: '',
//     supplierInvoiceNo: '',
//     jobNumber: '',
//     invoiceDate: new Date().toISOString().split('T')[0],
//     vatRate: 0.15,
//     totalAmount: 0,
//     vatAmount: 0,
//     billTotalWithVAT: 0,
//     items: [{ purpose: '', item: '', quantity: 1, amount: 0 }]
//   });

//   const [isAddingInvoice, setIsAddingInvoice] = useState(false);
//   const [editingInvoiceId, setEditingInvoiceId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [invoicePage, setInvoicePage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [popup, setPopup] = useState({ show: false, type: '', message: '' });
//   const [viewingInvoice, setViewingInvoice] = useState(null);
//   const invoiceItemsPerPage = 10;

//   // Sorting state for assignments
//   const [sortAssignmentField, setSortAssignmentField] = useState('invoice_date');
//   const [sortAssignmentDirection, setSortAssignmentDirection] = useState('desc');

//   // Helper: Get auth headers
//   const getAuthHeaders = () => {
//     const token = localStorage.getItem('authToken');
//     if (!token) throw new Error('Authentication token missing');
//     return { 
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     };
//   };

//   // Fetch suppliers
//   const fetchSuppliers = async () => {
//     try {
//       const res = await fetch(API_URL, { headers: getAuthHeaders() });
//       if (!res.ok) throw new Error('Failed to fetch suppliers');
//       const data = await res.json();
//       setSuppliers(data);
//     } catch (err) {
//       setSuppliers([]);
//     }
//   }; 

//   // Fetch invoices
//   const fetchInvoices = async () => {
//     setIsLoading(true);
//     try {
//       const res = await fetch(INVOICE_API_URL, { headers: getAuthHeaders() });
//       if (!res.ok) throw new Error('Failed to fetch invoices');
//       const responseData = await res.json();
//       setInvoices(responseData.data || []);
//       setError('');
//     } catch (err) {
//       setError('Failed to fetch invoices. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch invoice numbers
//   const fetchInvoiceNumbers = async () => {
//     try {
//       const res = await fetch(INVOICE_NUMBERS_API, { headers: getAuthHeaders() });
//       if (!res.ok) throw new Error('Failed to fetch invoice numbers');
//       const data = await res.json();
//       setInvoiceNumbers(data);
//     } catch (err) {
//       setInvoiceNumbers([]);
//     }
//   };

//   // Fetch job numbers
//   const fetchJobNumbers = async () => {
//     try {
//       const res = await fetch(JOB_NUMBERS_API, { headers: getAuthHeaders() });
//       if (!res.ok) throw new Error('Failed to fetch job numbers');
//       const data = await res.json();
//       setJobNumbers(data);
//     } catch (err) {
//       setJobNumbers([]);
//     }
//   };

//   // Show popup for success/error
//   const showPopup = (type, message) => {
//     setPopup({ show: true, type, message });
//     setTimeout(() => setPopup({ show: false, type: '', message: '' }), 3000);
//   };

//   // Invoice form changes
//   const handleInvoiceChange = (e) => {
//     const { name, value } = e.target;
//     let newValue = value;
//     if (name === "vatRate") {
//       newValue = parseFloat(value);
//       if (newValue > 1) newValue = newValue / 100;
//     }
//     setNewInvoice(prev => {
//       const updated = { ...prev, [name]: newValue };
//       // Recalculate totals when VAT rate changes
//       if (name === "vatRate") {
//         const totalAmount = updated.items.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
//         const vatAmount = totalAmount * newValue;
//         const billTotalWithVAT = totalAmount + vatAmount;
//         return { ...updated, totalAmount, vatAmount, billTotalWithVAT };
//       }
//       return updated;
//     });
//   };

//   // Invoice item changes
//   const handleItemChange = (index, field, value) => {
//     const newItems = [...newInvoice.items];
//     newItems[index][field] = field === 'quantity' ? parseInt(value) || 1 : field === 'amount' ? parseFloat(value) || 0 : value;
//     const totalAmount = newItems.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
//     const vatAmount = totalAmount * newInvoice.vatRate;
//     const billTotalWithVAT = totalAmount + vatAmount;
//     setNewInvoice(prev => ({
//       ...prev,
//       items: newItems,
//       totalAmount,
//       vatAmount,
//       billTotalWithVAT
//     }));
//   };

//   // Add new invoice item
//   const addItem = () => {
//     setNewInvoice(prev => ({
//       ...prev,
//       items: [...prev.items, { purpose: '', item: '', quantity: 1, amount: 0 }]
//     }));
//   };

//   // Remove invoice item
//   const removeItem = (index) => {
//     if (newInvoice.items.length <= 1) return;
//     const newItems = newInvoice.items.filter((_, i) => i !== index);
//     const totalAmount = newItems.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
//     const vatAmount = totalAmount * newInvoice.vatRate;
//     const billTotalWithVAT = totalAmount + vatAmount;
//     setNewInvoice(prev => ({
//       ...prev,
//       items: newItems,
//       totalAmount,
//       vatAmount,
//       billTotalWithVAT
//     }));
//   };

//   // Reset form
//   const resetForm = () => {
//     setNewInvoice({
//       selectedSupplierId: '',
//       supplierInvoiceNo: '',
//       jobNumber: '',
//       invoiceDate: new Date().toISOString().split('T')[0],
//       vatRate: 0.15,
//       totalAmount: 0,
//       vatAmount: 0,
//       billTotalWithVAT: 0,
//       items: [{ purpose: '', item: '', quantity: 1, amount: 0 }]
//     });
//     setEditingInvoiceId(null);
//     setIsAddingInvoice(false);
//   };

//   // Add or update invoice
//   const handleSubmitInvoice = async () => {
//     // Validation
//     if (!newInvoice.selectedSupplierId) {
//       showPopup('error', 'Please select a supplier');
//       return;
//     }
//     if (!newInvoice.supplierInvoiceNo) {
//       showPopup('error', 'Invoice number is required');
//       return;
//     }
//     if (newInvoice.items.some(item => !item.purpose || !item.item || item.quantity <= 0 || item.amount <= 0)) {
//       showPopup('error', 'Please fill all item details with valid values');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const headers = getAuthHeaders();
//       const payload = {
//         ...newInvoice,
//         selectedSupplierId: parseInt(newInvoice.selectedSupplierId)
//       };

//       let res;
//       if (editingInvoiceId !== null) {
//         res = await fetch(`${INVOICE_API_URL}/${editingInvoiceId}`, {
//           method: 'PUT',
//           headers,
//           body: JSON.stringify(payload),
//         });
//         if (!res.ok) throw new Error('Failed to update invoice');
//         showPopup('success', 'Assignment updated successfully!');
//       } else {
//         res = await fetch(INVOICE_API_URL, {
//           method: 'POST',
//           headers,
//           body: JSON.stringify(payload),
//         });
//         if (!res.ok) throw new Error('Failed to create invoice');
//         showPopup('success', 'Assignment created successfully!');
//       }
      
//       resetForm();
//       fetchInvoices();
//       setError('');
//     } catch (err) {
//       showPopup('error', err.message || 'Failed to create/update invoice');
//     }
//     setIsLoading(false);
//   };

//   // View invoice details
//   const handleViewInvoice = async (invoice) => {
//     try {
//       const res = await fetch(`${INVOICE_API_URL}/${invoice.id}`, {
//         headers: getAuthHeaders(),
//       });
//       if (!res.ok) throw new Error('Failed to fetch invoice details');
//       const fullInvoice = await res.json();
//       setViewingInvoice(fullInvoice);
//     } catch (err) {
//       showPopup('error', 'Failed to load invoice details');
//     }
//   };

//   // Invoice edit
//   const handleEditInvoice = async (invoice) => {
//     try {
//       const res = await fetch(`${INVOICE_API_URL}/${invoice.id}`, {
//         headers: getAuthHeaders(),
//       });
//       if (!res.ok) throw new Error('Failed to fetch invoice details');
//       const fullInvoice = await res.json();

//       setNewInvoice({
//         selectedSupplierId: fullInvoice.supplier_id?.toString() || '',
//         supplierInvoiceNo: fullInvoice.supplier_invoice_no || '',
//         jobNumber: fullInvoice.job_number || '',
//         invoiceDate: fullInvoice.invoice_date
//           ? new Date(fullInvoice.invoice_date).toISOString().split('T')[0]
//           : new Date().toISOString().split('T')[0],
//         vatRate: Number(fullInvoice.vat_rate) || 0.15,
//         totalAmount: Number(fullInvoice.total_amount) || 0,
//         vatAmount: Number(fullInvoice.vat_amount) || 0,
//         billTotalWithVAT: Number(fullInvoice.bill_total_with_vat) || 0,
//         items: Array.isArray(fullInvoice.items) && fullInvoice.items.length > 0
//           ? fullInvoice.items.map(item => ({
//               purpose: item.purpose || '',
//               item: item.item || '',
//               quantity: Number(item.quantity) || 1,
//               amount: Number(item.amount) || 0
//             }))
//           : [{ purpose: '', item: '', quantity: 1, amount: 0 }]
//       });
//       setEditingInvoiceId(fullInvoice.id);
//       setIsAddingInvoice(true);
//       showPopup('success', 'Assignment loaded for editing!');
//     } catch (err) {
//       showPopup('error', err.message || 'Failed to load invoice for editing');
//     }
//   };

//   // Invoice delete
//   const handleDeleteInvoice = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this invoice?')) return;
//     setIsLoading(true);
//     try {
//       const res = await fetch(`${INVOICE_API_URL}/${id}`, {
//         method: 'DELETE',
//         headers: getAuthHeaders(),
//       });
//       if (!res.ok) throw new Error('Failed to delete invoice');
//       await fetchInvoices();
//       setError('');
//       showPopup('success', 'Assignment deleted successfully!');
//     } catch (err) {
//       showPopup('error', 'Failed to delete invoice');
//     }
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     fetchSuppliers();
//     fetchInvoices();
//     fetchInvoiceNumbers();
//     fetchJobNumbers();
//   }, []);

//   // Sorting handler for assignments
//   const handleSortAssignments = (field) => {
//     if (sortAssignmentField === field) {
//       setSortAssignmentDirection(sortAssignmentDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortAssignmentField(field);
//       setSortAssignmentDirection('asc');
//     }
//     setInvoicePage(1);
//   };

//   const renderSortAssignmentIcon = (field) => {
//     if (sortAssignmentField !== field) return <ArrowUp className="w-3 h-3 text-gray-400 inline" />;
//     return sortAssignmentDirection === 'asc'
//       ? <ArrowUp className="w-3 h-3 text-indigo-600 inline" />
//       : <ArrowDown className="w-3 h-3 text-indigo-600 inline" />;
//   };

//   // Assignment search
//   const filteredInvoices = invoices.filter(invoice => {
//     const supplierName = suppliers.find(s => s.id === invoice.supplier_id)?.name?.toLowerCase() || '';
//     return (
//       (invoice.supplier_invoice_no?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//       supplierName.includes(searchTerm.toLowerCase()) ||
//       (invoice.job_number?.toLowerCase() || '').includes(searchTerm.toLowerCase())
//     );
//   });

//   // Assignment sorting
//   const sortedAssignments = [...filteredInvoices].sort((a, b) => {
//     let valA, valB;
//     if (sortAssignmentField === 'supplier_invoice_no') {
//       valA = a.supplier_invoice_no?.toLowerCase() || '';
//       valB = b.supplier_invoice_no?.toLowerCase() || '';
//     } else if (sortAssignmentField === 'invoice_date') {
//       valA = a.invoice_date || '';
//       valB = b.invoice_date || '';
//     } else {
//       valA = a[sortAssignmentField] || '';
//       valB = b[sortAssignmentField] || '';
//     }
//     if (valA < valB) return sortAssignmentDirection === 'asc' ? -1 : 1;
//     if (valA > valB) return sortAssignmentDirection === 'asc' ? 1 : -1;
//     return 0;
//   });

//   // Assignment pagination
//   const invoiceTotalPages = Math.ceil(sortedAssignments.length / invoiceItemsPerPage);
//   const indexOfLastInvoice = invoicePage * invoiceItemsPerPage;
//   const indexOfFirstInvoice = indexOfLastInvoice - invoiceItemsPerPage;
//   const currentInvoices = sortedAssignments.slice(indexOfFirstInvoice, indexOfLastInvoice);

//   // Reset assignment pagination on search or sort
//   useEffect(() => { setInvoicePage(1); }, [searchTerm, invoices, sortAssignmentField, sortAssignmentDirection]);

//   // Searchable Dropdown Component
//   const SearchableDropdown = ({ 
//     options,
//     label, 
//     value, 
//     onChange,
//     optionKey,
//     placeholder = "Search...",
//     required = false,
//   }) => {
//     const [search, setSearch] = useState('');
//     const [isOpen, setIsOpen] = useState(false);

//     // Filter options by search term
//     const filteredOptions = options.filter(opt =>
//       (opt[optionKey] || '').toLowerCase().includes(search.toLowerCase())
//     );

//     const handleSelect = (selectedValue) => {
//       onChange(selectedValue);
//       setIsOpen(false);
//       setSearch('');
//     };

//     return (
//       <div className="relative">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
//         <div className="relative">
//           <input
//             type="text"
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             placeholder={value || placeholder}
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             onFocus={() => setIsOpen(true)}
//             onBlur={() => setTimeout(() => setIsOpen(false), 200)}
//             autoComplete="off"
//           />
//           {isOpen && (
//             <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//               {filteredOptions.length === 0 ? (
//                 <div className="px-3 py-2 text-gray-500">No results found</div>
//               ) : (
//                 filteredOptions.map(opt => (
//                   <div
//                     key={opt[optionKey]}
//                     className="px-3 py-2 hover:bg-indigo-50 cursor-pointer"
//                     onClick={() => handleSelect(opt[optionKey])}
//                   >
//                     {opt[optionKey]}
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Popup Notification */}
//         {popup.show && (
//           <div className={`fixed bottom-5 right-5 z-50 flex items-center px-6 py-4 rounded-lg shadow-xl transform transition-all duration-300
//               ${popup.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
//             {popup.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3" /> : <AlertTriangle className="w-5 h-5 mr-3" />}
//             <span className="font-medium">{popup.message}</span>
//           </div>
//         )}

//         {/* Header Section */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
//             <div className="flex items-center mb-6 lg:mb-0">
//               <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-xl mr-4">
//                 <Truck className="w-8 h-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-4xl font-bold text-gray-800">Supplier Assignments</h1>
//                 <p className="text-gray-600 mt-2">Manage and track all supplier invoice assignments</p>
//               </div>
//             </div>
            
//             <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
//               {/* Search Bar */}
//               <div className="relative">
//                 <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 shadow-sm border border-gray-200 min-w-[300px]">
//                   <Search className="w-5 h-5 text-gray-400 mr-3" />
//                   <input
//                     type="text"
//                     placeholder="Search invoices, suppliers, job numbers..."
//                     className="bg-transparent outline-none flex-1 text-gray-700"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>
//               </div>
              
//               {/* Action Button */}
//               <button
//                 onClick={() => {
//                   if (isAddingInvoice) {
//                     resetForm();
//                   } else {
//                     setIsAddingInvoice(true);
//                   }
//                 }}
//                 className={`px-6 py-3 text-white rounded-xl font-semibold transition-all flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
//                     ${isAddingInvoice 
//                       ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
//                       : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}
//                   `}
//               >
//                 {isAddingInvoice ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
//                 {isAddingInvoice ? 'Cancel' : 'Add Assignment'}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-8 p-6 bg-red-50 text-red-700 rounded-xl border border-red-200 shadow-sm">
//             <div className="flex items-center">
//               <AlertTriangle className="w-5 h-5 mr-3" />
//               <span className="font-medium">{error}</span>
//             </div>
//           </div>
//         )}

//         {/* Add/Edit Invoice Form */}
//         {isAddingInvoice && (
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
//             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
//               <h2 className="text-2xl font-bold text-white flex items-center">
//                 <FileText className="w-6 h-6 mr-3" />
//                 {editingInvoiceId ? 'Edit Supplier Assignment' : 'Create New Assignment'}
//               </h2>
//             </div>
            
//             <div className="p-8">
//               {/* Basic Information */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Basic Information</h3>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Supplier <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
//                       value={newInvoice.selectedSupplierId}
//                       onChange={(e) => setNewInvoice({...newInvoice, selectedSupplierId: e.target.value})}
//                     >
//                       <option value="">Select Supplier</option>
//                       {suppliers.map(supplier => (
//                         <option key={supplier.id} value={supplier.id}>
//                           {supplier.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <SearchableDropdown
//                     options={invoiceNumbers}
//                     label="Invoice Number"
//                     value={newInvoice.supplierInvoiceNo}
//                     onChange={(value) => setNewInvoice(prev => ({...prev, supplierInvoiceNo: value}))}
//                     optionKey="invoice_no"
//                     placeholder="Search invoice number..."
//                     required
//                   />
                  
//                   <SearchableDropdown
//                     options={jobNumbers}
//                     label="Job Number"
//                     value={newInvoice.jobNumber}
//                     onChange={(value) => setNewInvoice(prev => ({...prev, jobNumber: value}))}
//                     optionKey="job_number"
//                     placeholder="Search job number..."
//                   />
//                 </div>
                
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Financial Details</h3>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date</label>
//                     <input
//                       type="date"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
//                       name="invoiceDate"
//                       value={newInvoice.invoiceDate}
//                       onChange={handleInvoiceChange}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">VAT Rate (%)</label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       max="100"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
//                       placeholder="Enter VAT rate"
//                       name="vatRate"
//                       value={newInvoice.vatRate * 100}
//                       onChange={handleInvoiceChange}
//                     />
//                   </div>
                  
//                   {/* Financial Summary */}
//                   <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
//                     <div className="flex items-center mb-3">
//                       <Calculator className="w-5 h-5 text-indigo-600 mr-2" />
//                       <h4 className="font-semibold text-indigo-800">Financial Summary</h4>
//                     </div>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Subtotal:</span>
//                         <span className="font-medium">SAR {newInvoice.totalAmount.toFixed(2)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">VAT ({(newInvoice.vatRate * 100).toFixed(1)}%):</span>
//                         <span className="font-medium">SAR {newInvoice.vatAmount.toFixed(2)}</span>
//                       </div>
//                       <div className="flex justify-between border-t border-indigo-200 pt-2">
//                         <span className="font-semibold text-indigo-800">Total with VAT:</span>
//                         <span className="font-bold text-indigo-800">SAR {newInvoice.billTotalWithVAT.toFixed(2)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Invoice Items */}
//               <div className="mb-8">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-lg font-semibold text-gray-800">Invoice Items</h3>
//                   <button
//                     type="button"
//                     onClick={addItem}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center shadow-md"
//                   >
//                     <Plus className="w-4 h-4 mr-2" /> Add Item
//                   </button>
//                 </div>
                
//                 <div className="overflow-x-auto bg-gray-50 rounded-lg">
//                   <table className="w-full min-w-[800px]">
//                     <thead className="bg-gray-100">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Purpose</th>
//                         <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Item Description</th>
//                         <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
//                         <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unit Price (SAR)</th>
//                         <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total (SAR)</th>
//                         <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {newInvoice.items.map((item, index) => (
//                         <tr key={index} className="border-b border-gray-200 hover:bg-white transition-colors">
//                           <td className="px-4 py-3">
//                             <input
//                               type="text"
//                               className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
//                               placeholder="Purpose"
//                               value={item.purpose}
//                               onChange={(e) => handleItemChange(index, 'purpose', e.target.value)}
//                             />
//                           </td>
//                           <td className="px-4 py-3">
//                             <input
//                               type="text"
//                               className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
//                               placeholder="Item description"
//                               value={item.item}
//                               onChange={(e) => handleItemChange(index, 'item', e.target.value)}
//                             />
//                           </td>
//                           <td className="px-4 py-3">
//                             <input
//                               type="number"
//                               min="1"
//                               className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
//                               value={item.quantity}
//                               onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
//                             />
//                           </td>
//                           <td className="px-4 py-3">
//                             <input
//                               type="number"
//                               step="0.01"
//                               min="0"
//                               className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
//                               value={item.amount}
//                               onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
//                             />
//                           </td>
//                           <td className="px-4 py-3">
//                             <span className="font-medium text-gray-800">
//                               {(item.quantity * item.amount).toFixed(2)}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3 text-center">
//                             <button
//                               type="button"
//                               onClick={() => removeItem(index)}
//                               className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
//                               disabled={newInvoice.items.length <= 1}
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
              
//               {/* Submit Button */}
//               <div className="flex justify-end">
//                 <button
//                   onClick={handleSubmitInvoice}
//                   disabled={isLoading}
//                   className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? 'Processing...' : editingInvoiceId ? 'Update Assignment' : 'Create Assignment'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Invoice List */}
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
//             <div className="flex justify-between items-center">
//               <h3 className="text-xl font-bold text-gray-800">Supplier Assignments</h3>
//               {isLoading ? (
//                 <div className="text-sm text-indigo-600 flex items-center">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
//                   Loading...
//                 </div>
//               ) : (
//                 <div className="text-sm text-gray-600">
//                   Showing {currentInvoices.length} of {sortedAssignments.length} assignments
//                 </div>
//               )}
//             </div>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-max">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
//                     onClick={() => handleSortAssignments('supplier_invoice_no')}
//                   >
//                     <div className="flex items-center gap-2">
//                       Invoice No {renderSortAssignmentIcon('supplier_invoice_no')}
//                     </div>
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Supplier</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Job Number</th>
//                   <th
//                     className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
//                     onClick={() => handleSortAssignments('invoice_date')}
//                   >
//                     <div className="flex items-center gap-2">
//                       Invoice Date {renderSortAssignmentIcon('invoice_date')}
//                     </div>
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amount</th>
//                   <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {currentInvoices.map((invoice) => (
//                   <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-semibold text-gray-900">{invoice.supplier_invoice_no}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900">
//                         {suppliers.find(s => s.id === invoice.supplier_id)?.name || 'N/A'}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900">{invoice.job_number || 'N/A'}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900">
//                         {invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : 'N/A'}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm font-semibold text-gray-900">
//                         SAR {parseFloat(invoice.bill_total_with_vat || 0).toFixed(2)}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                       <div className="flex justify-center space-x-2">
//                         <button
//                           className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
//                           onClick={() => handleViewInvoice(invoice)}
//                           title="View Details"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                         <button
//                           className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
//                           onClick={() => handleEditInvoice(invoice)}
//                           title="Edit"
//                         >
//                           <Pencil className="w-4 h-4" />
//                         </button>
//                         <button
//                           className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
//                           onClick={() => handleDeleteInvoice(invoice.id)}
//                           title="Delete"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//                 {currentInvoices.length === 0 && (
//                   <tr>
//                     <td colSpan={6} className="px-6 py-16 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <FileText className="w-16 h-16 text-gray-300 mb-4" />
//                         <h4 className="text-lg font-medium text-gray-500">No assignments found</h4>
//                         <p className="text-gray-400 mt-2">Create your first supplier assignment to get started</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
          
//           {/* Pagination */}
//           {invoiceTotalPages > 1 && (
//             <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
//               <div className="flex items-center justify-between">
//                 <div className="text-sm text-gray-700">
//                   Page <span className="font-semibold">{invoicePage}</span> of <span className="font-semibold">{invoiceTotalPages}</span>
//                 </div>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => setInvoicePage(prev => Math.max(prev - 1, 1))}
//                     disabled={invoicePage === 1}
//                     className={`px-4 py-2 rounded-lg border transition-colors ${
//                       invoicePage === 1 
//                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
//                         : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 shadow-sm'
//                     }`}
//                   >
//                     <ChevronLeft className="w-5 h-5" />
//                   </button>
//                   {Array.from({ length: invoiceTotalPages }, (_, i) => i + 1).map(page => (
//                     <button
//                       key={page}
//                       onClick={() => setInvoicePage(page)}
//                       className={`px-4 py-2 rounded-lg border transition-colors ${
//                         invoicePage === page
//                           ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
//                           : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 shadow-sm'
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => setInvoicePage(prev => Math.min(prev + 1, invoiceTotalPages))}
//                     disabled={invoicePage === invoiceTotalPages}
//                     className={`px-4 py-2 rounded-lg border transition-colors ${
//                       invoicePage === invoiceTotalPages
//                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
//                         : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 shadow-sm'
//                     }`}
//                   >
//                     <ChevronRight className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* View Invoice Modal */}
//         {viewingInvoice && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-2xl font-bold text-white">Invoice Details</h2>
//                   <button
//                     onClick={() => setViewingInvoice(null)}
//                     className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
//                   >
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>
//               </div>
              
//               <div className="p-8">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
//                     <div className="space-y-3">
//                       <div>
//                         <span className="text-gray-600">Invoice Number:</span>
//                         <span className="ml-2 font-medium">{viewingInvoice.supplier_invoice_no}</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-600">Supplier:</span>
//                         <span className="ml-2 font-medium">
//                           {suppliers.find(s => s.id === viewingInvoice.supplier_id)?.name || 'N/A'}
//                         </span>
//                       </div>
//                       <div>
//                         <span className="text-gray-600">Job Number:</span>
//                         <span className="ml-2 font-medium">{viewingInvoice.job_number || 'N/A'}</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-600">Invoice Date:</span>
//                         <span className="ml-2 font-medium">
//                           {viewingInvoice.invoice_date ? new Date(viewingInvoice.invoice_date).toLocaleDateString() : 'N/A'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Summary</h3>
//                     <div className="bg-gray-50 p-4 rounded-lg space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Subtotal:</span>
//                         <span className="font-medium">SAR {parseFloat(viewingInvoice.total_amount || 0).toFixed(2)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">VAT ({((viewingInvoice.vat_rate || 0) * 100).toFixed(1)}%):</span>
//                         <span className="font-medium">SAR {parseFloat(viewingInvoice.vat_amount || 0).toFixed(2)}</span>
//                       </div>
//                       <div className="flex justify-between border-t border-gray-200 pt-3">
//                         <span className="font-semibold text-gray-800">Total with VAT:</span>
//                         <span className="font-bold text-indigo-600">SAR {parseFloat(viewingInvoice.bill_total_with_vat || 0).toFixed(2)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Items */}
//                 {viewingInvoice.items && viewingInvoice.items.length > 0 && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice Items</h3>
//                     <div className="overflow-x-auto">
//                       <table className="w-full border border-gray-200 rounded-lg">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Purpose</th>
//                             <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Item</th>
//                             <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
//                             <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unit Price</th>
//                             <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {viewingInvoice.items.map((item, index) => (
//                             <tr key={index} className="border-t border-gray-200">
//                               <td className="px-4 py-3 text-sm">{item.purpose}</td>
//                               <td className="px-4 py-3 text-sm">{item.item}</td>
//                               <td className="px-4 py-3 text-sm">{item.quantity}</td>
//                               <td className="px-4 py-3 text-sm">SAR {parseFloat(item.amount || 0).toFixed(2)}</td>
//                               <td className="px-4 py-3 text-sm font-medium">SAR {(item.quantity * item.amount).toFixed(2)}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AddSupplierPage;


import { useState, useEffect } from 'react';
import { 
  Truck, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, CheckCircle, AlertTriangle, Eye, FileText, 
  Calculator, Settings, Loader, Check, AlertCircle as Alert
} from 'lucide-react';
import Select from 'react-select';

const AddSupplierPage = () => {
  // API endpoints
  const API_URL = 'http://localhost:5000/api/suppliers';
  const INVOICE_API_URL = 'http://localhost:5000/api/supplier-assignments';
  const INVOICE_NUMBERS_API = 'http://localhost:5000/api/invoices/invoice-numbers';
  const JOB_NUMBERS_API = 'http://localhost:5000/api/invoices/job-numbers';

  // State management
  const [suppliers, setSuppliers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [invoiceNumbers, setInvoiceNumbers] = useState([]);
  const [jobNumbers, setJobNumbers] = useState([]);
  
  const [newInvoice, setNewInvoice] = useState({
    selectedSupplierId: '',
    supplierInvoiceNo: '',
    jobNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    vatRate: 0.15,
    totalAmount: 0,
    vatAmount: 0,
    billTotalWithVAT: 0,
    items: [{ purpose: '', item: '', quantity: 1, amount: 0 }]
  });

  const [isAddingInvoice, setIsAddingInvoice] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [invoicePage, setInvoicePage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const invoiceItemsPerPage = 10;

  // Sorting state for assignments
  const [sortAssignmentField, setSortAssignmentField] = useState('invoice_date');
  const [sortAssignmentDirection, setSortAssignmentDirection] = useState('desc');

  // Custom styles for react-select dropdowns
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

  // Helper: Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication token missing');
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const res = await fetch(API_URL, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch suppliers');
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      setSuppliers([]);
    }
  }; 

  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      const res = await fetch(INVOICE_API_URL, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch invoices');
      const responseData = await res.json();
      setInvoices(responseData.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch invoices. Please try again.');
    }
  };

  // Fetch invoice numbers
  const fetchInvoiceNumbers = async () => {
    try {
      const res = await fetch(INVOICE_NUMBERS_API, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch invoice numbers');
      const data = await res.json();
      setInvoiceNumbers(data);
    } catch (err) {
      setInvoiceNumbers([]);
    }
  };

  // Fetch job numbers
  const fetchJobNumbers = async () => {
    try {
      const res = await fetch(JOB_NUMBERS_API, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch job numbers');
      const data = await res.json();
      setJobNumbers(data);
    } catch (err) {
      setJobNumbers([]);
    }
  };

  // Show popup for success/error
  const showPopup = (type, message) => {
    if (type === 'success') {
      setSuccessMessage(message);
      setError('');
      setTimeout(() => setSuccessMessage(''), 5000);
    } else {
      setError(message);
      setSuccessMessage('');
      setTimeout(() => setError(''), 5000);
    }
  };

  // Invoice form changes
  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "vatRate") {
      newValue = parseFloat(value);
      if (newValue > 1) newValue = newValue / 100;
    }
    setNewInvoice(prev => {
      const updated = { ...prev, [name]: newValue };
      // Recalculate totals when VAT rate changes
      if (name === "vatRate") {
        const totalAmount = updated.items.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
        const vatAmount = totalAmount * newValue;
        const billTotalWithVAT = totalAmount + vatAmount;
        return { ...updated, totalAmount, vatAmount, billTotalWithVAT };
      }
      return updated;
    });
  };

  // Invoice item changes
  const handleItemChange = (index, field, value) => {
    const newItems = [...newInvoice.items];
    newItems[index][field] = field === 'quantity' ? parseInt(value) || 1 : field === 'amount' ? parseFloat(value) || 0 : value;
    const totalAmount = newItems.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
    const vatAmount = totalAmount * newInvoice.vatRate;
    const billTotalWithVAT = totalAmount + vatAmount;
    setNewInvoice(prev => ({
      ...prev,
      items: newItems,
      totalAmount,
      vatAmount,
      billTotalWithVAT
    }));
  };

  // Add new invoice item
  const addItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { purpose: '', item: '', quantity: 1, amount: 0 }]
    }));
  };

  // Remove invoice item
  const removeItem = (index) => {
    if (newInvoice.items.length <= 1) return;
    const newItems = newInvoice.items.filter((_, i) => i !== index);
    const totalAmount = newItems.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
    const vatAmount = totalAmount * newInvoice.vatRate;
    const billTotalWithVAT = totalAmount + vatAmount;
    setNewInvoice(prev => ({
      ...prev,
      items: newItems,
      totalAmount,
      vatAmount,
      billTotalWithVAT
    }));
  };

  // Reset form
  const resetForm = () => {
    setNewInvoice({
      selectedSupplierId: '',
      supplierInvoiceNo: '',
      jobNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      vatRate: 0.15,
      totalAmount: 0,
      vatAmount: 0,
      billTotalWithVAT: 0,
      items: [{ purpose: '', item: '', quantity: 1, amount: 0 }]
    });
    setEditingInvoiceId(null);
    setIsAddingInvoice(false);
  };

  // Add or update invoice
  const handleSubmitInvoice = async () => {
    // Validation
    if (!newInvoice.selectedSupplierId) {
      showPopup('error', 'Please select a supplier');
      return;
    }
    if (!newInvoice.supplierInvoiceNo) {
      showPopup('error', 'Invoice number is required');
      return;
    }
    if (newInvoice.items.some(item => !item.purpose || !item.item || item.quantity <= 0 || item.amount <= 0)) {
      showPopup('error', 'Please fill all item details with valid values');
      return;
    }

    try {
      const headers = getAuthHeaders();
      const payload = {
        ...newInvoice,
        selectedSupplierId: parseInt(newInvoice.selectedSupplierId)
      };

      let res;
      if (editingInvoiceId !== null) {
        res = await fetch(`${INVOICE_API_URL}/${editingInvoiceId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update invoice');
        showPopup('success', 'Assignment updated successfully!');
      } else {
        res = await fetch(INVOICE_API_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to create invoice');
        showPopup('success', 'Assignment created successfully!');
      }
      
      resetForm();
      fetchInvoices();
    } catch (err) {
      showPopup('error', err.message || 'Failed to create/update invoice');
    }
  };

  // View invoice details
  const handleViewInvoice = async (invoice) => {
    try {
      const res = await fetch(`${INVOICE_API_URL}/${invoice.id}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch invoice details');
      const fullInvoice = await res.json();
      setViewingInvoice(fullInvoice);
    } catch (err) {
      showPopup('error', 'Failed to load invoice details');
    }
  };

  // Invoice edit
  const handleEditInvoice = async (invoice) => {
    try {
      const res = await fetch(`${INVOICE_API_URL}/${invoice.id}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch invoice details');
      const fullInvoice = await res.json();

      setNewInvoice({
        selectedSupplierId: fullInvoice.supplier_id?.toString() || '',
        supplierInvoiceNo: fullInvoice.supplier_invoice_no || '',
        jobNumber: fullInvoice.job_number || '',
        invoiceDate: fullInvoice.invoice_date
          ? new Date(fullInvoice.invoice_date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        vatRate: Number(fullInvoice.vat_rate) || 0.15,
        totalAmount: Number(fullInvoice.total_amount) || 0,
        vatAmount: Number(fullInvoice.vat_amount) || 0,
        billTotalWithVAT: Number(fullInvoice.bill_total_with_vat) || 0,
        items: Array.isArray(fullInvoice.items) && fullInvoice.items.length > 0
          ? fullInvoice.items.map(item => ({
              purpose: item.purpose || '',
              item: item.item || '',
              quantity: Number(item.quantity) || 1,
              amount: Number(item.amount) || 0
            }))
          : [{ purpose: '', item: '', quantity: 1, amount: 0 }]
      });
      setEditingInvoiceId(fullInvoice.id);
      setIsAddingInvoice(true);
      showPopup('success', 'Assignment loaded for editing!');
    } catch (err) {
      showPopup('error', err.message || 'Failed to load invoice for editing');
    }
  };

  // Invoice delete
  const handleDeleteInvoice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      const res = await fetch(`${INVOICE_API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete invoice');
      await fetchInvoices();
      showPopup('success', 'Assignment deleted successfully!');
    } catch (err) {
      showPopup('error', 'Failed to delete invoice');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchSuppliers(),
          fetchInvoices(),
          fetchInvoiceNumbers(),
          fetchJobNumbers()
        ]);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sorting handler for assignments
  const handleSortAssignments = (field) => {
    if (sortAssignmentField === field) {
      setSortAssignmentDirection(sortAssignmentDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortAssignmentField(field);
      setSortAssignmentDirection('asc');
    }
    setInvoicePage(1);
  };

  // Assignment search
  const filteredInvoices = invoices.filter(invoice => {
    const supplierName = suppliers.find(s => s.id === invoice.supplier_id)?.name?.toLowerCase() || '';
    return (
      (invoice.supplier_invoice_no?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      supplierName.includes(searchTerm.toLowerCase()) ||
      (invoice.job_number?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  });

  // Assignment sorting
  const sortedAssignments = [...filteredInvoices].sort((a, b) => {
    let valA, valB;
    if (sortAssignmentField === 'supplier_invoice_no') {
      valA = a.supplier_invoice_no?.toLowerCase() || '';
      valB = b.supplier_invoice_no?.toLowerCase() || '';
    } else if (sortAssignmentField === 'invoice_date') {
      valA = a.invoice_date || '';
      valB = b.invoice_date || '';
    } else {
      valA = a[sortAssignmentField] || '';
      valB = b[sortAssignmentField] || '';
    }
    if (valA < valB) return sortAssignmentDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortAssignmentDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Assignment pagination
  const invoiceTotalPages = Math.ceil(sortedAssignments.length / invoiceItemsPerPage);
  const indexOfLastInvoice = invoicePage * invoiceItemsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoiceItemsPerPage;
  const currentInvoices = sortedAssignments.slice(indexOfFirstInvoice, indexOfLastInvoice);

  // Reset assignment pagination on search or sort
  useEffect(() => { setInvoicePage(1); }, [searchTerm, invoices, sortAssignmentField, sortAssignmentDirection]);

  // Prepare options for searchable dropdowns
  const supplierOptions = suppliers.map(supplier => ({
    value: supplier.id,
    label: supplier.name
  }));

  const invoiceNumberOptions = invoiceNumbers.map(inv => ({
    value: inv.invoice_no,
    label: inv.invoice_no
  }));

  const jobNumberOptions = jobNumbers.map(job => ({
    value: job.job_number,
    label: job.job_number
  }));

  // Get total amount
  const getTotalAmount = () => {
    return sortedAssignments.reduce((sum, invoice) => sum + parseFloat(invoice.bill_total_with_vat || 0), 0).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading supplier assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <Truck className="w-8 h-8 mr-3 text-indigo-600" />
              Supplier Assignment Management
            </h1>
            <p className="text-gray-600 mt-2">Manage and track all supplier invoice assignments</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setIsAddingInvoice(!isAddingInvoice);
                setEditingInvoiceId(null);
                resetForm();
              }}
              className={`px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                ${isAddingInvoice 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isAddingInvoice ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {isAddingInvoice ? 'Cancel' : 'Add Assignment'}
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

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH ASSIGNMENTS
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Invoice Number, Supplier, or Job Number
                </label>
                <input
                  type="text"
                  placeholder="Search assignments..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Assignment Form */}
        {isAddingInvoice && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                {editingInvoiceId ? 'Edit Assignment' : 'Add New Assignment'}
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={supplierOptions}
                      value={supplierOptions.find(option => option.value == newInvoice.selectedSupplierId)}
                      onChange={(selectedOption) => setNewInvoice(prev => ({...prev, selectedSupplierId: selectedOption?.value || ''}))}
                      placeholder="Select Supplier"
                      isSearchable
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      styles={selectStyles}
                      className="w-full text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice Number <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={invoiceNumberOptions}
                      value={invoiceNumberOptions.find(option => option.value === newInvoice.supplierInvoiceNo)}
                      onChange={(selectedOption) => setNewInvoice(prev => ({...prev, supplierInvoiceNo: selectedOption?.value || ''}))}
                      placeholder="Select Invoice Number"
                      isSearchable
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      styles={selectStyles}
                      className="w-full text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Number
                    </label>
                    <Select
                      options={jobNumberOptions}
                      value={jobNumberOptions.find(option => option.value === newInvoice.jobNumber)}
                      onChange={(selectedOption) => setNewInvoice(prev => ({...prev, jobNumber: selectedOption?.value || ''}))}
                      placeholder="Select Job Number"
                      isSearchable
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      styles={selectStyles}
                      className="w-full text-sm"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      name="invoiceDate"
                      value={newInvoice.invoiceDate}
                      onChange={handleInvoiceChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">VAT Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter VAT rate"
                      name="vatRate"
                      value={newInvoice.vatRate * 100}
                      onChange={handleInvoiceChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">VAT Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        value={(parseFloat(newInvoice?.vatAmount) || 0).toFixed(2)}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newInvoice.billTotalWithVAT.toFixed(2)}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Invoice Items */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-gray-800">Invoice Items</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Item
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price (SAR)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (SAR)</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {newInvoice.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                              placeholder="Purpose"
                              value={item.purpose}
                              onChange={(e) => handleItemChange(index, 'purpose', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                              placeholder="Item description"
                              value={item.item}
                              onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              min="1"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                              value={item.amount}
                              onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-gray-900">
                              {(item.quantity * item.amount).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-900"
                              disabled={newInvoice.items.length <= 1}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSubmitInvoice}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm"
                >
                  {editingInvoiceId ? 'Update Assignment' : 'Add Assignment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assignment Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Assignment Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">SAR {getTotalAmount()}</span>
            </div>
          </div>
        </div>

        {/* Assignments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'Invoice No', key: 'supplier_invoice_no' },
                    { label: 'Supplier', key: 'supplier_name' },
                    { label: 'Job Number', key: 'job_number' },
                    { label: 'Invoice Date', key: 'invoice_date' },
                    { label: 'Total Amount', key: 'bill_total_with_vat' },
                    { label: 'Actions', key: null },
                  ].map(({ label, key }) => (
                    <th
                      key={label}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => key && handleSortAssignments(key)}
                    >
                      <div className="flex items-center">
                        {label}
                        {key && sortAssignmentField === key && (
                          <ArrowUp
                            className={`w-4 h-4 ml-1 transition-transform ${sortAssignmentDirection === 'desc' ? 'rotate-180' : ''}`}
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      No assignment records found
                    </td>
                  </tr>
                ) : (
                  currentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.supplier_invoice_no}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {suppliers.find(s => s.id === invoice.supplier_id)?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {invoice.job_number || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                        SAR {parseFloat(invoice.bill_total_with_vat || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditInvoice(invoice)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
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
          <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-700 mb-2 md:mb-0">
              Showing {indexOfFirstInvoice + 1} to{' '}
              {Math.min(indexOfLastInvoice, sortedAssignments.length)} of {sortedAssignments.length} assignments
            </div>
            <div className="flex items-center">
              <div className="flex space-x-1">
                <button
                  onClick={() => setInvoicePage((p) => Math.max(p - 1, 1))}
                  disabled={invoicePage === 1}
                  className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                  title="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setInvoicePage((p) => Math.min(p + 1, invoiceTotalPages))}
                  disabled={invoicePage === invoiceTotalPages || invoiceTotalPages === 0}
                  className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                  title="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="hidden md:block text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">SAR {getTotalAmount()}</span>
            </div>
          </div>
        </div>

        {/* View Invoice Modal */}
        {viewingInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="bg-indigo-600 p-4 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white">Assignment Details</h2>
                  <button
                    onClick={() => setViewingInvoice(null)}
                    className="text-white hover:text-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600">Invoice Number:</span>
                        <span className="ml-2 font-medium">{viewingInvoice.supplier_invoice_no}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Supplier:</span>
                        <span className="ml-2 font-medium">
                          {suppliers.find(s => s.id === viewingInvoice.supplier_id)?.name || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Job Number:</span>
                        <span className="ml-2 font-medium">{viewingInvoice.job_number || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Invoice Date:</span>
                        <span className="ml-2 font-medium">
                          {viewingInvoice.invoice_date ? new Date(viewingInvoice.invoice_date).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Summary</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">SAR {parseFloat(viewingInvoice.total_amount || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">VAT ({((viewingInvoice.vat_rate || 0) * 100).toFixed(1)}%):</span>
                        <span className="font-medium">SAR {parseFloat(viewingInvoice.vat_amount || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-3">
                        <span className="font-semibold text-gray-800">Total with VAT:</span>
                        <span className="font-bold text-indigo-600">SAR {parseFloat(viewingInvoice.bill_total_with_vat || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Items */}
                {viewingInvoice.items && viewingInvoice.items.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice Items</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Purpose</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Item</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unit Price</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewingInvoice.items.map((item, index) => (
                            <tr key={index} className="border-t border-gray-200">
                              <td className="px-4 py-3 text-sm">{item.purpose}</td>
                              <td className="px-4 py-3 text-sm">{item.item}</td>
                              <td className="px-4 py-3 text-sm">{item.quantity}</td>
                              <td className="px-4 py-3 text-sm">SAR {parseFloat(item.amount || 0).toFixed(2)}</td>
                              <td className="px-4 py-3 text-sm font-medium">SAR {(item.quantity * item.amount).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddSupplierPage;
