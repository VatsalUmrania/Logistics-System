import React, { useState } from 'react';
import { Search, Calendar, Printer, FileText, ChevronDown } from 'lucide-react';

const ProfitReportByDate = () => {
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-06-01');
  
  // Mock profit report data
  const profitReports = [
    {
      id: 1,
      jobNo: '9918172024',
      customerName: 'EASTERN POWER SUPPORT TRADING EST.',
      date: '2025-01-14',
      invoiceAmount: 632.50,
      vatAmountInvoice: 82.50,
      expense: 0.00,
      purchaseAmount: 0.00,
      purchaseVat: 0.00,
      differenceInVat: 82.50,
      otherCharges: 0.00,
      profit: 500.00
    },
    {
      id: 2,
      jobNo: '9918172025',
      customerName: 'OVERSEAS DEVELOPMENT COMPANY LIMITED',
      date: '2025-01-18',
      invoiceAmount: 1380.00,
      vatAmountInvoice: 180.00,
      expense: 1200.00,
      purchaseAmount: 1000.00,
      purchaseVat: 100.00,
      differenceInVat: 80.00,
      otherCharges: 20.00,
      profit: 180.00
    },
    {
      id: 3,
      jobNo: '9918172026',
      customerName: 'PIVOT SHIPPING COMPANY LIMITED',
      date: '2025-01-22',
      invoiceAmount: 862.50,
      vatAmountInvoice: 112.50,
      expense: 750.00,
      purchaseAmount: 600.00,
      purchaseVat: 60.00,
      differenceInVat: 52.50,
      otherCharges: 0.00,
      profit: 112.50
    },
    {
      id: 4,
      jobNo: '9918172027',
      customerName: 'RAISCO TRADING COMPANY',
      date: '2025-02-05',
      invoiceAmount: 1058.00,
      vatAmountInvoice: 138.00,
      expense: 920.00,
      purchaseAmount: 750.00,
      purchaseVat: 75.00,
      differenceInVat: 63.00,
      otherCharges: 25.00,
      profit: 138.00
    },
    {
      id: 5,
      jobNo: '9918172028',
      customerName: 'GLOBAL LOGISTICS PARTNERS',
      date: '2025-02-15',
      invoiceAmount: 2415.00,
      vatAmountInvoice: 315.00,
      expense: 2100.00,
      purchaseAmount: 1800.00,
      purchaseVat: 180.00,
      differenceInVat: 135.00,
      otherCharges: 75.00,
      profit: 315.00
    }
  ];

  // Calculate totals
  const calculateTotal = (field) => {
    return profitReports.reduce((sum, report) => sum + report[field], 0);
  };

  const totals = {
    invoiceAmount: calculateTotal('invoiceAmount'),
    vatAmountInvoice: calculateTotal('vatAmountInvoice'),
    expense: calculateTotal('expense'),
    purchaseAmount: calculateTotal('purchaseAmount'),
    purchaseVat: calculateTotal('purchaseVat'),
    differenceInVat: calculateTotal('differenceInVat'),
    otherCharges: calculateTotal('otherCharges'),
    profit: calculateTotal('profit')
  };

  const handleSearch = () => {
    // In a real app, this would fetch data from an API based on the date range
    console.log('Searching profit reports:', { startDate, endDate });
    // For demo purposes, we'll just use the mock data
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
            <FileText className="w-8 h-8 mr-3 text-green-600" />
            PROFIT REPORT BY DATE
          </h1>
          <p className="text-gray-600 mt-2">Analyze profitability by date range</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 print:shadow-none print:border print:border-gray-200">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 print:bg-gray-200 print:bg-none">
            <h2 className="text-xl font-bold text-white flex items-center print:text-gray-800">
              <Search className="w-5 h-5 mr-2 print:text-gray-700" />
              Search by Date Range
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center shadow-md"
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
                <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Profit Report By Date</h2>
                <div className="flex items-center space-x-4">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <p className="text-sm font-medium text-green-800">
                      From Date: {startDate} | To Date: {endDate}
                    </p>
                  </div>
                </div>
              </div>
            
              {/* Profit Report Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Job No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Customer Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Date
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Invoice Amount
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        VAT Amount (invoice)
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Expense
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Purchase Amount
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Purchase VAT
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Difference in VAT
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Other Charges
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {profitReports.map((report) => (
                      <tr key={report.id} className="hover:bg-green-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {report.jobNo}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {report.customerName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {report.date}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          ${report.invoiceAmount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          ${report.vatAmountInvoice.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          ${report.expense.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          ${report.purchaseAmount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          ${report.purchaseVat.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          ${report.differenceInVat.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          ${report.otherCharges.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700 font-semibold text-right">
                          ${report.profit.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    
                    {/* Total row */}
                    <tr className="bg-gray-50 font-semibold">
                      <td colSpan="3" className="px-4 py-3 text-right text-sm text-gray-900">
                        Totals:
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${totals.invoiceAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${totals.vatAmountInvoice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${totals.expense.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${totals.purchaseAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${totals.purchaseVat.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${totals.differenceInVat.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${totals.otherCharges.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700 text-right">
                        ${totals.profit.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Report Footer */}
            <div className="mt-8 border-t border-gray-200 pt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Generated on: {new Date().toLocaleDateString('en-GB')} at {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
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

export default ProfitReportByDate;