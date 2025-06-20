import React, { useState, useEffect, useRef } from 'react';
import { Search, Download, Printer, Trash2 } from 'lucide-react';

// Auth header function, using localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Authentication token missing');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const API_URL = 'http://localhost:5000/api/supplier-assignments/';

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
  const [activeTab, setActiveTab] = useState('supplier');
  const [searchParams, setSearchParams] = useState({
    supplierName: '',
    jobNo: '',
    fromDate: '',
    toDate: ''
  });

  const [allPurchases, setAllPurchases] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(true);

  const printRef = useRef();

  // Fetch all purchases from backend on mount
  useEffect(() => {
    setLoading(true);
    let isMounted = true;
    fetch(API_URL, { headers: getAuthHeaders() })
      .then(res => {
        if (res.status === 401) {
          throw new Error('Unauthorized (401) - Check your authentication!');
        }
        return res.json();
      })
      .then(data => {
        if (!isMounted) return;
        if (data && data.data) {
          setAllPurchases(data.data);
          setSearchResults(data.data); // Show all by default
        } else {
          setAllPurchases([]);
          setSearchResults([]);
        }
        setLoading(false);
      })
      .catch(err => {
        if (!isMounted) return;
        setAllPurchases([]);
        setSearchResults([]);
        setLoading(false);
        alert(err.message);
      });
    return () => { isMounted = false; };
  }, []);

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  // Search/filter logic: filter allPurchases based on searchParams
  const handleSearch = (searchType) => {
    let results = allPurchases;
    setHasSearched(true);

    if (searchType === 'supplier' && searchParams.supplierName.trim()) {
      const searchValue = searchParams.supplierName.trim().toLowerCase();
      results = results.filter(p =>
        (p.supplier_name || '').toLowerCase().includes(searchValue)
      );
    } else if (searchType === 'job' && searchParams.jobNo.trim()) {
      const searchValue = searchParams.jobNo.trim().toLowerCase();
      results = results.filter(p =>
        (p.job_number || '').toLowerCase().includes(searchValue)
      );
    } else if (searchType === 'date' && searchParams.fromDate && searchParams.toDate) {
      const from = new Date(searchParams.fromDate);
      const to = new Date(searchParams.toDate);
      results = results.filter(p => {
        const date = new Date(p.invoice_date);
        return date >= from && date <= to;
      });
    }
    // If no search, show all
    setSearchResults(results);
  };

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-semibold text-sm transition-colors rounded-t-lg border-b-2 ${
        isActive
          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-600 shadow'
          : 'bg-gray-100 text-gray-700 border-transparent hover:bg-indigo-50'
      }`}
      type="button"
    >
      {label}
    </button>
  );

  const SearchButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow"
      type="button"
    >
      <Search size={18} />
      Search
    </button>
  );

  // Print handler - prints only the table
  const handlePrint = () => {
    // Prepare data to print as a table
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
  
    // Use the current searchResults data
    const rows = searchResults.map((item, idx) => [
      idx + 1,
      item.job_number,
      item.supplier_name,
      item.supplier_invoice_no,
      item.invoice_date ? item.invoice_date.substring(0, 10) : '',
      formatNumber(item.total_amount),
      formatNumber(item.vat_amount),
      formatNumber(item.bill_total_with_vat)
    ]);
  
    // Build the HTML table
    const tableHTML = `
      <table>
        <thead>
          <tr>
            ${headers.map(h => `<th>${h}</th>`).join('')}
          </tr>
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
  
    // Print header info: filters and date
    const searchSummary = `
      <div style="
        margin-bottom: 1.2em;
        padding-bottom: 0.5em;
        border-bottom: 2px solid #6366f1;
      ">
        <div style="
          font-size: 2em;
          font-weight: 700;
          color: #312e81;
          margin-bottom: 0.15em;
          letter-spacing: 0.01em;
        ">
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
  
    // Open the print window and write the content
    const mywindow = window.open('', '', 'width=1100,height=800');
    mywindow.document.write(`
      <html>
        <head>
          <title>Purchase Search Print</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: #fff;
              color: #22223b;
              padding: 32px 24px 24px 24px;
              font-size: 15px;
            }
            @media print {
              body { background: none; padding: 0; }
            }
            h1, h2, h3, h4 { color: #3730a3; margin-bottom: 0.7em; }
            table {
              border-collapse: collapse;
              width: 100%;
              background: #fff;
              margin-bottom: 1.1em;
              font-size: 1em;
            }
            th, td {
              border: 1px solid #e5e7eb;
              padding: 9px 10px;
              vertical-align: middle;
            }
            th {
              background: #6366f1;
              color: #fff;
              font-weight: 700;
              font-size: 1em;
              border-bottom: 3px solid #a5b4fc;
              letter-spacing: 0.04em;
            }
            tr:nth-child(even) { background: #f3f4f6; }
            tr:nth-child(odd) { background: #fff; }
            tr:hover { background: #e0e7ff; }
            td.text-right, th.text-right { text-align: right; }
            td.text-center, th.text-center { text-align: center; }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fafd] via-white to-indigo-50 py-10 px-2 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-800 via-indigo-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3 drop-shadow-sm">
            <Search className="w-8 h-8 mr-2 text-indigo-700" />
            Purchase Search
          </h1>
          <p className="text-gray-600 mt-2 font-medium">Find purchases by supplier, job number, or date range</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6 border-b-2 border-indigo-100">
          <TabButton
            id="supplier"
            label="Search By Supplier Name"
            isActive={activeTab === 'supplier'}
            onClick={() => setActiveTab('supplier')}
          />
          <TabButton
            id="job"
            label="Search By Job No"
            isActive={activeTab === 'job'}
            onClick={() => setActiveTab('job')}
          />
          <TabButton
            id="date"
            label="Search By Date"
            isActive={activeTab === 'date'}
            onClick={() => setActiveTab('date')}
          />
        </div>

        {/* Search Forms */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 mb-8 shadow">
          {/* Supplier Name Search */}
          {activeTab === 'supplier' && (
            <div className="flex flex-col md:flex-row items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Supplier Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Supplier Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 shadow"
                  value={searchParams.supplierName}
                  onChange={(e) => handleInputChange('supplierName', e.target.value)}
                />
              </div>
              <SearchButton onClick={() => handleSearch('supplier')} />
            </div>
          )}

          {/* Job No Search */}
          {activeTab === 'job' && (
            <div className="flex flex-col md:flex-row items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job No <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Job No"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 shadow"
                  value={searchParams.jobNo}
                  onChange={(e) => handleInputChange('jobNo', e.target.value)}
                />
              </div>
              <SearchButton onClick={() => handleSearch('job')} />
            </div>
          )}

          {/* Date Range Search */}
          {activeTab === 'date' && (
            <div className="flex flex-col md:flex-row items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  From Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  placeholder="From Date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 shadow"
                  value={searchParams.fromDate}
                  onChange={(e) => handleInputChange('fromDate', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  To Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  placeholder="To Date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 shadow"
                  value={searchParams.toDate}
                  onChange={(e) => handleInputChange('toDate', e.target.value)}
                />
              </div>
              <SearchButton onClick={() => handleSearch('date')} />
            </div>
          )}
        </div>

        {/* Results Table */}
        <div ref={printRef} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 print:bg-indigo-600">
            <div className="grid grid-cols-8 gap-4 text-sm font-bold text-white">
              <div>SL.No</div>
              <div>Job Number</div>
              <div>Supplier Name</div>
              <div>Invoice No</div>
              <div>Invoice Date</div>
              <div className="text-right">Bill Amt<br className="hidden md:inline" />Without VAT</div>
              <div className="text-right">VAT Amount</div>
              <div className="text-right">Bill Amount</div>
            </div>
          </div>
          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="text-center py-10 text-indigo-600 font-semibold text-lg">Loading purchases...</div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-xl font-bold">No Purchase Available</div>
                <div className="text-sm mt-1">No records found matching your criteria</div>
              </div>
            ) : (
              searchResults.map((item, index) => (
                <div key={item.id || index} className="grid grid-cols-8 gap-4 px-4 py-3 hover:bg-indigo-50 transition">
                  <div className="text-sm text-indigo-900 font-semibold">{index + 1}</div>
                  <div className="text-sm text-gray-900">{item.job_number}</div>
                  <div className="text-sm text-gray-900">{item.supplier_name}</div>
                  <div className="text-sm text-gray-900">{item.supplier_invoice_no}</div>
                  <div className="text-sm text-gray-900">{item.invoice_date ? item.invoice_date.substring(0, 10) : ''}</div>
                  <div className="text-sm text-gray-900 text-right">{formatNumber(item.total_amount)}</div>
                  <div className="text-sm text-gray-900 text-right">{formatNumber(item.vat_amount)}</div>
                  <div className="text-sm text-indigo-700 text-right font-bold">{formatNumber(item.bill_total_with_vat)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row md:justify-between items-center mt-8 gap-4">
          <div className="text-sm text-gray-700 font-medium">
            {searchResults.length === 0 && !loading && 'No records found'}
            {searchResults.length > 0 && `Showing ${searchResults.length} result(s)`}
          </div>
          <div className="flex space-x-4">
            <button
              className="px-6 py-2 bg-gray-400 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all shadow flex items-center gap-2"
              onClick={() => {
                setSearchParams({ supplierName: '', jobNo: '', fromDate: '', toDate: '' });
                setSearchResults(allPurchases);
                setHasSearched(false);
              }}
              title="Clear all filters"
            >
              <Trash2 size={18} /> Clear
            </button>
            <button
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all shadow flex items-center gap-2"
              disabled={searchResults.length === 0}
              onClick={() => exportToCSV(searchResults)}
              title="Export as CSV"
            >
              <Download size={18} /> Export
            </button>
            <button
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all shadow flex items-center gap-2"
              disabled={searchResults.length === 0}
              onClick={handlePrint}
              title="Print table"
            >
              <Printer size={18} /> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSearch;