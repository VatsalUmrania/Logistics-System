import React, { useState } from 'react';
import { Search, FileText, Eye, Download, Filter, CreditCard } from 'lucide-react';

const CreditNote = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [creditNotes, setCreditNotes] = useState([
    {
      id: 1,
      creditNoteNo: 'CN001',
      operationNo: 'OP001',
      clientName: 'ABC Trading Company',
      clientNameAr: 'شركة ABC للتجارة',
      amount: 2500.00,
      date: '2024-03-15',
      status: 'approved'
    },
    {
      id: 2,
      creditNoteNo: 'CN002',
      operationNo: 'OP002',
      clientName: 'XYZ Logistics',
      clientNameAr: 'شركة XYZ للخدمات اللوجستية',
      amount: 1850.75,
      date: '2024-03-18',
      status: 'pending'
    },
    {
      id: 3,
      creditNoteNo: 'CN003',
      operationNo: 'OP003',
      clientName: 'Global Shipping Ltd',
      clientNameAr: 'شركة الشحن العالمية المحدودة',
      amount: 3200.50,
      date: '2024-03-20',
      status: 'approved'
    },
    {
      id: 4,
      creditNoteNo: 'CN004',
      operationNo: 'OP004',
      clientName: 'Emirates Freight',
      clientNameAr: 'شركة الإمارات للشحن',
      amount: 1675.25,
      date: '2024-03-22',
      status: 'rejected'
    },
    {
      id: 5,
      creditNoteNo: 'CN005',
      operationNo: 'OP005',
      clientName: 'Dubai Cargo Services',
      clientNameAr: 'خدمات دبي للشحن',
      amount: 2890.00,
      date: '2024-03-25',
      status: 'approved'
    }
  ]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    console.log('Searching for credit note:', searchTerm);
  };

  const handleViewCreditNote = (creditNote) => {
    console.log('Viewing credit note:', creditNote);
  };

  const handleDownloadCreditNote = (creditNote) => {
    console.log('Downloading credit note:', creditNote);
  };

  const filteredCreditNotes = creditNotes.filter(creditNote => 
    creditNote.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creditNote.creditNoteNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creditNote.operationNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const totalAmount = filteredCreditNotes.reduce((sum, note) => sum + note.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-[1900px] mx-auto p-5">
        {/* Page Header */}
        <div className="mb-5">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-8 py-4 bg-gradient-to-r from-black/10 to-transparent">
              <h1 className="text-xl font-bold tracking-wide">Credit Note Management</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* Search Panel - 3 columns */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-5">
              {/* Search Header */}
              <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-5 py-3">
                <h2 className="text-white font-semibold tracking-wide flex items-center text-sm">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                  <Search size={14} className="mr-2" />
                  Search Credit Notes
                </h2>
              </div>
              
              {/* Search Content */}
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Search Terms <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm bg-white text-gray-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
                    placeholder="Credit note no, operation no, or client name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                
                <button 
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  onClick={handleSearch}
                >
                  <Search size={16} />
                  Search Credit Notes
                </button>

                {/* Quick Stats */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">Quick Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">Total Notes</span>
                      <span className="font-semibold text-gray-900">{creditNotes.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">Approved</span>
                      <span className="font-semibold text-green-600">{creditNotes.filter(n => n.status === 'approved').length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">Pending</span>
                      <span className="font-semibold text-yellow-600">{creditNotes.filter(n => n.status === 'pending').length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">Rejected</span>
                      <span className="font-semibold text-red-600">{creditNotes.filter(n => n.status === 'rejected').length}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100 mt-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600 font-medium">Total Amount</span>
                        <span className="font-bold text-blue-600">SAR {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Note List Panel - 9 columns */}
          <div className="xl:col-span-9">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {/* List Header */}
              <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-5 py-3 flex justify-between items-center">
                <h2 className="text-white font-semibold tracking-wide flex items-center text-sm">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                  <CreditCard size={14} className="mr-2" />
                  Credit Note List ({filteredCreditNotes.length})
                </h2>
                <div className="flex items-center gap-2">
                  <button className="bg-white/20 hover:bg-white/30 text-white border-0 p-2 rounded-lg cursor-pointer transition-all duration-200 backdrop-blur-sm">
                    <Filter size={14} />
                  </button>
                  <button className="bg-white/20 hover:bg-white/30 text-white border-0 p-2 rounded-lg cursor-pointer transition-all duration-200 backdrop-blur-sm">
                    <Download size={14} />
                  </button>
                </div>
              </div>
              
              {/* Table */}
              <div className="overflow-hidden">
                {filteredCreditNotes.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-700 to-blue-800 text-white">
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">
                          SL.NO
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">
                          Credit Note No
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">
                          Operation No
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">
                          Client Name
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">
                          Amount (SAR)
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCreditNotes.map((creditNote, index) => (
                        <tr 
                          key={creditNote.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4 text-center text-sm text-gray-900 font-medium">
                            {index + 1}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                              {creditNote.creditNoteNo}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                              {creditNote.operationNo}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <div className="text-center">
                              <div className="font-semibold text-gray-900 mb-1">
                                {creditNote.clientName}
                              </div>
                              <div className="text-xs text-gray-500" style={{ direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>
                                {creditNote.clientNameAr}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-sm font-bold text-gray-900">
                              {creditNote.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center text-sm text-gray-900">
                            {new Date(creditNote.date).toLocaleDateString('en-GB')}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(creditNote.status)}`}>
                              {getStatusText(creditNote.status)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                className="inline-flex items-center justify-center w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                                onClick={() => handleViewCreditNote(creditNote)}
                                title="View Credit Note"
                              >
                                <Eye size={14} />
                              </button>
                              <button 
                                className="inline-flex items-center justify-center w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                                onClick={() => handleDownloadCreditNote(creditNote)}
                                title="Download Credit Note"
                              >
                                <Download size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No credit notes found</h3>
                    <p className="text-gray-500">
                      {searchTerm ? 'Try adjusting your search criteria' : 'Enter search terms to find credit notes'}
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

export default CreditNote;