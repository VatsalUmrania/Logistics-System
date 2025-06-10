import { Search, Eye, Calendar, FileText, DollarSign, Hash, User } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const SupplierInvoiceEdit = () => {
  const [supplierName, setSupplierName] = useState('');
  const [jobNo, setJobNo] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [isLoading, setIsLoading] = useState({ supplier: false, job: false, invoice: false });

  const invoiceData = [
    {
      id: 1,
      jobNumber: '10013/01/2025',
      invoiceNo: '3441',
      invoiceDate: '28-01-2025',
      billAmtWithoutVat: '9560',
      vatAmount: '1434',
      billAmount: '10994'
    },
    {
      id: 2,
      jobNumber: '9946/01/2025',
      invoiceNo: '3440',
      invoiceDate: '25-01-2025',
      billAmtWithoutVat: '6780',
      vatAmount: '1017',
      billAmount: '7797'
    },
    {
      id: 3,
      jobNumber: '9428/11/2024',
      invoiceNo: '3585',
      invoiceDate: '17-02-2025',
      billAmtWithoutVat: '6650',
      vatAmount: '997.5',
      billAmount: '7647.5'
    },
    {
      id: 4,
      jobNumber: '10192/02/2025',
      invoiceNo: '3560',
      invoiceDate: '15-02-2025',
      billAmtWithoutVat: '3330',
      vatAmount: '499.5',
      billAmount: '3829.5'
    },
    {
      id: 5,
      jobNumber: '10014/01/2025',
      invoiceNo: '3489',
      invoiceDate: '01-02-2025',
      billAmtWithoutVat: '4780',
      vatAmount: '717',
      billAmount: '5497'
    },
    {
      id: 6,
      jobNumber: '10316/03/2025',
      invoiceNo: '3748',
      invoiceDate: '14-03-2025',
      billAmtWithoutVat: '3230',
      vatAmount: '484.5',
      billAmount: '3714.5'
    },
    {
      id: 7,
      jobNumber: '10329/03/2025',
      invoiceNo: '3747',
      invoiceDate: '12-03-2025',
      billAmtWithoutVat: '3230',
      vatAmount: '484.5',
      billAmount: '3714.5'
    }
  ];

  const handleSearch = (type) => {
    setIsLoading(prev => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setIsLoading(prev => ({ ...prev, [type]: false }));
    }, 1000);
  };

  const SearchCard = ({ title, placeholder, value, onChange, searchType, icon: Icon }) => (
    <div className="bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-4 rounded-xl mb-6 flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {title.replace('Search By ', '')} <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <button
              onClick={() => handleSearch(searchType)}
              disabled={isLoading[searchType]}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading[searchType] ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Supplier Invoice Edit</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </div>

        {/* Search Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <SearchCard
            title="Search By Supplier Name"
            placeholder="Supplier Name"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            searchType="supplier"
            icon={User}
          />
          
          <SearchCard
            title="Search By Job No"
            placeholder="Job No"
            value={jobNo}
            onChange={(e) => setJobNo(e.target.value)}
            searchType="job"
            icon={Hash}
          />
          
          <SearchCard
            title="Search By Invoice No"
            placeholder="Invoice No"
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
            searchType="invoice"
            icon={FileText}
          />
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <FileText className="w-6 h-6" />
              Invoice Records
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl.No</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Number</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice No</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Amt Without Vat</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vat Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoiceData.map((invoice, index) => (
                  <tr 
                    key={invoice.id} 
                    className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 transform hover:scale-[1.01]"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                      {invoice.jobNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {invoice.invoiceNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {invoice.invoiceDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-medium">{invoice.billAmtWithoutVat}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">{invoice.vatAmount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-blue-500" />
                        <span className="font-bold text-blue-600">{invoice.billAmount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded-lg hover:from-green-600 hover:to-green-700 transform transition-all duration-200 hover:scale-110 active:scale-95">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Showing {invoiceData.length} entries</span>
              <div className="flex items-center gap-2">
                <span>Total Amount:</span>
                <span className="font-bold text-blue-600 text-lg">
                  ${invoiceData.reduce((sum, invoice) => sum + parseFloat(invoice.billAmount), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierInvoiceEdit;