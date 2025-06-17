
// import React, { useState, useEffect } from 'react';

// function AssignSupplier() {
//   const currentUser = 'VatsalUmrania'; // Current user's login
//   const currentDateTime = '2025-06-14 09:23:57'; // Current UTC datetime

//   // Get authentication headers
//   const getAuthHeaders = () => {
//     const token = localStorage.getItem('authToken');
//     if (!token) throw new Error('Authentication token missing');
//     return { 
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     };
//   };

//   // Main form state
//   const [formData, setFormData] = useState({
//     selectedSupplierId: '',
//     supplierInvoiceNo: '',
//     jobNumber: '',
//     invoiceDate: '',
//     vatRate: 0.15,
//     createdBy: currentUser,
//     createdAt: currentDateTime
//   });

//   // Other state variables
//   const [supplierList, setSupplierList] = useState([]);
//   const [selectedSupplier, setSelectedSupplier] = useState(null);
//   const [items, setItems] = useState([{ purpose: '', item: '', quantity: '', amount: '' }]);
//   const [totals, setTotals] = useState({
//     totalAmount: 0,
//     vatAmount: 0,
//     billTotalWithVAT: 0,
//   });
//   const [successMessage, setSuccessMessage] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [lastInvoiceNumber, setLastInvoiceNumber] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch initial data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch suppliers
//         const suppliersRes = await fetch('http://localhost:5000/api/suppliers', {
//           headers: getAuthHeaders()
//         });
        
//         if (!suppliersRes.ok) {
//           throw new Error(`Failed to fetch suppliers: ${suppliersRes.status} ${suppliersRes.statusText}`);
//         }
        
//         const suppliersData = await suppliersRes.json();
//         setSupplierList(suppliersData);
        
//         // Fetch last invoice number
//         const invoiceRes = await fetch('http://localhost:5000/api/supplier-assignments/last-invoice', {
//           headers: getAuthHeaders()
//         });
        
//         if (invoiceRes.ok) {
//           const invoiceData = await invoiceRes.json();
//           if (invoiceData.lastInvoiceNumber) {
//             setLastInvoiceNumber(invoiceData.lastInvoiceNumber);
//             // Set initial invoice number
//             const nextInvoiceNumber = `INV-${String(parseInt(invoiceData.lastInvoiceNumber.replace('INV-', '')) + 1).padStart(3, '0')}`;
//             setFormData(prev => ({
//               ...prev,
//               supplierInvoiceNo: nextInvoiceNumber
//             }));
//           }
//         }
//       } catch (err) {
//         console.error('Failed to fetch data', err);
//         setError('Failed to load data. Please try again later.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Update selected supplier when selection changes
//   useEffect(() => {
//     if (formData.selectedSupplierId) {
//       const supplier = supplierList.find(s => s._id === formData.selectedSupplierId);
//       setSelectedSupplier(supplier);
//     } else {
//       setSelectedSupplier(null);
//     }
//   }, [formData.selectedSupplierId, supplierList]);

//   // Calculate totals when items or VAT rate changes
//   useEffect(() => {
//     let calculatedTotalAmount = 0;
//     items.forEach((item) => {
//       if (item.quantity && item.amount) {
//         calculatedTotalAmount += parseFloat(item.quantity) * parseFloat(item.amount);
//       }
//     });
    
//     const calculatedVatAmount = calculatedTotalAmount * formData.vatRate;
//     const calculatedBillTotalWithVAT = calculatedTotalAmount + calculatedVatAmount;
    
//     setTotals({
//       totalAmount: calculatedTotalAmount,
//       vatAmount: calculatedVatAmount,
//       billTotalWithVAT: calculatedBillTotalWithVAT,
//     });
//   }, [items, formData.vatRate]);

//   // Form event handlers
//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleItemChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedItems = [...items];
//     updatedItems[index] = { 
//       ...updatedItems[index], 
//       [name]: value
//     };
//     setItems(updatedItems);
//   };

//   const handleAddItem = () => {
//     setItems(prev => [...prev, { purpose: '', item: '', quantity: '', amount: '' }]);
//   };

//   const handleRemoveItem = (index) => {
//     if (items.length === 1) {
//       setItems([{ purpose: '', item: '', quantity: '', amount: '' }]);
//     } else {
//       setItems(prev => prev.filter((_, i) => i !== index));
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       selectedSupplierId: '',
//       supplierInvoiceNo: lastInvoiceNumber
//         ? `INV-${String(parseInt(lastInvoiceNumber.replace('INV-', '')) + 1).padStart(3, '0')}`
//         : '',
//       jobNumber: '',
//       invoiceDate: '',
//       vatRate: 0.15,
//       createdBy: currentUser,
//       createdAt: currentDateTime
//     });
//     setItems([{ purpose: '', item: '', quantity: '', amount: '' }]);
//     setSelectedSupplier(null);
//     setError('');
//   };

//   const isFormValid = () => {
//     if (!formData.selectedSupplierId) return false;
//     if (!formData.supplierInvoiceNo.trim()) return false;
//     if (!formData.jobNumber.trim()) return false;
//     if (!formData.invoiceDate) return false;
//     if (!formData.vatRate || isNaN(parseFloat(formData.vatRate))) return false;
  
//     if (!items.length) return false;
//     for (const item of items) {
//       if (!item.item.trim() || !item.quantity || !item.amount) return false;
//     }
  
//     return true;
//   };
  

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError('');
  
//     try {
//       if (!isFormValid()) {
//         throw new Error('Please fill in all required fields');
//       }
  
//       const assignmentData = {
//         selectedSupplierId: Number(formData.selectedSupplierId),
//         supplierInvoiceNo: formData.supplierInvoiceNo.trim(),
//         jobNumber: formData.jobNumber.trim(),
//         invoiceDate: formData.invoiceDate,
//         vatRate: Number(formData.vatRate),
//         totalAmount: Number(totals.totalAmount.toFixed(2)),
//         vatAmount: Number(totals.vatAmount.toFixed(2)),
//         billTotalWithVAT: Number(totals.billTotalWithVAT.toFixed(2)),
//         items: items.map(item => ({
//           purpose: item.purpose || '',
//           item: item.item.trim(),
//           quantity: Number(item.quantity),
//           amount: Number(item.amount)
//         }))
//       };
  
//       console.log('Sending assignmentData:', assignmentData);
  
//       const response = await fetch('http://localhost:5000/api/supplier-assignments', {
//         method: 'POST',
//         headers: getAuthHeaders(),
//         body: JSON.stringify(assignmentData)
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to create assignment');
//       }
  
//       setSuccessMessage('Supplier assigned successfully!');
//       setTimeout(() => {
//         setSuccessMessage('');
//         resetForm();
//       }, 5000);
  
//     } catch (err) {
//       console.error('Assignment failed:', err);
//       setError(err.message || 'An error occurred. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-8 h-8 mr-3 text-indigo-600"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
//               <path strokeLinecap="round" strokeLinejoin="round" d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//             </svg>
//             ASSIGN SUPPLIER
//           </h1>
//           <p className="text-gray-600 mt-2">Created by: {currentUser} at {currentDateTime}</p>
//         </div>

//         {/* Messages */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//             {error}
//           </div>
//         )}

//         {successMessage && (
//           <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
//             {successMessage}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-8">
//           <Card>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <TextInput
//                 label="Supplier"
//                 as="select"
//                 name="selectedSupplierId"
//                 value={formData.selectedSupplierId}
//                 onChange={handleFormChange}
//                 required
//               >
//                 <option key="default" value="">--Select Supplier--</option>
//                 {supplierList.map((supplier) => (
//                   <option key={supplier._id} value={supplier._id}>
//                     {supplier.name}
//                   </option>
//                 ))}
//               </TextInput>
//               <label htmlFor="supplierId">Supplier ID:</label>
// <input
//   type="text"
//   id="supplierId"
//   name="supplierId"
//   value={formData.selectedSupplierId || ''}
//   onChange={(e) => setFormData({ ...formData, selectedSupplierId: e.target.value })}
//   placeholder="Enter Supplier ID"
// />

//               <TextInput
//                 label="Job Number"
//                 name="jobNumber"
//                 value={formData.jobNumber}
//                 onChange={handleFormChange}
//                 required
//               />

//               <TextInput
//                 label="Supplier Invoice No"
//                 name="supplierInvoiceNo"
//                 value={formData.supplierInvoiceNo}
//                 onChange={handleFormChange}
//                 required
//                 readOnly={lastInvoiceNumber !== null}
//               />

//               <TextInput
//                 label="Invoice Date"
//                 type="date"
//                 name="invoiceDate"
//                 value={formData.invoiceDate}
//                 onChange={handleFormChange}
//                 required
//               />
//             </div>

//             {selectedSupplier && (
//               <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
//                 <h3 className="font-semibold text-gray-700 mb-2">Supplier Details:</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-gray-600"><span className="font-medium">Name:</span> {selectedSupplier.name}</p>
//                     <p className="text-gray-600"><span className="font-medium">Address:</span> {selectedSupplier.address}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600"><span className="font-medium">Phone:</span> {selectedSupplier.phone}</p>
//                     <p className="text-gray-600"><span className="font-medium">Email:</span> {selectedSupplier.email}</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </Card>

//           {/* VAT Rate */}
//           <Card>
//             <div className="flex items-center space-x-4">
//               <label className="text-sm font-medium text-gray-700">
//                 VAT Rate
//               </label>
//               <input
//                 type="range"
//                 min="0"
//                 max="0.5"
//                 step="0.01"
//                 name="vatRate"
//                 value={formData.vatRate}
//                 onChange={handleFormChange}
//                 className="flex-1"
//               />
//               <span className="text-lg font-medium bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg">
//                 {(formData.vatRate * 100).toFixed(0)}%
//               </span>
//             </div>
//           </Card>

//           {/* Items */}
//           <Card title="Items">
//             {items.map((item, index) => (
//               <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
//                 <TextInput
//                   label="Purpose"
//                   name="purpose"
//                   value={item.purpose}
//                   onChange={(e) => handleItemChange(index, e)}
//                 />
//                 <TextInput
//                   label="Item"
//                   name="item"
//                   value={item.item}
//                   onChange={(e) => handleItemChange(index, e)}
//                   required
//                 />
//                 <TextInput
//                   label="Quantity"
//                   type="number"
//                   name="quantity"
//                   value={item.quantity}
//                   onChange={(e) => handleItemChange(index, e)}
//                   min="0"
//                   step="0.01"
//                 />
//                 <TextInput
//                   label="Amount"
//                   type="number"
//                   name="amount"
//                   value={item.amount}
//                   onChange={(e) => handleItemChange(index, e)}
//                   required
//                   min="0"
//                   step="0.01"
//                 />
//                 <div className="flex items-end">
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveItem(index)}
//                     className="px-3 py-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
//                     disabled={items.length === 1}
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
            
//             <button
//               type="button"
//               onClick={handleAddItem}
//               className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//             >
//               Add Item
//             </button>
//           </Card>

//           {/* Totals */}
//           <Card>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Total Amount</label>
//                 <input
//                   type="text"
//                   value={`$${totals.totalAmount.toFixed(2)}`}
//                   readOnly
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">VAT Amount</label>
//                 <input
//                   type="text"
//                   value={`$${totals.vatAmount.toFixed(2)}`}
//                   readOnly
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Total with VAT</label>
//                 <input
//                   type="text"
//                   value={`$${totals.billTotalWithVAT.toFixed(2)}`}
//                   readOnly
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
//                 />
//               </div>
//             </div>
//           </Card>

//           {/* Form Actions */}
//           <div className="flex space-x-4">
//             <button
//               type="button"
//               onClick={resetForm}
//               className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//             >
//               Reset
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting || !isFormValid()}
//               className={`flex-1 px-6 py-3 bg-green-600 text-white rounded-lg transition-colors ${
//                 isSubmitting || !isFormValid() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
//               }`}
//             >
//               {isSubmitting ? 'Saving...' : 'Save'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // Card Component
// const Card = ({ title, children }) => (
//   <div className="bg-white rounded-lg shadow-md overflow-hidden">
//     {title && (
//       <div className="bg-gray-50 px-4 py-3 border-b">
//         <h3 className="text-lg font-medium text-gray-900">{title}</h3>
//       </div>
//     )}
//     <div className="p-4">{children}</div>
//   </div>
// );

// // TextInput Component
// const TextInput = ({
//   label,
//   type = 'text',
//   name,
//   value,
//   onChange,
//   required = false,
//   readOnly = false,
//   as,
//   children,
//   ...props
// }) => {
//   const baseClassName = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";
  
//   return (
//     <div>
//       {label && (
//         <label className="block text-sm font-medium text-gray-700">
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
//       )}
//       {as === 'select' ? (
//         <select
//           name={name}
//           value={value}
//           onChange={onChange}
//           className={`${baseClassName} ${readOnly ? 'bg-gray-50' : ''}`}
//           required={required}
//           {...props}
//         >
//           {children}
//         </select>
//       ) : (
//         <input
//           type={type}
//           name={name}
//           value={value}
//           onChange={onChange}
//           className={`${baseClassName} ${readOnly ? 'bg-gray-50' : ''}`}
//           required={required}
//           readOnly={readOnly}
//           {...props}
//         />
//       )}
//     </div>
//   );
// };

// export default AssignSupplier;

// AddSupplier.jsx
import { useState, useEffect } from 'react';
import { Truck, Plus, Pencil, Trash2, ChevronDown, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

const AddSupplierPage = () => {
  // State for suppliers
  const API_URL = 'http://localhost:5000/api/suppliers';
  const INVOICE_API_URL = 'http://localhost:5000/api/supplier-assignments';

  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    vat_number: '',
    registration_number: '',
    registration_date: '',
  });

  // NEW: State for supplier invoices
  const [invoices, setInvoices] = useState([]);
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

  const [isAdding, setIsAdding] = useState(true);
  const [isAddingInvoice, setIsAddingInvoice] = useState(false); // NEW
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const itemsPerPage = 5;
  const [activeTab, setActiveTab] = useState('suppliers'); // NEW: Tab state

  // Helper function to get authorization headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication token missing');
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch suppliers from backend
  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL, {
        headers: getAuthHeaders(), // Add auth headers
      });
  
      if (!res.ok) throw new Error('Failed to fetch suppliers');
      const data = await res.json();
      setSuppliers(data);
      setError('');
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError('Failed to fetch suppliers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }; 
  
  // NEW: Fetch invoices from backend

  
  // Create or update supplier
  const handleAddSupplier = async () => {
    if (!newSupplier.name.trim()) {
      setError('Supplier name is required');
      return;
    }

    try {
      const headers = getAuthHeaders();
      let res;

      if (editingId !== null) {
        // PUT: Update existing supplier
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(newSupplier),
        });
        if (!res.ok) throw new Error('Failed to update supplier');
      } else {
        // POST: Create new supplier
        res = await fetch(API_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify(newSupplier),
        });
        if (!res.ok) throw new Error('Failed to add supplier');
      }

      await fetchSuppliers();

      setNewSupplier({
        name: '',
        address: '',
        phone: '',
        email: '',
        vat_number: '',
        registration_number: '',
        registration_date: '',
      });

      setEditingId(null);
      setIsAdding(false);
      setError('');
    } catch (err) {
      console.error('Error saving supplier:', err);
      setError(err.message || 'Failed to save supplier');
    }
  };

  // NEW: Handle invoice form changes
  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice(prev => ({ ...prev, [name]: value }));
  };

  // NEW: Handle invoice item changes
  const handleItemChange = (index, field, value) => {
    const newItems = [...newInvoice.items];
    newItems[index][field] = value;
    
    // Recalculate totals
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

  // NEW: Add new item to invoice
  const addItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { purpose: '', item: '', quantity: 1, amount: 0 }]
    }));
  };

  // NEW: Remove item from invoice
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

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(INVOICE_API_URL, {
        headers: getAuthHeaders(),
      });
  
      if (!res.ok) throw new Error('Failed to fetch invoices');
      const responseData = await res.json();
      // Extract the data array from the response
      setInvoices(responseData.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to fetch invoices. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  // NEW: Submit invoice
  const handleSubmitInvoice = async () => {
    if (!newInvoice.selectedSupplierId) {
      setError('Please select a supplier');
      return;
    }
    
    if (!newInvoice.supplierInvoiceNo) {
      setError('Invoice number is required');
      return;
    }
    
    try {
      const res = await fetch(INVOICE_API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...newInvoice,
          selectedSupplierId: parseInt(newInvoice.selectedSupplierId)
        }),
      });

      if (!res.ok) throw new Error('Failed to create invoice');

      // Reset form
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
      
      setIsAddingInvoice(false);
      fetchInvoices();
      setError('');
    } catch (err) {
      console.error('Error creating invoice:', err);
      setError(err.message || 'Failed to create invoice');
    }
  };

  // Delete supplier
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error('Failed to delete supplier');

      await fetchSuppliers();
      setError('');
    } catch (err) {
      console.error('Error deleting supplier:', err);
      setError('Failed to delete supplier');
    }
  };
  useEffect(() => {
    fetchSuppliers(); // Fetch suppliers
    fetchInvoices();  // Fetch invoices
  }, []);
  // Edit supplier
  const handleEdit = (supplier) => {
    setNewSupplier({ ...supplier });
    setEditingId(supplier.id);
    setIsAdding(true);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSuppliers = [...suppliers].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredSuppliers = sortedSuppliers.filter(supplier => 
    supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.vat_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Truck className="w-8 h-8 mr-3 text-indigo-600" />
              SUPPLIER MANAGEMENT
            </h1>
            <p className="text-gray-600 mt-2">Manage suppliers and their invoices</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'suppliers' ? 'suppliers' : 'invoices'}...`}
                  className="bg-transparent outline-none w-40"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {activeTab === 'suppliers' ? (
              <button
                onClick={() => setIsAdding(!isAdding)}
                className={`px-5 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                  ${isAdding 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}
                `}
              >
                {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                {isAdding ? 'Cancel' : 'Add Supplier'}
              </button>
            ) : (
              <button
                onClick={() => setIsAddingInvoice(!isAddingInvoice)}
                className={`px-5 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
                  ${isAddingInvoice 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}
                `}
              >
                {isAddingInvoice ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                {isAddingInvoice ? 'Cancel' : 'Add Invoice'}
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'suppliers'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('suppliers')}
          >
            Suppliers
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'invoices'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('invoices')}
          >
            Supplier Invoices
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Supplier Management */}
        {activeTab === 'suppliers' && (
          <>
            {/* Add Supplier Form */}
            {isAdding && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    {editingId ? 'Edit Supplier Details' : 'Add Supplier Details'}
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Supplier Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter supplier name"
                          value={newSupplier.name}
                          onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter email address"
                          value={newSupplier.email}
                          onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            VAT Number
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter VAT number"
                            value={newSupplier.vat_number}
                            onChange={(e) => setNewSupplier({...newSupplier, vat_number: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Registration Number
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter registration number"
                            value={newSupplier.registration_number}
                            onChange={(e) => setNewSupplier({...newSupplier, registration_number: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Supplier Address
                        </label>
                        <textarea
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter supplier address"
                          rows="3"
                          value={newSupplier.address}
                          onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                        ></textarea>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter phone number"
                            value={newSupplier.phone}
                            onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Registration Date
                          </label>
                          <input
                            type="date"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={newSupplier.registration_date}
                            onChange={(e) => setNewSupplier({...newSupplier, registration_date: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-6">
                    <button
                      onClick={handleAddSupplier}
                      className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1 shadow-md flex items-center justify-center"
                    >
                      {editingId ? 'Update Supplier' : 'Save Supplier Details'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Supplier List Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">SUPPLIER LIST</h3>
                {isLoading ? (
                  <div className="text-sm text-indigo-600">Loading suppliers...</div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Showing {Math.min(filteredSuppliers.length, itemsPerPage)} of {filteredSuppliers.length} suppliers
                  </div>
                )}
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-max">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SLNo
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          Supplier Name
                          {sortField === 'name' && (
                            sortDirection === 'asc' ? 
                            <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
                            <ChevronDown className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('registration_date')}
                      >
                        <div className="flex items-center">
                          Register Date
                          {sortField === 'registration_date' && (
                            sortDirection === 'asc' ? 
                            <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" /> : 
                            <ChevronDown className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone No.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        VAT Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reg. Number
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                            <h4 className="text-lg font-medium text-gray-500">Loading suppliers...</h4>
                          </div>
                        </td>
                      </tr>
                    ) : currentSuppliers.length > 0 ? (
                      currentSuppliers.map((supplier, index) => (
                        <tr key={supplier.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">{supplier.address}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {supplier.registration_date || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{supplier.phone || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{supplier.vat_number || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{supplier.registration_number || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => handleEdit(supplier)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(supplier.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Truck className="w-16 h-16 text-gray-300 mb-4" />
                            <h4 className="text-lg font-medium text-gray-500">No suppliers found</h4>
                            <p className="text-gray-400 mt-1">Add a new supplier to get started</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {filteredSuppliers.length > itemsPerPage && !isLoading && (
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
          </>
        )}

        {/* Invoice Management */}
        {activeTab === 'invoices' && (
          <>
            {/* Add Invoice Form */}
            {isAddingInvoice && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Add Supplier Invoice
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Supplier <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={newInvoice.selectedSupplierId}
                          onChange={(e) => setNewInvoice({...newInvoice, selectedSupplierId: e.target.value})}
                        >
                          <option value="">Select Supplier</option>
                          {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Invoice Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter invoice number"
                          name="supplierInvoiceNo"
                          value={newInvoice.supplierInvoiceNo}
                          onChange={handleInvoiceChange}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Number
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter job number"
                          name="jobNumber"
                          value={newInvoice.jobNumber}
                          onChange={handleInvoiceChange}
                        />
                      </div>
                    </div>
                    
                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Invoice Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          name="invoiceDate"
                          value={newInvoice.invoiceDate}
                          onChange={handleInvoiceChange}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          VAT Rate (%)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter VAT rate"
                          name="vatRate"
                          value={newInvoice.vatRate}
                          onChange={handleInvoiceChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Invoice Items */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice Items</h3>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Item</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Amount (SAR)</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {newInvoice.items.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200">
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                                  placeholder="Purpose"
                                  value={item.purpose}
                                  onChange={(e) => handleItemChange(index, 'purpose', e.target.value)}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                                  placeholder="Item description"
                                  value={item.item}
                                  onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  min="1"
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                                  value={item.quantity}
                                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                                  value={item.amount}
                                  onChange={(e) => handleItemChange(index, 'amount', parseFloat(e.target.value) || 0)}
                                />
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => removeItem(index)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <button
                      type="button"
                      onClick={addItem}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Item
                    </button>
                  </div>
                  
                  {/* Invoice Summary */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Total Amount:</span>
                        <span className="font-medium">SAR {newInvoice.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700">VAT Amount:</span>
                        <span className="font-medium">SAR {newInvoice.vatAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-indigo-800 font-medium">Bill Total with VAT:</span>
                        <span className="font-bold text-indigo-800">SAR {newInvoice.billTotalWithVAT.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-6">
                    <button
                      onClick={handleSubmitInvoice}
                      className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1 shadow-md flex items-center justify-center"
                    >
                      Save Invoice
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Invoice List Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">SUPPLIER INVOICES</h3>
                {isLoading ? (
                  <div className="text-sm text-indigo-600">Loading invoices...</div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Showing {invoices.length} invoices
                  </div>
                )}
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-max">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supplier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Amount (SAR)
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  {/* <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                            <h4 className="text-lg font-medium text-gray-500">Loading invoices...</h4>
                          </div>
                        </td>
                      </tr>
                    ) : invoices.length > 0 ? (
                      invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {invoice.supplierInvoiceNo}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {suppliers.find(s => s.id === invoice.selectedSupplierId)?.name || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {invoice.jobNumber || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {invoice.invoiceDate}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {invoice.billTotalWithVAT.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Truck className="w-16 h-16 text-gray-300 mb-4" />
                            <h4 className="text-lg font-medium text-gray-500">No invoices found</h4>
                            <p className="text-gray-400 mt-1">Add a new invoice to get started</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody> */}
                  <tbody className="divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {invoice.supplier_invoice_no}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {suppliers.find(s => s.id === invoice.supplier_id)?.name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {invoice.job_number || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {new Date(invoice.invoice_date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {parseFloat(invoice.bill_total_with_vat).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {/* Action buttons */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddSupplierPage;