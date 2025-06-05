import React, { useState } from 'react';
import { Search, Calendar, Printer, FileText, ChevronDown } from 'lucide-react';

const InvoiceSearchByDate = () => {
  const [startDate, setStartDate] = useState('2024-10-03');
  const [endDate, setEndDate] = useState('2025-06-01');
  
  // Mock invoice data
  const invoices = [
    {
      id: 1,
      operationNo: '9919172/2024',
      clientName: 'EASTERN POWER SUPPORT TRADING EST.',
      receiptNo: '12385',
      receiptDate: '2025-01-02',
      amountWithoutVat: 550.00,
      vatAmount: 82.50,
      amountWithVat: 632.50
    },
    {
      id: 2,
      operationNo: '9919173/2024',
      clientName: 'OVERSEAS DEVELOPMENT COMPANY LIMITED',
      receiptNo: '12386',
      receiptDate: '2025-01-03',
      amountWithoutVat: 1200.00,
      vatAmount: 180.00,
      amountWithVat: 1380.00
    },
    {
      id: 3,
      operationNo: '9919174/2024',
      clientName: 'PIVOT SHIPPING COMPANY LIMITED',
      receiptNo: '12387',
      receiptDate: '2025-01-05',
      amountWithoutVat: 750.00,
      vatAmount: 112.50,
      amountWithVat: 862.50
    },
    {
      id: 4,
      operationNo: '9919175/2024',
      clientName: 'RAISCO TRADING COMPANY',
      receiptNo: '12388',
      receiptDate: '2025-01-07',
      amountWithoutVat: 920.00,
      vatAmount: 138.00,
      amountWithVat: 1058.00
    },
    {
      id: 5,
      operationNo: '9919176/2024',
      clientName: 'GLOBAL LOGISTICS PARTNERS',
      receiptNo: '12389',
      receiptDate: '2025-01-10',
      amountWithoutVat: 2100.00,
      vatAmount: 315.00,
      amountWithVat: 2415.00
    }
  ];

  // Calculate totals
  const totalWithoutVat = invoices.reduce((sum, invoice) => sum + invoice.amountWithoutVat, 0);
  const totalVat = invoices.reduce((sum, invoice) => sum + invoice.vatAmount, 0);
  const totalWithVat = invoices.reduce((sum, invoice) => sum + invoice.amountWithVat, 0);

  const handleSearch = () => {
    // In a real app, this would fetch data from an API
    console.log('Searching invoices:', { startDate, endDate });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 print:p-0">
      <div className="max-w-7xl mx-auto print:max-w-none">
        {/* Header */}
        <div className="mb-8 print:hidden">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-indigo-600" />
            INVOICE SEARCH BY DATE
          </h1>
          <p className="text-gray-600 mt-2">Search and generate VAT reports for invoices</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
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
                  onClick={handlePrint}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center shadow-md print:hidden"
                >
                  <Printer className="w-5 h-5 mr-2" />
                  Print Report
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleSearch}
                className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-green-700 transition-all flex items-center justify-center shadow-md"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Invoices
              </button>
            </div>
          </div>
        </div>

        {/* Report Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-200">
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Sales VAT Report</h2>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                <p className="text-lg font-medium text-blue-800">
                  Date: {startDate} to {endDate}
                </p>
              </div>
            
              {/* Invoice Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        SL No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Operation No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Client Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Receipt No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Receipt Date
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Amount Without VAT
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        VAT Amount
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Amount With VAT
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {invoice.operationNo}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {invoice.clientName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {invoice.receiptNo}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {invoice.receiptDate}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          ${invoice.amountWithoutVat.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          ${invoice.vatAmount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                          ${invoice.amountWithVat.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    
                    {/* Total row */}
                    <tr className="bg-gray-50 font-semibold">
                      <td colSpan="5" className="px-4 py-3 text-right text-sm text-gray-900">
                        Totals:
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${totalWithoutVat.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${totalVat.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${totalWithVat.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Report Footer */}
            <div className="mt-8 border-t border-gray-200 pt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Generated on: {new Date().toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500 italic">
                ** Report Ends **
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Print styles */}
      <style>
        {`
          @media print {
            body {
              background-color: white;
              padding: 0;
              margin: 0;
            }
            .print\\:hidden {
              display: none;
            }
            .print\\:max-w-none {
              max-width: none;
            }
            .print\\:border {
              border: 1px solid #e5e7eb;
            }
            .print\\:bg-none {
              background: none !important;
            }
            .print\\:text-gray-800 {
              color: #1f2937;
            }
            .print\\:shadow-none {
              box-shadow: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default InvoiceSearchByDate;