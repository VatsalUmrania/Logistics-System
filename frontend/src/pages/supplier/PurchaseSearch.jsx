import React, { useState } from 'react';
import { Search } from 'lucide-react';

const PurchaseSearch = () => {
  const [activeTab, setActiveTab] = useState('supplier');
  const [searchParams, setSearchParams] = useState({
    supplierName: '',
    jobNo: '',
    fromDate: '',
    toDate: ''
  });

  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = (searchType) => {
    setHasSearched(true);
    // Simulate search - in real app, this would make an API call
    setSearchResults([]);
    console.log(`Searching by ${searchType}:`, searchParams);
  };

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-medium text-sm transition-colors ${
        isActive
          ? 'bg-gray-700 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );

  const SearchButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors"
    >
      <Search size={18} />
      Search
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Tab Navigation */}
      <div className="flex mb-6">
        <TabButton
          id="supplier"
          label="Search By Supplier Name"
          isActive={activeTab === 'supplier'}
          onClick={() => setActiveTab('supplier')}
        />
        <TabButton
          id="job"
          label="Search By Job No"
          isActive={activeTab === 'job'}
          onClick={() => setActiveTab('job')}
        />
        <TabButton
          id="date"
          label="Search By Date"
          isActive={activeTab === 'date'}
          onClick={() => setActiveTab('date')}
        />
      </div>

      {/* Search Forms */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-300 mb-6">
        {/* Supplier Name Search */}
        {activeTab === 'supplier' && (
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Supplier Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchParams.supplierName}
                onChange={(e) => handleInputChange('supplierName', e.target.value)}
              />
            </div>
            <SearchButton onClick={() => handleSearch('supplier')} />
          </div>
        )}

        {/* Job No Search */}
        {activeTab === 'job' && (
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job No <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Job No"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchParams.jobNo}
                onChange={(e) => handleInputChange('jobNo', e.target.value)}
              />
            </div>
            <SearchButton onClick={() => handleSearch('job')} />
          </div>
        )}

        {/* Date Range Search */}
        {activeTab === 'date' && (
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                placeholder="From Date"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchParams.fromDate}
                onChange={(e) => handleInputChange('fromDate', e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                placeholder="To Date"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchParams.toDate}
                onChange={(e) => handleInputChange('toDate', e.target.value)}
              />
            </div>
            <SearchButton onClick={() => handleSearch('date')} />
          </div>
        )}
      </div>

      {/* Results Table */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-100 p-4">
          <div className="grid grid-cols-8 gap-4 text-sm font-medium text-gray-700">
            <div>Sl.No</div>
            <div>Job Number</div>
            <div>Supplier Name</div>
            <div>Invoice No</div>
            <div>Invoice Date</div>
            <div>Bill Amt WithOut Vat</div>
            <div>Vat Amount</div>
            <div>Bill Amount</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="p-4">
          {hasSearched ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-lg font-medium">-No Purchase Available-</div>
              <div className="text-sm mt-2">No records found matching your search criteria</div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-lg">Select search criteria and click search to view results</div>
            </div>
          )}
        </div>

        {/* Sample data structure for when results are available */}
        {searchResults.length > 0 && (
          <div className="divide-y divide-gray-200">
            {searchResults.map((item, index) => (
              <div key={index} className="grid grid-cols-8 gap-4 p-4 hover:bg-gray-50">
                <div className="text-sm text-gray-900">{index + 1}</div>
                <div className="text-sm text-gray-900">{item.jobNumber}</div>
                <div className="text-sm text-gray-900">{item.supplierName}</div>
                <div className="text-sm text-gray-900">{item.invoiceNo}</div>
                <div className="text-sm text-gray-900">{item.invoiceDate}</div>
                <div className="text-sm text-gray-900 text-right">{item.billAmtWithoutVat}</div>
                <div className="text-sm text-gray-900 text-right">{item.vatAmount}</div>
                <div className="text-sm text-gray-900 text-right font-medium">{item.billAmount}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          {hasSearched && searchResults.length === 0 && 'No records found'}
          {searchResults.length > 0 && `Showing ${searchResults.length} result(s)`}
        </div>
        <div className="flex space-x-4">
          <button 
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
            onClick={() => {
              setSearchParams({ supplierName: '', jobNo: '', fromDate: '', toDate: '' });
              setSearchResults([]);
              setHasSearched(false);
            }}
          >
            Clear
          </button>
          <button 
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            disabled={searchResults.length === 0}
          >
            Export
          </button>
          <button 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            disabled={searchResults.length === 0}
          >
            Print
          </button>
        </div>
      </div>

      {/* Pagination (when needed) */}
      {searchResults.length > 0 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseSearch;