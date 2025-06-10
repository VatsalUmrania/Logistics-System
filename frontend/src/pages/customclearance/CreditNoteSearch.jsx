// import React, { useState } from 'react';
// import { Search, ArrowRight } from 'lucide-react';

// const CreditNoteSearch = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [creditNotes, setCreditNotes] = useState([
//     {
//       id: 1,
//       creditNoteNo: 'CN001',
//       operationNo: 'OP001',
//       clientName: 'ABC Trading Company',
//       clientNameAr: 'شركة ABC للتجارة',
//       amount: 2500.00,
//       date: '2024-03-15'
//     },
//     {
//       id: 2,
//       creditNoteNo: 'CN002',
//       operationNo: 'OP002',
//       clientName: 'XYZ Logistics',
//       clientNameAr: 'شركة XYZ للخدمات اللوجستية',
//       amount: 1850.75,
//       date: '2024-03-18'
//     },
//     {
//       id: 3,
//       creditNoteNo: 'CN003',
//       operationNo: 'OP003',
//       clientName: 'Global Shipping Ltd',
//       clientNameAr: 'شركة الشحن العالمية المحدودة',
//       amount: 3200.50,
//       date: '2024-03-20'
//     },
//     {
//       id: 4,
//       creditNoteNo: 'CN004',
//       operationNo: 'OP004',
//       clientName: 'Emirates Freight',
//       clientNameAr: 'شركة الإمارات للشحن',
//       amount: 1675.25,
//       date: '2024-03-22'
//     },
//     {
//       id: 5,
//       creditNoteNo: 'CN005',
//       operationNo: 'OP005',
//       clientName: 'Dubai Cargo Services',
//       clientNameAr: 'خدمات دبي للشحن',
//       amount: 2890.00,
//       date: '2024-03-25'
//     }
//   ]);

//   const handleSearch = () => {
//     if (!searchTerm.trim()) return;
//     console.log('Searching for credit note:', searchTerm);
//   };

//   const handleViewCreditNote = (creditNote) => {
//     console.log('Viewing credit note:', creditNote);
//   };

//   const filteredCreditNotes = creditNotes.filter(creditNote => 
//     creditNote.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     creditNote.creditNoteNo?.includes(searchTerm) ||
//     creditNote.operationNo?.includes(searchTerm)
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Main Title */}
//       <div className="mb-8">
//         <h1 className="text-center text-white text-xl font-bold py-3 bg-slate-700 rounded-t-lg mx-auto max-w-6xl">
//           CREDIT NOTE SEARCH
//         </h1>
//       </div>

//       {/* Main Container */}
//       <div className="max-w-6xl mx-auto flex gap-5">
//         {/* Left Panel - Search */}
//         <div className="w-96 bg-white border border-gray-200 rounded-lg shadow-lg">
//           {/* Search Panel Header */}
//           <div className="bg-slate-700 text-white text-sm font-semibold py-3 px-4 rounded-t-lg">
//             CREDIT NOTE SEARCH
//           </div>
          
//           {/* Search Content */}
//           <div className="p-5">
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               CREDIT NOTE NO <span className="text-blue-600">*</span>
//             </label>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:outline-none transition-colors"
//                 placeholder="Enter Credit Note No"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//               />
//               <button 
//                 className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition-all hover:shadow-lg active:transform active:translate-y-0"
//                 onClick={handleSearch}
//               >
//                 <Search size={16} />
//                 Search
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Right Panel - Results */}
//         <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-lg">
//           {/* Results Panel Header */}
//           <div className="bg-slate-700 text-white text-sm font-semibold py-3 px-4 rounded-t-lg">
//             CREDIT NOTE LIST
//           </div>
          
//           {/* Table Container */}
//           <div className="overflow-x-auto">
//             {filteredCreditNotes.length > 0 ? (
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-50 border-b border-gray-200">
//                     <th className="py-3 px-4 text-left font-semibold text-gray-700 uppercase tracking-wider text-xs w-16">SL</th>
//                     <th className="py-3 px-4 text-left font-semibold text-gray-700 uppercase tracking-wider text-xs w-32">CREDIT NOTE NO</th>
//                     <th className="py-3 px-4 text-left font-semibold text-gray-700 uppercase tracking-wider text-xs w-28">OPERATION NO</th>
//                     <th className="py-3 px-4 text-left font-semibold text-gray-700 uppercase tracking-wider text-xs">CLIENT INFORMATION</th>
//                     <th className="py-3 px-4 text-right font-semibold text-gray-700 uppercase tracking-wider text-xs w-24">AMOUNT</th>
//                     <th className="py-3 px-4 text-left font-semibold text-gray-700 uppercase tracking-wider text-xs w-24">DATE</th>
//                     <th className="py-3 px-4 text-center font-semibold text-gray-700 uppercase tracking-wider text-xs w-16">GO</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredCreditNotes.map((creditNote, index) => (
//                     <tr key={creditNote.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
//                       <td className="py-3 px-4 text-center text-gray-900">{index + 1}</td>
//                       <td className="py-3 px-4 font-bold text-gray-900">{creditNote.creditNoteNo}</td>
//                       <td className="py-3 px-4 text-gray-900">{creditNote.operationNo}</td>
//                       <td className="py-3 px-4">
//                         <div className="leading-tight">
//                           <div className="font-semibold text-gray-900 mb-1">{creditNote.clientName}</div>
//                           <div className="text-xs text-gray-500 italic" style={{direction: 'rtl'}}>{creditNote.clientNameAr}</div>
//                         </div>
//                       </td>
//                       <td className="py-3 px-4 text-right font-bold text-gray-900">${creditNote.amount.toFixed(2)}</td>
//                       <td className="py-3 px-4 text-gray-900">{creditNote.date}</td>
//                       <td className="py-3 px-4 text-center">
//                         <button 
//                           className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all hover:shadow-lg active:transform active:translate-y-0"
//                           onClick={() => handleViewCreditNote(creditNote)}
//                           title="View Credit Note"
//                         >
//                           <ArrowRight size={16} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <div className="text-center py-12 px-6 text-gray-500">
//                 <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
//                   <Search size={24} className="text-blue-600" />
//                 </div>
//                 <div className="text-base font-medium mb-2 text-gray-700">No Credit Notes Found</div>
//                 <div className="text-sm text-gray-500">
//                   {searchTerm ? 'Try adjusting your search criteria' : 'Enter a credit note number to search'}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreditNoteSearch;

import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

const CreditNotePage = () => {
  // Sample initial data for credit notes
  const initialCreditNotes = [
    {
      id: 1,
      creditNoteNo: 'CN001',
      operationNo: 'OP001',
      clientName: 'ABC Trading Company',
      clientNameAr: 'شركة ABC للتجارة',
      amount: 2500.0,
      date: '2024-03-15',
    },
    {
      id: 2,
      creditNoteNo: 'CN002',
      operationNo: 'OP002',
      clientName: 'XYZ Logistics',
      clientNameAr: 'شركة XYZ للخدمات اللوجستية',
      amount: 1850.75,
      date: '2024-03-18',
    },
    {
      id: 3,
      creditNoteNo: 'CN003',
      operationNo: 'OP003',
      clientName: 'Global Shipping Ltd',
      clientNameAr: 'شركة الشحن العالمية المحدودة',
      amount: 3200.5,
      date: '2024-03-20',
    },
    {
      id: 4,
      creditNoteNo: 'CN004',
      operationNo: 'OP004',
      clientName: 'Emirates Freight',
      clientNameAr: 'شركة الإمارات للشحن',
      amount: 1675.25,
      date: '2024-03-22',
    },
    {
      id: 5,
      creditNoteNo: 'CN005',
      operationNo: 'OP005',
      clientName: 'Dubai Cargo Services',
      clientNameAr: 'خدمات دبي للشحن',
      amount: 2890.0,
      date: '2024-03-25',
    },
  ];

  // State variables
  const [creditNotes, setCreditNotes] = useState(initialCreditNotes);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCreditNote, setNewCreditNote] = useState({
    creditNoteNo: '',
    operationNo: '',
    clientName: '',
    clientNameAr: '',
    amount: '',
    date: '',
  });

  // Sorting and pagination state
  const [sortField, setSortField] = useState('creditNoteNo');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Handle search resets pagination as you type (or you could trigger on Enter)
  const handleSearch = () => setCurrentPage(1);

  // Add or update credit note
  const handleAddCreditNote = () => {
    // Require credit note number and amount for this example
    if (!newCreditNote.creditNoteNo.trim() || !newCreditNote.amount.toString().trim())
      return;

    if (editingId) {
      // Update the existing credit note
      const updatedNotes = creditNotes.map((note) =>
        note.id === editingId
          ? { ...note, ...newCreditNote, amount: parseFloat(newCreditNote.amount) }
          : note
      );
      setCreditNotes(updatedNotes);
    } else {
      // Add a new credit note with a new id
      const newId = creditNotes.length ? Math.max(...creditNotes.map((n) => n.id)) + 1 : 1;
      setCreditNotes([
        ...creditNotes,
        { id: newId, ...newCreditNote, amount: parseFloat(newCreditNote.amount) },
      ]);
    }
    // Reset form and close add/edit mode
    setNewCreditNote({
      creditNoteNo: '',
      operationNo: '',
      clientName: '',
      clientNameAr: '',
      amount: '',
      date: '',
    });
    setEditingId(null);
    setIsAdding(false);
  };

  // Delete a credit note
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this credit note?')) return;
    setCreditNotes(creditNotes.filter((note) => note.id !== id));
  };

  // Populate the form for editing
  const handleEdit = (note) => {
    setNewCreditNote({
      creditNoteNo: note.creditNoteNo,
      operationNo: note.operationNo,
      clientName: note.clientName,
      clientNameAr: note.clientNameAr,
      amount: note.amount,
      date: note.date,
    });
    setEditingId(note.id);
    setIsAdding(true);
  };

  // Update sort state for the table
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Apply sorting and filtering based on search term
  const sortedCreditNotes = [...creditNotes].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredCreditNotes = sortedCreditNotes.filter((note) =>
    note.creditNoteNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.operationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCreditNotes = filteredCreditNotes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCreditNotes.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <ClipboardList className="w-8 h-8 mr-3 text-indigo-600" />
              CREDIT NOTES
            </h1>
            <p className="text-gray-600 mt-2">Manage credit notes for your business</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search credit notes..."
                  className="bg-transparent outline-none w-40"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch();
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <button
              onClick={() => {
                setIsAdding(!isAdding);
                setEditingId(null);
                setNewCreditNote({
                  creditNoteNo: '',
                  operationNo: '',
                  clientName: '',
                  clientNameAr: '',
                  amount: '',
                  date: '',
                });
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
                  Add Credit Note
                </>
              )}
            </button>
          </div>
        </div>

        {/* Add/Edit Credit Note Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <ClipboardList className="w-5 h-5 mr-2" />
                {editingId ? 'Edit Credit Note' : 'Add Credit Note'}
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credit Note No <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter Credit Note No"
                        className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={newCreditNote.creditNoteNo}
                        onChange={(e) =>
                          setNewCreditNote({ ...newCreditNote, creditNoteNo: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Operation No
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Operation No"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={newCreditNote.operationNo}
                      onChange={(e) =>
                        setNewCreditNote({ ...newCreditNote, operationNo: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Client Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={newCreditNote.clientName}
                      onChange={(e) =>
                        setNewCreditNote({ ...newCreditNote, clientName: e.target.value })
                      }
                    />
                  </div>
                </div>
                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name (Arabic)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Client Name in Arabic"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={newCreditNote.clientNameAr}
                      onChange={(e) =>
                        setNewCreditNote({ ...newCreditNote, clientNameAr: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter Amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={newCreditNote.amount}
                      onChange={(e) =>
                        setNewCreditNote({ ...newCreditNote, amount: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={newCreditNote.date}
                      onChange={(e) =>
                        setNewCreditNote({ ...newCreditNote, date: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleAddCreditNote}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
                >
                  {editingId ? 'Update Credit Note' : 'Add Credit Note'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Credit Notes Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-indigo-600 text-white text-sm font-semibold">
              <tr>
                {[
                  { label: 'SL', key: 'sl', noSort: true },
                  { label: 'Credit Note No', key: 'creditNoteNo' },
                  { label: 'Operation No', key: 'operationNo' },
                  { label: 'Client Name', key: 'clientName' },
                  { label: 'Amount', key: 'amount' },
                  { label: 'Date', key: 'date' },
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
                        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentCreditNotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No credit notes found.
                  </td>
                </tr>
              ) : (
                currentCreditNotes.map((note, index) => (
                  <tr key={note.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-center text-gray-900">{index + 1 + indexOfFirstItem}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{note.creditNoteNo}</td>
                    <td className="px-4 py-3 text-gray-900">{note.operationNo}</td>
                    <td className="px-4 py-3">
                      <div className="leading-tight">
                        <div className="font-semibold text-gray-900 mb-1">{note.clientName}</div>
                        <div className="text-xs text-gray-500 italic" style={{ direction: 'rtl' }}>
                          {note.clientNameAr}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">${note.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-900">{note.date}</td>
                    <td className="px-4 py-3 flex space-x-3">
                      <button
                        onClick={() => handleEdit(note)}
                        title="Edit"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
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
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCreditNotes.length)} of {filteredCreditNotes.length} results
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

export default CreditNotePage;