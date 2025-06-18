// import React, { useState, useEffect } from 'react';
// import { Search, ArrowLeft, Printer, Loader2 } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const getAuthHeaders = () => {
//   const token = localStorage.getItem('authToken');
//   if (!token) throw new Error('Authentication token missing');
//   return {
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json'
//   };
// };

// const API_URL = 'http://localhost:5000/api';
// const SUPPLIERS_URL = `${API_URL}/suppliers`;
// const ASSIGNMENTS_URL = `${API_URL}/supplier-assignments`;
// const PAYMENTS_URL = `${API_URL}/supplier-payment`;

// const SupplierStatement = () => {
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [supplierId, setSupplierId] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isInitialLoading, setIsInitialLoading] = useState(true);
//   const [statements, setStatements] = useState([]);
//   const [showResults, setShowResults] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [suppliers, setSuppliers] = useState([]);
//   const [allAssignments, setAllAssignments] = useState([]);
//   const [allPayments, setAllPayments] = useState([]);
//   const navigate = useNavigate();

//   // Fetch initial data on component mount
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setIsInitialLoading(true);
        
//         // Fetch suppliers
//         const suppliersRes = await fetch(SUPPLIERS_URL, { headers: getAuthHeaders() });
//         const suppliersData = await suppliersRes.json();
//         setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
        
//         // Fetch assignments
//         const assignmentsRes = await fetch(ASSIGNMENTS_URL, { headers: getAuthHeaders() });
//         const assignmentsData = await assignmentsRes.json();
//         setAllAssignments(assignmentsData.data || []);
        
//         // Fetch payments
//         const paymentsRes = await fetch(PAYMENTS_URL, { headers: getAuthHeaders() });
//         const paymentsData = await paymentsRes.json();
//         setAllPayments(Array.isArray(paymentsData) ? paymentsData : []);
//       } catch (error) {
//         console.error('Failed to load initial data:', error);
//         setErrorMsg('Failed to load initial data. Please try again later.');
//       } finally {
//         setIsInitialLoading(false);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   const handleSearch = () => {
//     if (!fromDate || !toDate) {
//       setErrorMsg('Please select both From and To dates');
//       return;
//     }
    
//     if (!supplierId) {
//       setErrorMsg('Please select a Supplier');
//       return;
//     }
    
//     setIsLoading(true);
//     setShowResults(false);
//     setErrorMsg('');
    
//     try {
//       // Filter assignments by date range and supplier
//       const filteredAssignments = allAssignments.filter(assignment => {
//         const assignmentDate = assignment.invoice_date?.split('T')[0];
//         return (
//           assignment.supplier_id == supplierId &&
//           assignmentDate >= fromDate && 
//           assignmentDate <= toDate
//         );
//       });
      
//       // Filter payments by date range and supplier
//       const filteredPayments = allPayments.filter(payment => {
//         const paymentDate = payment.payment_date?.split('T')[0];
//         return paymentDate >= fromDate && paymentDate <= toDate;
//       });
      
//       // Convert assignments to statement format
//       const assignmentStatements = filteredAssignments.map(a => ({
//         id: `A${a.id}`,
//         date: a.invoice_date?.split('T')[0],
//         type: 'Invoice',
//         refNo: a.supplier_invoice_no,
//         description: a.job_number,
//         debit: parseFloat(a.bill_total_with_vat) || 0,
//         credit: 0,
//         balance: 0,
//       }));
      
//       // Convert payments to statement format
//       const paymentStatements = filteredPayments.map(p => ({
//         id: `P${p.id}`,
//         date: p.payment_date?.split('T')[0],
//         type: 'Payment',
//         refNo: p.voucher_no,
//         description: p.remarks,
//         debit: 0,
//         credit: parseFloat(p.amount) || 0,
//         balance: 0,
//       }));
      
//       // Merge and sort by date
//       const merged = [...assignmentStatements, ...paymentStatements]
//         .sort((a, b) => new Date(a.date) - new Date(b.date));
      
//       // Calculate running balance
//       let runningBalance = 0;
//       const withBalance = merged.map(s => {
//         runningBalance += s.debit - s.credit;
//         return { ...s, balance: runningBalance };
//       });
      
//       setStatements(withBalance);
//       setShowResults(true);
//     } catch (error) {
//       console.error('Search failed:', error);
//       setErrorMsg('Failed to generate statement. Please try again.');
//       setStatements([]);
//       setShowResults(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePrint = () => window.print();

//   // Format currency values
//   const formatAmount = (value) => {
//     if (!value && value !== 0) return '-';
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 2
//     }).format(value);
//   };

//   // Get supplier name by ID
//   const getSupplierName = (id) => {
//     const supplier = suppliers.find(s => s.id == id);
//     return supplier ? supplier.name : `Supplier ${id}`;
//   };

//   return (
//     <div className="w-full bg-slate-50 min-h-screen p-0 m-0 font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
//       {/* Header */}
//       <div className="bg-blue-800 text-white py-4 px-5 shadow-md print:hidden">
//         <div className="flex items-center gap-2 max-w-screen-xl mx-auto">
//           <button
//             className="bg-white/10 border border-white/20 text-white p-2 rounded-md cursor-pointer flex items-center justify-center transition-all duration-200 w-9 h-9 hover:bg-white/20"
//             onClick={() => navigate('/dashboard')}
//           >
//             <ArrowLeft size={18} />
//           </button>
//           <h1 className="m-0 text-slate-50 text-lg font-semibold">SUPPLIER STATEMENT</h1>
//         </div>
//       </div>

//       {/* Search Controls */}
//       <div className="p-5 flex justify-center print:hidden">
//         <div className="bg-white rounded-lg p-5 shadow-lg border border-slate-200 max-w-3xl w-full">
//           <div className="bg-gray-700 text-white py-2.5 px-4 -mt-5 -mx-5 mb-5 rounded-t-lg">
//             <h2 className="text-white text-base font-semibold m-0">Search by Date</h2>
//           </div>
          
//           {isInitialLoading ? (
//             <div className="flex justify-center py-8">
//               <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//             </div>
//           ) : (
//             <>
//               <div className="flex flex-col gap-5">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
//                   <div className="flex flex-col gap-1.5">
//                     <label htmlFor="fromDate" className="text-gray-700 text-sm font-medium">From :</label>
//                     <input
//                       type="date"
//                       id="fromDate"
//                       value={fromDate}
//                       onChange={e => setFromDate(e.target.value)}
//                       className="h-10 border-2 border-gray-300 rounded-md px-2 text-sm bg-white text-gray-900 focus:border-blue-800"
//                     />
//                   </div>
                  
//                   <div className="flex flex-col gap-1.5">
//                     <label htmlFor="toDate" className="text-gray-700 text-sm font-medium">To :</label>
//                     <input
//                       type="date"
//                       id="toDate"
//                       value={toDate}
//                       onChange={e => setToDate(e.target.value)}
//                       className="h-10 border-2 border-gray-300 rounded-md px-2 text-sm bg-white text-gray-900 focus:border-blue-800"
//                     />
//                   </div>
                  
//                   <div className="flex flex-col gap-1.5">
//                     <label htmlFor="supplierId" className="text-gray-700 text-sm font-medium">Supplier Name</label>
//                     <select
//                       id="supplierId"
//                       value={supplierId}
//                       onChange={e => setSupplierId(e.target.value)}
//                       className="h-10 border-2 border-gray-300 rounded-md px-2 text-sm bg-white text-gray-900 focus:border-blue-800"
//                     >
//                       <option value="">Select Supplier</option>
//                       {suppliers.map(sup => (
//                         <option key={sup.id} value={sup.id}>
//                           {sup.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
                
//                 <div className="flex gap-2.5 justify-end">
//                   <button
//                     className={`bg-blue-500 text-white border-2 border-blue-500 rounded-md flex items-center justify-center gap-1.5 text-sm font-medium transition-all duration-200 py-2.5 px-4 h-9 min-w-[45px] hover:bg-blue-600 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
//                     onClick={handleSearch}
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <Search size={16} />
//                     )}
//                   </button>
                  
//                   <button
//                     className={`bg-emerald-600 text-white border-2 border-emerald-600 rounded-md flex items-center justify-center gap-1.5 text-sm font-medium transition-all duration-200 py-2.5 px-4 h-9 min-w-20 hover:bg-emerald-700 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
//                     onClick={handlePrint}
//                     disabled={isLoading}
//                   >
//                     <Printer size={16} />
//                     Print
//                   </button>
//                 </div>
//               </div>
              
//               {errorMsg && (
//                 <div className="mt-4 bg-red-50 text-red-700 rounded border border-red-200 px-4 py-3 text-center">
//                   {errorMsg}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
      
//       {/* Print header */}
//       {showResults && (
//         <div className="hidden print:block text-center my-4">
//           <h2 className="text-xl font-bold">Supplier Statement</h2>
//           <p className="text-base">
//             Period: {fromDate} to {toDate} | Supplier: {getSupplierName(supplierId)}
//           </p>
//         </div>
//       )}
      
//       {/* Results Table */}
//       {showResults && (
//         <div className="p-5 max-w-screen-xl mx-auto">
//           <div className="flex justify-between items-center mb-4 print:hidden">
//             <h3 className="text-gray-900 text-lg font-semibold m-0">
//               Supplier Statement: {getSupplierName(supplierId)}
//             </h3>
//             <span className="text-gray-600 text-sm">
//               {statements.length > 0 ? `${statements.length} records found` : 'No records found'}
//             </span>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
//             {statements.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="w-full min-w-[600px] border-collapse print:text-xs print:leading-tight">
//                   <thead>
//                     <tr>
//                       <th className="bg-blue-800 text-white p-3 text-left text-sm font-semibold">Date</th>
//                       <th className="bg-blue-800 text-white p-3 text-left text-sm font-semibold">Type</th>
//                       <th className="bg-blue-800 text-white p-3 text-left text-sm font-semibold">Invoice/Payment No</th>
//                       <th className="bg-blue-800 text-white p-3 text-left text-sm font-semibold">Description</th>
//                       <th className="bg-blue-800 text-white p-3 text-left text-sm font-semibold">Debit</th>
//                       <th className="bg-blue-800 text-white p-3 text-left text-sm font-semibold">Credit</th>
//                       <th className="bg-blue-800 text-white p-3 text-left text-sm font-semibold">Balance</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {statements.map(statement => (
//                       <tr key={statement.id} className="hover:bg-slate-50">
//                         <td className="p-3 border-b border-slate-200 text-sm text-gray-700">{statement.date}</td>
//                         <td className="p-3 border-b border-slate-200 text-sm text-gray-700">
//                           {statement.type}
//                         </td>
//                         <td className="p-3 border-b border-slate-200 text-sm text-gray-700">{statement.refNo}</td>
//                         <td className="p-3 border-b border-slate-200 text-sm text-gray-700">{statement.description}</td>
//                         <td className="p-3 border-b border-slate-200 text-sm text-right">
//                           {statement.debit > 0 ? formatAmount(statement.debit) : '-'}
//                         </td>
//                         <td className="p-3 border-b border-slate-200 text-sm text-right">
//                           {statement.credit > 0 ? formatAmount(statement.credit) : '-'}
//                         </td>
//                         <td className="p-3 border-b border-slate-200 text-sm text-right font-medium">
//                           {formatAmount(statement.balance)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="text-center p-10 text-gray-600 text-base">
//                 No supplier statements found for the selected criteria
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SupplierStatement;
import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Printer, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Utility for auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Authentication token missing');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const API_URL = 'http://localhost:5000/api';
const SUPPLIERS_URL = `${API_URL}/suppliers`;
const ASSIGNMENTS_URL = `${API_URL}/supplier-assignments`;
const PAYMENTS_URL = `${API_URL}/supplier-payment`;

const SupplierStatement = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [statements, setStatements] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const navigate = useNavigate();

  // Fetch suppliers, assignments, payments on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsInitialLoading(true);

        // Suppliers
        const suppliersRes = await fetch(SUPPLIERS_URL, { headers: getAuthHeaders() });
        const suppliersData = await suppliersRes.json();
        setSuppliers(Array.isArray(suppliersData) ? suppliersData : (suppliersData.data || []));

        // Assignments (Invoices)
        const assignmentsRes = await fetch(ASSIGNMENTS_URL, { headers: getAuthHeaders() });
        const assignmentsData = await assignmentsRes.json();
        setAllAssignments(assignmentsData.data || []);

        // Payments
        const paymentsRes = await fetch(PAYMENTS_URL, { headers: getAuthHeaders() });
        const paymentsData = await paymentsRes.json();
        setAllPayments(Array.isArray(paymentsData) ? paymentsData : (paymentsData.data || []));
      } catch (error) {
        setErrorMsg('Failed to load initial data. Please try again later.');
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Format as currency
  const formatAmount = (value) => {
    if (!value && value !== 0) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Get supplier name by ID
  const getSupplierName = (id) => {
    const supplier = suppliers.find(s => s.id == id);
    return supplier ? supplier.name : `Supplier ${id}`;
  };

  // Search handler
  const handleSearch = () => {
    if (!fromDate || !toDate) {
      setErrorMsg('Please select both From and To dates');
      return;
    }
    if (!supplierId) {
      setErrorMsg('Please select a Supplier');
      return;
    }
    setIsLoading(true);
    setShowResults(false);
    setErrorMsg('');

    try {
      // Filter assignments by date and supplier
      const filteredAssignments = allAssignments.filter(assignment => {
        const assignmentDate = assignment.invoice_date?.split('T')[0];
        return (
          assignment.supplier_id == supplierId &&
          assignmentDate >= fromDate &&
          assignmentDate <= toDate
        );
      });
      // Filter payments by date and supplier
      const filteredPayments = allPayments.filter(payment => {
        const paymentDate = payment.payment_date?.split('T')[0];
        return (
          payment.supplier_id == supplierId &&
          paymentDate >= fromDate &&
          paymentDate <= toDate
        );
      });
      // To unified statement format
      const assignmentStatements = filteredAssignments.map(a => ({
        id: `A${a.id}`,
        date: a.invoice_date?.split('T')[0],
        type: 'Invoice',
        refNo: a.supplier_invoice_no,
        description: a.job_number,
        debit: parseFloat(a.bill_total_with_vat) || 0,
        credit: 0,
        balance: 0,
      }));
      const paymentStatements = filteredPayments.map(p => ({
        id: `P${p.id}`,
        date: p.payment_date?.split('T')[0],
        type: 'Payment',
        refNo: p.voucher_no,
        description: p.remarks,
        debit: 0,
        credit: parseFloat(p.amount) || 0,
        balance: 0,
      }));
      // Merge, sort, calculate running balance
      const merged = [...assignmentStatements, ...paymentStatements]
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      let runningBalance = 0;
      const withBalance = merged.map(s => {
        runningBalance += s.debit - s.credit;
        return { ...s, balance: runningBalance };
      });
      setStatements(withBalance);
      setShowResults(true);
    } catch (error) {
      setErrorMsg('Failed to generate statement. Please try again.');
      setStatements([]);
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => window.print();

  // --- UI ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-200 font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      

      {/* Main Card */}
      <main className="flex justify-center items-start py-10 print:hidden">
        <section className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-0 overflow-hidden">
          {/* Search Bar */}
          <div className="bg-gradient-to-r from-indigo-700 to-blue-700 px-8 py-6 rounded-t-2xl shadow">
            <h2 className="text-white text-lg font-semibold tracking-wide flex items-center gap-2">
              <Search size={20} /> Statement Search
            </h2>
          </div>
          {isInitialLoading ? (
            <div className="flex flex-col items-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
              <span className="mt-4 text-indigo-700 text-lg font-medium">Loading suppliers...</span>
            </div>
          ) : (
            <form
              className="px-8 pt-8 pb-2 flex flex-col gap-8"
              onSubmit={e => { e.preventDefault(); handleSearch(); }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="fromDate" className="text-gray-700 text-sm font-semibold">From</label>
                  <input
                    type="date"
                    id="fromDate"
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                    className="h-11 border-2 border-gray-300 rounded-lg px-3 text-base bg-white text-gray-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 transition"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="toDate" className="text-gray-700 text-sm font-semibold">To</label>
                  <input
                    type="date"
                    id="toDate"
                    value={toDate}
                    onChange={e => setToDate(e.target.value)}
                    className="h-11 border-2 border-gray-300 rounded-lg px-3 text-base bg-white text-gray-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 transition"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="supplierId" className="text-gray-700 text-sm font-semibold">Supplier Name</label>
                  <select
                    id="supplierId"
                    value={supplierId}
                    onChange={e => setSupplierId(e.target.value)}
                    className="h-11 border-2 border-gray-300 rounded-lg px-3 text-base bg-white text-gray-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 transition"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(sup => (
                      <option key={sup.id} value={sup.id}>
                        {sup.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-4 justify-end mt-2">
                <button
                  type="submit"
                  className={`flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg shadow font-semibold text-base hover:from-indigo-700 hover:to-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search size={18} />}
                  Search
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg shadow font-semibold text-base hover:from-emerald-700 hover:to-green-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  onClick={handlePrint}
                  disabled={isLoading || isInitialLoading}
                >
                  <Printer size={18} />
                  Print
                </button>
              </div>
              {errorMsg && (
                <div className="mt-6 bg-red-50 text-red-700 rounded-lg border border-red-200 px-4 py-3 text-center shadow">
                  {errorMsg}
                </div>
              )}
            </form>
          )}
        </section>
      </main>

      {/* Print header */}
      {showResults && (
        <div className="hidden print:block text-center my-8">
          <h2 className="text-2xl font-bold text-slate-800">Supplier Statement</h2>
          <p className="text-lg text-slate-700">
            Period: {fromDate} to {toDate} | Supplier: {getSupplierName(supplierId)}
          </p>
        </div>
      )}

      {/* Results Table */}
      {showResults && (
        <section className="p-6 max-w-5xl mx-auto print:p-0">
          <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center mb-4 print:hidden">
            <h3 className="text-gray-900 text-2xl font-semibold m-0 flex items-center gap-2">
              Supplier Statement
              <span className="text-base text-gray-500 font-normal">
                {getSupplierName(supplierId)}
              </span>
            </h3>
            <span className="text-gray-500 text-base">
              {statements.length > 0 ? `${statements.length} records` : 'No records'}
            </span>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-x-auto">
            {statements.length > 0 ? (
              <table className="w-full min-w-[700px] border-collapse print:text-xs print:leading-tight">
                <thead>
                  <tr>
                    <th className="bg-indigo-700 text-white py-3 px-4 text-left text-base font-semibold">Date</th>
                    <th className="bg-indigo-700 text-white py-3 px-4 text-left text-base font-semibold">Type</th>
                    <th className="bg-indigo-700 text-white py-3 px-4 text-left text-base font-semibold">Invoice/Payment No</th>
                    <th className="bg-indigo-700 text-white py-3 px-4 text-left text-base font-semibold">Description</th>
                    <th className="bg-indigo-700 text-white py-3 px-4 text-right text-base font-semibold">Debit</th>
                    <th className="bg-indigo-700 text-white py-3 px-4 text-right text-base font-semibold">Credit</th>
                    <th className="bg-indigo-700 text-white py-3 px-4 text-right text-base font-semibold">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {statements.map(statement => (
                    <tr key={statement.id} className="even:bg-slate-50 hover:bg-indigo-50 transition">
                      <td className="py-3 px-4 border-b border-slate-200 text-base text-gray-800">{statement.date}</td>
                      <td className="py-3 px-4 border-b border-slate-200 text-base text-indigo-700">{statement.type}</td>
                      <td className="py-3 px-4 border-b border-slate-200 text-base text-gray-700">{statement.refNo}</td>
                      <td className="py-3 px-4 border-b border-slate-200 text-base text-gray-700">{statement.description}</td>
                      <td className="py-3 px-4 border-b border-slate-200 text-base text-right text-red-700 font-medium">
                        {statement.debit > 0 ? formatAmount(statement.debit) : '-'}
                      </td>
                      <td className="py-3 px-4 border-b border-slate-200 text-base text-right text-green-700 font-medium">
                        {statement.credit > 0 ? formatAmount(statement.credit) : '-'}
                      </td>
                      <td className="py-3 px-4 border-b border-slate-200 text-base text-right font-bold text-indigo-800">
                        {formatAmount(statement.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="p-4 border-t-2 border-slate-300 text-right font-bold bg-slate-100 text-base">
                      Total
                    </td>
                    <td className="p-4 border-t-2 border-slate-300 text-right font-bold bg-slate-100 text-red-700">
                      {formatAmount(statements.reduce((sum, s) => sum + (s.debit || 0), 0))}
                    </td>
                    <td className="p-4 border-t-2 border-slate-300 text-right font-bold bg-slate-100 text-green-700">
                      {formatAmount(statements.reduce((sum, s) => sum + (s.credit || 0), 0))}
                    </td>
                    <td className="p-4 border-t-2 border-slate-300 text-right font-bold bg-slate-100 text-indigo-900">
                      {statements.length > 0 ? formatAmount(statements[statements.length - 1].balance) : '-'}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <div className="text-center p-12 text-gray-500 text-lg font-medium">
                No supplier statements found for the selected criteria.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default SupplierStatement;