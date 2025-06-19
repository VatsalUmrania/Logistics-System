// import React, { useState, useEffect } from 'react';
// import { 
//   ClipboardList, 
//   Plus, 
//   X, 
//   Save, 
//   FileText, 
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   Search,
//   Pencil,
//   Trash2
// } from 'lucide-react';

// // Initial form data structure
// const initialFormData = {
//   operationType: 'Import',
//   transportMode: 'Sea',
//   client: '',
//   jobNo: '',
//   commodity: '',
//   noOfPackages: '',
//   pod: '',
//   line: '',
//   vessel: '',
//   netWeight: '',
//   grossWeight: '',
//   shipper: '',
//   clientRefName: '',
//   lineAgent: '',
//   representative: '',
//   receivingRep: '',
//   pol: '',
//   bayanNo: '',
//   bayanDate: '',
//   paymentDate: '',
//   group: '',
//   eta: '',
//   date: '',
//   yardDate: '',
//   hijriDate: '',
//   endDate: '',
//   releaseDate: '',
//   status: '',
//   notes: '',
//   bl: '',
//   poNo: ''
// };

// const ClearanceOperation = () => {
//   // State management
//   const [formData, setFormData] = useState(initialFormData);
//   const [containers, setContainers] = useState([{ id: Date.now(), qty: '', type: '' }]);
//   const [bills, setBills] = useState([{ id: Date.now(), clientRef: '', doDate: '', doNo: '', endorseNo: '', billNo: '' }]);
//   const [operations, setOperations] = useState([]);
//   const [currentOperationId, setCurrentOperationId] = useState(null);
//   const [currentContainerPage, setCurrentContainerPage] = useState(1);
//   const [currentOperationsPage, setCurrentOperationsPage] = useState(1);
//   const [sortField, setSortField] = useState('client');
//   const [sortDirection, setSortDirection] = useState('asc');
//   const [isAdding, setIsAdding] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Constants
//   const vesselOptions = ['Select', 'MSC Maya', 'OOCL Hamburg', 'Maersk Madrid', 'CMA CGM Liberty'];
//   const polOptions = ['Select', 'Jeddah', 'Dubai', 'Shanghai', 'Rotterdam'];
//   const containerTypes = ['20GP', '40GP', '40HC', '45HC', '20RF', '40RF'];
//   const itemsPerPageForContainers = 5;
//   const itemsPerPageForOperations = 5;

//   // Form handlers
//   const handleFormChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   // Container handlers
//   const addContainer = () => {
//     setContainers(prev => [...prev, { id: Date.now(), qty: '', type: '' }]);
//     setCurrentContainerPage(Math.ceil((containers.length + 1) / itemsPerPageForContainers));
//   };

//   const removeContainer = (id) => {
//     if (containers.length > 1) {
//       setContainers(prev => prev.filter(container => container.id !== id));
//     }
//   };

//   const updateContainer = (id, field, value) => {
//     setContainers(prev => prev.map(container => 
//       container.id === id ? { ...container, [field]: value } : container
//     ));
//   };

//   // Bill handlers
//   const addBill = () => {
//     setBills(prev => [...prev, { id: Date.now(), clientRef: '', doDate: '', doNo: '', endorseNo: '', billNo: '' }]);
//   };

//   const removeBill = (id) => {
//     if (bills.length > 1) {
//       setBills(prev => prev.filter(bill => bill.id !== id));
//     }
//   };

//   const updateBill = (id, field, value) => {
//     setBills(prev => prev.map(bill => 
//       bill.id === id ? { ...bill, [field]: value } : bill
//     ));
//   };

//   // File and save handlers
//   const handleAddFiles = () => {
//     console.log('Add files functionality');
//     alert('File upload functionality would go here');
//   };

//   const handleSave = () => {
//     const newOperation = {
//       id: currentOperationId || Date.now(),
//       ...formData,
//       containers: containers,
//       bills: bills
//     };

//     if (currentOperationId) {
//       // Update existing operation
//       setOperations(prev => prev.map(op => 
//         op.id === currentOperationId ? newOperation : op
//       ));
//     } else {
//       // Add new operation
//       setOperations(prev => [...prev, newOperation]);
//     }

//     resetForm();
//     setIsAdding(false);
//   };

//   // Edit and delete operations
//   const handleEdit = (operation) => {
//     setFormData({
//       operationType: operation.operationType,
//       transportMode: operation.transportMode,
//       client: operation.client,
//       jobNo: operation.jobNo,
//       commodity: operation.commodity,
//       noOfPackages: operation.noOfPackages,
//       pod: operation.pod,
//       line: operation.line,
//       vessel: operation.vessel,
//       netWeight: operation.netWeight,
//       grossWeight: operation.grossWeight,
//       shipper: operation.shipper,
//       clientRefName: operation.clientRefName,
//       lineAgent: operation.lineAgent,
//       representative: operation.representative,
//       receivingRep: operation.receivingRep,
//       pol: operation.pol,
//       bayanNo: operation.bayanNo,
//       bayanDate: operation.bayanDate,
//       paymentDate: operation.paymentDate,
//       group: operation.group,
//       eta: operation.eta,
//       date: operation.date,
//       yardDate: operation.yardDate,
//       hijriDate: operation.hijriDate,
//       endDate: operation.endDate,
//       releaseDate: operation.releaseDate,
//       status: operation.status,
//       notes: operation.notes,
//       bl: operation.bl,
//       poNo: operation.poNo
//     });
    
//     setContainers(operation.containers);
//     setBills(operation.bills);
//     setCurrentOperationId(operation.id);
//     setIsAdding(true);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this operation?')) {
//       setOperations(prev => prev.filter(op => op.id !== id));
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setFormData(initialFormData);
//     setContainers([{ id: Date.now(), qty: '', type: '' }]);
//     setBills([{ id: Date.now(), clientRef: '', doDate: '', doNo: '', endorseNo: '', billNo: '' }]);
//     setCurrentOperationId(null);
//     setCurrentContainerPage(1);
//   };

//   // Sorting handlers
//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   // Pagination for containers
//   const indexOfLastContainer = currentContainerPage * itemsPerPageForContainers;
//   const indexOfFirstContainer = indexOfLastContainer - itemsPerPageForContainers;
//   const currentContainers = containers.slice(indexOfFirstContainer, indexOfLastContainer);
//   const totalContainerPages = Math.ceil(containers.length / itemsPerPageForContainers);

//   // Pagination and sorting for operations
//   const sortedOperations = [...operations].sort((a, b) => {
//     const aValue = a[sortField] || '';
//     const bValue = b[sortField] || '';
    
//     if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
//     if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
//     return 0;
//   });

//   const filteredOperations = sortedOperations.filter(op => 
//     op.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     op.jobNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     op.operationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     op.transportMode.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     op.vessel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     op.pol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     op.status.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const indexOfLastOperation = currentOperationsPage * itemsPerPageForOperations;
//   const indexOfFirstOperation = indexOfLastOperation - itemsPerPageForOperations;
//   const currentOperations = filteredOperations.slice(indexOfFirstOperation, indexOfLastOperation);
//   const totalOperationsPages = Math.ceil(filteredOperations.length / itemsPerPageForOperations);

//   // Reset operations page when search term changes
//   useEffect(() => {
//     setCurrentOperationsPage(1);
//   }, [searchTerm]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//               <ClipboardList className="w-8 h-8 mr-3 text-indigo-600" />
//               CLEARANCE OPERATIONS
//             </h1>
//             <p className="text-gray-600 mt-2">Manage clearance operations for your logistics</p>
//           </div>
          
//           <div className="mt-4 md:mt-0 flex space-x-3">
//             <div className="relative">
//               <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
//                 <Search className="w-5 h-5 text-gray-400 mr-2" />
//                 <input
//                   type="text"
//                   placeholder="Search operations..."
//                   className="bg-transparent outline-none w-40"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>
//             <button
//               onClick={() => {
//                 resetForm();
//                 setIsAdding(!isAdding);
//               }}
//               className={`px-5 py-2 text-white rounded-lg font-medium transition-all flex items-center shadow-md
//                 ${isAdding 
//                   ? 'bg-red-600 hover:bg-red-700' 
//                   : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}`}
//             >
//               {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
//               {isAdding ? 'Close' : 'Add Operation'}
//             </button>
//           </div>
//         </div>

//         {/* Add Operation Form */}
//         {isAdding && (
//           <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
//             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
//               <h2 className="text-xl font-bold text-white flex items-center">
//                 <ClipboardList className="w-5 h-5 mr-2" />
//                 {currentOperationId ? 'Edit Clearance Operation' : 'Add New Clearance Operation'}
//               </h2>
//             </div>
            
//             <div className="p-6">
//               {/* Basic Information Section */}
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Basic Information</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Operation Type
//                       </label>
//                       <div className="flex gap-4">
//                         <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 cursor-pointer">
//                           <input
//                             type="radio"
//                             name="operationType"
//                             value="Export"
//                             checked={formData.operationType === 'Export'}
//                             onChange={(e) => handleFormChange('operationType', e.target.value)}
//                             className="w-4 h-4 accent-indigo-600"
//                           />
//                           Export
//                         </label>
//                         <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 cursor-pointer">
//                           <input
//                             type="radio"
//                             name="operationType"
//                             value="Import"
//                             checked={formData.operationType === 'Import'}
//                             onChange={(e) => handleFormChange('operationType', e.target.value)}
//                             className="w-4 h-4 accent-indigo-600"
//                           />
//                           Import
//                         </label>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Transport Mode
//                       </label>
//                       <div className="flex gap-4">
//                         <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 cursor-pointer">
//                           <input
//                             type="radio"
//                             name="transportMode"
//                             value="Land"
//                             checked={formData.transportMode === 'Land'}
//                             onChange={(e) => handleFormChange('transportMode', e.target.value)}
//                             className="w-4 h-4 accent-indigo-600"
//                           />
//                           Land
//                         </label>
//                         <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 cursor-pointer">
//                           <input
//                             type="radio"
//                             name="transportMode"
//                             value="Air"
//                             checked={formData.transportMode === 'Air'}
//                             onChange={(e) => handleFormChange('transportMode', e.target.value)}
//                             className="w-4 h-4 accent-indigo-600"
//                           />
//                           Air
//                         </label>
//                         <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 cursor-pointer">
//                           <input
//                             type="radio"
//                             name="transportMode"
//                             value="Sea"
//                             checked={formData.transportMode === 'Sea'}
//                             onChange={(e) => handleFormChange('transportMode', e.target.value)}
//                             className="w-4 h-4 accent-indigo-600"
//                           />
//                           Sea
//                         </label>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Client <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         placeholder="Client name"
//                         value={formData.client}
//                         onChange={(e) => handleFormChange('client', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                         required
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Job Number <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.jobNo}
//                         onChange={(e) => handleFormChange('jobNo', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                         required
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Client Ref
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.clientRefName}
//                         onChange={(e) => handleFormChange('clientRefName', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Bayan No
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.bayanNo}
//                         onChange={(e) => handleFormChange('bayanNo', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Status
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.status}
//                         onChange={(e) => handleFormChange('status', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         PO Number
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.poNo}
//                         onChange={(e) => handleFormChange('poNo', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Shipping & Logistics Section */}
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Shipping & Logistics</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Shipping Line
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.line}
//                         onChange={(e) => handleFormChange('line', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Vessel
//                       </label>
//                       <select
//                         value={formData.vessel}
//                         onChange={(e) => handleFormChange('vessel', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       >
//                         {vesselOptions.map((option, index) => (
//                           <option key={index} value={option}>{option}</option>
//                         ))}
//                       </select>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Line Agent
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.lineAgent}
//                         onChange={(e) => handleFormChange('lineAgent', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         ETA
//                       </label>
//                       <input
//                         type="date"
//                         value={formData.eta}
//                         onChange={(e) => handleFormChange('eta', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         POL
//                       </label>
//                       <select
//                         value={formData.pol}
//                         onChange={(e) => handleFormChange('pol', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       >
//                         {polOptions.map((option, index) => (
//                           <option key={index} value={option}>{option}</option>
//                         ))}
//                       </select>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         POD
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.pod}
//                         onChange={(e) => handleFormChange('pod', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Representative
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.representative}
//                         onChange={(e) => handleFormChange('representative', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Receiving Rep
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.receivingRep}
//                         onChange={(e) => handleFormChange('receivingRep', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Cargo Information Section */}
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Cargo Information</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Commodity
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.commodity}
//                         onChange={(e) => handleFormChange('commodity', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Packages
//                       </label>
//                       <input
//                         type="number"
//                         value={formData.noOfPackages}
//                         onChange={(e) => handleFormChange('noOfPackages', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Shipper
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.shipper}
//                         onChange={(e) => handleFormChange('shipper', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Bill of Lading
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.bl}
//                         onChange={(e) => handleFormChange('bl', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Net Weight (KG)
//                       </label>
//                       <input
//                         type="number"
//                         value={formData.netWeight}
//                         onChange={(e) => handleFormChange('netWeight', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Gross Weight (KG)
//                       </label>
//                       <input
//                         type="number"
//                         value={formData.grossWeight}
//                         onChange={(e) => handleFormChange('grossWeight', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Documentation & Timeline */}
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Documentation & Timeline</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Bayan Date
//                       </label>
//                       <input
//                         type="date"
//                         value={formData.bayanDate}
//                         onChange={(e) => handleFormChange('bayanDate', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Date
//                       </label>
//                       <input
//                         type="date"
//                         value={formData.date}
//                         onChange={(e) => handleFormChange('date', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Yard Date
//                       </label>
//                       <input
//                         type="date"
//                         value={formData.yardDate}
//                         onChange={(e) => handleFormChange('yardDate', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Payment Date
//                       </label>
//                       <input
//                         type="date"
//                         value={formData.paymentDate}
//                         onChange={(e) => handleFormChange('paymentDate', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         End Date
//                       </label>
//                       <input
//                         type="date"
//                         value={formData.endDate}
//                         onChange={(e) => handleFormChange('endDate', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Release Date
//                       </label>
//                       <input
//                         type="date"
//                         value={formData.releaseDate}
//                         onChange={(e) => handleFormChange('releaseDate', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Container Information */}
//               <div className="mb-8">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-semibold text-gray-800">Container Information</h3>
//                   <button
//                     onClick={addContainer}
//                     className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center"
//                   >
//                     <Plus className="w-5 h-5 mr-1" />
//                     Add Container
//                   </button>
//                 </div>
                
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                   <table className="min-w-full table-auto border-collapse">
//                     <thead className="bg-indigo-600 text-white text-sm font-semibold">
//                       <tr>
//                         <th className="px-4 py-3 text-left">Qty</th>
//                         <th className="px-4 py-3 text-left">Type</th>
//                         <th className="px-4 py-3 text-left">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {currentContainers.map((container) => (
//                         <tr key={container.id} className="border-b border-gray-200 hover:bg-gray-50">
//                           <td className="px-4 py-3">
//                             <input
//                               type="number"
//                               value={container.qty}
//                               onChange={(e) => updateContainer(container.id, 'qty', e.target.value)}
//                               className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                             />
//                           </td>
//                           <td className="px-4 py-3">
//                             <select
//                               value={container.type}
//                               onChange={(e) => updateContainer(container.id, 'type', e.target.value)}
//                               className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                             >
//                               <option value="">Select</option>
//                               {containerTypes.map((type, index) => (
//                                 <option key={index} value={type}>{type}</option>
//                               ))}
//                             </select>
//                           </td>
//                           <td className="px-4 py-3">
//                             <button
//                               onClick={() => removeContainer(container.id)}
//                               className="text-red-600 hover:text-red-800"
//                               title="Remove container"
//                             >
//                               <Trash2 className="w-5 h-5" />
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
                  
//                   {/* Pagination */}
//                   <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
//                     <div className="text-sm text-gray-700">
//                       Showing {indexOfFirstContainer + 1} to{' '}
//                       {Math.min(indexOfLastContainer, containers.length)} of {containers.length} containers
//                     </div>
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => setCurrentContainerPage((p) => Math.max(p - 1, 1))}
//                         disabled={currentContainerPage === 1}
//                         className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
//                         title="Previous"
//                       >
//                         <ChevronLeft className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => setCurrentContainerPage((p) => Math.min(p + 1, totalContainerPages))}
//                         disabled={currentContainerPage === totalContainerPages || totalContainerPages === 0}
//                         className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
//                         title="Next"
//                       >
//                         <ChevronRight className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Bills & Documentation */}
//               <div className="mb-8">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-semibold text-gray-800">Bills & Documentation</h3>
//                   <button
//                     onClick={addBill}
//                     className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center"
//                   >
//                     <Plus className="w-5 h-5 mr-1" />
//                     Add Bill
//                   </button>
//                 </div>
                
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//                   {bills.map((bill, index) => (
//                     <div key={bill.id} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
//                       <div className="flex justify-between items-start mb-3">
//                         <span className="text-sm font-bold text-gray-700">Bill #{index + 1}</span>
//                         <button 
//                           onClick={() => removeBill(bill.id)}
//                           className="text-red-600 hover:text-red-800"
//                           title="Remove bill"
//                         >
//                           <Trash2 className="w-5 h-5" />
//                         </button>
//                       </div>
                      
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">Client Reference</label>
//                           <input
//                             type="text"
//                             placeholder="Client Reference"
//                             value={bill.clientRef}
//                             onChange={(e) => updateBill(bill.id, 'clientRef', e.target.value)}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                           />
//                         </div>
                        
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">DO Date</label>
//                           <input
//                             type="date"
//                             placeholder="DO Date"
//                             value={bill.doDate}
//                             onChange={(e) => updateBill(bill.id, 'doDate', e.target.value)}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                           />
//                         </div>
                        
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">DO Number</label>
//                           <input
//                             type="text"
//                             placeholder="DO Number"
//                             value={bill.doNo}
//                             onChange={(e) => updateBill(bill.id, 'doNo', e.target.value)}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                           />
//                         </div>
                        
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">Endorse Number</label>
//                           <input
//                             type="text"
//                             placeholder="Endorse Number"
//                             value={bill.endorseNo}
//                             onChange={(e) => updateBill(bill.id, 'endorseNo', e.target.value)}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                           />
//                         </div>
                        
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">Bill Number</label>
//                           <input
//                             type="text"
//                             placeholder="Bill Number"
//                             value={bill.billNo}
//                             onChange={(e) => updateBill(bill.id, 'billNo', e.target.value)}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               {/* Notes Section */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Notes</h3>
//                 <textarea
//                   rows="4"
//                   value={formData.notes}
//                   onChange={(e) => handleFormChange('notes', e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="Enter any additional notes or comments..."
//                 />
//               </div>
              
//               <div className="mt-6 flex justify-end space-x-4">
//                 <button
//                   onClick={() => {
//                     resetForm();
//                     setIsAdding(false);
//                   }}
//                   className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg"
//                 >
//                   {currentOperationId ? 'Update Operation' : 'Save Operation'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Operations Table */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
//             <h2 className="text-xl font-bold text-white">Clearance Operations</h2>
//           </div>
          
//           <table className="min-w-full table-auto border-collapse">
//             <thead className="bg-indigo-600 text-white text-sm font-semibold">
//               <tr>
//                 {[
//                   { label: 'Client', key: 'client' },
//                   { label: 'Job No', key: 'jobNo' },
//                   { label: 'Type', key: 'operationType' },
//                   { label: 'Mode', key: 'transportMode' },
//                   { label: 'Vessel', key: 'vessel' },
//                   { label: 'POL', key: 'pol' },
//                   { label: 'Status', key: 'status' },
//                   { label: 'Actions', key: null },
//                 ].map(({ label, key }) => (
//                   <th
//                     key={label}
//                     className={`px-4 py-3 text-left cursor-pointer select-none ${
//                       key && 'hover:bg-indigo-700'
//                     }`}
//                     onClick={() => key && handleSort(key)}
//                   >
//                     <div className="flex items-center">
//                       {label}
//                       {key && sortField === key && (
//                         <ChevronDown
//                           className={`w-4 h-4 ml-1 transition-transform ${
//                             sortDirection === 'asc' ? 'rotate-180' : ''
//                           }`}
//                         />
//                       )}
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {currentOperations.length > 0 ? (
//                 currentOperations.map((operation) => (
//                   <tr key={operation.id} className="border-b border-gray-200 hover:bg-gray-50">
//                     <td className="px-4 py-3">{operation.client}</td>
//                     <td className="px-4 py-3">{operation.jobNo}</td>
//                     <td className="px-4 py-3">{operation.operationType}</td>
//                     <td className="px-4 py-3">{operation.transportMode}</td>
//                     <td className="px-4 py-3">{operation.vessel || '-'}</td>
//                     <td className="px-4 py-3">{operation.pol || '-'}</td>
//                     <td className="px-4 py-3">
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         operation.status === 'Completed' 
//                           ? 'bg-green-100 text-green-800' 
//                           : operation.status === 'In Progress' 
//                             ? 'bg-yellow-100 text-yellow-800' 
//                             : 'bg-blue-100 text-blue-800'
//                       }`}>
//                         {operation.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 flex space-x-3">
//                       <button
//                         onClick={() => handleEdit(operation)}
//                         title="Edit"
//                         className="text-indigo-600 hover:text-indigo-800"
//                       >
//                         <Pencil className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(operation.id)}
//                         title="Delete"
//                         className="text-red-600 hover:text-red-800"
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
//                     No operations found. Click "Add Operation" to create one.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
          
//           {/* Pagination */}
//           <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
//             <div className="text-sm text-gray-700">
//               Showing {indexOfFirstOperation + 1} to{' '}
//               {Math.min(indexOfLastOperation, filteredOperations.length)} of {filteredOperations.length} results
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setCurrentOperationsPage((p) => Math.max(p - 1, 1))}
//                 disabled={currentOperationsPage === 1}
//                 className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
//                 title="Previous"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => setCurrentOperationsPage((p) => Math.min(p + 1, totalOperationsPages))}
//                 disabled={currentOperationsPage === totalOperationsPages || totalOperationsPages === 0}
//                 className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
//                 title="Next"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-center gap-5 mt-6">
//           <button
//             onClick={handleAddFiles}
//             className="px-6 py-2.5 border-0 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 flex items-center gap-2 uppercase tracking-wide bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:scale-105 hover:shadow-xl shadow-md transform"
//           >
//             <FileText size={14} />
//             Add Files
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClearanceOperation;


import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Plus,
  X,
  FileText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Pencil,
  Trash2,
  Activity,
  Users,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

// Floating input with label
const FloatingInput = ({
  label,
  value,
  onChange,
  type = "text",
  required,
  ...rest
}) => (
  <div className="relative">
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className={`
        block px-4 pt-6 pb-2 w-full text-base text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent peer
      `}
      placeholder=" "
      {...rest}
    />
    <label
      className={`
        absolute left-4 top-2 text-sm text-gray-500 duration-300 transform -translate-y-2 scale-90 bg-white px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-4 peer-focus:scale-90 peer-focus:-translate-y-2 pointer-events-none
      `}
    >
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
  </div>
);

// Stats summary card
const StatCard = ({ title, value, icon, trend, accent }) => (
  <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-3 items-start border border-gray-100 min-w-[160px] transition-all hover:scale-105 hover:shadow-xl">
    <div
      className={`flex items-center justify-center w-10 h-10 rounded-xl ${
        accent || "bg-gradient-to-br from-indigo-600 to-purple-600"
      } text-white`}
    >
      {icon}
    </div>
    <div className="flex flex-col mt-2">
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-gray-500 font-medium">{title}</span>
      {trend && (
        <span
          className={`mt-1 text-xs font-semibold ${
            trend.startsWith("+") ? "text-emerald-500" : "text-red-500"
          }`}
        >
          {trend}
        </span>
      )}
    </div>
  </div>
);

// Quick action button
const QuickAction = ({ icon, label, onClick }) => (
  <button
    className="flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-100 shadow-sm group transition-all"
    onClick={onClick}
    aria-label={label}
    type="button"
  >
    <span className="mb-1 text-indigo-600 group-hover:scale-110">{icon}</span>
    <span className="text-xs font-semibold text-gray-700">{label}</span>
  </button>
);

// Collapsible/section card
const SectionCard = ({ title, children, collapsible, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section
      className={`mb-7 bg-indigo-50/40 rounded-xl shadow border border-gray-100 transition-all`}
      aria-label={title}
    >
      <button
        className="w-full flex justify-between items-center px-5 py-3 focus:outline-none"
        type="button"
        aria-expanded={open}
        onClick={() => collapsible && setOpen(!open)}
      >
        <h3 className="text-md font-bold text-indigo-800 tracking-wide">
          {title}
        </h3>
        {collapsible && (
          <span className={`transition-transform ${open ? "" : "rotate-180"}`}>
            <ChevronDown className="w-5 h-5 text-indigo-400" />
          </span>
        )}
      </button>
      <div
        className={`overflow-hidden transition-all px-5 pb-5 ${
          open ? "max-h-[4000px]" : "max-h-0"
        }`}
      >
        {open && children}
      </div>
    </section>
  );
};

// Initial form data structure
const initialFormData = {
  operationType: "Import",
  transportMode: "Sea",
  client: "",
  jobNo: "",
  commodity: "",
  noOfPackages: "",
  pod: "",
  line: "",
  vessel: "",
  netWeight: "",
  grossWeight: "",
  shipper: "",
  clientRefName: "",
  lineAgent: "",
  representative: "",
  receivingRep: "",
  pol: "",
  bayanNo: "",
  bayanDate: "",
  paymentDate: "",
  group: "",
  eta: "",
  date: "",
  yardDate: "",
  hijriDate: "",
  endDate: "",
  releaseDate: "",
  status: "",
  notes: "",
  bl: "",
  poNo: "",
};

const ClearanceOperation = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [containers, setContainers] = useState([
    { id: Date.now(), qty: "", type: "" },
  ]);
  const [bills, setBills] = useState([
    { id: Date.now(), clientRef: "", doDate: "", doNo: "", endorseNo: "", billNo: "" },
  ]);
  const [operations, setOperations] = useState([]);
  const [currentOperationId, setCurrentOperationId] = useState(null);
  const [currentContainerPage, setCurrentContainerPage] = useState(1);
  const [currentOperationsPage, setCurrentOperationsPage] = useState(1);
  const [sortField, setSortField] = useState("client");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showStats] = useState(true);

  // Constants
  const vesselOptions = [
    "Select",
    "MSC Maya",
    "OOCL Hamburg",
    "Maersk Madrid",
    "CMA CGM Liberty",
  ];
  const polOptions = ["Select", "Jeddah", "Dubai", "Shanghai", "Rotterdam"];
  const containerTypes = ["20GP", "40GP", "40HC", "45HC", "20RF", "40RF"];
  const itemsPerPageForContainers = 5;
  const itemsPerPageForOperations = 5;

  // Stats
  const completedOps = operations.filter((o) => o.status === "Completed").length;
  const activeOps = operations.filter((o) => o.status === "In Progress").length;

  // Handlers
  const handleFormChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const addContainer = () => {
    setContainers((prev) => [
      ...prev,
      { id: Date.now(), qty: "", type: "" },
    ]);
    setCurrentContainerPage(
      Math.ceil((containers.length + 1) / itemsPerPageForContainers)
    );
  };
  const removeContainer = (id) => {
    if (containers.length > 1)
      setContainers((prev) => prev.filter((container) => container.id !== id));
  };
  const updateContainer = (id, field, value) => {
    setContainers((prev) =>
      prev.map((container) =>
        container.id === id ? { ...container, [field]: value } : container
      )
    );
  };

  const addBill = () => {
    setBills((prev) => [
      ...prev,
      {
        id: Date.now(),
        clientRef: "",
        doDate: "",
        doNo: "",
        endorseNo: "",
        billNo: "",
      },
    ]);
  };
  const removeBill = (id) => {
    if (bills.length > 1)
      setBills((prev) => prev.filter((bill) => bill.id !== id));
  };
  const updateBill = (id, field, value) => {
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === id ? { ...bill, [field]: value } : bill
      )
    );
  };

  const handleAddFiles = () => {
    alert("File upload functionality would go here");
  };

  const handleSave = () => {
    const newOperation = {
      id: currentOperationId || Date.now(),
      ...formData,
      containers,
      bills,
    };
    if (currentOperationId) {
      setOperations((prev) =>
        prev.map((op) => (op.id === currentOperationId ? newOperation : op))
      );
    } else {
      setOperations((prev) => [...prev, newOperation]);
    }
    resetForm();
    setIsAdding(false);
  };

  const handleEdit = (operation) => {
    setFormData({ ...operation });
    setContainers(operation.containers);
    setBills(operation.bills);
    setCurrentOperationId(operation.id);
    setIsAdding(true);
  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this operation?"))
      setOperations((prev) => prev.filter((op) => op.id !== id));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setContainers([{ id: Date.now(), qty: "", type: "" }]);
    setBills([
      { id: Date.now(), clientRef: "", doDate: "", doNo: "", endorseNo: "", billNo: "" },
    ]);
    setCurrentOperationId(null);
    setCurrentContainerPage(1);
  };

  // Sorting
  const handleSort = (field) => {
    if (sortField === field) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Pagination containers
  const indexOfLastContainer = currentContainerPage * itemsPerPageForContainers;
  const indexOfFirstContainer = indexOfLastContainer - itemsPerPageForContainers;
  const currentContainers = containers.slice(indexOfFirstContainer, indexOfLastContainer);
  const totalContainerPages = Math.ceil(containers.length / itemsPerPageForContainers);

  // Pagination & sorting for operations
  const sortedOperations = [...operations].sort((a, b) => {
    const aValue = a[sortField] || "";
    const bValue = b[sortField] || "";
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const filteredOperations = sortedOperations.filter(
    (op) =>
      op.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.jobNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.operationType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.transportMode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.vessel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.pol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastOperation = currentOperationsPage * itemsPerPageForOperations;
  const indexOfFirstOperation = indexOfLastOperation - itemsPerPageForOperations;
  const currentOperations = filteredOperations.slice(indexOfFirstOperation, indexOfLastOperation);
  const totalOperationsPages = Math.ceil(filteredOperations.length / itemsPerPageForOperations);

  useEffect(() => {
    setCurrentOperationsPage(1);
  }, [searchTerm]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-0 md:p-5 relative">
      <div className="max-w-7xl mx-auto pt-8 pb-6 px-2 md:px-0">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <div>
            <div className="flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-indigo-700" />
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Clearance Operations</h2>
            </div>
            <p className="text-gray-500 text-xs font-medium mt-1 mb-2">Manage clearance jobs, containers and documents.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-72 transition-all focus-within:ring-2 focus-within:ring-indigo-300 focus-within:bg-white">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search operations..."
                className="bg-transparent flex-1 text-sm text-gray-700 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                resetForm();
                setIsAdding(!isAdding);
              }}
              className={`px-5 py-2 text-white rounded-lg font-medium flex items-center shadow-md transition-all gap-2
                ${isAdding
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                }`}
              aria-label={isAdding ? "Close Operation Form" : "Add Operation"}
            >
              {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {isAdding ? "Close" : "Add Operation"}
            </button>
          </div>
        </div>
        {/* Stats Overview */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7 mt-2">
            <StatCard
              title="Total Operations"
              value={operations.length}
              icon={<ClipboardList size={22} />}
              trend={operations.length ? "+10%" : ""}
            />
            <StatCard
              title="In Progress"
              value={activeOps}
              icon={<Activity size={22} />}
              trend={activeOps ? "+5%" : ""}
              accent="bg-emerald-500"
            />
            <StatCard
              title="Completed"
              value={completedOps}
              icon={<CheckCircle2 size={22} />}
              trend={completedOps ? "+9%" : ""}
              accent="bg-purple-500"
            />
            <StatCard
              title="Clients"
              value={new Set(operations.map((o) => o.client)).size}
              icon={<Users size={22} />}
              accent="bg-indigo-500"
            />
          </div>
        )}
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <QuickAction icon={<Plus size={18} />} label="Add" onClick={() => setIsAdding(true)} />
          <QuickAction icon={<FileText size={18} />} label="Add Files" onClick={handleAddFiles} />
          <QuickAction icon={<ClipboardList size={18} />} label="Import" onClick={() => alert("Import feature coming soon!")} />
          <QuickAction icon={<ClipboardList size={18} />} label="Export" onClick={() => alert("Export feature coming soon!")} />
        </div>
        {/* Add Operation Form */}
        <section
          className={`${isAdding ? "block" : "hidden"
            } bg-white rounded-2xl shadow-2xl overflow-hidden mb-10 animate-fade-in`}
          aria-label="Add or Edit Clearance Operation"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center">
              <ClipboardList className="w-5 h-5 mr-2" />
              {currentOperationId ? "Edit Clearance Operation" : "Add New Clearance Operation"}
            </h2>
          </div>
          <form
            className="p-0 md:p-8"
            onSubmit={e => {
              e.preventDefault();
              handleSave();
            }}
            autoComplete="off"
          >
            {/* Basic Info */}
            <SectionCard title="Basic Information" collapsible={true} defaultOpen={true}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Operation Type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                      {["Export", "Import"].map((t) => (
                        <label key={t} className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            name="operationType"
                            value={t}
                            checked={formData.operationType === t}
                            onChange={(e) => handleFormChange("operationType", e.target.value)}
                            className="accent-indigo-600"
                            required
                          />
                          {t}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Transport Mode <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                      {["Land", "Air", "Sea"].map((t) => (
                        <label key={t} className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            name="transportMode"
                            value={t}
                            checked={formData.transportMode === t}
                            onChange={(e) => handleFormChange("transportMode", e.target.value)}
                            className="accent-indigo-600"
                            required
                          />
                          {t}
                        </label>
                      ))}
                    </div>
                  </div>
                  <FloatingInput
                    label="Client"
                    required
                    value={formData.client}
                    onChange={e => handleFormChange("client", e.target.value)}
                  />
                  <FloatingInput
                    label="Job Number"
                    required
                    value={formData.jobNo}
                    onChange={e => handleFormChange("jobNo", e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                  <FloatingInput
                    label="Client Reference"
                    value={formData.clientRefName}
                    onChange={e => handleFormChange("clientRefName", e.target.value)}
                  />
                  <FloatingInput
                    label="Bayan No"
                    value={formData.bayanNo}
                    onChange={e => handleFormChange("bayanNo", e.target.value)}
                  />
                  <FloatingInput
                    label="Status"
                    value={formData.status}
                    onChange={e => handleFormChange("status", e.target.value)}
                  />
                  <FloatingInput
                    label="PO Number"
                    value={formData.poNo}
                    onChange={e => handleFormChange("poNo", e.target.value)}
                  />
                </div>
              </div>
            </SectionCard>
            {/* Shipping & Logistics */}
            <SectionCard title="Shipping & Logistics" collapsible={true}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FloatingInput
                    label="Shipping Line"
                    value={formData.line}
                    onChange={e => handleFormChange("line", e.target.value)}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vessel</label>
                    <select
                      value={formData.vessel}
                      onChange={e => handleFormChange("vessel", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {vesselOptions.map((option, i) => (
                        <option key={i} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <FloatingInput
                    label="Line Agent"
                    value={formData.lineAgent}
                    onChange={e => handleFormChange("lineAgent", e.target.value)}
                  />
                  <FloatingInput
                    label="ETA"
                    value={formData.eta}
                    onChange={e => handleFormChange("eta", e.target.value)}
                    type="date"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">POL</label>
                    <select
                      value={formData.pol}
                      onChange={e => handleFormChange("pol", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {polOptions.map((option, i) => (
                        <option key={i} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <FloatingInput
                    label="POD"
                    value={formData.pod}
                    onChange={e => handleFormChange("pod", e.target.value)}
                  />
                  <FloatingInput
                    label="Representative"
                    value={formData.representative}
                    onChange={e => handleFormChange("representative", e.target.value)}
                  />
                  <FloatingInput
                    label="Receiving Rep"
                    value={formData.receivingRep}
                    onChange={e => handleFormChange("receivingRep", e.target.value)}
                  />
                </div>
              </div>
            </SectionCard>
            {/* Cargo Info */}
            <SectionCard title="Cargo Information" collapsible={true}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FloatingInput
                    label="Commodity"
                    value={formData.commodity}
                    onChange={e => handleFormChange("commodity", e.target.value)}
                  />
                  <FloatingInput
                    label="Packages"
                    value={formData.noOfPackages}
                    onChange={e => handleFormChange("noOfPackages", e.target.value)}
                    type="number"
                  />
                  <FloatingInput
                    label="Shipper"
                    value={formData.shipper}
                    onChange={e => handleFormChange("shipper", e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                  <FloatingInput
                    label="Bill of Lading"
                    value={formData.bl}
                    onChange={e => handleFormChange("bl", e.target.value)}
                  />
                  <FloatingInput
                    label="Net Weight (KG)"
                    value={formData.netWeight}
                    onChange={e => handleFormChange("netWeight", e.target.value)}
                    type="number"
                  />
                  <FloatingInput
                    label="Gross Weight (KG)"
                    value={formData.grossWeight}
                    onChange={e => handleFormChange("grossWeight", e.target.value)}
                    type="number"
                  />
                </div>
              </div>
            </SectionCard>
            {/* Documentation & Timeline */}
            <SectionCard title="Documentation & Timeline" collapsible={true}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FloatingInput
                    label="Bayan Date"
                    value={formData.bayanDate}
                    onChange={e => handleFormChange("bayanDate", e.target.value)}
                    type="date"
                  />
                  <FloatingInput
                    label="Date"
                    value={formData.date}
                    onChange={e => handleFormChange("date", e.target.value)}
                    type="date"
                  />
                  <FloatingInput
                    label="Yard Date"
                    value={formData.yardDate}
                    onChange={e => handleFormChange("yardDate", e.target.value)}
                    type="date"
                  />
                </div>
                <div className="space-y-4">
                  <FloatingInput
                    label="Payment Date"
                    value={formData.paymentDate}
                    onChange={e => handleFormChange("paymentDate", e.target.value)}
                    type="date"
                  />
                  <FloatingInput
                    label="End Date"
                    value={formData.endDate}
                    onChange={e => handleFormChange("endDate", e.target.value)}
                    type="date"
                  />
                  <FloatingInput
                    label="Release Date"
                    value={formData.releaseDate}
                    onChange={e => handleFormChange("releaseDate", e.target.value)}
                    type="date"
                  />
                </div>
              </div>
            </SectionCard>
            {/* Container Info */}
            <SectionCard title="Container Information" collapsible={true}>
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={addContainer}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                  type="button"
                >
                  <Plus className="w-5 h-5" />
                  Add Container
                </button>
              </div>
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead className="bg-indigo-50 text-indigo-600 text-sm font-semibold">
                    <tr>
                      <th className="px-4 py-3 text-left">Qty</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentContainers.map((container) => (
                      <tr
                        key={container.id}
                        className="border-b border-gray-100 hover:bg-indigo-50 transition"
                      >
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={container.qty}
                            onChange={(e) =>
                              updateContainer(container.id, "qty", e.target.value)
                            }
                            className="w-20 px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={container.type}
                            onChange={(e) =>
                              updateContainer(container.id, "type", e.target.value)
                            }
                            className="w-24 px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            <option value="">Select</option>
                            {containerTypes.map((type, idx) => (
                              <option key={idx} value={type}>{type}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => removeContainer(container.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Remove container"
                            type="button"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100 bg-gray-50">
                  <div className="text-sm text-gray-700">
                    Showing {indexOfFirstContainer + 1} to{" "}
                    {Math.min(indexOfLastContainer, containers.length)} of {containers.length} containers
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setCurrentContainerPage((p) => Math.max(p - 1, 1))
                      }
                      disabled={currentContainerPage === 1}
                      className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
                      title="Previous"
                      type="button"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentContainerPage((p) =>
                          Math.min(p + 1, totalContainerPages)
                        )
                      }
                      disabled={
                        currentContainerPage === totalContainerPages || totalContainerPages === 0
                      }
                      className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
                      title="Next"
                      type="button"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </SectionCard>
            {/* Bills & Documentation */}
            <SectionCard title="Bills & Documentation" collapsible={true}>
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={addBill}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                  type="button"
                >
                  <Plus className="w-5 h-5" />
                  Add Bill
                </button>
              </div>
              <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                {bills.map((bill, idx) => (
                  <div
                    key={bill.id}
                    className="border border-gray-100 rounded-lg p-4 mb-4 bg-indigo-50/60"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-bold text-gray-700">
                        Bill #{idx + 1}
                      </span>
                      <button
                        onClick={() => removeBill(bill.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Remove bill"
                        type="button"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FloatingInput
                        label="Client Reference"
                        value={bill.clientRef}
                        onChange={e =>
                          updateBill(bill.id, "clientRef", e.target.value)
                        }
                      />
                      <FloatingInput
                        label="DO Date"
                        value={bill.doDate}
                        onChange={e =>
                          updateBill(bill.id, "doDate", e.target.value)
                        }
                        type="date"
                      />
                      <FloatingInput
                        label="DO Number"
                        value={bill.doNo}
                        onChange={e =>
                          updateBill(bill.id, "doNo", e.target.value)
                        }
                      />
                      <FloatingInput
                        label="Endorse Number"
                        value={bill.endorseNo}
                        onChange={e =>
                          updateBill(bill.id, "endorseNo", e.target.value)
                        }
                      />
                      <FloatingInput
                        label="Bill Number"
                        value={bill.billNo}
                        onChange={e =>
                          updateBill(bill.id, "billNo", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
            {/* Notes */}
            <SectionCard title="Additional Notes" collapsible={true}>
              <textarea
                rows="3"
                value={formData.notes}
                onChange={e => handleFormChange("notes", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter any additional notes or comments..."
              />
            </SectionCard>
            {/* Form Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  resetForm();
                  setIsAdding(false);
                }}
                type="button"
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg"
              >
                {currentOperationId ? "Update Operation" : "Save Operation"}
              </button>
            </div>
          </form>
        </section>
        {/* Operations Table */}
        <section className="bg-white rounded-2xl shadow-2xl overflow-x-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h2 className="text-lg font-bold text-white">Clearance Operations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-indigo-100 text-indigo-700 text-sm font-semibold">
                <tr>
                  {[
                    { label: "Client", key: "client" },
                    { label: "Job No", key: "jobNo" },
                    { label: "Type", key: "operationType" },
                    { label: "Mode", key: "transportMode" },
                    { label: "Vessel", key: "vessel" },
                    { label: "POL", key: "pol" },
                    { label: "Status", key: "status" },
                    { label: "Actions", key: null },
                  ].map(({ label, key }) => (
                    <th
                      key={label}
                      className={`px-4 py-3 text-left cursor-pointer select-none ${
                        key && "hover:bg-indigo-200"
                      }`}
                      onClick={() => key && handleSort(key)}
                    >
                      <div className="flex items-center">
                        {label}
                        {key && sortField === key && (
                          <ChevronDown
                            className={`w-4 h-4 ml-1 transition-transform ${
                              sortDirection === "asc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentOperations.length > 0 ? (
                  currentOperations.map((operation, idx) => (
                    <tr
                      key={operation.id}
                      className={`border-b border-gray-100 hover:bg-indigo-50 transition
                        ${idx % 2 ? "bg-gray-50" : "bg-white"}
                      `}
                    >
                      <td className="px-4 py-3">{operation.client}</td>
                      <td className="px-4 py-3">{operation.jobNo}</td>
                      <td className="px-4 py-3">{operation.operationType}</td>
                      <td className="px-4 py-3">{operation.transportMode}</td>
                      <td className="px-4 py-3">{operation.vessel || "-"}</td>
                      <td className="px-4 py-3">{operation.pol || "-"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs
                            ${
                              operation.status === "Completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : operation.status === "In Progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {operation.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex space-x-2">
                        <button
                          onClick={() => handleEdit(operation)}
                          title="Edit"
                          className="text-indigo-600 hover:text-indigo-800"
                          type="button"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(operation.id)}
                          title="Delete"
                          className="text-red-600 hover:text-red-800"
                          type="button"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                      No operations found. Click "Add Operation" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstOperation + 1} to{" "}
              {Math.min(indexOfLastOperation, filteredOperations.length)} of {filteredOperations.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  setCurrentOperationsPage((p) => Math.max(p - 1, 1))
                }
                disabled={currentOperationsPage === 1}
                className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
                title="Previous"
                type="button"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setCurrentOperationsPage((p) =>
                    Math.min(p + 1, totalOperationsPages)
                  )
                }
                disabled={
                  currentOperationsPage === totalOperationsPages ||
                  totalOperationsPages === 0
                }
                className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
                title="Next"
                type="button"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ClearanceOperation;