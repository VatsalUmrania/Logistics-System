
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