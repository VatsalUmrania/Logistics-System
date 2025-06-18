// // import React, { useState } from 'react';
// // import { Plus } from 'lucide-react';

// // const SupplierCreditNote = () => {
// //   const [formData, setFormData] = useState({
// //     supplierInvoiceNo: '',
// //     jobNo: '',
// //     supplierName: '',
// //     pol: '',
// //     blNo: '',
// //     receiptAmount: '',
// //     vatAmount: '',
// //     amountWithVat: '',
// //     supplierCreditNoteNo: '1',
// //     date: '',
// //     subTotal: '',
// //     totalVatAmount: '',
// //     totalAmount: ''
// //   });

// //   const [lineItems, setLineItems] = useState([
// //     { purpose: '', item: '', quantity: '', amount: '' }
// //   ]);

// //   const handleInputChange = (field, value) => {
// //     setFormData(prev => ({ ...prev, [field]: value }));
// //   };

// //   const handleLineItemChange = (index, field, value) => {
// //     const updatedItems = [...lineItems];
// //     updatedItems[index][field] = value;
// //     setLineItems(updatedItems);
// //   };

// //   const addLineItem = () => {
// //     setLineItems([...lineItems, { purpose: '', item: '', quantity: '', amount: '' }]);
// //   };

// //   const calculateTotals = () => {
// //     const subTotal = lineItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
// //     const vatAmount = subTotal * 0.18; // Assuming 18% VAT
// //     const totalAmount = subTotal + vatAmount;
    
// //     setFormData(prev => ({
// //       ...prev,
// //       subTotal: subTotal.toFixed(2),
// //       totalVatAmount: vatAmount.toFixed(2),
// //       totalAmount: totalAmount.toFixed(2)
// //     }));
// //   };

// //   React.useEffect(() => {
// //     calculateTotals();
// //   }, [lineItems]);

// //   return (
// //     <div className="max-w-7xl mx-auto p-6 bg-white">
// //       {/* Header */}
// //       <div className="bg-blue-600 text-white p-4 rounded-t-lg">
// //         <h1 className="text-xl font-semibold">Supplier Credit Note</h1>
// //       </div>

// //       {/* Form Content */}
// //       <div className="border border-gray-300 rounded-b-lg p-6">
// //         {/* Top Row */}
// //         <div className="grid grid-cols-5 gap-4 mb-6">
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Supplier Invoice No
// //             </label>
// //             <input
// //               type="text"
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               value={formData.supplierInvoiceNo}
// //               onChange={(e) => handleInputChange('supplierInvoiceNo', e.target.value)}
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Job No
// //             </label>
// //             <input
// //               type="text"
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               value={formData.jobNo}
// //               onChange={(e) => handleInputChange('jobNo', e.target.value)}
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Supplier Name
// //             </label>
// //             <input
// //               type="text"
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               value={formData.supplierName}
// //               onChange={(e) => handleInputChange('supplierName', e.target.value)}
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               POL
// //             </label>
// //             <input
// //               type="text"
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               value={formData.pol}
// //               onChange={(e) => handleInputChange('pol', e.target.value)}
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               BL No
// //             </label>
// //             <input
// //               type="text"
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               value={formData.blNo}
// //               onChange={(e) => handleInputChange('blNo', e.target.value)}
// //             />
// //           </div>
// //         </div>

// //         {/* Second Row */}
// //         <div className="grid grid-cols-5 gap-4 mb-6">
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Receipt Amount
// //             </label>
// //             <input
// //               type="number"
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               value={formData.receiptAmount}
// //               onChange={(e) => handleInputChange('receiptAmount', e.target.value)}
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Vat Amount
// //             </label>
// //             <input
// //               type="number"
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               value={formData.vatAmount}
// //               onChange={(e) => handleInputChange('vatAmount', e.target.value)}
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               AmountWithVat
// //             </label>
// //             <input
// //               type="number"
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               value={formData.amountWithVat}
// //               onChange={(e) => handleInputChange('amountWithVat', e.target.value)}
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Supplier Credit Note No
// //             </label>
// //             <input
// //               type="text"
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               value={formData.supplierCreditNoteNo}
// //               onChange={(e) => handleInputChange('supplierCreditNoteNo', e.target.value)}
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Date
// //             </label>
// //             <input
// //               type="date"
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               value={formData.date}
// //               onChange={(e) => handleInputChange('date', e.target.value)}
// //             />
// //           </div>
// //         </div>

// //         {/* Line Items Header */}
// //         <div className="flex items-center justify-between mb-4">
// //           <div className="grid grid-cols-4 gap-4 flex-1">
// //             <div className="font-medium text-gray-700">Purpose</div>
// //             <div className="font-medium text-gray-700">Item</div>
// //             <div className="font-medium text-gray-700">Quantity</div>
// //             <div className="font-medium text-gray-700">Amount</div>
// //           </div>
// //           <button
// //             onClick={addLineItem}
// //             className="ml-4 bg-green-500 hover:bg-green-600 text-white p-2 rounded-md transition-colors"
// //           >
// //             <Plus size={20} />
// //           </button>
// //         </div>

// //         {/* Line Items */}
// //         {lineItems.map((item, index) => (
// //           <div key={index} className="grid grid-cols-4 gap-4 mb-4">
// //             <input
// //               type="text"
// //               placeholder="Purpose"
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               value={item.purpose}
// //               onChange={(e) => handleLineItemChange(index, 'purpose', e.target.value)}
// //             />
// //             <input
// //               type="text"
// //               placeholder="Item"
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               value={item.item}
// //               onChange={(e) => handleLineItemChange(index, 'item', e.target.value)}
// //             />
// //             <input
// //               type="number"
// //               placeholder="Quantity"
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               value={item.quantity}
// //               onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
// //             />
// //             <input
// //               type="number"
// //               placeholder="Amount"
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               value={item.amount}
// //               onChange={(e) => handleLineItemChange(index, 'amount', e.target.value)}
// //             />
// //           </div>
// //         ))}

// //         {/* Table for Line Items Display */}
// //         <div className="bg-gray-50 p-4 rounded-md mb-6">
// //           <div className="grid grid-cols-4 gap-4 font-medium text-gray-700 mb-2">
// //             <div>Purpose</div>
// //             <div>Item</div>
// //             <div>Quantity</div>
// //             <div>Amount</div>
// //           </div>
// //           <div className="border-t border-gray-200 pt-2">
// //             {/* This would show the added line items */}
// //           </div>
// //         </div>

// //         {/* Totals Section */}
// //         <div className="flex justify-end">
// //           <div className="w-80">
// //             <div className="flex justify-between items-center py-2">
// //               <span className="font-medium text-gray-700">Sub Total</span>
// //               <input
// //                 type="text"
// //                 className="w-32 p-2 border border-gray-300 rounded-md text-right bg-gray-50"
// //                 value={formData.subTotal}
// //                 readOnly
// //               />
// //             </div>
// //             <div className="flex justify-between items-center py-2">
// //               <span className="font-medium text-gray-700">Vat Amount</span>
// //               <input
// //                 type="text"
// //                 className="w-32 p-2 border border-gray-300 rounded-md text-right bg-gray-50"
// //                 value={formData.totalVatAmount}
// //                 readOnly
// //               />
// //             </div>
// //             <div className="flex justify-between items-center py-2 border-t border-gray-300">
// //               <span className="font-bold text-gray-800">Total Amount</span>
// //               <input
// //                 type="text"
// //                 className="w-32 p-2 border border-gray-300 rounded-md text-right bg-gray-100 font-bold"
// //                 value={formData.totalAmount}
// //                 readOnly
// //               />
// //             </div>
// //           </div>
// //         </div>

// //         {/* Action Buttons */}
// //         <div className="flex justify-end mt-6 space-x-4">
// //           <button className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors">
// //             Cancel
// //           </button>
// //           <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
// //             Save
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SupplierCreditNote;
// import React, { useState } from 'react';
// import { 
//   FileText, 
//   Plus, 
//   X, 
//   Trash2 
// } from 'lucide-react';

// const SupplierCreditNote = () => {
//   const [formData, setFormData] = useState({
//     supplierInvoiceNo: '',
//     jobNo: '',
//     supplierName: '',
//     pol: '',
//     blNo: '',
//     receiptAmount: '',
//     vatAmount: '',
//     amountWithVat: '',
//     supplierCreditNoteNo: '1',
//     date: '',
//     subTotal: '',
//     totalVatAmount: '',
//     totalAmount: ''
//   });

//   const [lineItems, setLineItems] = useState([
//     { purpose: '', item: '', quantity: '', amount: '' }
//   ]);

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleLineItemChange = (index, field, value) => {
//     const updatedItems = [...lineItems];
//     updatedItems[index][field] = value;
//     setLineItems(updatedItems);
    
//     // Recalculate totals when line items change
//     calculateTotals();
//   };

//   const addLineItem = () => {
//     setLineItems([...lineItems, { purpose: '', item: '', quantity: '', amount: '' }]);
//   };

//   const removeLineItem = (index) => {
//     if (lineItems.length <= 1) return;
//     const newItems = [...lineItems];
//     newItems.splice(index, 1);
//     setLineItems(newItems);
//     calculateTotals();
//   };

//   const calculateTotals = () => {
//     const subTotal = lineItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
//     const vatAmount = subTotal * 0.18; // Assuming 18% VAT
//     const totalAmount = subTotal + vatAmount;
    
//     setFormData(prev => ({
//       ...prev,
//       subTotal: subTotal.toFixed(2),
//       totalVatAmount: vatAmount.toFixed(2),
//       totalAmount: totalAmount.toFixed(2)
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//               <FileText className="w-8 h-8 mr-3 text-indigo-600" />
//               SUPPLIER CREDIT NOTE
//             </h1>
//             <p className="text-gray-600 mt-2">Manage supplier credit notes for your logistics operations</p>
//           </div>
//         </div>

//         {/* Supplier Information Card */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
//             <h2 className="text-xl font-bold text-white flex items-center">
//               Supplier Information
//             </h2>
//           </div>
          
//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Supplier Invoice No
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   value={formData.supplierInvoiceNo}
//                   onChange={(e) => handleInputChange('supplierInvoiceNo', e.target.value)}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Job No
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   value={formData.jobNo}
//                   onChange={(e) => handleInputChange('jobNo', e.target.value)}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Supplier Name
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   value={formData.supplierName}
//                   onChange={(e) => handleInputChange('supplierName', e.target.value)}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   POL
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   value={formData.pol}
//                   onChange={(e) => handleInputChange('pol', e.target.value)}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   BL No
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   value={formData.blNo}
//                   onChange={(e) => handleInputChange('blNo', e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Credit Note Details Card */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
//             <h2 className="text-xl font-bold text-white flex items-center">
//               Credit Note Details
//             </h2>
//           </div>
          
//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Receipt Amount
//                 </label>
//                 <input
//                   type="number"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   value={formData.receiptAmount}
//                   onChange={(e) => handleInputChange('receiptAmount', e.target.value)}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   VAT Amount
//                 </label>
//                 <input
//                   type="number"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   value={formData.vatAmount}
//                   onChange={(e) => handleInputChange('vatAmount', e.target.value)}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Amount With VAT
//                 </label>
//                 <input
//                   type="number"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   value={formData.amountWithVat}
//                   onChange={(e) => handleInputChange('amountWithVat', e.target.value)}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Credit Note No
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   value={formData.supplierCreditNoteNo}
//                   onChange={(e) => handleInputChange('supplierCreditNoteNo', e.target.value)}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Date
//                 </label>
//                 <input
//                   type="date"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   value={formData.date}
//                   onChange={(e) => handleInputChange('date', e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Line Items Card */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center">
//             <h2 className="text-xl font-bold text-white flex items-center">
//               Line Items
//             </h2>
//             <button
//               onClick={addLineItem}
//               className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg flex items-center"
//             >
//               <Plus className="w-5 h-5 mr-1" />
//               Add Item
//             </button>
//           </div>
          
//           <div className="p-6">
//             <table className="min-w-full table-auto border-collapse">
//               <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
//                 <tr>
//                   <th className="px-4 py-3 text-left">Purpose</th>
//                   <th className="px-4 py-3 text-left">Item</th>
//                   <th className="px-4 py-3 text-left">Quantity</th>
//                   <th className="px-4 py-3 text-left">Amount</th>
//                   <th className="px-4 py-3 text-left w-20">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {lineItems.map((item, index) => (
//                   <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
//                     <td className="px-4 py-3">
//                       <input
//                         type="text"
//                         placeholder="Purpose"
//                         className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                         value={item.purpose}
//                         onChange={(e) => handleLineItemChange(index, 'purpose', e.target.value)}
//                       />
//                     </td>
//                     <td className="px-4 py-3">
//                       <input
//                         type="text"
//                         placeholder="Item"
//                         className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                         value={item.item}
//                         onChange={(e) => handleLineItemChange(index, 'item', e.target.value)}
//                       />
//                     </td>
//                     <td className="px-4 py-3">
//                       <input
//                         type="number"
//                         placeholder="Quantity"
//                         className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                         value={item.quantity}
//                         onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
//                       />
//                     </td>
//                     <td className="px-4 py-3">
//                       <input
//                         type="number"
//                         placeholder="Amount"
//                         className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                         value={item.amount}
//                         onChange={(e) => handleLineItemChange(index, 'amount', e.target.value)}
//                       />
//                     </td>
//                     <td className="px-4 py-3">
//                       <button
//                         onClick={() => removeLineItem(index)}
//                         disabled={lineItems.length <= 1}
//                         className={`p-2 rounded-md ${
//                           lineItems.length > 1 
//                             ? 'text-red-600 hover:bg-red-100' 
//                             : 'text-gray-400 cursor-not-allowed'
//                         }`}
//                         title={lineItems.length > 1 ? "Remove item" : "Cannot remove last item"}
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Totals Card */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
//             <h2 className="text-xl font-bold text-white flex items-center">
//               Totals
//             </h2>
//           </div>
          
//           <div className="p-6">
//             <div className="flex justify-end">
//               <div className="w-80">
//                 <div className="flex justify-between items-center py-2">
//                   <span className="font-medium text-gray-700">Sub Total</span>
//                   <input
//                     type="text"
//                     className="w-40 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-right"
//                     value={formData.subTotal}
//                     readOnly
//                   />
//                 </div>
//                 <div className="flex justify-between items-center py-2">
//                   <span className="font-medium text-gray-700">VAT Amount</span>
//                   <input
//                     type="text"
//                     className="w-40 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-right"
//                     value={formData.totalVatAmount}
//                     readOnly
//                   />
//                 </div>
//                 <div className="flex justify-between items-center py-2 border-t border-gray-300 mt-2 pt-3">
//                   <span className="font-bold text-gray-800">Total Amount</span>
//                   <input
//                     type="text"
//                     className="w-40 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 font-bold text-right"
//                     value={formData.totalAmount}
//                     readOnly
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end space-x-4">
//           <button className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors">
//             Cancel
//           </button>
//           <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-colors">
//             Save Credit Note
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SupplierCreditNote;

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2,
  Save,
  XCircle,
  Loader2
} from 'lucide-react';

const API_SUPPLIERS = "http://localhost:5000/api/suppliers";
const API_POLS = "http://localhost:5000/api/ports";
const API_INVOICES = "http://localhost:5000/api/invoices";
const API_BLS = "http://localhost:5000/api/bls";
const API_CREDIT_NOTES = "http://localhost:5000/api/supplier-credit-notes";

const SupplierCreditNote = () => {
  // Fetched options
  const [suppliers, setSuppliers] = useState([]);
  const [pols, setPols] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [bls, setBls] = useState([]);
  const [creditNotes, setCreditNotes] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    supplier_id: '',
    credit_note_no: `CN-${Math.floor(Math.random() * 1000)}`,
    credit_note_date: new Date().toISOString().split('T')[0],
    total_amount: '',
    vat_amount: '',
    grand_total: '',
    invoice_id: '',
    bl_id: '',
    pol_id: '',
    job_no: ''
  });
  const [lineItems, setLineItems] = useState([
    { id: 1, description: '', quantity: '', unit_price: '', amount: '' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch dropdown options and credit notes
  useEffect(() => {
    fetchOptions();
    fetchCreditNotes();
  }, []);

  const fetchOptions = async () => {
    try {
      const [sup, pol, inv, bl] = await Promise.all([
        fetch(API_SUPPLIERS).then(r => r.json()),
        fetch(API_POLS).then(r => r.json()),
        fetch(API_INVOICES).then(r => r.json()),
        fetch(API_BLS).then(r => r.json()),
      ]);
      setSuppliers(sup.data.name || []);
      setPols(pol.data || []);
      setInvoices(inv.data || []);
      setBls(bl.data || []);
    } catch (err) {
      alert("Failed to fetch dropdowns");
    }
  };

  const fetchCreditNotes = async () => {
    try {
      const res = await fetch(API_CREDIT_NOTES);
      const data = await res.json();
      setCreditNotes(data.data || []);
    } catch {
      setCreditNotes([]);
    }
  };

  // Line item calculations
  useEffect(() => {
    const updatedItems = lineItems.map(item => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unit_price) || 0;
      return { ...item, amount: (quantity * unitPrice).toFixed(2) };
    });
    const subTotal = updatedItems.reduce((sum, item) =>
      sum + (parseFloat(item.amount) || 0), 0);
    const vatAmount = subTotal * 0.18;
    const totalAmount = subTotal + vatAmount;
    setFormData(prev => ({
      ...prev,
      total_amount: subTotal.toFixed(2),
      vat_amount: vatAmount.toFixed(2),
      grand_total: totalAmount.toFixed(2)
    }));
    setLineItems(updatedItems);
  }, [lineItems]);

  // Form field changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  // CRUD handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        supplier_id: formData.supplier_id,
        credit_note_no: formData.credit_note_no,
        credit_note_date: formData.credit_note_date,
        total_amount: formData.total_amount,
        vat_amount: formData.vat_amount,
        grand_total: formData.grand_total,
        invoice_id: formData.invoice_id,
        bl_id: formData.bl_id,
        pol_id: formData.pol_id,
        job_no: formData.job_no,
        lineItems: lineItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount
        }))
      };
      let res, data;
      if (editingId) {
        res = await fetch(`${API_CREDIT_NOTES}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        data = await res.json();
      } else {
        res = await fetch(API_CREDIT_NOTES, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        data = await res.json();
      }
      if (data.success) {
        alert(editingId ? "Credit Note updated!" : "Credit Note created!");
        fetchCreditNotes();
        handleReset();
      } else {
        alert(data.message || "Failed to save credit note");
      }
    } catch (error) {
      alert('Error saving credit note');
    } finally {
      setIsLoading(false);
      setEditingId(null);
    }
  };

  const handleEdit = async (note) => {
    setEditingId(note.id);
    setFormData({
      supplier_id: note.supplier_id,
      credit_note_no: note.credit_note_no,
      credit_note_date: note.credit_note_date,
      total_amount: note.total_amount,
      vat_amount: note.vat_amount,
      grand_total: note.grand_total,
      invoice_id: note.invoice_id || '',
      bl_id: note.bl_id || '',
      pol_id: note.pol_id || '',
      job_no: note.job_no || ''
    });
    // Fetch line items if not included
    if (note.lineItems) setLineItems(note.lineItems.map((li, idx) => ({
      id: idx + 1,
      description: li.description,
      quantity: li.quantity,
      unit_price: li.unit_price,
      amount: li.amount
    })));
    else setLineItems([{ id: 1, description: '', quantity: '', unit_price: '', amount: '' }]);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this credit note?')) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_CREDIT_NOTES}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("Credit note deleted");
        fetchCreditNotes();
      } else {
        alert(data.message || "Delete failed");
      }
    } catch {
      alert("Server error");
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setFormData({
      supplier_id: '',
      credit_note_no: `CN-${Math.floor(Math.random() * 1000)}`,
      credit_note_date: new Date().toISOString().split('T')[0],
      total_amount: '',
      vat_amount: '',
      grand_total: '',
      invoice_id: '',
      bl_id: '',
      pol_id: '',
      job_no: ''
    });
    setLineItems([
      { id: 1, description: '', quantity: '', unit_price: '', amount: '' }
    ]);
    setEditingId(null);
  };

  // Helper functions for display
  const supplierName = (id) => suppliers.find(s => String(s.id) === String(id))?.name || "";
  const invoiceNumber = (id) => invoices.find(i => String(i.id) === String(id))?.number || "";
  const polName = (id) => pols.find(p => String(p.id) === String(id))?.name || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              SUPPLIER CREDIT NOTE
            </h1>
            <p className="text-gray-600 mt-2">Manage supplier credit notes for your logistics operations</p>
          </div>
        </div>

        {/* Credit Notes List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h2 className="text-xl font-bold text-white">Credit Notes</h2>
          </div>
          <div className="p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Note #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">POL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {creditNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{note.credit_note_no}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{note.credit_note_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{supplierName(note.supplier_id)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{polName(note.pol_id)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{invoiceNumber(note.invoice_id)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${note.total_amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(note)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {creditNotes.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400">No credit notes found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Supplier Information Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white">Supplier Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier *
                  </label>
                  <select
                    value={formData.supplier_id}
                    onChange={(e) => handleInputChange('supplier_id', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
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
                    Supplier Invoice No
                  </label>
                  <select
                    value={formData.invoice_id}
                    onChange={(e) => handleInputChange('invoice_id', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select Invoice</option>
                    {invoices.map(invoice => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.number}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job No
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.job_no}
                    onChange={(e) => handleInputChange('job_no', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    POL
                  </label>
                  <select
                    value={formData.pol_id}
                    onChange={(e) => handleInputChange('pol_id', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select POL</option>
                    {pols.map(pol => (
                      <option key={pol.id} value={pol.id}>
                        {pol.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    BL No
                  </label>
                  <select
                    value={formData.bl_id}
                    onChange={(e) => handleInputChange('bl_id', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select BL</option>
                    {bls.map(bl => (
                      <option key={bl.id} value={bl.id}>
                        {bl.number}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Note Details Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white">Credit Note Details</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credit Note No *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.credit_note_no}
                    onChange={(e) => handleInputChange('credit_note_no', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.credit_note_date}
                    onChange={(e) => handleInputChange('credit_note_date', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Line Items</h2>
              <button
                type="button"
                onClick={addLineItem}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Plus className="w-5 h-5 mr-1" />
                Add Item
              </button>
            </div>
            <div className="p-6">
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
                  <tr>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-left">Quantity</th>
                    <th className="px-4 py-3 text-left">Unit Price</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Description"
                          className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={item.description}
                          onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          placeholder="Quantity"
                          className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={item.quantity}
                          onChange={(e) => handleLineItemChange(item.id, 'quantity', e.target.value)}
                          min="0"
                          step="0.01"
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          placeholder="Unit Price"
                          className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={item.unit_price}
                          onChange={(e) => handleLineItemChange(item.id, 'unit_price', e.target.value)}
                          min="0"
                          step="0.01"
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          className="w-full px-3 py-1 border border-gray-300 rounded-md bg-gray-50"
                          value={item.amount}
                          readOnly
                        />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => removeLineItem(item.id)}
                          disabled={lineItems.length <= 1}
                          className={`p-2 rounded-md ${
                            lineItems.length > 1 
                              ? 'text-red-600 hover:bg-red-100' 
                              : 'text-gray-400 cursor-not-allowed'
                          }`}
                          title={lineItems.length > 1 ? "Remove item" : "Cannot remove last item"}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white">Totals</h2>
            </div>
            <div className="p-6">
              <div className="flex justify-end">
                <div className="w-80">
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-700">Sub Total</span>
                    <input
                      type="text"
                      className="w-40 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-right"
                      value={formData.total_amount}
                      readOnly
                    />
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-700">VAT Amount (18%)</span>
                    <input
                      type="text"
                      className="w-40 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-right"
                      value={formData.vat_amount}
                      readOnly
                    />
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-gray-300 mt-2 pt-3">
                    <span className="font-bold text-gray-800">Total Amount</span>
                    <input
                      type="text"
                      className="w-40 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 font-bold text-right"
                      value={formData.grand_total}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center"
              disabled={isLoading}
            >
              <XCircle className="w-5 h-5 mr-1" />
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-colors flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-1" />
                  {editingId ? "Update Credit Note" : "Save Credit Note"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierCreditNote;