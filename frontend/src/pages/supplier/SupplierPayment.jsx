import React, { useState, useEffect } from 'react';
import { Search, Calendar, DollarSign, FileText, CheckCircle, Plus, X } from 'lucide-react';

const SupplierPayment = () => {
  // Form state
  const [searchTerm, setSearchTerm] = useState('');
  const [voucherNo, setVoucherNo] = useState('1');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handlers
  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Implement search filter logic if needed.
    }, 1000);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const addTableRow = () => {
    setTableData([
      ...tableData,
      {
        id: Date.now(),
        supplier: '',
        operationNo: '',
        receiptNo: '',
        billAmount: '',
        paidAmount: '',
        balanceAmount: '',
        amount: '',
        checked: false,
      },
    ]);
  };

  const removeTableRow = (id) => {
    setTableData(tableData.filter((row) => row.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              {/* Use an appropriate icon; here we use a bank-like icon */}
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              SUPPLIER PAYMENT
            </h1>
            <p className="text-gray-600 mt-2">
              Manage supplier payments and voucher details.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <Card>
          <div className="mb-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-xl">
              <h2 className="text-white text-xl font-bold flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Search
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supplier Name / Supplier No <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Supplier Name or Supplier No"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800"
                    />
                    <ActionButton onClick={handleSearch} disabled={isLoading}>
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      <span>Search</span>
                    </ActionButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Details Form */}
        <Card>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-xl">
            <h2 className="text-white text-xl font-bold">Payment Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <TextInput
              label="Voucher No."
              value={voucherNo}
              onChange={(e) => setVoucherNo(e.target.value)}
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800"
                />
                <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter remarks"
                  rows="3"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800 resize-none"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Details Table */}
        <Card>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-xl flex justify-between items-center">
            <h2 className="text-white text-xl font-bold">Payment Details Table</h2>
            <ActionButton onClick={addTableRow} className="bg-cyan-500 text-white px-3 py-1 rounded inline-flex items-center space-x-1">
              <Plus className="w-4 h-4 " />
              <span>Add Row</span>
            </ActionButton>
          </div>
          <hr />
          <div className="p-0 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left">Sl.No</th>
                  <th className="px-4 py-3 text-left">Supplier</th>
                  <th className="px-4 py-3 text-left">Operation No</th>
                  <th className="px-4 py-3 text-left">Receipt No</th>
                  <th className="px-4 py-3 text-left">Bill Amount</th>
                  <th className="px-4 py-3 text-left">Paid Amount</th>
                  <th className="px-4 py-3 text-left">Balance Amount</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-center">Check</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                      No data available. Click "Add Row" to add payment details.
                    </td>
                  </tr>
                ) : (
                  tableData.map((row, index) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Supplier name"
                          value={row.supplier}
                          onChange={(e) => {
                            const newData = [...tableData];
                            newData[index].supplier = e.target.value;
                            setTableData(newData);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-sm text-gray-800"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Operation No"
                          value={row.operationNo}
                          onChange={(e) => {
                            const newData = [...tableData];
                            newData[index].operationNo = e.target.value;
                            setTableData(newData);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-sm text-gray-800"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Receipt No"
                          value={row.receiptNo}
                          onChange={(e) => {
                            const newData = [...tableData];
                            newData[index].receiptNo = e.target.value;
                            setTableData(newData);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-sm text-gray-800"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={row.billAmount}
                          onChange={(e) => {
                            const newData = [...tableData];
                            newData[index].billAmount = e.target.value;
                            setTableData(newData);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-sm text-gray-800"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={row.paidAmount}
                          onChange={(e) => {
                            const newData = [...tableData];
                            newData[index].paidAmount = e.target.value;
                            setTableData(newData);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-sm text-gray-800"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={row.balanceAmount}
                          onChange={(e) => {
                            const newData = [...tableData];
                            newData[index].balanceAmount = e.target.value;
                            setTableData(newData);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-sm text-gray-800"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={row.amount}
                          onChange={(e) => {
                            const newData = [...tableData];
                            newData[index].amount = e.target.value;
                            setTableData(newData);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-sm text-gray-800"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={row.checked}
                          onChange={(e) => {
                            const newData = [...tableData];
                            newData[index].checked = e.target.checked;
                            setTableData(newData);
                          }}
                          className="w-5 h-5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => removeTableRow(row.id)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Bottom Summary Section */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Type
              </label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800"
              >
                <option value="">--Select--</option>
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
                <option value="cheque">Cheque</option>
                <option value="card">Card</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <ActionButton onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                <span>{isLoading ? 'Processing...' : 'Submit Payment'}</span>
              </ActionButton>
            </div>
          </div>
        </Card>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-transform duration-300 animate-pulse">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Payment processed successfully!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* Reusable Header Component */
const Header = ({ title, subtitle }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
    <div>
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <FileText className="w-8 h-8 mr-3 text-indigo-600" />
        {title}
      </h1>
      {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
    </div>
  </div>
);

/* Reusable Card Component */
const Card = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
    {title && (
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <h2 className="text-white font-bold text-lg">{title}</h2>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

/* Reusable TextInput Component */
const TextInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  as, // for select element
  children,
}) => {
  if (as === 'select') {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800"
          required={required}
        >
          {children}
        </select>
      </div>
    );
  }
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 text-gray-800"
      />
    </div>
  );
};

/* Reusable Action Button */
const ActionButton = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);

export default SupplierPayment;