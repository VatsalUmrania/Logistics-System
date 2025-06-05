import { useState } from 'react';
import { Search, ChevronLeft, X, FileText, FileEdit, FilePlus, FileSearch, FileMinus, Truck, CreditCard, DollarSign, Package, Settings, List, Clipboard } from 'lucide-react';

const SupplierInvoiceEditPage = () => {
  const [supplierName, setSupplierName] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [activeMenu, setActiveMenu] = useState('invoice-edit');

  const handleSearchSupplier = (e) => {
    e.preventDefault();
    console.log('Searching for supplier:', supplierName);
    // Implement actual search logic here
  };

  const handleSearchInvoice = (e) => {
    e.preventDefault();
    console.log('Searching for invoice:', invoiceNo);
    // Implement actual search logic here
  };

  const menuItems = [
    { id: 'assign-expense', icon: <DollarSign size={18} />, label: 'Assign Expense' },
    { id: 'invoice', icon: <FileText size={18} />, label: 'Invoice' },
    { id: 'invoice-credit-trade', icon: <CreditCard size={18} />, label: 'Invoice CredTrade' },
    { id: 'credit-trade-search', icon: <FileSearch size={18} />, label: 'CredTrade Search' },
    { id: 'invoice-edit', icon: <FileEdit size={18} />, label: 'Invoice CredTrade Edit' },
    { id: 'job-changes', icon: <Settings size={18} />, label: 'Job Other Changes' },
    { id: 'receipt-cancellation', icon: <FileMinus size={18} />, label: 'Receipt Cancellation' },
    { id: 'delivery-note', icon: <Package size={18} />, label: 'Delivery Note' },
    { id: 'delivery-note-edit', icon: <FileEdit size={18} />, label: 'Delivery Note Edit' },
    { id: 'delivery-note-search', icon: <FileSearch size={18} />, label: 'Delivery Note Search' },
    { id: 'expense-pooling', icon: <List size={18} />, label: 'Expense Pooling' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Clipboard className="w-8 h-8 mr-3 text-indigo-600" />
              SUPPLIER INVOICE EDIT
            </h1>
            <p className="text-gray-600 mt-2">Manage and edit supplier invoices</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - Operation Menu */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden h-fit">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button className="mr-2 text-white">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-lg font-bold text-white">Xid Clearance Operation</h2>
                </div>
              </div>
              <p className="text-indigo-200 text-sm mt-1 ml-7">Yrdit Clearance Operation</p>
            </div>
            
            <div className="p-4">
              <ul className="space-y-2">
                {menuItems.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                        activeMenu === item.id 
                          ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="text-indigo-600 mr-3">{item.icon}</span>
                      <span className="font-medium">#{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search by Supplier Name */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Search By Supplier Name</h3>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSearchSupplier}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supplier Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Truck className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter supplier name"
                          value={supplierName}
                          onChange={(e) => setSupplierName(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center"
                      >
                        <Search className="w-5 h-5 mr-2" />
                        Search
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Search by Invoice No */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Search By Invoice No</h3>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSearchInvoice}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Invoice No
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FileText className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter invoice number"
                          value={invoiceNo}
                          onChange={(e) => setInvoiceNo(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center"
                      >
                        <Search className="w-5 h-5 mr-2" />
                        Search
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Results Section (Placeholder) */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Search Results</h3>
                <span className="text-sm text-gray-500">0 invoices found</span>
              </div>
              
              <div className="p-8 text-center">
                <div className="flex flex-col items-center justify-center py-12">
                  <FileSearch className="w-16 h-16 text-gray-300 mb-4" />
                  <h4 className="text-lg font-medium text-gray-500">No invoices found</h4>
                  <p className="text-gray-400 mt-2">Search for supplier or invoice number to display results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierInvoiceEditPage;