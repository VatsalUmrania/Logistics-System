import React, { useState } from 'react';
import { Search, Calendar, Printer, FileText } from 'lucide-react';

const VatStatementReport = () => {
  const [startDate, setStartDate] = useState('2024-11-01');
  const [endDate, setEndDate] = useState('2025-06-01');

  const vatStatements = [
    { id: 1, date: '2025-01-02', clientName: 'EASTERN POWER SUPPORT TRADING EST.', invoiceNo: '12395', vatAmount: 82.50 },
    { id: 2, date: '2025-01-02', clientName: 'OVERSEAS DEVELOPMENT COMPANY LIMITED', invoiceNo: '12396', vatAmount: 277.80 },
    { id: 3, date: '2025-01-05', clientName: 'PIVOT SHIPPING COMPANY LIMITED', invoiceNo: '12397', vatAmount: 67.50 },
    { id: 4, date: '2025-01-05', clientName: 'PIVOT SHIPPING COMPANY LIMITED', invoiceNo: '12398', vatAmount: 67.50 },
    { id: 5, date: '2025-01-07', clientName: 'RAISCO TRADING COMPANY', invoiceNo: '12399', vatAmount: 138.00 },
    { id: 6, date: '2025-01-10', clientName: 'GLOBAL LOGISTICS PARTNERS', invoiceNo: '12400', vatAmount: 315.00 },
    { id: 7, date: '2025-01-15', clientName: 'MIDDLE EAST TRADING LLC', invoiceNo: '12401', vatAmount: 210.25 },
    { id: 8, date: '2025-01-18', clientName: 'OCEAN FREIGHT SERVICES', invoiceNo: '12402', vatAmount: 187.60 }
  ];

  const [filteredStatements, setFilteredStatements] = useState(vatStatements);

  const handleSearch = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = vatStatements.filter((statement) => {
      const statementDate = new Date(statement.date);
      return statementDate >= start && statementDate <= end;
    });

    setFilteredStatements(filtered);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const totalVatAmount = filteredStatements.reduce((sum, statement) => sum + statement.vatAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 print:p-0">
      <div className="max-w-7xl mx-auto print:max-w-none">
        {/* Header */}
        <div className="mb-8 print:hidden">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-indigo-600" />
            VAT STATEMENT REPORT
          </h1>
          <p className="text-gray-600 mt-2">View VAT statements for your invoices</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 print:shadow-none print:border print:border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 print:bg-gray-200 print:bg-none">
            <h2 className="text-xl font-bold text-white flex items-center print:text-gray-800">
              <Search className="w-5 h-5 mr-2 print:text-gray-700" />
              Search by Date
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-green-700 transition-all flex items-center justify-center shadow-md"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </button>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handlePrint}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center shadow-md print:hidden"
                >
                  <Printer className="w-5 h-5 mr-2" />
                  Print Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-200">
          <div className="p-6">
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">VAT Statement Report</h2>
                <div className="flex items-center space-x-4">
                  <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                    <p className="text-sm font-medium text-indigo-700">
                      From: {formatDate(startDate)} | To: {formatDate(endDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Client Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Invoice No.</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">VAT Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStatements.map((statement) => (
                      <tr key={statement.id} className="hover:bg-indigo-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{statement.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{statement.clientName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{statement.invoiceNo}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">${statement.vatAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-semibold">
                      <td colSpan="3" className="px-4 py-3 text-right text-sm text-gray-900">Total VAT Amount:</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">${totalVatAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">NOTE ON FCE</h3>
                    <p className="text-sm text-yellow-700 mt-2">This VAT statement report includes all VAT collected during the specified period. Please verify all amounts before submission to tax authorities.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">Generated on: {new Date().toLocaleDateString('en-GB')} at {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="text-sm text-gray-500 italic">** Report Ends **</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VatStatementReport;
