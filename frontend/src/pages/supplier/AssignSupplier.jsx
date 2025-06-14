// import React, { useState, useEffect } from 'react';

// const DUMMY_SUPPLIERS = [
//   { id: '1', name: 'ABC Logistics Co.', address: '123 Main St', phone: '123-456-7890', email: 'abc@example.com', vat: 'VAT123', number: 'REG1' },
//   { id: '2', name: 'Global Supply Inc.', address: '456 Oak Ave', phone: '987-654-3210', email: 'global@example.com', vat: 'VAT456', number: 'REG2' },
//   { id: '3', name: 'Quick Ship Solutions', address: '789 Pine Ln', phone: '555-123-4567', email: 'quick@example.com', vat: 'VAT789', number: 'REG3' },
// ];

// function AssignSupplier() {
//   // State for the main form fields
//   const [formData, setFormData] = useState({
//     selectedSupplierId: '',
//     supplierInvoiceNo: '',
//     jobNumber: '',
//     invoiceDate: '',
//     vatRate: 0.15, // Example VAT rate (15%) - adjust as needed
//   });

//   // State for dynamically added items
//   const [items, setItems] = useState([
//     { purpose: '', item: '', quantity: '', amount: '' }
//   ]);

//   // State for calculated totals
//   const [totals, setTotals] = useState({
//     totalAmount: 0,
//     vatAmount: 0,
//     billTotalWithVAT: 0,
//   });

//   // Handle changes for main form fields
//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // Handle changes for dynamic item fields
//   const handleItemChange = (index, e) => {
//     const { name, value } = e.target;
//     const newItems = [...items];
//     newItems[index] = { ...newItems[index], [name]: value };
//     setItems(newItems);
//   };

//   // Add a new empty item row
//   const handleAddItem = () => {
//     setItems(prev => [...prev, { purpose: '', item: '', quantity: '', amount: '' }]);
//   };

//   // Calculate totals whenever items or VAT rate change
//   useEffect(() => {
//     let calculatedTotalAmount = 0;
//     items.forEach(item => {
//       const amount = parseFloat(item.amount);
//       if (!isNaN(amount)) {
//         calculatedTotalAmount += amount;
//       }
//     });

//     const calculatedVatAmount = calculatedTotalAmount * formData.vatRate;
//     const calculatedBillTotalWithVAT = calculatedTotalAmount + calculatedVatAmount;

//     setTotals({
//       totalAmount: calculatedTotalAmount,
//       vatAmount: calculatedVatAmount,
//       billTotalWithVAT: calculatedBillTotalWithVAT,
//     });
//   }, [items, formData.vatRate]); // Recalculate when items or vatRate change

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Assign Supplier Data:', {
//       ...formData,
//       items,
//       ...totals,
//     });
//     // Here you would typically send this data to your backend API
//     alert('Assignment data logged to console! (Simulated Save)');
//     // Optionally reset form after submission
//     // resetForm();
//   };

//   // Optional: Function to reset the form state
//   const resetForm = () => {
//     setFormData({
//       selectedSupplierId: '',
//       supplierInvoiceNo: '',
//       jobNumber: '',
//       invoiceDate: '',
//       vatRate: 0.15,
//     });
//     setItems([{ purpose: '', item: '', quantity: '', amount: '' }]);
//     setTotals({
//       totalAmount: 0,
//       vatAmount: 0,
//       billTotalWithVAT: 0,
//     });
//   };

//   return (
//     <div className="w-screen min-h-screen bg from-white-50 to-white-100 p-4 font-sans antialiased flex items-center justify-center">
//       <div className="max-w-4xl w-full mx-auto bg-white p-8 rounded-2xl shadow-2xl transform transition-all duration-500 ease-in-out hover:shadow-3xl">
//         <h2 className="text-4xl font-extrabold text-white-900 mb-8 text-center tracking-tight">
//           Assign Supplier
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Top Row - Supplier, Job Number, Invoice Date, Supplier Invoice No */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Supplier Select */}
//             <div>
//               <label htmlFor="selectedSupplierId" className="block text-sm font-medium text-gray-700 mb-1">Supplier <span className="text-red-500">*</span></label>
//               <select
//                 id="selectedSupplierId"
//                 name="selectedSupplierId"
//                 value={formData.selectedSupplierId}
//                 onChange={handleFormChange}
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-300 ease-in-out text-gray-800 text-lg"
//                 required
//               >
//                 <option value="">--Select--</option>
//                 {DUMMY_SUPPLIERS.map((supplier) => (
//                   <option key={supplier.id} value={supplier.id}>
//                     {supplier.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Job Number */}
//             <div>
//               <label htmlFor="jobNumber" className="block text-sm font-medium text-gray-700 mb-1">Job Number <span className="text-red-500">*</span></label>
//               <input
//                 type="text"
//                 id="jobNumber"
//                 name="jobNumber"
//                 value={formData.jobNumber}
//                 onChange={handleFormChange}
//                 placeholder="Job Number"
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-300 ease-in-out text-gray-800 placeholder-gray-500 text-lg"
//                 required
//               />
//             </div>

//             {/* Supplier Invoice No */}
//             <div>
//               <label htmlFor="supplierInvoiceNo" className="block text-sm font-medium text-gray-700 mb-1">Supplier Invoice No <span className="text-red-500">*</span></label>
//               <input
//                 type="text"
//                 id="supplierInvoiceNo"
//                 name="supplierInvoiceNo"
//                 value={formData.supplierInvoiceNo}
//                 onChange={handleFormChange}
//                 placeholder="Supplier Invoice No"
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-300 ease-in-out text-gray-800 placeholder-gray-500 text-lg"
//                 required
//               />
//             </div>

//             {/* Invoice Date */}
//             <div>
//               <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 mb-1">Invoice Date <span className="text-red-500">*</span></label>
//               <input
//                 type="date"
//                 id="invoiceDate"
//                 name="invoiceDate"
//                 value={formData.invoiceDate}
//                 onChange={handleFormChange}
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-300 ease-in-out text-gray-800 text-lg"
//                 required
//               />
//             </div>
//           </div>

//           {/* Dynamic Item Entry Section */}
//           <div className="border border-gray-200 p-4 rounded-xl shadow-inner mt-6">
//             <h4 className="text-xl font-semibold text-gray-800 mb-4">Items Details</h4>
//             {items.map((item, index) => (
//               <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//                 <div>
//                   <label htmlFor={`purpose-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
//                   <input
//                     type="text"
//                     id={`purpose-${index}`}
//                     name="purpose"
//                     value={item.purpose}
//                     onChange={(e) => handleItemChange(index, e)}
//                     placeholder="Purpose"
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-200 text-gray-800 text-base"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor={`item-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Item <span className="text-red-500">*</span></label>
//                   <input
//                     type="text"
//                     id={`item-${index}`}
//                     name="item"
//                     value={item.item}
//                     onChange={(e) => handleItemChange(index, e)}
//                     placeholder="Item"
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-200 text-gray-800 text-base"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Quantity <span className="text-red-500">*</span></label>
//                   <input
//                     type="number"
//                     id={`quantity-${index}`}
//                     name="quantity"
//                     value={item.quantity}
//                     onChange={(e) => handleItemChange(index, e)}
//                     placeholder="Quantity"
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-200 text-gray-800 text-base"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor={`amount-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Amount <span className="text-red-500">*</span></label>
//                   <input
//                     type="number"
//                     id={`amount-${index}`}
//                     name="amount"
//                     value={item.amount}
//                     onChange={(e) => handleItemChange(index, e)}
//                     placeholder="Amount"
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-200 text-gray-800 text-base"
//                     step="0.01" // Allows decimal input
//                     required
//                   />
//                 </div>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={handleAddItem}
//               className="mt-2 bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-600 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
//             >
//               ADD ITEM
//             </button>
//           </div>

//           {/* Totals Section */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//             <div>
//               <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-1">Total Amount <span className="text-red-500">*</span></label>
//               <input
//                 type="text"
//                 id="totalAmount"
//                 value={totals.totalAmount.toFixed(2)} // Display with 2 decimal places
//                 readOnly
//                 className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 text-lg font-semibold"
//               />
//             </div>
//             <div>
//               <label htmlFor="vatAmount" className="block text-sm font-medium text-gray-700 mb-1">VAT Amount <span className="text-red-500">*</span></label>
//               <input
//                 type="text"
//                 id="vatAmount"
//                 value={totals.vatAmount.toFixed(2)} // Display with 2 decimal places
//                 readOnly
//                 className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 text-lg font-semibold"
//               />
//             </div>
//             <div className="md:col-span-2"> {/* Span across two columns for better alignment */}
//               <label htmlFor="billTotalWithVAT" className="block text-sm font-medium text-gray-700 mb-1">Bill Total with VAT <span className="text-red-500">*</span></label>
//               <input
//                 type="text"
//                 id="billTotalWithVAT"
//                 value={totals.billTotalWithVAT.toFixed(2)} // Display with 2 decimal places
//                 readOnly
//                 className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 text-lg font-semibold"
//               />
//             </div>
//           </div>

//           {/* Save Button */}
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-4 rounded-xl shadow-lg
//                        hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-300
//                        transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-xl flex items-center justify-center space-x-2 mt-8"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
//             </svg>
//             <span>SAVE</span>
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AssignSupplier;

// import React, { useState, useEffect } from 'react';

// const DUMMY_SUPPLIERS = [
//   { id: '1', name: 'ABC Logistics Co.', address: '123 Main St', phone: '123-456-7890', email: 'abc@example.com', vat: 'VAT123', number: 'REG1' },
//   { id: '2', name: 'Global Supply Inc.', address: '456 Oak Ave', phone: '987-654-3210', email: 'global@example.com', vat: 'VAT456', number: 'REG2' },
//   { id: '3', name: 'Quick Ship Solutions', address: '789 Pine Ln', phone: '555-123-4567', email: 'quick@example.com', vat: 'VAT789', number: 'REG3' },
// ];

// function AssignSupplier() {
//   // Main form state
//   const [formData, setFormData] = useState({
//     selectedSupplierId: '',
//     supplierInvoiceNo: '',
//     jobNumber: '',
//     invoiceDate: '',
//     vatRate: 0.15,  // 15%
//   });

//   // Dynamic items state
//   const [items, setItems] = useState([
//     { purpose: '', item: '', quantity: '', amount: '' },
//   ]);

//   // Totals state
//   const [totals, setTotals] = useState({
//     totalAmount: 0,
//     vatAmount: 0,
//     billTotalWithVAT: 0,
//   });

//   // Update main form data
//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Update items state
//   const handleItemChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedItems = [...items];
//     updatedItems[index] = { ...updatedItems[index], [name]: value };
//     setItems(updatedItems);
//   };

//   // Add a new item row
//   const handleAddItem = () => {
//     setItems((prev) => [
//       ...prev,
//       { purpose: '', item: '', quantity: '', amount: '' },
//     ]);
//   };

//   // Calculate totals based on items and vatRate
//   useEffect(() => {
//     let calculatedTotalAmount = 0;
//     items.forEach((it) => {
//       const amt = parseFloat(it.amount);
//       if (!isNaN(amt)) calculatedTotalAmount += amt;
//     });
//     const calculatedVatAmount = calculatedTotalAmount * formData.vatRate;
//     const calculatedBillTotalWithVAT = calculatedTotalAmount + calculatedVatAmount;
//     setTotals({
//       totalAmount: calculatedTotalAmount,
//       vatAmount: calculatedVatAmount,
//       billTotalWithVAT: calculatedBillTotalWithVAT,
//     });
//   }, [items, formData.vatRate]);

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Assign Supplier Data:', { ...formData, items, totals });
//     alert('Assignment data logged to console! (Simulated Save)');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//               {/* You may replace the icon with an appropriate supplier icon as needed */}
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-8 h-8 mr-3 text-indigo-600"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//               ASSIGN SUPPLIER
//             </h1>
//             <p className="text-gray-600 mt-2">
//               Assign a supplier and generate the bill with VAT.
//             </p>
//           </div>
//         </div>

//         {/* Form Sections */}
//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Top Row */}
//           <Card>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Supplier Select */}
//               <TextInput
//                 label="Supplier"
//                 as="select"
//                 name="selectedSupplierId"
//                 value={formData.selectedSupplierId}
//                 onChange={handleFormChange}
//                 required
//               >
//                 <option value="">--Select--</option>
//                 {DUMMY_SUPPLIERS.map((supplier) => (
//                   <option key={supplier.id} value={supplier.id}>
//                     {supplier.name}
//                   </option>
//                 ))}
//               </TextInput>

//               {/* Job Number */}
//               <TextInput
//                 label="Job Number"
//                 name="jobNumber"
//                 value={formData.jobNumber}
//                 onChange={handleFormChange}
//                 required
//               />

//               {/* Supplier Invoice No */}
//               <TextInput
//                 label="Supplier Invoice No"
//                 name="supplierInvoiceNo"
//                 value={formData.supplierInvoiceNo}
//                 onChange={handleFormChange}
//                 required
//               />

//               {/* Invoice Date */}
//               <TextInput
//                 label="Invoice Date"
//                 type="date"
//                 name="invoiceDate"
//                 value={formData.invoiceDate}
//                 onChange={handleFormChange}
//                 required
//               />
//             </div>
//           </Card>

//           {/* Dynamic Items Entry */}
//           <Card title="Items Details">
//             {items.map((item, index) => (
//               <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
//                   required
//                 />
//                 <TextInput
//                   label="Amount"
//                   type="number"
//                   name="amount"
//                   step="0.01"
//                   value={item.amount}
//                   onChange={(e) => handleItemChange(index, e)}
//                   required
//                 />
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={handleAddItem}
//               className="mt-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105"
//             >
//               ADD ITEM
//             </button>
//           </Card>

//           {/* Totals Section */}
//           <Card>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Total Amount <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={totals.totalAmount.toFixed(2)}
//                   readOnly
//                   className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 font-semibold text-lg"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   VAT Amount <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={totals.vatAmount.toFixed(2)}
//                   readOnly
//                   className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 font-semibold text-lg"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Bill Total with VAT <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={totals.billTotalWithVAT.toFixed(2)}
//                   readOnly
//                   className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 font-semibold text-lg"
//                 />
//               </div>
//             </div>
//           </Card>

//           {/* Save Button */}
//           <button
//             type="submit"
//             className="w-full flex items-center justify-center gap-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl shadow-lg hover:from-green-600 hover:to-green-800 transition transform hover:scale-105 duration-300 text-xl font-bold"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
//               viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//               <path strokeLinecap="round" strokeLinejoin="round"
//                 d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
//             </svg>
//             SAVE
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// /* Reusable Header Component */
// const Header = ({ title }) => (
//   <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-2xl overflow-hidden">
//     <div className="px-8 py-4 bg-gradient-to-r from-black/10 to-transparent">
//       <h1 className="text-3xl font-bold text-white tracking-wide text-center">{title}</h1>
//     </div>
//   </div>
// );

// /* Reusable Card Component */
// const Card = ({ title, children }) => (
//   <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//     {title && (
//       <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
//         <h2 className="text-white font-bold text-lg">{title}</h2>
//       </div>
//     )}
//     <div className="p-6">{children}</div>
//   </div>
// );

// /* Reusable TextInput Component */
// const TextInput = ({
//   label,
//   type = 'text',
//   name,
//   value,
//   onChange,
//   placeholder = '',
//   required = false,
//   as, // if 'select'
//   children,
// }) => {
//   if (as === 'select') {
//     return (
//       <div className="space-y-1">
//         {label && (
//           <label className="block text-sm font-medium text-gray-700">
//             {label} {required && <span className="text-red-500">*</span>}
//           </label>
//         )}
//         <select
//           name={name}
//           value={value}
//           onChange={onChange}
//           className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800 text-lg"
//           required={required}
//         >
//           {children}
//         </select>
//       </div>
//     );
//   }
//   return (
//     <div className="space-y-1">
//       {label && (
//         <label className="block text-sm font-medium text-gray-700">
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
//       )}
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800 text-lg"
//         required={required}
//       />
//     </div>
//   );
// };

// export default AssignSupplier;

// import React, { useState, useEffect } from 'react';

// const DUMMY_SUPPLIERS = [
//   { id: '1', name: 'ABC Logistics Co.', address: '123 Main St', phone: '123-456-7890', email: 'abc@example.com', vat: 'VAT123', number: 'REG1' },
//   { id: '2', name: 'Global Supply Inc.', address: '456 Oak Ave', phone: '987-654-3210', email: 'global@example.com', vat: 'VAT456', number: 'REG2' },
//   { id: '3', name: 'Quick Ship Solutions', address: '789 Pine Ln', phone: '555-123-4567', email: 'quick@example.com', vat: 'VAT789', number: 'REG3' },
// ];

// function AssignSupplier() {
//   // Main form state

//   const getAuthHeaders = () => {
//     const token = localStorage.getItem('authToken');
//     if (!token) throw new Error('Authentication token missing');
//     return { 'Authorization': `Bearer ${token}` };
//   };

  
  
//   const [formData, setFormData] = useState({
//     selectedSupplierId: '',
//     supplierInvoiceNo: '',
//     jobNumber: '',
//     invoiceDate: '',
//     vatRate: 0.15,  // 15%
//   });
//   useEffect(() => {
//     const fetchSuppliers = async () => {
//       try {
//         const res = await fetch('http://localhost:5000/api/suppliers', {
//           headers: {
//             'Content-Type': 'application/json',
//             ...getAuthHeaders()
//           }
//         });
//         const data = await res.json();
//         setSupplierList(data); // Make sure your backend sends an array of suppliers
//       } catch (err) {
//         console.error('Failed to fetch suppliers', err);
//       }
//     };
  
//     fetchSuppliers();
//   }, []);
//   // Selected supplier details
//   const [selectedSupplier, setSelectedSupplier] = useState(null);

//   // Dynamic items state
//   const [items, setItems] = useState([
//     { purpose: '', item: '', quantity: '', amount: '' },
//   ]);

//   // Totals state
//   const [totals, setTotals] = useState({
//     totalAmount: 0,
//     vatAmount: 0,
//     billTotalWithVAT: 0,
//   });

//   // Success message state
//   const [successMessage, setSuccessMessage] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Update selected supplier when selection changes
//   useEffect(() => {
//     if (formData.selectedSupplierId) {
//       const supplier = DUMMY_SUPPLIERS.find(s => s.id === formData.selectedSupplierId);
//       setSelectedSupplier(supplier);
//     } else {
//       setSelectedSupplier(null);
//     }
//   }, [formData.selectedSupplierId]);

//   // Update main form data
//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Update items state
//   const handleItemChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedItems = [...items];
//     updatedItems[index] = { ...updatedItems[index], [name]: value };
    
//     // Ensure quantity and amount are numbers
//     if (name === 'quantity' || name === 'amount') {
//       updatedItems[index][name] = value === '' ? '' : parseFloat(value);
//     }
    
//     setItems(updatedItems);
//   };

//   // Add a new item row
//   const handleAddItem = () => {
//     setItems((prev) => [
//       ...prev,
//       { purpose: '', item: '', quantity: '', amount: '' },
//     ]);
//   };

//   // Remove an item row
//   const handleRemoveItem = (index) => {
//     if (items.length === 1) {
//       // Don't remove the last item, just clear it
//       setItems([{ purpose: '', item: '', quantity: '', amount: '' }]);
//     } else {
//       const updatedItems = [...items];
//       updatedItems.splice(index, 1);
//       setItems(updatedItems);
//     }
//   };

//   // Calculate totals based on items and vatRate
//   useEffect(() => {
//     let calculatedTotalAmount = 0;
//     items.forEach((it) => {
//       const amt = parseFloat(it.amount) || 0;
//       const qty = parseFloat(it.quantity) || 0;
      
//       // If both quantity and amount are provided, multiply them
//       if (it.quantity && it.amount) {
//         calculatedTotalAmount += qty * amt;
//       } else if (it.amount) {
//         calculatedTotalAmount += amt;
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

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       selectedSupplierId: '',
//       supplierInvoiceNo: '',
//       jobNumber: '',
//       invoiceDate: '',
//       vatRate: 0.15,
//     });
//     setItems([{ purpose: '', item: '', quantity: '', amount: '' }]);
//     setSelectedSupplier(null);
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       console.log('Assign Supplier Data:', { 
//         ...formData, 
//         items, 
//         totals,
//         supplier: selectedSupplier
//       });
      
//       setSuccessMessage('Supplier assigned successfully!');
//       setIsSubmitting(false);
      
//       // Clear success message after 5 seconds
//       setTimeout(() => {
//         setSuccessMessage('');
//         resetForm();
//       }, 5000);
//     }, 1500);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-8 h-8 mr-3 text-indigo-600"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//               ASSIGN SUPPLIER
//             </h1>
//             <p className="text-gray-600 mt-2">
//               Assign a supplier and generate the bill with VAT.
//             </p>
//           </div>
//         </div>

//         {/* Success Message */}
//         {successMessage && (
//           <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
//             {successMessage}
//           </div>
//         )}

//         {/* Form Sections */}
//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Top Row */}
//           <Card>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Supplier Select */}
//               <TextInput
//                 label="Supplier"
//                 as="select"
//                 name="selectedSupplierId"
//                 value={formData.selectedSupplierId}
//                 onChange={handleFormChange}
//                 required
//               >
//                 <option value="">--Select Supplier--</option>
//                 {DUMMY_SUPPLIERS.map((supplier) => (
//                   <option key={supplier.id} value={supplier.id}>
//                     {supplier.name}
//                   </option>
//                 ))}
//               </TextInput>

//               {/* Job Number */}
//               <TextInput
//                 label="Job Number"
//                 name="jobNumber"
//                 value={formData.jobNumber}
//                 onChange={handleFormChange}
//                 required
//               />

//               {/* Supplier Invoice No */}
//               <TextInput
//                 label="Supplier Invoice No"
//                 name="supplierInvoiceNo"
//                 value={formData.supplierInvoiceNo}
//                 onChange={handleFormChange}
//                 required
//               />

//               {/* Invoice Date */}
//               <TextInput
//                 label="Invoice Date"
//                 type="date"
//                 name="invoiceDate"
//                 value={formData.invoiceDate}
//                 onChange={handleFormChange}
//                 required
//               />
//             </div>

//             {/* Selected Supplier Details */}
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
//                   <div>
//                     <p className="text-gray-600"><span className="font-medium">VAT:</span> {selectedSupplier.vat}</p>
//                     <p className="text-gray-600"><span className="font-medium">Reg No:</span> {selectedSupplier.number}</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </Card>

//           {/* VAT Rate */}
//           <Card>
//             <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   VAT Rate <span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex items-center">
//                   <input
//                     type="range"
//                     min="0"
//                     max="0.5"
//                     step="0.01"
//                     name="vatRate"
//                     value={formData.vatRate}
//                     onChange={handleFormChange}
//                     className="w-full mr-3"
//                   />
//                   <span className="text-lg font-medium bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg">
//                     {(formData.vatRate * 100).toFixed(0)}%
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </Card>

//           {/* Dynamic Items Entry */}
//           <Card title="Items Details">
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
//                   min="0"
//                   step="0.1"
//                   value={item.quantity}
//                   onChange={(e) => handleItemChange(index, e)}
//                 />
//                 <TextInput
//                   label="Amount"
//                   type="number"
//                   name="amount"
//                   min="0"
//                   step="0.01"
//                   value={item.amount}
//                   onChange={(e) => handleItemChange(index, e)}
//                   required
//                 />
//                 <div className="flex items-end">
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveItem(index)}
//                     className="px-3 py-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
//                     disabled={items.length === 1}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={handleAddItem}
//               className="mt-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105 flex items-center"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
//               </svg>
//               ADD ITEM
//             </button>
//           </Card>

//           {/* Totals Section */}
//           <Card>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Total Amount <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={`$${totals.totalAmount.toFixed(2)}`}
//                   readOnly
//                   className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 font-semibold text-lg"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   VAT Amount <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={`$${totals.vatAmount.toFixed(2)}`}
//                   readOnly
//                   className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 font-semibold text-lg"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Bill Total with VAT <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={`$${totals.billTotalWithVAT.toFixed(2)}`}
//                   readOnly
//                   className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 font-semibold text-lg"
//                 />
//               </div>
//             </div>
//           </Card>

//           {/* Action Buttons */}
//           <div className="flex flex-col md:flex-row gap-48">
//             <button
//               type="button"
//               onClick={resetForm}
//               className="flex-1 px-1 py-4 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-xl shadow-lg hover:from-gray-600 hover:to-gray-800 transition transform hover:scale-105 duration-300 text-xl font-bold flex items-center justify-center"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//               </svg>
//               RESET
//             </button>
            
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`flex-1 px-1 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg transition transform hover:scale-105 duration-300 text-xl font-bold flex items-center justify-center ${
//                 isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-green-600 hover:to-green-800'
//               }`}
//             >
//               {isSubmitting ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   PROCESSING...
//                 </>
//               ) : (
//                 <>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
//                   </svg>
//                   SAVE
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// /* Reusable Card Component */
// const Card = ({ title, children }) => (
//   <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
//     {title && (
//       <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
//         <h2 className="text-white font-bold text-lg">{title}</h2>
//       </div>
//     )}
//     <div className="p-6">{children}</div>
//   </div>
// );

// /* Reusable TextInput Component */
// const TextInput = ({
//   label,
//   type = 'text',
//   name,
//   value,
//   onChange,
//   placeholder = '',
//   required = false,
//   as, // if 'select'
//   children,
//   ...props
// }) => {
//   if (as === 'select') {
//     return (
//       <div className="space-y-1">
//         {label && (
//           <label className="block text-sm font-medium text-gray-700">
//             {label} {required && <span className="text-red-500">*</span>}
//           </label>
//         )}
//         <select
//           name={name}
//           value={value}
//           onChange={onChange}
//           className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800 text-lg"
//           required={required}
//           {...props}
//         >
//           {children}
//         </select>
//       </div>
//     );
//   }
//   return (
//     <div className="space-y-1">
//       {label && (
//         <label className="block text-sm font-medium text-gray-700">
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
//       )}
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800 text-lg"
//         required={required}
//         {...props}
//       />
//     </div>
//   );
// };

// export default AssignSupplier;


import React, { useState, useEffect } from 'react';

function AssignSupplier() {
  const currentUser = 'VatsalUmrania'; // Current user's login
  const currentDateTime = '2025-06-14 09:23:57'; // Current UTC datetime

  // Get authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication token missing');
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Main form state
  const [formData, setFormData] = useState({
    selectedSupplierId: '',
    supplierInvoiceNo: '',
    jobNumber: '',
    invoiceDate: '',
    vatRate: 0.15,
    createdBy: currentUser,
    createdAt: currentDateTime
  });

  // Other state variables
  const [supplierList, setSupplierList] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [items, setItems] = useState([{ purpose: '', item: '', quantity: '', amount: '' }]);
  const [totals, setTotals] = useState({
    totalAmount: 0,
    vatAmount: 0,
    billTotalWithVAT: 0,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch suppliers
        const suppliersRes = await fetch('http://localhost:5000/api/suppliers', {
          headers: getAuthHeaders()
        });
        
        if (!suppliersRes.ok) {
          throw new Error(`Failed to fetch suppliers: ${suppliersRes.status} ${suppliersRes.statusText}`);
        }
        
        const suppliersData = await suppliersRes.json();
        setSupplierList(suppliersData);
        
        // Fetch last invoice number
        const invoiceRes = await fetch('http://localhost:5000/api/supplier-assignments/last-invoice', {
          headers: getAuthHeaders()
        });
        
        if (invoiceRes.ok) {
          const invoiceData = await invoiceRes.json();
          if (invoiceData.lastInvoiceNumber) {
            setLastInvoiceNumber(invoiceData.lastInvoiceNumber);
            // Set initial invoice number
            const nextInvoiceNumber = `INV-${String(parseInt(invoiceData.lastInvoiceNumber.replace('INV-', '')) + 1).padStart(3, '0')}`;
            setFormData(prev => ({
              ...prev,
              supplierInvoiceNo: nextInvoiceNumber
            }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update selected supplier when selection changes
  useEffect(() => {
    if (formData.selectedSupplierId) {
      const supplier = supplierList.find(s => s._id === formData.selectedSupplierId);
      setSelectedSupplier(supplier);
    } else {
      setSelectedSupplier(null);
    }
  }, [formData.selectedSupplierId, supplierList]);

  // Calculate totals when items or VAT rate changes
  useEffect(() => {
    let calculatedTotalAmount = 0;
    items.forEach((item) => {
      if (item.quantity && item.amount) {
        calculatedTotalAmount += parseFloat(item.quantity) * parseFloat(item.amount);
      }
    });
    
    const calculatedVatAmount = calculatedTotalAmount * formData.vatRate;
    const calculatedBillTotalWithVAT = calculatedTotalAmount + calculatedVatAmount;
    
    setTotals({
      totalAmount: calculatedTotalAmount,
      vatAmount: calculatedVatAmount,
      billTotalWithVAT: calculatedBillTotalWithVAT,
    });
  }, [items, formData.vatRate]);

  // Form event handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index] = { 
      ...updatedItems[index], 
      [name]: value
    };
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems(prev => [...prev, { purpose: '', item: '', quantity: '', amount: '' }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) {
      setItems([{ purpose: '', item: '', quantity: '', amount: '' }]);
    } else {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const resetForm = () => {
    setFormData({
      selectedSupplierId: '',
      supplierInvoiceNo: lastInvoiceNumber
        ? `INV-${String(parseInt(lastInvoiceNumber.replace('INV-', '')) + 1).padStart(3, '0')}`
        : '',
      jobNumber: '',
      invoiceDate: '',
      vatRate: 0.15,
      createdBy: currentUser,
      createdAt: currentDateTime
    });
    setItems([{ purpose: '', item: '', quantity: '', amount: '' }]);
    setSelectedSupplier(null);
    setError('');
  };

  const isFormValid = () => {
    return (
      formData.selectedSupplierId &&
      formData.supplierInvoiceNo &&
      formData.jobNumber &&
      formData.invoiceDate &&
      items.some(item => item.item && item.amount)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      if (!isFormValid()) {
        throw new Error('Please fill in all required fields');
      }

      const assignmentData = {
        selectedSupplierId: parseInt(formData.selectedSupplierId, 10),
        supplierInvoiceNo: formData.supplierInvoiceNo,
        jobNumber: formData.jobNumber,
        invoiceDate: formData.invoiceDate,
        vatRate: parseFloat(formData.vatRate),
        totalAmount: parseFloat(totals.totalAmount.toFixed(2)),
        vatAmount: parseFloat(totals.vatAmount.toFixed(2)),
        billTotalWithVAT: parseFloat(totals.billTotalWithVAT.toFixed(2)),
        items: items.map(item => ({
          purpose: item.purpose || '',
          item: item.item,
          quantity: parseFloat(item.quantity) || 0,
          amount: parseFloat(item.amount) || 0
        })),
        createdBy: currentUser,
        createdAt: currentDateTime
      };

      const response = await fetch('http://localhost:5000/api/supplier-assignments', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(assignmentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create assignment');
      }

      setSuccessMessage('Supplier assigned successfully!');
      
      setTimeout(() => {
        setSuccessMessage('');
        resetForm();
      }, 5000);
      
    } catch (err) {
      console.error('Assignment failed:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading suppliers and invoice data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 mr-3 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            ASSIGN SUPPLIER
          </h1>
          <p className="text-gray-600 mt-2">Created by: {currentUser} at {currentDateTime}</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="Supplier"
                as="select"
                name="selectedSupplierId"
                value={formData.selectedSupplierId}
                onChange={handleFormChange}
                required
              >
                <option key="default" value="">--Select Supplier--</option>
                {supplierList.map((supplier) => (
                  <option key={supplier._id.toString()} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
              </TextInput>

              <TextInput
                label="Job Number"
                name="jobNumber"
                value={formData.jobNumber}
                onChange={handleFormChange}
                required
              />

              <TextInput
                label="Supplier Invoice No"
                name="supplierInvoiceNo"
                value={formData.supplierInvoiceNo}
                onChange={handleFormChange}
                required
                readOnly={lastInvoiceNumber !== null}
              />

              <TextInput
                label="Invoice Date"
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleFormChange}
                required
              />
            </div>

            {selectedSupplier && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">Supplier Details:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600"><span className="font-medium">Name:</span> {selectedSupplier.name}</p>
                    <p className="text-gray-600"><span className="font-medium">Address:</span> {selectedSupplier.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-600"><span className="font-medium">Phone:</span> {selectedSupplier.phone}</p>
                    <p className="text-gray-600"><span className="font-medium">Email:</span> {selectedSupplier.email}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* VAT Rate */}
          <Card>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                VAT Rate
              </label>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.01"
                name="vatRate"
                value={formData.vatRate}
                onChange={handleFormChange}
                className="flex-1"
              />
              <span className="text-lg font-medium bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg">
                {(formData.vatRate * 100).toFixed(0)}%
              </span>
            </div>
          </Card>

          {/* Items */}
          <Card title="Items">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <TextInput
                  label="Purpose"
                  name="purpose"
                  value={item.purpose}
                  onChange={(e) => handleItemChange(index, e)}
                />
                <TextInput
                  label="Item"
                  name="item"
                  value={item.item}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                />
                <TextInput
                  label="Quantity"
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                  min="0"
                  step="0.01"
                />
                <TextInput
                  label="Amount"
                  type="number"
                  name="amount"
                  value={item.amount}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                  min="0"
                  step="0.01"
                />
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="px-3 py-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    disabled={items.length === 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleAddItem}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Item
            </button>
          </Card>

          {/* Totals */}
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                <input
                  type="text"
                  value={`$${totals.totalAmount.toFixed(2)}`}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">VAT Amount</label>
                <input
                  type="text"
                  value={`$${totals.vatAmount.toFixed(2)}`}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total with VAT</label>
                <input
                  type="text"
                  value={`$${totals.billTotalWithVAT.toFixed(2)}`}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                />
              </div>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className={`flex-1 px-6 py-3 bg-green-600 text-white rounded-lg transition-colors ${
                isSubmitting || !isFormValid() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Card Component
const Card = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    {title && (
      <div className="bg-gray-50 px-4 py-3 border-b">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

// TextInput Component
const TextInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  required = false,
  readOnly = false,
  as,
  children,
  ...props
}) => {
  const baseClassName = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";
  
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {as === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`${baseClassName} ${readOnly ? 'bg-gray-50' : ''}`}
          required={required}
          {...props}
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`${baseClassName} ${readOnly ? 'bg-gray-50' : ''}`}
          required={required}
          readOnly={readOnly}
          {...props}
        />
      )}
    </div>
  );
};

export default AssignSupplier;