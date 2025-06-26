// import React, { useState, useEffect, useRef } from 'react';
// import { FileText, Plus, Trash2, Save, XCircle, Loader2, Edit2 } from 'lucide-react';

// const ACCENT = "emerald";

// // Auth header utility
// const getAuthHeaders = () => {
//   const token = localStorage.getItem('authToken');
//   if (!token) throw new Error('Authentication token missing');
//   return {
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json'
//   };
// };

// const API_SUPPLIERS = "http://localhost:5000/api/suppliers";
// const API_PORTS = "http://localhost:5000/api/ports";
// const API_ASSIGNMENTS = "http://localhost:5000/api/supplier-assignments";
// const API_CREDIT_NOTES = "http://localhost:5000/api/supplier-credit-notes";

// const SupplierCreditNote = () => {
//   // Data state
//   const [suppliers, setSuppliers] = useState([]);
//   const [ports, setPorts] = useState([]);
//   const [assignments, setAssignments] = useState([]);
//   const [creditNotes, setCreditNotes] = useState([]);
//   // Form state
//   const [formData, setFormData] = useState({
//     supplier_id: '',
//     credit_note_no: `CN-${Math.floor(Math.random() * 1000)}`,
//     credit_note_date: new Date().toISOString().split('T')[0],
//     total_amount: '',
//     vat_amount: '',
//     grand_total: '',
//     assignment_id: '',
//     port_id: '',
//     job_number: ''
//   });
//   const [lineItems, setLineItems] = useState([
//     { id: 1, description: '', quantity: '', unit_price: '', amount: '' }
//   ]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [successMsg, setSuccessMsg] = useState('');
//   const [errorMsg, setErrorMsg] = useState('');
//   const lastLineItemRef = useRef(null);

//   // Fetch dropdowns and notes
//   useEffect(() => {
//     fetchDropdowns();
//     fetchCreditNotes();
//   }, []);

//   async function fetchDropdowns() {
//     try {
//       const [sup, port, assign] = await Promise.all([
//         fetch(API_SUPPLIERS, { headers: getAuthHeaders() }).then(r => r.json()),
//         fetch(API_PORTS, { headers: getAuthHeaders() }).then(r => r.json()),
//         fetch(API_ASSIGNMENTS, { headers: getAuthHeaders() }).then(r => r.json())
//       ]);
//       setSuppliers(Array.isArray(sup) ? sup : (sup.data || []));
//       setPorts(Array.isArray(port) ? port : (port.data || []));
//       setAssignments(assign.data || []);
//     } catch (err) {
//       setErrorMsg("Failed to fetch dropdowns: " + err.message);
//     }
//   }

//   async function fetchCreditNotes() {
//     try {
//       const response = await fetch(API_CREDIT_NOTES, { headers: getAuthHeaders() });
//       const data = await response.json();
//       setCreditNotes(data.data || []);
//     } catch (err) {
//       setCreditNotes([]);
//     }
//   }

//   // Calculate line item amounts and totals
//   useEffect(() => {
//     const updated = lineItems.map(item => {
//       const quantity = parseFloat(item.quantity) || 0;
//       const unitPrice = parseFloat(item.unit_price) || 0;
//       return { ...item, amount: (quantity * unitPrice).toFixed(2) };
//     });
//     const subTotal = updated.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
//     const vatAmount = subTotal * 0.18;
//     const totalAmount = subTotal + vatAmount;
//     setFormData(prev => ({
//       ...prev,
//       total_amount: subTotal.toFixed(2),
//       vat_amount: vatAmount.toFixed(2),
//       grand_total: totalAmount.toFixed(2)
//     }));
//     setLineItems(updated);
//   }, [lineItems]);

//   useEffect(() => {
//     if (lastLineItemRef.current) lastLineItemRef.current.focus();
//   }, [lineItems.length]);

//   // Handlers
//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     setErrorMsg('');
//     setSuccessMsg('');
//   };
//   const handleLineItemChange = (id, field, value) => {
//     setLineItems(prev =>
//       prev.map(item =>
//         item.id === id ? { ...item, [field]: value } : item
//       )
//     );
//     setErrorMsg('');
//     setSuccessMsg('');
//   };
//   const addLineItem = () => {
//     const newId = lineItems.length > 0
//       ? Math.max(...lineItems.map(item => item.id)) + 1
//       : 1;
//     setLineItems([
//       ...lineItems,
//       { id: newId, description: '', quantity: '', unit_price: '', amount: '' }
//     ]);
//   };
//   const removeLineItem = (id) => {
//     if (lineItems.length <= 1) return;
//     setLineItems(lineItems.filter(item => item.id !== id));
//   };

//   // CRUD
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setErrorMsg('');
//     setSuccessMsg('');
//     try {
//       const selectedAssignment = assignments.find(a => String(a.id) === String(formData.assignment_id));
//       const payload = {
//         supplier_id: formData.supplier_id,
//         credit_note_no: formData.credit_note_no,
//         credit_note_date: formData.credit_note_date,
//         total_amount: formData.total_amount,
//         vat_amount: formData.vat_amount,
//         grand_total: formData.grand_total,
//         supplier_invoice_no: selectedAssignment ? selectedAssignment.supplier_invoice_no : undefined,
//         job_number: selectedAssignment ? selectedAssignment.job_number : formData.job_number,
//         port_id: formData.port_id,
//         assignment_id: formData.assignment_id,
//         lineItems: lineItems.map(item => ({
//           description: item.description,
//           quantity: item.quantity,
//           unit_price: item.unit_price,
//           amount: item.amount
//         }))
//       };
//       let res, data;
//       if (editingId) {
//         res = await fetch(`${API_CREDIT_NOTES}/${editingId}`, {
//           method: "PUT",
//           headers: getAuthHeaders(),
//           body: JSON.stringify(payload)
//         });
//         data = await res.json();
//       } else {
//         res = await fetch(API_CREDIT_NOTES, {
//           method: "POST",
//           headers: getAuthHeaders(),
//           body: JSON.stringify(payload)
//         });
//         data = await res.json();
//       }
//       if (data.success) {
//         setSuccessMsg(editingId ? "Credit Note updated!" : "Credit Note created!");
//         fetchCreditNotes();
//         handleReset();
//       } else {
//         setErrorMsg(data.message || "Failed to save credit note");
//       }
//     } catch (error) {
//       setErrorMsg('Error saving credit note: ' + error.message);
//     } finally {
//       setIsLoading(false);
//       setEditingId(null);
//     }
//   };

//   const handleEdit = (note) => {
//     setEditingId(note.id);
//     setFormData({
//       supplier_id: note.supplier_id,
//       credit_note_no: note.credit_note_no,
//       credit_note_date: note.credit_note_date?.substring(0, 10),
//       total_amount: note.total_amount,
//       vat_amount: note.vat_amount,
//       grand_total: note.grand_total,
//       assignment_id: '',
//       port_id: '',
//       job_number: note.job_number || ''
//     });
//     setLineItems(note.lineItems?.map((li, idx) => ({
//       id: idx + 1,
//       description: li.description,
//       quantity: li.quantity,
//       unit_price: li.unit_price,
//       amount: li.amount
//     })) || [{ id: 1, description: '', quantity: '', unit_price: '', amount: '' }]);
//     setErrorMsg('');
//     setSuccessMsg('');
//     window.scrollTo(0, 0);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this credit note?')) return;
//     setIsLoading(true);
//     setSuccessMsg('');
//     setErrorMsg('');
//     try {
//       const res = await fetch(`${API_CREDIT_NOTES}/${id}`, { method: "DELETE", headers: getAuthHeaders() });
//       const data = await res.json();
//       if (data.success) {
//         setSuccessMsg("Credit note deleted");
//         fetchCreditNotes();
//       } else {
//         setErrorMsg(data.message || "Delete failed");
//       }
//     } catch (err) {
//       setErrorMsg("Server error: " + err.message);
//     }
//     setIsLoading(false);
//   };

//   const handleReset = () => {
//     setFormData({
//       supplier_id: '',
//       credit_note_no: `CN-${Math.floor(Math.random() * 1000)}`,
//       credit_note_date: new Date().toISOString().split('T')[0],
//       total_amount: '',
//       vat_amount: '',
//       grand_total: '',
//       assignment_id: '',
//       port_id: '',
//       job_number: ''
//     });
//     setLineItems([{ id: 1, description: '', quantity: '', unit_price: '', amount: '' }]);
//     setEditingId(null);
//     setErrorMsg('');
//     setSuccessMsg('');
//   };

//   const supplierName = (id) => suppliers.find(s => String(s.id) === String(id))?.name || "";
//   const portName = (id) => ports.find(p => String(p.id) === String(id))?.name || "";
//   const assignment = assignments.find(a => String(a.id) === String(formData.assignment_id));

//   // Styling helpers
//   const fadeClass = "transition-all duration-200";
//   const inputAccent = `focus:ring-2 focus:ring-${ACCENT}-500 focus:border-${ACCENT}-500`;

//   // --- UI ---
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#f7fafd] via-white to-indigo-50 py-10 px-2 md:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <FileText className={`h-11 w-11 text-${ACCENT}-700`} />
//             <div>
//               <h1 className={`text-4xl font-extrabold bg-gradient-to-r from-indigo-800 via-indigo-600 to-blue-600 bg-clip-text text-transparent`}>
//                 Supplier Credit Notes
//               </h1>
//               <div className={`mt-2 text-${ACCENT}-600 text-base font-semibold tracking-wide`}>Create, edit, and manage supplier credit notes</div>
//             </div>
//           </div>
//         </header>

//         {/* Alerts */}
//         <div className="max-w-3xl mx-auto">
//           {successMsg && (
//             <div className="mb-4 rounded px-4 py-3 bg-green-100 text-green-800 border border-green-200 text-center shadow">{successMsg}</div>
//           )}
//           {errorMsg && (
//             <div className="mb-4 rounded px-4 py-3 bg-red-100 text-red-800 border border-red-200 text-center shadow">{errorMsg}</div>
//           )}
//         </div>

//         {/* Main Grid */}
//         <main className="grid grid-cols-1 xl:grid-cols-2 gap-10 max-w-7xl mx-auto">
//           {/* List */}
//           <section className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-x-auto">
//             <div className={`px-8 py-5 border-b border-gray-200 flex items-center gap-3 bg-${ACCENT}-50`}>
//               <FileText className={`h-7 w-7 text-${ACCENT}-600`} />
//               <h2 className="text-2xl font-bold text-gray-800">Credit Notes List</h2>
//             </div>
//             <table className="min-w-full divide-y divide-gray-100 text-sm">
//               <thead className="bg-indigo-100 sticky top-0 z-10">
//                 <tr>
//                   <th className="px-5 py-3 text-left font-bold whitespace-nowrap">#</th>
//                   <th className="px-5 py-3 text-left font-bold whitespace-nowrap">Date</th>
//                   <th className="px-5 py-3 text-left font-bold whitespace-nowrap">Supplier</th>
//                   <th className="px-5 py-3 text-left font-bold whitespace-nowrap">Total</th>
//                   <th className="px-5 py-3 text-left font-bold whitespace-nowrap">Line Items</th>
//                   <th className="px-5 py-3 text-left"></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {creditNotes.map((note, i) => (
//                   <tr key={note.id} className={`hover:bg-${ACCENT}-50/60 ${i % 2 ? "bg-gray-50" : ""}`}>
//                     <td className="px-5 py-2 font-bold">{note.credit_note_no}</td>
//                     <td className="px-5 py-2">{note.credit_note_date?.substring(0, 10)}</td>
//                     <td className="px-5 py-2">{note.supplier_name || supplierName(note.supplier_id)}</td>
//                     <td className={`px-5 py-2 font-bold text-${ACCENT}-700`}>₹{parseFloat(note.grand_total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
//                     <td className="px-5 py-2">
//                       <ul className="text-xs rounded bg-gray-50 px-2 py-1 max-h-20 overflow-y-auto">
//                         {(note.lineItems || []).map((li, idx) => (
//                           <li key={idx}>
//                             <span className="font-medium">{li.description}</span>: {li.quantity} × {li.unit_price} = {li.amount}
//                           </li>
//                         ))}
//                       </ul>
//                     </td>
//                     <td className="px-4 py-2 whitespace-nowrap flex gap-1 items-center">
//                       <button
//                         onClick={() => handleEdit(note)}
//                         className={`p-2 rounded-full hover:bg-${ACCENT}-100 text-${ACCENT}-600 hover:text-${ACCENT}-800 ${fadeClass}`}
//                         title="Edit"
//                       >
//                         <Edit2 className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(note.id)}
//                         className={`p-2 rounded-full hover:bg-red-100 text-red-600 hover:text-red-800 ${fadeClass}`}
//                         title="Delete"
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//                 {creditNotes.length === 0 && (
//                   <tr>
//                     <td colSpan={6} className="text-center py-8 text-gray-400">No credit notes found.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </section>
//           {/* Form */}
//           <section>
//             <form onSubmit={handleSubmit} className="space-y-8">
//               {/* Supplier & Assignment */}
//               <div className={`bg-white rounded-2xl shadow border border-${ACCENT}-200 px-8 py-6 space-y-6`}>
//                 <h2 className={`text-lg font-bold flex items-center gap-2 text-${ACCENT}-700 mb-3`}>
//                   <FileText className="h-5 w-5" /> Supplier & Assignment
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div>
//                     <label className="block mb-1 font-medium">Supplier <span className="text-red-600">*</span></label>
//                     <select
//                       value={formData.supplier_id}
//                       onChange={e => handleInputChange('supplier_id', e.target.value)}
//                       className={`w-full px-4 py-2 border rounded-lg ${inputAccent}`}
//                       required
//                     >
//                       <option value="">Select</option>
//                       {suppliers.map(supplier => (
//                         <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block mb-1 font-medium">Supplier Invoice No</label>
//                     <select
//                       value={formData.assignment_id}
//                       onChange={e => handleInputChange('assignment_id', e.target.value)}
//                       className={`w-full px-4 py-2 border rounded-lg ${inputAccent}`}
//                     >
//                       <option value="">Select Invoice</option>
//                       {assignments
//                         .filter(a => !formData.supplier_id || String(a.supplier_id) === String(formData.supplier_id))
//                         .map(a => (
//                           <option key={a.id} value={a.id}>
//                             {a.supplier_invoice_no} ({a.job_number})
//                           </option>
//                         ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block mb-1 font-medium">Job No</label>
//                     <input
//                       type="text"
//                       className={`w-full px-4 py-2 border rounded-lg ${inputAccent}`}
//                       value={assignment ? assignment.job_number : formData.job_number}
//                       onChange={e => handleInputChange('job_number', e.target.value)}
//                       disabled={!!assignment}
//                     />
//                   </div>
//                 </div>
//               </div>
//               {/* Credit Note Info */}
//               <div className={`bg-white rounded-2xl shadow border border-${ACCENT}-200 px-8 py-6 space-y-6`}>
//                 <h2 className={`text-lg font-bold flex items-center gap-2 text-${ACCENT}-700 mb-3`}>
//                   <FileText className="h-5 w-5" /> Credit Note Info
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div>
//                     <label className="block mb-1 font-medium">Credit Note No <span className="text-red-600">*</span></label>
//                     <input
//                       type="text"
//                       className={`w-full px-4 py-2 border rounded-lg ${inputAccent}`}
//                       value={formData.credit_note_no}
//                       onChange={e => handleInputChange('credit_note_no', e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block mb-1 font-medium">Date <span className="text-red-600">*</span></label>
//                     <input
//                       type="date"
//                       className={`w-full px-4 py-2 border rounded-lg ${inputAccent}`}
//                       value={formData.credit_note_date}
//                       onChange={e => handleInputChange('credit_note_date', e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block mb-1 font-medium">Port</label>
//                     <select
//                       value={formData.port_id}
//                       onChange={e => handleInputChange('port_id', e.target.value)}
//                       className={`w-full px-4 py-2 border rounded-lg ${inputAccent}`}
//                     >
//                       <option value="">Select Port</option>
//                       {ports.map(port => (
//                         <option key={port.id} value={port.id}>{port.name}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>
//               {/* Line Items */}
//               <div className={`bg-white rounded-2xl shadow border border-${ACCENT}-200 px-8 py-6`}>
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className={`text-lg font-bold flex items-center gap-2 text-${ACCENT}-700`}>
//                     <Plus className="h-5 w-5 text-green-600" /> Line Items
//                   </h2>
//                   <button
//                     type="button"
//                     onClick={addLineItem}
//                     className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md ${fadeClass}`}
//                     title="Add Line Item"
//                   >
//                     <Plus className="w-5 h-5 mr-1" />
//                     Add Item
//                   </button>
//                 </div>
//                 <div className="overflow-x-auto rounded-lg border border-gray-100">
//                   <table className="min-w-full border-collapse text-sm">
//                     <thead className={`bg-gray-100`}>
//                       <tr>
//                         <th className="px-4 py-2 text-left">Description</th>
//                         <th className="px-4 py-2 text-left">Quantity</th>
//                         <th className="px-4 py-2 text-left">Unit Price</th>
//                         <th className="px-4 py-2 text-left">Amount</th>
//                         <th className="px-4 py-2 text-left"></th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {lineItems.map((item, idx) => (
//                         <tr key={item.id} className={idx % 2 ? "bg-gray-50" : ""}>
//                           <td className="px-4 py-2">
//                             <input
//                               ref={idx === lineItems.length - 1 ? lastLineItemRef : null}
//                               type="text"
//                               placeholder="Description"
//                               className={`w-full px-3 py-1 border rounded-md ${inputAccent}`}
//                               value={item.description}
//                               onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
//                               required
//                             />
//                           </td>
//                           <td className="px-4 py-2">
//                             <input
//                               type="number"
//                               placeholder="Quantity"
//                               className={`w-full px-3 py-1 border rounded-md ${inputAccent}`}
//                               value={item.quantity}
//                               onChange={(e) => handleLineItemChange(item.id, 'quantity', e.target.value)}
//                               min="0"
//                               step="0.01"
//                               required
//                             />
//                           </td>
//                           <td className="px-4 py-2">
//                             <input
//                               type="number"
//                               placeholder="Unit Price"
//                               className={`w-full px-3 py-1 border rounded-md ${inputAccent}`}
//                               value={item.unit_price}
//                               onChange={(e) => handleLineItemChange(item.id, 'unit_price', e.target.value)}
//                               min="0"
//                               step="0.01"
//                               required
//                             />
//                           </td>
//                           <td className="px-4 py-2">
//                             <input
//                               type="text"
//                               className="w-full px-3 py-1 border rounded-md bg-gray-50 font-semibold"
//                               value={item.amount}
//                               readOnly
//                             />
//                           </td>
//                           <td className="px-4 py-2">
//                             <button
//                               type="button"
//                               onClick={() => removeLineItem(item.id)}
//                               disabled={lineItems.length <= 1}
//                               className={`p-2 rounded-full transition ${
//                                 lineItems.length > 1 
//                                   ? 'text-red-600 hover:bg-red-100' 
//                                   : 'text-gray-400 cursor-not-allowed'
//                               }`}
//                               title={lineItems.length > 1 ? "Remove item" : "Cannot remove last item"}
//                             >
//                               <Trash2 className="w-5 h-5" />
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                       {/* Totals Row */}
//                       <tr className="bg-gray-50 font-semibold">
//                         <td colSpan={3} className="text-right px-4 py-2">Sub Total</td>
//                         <td className="px-4 py-2">{formData.total_amount}</td>
//                         <td></td>
//                       </tr>
//                       <tr className="bg-gray-50 font-semibold">
//                         <td colSpan={3} className="text-right px-4 py-2">VAT (18%)</td>
//                         <td className="px-4 py-2">{formData.vat_amount}</td>
//                         <td></td>
//                       </tr>
//                       <tr className={`bg-gray-100 font-bold text-${ACCENT}-800 text-lg`}>
//                         <td colSpan={3} className="text-right px-4 py-2">Grand Total</td>
//                         <td className="px-4 py-2">{formData.grand_total}</td>
//                         <td></td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//               {/* Actions */}
//               <div className="flex justify-end space-x-4">
//                 <button
//                   type="button"
//                   onClick={handleReset}
//                   className={`px-6 py-2 bg-gray-400 hover:bg-gray-600 text-white rounded-lg flex items-center transition`}
//                   disabled={isLoading}
//                 >
//                   <XCircle className="w-5 h-5 mr-1" />
//                   Reset
//                 </button>
//                 <button
//                   type="submit"
//                   className={`px-6 py-2 bg-${ACCENT}-600 hover:bg-${ACCENT}-700 text-white rounded-lg flex items-center shadow-lg ${fadeClass}`}
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="w-5 h-5 mr-1 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="w-5 h-5 mr-1" />
//                       {editingId ? "Update Credit Note" : "Save Credit Note"}
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default SupplierCreditNote;


import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, 
  ArrowUp, ArrowDown, CheckCircle, AlertTriangle, Eye, Calculator, Settings,
  Loader, Check, AlertCircle as Alert
} from 'lucide-react';
import Select from 'react-select';

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

const SupplierCreditNote = () => {
  // State management
  const [suppliers, setSuppliers] = useState([]);
  const [ports, setPorts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [creditNotes, setCreditNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('credit_note_date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    supplier_id: '',
    credit_note_no: `CN-${Math.floor(Math.random() * 1000)}`,
    credit_note_date: new Date().toISOString().split('T')[0],
    total_amount: '',
    vat_amount: '',
    grand_total: '',
    assignment_id: '',
    port_id: '',
    job_number: ''
  });
  
  const [lineItems, setLineItems] = useState([
    { id: 1, description: '', quantity: '', unit_price: '', amount: '' }
  ]);

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
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [suppliersRes, portsRes, assignmentsRes, creditNotesRes] = await Promise.all([
          fetch(`${API_URL}/suppliers`, { headers: getAuthHeaders() }),
          fetch(`${API_URL}/ports`, { headers: getAuthHeaders() }),
          fetch(`${API_URL}/supplier-assignments`, { headers: getAuthHeaders() }),
          fetch(`${API_URL}/supplier-credit-notes`, { headers: getAuthHeaders() })
        ]);

        const suppliersData = await suppliersRes.json();
        const portsData = await portsRes.json();
        const assignmentsData = await assignmentsRes.json();
        const creditNotesData = await creditNotesRes.json();

        setSuppliers(Array.isArray(suppliersData) ? suppliersData : suppliersData.data || []);
        setPorts(Array.isArray(portsData) ? portsData : portsData.data || []);
        setAssignments(assignmentsData.data || []);
        setCreditNotes(creditNotesData.data || []);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate line item amounts and totals
  useEffect(() => {
    const updated = lineItems.map(item => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unit_price) || 0;
      return { ...item, amount: (quantity * unitPrice).toFixed(2) };
    });
    
    const subTotal = updated.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
    const vatAmount = subTotal * 0.15; // 15% VAT
    const totalAmount = subTotal + vatAmount;
    
    setFormData(prev => ({
      ...prev,
      total_amount: subTotal.toFixed(2),
      vat_amount: vatAmount.toFixed(2),
      grand_total: totalAmount.toFixed(2)
    }));
    
    setLineItems(updated);
  }, [lineItems.map(item => `${item.quantity}-${item.unit_price}`).join(',')]);

  // Form handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccessMessage('');
  };
  const handleToggleAddForm = (e) => {
    e.preventDefault();
    console.log('Add Credit Note button clicked, current state:', isAdding);
    
    if (isAdding) {
      // If currently adding, cancel and reset
      resetForm();
    } else {
      // If not adding, start adding
      setIsAdding(true);
      setEditingId(null);
      setError('');
      setSuccessMessage('');
    }
  };
  
  const handleLineItemChange = (id, field, value) => {
    setLineItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addLineItem = () => {
    const newId = lineItems.length > 0
      ? Math.max(...lineItems.map(item => item.id)) + 1
      : 1;
    setLineItems([
      ...lineItems,
      { id: newId, description: '', quantity: '', unit_price: '', amount: '' }
    ]);
  };

  const removeLineItem = (id) => {
    if (lineItems.length <= 1) return;
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      supplier_id: '',
      credit_note_no: `CN-${Math.floor(Math.random() * 1000)}`,
      credit_note_date: new Date().toISOString().split('T')[0],
      total_amount: '',
      vat_amount: '',
      grand_total: '',
      assignment_id: '',
      port_id: '',
      job_number: ''
    });
    setLineItems([{ id: 1, description: '', quantity: '', unit_price: '', amount: '' }]);
    setEditingId(null);
    setIsAdding(false);
    setError('');
    setSuccessMessage('');
  };

  // CRUD operations
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.supplier_id || !formData.credit_note_no) {
      setError('Please fill all required fields');
      return;
    }

    try {
      const selectedAssignment = assignments.find(a => String(a.id) === String(formData.assignment_id));
      const payload = {
        supplier_id: formData.supplier_id,
        credit_note_no: formData.credit_note_no,
        credit_note_date: formData.credit_note_date,
        total_amount: formData.total_amount,
        vat_amount: formData.vat_amount,
        grand_total: formData.grand_total,
        supplier_invoice_no: selectedAssignment ? selectedAssignment.supplier_invoice_no : undefined,
        job_number: selectedAssignment ? selectedAssignment.job_number : formData.job_number,
        port_id: formData.port_id,
        assignment_id: formData.assignment_id,
        lineItems: lineItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount
        }))
      };

      let res;
      if (editingId) {
        res = await fetch(`${API_URL}/supplier-credit-notes/${editingId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        setSuccessMessage('Credit Note updated successfully!');
      } else {
        res = await fetch(`${API_URL}/supplier-credit-notes`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        setSuccessMessage('Credit Note created successfully!');
      }

      if (res.ok) {
        // Refresh credit notes
        const creditNotesRes = await fetch(`${API_URL}/supplier-credit-notes`, { headers: getAuthHeaders() });
        const creditNotesData = await creditNotesRes.json();
        setCreditNotes(creditNotesData.data || []);
        resetForm();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error('Failed to save credit note');
      }
    } catch (err) {
      setError(err.message || 'Failed to save credit note');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setFormData({
      supplier_id: note.supplier_id,
      credit_note_no: note.credit_note_no,
      credit_note_date: note.credit_note_date?.substring(0, 10),
      total_amount: note.total_amount,
      vat_amount: note.vat_amount,
      grand_total: note.grand_total,
      assignment_id: note.assignment_id || '',
      port_id: note.port_id || '',
      job_number: note.job_number || ''
    });
    setLineItems(note.lineItems?.map((li, idx) => ({
      id: idx + 1,
      description: li.description,
      quantity: li.quantity,
      unit_price: li.unit_price,
      amount: li.amount
    })) || [{ id: 1, description: '', quantity: '', unit_price: '', amount: '' }]);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this credit note?')) return;
    
    try {
      const res = await fetch(`${API_URL}/supplier-credit-notes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (res.ok) {
        // Refresh credit notes
        const creditNotesRes = await fetch(`${API_URL}/supplier-credit-notes`, { headers: getAuthHeaders() });
        const creditNotesData = await creditNotesRes.json();
        setCreditNotes(creditNotesData.data || []);
        setSuccessMessage('Credit note deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error('Failed to delete credit note');
      }
    } catch (err) {
      setError('Failed to delete credit note');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Helper functions
  const getSupplierName = (id) => {
    const supplier = suppliers.find(s => String(s.id) === String(id));
    return supplier ? supplier.name : 'N/A';
  };

  const getPortName = (id) => {
    const port = ports.find(p => String(p.id) === String(id));
    return port ? port.name : 'N/A';
  };

  const getTotalAmount = () => {
    return creditNotes.reduce((sum, note) => sum + parseFloat(note.grand_total || 0), 0).toFixed(2);
  };

  // Filtering and sorting
  const filteredCreditNotes = creditNotes.filter(note => {
    const supplierName = getSupplierName(note.supplier_id).toLowerCase();
    const creditNoteNo = (note.credit_note_no || '').toLowerCase();
    const jobNumber = (note.job_number || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return supplierName.includes(searchLower) || 
           creditNoteNo.includes(searchLower) || 
           jobNumber.includes(searchLower);
  });

  const sortedCreditNotes = [...filteredCreditNotes].sort((a, b) => {
    let valA, valB;
    if (sortColumn === 'credit_note_no') {
      valA = a.credit_note_no ? a.credit_note_no.toLowerCase() : '';
      valB = b.credit_note_no ? b.credit_note_no.toLowerCase() : '';
    } else if (sortColumn === 'credit_note_date') {
      valA = a.credit_note_date || '';
      valB = b.credit_note_date || '';
    } else {
      valA = a[sortColumn] || '';
      valB = b[sortColumn] || '';
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedCreditNotes.length / PAGE_SIZE);
  const paginatedCreditNotes = sortedCreditNotes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Sorting handler
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Render sort icon
  const renderSortIcon = (column) => {
    if (sortColumn !== column) return <ArrowUp className="w-3 h-3 text-gray-400 inline" />;
    return sortOrder === 'asc' ?
      <ArrowUp className="w-3 h-3 text-indigo-600 inline" /> :
      <ArrowDown className="w-3 h-3 text-indigo-600 inline" />;
  };

  // Prepare options for dropdowns
  const supplierOptions = suppliers.map(supplier => ({
    value: supplier.id,
    label: supplier.name
  }));

  const portOptions = ports.map(port => ({
    value: port.id,
    label: port.name
  }));

  const assignmentOptions = assignments
    .filter(a => !formData.supplier_id || String(a.supplier_id) === String(formData.supplier_id))
    .map(a => ({
      value: a.id,
      label: `${a.supplier_invoice_no} (${a.job_number})`
    }));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, creditNotes]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading supplier credit notes...</p>
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
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              Supplier Credit Note Management
            </h1>
            <p className="text-gray-600 mt-2">Create and manage supplier credit notes</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
  type="button" // Add this to prevent form submission
  onClick={handleToggleAddForm}
  className={`px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
    ${isAdding 
      ? 'bg-red-600 hover:bg-red-700' 
      : 'bg-indigo-600 hover:bg-indigo-700'}`}
>
  {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
  {isAdding ? 'Cancel' : 'Add Credit Note'}
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
              SEARCH CREDIT NOTES
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Credit Note No, Supplier, or Job Number
                </label>
                <input
                  type="text"
                  placeholder="Search credit notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Credit Note Form */}
        {isAdding && (
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700">
                  {editingId ? 'Edit Credit Note' : 'Add New Credit Note'}
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
                        value={supplierOptions.find(option => option.value == formData.supplier_id)}
                        onChange={(selectedOption) => handleInputChange('supplier_id', selectedOption?.value || '')}
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
                        Credit Note No <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.credit_note_no}
                        onChange={(e) => handleInputChange('credit_note_no', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Enter credit note number"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Credit Note Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.credit_note_date}
                        onChange={(e) => handleInputChange('credit_note_date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supplier Invoice No
                      </label>
                      <Select
                        options={assignmentOptions}
                        value={assignmentOptions.find(option => option.value == formData.assignment_id)}
                        onChange={(selectedOption) => handleInputChange('assignment_id', selectedOption?.value || '')}
                        placeholder="Select Invoice"
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
                      <input
                        type="text"
                        value={formData.job_number}
                        onChange={(e) => handleInputChange('job_number', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Enter job number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Port
                      </label>
                      <Select
                        options={portOptions}
                        value={portOptions.find(option => option.value == formData.port_id)}
                        onChange={(selectedOption) => handleInputChange('port_id', selectedOption?.value || '')}
                        placeholder="Select Port"
                        isSearchable
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={selectStyles}
                        className="w-full text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Line Items */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-semibold text-gray-800">Line Items</h3>
                    <button
                      type="button"
                      onClick={addLineItem}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Item
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {lineItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                placeholder="Description"
                                value={item.description}
                                onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                                required
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                placeholder="Quantity"
                                value={item.quantity}
                                onChange={(e) => handleLineItemChange(item.id, 'quantity', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                                min="0"
                                step="0.01"
                                required
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                placeholder="Unit Price"
                                value={item.unit_price}
                                onChange={(e) => handleLineItemChange(item.id, 'unit_price', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                                min="0"
                                step="0.01"
                                required
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={item.amount}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-50 text-sm font-medium"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => removeLineItem(item.id)}
                                disabled={lineItems.length <= 1}
                                className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        
                        {/* Totals */}
                        <tr className="bg-gray-50 font-medium">
                          <td colSpan={3} className="px-4 py-3 text-right">Subtotal:</td>
                          <td className="px-4 py-3">SAR {formData.total_amount}</td>
                          <td></td>
                        </tr>
                        <tr className="bg-gray-50 font-medium">
                          <td colSpan={3} className="px-4 py-3 text-right">VAT (15%):</td>
                          <td className="px-4 py-3">SAR {formData.vat_amount}</td>
                          <td></td>
                        </tr>
                        <tr className="bg-gray-100 font-bold text-indigo-800">
                          <td colSpan={3} className="px-4 py-3 text-right">Grand Total:</td>
                          <td className="px-4 py-3">SAR {formData.grand_total}</td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg shadow transition text-sm"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm"
                  >
                    {editingId ? 'Update Credit Note' : 'Add Credit Note'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Credit Note Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Credit Note Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">SAR {getTotalAmount()}</span>
            </div>
          </div>
        </div>

        {/* Credit Notes Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'Credit Note No', key: 'credit_note_no' },
                    { label: 'Date', key: 'credit_note_date' },
                    { label: 'Supplier', key: 'supplier_name' },
                    { label: 'Job Number', key: 'job_number' },
                    { label: 'Grand Total', key: 'grand_total' },
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
                {paginatedCreditNotes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      No credit note records found
                    </td>
                  </tr>
                ) : (
                  paginatedCreditNotes.map((note) => (
                    <tr key={note.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {note.credit_note_no}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {note.credit_note_date ? new Date(note.credit_note_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {getSupplierName(note.supplier_id)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {note.job_number || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                        SAR {parseFloat(note.grand_total || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleEdit(note)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
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
              Showing {((currentPage - 1) * PAGE_SIZE) + 1} to{' '}
              {Math.min(currentPage * PAGE_SIZE, sortedCreditNotes.length)} of {sortedCreditNotes.length} credit notes
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
                  disabled={currentPage === totalPages || totalPages === 0}
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
      </div>
    </div>
  );
};

export default SupplierCreditNote;
