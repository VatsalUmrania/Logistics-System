import React, { useState } from 'react';
import {
  Search,
  FileText,
  ArrowLeft,
  Printer,
  Calendar,
  User,
  Download,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerStatement = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [clientName, setClientName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statements, setStatements] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // Calculate totals for debit, credit and final balance
  const totalDebit = statements.reduce((sum, stmt) => sum + stmt.debit, 0);
  const totalCredit = statements.reduce((sum, stmt) => sum + stmt.credit, 0);
  const finalBalance = totalDebit - totalCredit;

  // Handles search: simulates API call and retrieves mock data.
  const handleSearch = async () => {
    if (!fromDate || !toDate) {
      alert('Please select both From and To dates');
      return;
    }
    if (!clientName.trim()) {
      alert('Please enter Client Name');
      return;
    }
    setIsLoading(true);
    setShowResults(false);
    try {
      // Simulate API delay
      console.log('Searching customer statements:', {
        fromDate,
        toDate,
        clientName,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockStatements = [
        {
          id: 1,
          date: '2024-01-15',
          invoiceNo: 'INV-001',
          description: 'Logistics Service - Container Handling',
          debit: 1500.0,
          credit: 0.0,
          balance: 1500.0,
        },
        {
          id: 2,
          date: '2024-01-20',
          invoiceNo: 'PAY-001',
          description: 'Payment Received - Bank Transfer',
          debit: 0.0,
          credit: 1500.0,
          balance: 0.0,
        },
        {
          id: 3,
          date: '2024-01-25',
          invoiceNo: 'INV-002',
          description: 'Customs Clearance Service',
          debit: 750.0,
          credit: 0.0,
          balance: 750.0,
        },
        {
          id: 4,
          date: '2024-02-01',
          invoiceNo: 'INV-003',
          description: 'Freight Forwarding Service',
          debit: 2200.0,
          credit: 0.0,
          balance: 2950.0,
        },
        {
          id: 5,
          date: '2024-02-10',
          invoiceNo: 'PAY-002',
          description: 'Partial Payment Received',
          debit: 0.0,
          credit: 1000.0,
          balance: 1950.0,
        },
      ];

      setStatements(mockStatements);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setStatements([]);
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Print handles the browser print functionality.
  const handlePrint = () => {
    console.log('Printing customer statement');
    window.print();
  };

  // A stub for export functionality
  const handleExport = () => {
    console.log('Exporting customer statement');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              Customer Statement Report
            </h1>
            <p className="text-gray-600 mt-2">
              Manage customer account details and transactions
            </p>
          </div>
          
        </div>

        {/* Search Form Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Search Parameters
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  From Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  To Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 inline mr-1" />
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter client name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-5 py-2 text-white rounded-lg font-semibold transition-all flex items-center shadow-md bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Search
                  className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`}
                />
                {isLoading ? 'Searching...' : 'Generate Statement'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Customer Statement ({statements.length} records)
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExport}
                  title="Export Statement"
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={handlePrint}
                  title="Print Statement"
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200"
                >
                  <Printer className="w-5 h-5" />
                </button>
              </div>
            </div>
            {statements.length > 0 && (
              <div className="bg-blue-50 px-6 py-3 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {clientName}
                    </h3>
                    <p className="text-xs text-gray-600">
                      Period: {new Date(fromDate).toLocaleDateString('en-GB')} to{' '}
                      {new Date(toDate).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Statement Balance</p>
                    <p
                      className={`font-bold text-sm ${
                        finalBalance >= 0 ? 'text-blue-600' : 'text-red-600'
                      }`}
                    >
                      SAR{' '}
                      {Math.abs(finalBalance).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })}
                      {finalBalance < 0 ? ' (CR)' : ' (DR)'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              {statements.length > 0 ? (
                <table className="min-w-full">
                  <thead className="bg-indigo-600 text-white text-sm font-semibold">
                    <tr>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Reference</th>
                      <th className="px-4 py-3 text-left">Description</th>
                      <th className="px-4 py-3 text-right">Debit (SAR)</th>
                      <th className="px-4 py-3 text-right">Credit (SAR)</th>
                      <th className="px-4 py-3 text-right">Balance (SAR)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {statements.map((statement) => (
                      <tr
                        key={statement.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {new Date(statement.date).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className="font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                            {statement.invoiceNo}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {statement.description}
                        </td>
                        <td className="px-4 py-4 text-sm text-right">
                          {statement.debit > 0 ? (
                            <span className="font-semibold text-red-600">
                              {statement.debit.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-right">
                          {statement.credit > 0 ? (
                            <span className="font-semibold text-green-600">
                              {statement.credit.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-right">
                          <span
                            className={`font-semibold ${
                              statement.balance >= 0
                                ? 'text-blue-600'
                                : 'text-red-600'
                            }`}
                          >
                            {Math.abs(statement.balance).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100 font-semibold">
                      <td className="px-4 py-3 text-sm text-gray-900" colSpan="3">
                        <strong>TOTAL</strong>
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">
                        <strong>
                          {totalDebit.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                          })}
                        </strong>
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-green-600">
                        <strong>
                          {totalCredit.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                          })}
                        </strong>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <strong
                          className={
                            finalBalance >= 0 ? 'text-blue-600' : 'text-red-600'
                          }
                        >
                          {Math.abs(finalBalance).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                          })}
                          {finalBalance < 0 ? ' (CR)' : ' (DR)'}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No statements found
                  </h3>
                  <p className="text-gray-500">
                    No customer statements found for the selected criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Search Performed Yet */}
        {!showResults && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                Ready to Generate Statement
              </h3>
              <p className="text-gray-500">
                Enter search criteria and click &quot;Generate Statement&quot; to view customer account details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerStatement;