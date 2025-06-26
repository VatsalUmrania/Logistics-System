// import React, { useState, useEffect, useRef } from 'react';
// import { Search, Download, Printer, Trash2 } from 'lucide-react';

// // Auth header function, using localStorage
// const getAuthHeaders = () => {
//   const token = localStorage.getItem('authToken');
//   if (!token) throw new Error('Authentication token missing');
//   return {
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json'
//   };
// };

// const API_URL = 'http://localhost:5000/api/supplier-assignments/';

// const formatNumber = (num) => {
//   if (num === null || num === undefined || num === "") return "-";
//   return Number(num).toLocaleString(undefined, { minimumFractionDigits: 2 });
// };

// const exportToCSV = (data) => {
//   const headers = [
//     "SL.No",
//     "Job Number",
//     "Supplier Name",
//     "Invoice No",
//     "Invoice Date",
//     "Bill Amt Without VAT",
//     "VAT Amount",
//     "Bill Amount"
//   ];
//   const rows = data.map((item, idx) => [
//     idx + 1,
//     item.job_number,
//     item.supplier_name,
//     item.supplier_invoice_no,
//     item.invoice_date ? item.invoice_date.substring(0, 10) : '',
//     formatNumber(item.total_amount),
//     formatNumber(item.vat_amount),
//     formatNumber(item.bill_total_with_vat)
//   ]);
//   const content = [headers, ...rows].map(r => r.map(f => `"${String(f).replace(/"/g, '""')}"`).join(",")).join("\n");
//   const blob = new Blob([content], { type: 'text/csv' });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = `purchase-search-${new Date().toISOString().slice(0, 10)}.csv`;
//   document.body.appendChild(a);
//   a.click();
//   setTimeout(() => {
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   }, 0);
// };

// const PurchaseSearch = () => {
//   const [activeTab, setActiveTab] = useState('supplier');
//   const [searchParams, setSearchParams] = useState({
//     supplierName: '',
//     jobNo: '',
//     fromDate: '',
//     toDate: ''
//   });

//   const [allPurchases, setAllPurchases] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [hasSearched, setHasSearched] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const printRef = useRef();

//   // Fetch all purchases from backend on mount
//   useEffect(() => {
//     setLoading(true);
//     let isMounted = true;
//     fetch(API_URL, { headers: getAuthHeaders() })
//       .then(res => {
//         if (res.status === 401) {
//           throw new Error('Unauthorized (401) - Check your authentication!');
//         }
//         return res.json();
//       })
//       .then(data => {
//         if (!isMounted) return;
//         if (data && data.data) {
//           setAllPurchases(data.data);
//           setSearchResults(data.data); // Show all by default
//         } else {
//           setAllPurchases([]);
//           setSearchResults([]);
//         }
//         setLoading(false);
//       })
//       .catch(err => {
//         if (!isMounted) return;
//         setAllPurchases([]);
//         setSearchResults([]);
//         setLoading(false);
//         alert(err.message);
//       });
//     return () => { isMounted = false; };
//   }, []);

//   const handleInputChange = (field, value) => {
//     setSearchParams(prev => ({ ...prev, [field]: value }));
//   };

//   // Search/filter logic: filter allPurchases based on searchParams
//   const handleSearch = (searchType) => {
//     let results = allPurchases;
//     setHasSearched(true);

//     if (searchType === 'supplier' && searchParams.supplierName.trim()) {
//       const searchValue = searchParams.supplierName.trim().toLowerCase();
//       results = results.filter(p =>
//         (p.supplier_name || '').toLowerCase().includes(searchValue)
//       );
//     } else if (searchType === 'job' && searchParams.jobNo.trim()) {
//       const searchValue = searchParams.jobNo.trim().toLowerCase();
//       results = results.filter(p =>
//         (p.job_number || '').toLowerCase().includes(searchValue)
//       );
//     } else if (searchType === 'date' && searchParams.fromDate && searchParams.toDate) {
//       const from = new Date(searchParams.fromDate);
//       const to = new Date(searchParams.toDate);
//       results = results.filter(p => {
//         const date = new Date(p.invoice_date);
//         return date >= from && date <= to;
//       });
//     }
//     // If no search, show all
//     setSearchResults(results);
//   };

//   const TabButton = ({ id, label, isActive, onClick }) => (
//     <button
//       onClick={onClick}
//       className={`px-6 py-3 font-semibold text-sm transition-colors rounded-t-lg border-b-2 ${
//         isActive
//           ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-600 shadow'
//           : 'bg-gray-100 text-gray-700 border-transparent hover:bg-indigo-50'
//       }`}
//       type="button"
//     >
//       {label}
//     </button>
//   );

//   const SearchButton = ({ onClick }) => (
//     <button
//       onClick={onClick}
//       className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow"
//       type="button"
//     >
//       <Search size={18} />
//       Search
//     </button>
//   );

//   // Print handler - prints only the table
//   const handlePrint = () => {
//     // Prepare data to print as a table
//     const headers = [
//       "SL.No",
//       "Job Number",
//       "Supplier Name",
//       "Invoice No",
//       "Invoice Date",
//       "Bill Amt Without VAT",
//       "VAT Amount",
//       "Bill Amount"
//     ];
  
//     // Use the current searchResults data
//     const rows = searchResults.map((item, idx) => [
//       idx + 1,
//       item.job_number,
//       item.supplier_name,
//       item.supplier_invoice_no,
//       item.invoice_date ? item.invoice_date.substring(0, 10) : '',
//       formatNumber(item.total_amount),
//       formatNumber(item.vat_amount),
//       formatNumber(item.bill_total_with_vat)
//     ]);
  
//     // Build the HTML table
//     const tableHTML = `
//       <table>
//         <thead>
//           <tr>
//             ${headers.map(h => `<th>${h}</th>`).join('')}
//           </tr>
//         </thead>
//         <tbody>
//           ${rows.map((row, i) =>
//             `<tr${i % 2 === 1 ? ' style="background:#f3f4f6;"' : ''}>
//               ${row.map((cell, j) =>
//                 `<td style="text-align:${j >= 5 ? 'right' : 'left'}">${cell}</td>`
//               ).join('')}
//             </tr>`
//           ).join('')}
//         </tbody>
//       </table>
//     `;
  
//     // Print header info: filters and date
//     const searchSummary = `
//       <div style="
//         margin-bottom: 1.2em;
//         padding-bottom: 0.5em;
//         border-bottom: 2px solid #6366f1;
//       ">
//         <div style="
//           font-size: 2em;
//           font-weight: 700;
//           color: #312e81;
//           margin-bottom: 0.15em;
//           letter-spacing: 0.01em;
//         ">
//           Purchase Search Results
//         </div>
//         <div style="font-size:1.09em; color:#374151;">
//           ${searchParams.supplierName ? `<span style="margin-right:1.3em;">Supplier: <b>${searchParams.supplierName}</b></span>` : ''}
//           ${searchParams.jobNo ? `<span style="margin-right:1.3em;">Job No: <b>${searchParams.jobNo}</b></span>` : ''}
//           ${searchParams.fromDate || searchParams.toDate ? `<span>Date: <b>${searchParams.fromDate || '---'} to ${searchParams.toDate || '---'}</b></span>` : ''}
//         </div>
//         <div style="margin-top:0.6em; font-size:0.97em; color:#64748b;">
//           Printed on: ${new Date().toLocaleString()}
//         </div>
//       </div>
//     `;
  
//     // Open the print window and write the content
//     const mywindow = window.open('', '', 'width=1100,height=800');
//     mywindow.document.write(`
//       <html>
//         <head>
//           <title>Purchase Search Print</title>
//           <style>
//             body {
//               font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//               background: #fff;
//               color: #22223b;
//               padding: 32px 24px 24px 24px;
//               font-size: 15px;
//             }
//             @media print {
//               body { background: none; padding: 0; }
//             }
//             h1, h2, h3, h4 { color: #3730a3; margin-bottom: 0.7em; }
//             table {
//               border-collapse: collapse;
//               width: 100%;
//               background: #fff;
//               margin-bottom: 1.1em;
//               font-size: 1em;
//             }
//             th, td {
//               border: 1px solid #e5e7eb;
//               padding: 9px 10px;
//               vertical-align: middle;
//             }
//             th {
//               background: #6366f1;
//               color: #fff;
//               font-weight: 700;
//               font-size: 1em;
//               border-bottom: 3px solid #a5b4fc;
//               letter-spacing: 0.04em;
//             }
//             tr:nth-child(even) { background: #f3f4f6; }
//             tr:nth-child(odd) { background: #fff; }
//             tr:hover { background: #e0e7ff; }
//             td.text-right, th.text-right { text-align: right; }
//             td.text-center, th.text-center { text-align: center; }
//           </style>
//         </head>
//         <body>
//           ${searchSummary}
//           ${tableHTML}
//         </body>
//       </html>
//     `);
//     mywindow.document.close();
//     mywindow.focus();
//     mywindow.print();
//     setTimeout(() => mywindow.close(), 500);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#f7fafd] via-white to-indigo-50 py-10 px-2 md:px-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-10">
//           <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-800 via-indigo-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3 drop-shadow-sm">
//             <Search className="w-8 h-8 mr-2 text-indigo-700" />
//             Purchase Search
//           </h1>
//           <p className="text-gray-600 mt-2 font-medium">Find purchases by supplier, job number, or date range</p>
//         </div>

//         {/* Tab Navigation */}
//         <div className="flex space-x-2 mb-6 border-b-2 border-indigo-100">
//           <TabButton
//             id="supplier"
//             label="Search By Supplier Name"
//             isActive={activeTab === 'supplier'}
//             onClick={() => setActiveTab('supplier')}
//           />
//           <TabButton
//             id="job"
//             label="Search By Job No"
//             isActive={activeTab === 'job'}
//             onClick={() => setActiveTab('job')}
//           />
//           <TabButton
//             id="date"
//             label="Search By Date"
//             isActive={activeTab === 'date'}
//             onClick={() => setActiveTab('date')}
//           />
//         </div>

//         {/* Search Forms */}
//         <div className="bg-white p-8 rounded-2xl border border-gray-200 mb-8 shadow">
//           {/* Supplier Name Search */}
//           {activeTab === 'supplier' && (
//             <div className="flex flex-col md:flex-row items-end gap-4">
//               <div className="flex-1">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Supplier Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Supplier Name"
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 shadow"
//                   value={searchParams.supplierName}
//                   onChange={(e) => handleInputChange('supplierName', e.target.value)}
//                 />
//               </div>
//               <SearchButton onClick={() => handleSearch('supplier')} />
//             </div>
//           )}

//           {/* Job No Search */}
//           {activeTab === 'job' && (
//             <div className="flex flex-col md:flex-row items-end gap-4">
//               <div className="flex-1">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Job No <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Job No"
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 shadow"
//                   value={searchParams.jobNo}
//                   onChange={(e) => handleInputChange('jobNo', e.target.value)}
//                 />
//               </div>
//               <SearchButton onClick={() => handleSearch('job')} />
//             </div>
//           )}

//           {/* Date Range Search */}
//           {activeTab === 'date' && (
//             <div className="flex flex-col md:flex-row items-end gap-4">
//               <div className="flex-1">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   From Date <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   placeholder="From Date"
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 shadow"
//                   value={searchParams.fromDate}
//                   onChange={(e) => handleInputChange('fromDate', e.target.value)}
//                 />
//               </div>
//               <div className="flex-1">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   To Date <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   placeholder="To Date"
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 shadow"
//                   value={searchParams.toDate}
//                   onChange={(e) => handleInputChange('toDate', e.target.value)}
//                 />
//               </div>
//               <SearchButton onClick={() => handleSearch('date')} />
//             </div>
//           )}
//         </div>

//         {/* Results Table */}
//         <div ref={printRef} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
//           {/* Table Header */}
//           <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 print:bg-indigo-600">
//             <div className="grid grid-cols-8 gap-4 text-sm font-bold text-white">
//               <div>SL.No</div>
//               <div>Job Number</div>
//               <div>Supplier Name</div>
//               <div>Invoice No</div>
//               <div>Invoice Date</div>
//               <div className="text-right">Bill Amt<br className="hidden md:inline" />Without VAT</div>
//               <div className="text-right">VAT Amount</div>
//               <div className="text-right">Bill Amount</div>
//             </div>
//           </div>
//           {/* Table Body */}
//           <div className="divide-y divide-gray-100">
//             {loading ? (
//               <div className="text-center py-10 text-indigo-600 font-semibold text-lg">Loading purchases...</div>
//             ) : searchResults.length === 0 ? (
//               <div className="text-center py-12 text-gray-500">
//                 <div className="text-xl font-bold">No Purchase Available</div>
//                 <div className="text-sm mt-1">No records found matching your criteria</div>
//               </div>
//             ) : (
//               searchResults.map((item, index) => (
//                 <div key={item.id || index} className="grid grid-cols-8 gap-4 px-4 py-3 hover:bg-indigo-50 transition">
//                   <div className="text-sm text-indigo-900 font-semibold">{index + 1}</div>
//                   <div className="text-sm text-gray-900">{item.job_number}</div>
//                   <div className="text-sm text-gray-900">{item.supplier_name}</div>
//                   <div className="text-sm text-gray-900">{item.supplier_invoice_no}</div>
//                   <div className="text-sm text-gray-900">{item.invoice_date ? item.invoice_date.substring(0, 10) : ''}</div>
//                   <div className="text-sm text-gray-900 text-right">{formatNumber(item.total_amount)}</div>
//                   <div className="text-sm text-gray-900 text-right">{formatNumber(item.vat_amount)}</div>
//                   <div className="text-sm text-indigo-700 text-right font-bold">{formatNumber(item.bill_total_with_vat)}</div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col md:flex-row md:justify-between items-center mt-8 gap-4">
//           <div className="text-sm text-gray-700 font-medium">
//             {searchResults.length === 0 && !loading && 'No records found'}
//             {searchResults.length > 0 && `Showing ${searchResults.length} result(s)`}
//           </div>
//           <div className="flex space-x-4">
//             <button
//               className="px-6 py-2 bg-gray-400 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all shadow flex items-center gap-2"
//               onClick={() => {
//                 setSearchParams({ supplierName: '', jobNo: '', fromDate: '', toDate: '' });
//                 setSearchResults(allPurchases);
//                 setHasSearched(false);
//               }}
//               title="Clear all filters"
//             >
//               <Trash2 size={18} /> Clear
//             </button>
//             <button
//               className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all shadow flex items-center gap-2"
//               disabled={searchResults.length === 0}
//               onClick={() => exportToCSV(searchResults)}
//               title="Export as CSV"
//             >
//               <Download size={18} /> Export
//             </button>
//             <button
//               className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all shadow flex items-center gap-2"
//               disabled={searchResults.length === 0}
//               onClick={handlePrint}
//               title="Print table"
//             >
//               <Printer size={18} /> Print
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PurchaseSearch;

import React, { useState, useEffect } from 'react';
import { 
  Search, Download, Printer, Trash2, ChevronLeft, ChevronRight, X,
  ArrowUp, ArrowDown, Loader, Check, AlertCircle as Alert, FileText
} from 'lucide-react';
import Select from 'react-select';

// Auth header function
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Authentication token missing');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const API_URL = 'http://localhost:5000/api/supplier-assignments/';
const PAGE_SIZE = 10;

const formatNumber = (num) => {
  if (num === null || num === undefined || num === "") return "-";
  return Number(num).toLocaleString(undefined, { minimumFractionDigits: 2 });
};

const exportToCSV = (data) => {
  const headers = [
    "SL.No",
    "Job Number",
    "Supplier Name",
    "Invoice No",
    "Invoice Date",
    "Bill Amt Without VAT",
    "VAT Amount",
    "Bill Amount"
  ];
  const rows = data.map((item, idx) => [
    idx + 1,
    item.job_number,
    item.supplier_name,
    item.supplier_invoice_no,
    item.invoice_date ? item.invoice_date.substring(0, 10) : '',
    formatNumber(item.total_amount),
    formatNumber(item.vat_amount),
    formatNumber(item.bill_total_with_vat)
  ]);
  const content = [headers, ...rows].map(r => r.map(f => `"${String(f).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `purchase-search-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
};

const PurchaseSearch = () => {
  // State management
  const [searchParams, setSearchParams] = useState({
    supplierName: '',
    jobNo: '',
    fromDate: '',
    toDate: ''
  });
  const [allPurchases, setAllPurchases] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('job_number');
  const [sortOrder, setSortOrder] = useState('asc');
  const [suppliers, setSuppliers] = useState([]);
  const [jobNumbers, setJobNumbers] = useState([]);

  // Custom styles for react-select dropdowns (matching AssignExpenses)
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

  // Fetch all purchases and related data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch purchases
        const purchasesRes = await fetch(API_URL, { headers: getAuthHeaders() });
        if (purchasesRes.status === 401) {
          throw new Error('Unauthorized (401) - Check your authentication!');
        }
        const purchasesData = await purchasesRes.json();
        const purchases = purchasesData?.data || [];
        setAllPurchases(purchases);
        setSearchResults(purchases);

        // Extract unique suppliers and job numbers for dropdowns
        const uniqueSuppliers = [...new Set(purchases.map(p => p.supplier_name).filter(Boolean))];
        const uniqueJobNumbers = [...new Set(purchases.map(p => p.job_number).filter(Boolean))];
        
        setSuppliers(uniqueSuppliers.map(name => ({ value: name, label: name })));
        setJobNumbers(uniqueJobNumbers.map(job => ({ value: job, label: job })));
        
      } catch (err) {
        setError(err.message);
        setAllPurchases([]);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccessMessage('');
  };

  // Search/filter logic
  const handleSearch = () => {
    let results = allPurchases;
    setHasSearched(true);
    setError('');

    // Apply filters
    if (searchParams.supplierName.trim()) {
      const searchValue = searchParams.supplierName.trim().toLowerCase();
      results = results.filter(p =>
        (p.supplier_name || '').toLowerCase().includes(searchValue)
      );
    }

    if (searchParams.jobNo.trim()) {
      const searchValue = searchParams.jobNo.trim().toLowerCase();
      results = results.filter(p =>
        (p.job_number || '').toLowerCase().includes(searchValue)
      );
    }

    if (searchParams.fromDate && searchParams.toDate) {
      const from = new Date(searchParams.fromDate);
      const to = new Date(searchParams.toDate);
      results = results.filter(p => {
        const date = new Date(p.invoice_date);
        return date >= from && date <= to;
      });
    }

    setSearchResults(results);
    setCurrentPage(1);
    setSuccessMessage(`Found ${results.length} purchase record(s)`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleClear = () => {
    setSearchParams({ supplierName: '', jobNo: '', fromDate: '', toDate: '' });
    setSearchResults(allPurchases);
    setHasSearched(false);
    setCurrentPage(1);
    setError('');
    setSuccessMessage('');
  };

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

  // Sorting and pagination
  const sortedResults = [...searchResults].sort((a, b) => {
    let valA, valB;
    if (sortColumn === 'invoice_date') {
      valA = new Date(a.invoice_date || 0);
      valB = new Date(b.invoice_date || 0);
    } else if (sortColumn === 'total_amount' || sortColumn === 'vat_amount' || sortColumn === 'bill_total_with_vat') {
      valA = parseFloat(a[sortColumn]) || 0;
      valB = parseFloat(b[sortColumn]) || 0;
    } else {
      valA = a[sortColumn] ? a[sortColumn].toLowerCase() : '';
      valB = b[sortColumn] ? b[sortColumn].toLowerCase() : '';
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedResults.length / PAGE_SIZE);
  const paginatedResults = sortedResults.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Print handler
  const handlePrint = () => {
    const headers = [
      "SL.No", "Job Number", "Supplier Name", "Invoice No", "Invoice Date",
      "Bill Amt Without VAT", "VAT Amount", "Bill Amount"
    ];

    const rows = sortedResults.map((item, idx) => [
      idx + 1, item.job_number, item.supplier_name, item.supplier_invoice_no,
      item.invoice_date ? item.invoice_date.substring(0, 10) : '',
      formatNumber(item.total_amount), formatNumber(item.vat_amount), formatNumber(item.bill_total_with_vat)
    ]);

    const tableHTML = `
      <table>
        <thead>
          <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map((row, i) =>
            `<tr${i % 2 === 1 ? ' style="background:#f3f4f6;"' : ''}>
              ${row.map((cell, j) =>
                `<td style="text-align:${j >= 5 ? 'right' : 'left'}">${cell}</td>`
              ).join('')}
            </tr>`
          ).join('')}
        </tbody>
      </table>
    `;

    const searchSummary = `
      <div style="margin-bottom: 1.2em; padding-bottom: 0.5em; border-bottom: 2px solid #6366f1;">
        <div style="font-size: 2em; font-weight: 700; color: #312e81; margin-bottom: 0.15em;">
          Purchase Search Results
        </div>
        <div style="font-size:1.09em; color:#374151;">
          ${searchParams.supplierName ? `<span style="margin-right:1.3em;">Supplier: <b>${searchParams.supplierName}</b></span>` : ''}
          ${searchParams.jobNo ? `<span style="margin-right:1.3em;">Job No: <b>${searchParams.jobNo}</b></span>` : ''}
          ${searchParams.fromDate || searchParams.toDate ? `<span>Date: <b>${searchParams.fromDate || '---'} to ${searchParams.toDate || '---'}</b></span>` : ''}
        </div>
        <div style="margin-top:0.6em; font-size:0.97em; color:#64748b;">
          Printed on: ${new Date().toLocaleString()}
        </div>
      </div>
    `;

    const mywindow = window.open('', '', 'width=1100,height=800');
    mywindow.document.write(`
      <html>
        <head>
          <title>Purchase Search Print</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; color: #22223b; padding: 32px 24px 24px 24px; font-size: 15px; }
            @media print { body { background: none; padding: 0; } }
            table { border-collapse: collapse; width: 100%; background: #fff; margin-bottom: 1.1em; font-size: 1em; }
            th, td { border: 1px solid #e5e7eb; padding: 9px 10px; vertical-align: middle; }
            th { background: #6366f1; color: #fff; font-weight: 700; font-size: 1em; border-bottom: 3px solid #a5b4fc; }
            tr:nth-child(even) { background: #f3f4f6; }
            tr:nth-child(odd) { background: #fff; }
          </style>
        </head>
        <body>
          ${searchSummary}
          ${tableHTML}
        </body>
      </html>
    `);
    mywindow.document.close();
    mywindow.focus();
    mywindow.print();
    setTimeout(() => mywindow.close(), 500);
  };

  const getTotalAmount = () => {
    return sortedResults.reduce((sum, item) => sum + parseFloat(item.bill_total_with_vat || 0), 0).toFixed(2);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchResults]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading purchase data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Matching AssignExpenses */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              Purchase Search Management
            </h1>
            <p className="text-gray-600 mt-2">Search and filter purchase records by various criteria</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={() => exportToCSV(sortedResults)}
              disabled={sortedResults.length === 0}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5 mr-2" />
              Export CSV
            </button>
            <button
              onClick={handlePrint}
              disabled={sortedResults.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print
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

        {/* Search Section - Matching AssignExpenses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEARCH PURCHASES
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Name
                </label>
                <Select
                  options={suppliers}
                  value={suppliers.find(option => option.value === searchParams.supplierName)}
                  onChange={(selectedOption) => handleInputChange('supplierName', selectedOption?.value || '')}
                  placeholder="Select Supplier"
                  isSearchable
                  isClearable
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
                  options={jobNumbers}
                  value={jobNumbers.find(option => option.value === searchParams.jobNo)}
                  onChange={(selectedOption) => handleInputChange('jobNo', selectedOption?.value || '')}
                  placeholder="Select Job Number"
                  isSearchable
                  isClearable
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={selectStyles}
                  className="w-full text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={searchParams.fromDate}
                  onChange={(e) => handleInputChange('fromDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={searchParams.toDate}
                  onChange={(e) => handleInputChange('toDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </button>
              <button
                onClick={handleSearch}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition text-sm flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Purchase Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Purchase Summary</h2>
            <div className="text-sm font-medium text-gray-700">
              Total: <span className="text-green-600 font-bold">SAR {getTotalAmount()}</span>
            </div>
          </div>
        </div>

        {/* Purchase Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'SL.No', key: null },
                    { label: 'Job Number', key: 'job_number' },
                    { label: 'Supplier Name', key: 'supplier_name' },
                    { label: 'Invoice No', key: 'supplier_invoice_no' },
                    { label: 'Invoice Date', key: 'invoice_date' },
                    { label: 'Bill Amt Without VAT', key: 'total_amount' },
                    { label: 'VAT Amount', key: 'vat_amount' },
                    { label: 'Bill Amount', key: 'bill_total_with_vat' },
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
                {paginatedResults.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                      No purchase records found
                    </td>
                  </tr>
                ) : (
                  paginatedResults.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {((currentPage - 1) * PAGE_SIZE) + index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.job_number}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.supplier_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.supplier_invoice_no}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.invoice_date ? item.invoice_date.substring(0, 10) : ''}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        SAR {formatNumber(item.total_amount)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        SAR {formatNumber(item.vat_amount)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600 text-right">
                        SAR {formatNumber(item.bill_total_with_vat)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700 mb-2 md:mb-0">
                Showing {((currentPage - 1) * PAGE_SIZE) + 1} to{' '}
                {Math.min(currentPage * PAGE_SIZE, sortedResults.length)} of {sortedResults.length} purchases
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
                    disabled={currentPage === totalPages}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseSearch;
