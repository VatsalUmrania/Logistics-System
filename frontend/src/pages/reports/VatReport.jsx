import React, { useState } from 'react';
import { Search, Printer, ArrowLeft, Calendar, FileText, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VatStat = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [vatStatements, setVatStatements] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!fromDate || !toDate) return alert('Please select both From and To dates');

    setIsLoading(true);
    setShowResults(false);
    try {
      console.log('Searching VAT statements:', { fromDate, toDate });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockVatStatements = [
        {
          id: 1,
          date: '2024-01-15',
          clientName: 'ABC Trading Company',
          invoiceNo: 'INV-001',
          vatAmount: '225.00'
        },
        {
          id: 2,
          date: '2024-01-20',
          clientName: 'XYZ Logistics',
          invoiceNo: 'INV-002',
          vatAmount: '345.00'
        },
        {
          id: 3,
          date: '2024-01-22',
          clientName: 'Global Shipping Ltd',
          invoiceNo: 'INV-003',
          vatAmount: '180.00'
        }
      ];
      
      setVatStatements(mockVatStatements);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setVatStatements([]);
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    console.log('Printing VAT statement');
    window.print();
  };

  const getTotalVatAmount = () => {
    return vatStatements.reduce((total, statement) => total + parseFloat(statement.vatAmount), 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button 
              className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white p-3 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <Calculator size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide">VAT Statement Report</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Wrapper */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden sticky top-8">
              {/* Search Header */}
              <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <Search size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Search Criteria</h2>
                  </div>
                </div>
              </div>
              
              {/* Search Form */}
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar size={18} className="text-blue-600" />
                    <h3 className="font-medium text-gray-800">Date Range</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="fromDate" className="text-sm font-medium text-gray-700">From Date</label>
                    <input
                      type="date"
                      id="fromDate"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 text-sm bg-white transition-all duration-200 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="toDate" className="text-sm font-medium text-gray-700">To Date</label>
                    <input
                      type="date"
                      id="toDate"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 text-sm bg-white transition-all duration-200 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                    />
                  </div>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <button 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none rounded-xl cursor-pointer flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300 px-6 py-3 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-400"
                    onClick={handleSearch}
                    disabled={isLoading}
                  >
                    <Search size={16} className={isLoading ? 'animate-spin' : ''} />
                    {isLoading ? 'Searching...' : 'Search VAT Records'}
                  </button>
                  
                  <button 
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white border-none rounded-xl cursor-pointer flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300 px-6 py-3 hover:from-green-700 hover:to-green-800 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handlePrint}
                    disabled={isLoading || !showResults || vatStatements.length === 0}
                  >
                    <Printer size={16} />
                    Print Report
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Results Header */}
              <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-lg">
                      <FileText size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">VAT Statement</h3>
                      <p className="text-slate-200 text-sm">
                        Period: {fromDate || '____'} to {toDate || '____'}
                      </p>
                    </div>
                  </div>
                  {showResults && vatStatements.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                      <div className="text-right">
                        <p className="text-slate-200 text-xs">Total VAT Amount</p>
                        <p className="text-white text-lg font-bold">{getTotalVatAmount()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* VAT Table */}
              <div className="overflow-hidden">
                {showResults && vatStatements.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200">
                          <th className="p-4 text-left text-sm font-semibold text-gray-700">Date</th>
                          <th className="p-4 text-left text-sm font-semibold text-gray-700">Client Name</th>
                          <th className="p-4 text-left text-sm font-semibold text-gray-700">Invoice No</th>
                          <th className="p-4 text-left text-sm font-semibold text-gray-700">VAT Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vatStatements.map((statement, index) => (
                          <tr key={statement.id} className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="p-4 border-b border-gray-100 text-sm text-gray-700 font-medium">{statement.date}</td>
                            <td className="p-4 border-b border-gray-100 text-sm text-gray-700">{statement.clientName}</td>
                            <td className="p-4 border-b border-gray-100 text-sm text-gray-700 font-mono">{statement.invoiceNo}</td>
                            <td className="p-4 border-b border-gray-100 text-sm font-semibold text-green-600">{statement.vatAmount}</td>
                          </tr>
                        ))}
                        {/* Total Row */}
                        <tr className="bg-gradient-to-r from-blue-50 to-blue-100 border-t-2 border-blue-200">
                          <td className="p-4 text-sm font-bold text-gray-800" colSpan="3">Total VAT Amount:</td>
                          <td className="p-4 text-sm font-bold text-green-600">{getTotalVatAmount()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <Calculator size={40} className="text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {showResults ? 'No VAT Records Found' : 'Ready to Search'}
                    </h4>
                    <p className="text-gray-500">
                      {showResults ? 'No VAT records found for the selected date range' : 'Select a date range and click search to view VAT statements'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VatStat;