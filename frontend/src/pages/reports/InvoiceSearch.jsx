
// import React, { useState } from 'react';
// import { Search, ChevronRight } from 'lucide-react';

// const InvoiceSearch = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [invoices] = useState([
//     {
//       id: 1,
//       operationNo: 'OP001',
//       clientName: 'ABC Trading Company',
//       clientNameAr: 'شركة ABC للتجارة'
//     },
//     {
//       id: 2,
//       operationNo: 'OP002',
//       clientName: 'XYZ Logistics',
//       clientNameAr: 'شركة XYZ للخدمات اللوجستية'
//     },
//     {
//       id: 3,
//       operationNo: 'OP003',
//       clientName: 'Global Shipping Ltd',
//       clientNameAr: 'شركة الشحن العالمية المحدودة'
//     },
//     {
//       id: 4,
//       operationNo: 'OP004',
//       clientName: 'Emirates Freight',
//       clientNameAr: 'شركة الإمارات للشحن'
//     },
//     {
//       id: 5,
//       operationNo: 'OP005',
//       clientName: 'Dubai Cargo Services',
//       clientNameAr: 'خدمات دبي للشحن'
//     }
//   ]);

//   const handleSearch = () => {
//     if (!searchTerm.trim()) return;
//     console.log('Searching for:', searchTerm);
//   };

//   const handleViewInvoice = (invoice) => {
//     console.log('Viewing invoice:', invoice);
//   };

//   const filteredInvoices = invoices.filter(invoice => 
//     invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     invoice.operationNo?.includes(searchTerm)
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex gap-4">
//           {/* Search Panel */}
//           <div className="w-80 bg-white rounded-lg shadow-sm overflow-hidden">
//             {/* Search Header */}
//             <div className="bg-slate-600 text-white px-4 py-3 text-center font-medium">
//               Search
//             </div>
            
//             {/* Search Content */}
//             <div className="p-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Client Name/Job No <span className="text-red-500">*</span>
//               </label>
              
//               <input
//                 type="text"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
//                 placeholder="Client Name or Job No"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//               />
              
//               <button 
//                 className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors duration-200"
//                 onClick={handleSearch}
//               >
//                 <Search size={16} />
//                 Search
//               </button>
//             </div>
//           </div>

//           {/* Invoice List Panel */}
//           <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
//             {/* List Header */}
//             <div className="bg-slate-600 text-white px-4 py-3 text-center font-medium">
//               Invoice List
//             </div>
            
//             {/* Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-blue-700 text-white">
//                     <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide">
//                       SL.NO
//                     </th>
//                     <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide">
//                       OPERATION NO
//                     </th>
//                     <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide">
//                       CLIENT NAME
//                     </th>
//                     <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide">
//                       GO
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white">
//                   {filteredInvoices.map((invoice, index) => (
//                     <tr 
//                       key={invoice.id}
//                       className="border-b border-gray-200 hover:bg-gray-50"
//                     >
//                       <td className="px-4 py-4 text-center text-sm text-gray-900">
//                         {index + 1}
//                       </td>
//                       <td className="px-4 py-4 text-center text-sm text-gray-900">
//                         {invoice.operationNo}
//                       </td>
//                       <td className="px-4 py-4 text-sm">
//                         <div className="text-center">
//                           <div className="font-semibold text-gray-900">
//                             {invoice.clientName}
//                           </div>
//                           <div className="text-xs text-gray-500 mt-1" style={{ direction: 'rtl' }}>
//                             {invoice.clientNameAr}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 text-center">
//                         <button 
//                           className="inline-flex items-center justify-center w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
//                           onClick={() => handleViewInvoice(invoice)}
//                           title="View Invoice"
//                         >
//                           <ChevronRight size={16} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceSearch;

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

const InvoiceSearch = () => {
  // Sample initial data for invoices
  const initialInvoices = [
    {
      id: 1,
      operationNo: 'OP001',
      clientName: 'ABC Trading Company',
      clientNameAr: 'شركة ABC للتجارة',
    },
    {
      id: 2,
      operationNo: 'OP002',
      clientName: 'XYZ Logistics',
      clientNameAr: 'شركة XYZ للخدمات اللوجستية',
    },
    {
      id: 3,
      operationNo: 'OP003',
      clientName: 'Global Shipping Ltd',
      clientNameAr: 'شركة الشحن العالمية المحدودة',
    },
    {
      id: 4,
      operationNo: 'OP004',
      clientName: 'Emirates Freight',
      clientNameAr: 'شركة الإمارات للشحن',
    },
    {
      id: 5,
      operationNo: 'OP005',
      clientName: 'Dubai Cargo Services',
      clientNameAr: 'خدمات دبي للشحن',
    },
  ];

  // State variables for invoice data, search, and form handling
  const [invoices, setInvoices] = useState(initialInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newInvoice, setNewInvoice] = useState({
    operationNo: '',
    clientName: '',
    clientNameAr: '',
  });

  // State for sorting and pagination
  const [sortField, setSortField] = useState('operationNo');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Handler for adding or updating an invoice
  const handleAddInvoice = () => {
    // Require operation number and client name
    if (!newInvoice.operationNo.trim() || !newInvoice.clientName.trim()) return;

    if (editingId) {
      // Update existing invoice
      const updatedInvoices = invoices.map((inv) =>
        inv.id === editingId ? { ...inv, ...newInvoice } : inv
      );
      setInvoices(updatedInvoices);
    } else {
      // Add new invoice (assign new id)
      const newId = invoices.length ? Math.max(...invoices.map((inv) => inv.id)) + 1 : 1;
      setInvoices([...invoices, { id: newId, ...newInvoice }]);
    }
    // Reset form and close the add/edit panel
    setNewInvoice({ operationNo: '', clientName: '', clientNameAr: '' });
    setEditingId(null);
    setIsAdding(false);
  };

  // Handler for deleting an invoice
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    setInvoices(invoices.filter((inv) => inv.id !== id));
  };

  // Handler for populating the form when editing an invoice
  const handleEdit = (inv) => {
    setNewInvoice({
      operationNo: inv.operationNo,
      clientName: inv.clientName,
      clientNameAr: inv.clientNameAr,
    });
    setEditingId(inv.id);
    setIsAdding(true);
  };

  // Sorting handler (clickable header)
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Create a sorted copy based on sortField and sortDirection
  const sortedInvoices = [...invoices].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Filter invoices based on the search term
  const filteredInvoices = sortedInvoices.filter(
    (inv) =>
      inv.operationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section: Title, Subtitle, Search, and Add Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              INVOICES
            </h1>
            <p className="text-gray-600 mt-2">Manage invoice details for your business</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="bg-transparent outline-none w-40"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && setCurrentPage(1)}
                />
              </div>
            </div>
            <button
              onClick={() => {
                // Toggle form open/close; reset fields if opening add mode
                setIsAdding(!isAdding);
                setEditingId(null);
                setNewInvoice({ operationNo: '', clientName: '', clientNameAr: '' });
              }}
              className={`px-5 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md ${
                isAdding
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
              }`}
            >
              {isAdding ? (
                <>
                  <X className="w-5 h-5 mr-2" />
                  Close
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Add Invoice
                </>
              )}
            </button>
          </div>
        </div>

        {/* Add/Edit Invoice Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                {editingId ? 'Edit Invoice' : 'Add Invoice'}
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Required fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Operation No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Operation No"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={newInvoice.operationNo}
                      onChange={(e) =>
                        setNewInvoice({ ...newInvoice, operationNo: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Client Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={newInvoice.clientName}
                      onChange={(e) =>
                        setNewInvoice({ ...newInvoice, clientName: e.target.value })
                      }
                    />
                  </div>
                </div>
                {/* Right Column: Optional fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name (Arabic)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Client Name in Arabic"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={newInvoice.clientNameAr}
                      onChange={(e) =>
                        setNewInvoice({ ...newInvoice, clientNameAr: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleAddInvoice}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
                >
                  {editingId ? 'Update Invoice' : 'Add Invoice'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-indigo-600 text-white text-sm font-semibold">
              <tr>
                {[
                  { label: 'SL', key: 'sl', noSort: true },
                  { label: 'Operation No', key: 'operationNo' },
                  { label: 'Client Name', key: 'clientName' },
                  { label: 'Actions', key: null },
                ].map(({ label, key, noSort }) => (
                  <th
                    key={label}
                    onClick={() => key && !noSort && handleSort(key)}
                    className={`px-4 py-3 text-left cursor-pointer select-none ${
                      key && !noSort ? 'hover:bg-indigo-700' : ''
                    }`}
                  >
                    <div className="flex items-center">
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
              {currentInvoices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                currentInvoices.map((inv, index) => (
                  <tr key={inv.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-center text-gray-900">
                      {index + 1 + indexOfFirstItem}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{inv.operationNo}</td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-semibold text-gray-900">{inv.clientName}</div>
                        <div className="text-xs text-gray-500 italic" style={{ direction: 'rtl' }}>
                          {inv.clientNameAr}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 flex space-x-3">
                      <button
                        onClick={() => handleEdit(inv)}
                        title="Edit"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(inv.id)}
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

          {/* Pagination Controls */}
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredInvoices.length)} of {filteredInvoices.length} results
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
  );
};

export default InvoiceSearch;