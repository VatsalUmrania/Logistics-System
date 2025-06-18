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



import React, { useState, useEffect, useRef } from 'react';
import { FileText, Plus, Trash2, Save, XCircle, Loader2, Edit2 } from 'lucide-react';

const ACCENT = "indigo";

// Auth header utility
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Authentication token missing');
  return { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// API endpoints
const API_SUPPLIERS = "http://localhost:5000/api/suppliers";
const API_PORTS = "http://localhost:5000/api/ports";
const API_ASSIGNMENTS = "http://localhost:5000/api/supplier-assignments";
const API_CREDIT_NOTES = "http://localhost:5000/api/supplier-credit-notes";

const SupplierCreditNote = () => {
  // Data state
  const [suppliers, setSuppliers] = useState([]);
  const [ports, setPorts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [creditNotes, setCreditNotes] = useState([]);
  // Form state
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
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const lastLineItemRef = useRef(null);

  // Fetch dropdowns and notes
  useEffect(() => {
    fetchDropdowns();
    fetchCreditNotes();
  }, []);

  async function fetchDropdowns() {
    try {
      const [sup, port, assign] = await Promise.all([
        fetch(API_SUPPLIERS, { headers: getAuthHeaders() }).then(r => r.json()),
        fetch(API_PORTS, { headers: getAuthHeaders() }).then(r => r.json()),
        fetch(API_ASSIGNMENTS, { headers: getAuthHeaders() }).then(r => r.json())
      ]);
      setSuppliers(Array.isArray(sup) ? sup : (sup.data || []));
      setPorts(Array.isArray(port) ? port : (port.data || []));
      setAssignments(assign.data || []);
    } catch (err) {
      setErrorMsg("Failed to fetch dropdowns: " + err.message);
    }
  }

  async function fetchCreditNotes() {
    try {
      const response = await fetch(API_CREDIT_NOTES, { headers: getAuthHeaders() });
      const data = await response.json();
      setCreditNotes(data.data || []);
    } catch (err) {
      setCreditNotes([]);
    }
  }

  // Calculate line item amounts and totals
  useEffect(() => {
    const updated = lineItems.map(item => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unit_price) || 0;
      return { ...item, amount: (quantity * unitPrice).toFixed(2) };
    });
    const subTotal = updated.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
    const vatAmount = subTotal * 0.18;
    const totalAmount = subTotal + vatAmount;
    setFormData(prev => ({
      ...prev,
      total_amount: subTotal.toFixed(2),
      vat_amount: vatAmount.toFixed(2),
      grand_total: totalAmount.toFixed(2)
    }));
    setLineItems(updated);
  }, [lineItems]);

  useEffect(() => {
    if (lastLineItemRef.current) lastLineItemRef.current.focus();
  }, [lineItems.length]);

  // Handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMsg('');
    setSuccessMsg('');
  };
  const handleLineItemChange = (id, field, value) => {
    setLineItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
    setErrorMsg('');
    setSuccessMsg('');
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

  // CRUD
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
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
      let res, data;
      if (editingId) {
        res = await fetch(`${API_CREDIT_NOTES}/${editingId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        data = await res.json();
      } else {
        res = await fetch(API_CREDIT_NOTES, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        data = await res.json();
      }
      if (data.success) {
        setSuccessMsg(editingId ? "Credit Note updated!" : "Credit Note created!");
        fetchCreditNotes();
        handleReset();
      } else {
        setErrorMsg(data.message || "Failed to save credit note");
      }
    } catch (error) {
      setErrorMsg('Error saving credit note: ' + error.message);
    } finally {
      setIsLoading(false);
      setEditingId(null);
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
      assignment_id: '',
      port_id: '',
      job_number: note.job_number || ''
    });
    setLineItems(note.lineItems?.map((li, idx) => ({
      id: idx + 1,
      description: li.description,
      quantity: li.quantity,
      unit_price: li.unit_price,
      amount: li.amount
    })) || [{ id: 1, description: '', quantity: '', unit_price: '', amount: '' }]);
    setErrorMsg('');
    setSuccessMsg('');
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this credit note?')) return;
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await fetch(`${API_CREDIT_NOTES}/${id}`, { method: "DELETE", headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Credit note deleted");
        fetchCreditNotes();
      } else {
        setErrorMsg(data.message || "Delete failed");
      }
    } catch (err) {
      setErrorMsg("Server error: " + err.message);
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
      assignment_id: '',
      port_id: '',
      job_number: ''
    });
    setLineItems([{ id: 1, description: '', quantity: '', unit_price: '', amount: '' }]);
    setEditingId(null);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const supplierName = (id) => suppliers.find(s => String(s.id) === String(id))?.name || "";
  const portName = (id) => ports.find(p => String(p.id) === String(id))?.name || "";
  const assignment = assignments.find(a => String(a.id) === String(formData.assignment_id));

  const fadeClass = "transition-all duration-200";
  const inputAccent = `focus:ring-2 focus:ring-${ACCENT}-500 focus:border-${ACCENT}-500`;

  // --- UI ---
  return (
    <div className={`min-h-screen bg-gray-50 p-4 md:p-8`}>
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex items-center gap-3 px-24">
          <FileText className={`h-10 w-10 text-${ACCENT}-700`} />
          <div>
            <h1 className={`text-4xl font-bold tracking-tight text-${ACCENT}-800`}>Supplier Credit Notes</h1>
            <div className={`mt-1 text-${ACCENT}-600 text-base font-medium`}>Create, edit, and manage supplier credit notes</div>
          </div>
        </div>
      </header>

      {/* Alerts */}
      <div className="max-w-3xl mx-auto">
        {successMsg && (
          <div className="mb-4 rounded px-4 py-3 bg-green-100 text-green-800 border border-green-200 text-center shadow">{successMsg}</div>
        )}
        {errorMsg && (
          <div className="mb-4 rounded px-4 py-3 bg-red-100 text-red-800 border border-red-200 text-center shadow">{errorMsg}</div>
        )}
      </div>

      {/* Main Grid */}
      <main className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* List */}
        <section className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
          <div className={`px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-${ACCENT}-50`}>
            <FileText className={`h-6 w-6 text-${ACCENT}-600`} />
            <h2 className="text-2xl font-bold text-gray-700">Credit Notes List</h2>
          </div>
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Credit Note #</th>
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Date</th>
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Supplier</th>
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Total</th>
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Line Items</th>
                <th className="px-4 py-3 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {creditNotes.map((note, i) => (
                <tr key={note.id} className={`hover:bg-${ACCENT}-50/60 ${i % 2 ? "bg-gray-50" : ""}`}>
                  <td className="px-4 py-2 font-bold">{note.credit_note_no}</td>
                  <td className="px-4 py-2">{note.credit_note_date?.substring(0, 10)}</td>
                  <td className="px-4 py-2">{note.supplier_name || supplierName(note.supplier_id)}</td>
                  <td className={`px-4 py-2 font-bold text-${ACCENT}-700`}>₹{parseFloat(note.grand_total).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                  <td className="px-4 py-2">
                    <ul className="text-xs rounded bg-gray-50 px-2 py-1 max-h-20 overflow-y-auto">
                      {(note.lineItems || []).map((li, idx) => (
                        <li key={idx}>
                          <span className="font-medium">{li.description}</span>: {li.quantity} × {li.unit_price} = {li.amount}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap flex gap-1 items-center">
                    <button
                      onClick={() => handleEdit(note)}
                      className={`p-2 rounded-full hover:bg-${ACCENT}-100 text-${ACCENT}-600 hover:text-${ACCENT}-800 ${fadeClass}`}
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className={`p-2 rounded-full hover:bg-red-100 text-red-600 hover:text-red-800 ${fadeClass}`}
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {creditNotes.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">No credit notes found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
        {/* Form */}
        <section>
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Supplier & Assignment */}
            <div className={`bg-white rounded-xl shadow border border-${ACCENT}-200 px-6 py-5 space-y-6`}>
              <h2 className={`text-lg font-semibold flex items-center gap-2 text-${ACCENT}-700 mb-3`}>
                <FileText className="h-5 w-5" /> Supplier & Assignment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-1 font-medium">Supplier <span className="text-red-600">*</span></label>
                  <select
                    value={formData.supplier_id}
                    onChange={e => handleInputChange('supplier_id', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg ${inputAccent}`}
                    required
                  >
                    <option value="">Select</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Supplier Invoice No</label>
                  <select
                    value={formData.assignment_id}
                    onChange={e => handleInputChange('assignment_id', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg ${inputAccent}`}
                  >
                    <option value="">Select Invoice</option>
                    {assignments
                      .filter(a => !formData.supplier_id || String(a.supplier_id) === String(formData.supplier_id))
                      .map(a => (
                        <option key={a.id} value={a.id}>
                          {a.supplier_invoice_no} ({a.job_number})
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Job No</label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg ${inputAccent}`}
                    value={assignment ? assignment.job_number : formData.job_number}
                    onChange={e => handleInputChange('job_number', e.target.value)}
                    disabled={!!assignment}
                  />
                </div>
              </div>
            </div>
            {/* Credit Note Info */}
            <div className={`bg-white rounded-xl shadow border border-${ACCENT}-200 px-6 py-5 space-y-6`}>
              <h2 className={`text-lg font-semibold flex items-center gap-2 text-${ACCENT}-700 mb-3`}>
                <FileText className="h-5 w-5" /> Credit Note Info
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-1 font-medium">Credit Note No <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg ${inputAccent}`}
                    value={formData.credit_note_no}
                    onChange={e => handleInputChange('credit_note_no', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Date <span className="text-red-600">*</span></label>
                  <input
                    type="date"
                    className={`w-full px-4 py-2 border rounded-lg ${inputAccent}`}
                    value={formData.credit_note_date}
                    onChange={e => handleInputChange('credit_note_date', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Port</label>
                  <select
                    value={formData.port_id}
                    onChange={e => handleInputChange('port_id', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg ${inputAccent}`}
                  >
                    <option value="">Select Port</option>
                    {ports.map(port => (
                      <option key={port.id} value={port.id}>{port.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/* Line Items */}
            <div className={`bg-white rounded-xl shadow border border-${ACCENT}-200 px-6 py-5`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-lg font-semibold flex items-center gap-2 text-${ACCENT}-700`}>
                  <Plus className="h-5 w-5 text-green-600" /> Line Items
                </h2>
                <button
                  type="button"
                  onClick={addLineItem}
                  className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md ${fadeClass}`}
                  title="Add Line Item"
                >
                  <Plus className="w-5 h-5 mr-1" />
                  Add Item
                </button>
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="min-w-full border-collapse text-sm">
                  <thead className={`bg-gray-100`}>
                    <tr>
                      <th className="px-4 py-2 text-left">Description</th>
                      <th className="px-4 py-2 text-left">Quantity</th>
                      <th className="px-4 py-2 text-left">Unit Price</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                      <th className="px-4 py-2 text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, idx) => (
                      <tr key={item.id} className={idx % 2 ? "bg-gray-50" : ""}>
                        <td className="px-4 py-2">
                          <input
                            ref={idx === lineItems.length - 1 ? lastLineItemRef : null}
                            type="text"
                            placeholder="Description"
                            className={`w-full px-3 py-1 border rounded-md ${inputAccent}`}
                            value={item.description}
                            onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                            required
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            placeholder="Quantity"
                            className={`w-full px-3 py-1 border rounded-md ${inputAccent}`}
                            value={item.quantity}
                            onChange={(e) => handleLineItemChange(item.id, 'quantity', e.target.value)}
                            min="0"
                            step="0.01"
                            required
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            placeholder="Unit Price"
                            className={`w-full px-3 py-1 border rounded-md ${inputAccent}`}
                            value={item.unit_price}
                            onChange={(e) => handleLineItemChange(item.id, 'unit_price', e.target.value)}
                            min="0"
                            step="0.01"
                            required
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            className="w-full px-3 py-1 border rounded-md bg-gray-50 font-semibold"
                            value={item.amount}
                            readOnly
                          />
                        </td>
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            onClick={() => removeLineItem(item.id)}
                            disabled={lineItems.length <= 1}
                            className={`p-2 rounded-full transition ${
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
                    {/* Totals Row */}
                    <tr className="bg-gray-50 font-semibold">
                      <td colSpan={3} className="text-right px-4 py-2">Sub Total</td>
                      <td className="px-4 py-2">{formData.total_amount}</td>
                      <td></td>
                    </tr>
                    <tr className="bg-gray-50 font-semibold">
                      <td colSpan={3} className="text-right px-4 py-2">VAT (18%)</td>
                      <td className="px-4 py-2">{formData.vat_amount}</td>
                      <td></td>
                    </tr>
                    <tr className={`bg-gray-100 font-bold text-${ACCENT}-800 text-lg`}>
                      <td colSpan={3} className="text-right px-4 py-2">Grand Total</td>
                      <td className="px-4 py-2">{formData.grand_total}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleReset}
                className={`px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center transition`}
                disabled={isLoading}
              >
                <XCircle className="w-5 h-5 mr-1" />
                Reset
              </button>
              <button
                type="submit"
                className={`px-6 py-2 bg-${ACCENT}-600 hover:bg-${ACCENT}-700 text-white rounded-lg flex items-center shadow-lg ${fadeClass}`}
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
        </section>
      </main>
    </div>
  );
};

export default SupplierCreditNote;