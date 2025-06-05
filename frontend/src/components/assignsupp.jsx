import React, { useState, useEffect } from 'react';
// import './index.css'; // Ensure you have Tailwind CSS set up in your project


// Assume this is your existing list of suppliers from your database/previous component.
// In a real application, you would fetch this from an API.
const DUMMY_SUPPLIERS = [
  { id: '1', name: 'ABC Logistics Co.', address: '123 Main St', phone: '123-456-7890', email: 'abc@example.com', vat: 'VAT123', number: 'REG1' },
  { id: '2', name: 'Global Supply Inc.', address: '456 Oak Ave', phone: '987-654-3210', email: 'global@example.com', vat: 'VAT456', number: 'REG2' },
  { id: '3', name: 'Quick Ship Solutions', address: '789 Pine Ln', phone: '555-123-4567', email: 'quick@example.com', vat: 'VAT789', number: 'REG3' },
];

function AssignSupplier() {
  // State for the main form fields
  const [formData, setFormData] = useState({
    selectedSupplierId: '',
    supplierInvoiceNo: '',
    jobNumber: '',
    invoiceDate: '',
    vatRate: 0.15, // Example VAT rate (15%) - adjust as needed
  });

  // State for dynamically added items
  const [items, setItems] = useState([
    { purpose: '', item: '', quantity: '', amount: '' }
  ]);

  // State for calculated totals
  const [totals, setTotals] = useState({
    totalAmount: 0,
    vatAmount: 0,
    billTotalWithVAT: 0,
  });

  // Handle changes for main form fields
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle changes for dynamic item fields
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [name]: value };
    setItems(newItems);
  };

  // Add a new empty item row
  const handleAddItem = () => {
    setItems(prev => [...prev, { purpose: '', item: '', quantity: '', amount: '' }]);
  };

  // Calculate totals whenever items or VAT rate change
  useEffect(() => {
    let calculatedTotalAmount = 0;
    items.forEach(item => {
      const amount = parseFloat(item.amount);
      if (!isNaN(amount)) {
        calculatedTotalAmount += amount;
      }
    });

    const calculatedVatAmount = calculatedTotalAmount * formData.vatRate;
    const calculatedBillTotalWithVAT = calculatedTotalAmount + calculatedVatAmount;

    setTotals({
      totalAmount: calculatedTotalAmount,
      vatAmount: calculatedVatAmount,
      billTotalWithVAT: calculatedBillTotalWithVAT,
    });
  }, [items, formData.vatRate]); // Recalculate when items or vatRate change

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Assign Supplier Data:', {
      ...formData,
      items,
      ...totals,
    });
    // Here you would typically send this data to your backend API
    alert('Assignment data logged to console! (Simulated Save)');
    // Optionally reset form after submission
    // resetForm();
  };

  // Optional: Function to reset the form state
  const resetForm = () => {
    setFormData({
      selectedSupplierId: '',
      supplierInvoiceNo: '',
      jobNumber: '',
      invoiceDate: '',
      vatRate: 0.15,
    });
    setItems([{ purpose: '', item: '', quantity: '', amount: '' }]);
    setTotals({
      totalAmount: 0,
      vatAmount: 0,
      billTotalWithVAT: 0,
    });
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-sans antialiased flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto bg-white p-8 rounded-2xl shadow-2xl transform transition-all duration-500 ease-in-out hover:shadow-3xl">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
          Assign Supplier
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top Row - Supplier, Job Number, Invoice Date, Supplier Invoice No */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Supplier Select */}
            <div>
              <label htmlFor="selectedSupplierId" className="block text-sm font-medium text-gray-700 mb-1">Supplier <span className="text-red-500">*</span></label>
              <select
                id="selectedSupplierId"
                name="selectedSupplierId"
                value={formData.selectedSupplierId}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-300 ease-in-out text-gray-800 text-lg"
                required
              >
                <option value="">--Select--</option>
                {DUMMY_SUPPLIERS.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Number */}
            <div>
              <label htmlFor="jobNumber" className="block text-sm font-medium text-gray-700 mb-1">Job Number <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="jobNumber"
                name="jobNumber"
                value={formData.jobNumber}
                onChange={handleFormChange}
                placeholder="Job Number"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-300 ease-in-out text-gray-800 placeholder-gray-500 text-lg"
                required
              />
            </div>

            {/* Supplier Invoice No */}
            <div>
              <label htmlFor="supplierInvoiceNo" className="block text-sm font-medium text-gray-700 mb-1">Supplier Invoice No <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="supplierInvoiceNo"
                name="supplierInvoiceNo"
                value={formData.supplierInvoiceNo}
                onChange={handleFormChange}
                placeholder="Supplier Invoice No"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-300 ease-in-out text-gray-800 placeholder-gray-500 text-lg"
                required
              />
            </div>

            {/* Invoice Date */}
            <div>
              <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 mb-1">Invoice Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                id="invoiceDate"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-300 ease-in-out text-gray-800 text-lg"
                required
              />
            </div>
          </div>

          {/* Dynamic Item Entry Section */}
          <div className="border border-gray-200 p-4 rounded-xl shadow-inner mt-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Items Details</h4>
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label htmlFor={`purpose-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                  <input
                    type="text"
                    id={`purpose-${index}`}
                    name="purpose"
                    value={item.purpose}
                    onChange={(e) => handleItemChange(index, e)}
                    placeholder="Purpose"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-200 text-gray-800 text-base"
                  />
                </div>
                <div>
                  <label htmlFor={`item-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Item <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id={`item-${index}`}
                    name="item"
                    value={item.item}
                    onChange={(e) => handleItemChange(index, e)}
                    placeholder="Item"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-200 text-gray-800 text-base"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Quantity <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    id={`quantity-${index}`}
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    placeholder="Quantity"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-200 text-gray-800 text-base"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`amount-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Amount <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    id={`amount-${index}`}
                    name="amount"
                    value={item.amount}
                    onChange={(e) => handleItemChange(index, e)}
                    placeholder="Amount"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-200 text-gray-800 text-base"
                    step="0.01" // Allows decimal input
                    required
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddItem}
              className="mt-2 bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
            >
              ADD ITEM
            </button>
          </div>

          {/* Totals Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-1">Total Amount <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="totalAmount"
                value={totals.totalAmount.toFixed(2)} // Display with 2 decimal places
                readOnly
                className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 text-lg font-semibold"
              />
            </div>
            <div>
              <label htmlFor="vatAmount" className="block text-sm font-medium text-gray-700 mb-1">VAT Amount <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="vatAmount"
                value={totals.vatAmount.toFixed(2)} // Display with 2 decimal places
                readOnly
                className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 text-lg font-semibold"
              />
            </div>
            <div className="md:col-span-2"> {/* Span across two columns for better alignment */}
              <label htmlFor="billTotalWithVAT" className="block text-sm font-medium text-gray-700 mb-1">Bill Total with VAT <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="billTotalWithVAT"
                value={totals.billTotalWithVAT.toFixed(2)} // Display with 2 decimal places
                readOnly
                className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 text-lg font-semibold"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-4 rounded-xl shadow-lg
                       hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-300
                       transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-xl flex items-center justify-center space-x-2 mt-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>SAVE</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AssignSupplier;