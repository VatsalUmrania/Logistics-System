// import React, { useState } from 'react';
// import './acc.css';

// const AccountHead = () => {
//   const [accountType, setAccountType] = useState('');
//   const [accountHead, setAccountHead] = useState('');
//   const [accounts, setAccounts] = useState([
//     { id: 1, accountType: 'Asset', accountHead: 'Current Asset' },
//     { id: 2, accountType: 'Asset', accountHead: 'Loans And Advance(Asset)' },
//     { id: 3, accountType: 'Asset', accountHead: 'Account Receivable' },
//     { id: 4, accountType: 'Liability', accountHead: 'Account Payable' },
//     { id: 5, accountType: 'Asset', accountHead: 'cash in hand' },
//     { id: 6, accountType: 'Liability', accountHead: 'current liability' },
//     { id: 7, accountType: 'Liability', accountHead: 'capital Account' },
//     { id: 8, accountType: 'Asset', accountHead: 'Bank Account' },
//     { id: 9, accountType: 'Asset', accountHead: 'fixed asset' },
//     { id: 10, accountType: 'Asset', accountHead: 'investment' },
//     { id: 11, accountType: 'Liability', accountHead: 'loans(liability)' },
//     { id: 12, accountType: 'Asset', accountHead: 'misc. expense(asset)' },
//     { id: 13, accountType: 'Liability', accountHead: 'provisions' },
//   ]);

//   const handleAdd = () => {
//     if (accountType && accountHead) {
//       const newAccount = {
//         id: accounts.length + 1,
//         accountType,
//         accountHead
//       };
//       setAccounts([...accounts, newAccount]);
//       setAccountType('');
//       setAccountHead('');
//     }
//   };

//   return (
//     <div className="p-4 bg-gray-100 min-h-screen">
//       {/* Page Title */}
//       <h2 className="text-3xl font-medium text-white bg-gray-700 mb-4 text-center py-4 tracking-wide">
//         Account Head
//       </h2>
      
//       <div className="flex gap-4 items-start max-w-7xl mx-auto">
//         {/* Left Form Section */}
//         <div className="flex-none w-80 bg-gray-200 rounded-lg shadow-md border border-gray-300">
//           {/* Form Header */}
//           <div className="bg-gray-600 text-white px-5 py-6 rounded-t-lg border-b border-gray-700">
//             <h3 className="text-lg font-medium tracking-wide m-0">Add Account Head</h3>
//           </div>
          
//           {/* Form Body */}
//           <div className="p-6">
//             {/* Account Type Field */}
//             <div className="mb-5">
//               <label className="block mb-2 font-medium text-gray-700 text-sm uppercase tracking-wide">
//                 Account Type
//               </label>
//               <select 
//                 value={accountType} 
//                 onChange={(e) => setAccountType(e.target.value)}
//                 className="w-full p-3 border-2 border-gray-300 rounded-md text-base bg-white transition-all duration-200 ease-in-out focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               >
//                 <option value="">--Select--</option>
//                 <option value="Asset">Asset</option>
//                 <option value="Liability">Liability</option>
//               </select>
//             </div>
            
//             {/* Account Head Field */}
//             <div className="mb-5">
//               <label className="block mb-2 font-medium text-gray-700 text-sm uppercase tracking-wide">
//                 Account Head
//               </label>
//               <input 
//                 type="text" 
//                 value={accountHead}
//                 onChange={(e) => setAccountHead(e.target.value)}
//                 className="w-full p-3 border-2 border-gray-300 rounded-md text-base bg-white transition-all duration-200 ease-in-out focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 placeholder="Enter account head name"
//               />
//             </div>
            
//             {/* Add Button */}
//             <button 
//               className="w-full bg-blue-500 text-white border-none py-3 px-6 rounded-md cursor-pointer text-base font-medium flex items-center justify-center gap-2 transition-all duration-200 ease-in-out hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg uppercase tracking-wide mt-3"
//               onClick={handleAdd}
//             >
//               <span className="text-lg font-medium">+</span> Add
//             </button>
//           </div>
//         </div>

//         {/* Right Table Section */}
//         <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-300 min-w-0">
//           {/* Table Header */}
//           <div className="bg-blue-500 text-white px-5 py-4 rounded-t-lg border-b border-blue-600">
//             <h3 className="text-lg font-medium tracking-wide m-0">Account Head List</h3>
//           </div>
          
//           {/* Table Container */}
//           <div className="overflow-x-auto max-h-96 overflow-y-auto">
//             <table className="w-full border-collapse text-sm">
//               <thead>
//                 <tr>
//                   <th className="bg-gray-50 border-b-2 border-gray-300 border-r border-gray-300 py-3 px-4 text-left font-medium text-gray-700 sticky top-0 uppercase tracking-wide text-sm whitespace-nowrap">
//                     SL NO
//                   </th>
//                   <th className="bg-gray-50 border-b-2 border-gray-300 border-r border-gray-300 py-3 px-4 text-left font-medium text-gray-700 sticky top-0 uppercase tracking-wide text-sm whitespace-nowrap">
//                     Account Type
//                   </th>
//                   <th className="bg-gray-50 border-b-2 border-gray-300 border-r border-gray-300 py-3 px-4 text-left font-medium text-gray-700 sticky top-0 uppercase tracking-wide text-sm whitespace-nowrap">
//                     Account Head
//                   </th>
//                   <th className="bg-gray-50 border-b-2 border-gray-300 py-3 px-4 text-left font-medium text-gray-700 sticky top-0 uppercase tracking-wide text-sm whitespace-nowrap">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {accounts.map((account, index) => (
//                   <tr 
//                     key={account.id} 
//                     className={`${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-200 hover:scale-105 transition-all duration-100 ease-in-out`}
//                   >
//                     <td className="border-b border-gray-300 border-r border-gray-300 py-3 px-4 align-middle text-gray-600 text-sm font-normal">
//                       {index + 1}
//                     </td>
//                     <td className="border-b border-gray-300 border-r border-gray-300 py-3 px-4 align-middle text-gray-600 text-sm font-normal">
//                       {account.accountType}
//                     </td>
//                     <td className="border-b border-gray-300 border-r border-gray-300 py-3 px-4 align-middle text-gray-600 text-sm font-normal">
//                       {account.accountHead}
//                     </td>
//                     <td className="border-b border-gray-300 py-3 px-4 align-middle text-gray-600 text-sm font-normal">
//                       <button className="bg-transparent border border-gray-500 text-gray-500 py-2 px-4 rounded cursor-pointer text-xs font-medium transition-all duration-200 ease-in-out hover:bg-gray-500 hover:text-white hover:-translate-y-0.5 hover:shadow-md uppercase tracking-wide">
//                         Update
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountHead;


import React, { useState } from 'react';

const AccountHead = () => {
  // Form state and current list of account heads.
  const [accountType, setAccountType] = useState('');
  const [accountHead, setAccountHead] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [accounts, setAccounts] = useState([
    { id: 1, accountType: 'Asset', accountHead: 'Current Asset' },
    { id: 2, accountType: 'Asset', accountHead: 'Loans And Advance (Asset)' },
    { id: 3, accountType: 'Asset', accountHead: 'Account Receivable' },
    { id: 4, accountType: 'Liability', accountHead: 'Account Payable' },
    { id: 5, accountType: 'Asset', accountHead: 'Cash in Hand' },
    { id: 6, accountType: 'Liability', accountHead: 'Current Liability' },
    { id: 7, accountType: 'Liability', accountHead: 'Capital Account' },
    { id: 8, accountType: 'Asset', accountHead: 'Bank Account' },
    { id: 9, accountType: 'Asset', accountHead: 'Fixed Asset' },
    { id: 10, accountType: 'Asset', accountHead: 'Investment' },
    { id: 11, accountType: 'Liability', accountHead: 'Loans (Liability)' },
    { id: 12, accountType: 'Asset', accountHead: 'Misc. Expense (Asset)' },
    { id: 13, accountType: 'Liability', accountHead: 'Provisions' },
  ]);

  // Handles both add and update submission.
  const handleSubmit = () => {
    if (!accountType.trim() || !accountHead.trim()) return;

    if (editingId) {
      const updated = accounts.map((acc) =>
        acc.id === editingId ? { ...acc, accountType, accountHead } : acc
      );
      setAccounts(updated);
    } else {
      const newId = accounts.length ? Math.max(...accounts.map((a) => a.id)) + 1 : 1;
      setAccounts([...accounts, { id: newId, accountType, accountHead }]);
    }
    resetForm();
  };

  // Populate form for editing mode.
  const handleEdit = (acc) => {
    setAccountType(acc.accountType);
    setAccountHead(acc.accountHead);
    setEditingId(acc.id);
  };

  // Delete an account after confirmation.
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      setAccounts(accounts.filter((acc) => acc.id !== id));
      if (editingId === id) {
        resetForm();
      }
    }
  };

  // Reset the form to clear edit mode.
  const resetForm = () => {
    setAccountType('');
    setAccountHead('');
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          {/* Retaining same icon style as BankInformation page */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 mr-3 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18M3 14h18M3 18h18" />
          </svg>
          ACCOUNT HEAD
        </h1>
        <p className="text-gray-600 mt-2">Manage your account head details</p>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left Card: Add / Edit Form */}
        <div className="md:w-80 w-full bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-t-xl border-b border-gray-300">
            <h3 className="text-xl font-bold text-center">
              {editingId ? 'Edit Account Head' : 'Add Account Head'}
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 uppercase tracking-wide">
                Account Type
              </label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-md bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              >
                <option value="">--Select--</option>
                <option value="Asset">Asset</option>
                <option value="Liability">Liability</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 uppercase tracking-wide">
                Account Head
              </label>
              <input
                type="text"
                value={accountHead}
                onChange={(e) => setAccountHead(e.target.value)}
                placeholder="Enter account head name"
                className="w-full p-3 border-2 border-gray-300 rounded-md bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 bg-blue-500 text-white rounded-md font-semibold uppercase tracking-wide shadow-md hover:bg-blue-600 transition-all duration-200"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="flex-1 py-3 bg-red-500 text-white rounded-md font-semibold uppercase tracking-wide shadow-md hover:bg-red-600 transition-all duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Card: Account Head List */}
        <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 border-b border-indigo-700">
            <h3 className="text-xl font-bold text-center">Account Head List</h3>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="py-3 px-4 border-b border-gray-300 text-left font-medium text-gray-700 uppercase tracking-wide">
                    SL No
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left font-medium text-gray-700 uppercase tracking-wide">
                    Account Type
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left font-medium text-gray-700 uppercase tracking-wide">
                    Account Head
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left font-medium text-gray-700 uppercase tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acct, index) => (
                  <tr
                    key={acct.id}
                    className={`transition-all duration-150 ease-in-out ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-gray-200`}
                  >
                    <td className="py-3 px-4 border-b border-gray-300 text-gray-600">{index + 1}</td>
                    <td className="py-3 px-4 border-b border-gray-300 text-gray-600">{acct.accountType}</td>
                    <td className="py-3 px-4 border-b border-gray-300 text-gray-600">{acct.accountHead}</td>
                    <td className="py-3 px-4 border-b border-gray-300 text-gray-600">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(acct)}
                          className="px-3 py-2 bg-green-500 text-white rounded-md text-xs font-semibold uppercase tracking-wide shadow transition-all duration-200 hover:bg-green-600 hover:shadow-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(acct.id)}
                          className="px-3 py-2 bg-red-500 text-white rounded-md text-xs font-semibold uppercase tracking-wide shadow transition-all duration-200 hover:bg-red-600 hover:shadow-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {accounts.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-gray-500">
                      No Account Heads Found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountHead;