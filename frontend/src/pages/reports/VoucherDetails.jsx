import React, { useState } from 'react';
import { Search, FileText, ChevronDown, Printer } from 'lucide-react';

const VoucherDetails = () => {
  const [voucherNo, setVoucherNo] = useState('');
  const [voucherData, setVoucherData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock voucher data
  const mockVouchers = [
    {
      id: 'V-2023-001',
      date: '2025-05-15',
      type: 'Payment',
      account: 'Cash Account',
      description: 'Office supplies purchase',
      debit: 1200.00,
      credit: 0.00,
      status: 'Approved',
      preparedBy: 'John Smith',
      approvedBy: 'Jane Doe',
      details: [
        { account: 'Office Supplies', debit: 1000.00, credit: 0.00 },
        { account: 'VAT Input', debit: 200.00, credit: 0.00 },
        { account: 'Cash Account', debit: 0.00, credit: 1200.00 }
      ]
    },
    {
      id: 'V-2023-002',
      date: '2025-05-18',
      type: 'Receipt',
      account: 'Bank Account',
      description: 'Client payment - Project Alpha',
      debit: 0.00,
      credit: 5500.00,
      status: 'Pending',
      preparedBy: 'Alex Johnson',
      approvedBy: '-',
      details: [
        { account: 'Bank Account', debit: 5500.00, credit: 0.00 },
        { account: 'Accounts Receivable', debit: 0.00, credit: 5500.00 }
      ]
    }
  ];

  const handleSearch = () => {
    if (!voucherNo.trim()) {
      alert('Please enter a voucher number');
      return;
    }
    
    const foundVoucher = mockVouchers.find(v => v.id === voucherNo);
    
    if (foundVoucher) {
      setVoucherData(foundVoucher);
      setShowDetails(true);
    } else {
      alert('Voucher not found');
      setVoucherData(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 print:p-0">
      <div className="max-w-5xl mx-auto print:max-w-none">
        {/* Header */}
        <div className="mb-8 print:hidden">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-indigo-600" />
            VOUCHER DETAILS
          </h1>
          <p className="text-gray-600 mt-2">Search and view voucher details</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 print:shadow-none print:border print:border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 print:bg-gray-200 print:bg-none">
            <h2 className="text-xl font-bold text-white flex items-center print:text-gray-800">
              <Search className="w-5 h-5 mr-2 print:text-gray-700" />
              Search Voucher
            </h2>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voucher No
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter Voucher No"
                  value={voucherNo}
                  onChange={(e) => setVoucherNo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-green-700 transition-all flex items-center justify-center shadow-md"
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Voucher Details Section */}
        {voucherData && showDetails && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Voucher Details
                  </h2>
                  <p className="text-gray-600">Voucher No: {voucherData.id}</p>
                </div>
                <button 
                  onClick={handlePrint}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium flex items-center shadow-md print:hidden"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">Basic Information</h3>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="w-32 text-gray-600">Date:</span>
                      <span className="font-medium">{voucherData.date}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Type:</span>
                      <span className="font-medium">{voucherData.type}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        voucherData.status === 'Approved' 
                          ? 'text-green-600' 
                          : voucherData.status === 'Pending'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }`}>
                        {voucherData.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">Financial Information</h3>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="w-32 text-gray-600">Debit:</span>
                      <span className="font-medium">${voucherData.debit.toFixed(2)}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Credit:</span>
                      <span className="font-medium">${voucherData.credit.toFixed(2)}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Account:</span>
                      <span className="font-medium">{voucherData.account}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-900">{voucherData.description}</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Account
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Debit ($)
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Credit ($)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {voucherData.details.map((detail, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {detail.account}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          {detail.debit > 0 ? detail.debit.toFixed(2) : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          {detail.credit > 0 ? detail.credit.toFixed(2) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">Prepared By</h3>
                  <p className="text-gray-900">{voucherData.preparedBy}</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">Approved By</h3>
                  <p className="text-gray-900">{voucherData.approvedBy}</p>
                </div>
              </div>
              
              <div className="mt-8 border-t border-gray-200 pt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Generated on: {new Date().toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-500 italic">
                  ** Voucher Ends **
                </div>
              </div>
            </div>
          </div>
        )}

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
    </div>
  );
};

export default VoucherDetails;