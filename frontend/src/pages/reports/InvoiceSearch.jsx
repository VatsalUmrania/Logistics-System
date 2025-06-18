// import React, { useState } from 'react';
// import {
//   FileText,
//   Plus,
//   Pencil,
//   Trash2,
//   ChevronDown,
//   Search,
//   ChevronLeft,
//   ChevronRight,
//   X,
// } from 'lucide-react';

// const InvoiceSearch = () => {
//   // Sample initial data for invoices
//   const initialInvoices = [
//     {
//       id: 1,
//       operationNo: 'OP001',
//       clientName: 'ABC Trading Company',
//       clientNameAr: 'شركة ABC للتجارة',
//     },
//     {
//       id: 2,
//       operationNo: 'OP002',
//       clientName: 'XYZ Logistics',
//       clientNameAr: 'شركة XYZ للخدمات اللوجستية',
//     },
//     {
//       id: 3,
//       operationNo: 'OP003',
//       clientName: 'Global Shipping Ltd',
//       clientNameAr: 'شركة الشحن العالمية المحدودة',
//     },
//     {
//       id: 4,
//       operationNo: 'OP004',
//       clientName: 'Emirates Freight',
//       clientNameAr: 'شركة الإمارات للشحن',
//     },
//     {
//       id: 5,
//       operationNo: 'OP005',
//       clientName: 'Dubai Cargo Services',
//       clientNameAr: 'خدمات دبي للشحن',
//     },
//   ];

//   // State variables for invoice data, search, and form handling
//   const [invoices, setInvoices] = useState(initialInvoices);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isAdding, setIsAdding] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [newInvoice, setNewInvoice] = useState({
//     operationNo: '',
//     clientName: '',
//     clientNameAr: '',
//   });

//   // State for sorting and pagination
//   const [sortField, setSortField] = useState('operationNo');
//   const [sortDirection, setSortDirection] = useState('asc');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // Handler for adding or updating an invoice
//   const handleAddInvoice = () => {
//     // Require operation number and client name
//     if (!newInvoice.operationNo.trim() || !newInvoice.clientName.trim()) return;

//     if (editingId) {
//       // Update existing invoice
//       const updatedInvoices = invoices.map((inv) =>
//         inv.id === editingId ? { ...inv, ...newInvoice } : inv
//       );
//       setInvoices(updatedInvoices);
//     } else {
//       // Add new invoice (assign new id)
//       const newId = invoices.length ? Math.max(...invoices.map((inv) => inv.id)) + 1 : 1;
//       setInvoices([...invoices, { id: newId, ...newInvoice }]);
//     }
//     // Reset form and close the add/edit panel
//     setNewInvoice({ operationNo: '', clientName: '', clientNameAr: '' });
//     setEditingId(null);
//     setIsAdding(false);
//   };

//   // Handler for deleting an invoice
//   const handleDelete = (id) => {
//     if (!window.confirm('Are you sure you want to delete this invoice?')) return;
//     setInvoices(invoices.filter((inv) => inv.id !== id));
//   };

//   // Handler for populating the form when editing an invoice
//   const handleEdit = (inv) => {
//     setNewInvoice({
//       operationNo: inv.operationNo,
//       clientName: inv.clientName,
//       clientNameAr: inv.clientNameAr,
//     });
//     setEditingId(inv.id);
//     setIsAdding(true);
//   };

//   // Sorting handler (clickable header)
//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   // Create a sorted copy based on sortField and sortDirection
//   const sortedInvoices = [...invoices].sort((a, b) => {
//     if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
//     if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
//     return 0;
//   });

//   // Filter invoices based on the search term
//   const filteredInvoices = sortedInvoices.filter(
//     (inv) =>
//       inv.operationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       inv.clientName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section: Title, Subtitle, Search, and Add Toggle */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//               <FileText className="w-8 h-8 mr-3 text-indigo-600" />
//               INVOICES
//             </h1>
//             <p className="text-gray-600 mt-2">Manage invoice details for your business</p>
//           </div>
//           <div className="mt-4 md:mt-0 flex space-x-3">
//             <div className="relative">
//               <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
//                 <Search className="w-5 h-5 text-gray-400 mr-2" />
//                 <input
//                   type="text"
//                   placeholder="Search invoices..."
//                   className="bg-transparent outline-none w-40"
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                   onKeyDown={(e) => e.key === 'Enter' && setCurrentPage(1)}
//                 />
//               </div>
//             </div>
//             <button
//               onClick={() => {
//                 // Toggle form open/close; reset fields if opening add mode
//                 setIsAdding(!isAdding);
//                 setEditingId(null);
//                 setNewInvoice({ operationNo: '', clientName: '', clientNameAr: '' });
//               }}
//               className={`px-5 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md ${
//                 isAdding
//                   ? 'bg-red-600 hover:bg-red-700'
//                   : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
//               }`}
//             >
//               {isAdding ? (
//                 <>
//                   <X className="w-5 h-5 mr-2" />
//                   Close
//                 </>
//               ) : (
//                 <>
//                   <Plus className="w-5 h-5 mr-2" />
//                   Add Invoice
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Add/Edit Invoice Form */}
//         {isAdding && (
//           <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
//             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
//               <h2 className="text-xl font-bold text-white flex items-center">
//                 <FileText className="w-5 h-5 mr-2" />
//                 {editingId ? 'Edit Invoice' : 'Add Invoice'}
//               </h2>
//             </div>
//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Left Column: Required fields */}
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Operation No <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="Enter Operation No"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       value={newInvoice.operationNo}
//                       onChange={(e) =>
//                         setNewInvoice({ ...newInvoice, operationNo: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Client Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="Enter Client Name"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       value={newInvoice.clientName}
//                       onChange={(e) =>
//                         setNewInvoice({ ...newInvoice, clientName: e.target.value })
//                       }
//                     />
//                   </div>
//                 </div>
//                 {/* Right Column: Optional fields */}
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Client Name (Arabic)
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="Enter Client Name in Arabic"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       value={newInvoice.clientNameAr}
//                       onChange={(e) =>
//                         setNewInvoice({ ...newInvoice, clientNameAr: e.target.value })
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-6 flex justify-end">
//                 <button
//                   onClick={handleAddInvoice}
//                   className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
//                 >
//                   {editingId ? 'Update Invoice' : 'Add Invoice'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Invoice Table */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           <table className="min-w-full table-auto border-collapse">
//             <thead className="bg-indigo-600 text-white text-sm font-semibold">
//               <tr>
//                 {[
//                   { label: 'SL', key: 'sl', noSort: true },
//                   { label: 'Operation No', key: 'operationNo' },
//                   { label: 'Client Name', key: 'clientName' },
//                   { label: 'Actions', key: null },
//                 ].map(({ label, key, noSort }) => (
//                   <th
//                     key={label}
//                     onClick={() => key && !noSort && handleSort(key)}
//                     className={`px-4 py-3 text-left cursor-pointer select-none ${
//                       key && !noSort ? 'hover:bg-indigo-700' : ''
//                     }`}
//                   >
//                     <div className="flex items-center">
//                       {label}
//                       {key && !noSort && sortField === key && (
//                         <ChevronDown
//                           className={`w-4 h-4 ml-1 transition-transform ${
//                             sortDirection === 'asc' ? 'rotate-180' : ''
//                           }`}
//                         />
//                       )}
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {currentInvoices.length === 0 ? (
//                 <tr>
//                   <td colSpan={4} className="text-center py-8 text-gray-500">
//                     No invoices found.
//                   </td>
//                 </tr>
//               ) : (
//                 currentInvoices.map((inv, index) => (
//                   <tr key={inv.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="px-4 py-3 text-center text-gray-900">
//                       {index + 1 + indexOfFirstItem}
//                     </td>
//                     <td className="px-4 py-3 text-gray-900">{inv.operationNo}</td>
//                     <td className="px-4 py-3">
//                       <div>
//                         <div className="font-semibold text-gray-900">{inv.clientName}</div>
//                         <div className="text-xs text-gray-500 italic" style={{ direction: 'rtl' }}>
//                           {inv.clientNameAr}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 flex space-x-3">
//                       <button
//                         onClick={() => handleEdit(inv)}
//                         title="Edit"
//                         className="text-indigo-600 hover:text-indigo-800"
//                       >
//                         <Pencil className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(inv.id)}
//                         title="Delete"
//                         className="text-red-600 hover:text-red-800"
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>

//           {/* Pagination Controls */}
//           <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
//             <div className="text-sm text-gray-700">
//               Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredInvoices.length)} of {filteredInvoices.length} results
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
//                 title="Previous"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                 disabled={currentPage === totalPages || totalPages === 0}
//                 className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
//                 title="Next"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceSearch;


import React, { useState, useEffect } from 'react';
import {
  FileText,
  ChevronDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Authentication token missing');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const API_URL = 'http://localhost:5000/api/invoices';
const SUPPLIERS_URL = 'http://localhost:5000/api/suppliers';

const InvoiceSearch = () => {
  const [invoices, setInvoices] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchFields, setSearchFields] = useState({
    supplier: '',
    invoiceNo: '',
    dateFrom: '',
    dateTo: ''
  });

  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);

  // Fetch invoices and suppliers
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const supRes = await fetch(SUPPLIERS_URL, { headers: getAuthHeaders() });
      const supData = await supRes.json();
      setSuppliers(Array.isArray(supData) ? supData : supData.data || []);
      const invRes = await fetch(API_URL, { headers: getAuthHeaders() });
      const invData = await invRes.json();
      setInvoices(Array.isArray(invData) ? invData : invData.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(s => String(s.id) === String(supplierId));
    return supplier ? supplier.name : supplierId || '-';
  };

  // Filtering (including date interval)
  const filteredInvoices = invoices.filter(inv => {
    const supplierName = getSupplierName(inv.supplier_id).toLowerCase();
    const supplierMatches = searchFields.supplier
      ? supplierName.includes(searchFields.supplier.toLowerCase())
      : true;
    const invoiceNoMatches = searchFields.invoiceNo
      ? ((inv.invoice_no || inv.invoiceNo || '') + '').toLowerCase().includes(searchFields.invoiceNo.toLowerCase())
      : true;
    // Support both 'date' and 'invoice_date'
    const dateVal = (inv.date || inv.invoice_date || '').slice(0, 10);
    const from = searchFields.dateFrom;
    const to = searchFields.dateTo;
    let dateMatches = true;
    if (from && to) {
      dateMatches = dateVal >= from && dateVal <= to;
    } else if (from) {
      dateMatches = dateVal >= from;
    } else if (to) {
      dateMatches = dateVal <= to;
    }
    return supplierMatches && invoiceNoMatches && dateMatches;
  });

  // Sorting
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    let aVal, bVal;
    if (sortField === 'supplier') {
      aVal = getSupplierName(a.supplier_id).toLowerCase();
      bVal = getSupplierName(b.supplier_id).toLowerCase();
    } else if (sortField === 'date') {
      aVal = (a.date || a.invoice_date || '');
      bVal = (b.date || b.invoice_date || '');
    } else {
      aVal = a[sortField] || a[sortField.replace(/([A-Z])/g, '_$1').toLowerCase()] || '';
      bVal = b[sortField] || b[sortField.replace(/([A-Z])/g, '_$1').toLowerCase()] || '';
    }
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = sortedInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(sortedInvoices.length / itemsPerPage));

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-50 via-gray-50 to-blue-100 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 flex items-center gap-4">
          <div className="flex-shrink-0 bg-gradient-to-tr from-indigo-500 to-purple-400 rounded-2xl p-4">
            <FileText className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-2">
              Invoice Search
            </h1>
            <p className="text-gray-600 text-lg md:text-xl">
              Quickly find supplier invoices with flexible filters and a beautiful, responsive interface.
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/70 backdrop-blur rounded-2xl shadow-lg px-8 py-8 mb-10 flex flex-col md:flex-row md:items-end gap-8 md:gap-4">
          <div className="flex-1">
            <label className="block font-semibold text-gray-700 mb-2">Supplier Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Supplier Name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
                value={searchFields.supplier}
                onChange={e => {
                  setSearchFields(f => ({ ...f, supplier: e.target.value }));
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block font-semibold text-gray-700 mb-2">Invoice No</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Invoice No"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
                value={searchFields.invoiceNo}
                onChange={e => {
                  setSearchFields(f => ({ ...f, invoiceNo: e.target.value }));
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Invoice Date From
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
              value={searchFields.dateFrom}
              onChange={e => {
                setSearchFields(f => ({ ...f, dateFrom: e.target.value }));
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              Invoice Date To
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
              value={searchFields.dateTo}
              onChange={e => {
                setSearchFields(f => ({ ...f, dateTo: e.target.value }));
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl overflow-x-auto mb-10">
          <table className="min-w-full border-collapse text-base">
            <thead className="bg-gradient-to-tr from-indigo-500 to-purple-400 text-white">
              <tr>
                {[
                  { label: 'SL', key: 'sl', noSort: true },
                  { label: 'Supplier', key: 'supplier' },
                  { label: 'Invoice No', key: 'invoiceNo' },
                  { label: 'Date', key: 'date' },
                ].map(({ label, key, noSort }) => (
                  <th
                    key={label}
                    onClick={() => key && !noSort && setSortField(field => {
                      if (sortField === key) {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        return key;
                      } else {
                        setSortDirection('asc');
                        return key;
                      }
                    })}
                    className={`px-6 py-4 text-left cursor-pointer select-none whitespace-nowrap font-semibold tracking-wide ${
                      key && !noSort ? 'hover:bg-indigo-600/80 transition' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {key && !noSort && sortField === key && (
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
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-xl text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : currentInvoices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-lg text-gray-500">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                currentInvoices.map((inv, index) => (
                  <tr
                    key={inv.id}
                    className="border-b border-gray-200 last:border-0 hover:bg-indigo-50/60 transition"
                  >
                    <td className="px-6 py-4 text-center text-gray-700 font-bold">{index + 1 + indexOfFirstItem}</td>
                    <td className="px-6 py-4 text-gray-800 font-medium">{getSupplierName(inv.supplier_id)}</td>
                    <td className="px-6 py-4 text-gray-700">{inv.invoice_no || inv.invoiceNo}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {(inv.date || inv.invoice_date || '').slice(0, 10)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-700">
              Showing <span className="font-semibold">{Math.min(indexOfFirstItem + 1, sortedInvoices.length)}</span> to <span className="font-semibold">{Math.min(indexOfLastItem, sortedInvoices.length)}</span> of <span className="font-semibold">{sortedInvoices.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition"
                title="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-2 py-1 text-gray-700 rounded bg-white border border-gray-200 font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition"
                title="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm pt-6">
          &copy; {new Date().getFullYear()} Invoice Search • Powered by your team
        </div>
      </div>
    </div>
  );
};

export default InvoiceSearch;