// import React, { useState, useEffect } from "react";
// import {
//   ClipboardList,
//   Plus,
//   X,
//   FileText,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   Search,
//   Pencil,
//   Trash2,
//   Activity,
//   Users,
//   CheckCircle2,
// } from "lucide-react";
// import axios from 'axios';
// import { format } from 'date-fns';

// // API Configuration
// const API_URL = "http://localhost:5000/api";

// // Authentication helper function
// const getAuthHeaders = () => {
//   const token = localStorage.getItem('authToken');
//   if (!token) throw new Error('Authentication token missing');
//   return { 'Authorization': `Bearer ${token}` };
// };

// // API Services with authentication
// const clearanceOperationsAPI = {
//   getAll: () => axios.get(`${API_URL}/clearance-operations`, { headers: getAuthHeaders() }),
//   getById: (id) => axios.get(`${API_URL}/clearance-operations/${id}`, { headers: getAuthHeaders() }),
//   create: (data) => axios.post(`${API_URL}/clearance-operations`, data, { headers: getAuthHeaders() }),
//   update: (id, data) => axios.put(`${API_URL}/clearance-operations/${id}`, data, { headers: getAuthHeaders() }),
//   delete: (id) => axios.delete(`${API_URL}/clearance-operations/${id}`, { headers: getAuthHeaders() }),
// };

// const billsAPI = {
//   getByOperationId: (operationId) => axios.get(`${API_URL}/bills/operation/${operationId}`, { headers: getAuthHeaders() }),
//   create: (data) => axios.post(`${API_URL}/bills`, data, { headers: getAuthHeaders() }),
//   update: (id, data) => axios.put(`${API_URL}/bills/${id}`, data, { headers: getAuthHeaders() }),
//   delete: (id) => axios.delete(`${API_URL}/bills/${id}`, { headers: getAuthHeaders() }),
// };

// // Floating input with label
// const FloatingInput = ({
//   label,
//   value,
//   onChange,
//   type = "text",
//   required,
//   ...rest
// }) => (
//   <div className="relative">
//     <input
//       type={type}
//       value={value}
//       onChange={onChange}
//       required={required}
//       className={`block px-4 pt-6 pb-2 w-full text-base text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent peer`}
//       placeholder=" "
//       {...rest}
//     />
//     <label
//       className={`absolute left-4 top-2 text-sm text-gray-500 duration-300 transform -translate-y-2 scale-90 bg-white px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-4 peer-focus:scale-90 peer-focus:-translate-y-2 pointer-events-none`}
//     >
//       {label}
//       {required && <span className="text-red-500">*</span>}
//     </label>
//   </div>
// );

// // Stats summary card
// const StatCard = ({ title, value, icon, trend, accent }) => (
//   <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-3 items-start border border-gray-100 min-w-[160px] transition-all hover:scale-105 hover:shadow-xl">
//     <div
//       className={`flex items-center justify-center w-10 h-10 rounded-xl ${
//         accent || "bg-gradient-to-br from-indigo-600 to-purple-600"
//       } text-white`}
//     >
//       {icon}
//     </div>
//     <div className="flex flex-col mt-2">
//       <span className="text-2xl font-bold">{value}</span>
//       <span className="text-gray-500 font-medium">{title}</span>
//       {trend && (
//         <span
//           className={`mt-1 text-xs font-semibold ${
//             trend.startsWith("+") ? "text-emerald-500" : "text-red-500"
//           }`}
//         >
//           {trend}
//         </span>
//       )}
//     </div>
//   </div>
// );

// // Quick action button
// const QuickAction = ({ icon, label, onClick }) => (
//   <button
//     className="flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-100 shadow-sm group transition-all"
//     onClick={onClick}
//     aria-label={label}
//     type="button"
//   >
//     <span className="mb-1 text-indigo-600 group-hover:scale-110">{icon}</span>
//     <span className="text-xs font-semibold text-gray-700">{label}</span>
//   </button>
// );

// // Collapsible/section card
// const SectionCard = ({ title, children, collapsible, defaultOpen = true }) => {
//   const [open, setOpen] = useState(defaultOpen);
//   return (
//     <section
//       className={`mb-7 bg-indigo-50/40 rounded-xl shadow border border-gray-100 transition-all`}
//       aria-label={title}
//     >
//       <button
//         className="w-full flex justify-between items-center px-5 py-3 focus:outline-none"
//         type="button"
//         aria-expanded={open}
//         onClick={() => collapsible && setOpen(!open)}
//       >
//         <h3 className="text-md font-bold text-indigo-800 tracking-wide">
//           {title}
//         </h3>
//         {collapsible && (
//           <span className={`transition-transform ${open ? "" : "rotate-180"}`}>
//             <ChevronDown className="w-5 h-5 text-indigo-400" />
//           </span>
//         )}
//       </button>
//       <div
//         className={`overflow-hidden transition-all px-5 pb-5 ${
//           open ? "max-h-[4000px]" : "max-h-0"
//         }`}
//       >
//         {open && children}
//       </div>
//     </section>
//   );
// };

// // Initial form data structure
// const initialFormData = {
//   operation_type: "Import",
//   transport_mode: "Sea",
//   client: "",
//   job_no: "",
//   commodity: "",
//   no_of_packages: "",
//   pod: "",
//   line: "",
//   vessel: "",
//   net_weight: "",
//   gross_weight: "",
//   shipper: "",
//   client_ref_name: "",
//   line_agent: "",
//   representative: "",
//   receiving_rep: "",
//   pol: "",
//   bayan_no: "",
//   bayan_date: "",
//   payment_date: "",
//   group_name: "",
//   eta: "",
//   date: "",
//   yard_date: "",
//   hijri_date: "",
//   end_date: "",
//   release_date: "",
//   status: "",
//   notes: "",
//   bl: "",
//   po_no: "",
// };

// const ClearanceOperation = () => {
//   const [formData, setFormData] = useState(initialFormData);
//   const [isLoading, setIsLoading] = useState(false);
//   const [bills, setBills] = useState([
//     { id: null, clientRef: "", doDate: "", doNo: "", endorseNo: "", billNo: "" },
//   ]);
  

//   const [originalBills, setOriginalBills] = useState([]);
//   const [operations, setOperations] = useState([]);
//   const [currentOperationId, setCurrentOperationId] = useState(null);
//   const [currentContainerPage, setCurrentContainerPage] = useState(1);
//   const [currentOperationsPage, setCurrentOperationsPage] = useState(1);
//   const [sortField, setSortField] = useState("client");
//   const [sortDirection, setSortDirection] = useState("asc");
//   const [isAdding, setIsAdding] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showStats] = useState(true);
//   const [setLoading] = useState(false);
//   const [authError, setAuthError] = useState(null);
//   const [vessels, setVessels] = useState([]);
//   const [polList, setPolList] = useState([]);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [containers, setContainers] = useState([]);

//   const fetchContainers = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/containers', {
//         headers: getAuthHeaders(),
//       });
//       setContainers(response.data);
//     } catch (error) {
//       console.error('Failed to fetch containers:', error);
//       alert('Error fetching containers. Please check your authentication or try again later.');
//     }
//   };

//   useEffect(() => {
//     fetchContainers();
//   }, []);


  
//   const fetchVessels = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/vessels/', {
//         headers: getAuthHeaders(),
//       });
//       if (!res.ok) throw new Error('Could not fetch vessels');
//       const data = await res.json();
//       setVessels(
//         data.map(item => ({
//           id: item.id,
//           vesselName: item.name,
//           vesselNo: item.number,
//           status: item.status || 'Active'
//         }))
//       );
//     } catch (err) {
//       console.error(err);
//       setFeedback({ type: 'error', msg: 'Failed to load vessels' });
//     }
//   };
//   useEffect(() => {
//     fetchVessels();
//   }, []);
    
//   const fetchPolList = async () => {
//     setIsLoading(true);
//     setErrorMsg('');
//     try {
//       const response = await axios.get('http://localhost:5000/api/ports', {
//         headers: getAuthHeaders(),
//       });
//       setPolList(response.data);
//     } catch (error) {
//       setErrorMsg("Error fetching POL list. Please login or try again.");
//       setPolList([]);
//     }
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     fetchPolList();
//   }, []);
  
//   const containerTypes = ["20GP", "40GP", "40HC", "45HC", "20RF", "40RF"];
//   const itemsPerPageForContainers = 5;
//   const itemsPerPageForOperations = 5;

//   // Stats
//   const completedOps = operations.filter((o) => o.status === "Completed").length;
//   const activeOps = operations.filter((o) => o.status === "In Progress").length;

//   // Fetch all operations on component mount
//   useEffect(() => {
//     fetchOperations();
//   }, []);

//   const fetchOperations = async () => {
//     setIsLoading(true);
//     setAuthError(null);
//     try {
//       const response = await clearanceOperationsAPI.getAll();
//       setOperations(response.data);
//     } catch (error) {
//       handleApiError(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle API errors including authentication issues
//   const handleApiError = (error) => {
//     if (error.message === 'Authentication token missing') {
//       setAuthError("You need to log in to access this page");
//       // Redirect to login or handle authentication
//       console.error("Authentication required");
//     } else if (error.response?.status === 401) {
//       setAuthError("Session expired. Please log in again.");
//     } else {
//       console.error("API Error:", error);
//       alert(`Operation failed: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   // Handlers
//   const handleFormChange = (field, value) =>
//     setFormData((prev) => ({ ...prev, [field]: value }));

//   const addContainer = () => {
//     setContainers((prev) => [
//       ...prev,
//       { id: Date.now(), qty: "", type: "" },
//     ]);
//     setCurrentContainerPage(
//       Math.ceil((containers.length + 1) / itemsPerPageForContainers)
//     );
//   };
  
//   const removeContainer = (id) => {
//     if (containers.length > 1)
//       setContainers((prev) => prev.filter((container) => container.id !== id));
//   };
  
//   const updateContainer = (id, field, value) => {
//     setContainers((prev) =>
//       prev.map((container) =>
//         container.id === id ? { ...container, [field]: value } : container
//       )
//     );
//   };

//   const addBill = () => {
//     setBills((prev) => [
//       ...prev,
//       {
//         id: null,
//         clientRef: "",
//         doDate: "",
//         doNo: "",
//         endorseNo: "",
//         billNo: "",
//       },
//     ]);
//   };
  
//   const removeBill = (id) => {
//     if (bills.length > 1)
//       setBills((prev) => prev.filter((bill) => bill.id !== id));
//   };
  
//   const updateBill = (id, field, value) => {
//     setBills((prev) =>
//       prev.map((bill) =>
//         bill.id === id ? { ...bill, [field]: value } : bill
//       )
//     );
//   };

//   const handleAddFiles = () => {
//     alert("File upload functionality would go here");
//   };

//   const prepareOperationData = (data) => {
//     const result = { ...data };
    
//     // Convert empty strings to null for numeric fields
//     const numericFields = ['net_weight', 'no_of_packages', 'gross_weight'];
//     numericFields.forEach(field => {
//       if (result[field] === '') result[field] = null;
//     });
    
//     return result;
//   };

//   const handleSave = async () => {
//     setIsLoading(true);
//     setAuthError(null);
//     try {
//       const opData = prepareOperationData(formData);
//       let operationId = currentOperationId;

//       if (!operationId) {
//         // Create new operation
//         const createRes = await clearanceOperationsAPI.create(opData);
//         operationId = createRes.data.id;
        
//         // Create bills
//         for (const bill of bills) {
//           if (bill.clientRef || bill.doNo || bill.billNo) {
//             await billsAPI.create({ ...bill, operation_id: operationId });
//           }
//         }
//       } else {
//         // Update existing operation
//         await clearanceOperationsAPI.update(operationId, opData);
        
//         // Process bills
//         const currentBills = [...bills];
//         const originalBillsIds = originalBills.map(b => b.id);

//         // Update/Create bills
//         for (const bill of currentBills) {
//           if (bill.id) {
//             await billsAPI.update(bill.id, bill);
//           } else if (bill.clientRef || bill.doNo || bill.billNo) {
//             await billsAPI.create({ ...bill, operation_id: operationId });
//           }
//         }

//         // Delete removed bills
//         const currentBillsIds = currentBills.filter(b => b.id).map(b => b.id);
//         const billsToDeleteIds = originalBillsIds.filter(id => !currentBillsIds.includes(id));
//         for (const id of billsToDeleteIds) {
//           await billsAPI.delete(id);
//         }
//       }

//       // Refresh data and reset form
//       await fetchOperations();
//       resetForm();
//       setIsAdding(false);
//     } catch (error) {
//       handleApiError(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEdit = async (operation) => {
//     setIsLoading(true);
//     setAuthError(null);
//     try {
//       // Fetch operation details and bills
//       const opRes = await clearanceOperationsAPI.getById(operation.id);
//       const billsRes = await billsAPI.getByOperationId(operation.id);
      
//       setFormData(opRes.data);
//       setBills(billsRes.data);
//       setOriginalBills(billsRes.data);
//       setCurrentOperationId(operation.id);
//       setIsAdding(true);
//     } catch (error) {
//       handleApiError(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this operation?")) {
//       setIsLoading(true);
//       setAuthError(null);
//       try {
//         // Delete associated bills first
//         const billsRes = await billsAPI.getByOperationId(id);
//         for (const bill of billsRes.data) {
//           await billsAPI.delete(bill.id);
//         }
        
//         // Delete operation
//         await clearanceOperationsAPI.delete(id);
        
//         // Refresh operations list
//         await fetchOperations();
//       } catch (error) {
//         handleApiError(error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData(initialFormData);
//     setContainers([{ id: Date.now(), qty: "", type: "" }]);
//     setBills([
//       { id: null, clientRef: "", doDate: "", doNo: "", endorseNo: "", billNo: "" },
//     ]);
//     setOriginalBills([]);
//     setCurrentOperationId(null);
//     setCurrentContainerPage(1);
//   };

//   // Sorting
//   const handleSort = (field) => {
//     if (sortField === field) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     else {
//       setSortField(field);
//       setSortDirection("asc");
//     }
//   };

//   // Pagination containers
//   const indexOfLastContainer = currentContainerPage * itemsPerPageForContainers;
//   const indexOfFirstContainer = indexOfLastContainer - itemsPerPageForContainers;
//   const currentContainers = containers.slice(indexOfFirstContainer, indexOfLastContainer);
//   const totalContainerPages = Math.ceil(containers.length / itemsPerPageForContainers);

//   // Pagination & sorting for operations
//   const sortedOperations = [...operations].sort((a, b) => {
//     const aValue = a[sortField] || "";
//     const bValue = b[sortField] || "";
//     if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
//     if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
//     return 0;
//   });

//   const filteredOperations = sortedOperations.filter(
//     (op) =>
//       op.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       op.job_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       op.operation_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       op.transport_mode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       op.vessel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       op.pol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       op.status?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const indexOfLastOperation = currentOperationsPage * itemsPerPageForOperations;
//   const indexOfFirstOperation = indexOfLastOperation - itemsPerPageForOperations;
//   const currentOperations = filteredOperations.slice(indexOfFirstOperation, indexOfLastOperation);
//   const totalOperationsPages = Math.ceil(filteredOperations.length / itemsPerPageForOperations);

//   useEffect(() => {
//     setCurrentOperationsPage(1);
//   }, [searchTerm]);

//   // Format date for input fields
//   const formatDateForInput = (dateString) => {
//     if (!dateString) return "";
//     try {
//       return format(new Date(dateString), "yyyy-MM-dd");
//     } catch {
//       return "";
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-0 md:p-5 relative">
//       {isLoading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <p className="text-lg font-medium">Loading...</p>
//           </div>
//         </div>
//       )}
      
//       {authError && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
//             <h3 className="text-xl font-bold text-red-600 mb-3">Authentication Required</h3>
//             <p className="mb-4">{authError}</p>
//             <button
//               className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
//               onClick={() => window.location.href = '/login'}
//             >
//               Go to Login
//             </button>
//           </div>
//         </div>
//       )}
      
//       <div className="max-w-7xl mx-auto pt-8 pb-6 px-2 md:px-0">
//         {/* Header Bar */}
//         <div className="flex items-center justify-between gap-2 mb-5">
//           <div>
//             <div className="flex items-center gap-3">
//               <ClipboardList className="w-8 h-8 text-indigo-700" />
//               <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Clearance Operations</h2>
//             </div>
//             <p className="text-gray-500 text-xs font-medium mt-1 mb-2">Manage clearance jobs, containers and documents.</p>
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="relative hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-72 transition-all focus-within:ring-2 focus-within:ring-indigo-300 focus-within:bg-white">
//               <Search className="w-4 h-4 text-gray-500 mr-2" />
//               <input
//                 type="text"
//                 placeholder="Search operations..."
//                 className="bg-transparent flex-1 text-sm text-gray-700 outline-none"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <button
//               onClick={() => {
//                 resetForm();
//                 setIsAdding(!isAdding);
//               }}
//               className={`px-5 py-2 text-white rounded-lg font-medium flex items-center shadow-md transition-all gap-2
//                 ${isAdding
//                   ? "bg-red-600 hover:bg-red-700"
//                   : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
//                 }`}
//               aria-label={isAdding ? "Close Operation Form" : "Add Operation"}
//               disabled={isLoading || authError}
//             >
//               {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
//               {isAdding ? "Close" : "Add Operation"}
//             </button>
//           </div>
//         </div>
        
//         {/* Stats Overview */}
//         {showStats && (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7 mt-2">
//             <StatCard
//               title="Total Operations"
//               value={operations.length}
//               icon={<ClipboardList size={22} />}
//               trend={operations.length ? "+10%" : ""}
//             />
//             <StatCard
//               title="In Progress"
//               value={activeOps}
//               icon={<Activity size={22} />}
//               trend={activeOps ? "+5%" : ""}
//               accent="bg-emerald-500"
//             />
//             <StatCard
//               title="Completed"
//               value={completedOps}
//               icon={<CheckCircle2 size={22} />}
//               trend={completedOps ? "+9%" : ""}
//               accent="bg-purple-500"
//             />
//             <StatCard
//               title="Clients"
//               value={new Set(operations.map((o) => o.client)).size}
//               icon={<Users size={22} />}
//               accent="bg-indigo-500"
//             />
//           </div>
//         )}
        
//         {/* Quick Actions */}
//         <div className="flex flex-wrap gap-3 mb-8">
//           <QuickAction icon={<Plus size={18} />} label="Add" onClick={() => setIsAdding(true)} />
//           <QuickAction icon={<FileText size={18} />} label="Add Files" onClick={handleAddFiles} />
//           <QuickAction icon={<ClipboardList size={18} />} label="Import" onClick={() => alert("Import feature coming soon!")} />
//           <QuickAction icon={<ClipboardList size={18} />} label="Export" onClick={() => alert("Export feature coming soon!")} />
//         </div>
        
//         {/* Add Operation Form */}
//         <section
//           className={`${isAdding ? "block" : "hidden"
//             } bg-white rounded-2xl shadow-2xl overflow-hidden mb-10 animate-fade-in`}
//           aria-label="Add or Edit Clearance Operation"
//         >
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
//             <h2 className="text-lg md:text-xl font-bold text-white flex items-center">
//               <ClipboardList className="w-5 h-5 mr-2" />
//               {currentOperationId ? "Edit Clearance Operation" : "Add New Clearance Operation"}
//             </h2>
//           </div>
//           <form
//             className="p-0 md:p-8"
//             onSubmit={e => {
//               e.preventDefault();
//               handleSave();
//             }}
//             autoComplete="off"
//           >
//             {/* Basic Info */}
//             <SectionCard title="Basic Information" collapsible={true} defaultOpen={true}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div className="flex flex-col gap-2">
//                     <label className="text-sm font-medium text-gray-700">
//                       Operation Type <span className="text-red-500">*</span>
//                     </label>
//                     <div className="flex gap-4">
//                       {["Export", "Import"].map((t) => (
//                         <label key={t} className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
//                           <input
//                             type="radio"
//                             name="operation_type"
//                             value={t}
//                             checked={formData.operation_type === t}
//                             onChange={(e) => handleFormChange("operation_type", e.target.value)}
//                             className="accent-indigo-600"
//                             required
//                           />
//                           {t}
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="flex flex-col gap-2">
//                     <label className="text-sm font-medium text-gray-700">
//                       Transport Mode <span className="text-red-500">*</span>
//                     </label>
//                     <div className="flex gap-4">
//                       {["Land", "Air", "Sea"].map((t) => (
//                         <label key={t} className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
//                           <input
//                             type="radio"
//                             name="transport_mode"
//                             value={t}
//                             checked={formData.transport_mode === t}
//                             onChange={(e) => handleFormChange("transport_mode", e.target.value)}
//                             className="accent-indigo-600"
//                             required
//                           />
//                           {t}
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                   <FloatingInput
//                     label="Client"
//                     required
//                     value={formData.client}
//                     onChange={e => handleFormChange("client", e.target.value)}
//                   />
//                   <FloatingInput
//                     label="Job Number"
//                     required
//                     value={formData.job_no}
//                     onChange={e => handleFormChange("job_no", e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-4">
//                   <FloatingInput
//                     label="Client Reference"
//                     value={formData.client_ref_name}
//                     onChange={e => handleFormChange("client_ref_name", e.target.value)}
//                   />
//                   <FloatingInput
//                     label="Bayan No"
//                     value={formData.bayan_no}
//                     onChange={e => handleFormChange("bayan_no", e.target.value)}
//                   />
//                   <FloatingInput
//                     label="Status"
//                     value={formData.status}
//                     onChange={e => handleFormChange("status", e.target.value)}
//                   />
//                   <FloatingInput
//                     label="PO Number"
//                     value={formData.po_no}
//                     onChange={e => handleFormChange("po_no", e.target.value)}
//                   />
//                 </div>
//               </div>
//             </SectionCard>
            
//             {/* Shipping & Logistics */}
//             <SectionCard title="Shipping & Logistics" collapsible={true}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <FloatingInput
//                     label="Shipping Line"
//                     value={formData.line}
//                     onChange={e => handleFormChange("line", e.target.value)}
//                   />
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Vessel</label>
//                     <select
//                       value={formData.vessel}
//                       onChange={e => handleFormChange("vessel", e.target.value)}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     >
//                       <option value="">Select</option>
//                       {vessels.map((vessel) => (
//                         <option key={vessel.id} value={vessel.vesselName}>
//                           {vessel.vesselName} ({vessel.vesselNo})
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <FloatingInput
//                     label="Line Agent"
//                     value={formData.line_agent}
//                     onChange={e => handleFormChange("line_agent", e.target.value)}
//                   />
//                   <FloatingInput
//                     label="ETA"
//                     value={formatDateForInput(formData.eta)}
//                     onChange={e => handleFormChange("eta", e.target.value)}
//                     type="date"
//                   />
//                 </div>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">POL</label>
//                     {/* <select
//                       value={formData.pol}
//                       onChange={e => handleFormChange("pol", e.target.value)}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     >
//                       {polOptions.map((option, i) => (
//                         <option key={i} value={option}>{option}</option>
//                       ))}
//                     </select> */}
//                     {isLoading ? (
//   <p>Loading ports...</p>
// ) : errorMsg ? (
//   <p className="text-red-600">{errorMsg}</p>
// ) : (
//   <select
//     value={formData.pol}
//     onChange={e => handleFormChange("pol", e.target.value)}
//     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//   >
//     <option value="">Select</option>
//     {polList.map((port) => (
//       <option key={port.id} value={port.name}>
//         {port.name}
//       </option>
//     ))}
//   </select>
// )}

//                   </div>
//                   <FloatingInput
//                     label="POD"
//                     value={formData.pod}
//                     onChange={e => handleFormChange("pod", e.target.value)}
//                   />
//                   <FloatingInput
//                     label="Representative"
//                     value={formData.representative}
//                     onChange={e => handleFormChange("representative", e.target.value)}
//                   />
//                   <FloatingInput
//                     label="Receiving Rep"
//                     value={formData.receiving_rep}
//                     onChange={e => handleFormChange("receiving_rep", e.target.value)}
//                   />
//                 </div>
//               </div>
//             </SectionCard>
            
//             {/* Cargo Info */}
//             <SectionCard title="Cargo Information" collapsible={true}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <FloatingInput
//                     label="Commodity"
//                     value={formData.commodity}
//                     onChange={e => handleFormChange("commodity", e.target.value)}
//                   />
//                   <FloatingInput
//                     label="Packages"
//                     value={formData.no_of_packages}
//                     onChange={e => handleFormChange("no_of_packages", e.target.value)}
//                     type="number"
//                   />
//                   <FloatingInput
//                     label="Shipper"
//                     value={formData.shipper}
//                     onChange={e => handleFormChange("shipper", e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-4">
//                   <FloatingInput
//                     label="Bill of Lading"
//                     value={formData.bl}
//                     onChange={e => handleFormChange("bl", e.target.value)}
//                   />
//                   <FloatingInput
//                     label="Net Weight (KG)"
//                     value={formData.net_weight}
//                     onChange={e => handleFormChange("net_weight", e.target.value)}
//                     type="number"
//                   />
//                   <FloatingInput
//                     label="Gross Weight (KG)"
//                     value={formData.gross_weight}
//                     onChange={e => handleFormChange("gross_weight", e.target.value)}
//                     type="number"
//                   />
//                 </div>
//               </div>
//             </SectionCard>
            
//             {/* Documentation & Timeline */}
//             <SectionCard title="Documentation & Timeline" collapsible={true}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <FloatingInput
//                     label="Bayan Date"
//                     value={formatDateForInput(formData.bayan_date)}
//                     onChange={e => handleFormChange("bayan_date", e.target.value)}
//                     type="date"
//                   />
//                   <FloatingInput
//                     label="Date"
//                     value={formatDateForInput(formData.date)}
//                     onChange={e => handleFormChange("date", e.target.value)}
//                     type="date"
//                   />
//                   <FloatingInput
//                     label="Yard Date"
//                     value={formatDateForInput(formData.yard_date)}
//                     onChange={e => handleFormChange("yard_date", e.target.value)}
//                     type="date"
//                   />
//                 </div>
//                 <div className="space-y-4">
//                   <FloatingInput
//                     label="Payment Date"
//                     value={formatDateForInput(formData.payment_date)}
//                     onChange={e => handleFormChange("payment_date", e.target.value)}
//                     type="date"
//                   />
//                   <FloatingInput
//                     label="End Date"
//                     value={formatDateForInput(formData.end_date)}
//                     onChange={e => handleFormChange("end_date", e.target.value)}
//                     type="date"
//                   />
//                   <FloatingInput
//                     label="Release Date"
//                     value={formatDateForInput(formData.release_date)}
//                     onChange={e => handleFormChange("release_date", e.target.value)}
//                     type="date"
//                   />
//                 </div>
//               </div>
//             </SectionCard>
            
//             {/* Container Info */}
//             <SectionCard title="Container Information" collapsible={true}>
//               <div className="flex justify-between items-center mb-4">
//                 <button
//                   onClick={addContainer}
//                   className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-1"
//                   type="button"
//                 >
//                   <Plus className="w-5 h-5" />
//                   Add Container
//                 </button>
//               </div>
//               <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
//                 <table className="min-w-full table-auto border-collapse">
//                   <thead className="bg-indigo-50 text-indigo-600 text-sm font-semibold">
//                     <tr>
//                       <th className="px-4 py-3 text-left">Qty</th>
//                       <th className="px-4 py-3 text-left">Type</th>
//                       <th className="px-4 py-3 text-left">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentContainers.map((container) => (
//                       <tr
//                         key={container.id}
//                         className="border-b border-gray-100 hover:bg-indigo-50 transition"
//                       >
//                         <td className="px-4 py-3">
//                           <input
//                             type="number"
//                             value={container.qty}
//                             onChange={(e) =>
//                               updateContainer(container.id, "qty", e.target.value)
//                             }
//                             className="w-20 px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                           />
//                         </td>
//                         <td className="px-4 py-3">
//                           <select
//                             value={container.name} // or container.type depending on your data
//                             onChange={(e) => updateContainer(container.id, "name", e.target.value)}
//                             className="w-40 px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                           >
//                             <option value="">Select</option>
//                             {containers
//                               .filter(c => c.status === "Active")
//                               .map(c => (
//                                 <option key={c.id} value={c.name}>
//                                   {c.name}
//                                 </option>
//                               ))}
//                           </select>
//                         </td>
//                         <td className="px-4 py-3">
//                           <button
//                             onClick={() => removeContainer(container.id)}
//                             className="text-red-600 hover:text-red-800"
//                             title="Remove container"
//                             type="button"
//                           >
//                             <Trash2 className="w-5 h-5" />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100 bg-gray-50">
//                   <div className="text-sm text-gray-700">
//                     Showing {indexOfFirstContainer + 1} to{" "}
//                     {Math.min(indexOfLastContainer, containers.length)} of {containers.length} containers
//                   </div>
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() =>
//                         setCurrentContainerPage((p) => Math.max(p - 1, 1))
//                       }
//                       disabled={currentContainerPage === 1}
//                       className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
//                       title="Previous"
//                       type="button"
//                     >
//                       <ChevronLeft className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={() =>
//                         setCurrentContainerPage((p) =>
//                           Math.min(p + 1, totalContainerPages)
//                         )
//                       }
//                       disabled={
//                         currentContainerPage === totalContainerPages || totalContainerPages === 0
//                       }
//                       className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
//                       title="Next"
//                       type="button"
//                     >
//                       <ChevronRight className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </SectionCard>
            
//             {/* Bills & Documentation */}
//             <SectionCard title="Bills & Documentation" collapsible={true}>
//               <div className="flex justify-between items-center mb-4">
//                 <button
//                   onClick={addBill}
//                   className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-1"
//                   type="button"
//                 >
//                   <Plus className="w-5 h-5" />
//                   Add Bill
//                 </button>
//               </div>
//               <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
//                 {bills.map((bill, idx) => (
//                   <div
//                     key={bill.id || idx}
//                     className="border border-gray-100 rounded-lg p-4 mb-4 bg-indigo-50/60"
//                   >
//                     <div className="flex justify-between items-start mb-3">
//                       <span className="text-sm font-bold text-gray-700">
//                         Bill #{idx + 1}
//                       </span>
//                       <button
//                         onClick={() => removeBill(bill.id)}
//                         className="text-red-600 hover:text-red-800"
//                         title="Remove bill"
//                         type="button"
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <FloatingInput
//                         label="Client Reference"
//                         value={bill.clientRef}
//                         onChange={e =>
//                           updateBill(bill.id, "clientRef", e.target.value)
//                         }
//                       />
//                       <FloatingInput
//                         label="DO Date"
//                         value={formatDateForInput(bill.doDate)}
//                         onChange={e =>
//                           updateBill(bill.id, "doDate", e.target.value)
//                         }
//                         type="date"
//                       />
//                       <FloatingInput
//                         label="DO Number"
//                         value={bill.doNo}
//                         onChange={e =>
//                           updateBill(bill.id, "doNo", e.target.value)
//                         }
//                       />
//                       <FloatingInput
//                         label="Endorse Number"
//                         value={bill.endorseNo}
//                         onChange={e =>
//                           updateBill(bill.id, "endorseNo", e.target.value)
//                         }
//                       />
//                       <FloatingInput
//                         label="Bill Number"
//                         value={bill.billNo}
//                         onChange={e =>
//                           updateBill(bill.id, "billNo", e.target.value)
//                         }
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </SectionCard>
            
//             {/* Notes */}
//             <SectionCard title="Additional Notes" collapsible={true}>
//               <textarea
//                 rows="3"
//                 value={formData.notes}
//                 onChange={e => handleFormChange("notes", e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 placeholder="Enter any additional notes or comments..."
//               />
//             </SectionCard>
            
//             {/* Form Buttons */}
//             <div className="mt-6 flex justify-end space-x-4">
//               <button
//                 onClick={() => {
//                   resetForm();
//                   setIsAdding(false);
//                 }}
//                 type="button"
//                 className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg"
//                 disabled={isLoading || authError}
//               >
//                 {isLoading ? "Saving..." : (currentOperationId ? "Update Operation" : "Save Operation")}
//               </button>
//             </div>
//           </form>
//         </section>
        
//         {/* Operations Table */}
//         <section className="bg-white rounded-2xl shadow-2xl overflow-x-auto">
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
//             <h2 className="text-lg font-bold text-white">Clearance Operations</h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto border-collapse">
//               <thead className="bg-indigo-100 text-indigo-700 text-sm font-semibold">
//                 <tr>
//                   {[
//                     { label: "Client", key: "client" },
//                     { label: "Job No", key: "job_no" },
//                     { label: "Type", key: "operation_type" },
//                     { label: "Mode", key: "transport_mode" },
//                     { label: "Vessel", key: "vessel" },
//                     { label: "POL", key: "pol" },
//                     { label: "Status", key: "status" },
//                     { label: "Actions", key: null },
//                   ].map(({ label, key }) => (
//                     <th
//                       key={label}
//                       className={`px-4 py-3 text-left cursor-pointer select-none ${
//                         key && "hover:bg-indigo-200"
//                       }`}
//                       onClick={() => key && handleSort(key)}
//                     >
//                       <div className="flex items-center">
//                         {label}
//                         {key && sortField === key && (
//                           <ChevronDown
//                             className={`w-4 h-4 ml-1 transition-transform ${
//                               sortDirection === "asc" ? "rotate-180" : ""
//                             }`}
//                           />
//                         )}
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentOperations.length > 0 ? (
//                   currentOperations.map((operation, idx) => (
//                     <tr
//                       key={operation.id}
//                       className={`border-b border-gray-100 hover:bg-indigo-50 transition
//                         ${idx % 2 ? "bg-gray-50" : "bg-white"}
//                       `}
//                     >
//                       <td className="px-4 py-3">{operation.client}</td>
//                       <td className="px-4 py-3">{operation.job_no}</td>
//                       <td className="px-4 py-3">{operation.operation_type}</td>
//                       <td className="px-4 py-3">{operation.transport_mode}</td>
//                       <td className="px-4 py-3">{operation.vessel || "-"}</td>
//                       <td className="px-4 py-3">{operation.pol || "-"}</td>
//                       <td className="px-4 py-3">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs
//                             ${
//                               operation.status === "Completed"
//                                 ? "bg-emerald-100 text-emerald-800"
//                                 : operation.status === "In Progress"
//                                 ? "bg-yellow-100 text-yellow-800"
//                                 : "bg-blue-100 text-blue-800"
//                             }`}
//                         >
//                           {operation.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 flex space-x-2">
//                         <button
//                           onClick={() => handleEdit(operation)}
//                           title="Edit"
//                           className="text-indigo-600 hover:text-indigo-800"
//                           type="button"
//                           disabled={isLoading || authError}
//                         >
//                           <Pencil className="w-5 h-5" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(operation.id)}
//                           title="Delete"
//                           className="text-red-600 hover:text-red-800"
//                           type="button"
//                           disabled={isLoading || authError}
//                         >
//                           <Trash2 className="w-5 h-5" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
//                       {isLoading ? "Loading operations..." : "No operations found. Click 'Add Operation' to create one."}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           {/* Pagination */}
//           <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
//             <div className="text-sm text-gray-700">
//               Showing {indexOfFirstOperation + 1} to{" "}
//               {Math.min(indexOfLastOperation, filteredOperations.length)} of {filteredOperations.length} results
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() =>
//                   setCurrentOperationsPage((p) => Math.max(p - 1, 1))
//                 }
//                 disabled={currentOperationsPage === 1}
//                 className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
//                 title="Previous"
//                 type="button"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() =>
//                   setCurrentOperationsPage((p) =>
//                     Math.min(p + 1, totalOperationsPages)
//                   )
//                 }
//                 disabled={
//                   currentOperationsPage === totalOperationsPages ||
//                   totalOperationsPages === 0
//                 }
//                 className="p-2 rounded-md hover:bg-indigo-100 disabled:opacity-50"
//                 title="Next"
//                 type="button"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </section>
//       </div>
//     </main>
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
import axios from 'axios';
import { format, parseISO } from 'date-fns';

// API Configuration
const API_URL = "http://localhost:5000/api";

// Authentication helper function
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Authentication token missing');
  return { 
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// API Services with authentication
const clearanceOperationsAPI = {
  getAll: () => axios.get(`${API_URL}/clearance-operations`, getAuthHeaders()),
  getById: (id) => axios.get(`${API_URL}/clearance-operations/${id}`, getAuthHeaders()),
  create: (data) => axios.post(`${API_URL}/clearance-operations`, data, getAuthHeaders()),
  update: (id, data) => axios.put(`${API_URL}/clearance-operations/${id}`, data, getAuthHeaders()),
  delete: (id) => axios.delete(`${API_URL}/clearance-operations/${id}`, getAuthHeaders()),
};

const billsAPI = {
  getByOperationId: (operationId) => axios.get(`${API_URL}/bills/operation/${operationId}`, getAuthHeaders()),
  create: (data) => axios.post(`${API_URL}/bills`, data, getAuthHeaders()),
  update: (id, data) => axios.put(`${API_URL}/bills/${id}`, data, getAuthHeaders()),
  delete: (id) => axios.delete(`${API_URL}/bills/${id}`, getAuthHeaders()),
};

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
      className={`block px-4 pt-6 pb-2 w-full text-base text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent peer`}
      placeholder=" "
      {...rest}
    />
    <label
      className={`absolute left-4 top-2 text-sm text-gray-500 duration-300 transform -translate-y-2 scale-90 bg-white px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-4 peer-focus:scale-90 peer-focus:-translate-y-2 pointer-events-none`}
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
  operation_type: "Import",
  transport_mode: "Sea",
  client: "",
  job_no: "",
  commodity: "",
  no_of_packages: "",
  pod: "",
  line: "",
  vessel: "",
  net_weight: "",
  gross_weight: "",
  shipper: "",
  client_ref_name: "",
  line_agent: "",
  representative: "",
  receiving_rep: "",
  pol: "",
  bayan_no: "",
  bayan_date: "",
  payment_date: "",
  group_name: "",
  eta: "",
  date: "",
  yard_date: "",
  hijri_date: "",
  end_date: "",
  release_date: "",
  status: "",
  notes: "",
  bl: "",
  po_no: "",
};

const ClearanceOperation = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [containers, setContainers] = useState([
    { id: Date.now(), qty: "", type: "" },
  ]);
  const [bills, setBills] = useState([
    { id: null, clientRef: "", doDate: "", doNo: "", endorseNo: "", billNo: "" },
  ]);
  const [originalBills, setOriginalBills] = useState([]);
  const [operations, setOperations] = useState([]);
  const [currentOperationId, setCurrentOperationId] = useState(null);
  const [currentContainerPage, setCurrentContainerPage] = useState(1);
  const [currentOperationsPage, setCurrentOperationsPage] = useState(1);
  const [sortField, setSortField] = useState("client");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showStats] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

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

  // Fetch all operations on component mount
  useEffect(() => {
    fetchOperations();
  }, []);

  const fetchOperations = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const response = await clearanceOperationsAPI.getAll();
      setOperations(response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle API errors including authentication issues
  const handleApiError = (error) => {
    if (error.message === 'Authentication token missing') {
      setAuthError("You need to log in to access this page");
      console.error("Authentication required");
    } else if (error.response?.status === 401) {
      setAuthError("Session expired. Please log in again.");
    } else {
      console.error("API Error:", error);
      alert(`Operation failed: ${error.response?.data?.message || error.message}`);
    }
  };

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
        id: null,
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

  // Prepare data in the exact format backend expects
  const prepareOperationData = (data) => {
    const result = { ...data };
    
    // Convert empty strings to null for numeric fields
    const numericFields = ['net_weight', 'no_of_packages', 'gross_weight'];
    numericFields.forEach(field => {
      if (result[field] === '') result[field] = null;
      else if (result[field]) {
        // Convert to string with 2 decimal places if needed
        result[field] = parseFloat(result[field]).toFixed(2);
      }
    });
    
    // Convert date fields to ISO strings
    const dateFields = [
      'date', 'yard_date', 'bayan_date', 'payment_date', 
      'end_date', 'release_date', 'eta'
    ];
    
    dateFields.forEach(field => {
      if (result[field]) {
        // Convert from YYYY-MM-DD to ISO string
        result[field] = new Date(result[field] + 'T00:00:00Z').toISOString();
      } else {
        result[field] = null;
      }
    });
    
    // Convert empty strings to null for all fields
    Object.keys(result).forEach(key => {
      if (result[key] === "") result[key] = null;
    });
    
    return result;
  };

  const prepareBillData = (bill) => {
    const result = { ...bill };
    
    // Convert date field
    if (result.doDate) {
      result.doDate = new Date(result.doDate + 'T00:00:00Z').toISOString();
    }
    
    // Convert empty strings to null
    Object.keys(result).forEach(key => {
      if (result[key] === "") result[key] = null;
    });
    
    return result;
  };

  const handleSave = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const opData = prepareOperationData(formData);
      let operationId = currentOperationId;

      if (!operationId) {
        // Create new operation
        const createRes = await clearanceOperationsAPI.create(opData);
        operationId = createRes.data.id;
        
        // Create bills
        for (const bill of bills) {
          if (bill.clientRef || bill.doNo || bill.billNo) {
            const preparedBill = prepareBillData(bill);
            await billsAPI.create({ ...preparedBill, operation_id: operationId });
          }
        }
      } else {
        // Update existing operation
        await clearanceOperationsAPI.update(operationId, opData);
        
        // Process bills
        const currentBills = [...bills];
        const originalBillsIds = originalBills.map(b => b.id);

        // Update/Create bills
        for (const bill of currentBills) {
          if (bill.id) {
            const preparedBill = prepareBillData(bill);
            await billsAPI.update(bill.id, preparedBill);
          } else if (bill.clientRef || bill.doNo || bill.billNo) {
            const preparedBill = prepareBillData(bill);
            await billsAPI.create({ ...preparedBill, operation_id: operationId });
          }
        }

        // Delete removed bills
        const currentBillsIds = currentBills.filter(b => b.id).map(b => b.id);
        const billsToDeleteIds = originalBillsIds.filter(id => !currentBillsIds.includes(id));
        for (const id of billsToDeleteIds) {
          await billsAPI.delete(id);
        }
      }

      // Refresh data and reset form
      await fetchOperations();
      resetForm();
      setIsAdding(false);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (operation) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      // Fetch operation details and bills
      const opRes = await clearanceOperationsAPI.getById(operation.id);
      const billsRes = await billsAPI.getByOperationId(operation.id);
      
      // Format dates for form inputs
      const formattedOperation = { ...opRes.data };
      const dateFields = [
        'date', 'yard_date', 'bayan_date', 'payment_date', 
        'end_date', 'release_date', 'eta'
      ];
      
      dateFields.forEach(field => {
        if (formattedOperation[field]) {
          formattedOperation[field] = formatDateForInput(formattedOperation[field]);
        }
      });
      
      setFormData(formattedOperation);
      
      // Format bill dates
      const formattedBills = billsRes.data.map(bill => {
        if (bill.doDate) {
          return { ...bill, doDate: formatDateForInput(bill.doDate) };
        }
        return bill;
      });
      
      setBills(formattedBills);
      setOriginalBills(billsRes.data);
      setCurrentOperationId(operation.id);
      setIsAdding(true);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this operation?")) {
      setIsLoading(true);
      setAuthError(null);
      try {
        // Delete associated bills first
        const billsRes = await billsAPI.getByOperationId(id);
        for (const bill of billsRes.data) {
          await billsAPI.delete(bill.id);
        }
        
        // Delete operation
        await clearanceOperationsAPI.delete(id);
        
        // Refresh operations list
        await fetchOperations();
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setContainers([{ id: Date.now(), qty: "", type: "" }]);
    setBills([
      { id: null, clientRef: "", doDate: "", doNo: "", endorseNo: "", billNo: "" },
    ]);
    setOriginalBills([]);
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
      op.job_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.operation_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.transport_mode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  // Format date for input fields (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      return format(parseISO(dateString), "yyyy-MM-dd");
    } catch {
      return "";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-0 md:p-5 relative">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-medium">Loading...</p>
          </div>
        </div>
      )}
      
      {authError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-xl font-bold text-red-600 mb-3">Authentication Required</h3>
            <p className="mb-4">{authError}</p>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              onClick={() => window.location.href = '/login'}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
      
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
              disabled={isLoading || authError}
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
                            name="operation_type"
                            value={t}
                            checked={formData.operation_type === t}
                            onChange={(e) => handleFormChange("operation_type", e.target.value)}
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
                            name="transport_mode"
                            value={t}
                            checked={formData.transport_mode === t}
                            onChange={(e) => handleFormChange("transport_mode", e.target.value)}
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
                    value={formData.job_no}
                    onChange={e => handleFormChange("job_no", e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                  <FloatingInput
                    label="Client Reference"
                    value={formData.client_ref_name}
                    onChange={e => handleFormChange("client_ref_name", e.target.value)}
                  />
                  <FloatingInput
                    label="Bayan No"
                    value={formData.bayan_no}
                    onChange={e => handleFormChange("bayan_no", e.target.value)}
                  />
                  <FloatingInput
                    label="Status"
                    value={formData.status}
                    onChange={e => handleFormChange("status", e.target.value)}
                  />
                  <FloatingInput
                    label="PO Number"
                    value={formData.po_no}
                    onChange={e => handleFormChange("po_no", e.target.value)}
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
                    value={formData.line_agent}
                    onChange={e => handleFormChange("line_agent", e.target.value)}
                  />
                  <FloatingInput
                    label="ETA"
                    value={formatDateForInput(formData.eta)}
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
                    value={formData.receiving_rep}
                    onChange={e => handleFormChange("receiving_rep", e.target.value)}
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
                    value={formData.no_of_packages}
                    onChange={e => handleFormChange("no_of_packages", e.target.value)}
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
                    value={formData.net_weight}
                    onChange={e => handleFormChange("net_weight", e.target.value)}
                    type="number"
                  />
                  <FloatingInput
                    label="Gross Weight (KG)"
                    value={formData.gross_weight}
                    onChange={e => handleFormChange("gross_weight", e.target.value)}
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
                    value={formatDateForInput(formData.bayan_date)}
                    onChange={e => handleFormChange("bayan_date", e.target.value)}
                    type="date"
                  />
                  <FloatingInput
                    label="Date"
                    value={formatDateForInput(formData.date)}
                    onChange={e => handleFormChange("date", e.target.value)}
                    type="date"
                  />
                  <FloatingInput
                    label="Yard Date"
                    value={formatDateForInput(formData.yard_date)}
                    onChange={e => handleFormChange("yard_date", e.target.value)}
                    type="date"
                  />
                </div>
                <div className="space-y-4">
                  <FloatingInput
                    label="Payment Date"
                    value={formatDateForInput(formData.payment_date)}
                    onChange={e => handleFormChange("payment_date", e.target.value)}
                    type="date"
                  />
                  <FloatingInput
                    label="End Date"
                    value={formatDateForInput(formData.end_date)}
                    onChange={e => handleFormChange("end_date", e.target.value)}
                    type="date"
                  />
                  <FloatingInput
                    label="Release Date"
                    value={formatDateForInput(formData.release_date)}
                    onChange={e => handleFormChange("release_date", e.target.value)}
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
                    key={bill.id || idx}
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
                        value={formatDateForInput(bill.doDate)}
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
                disabled={isLoading || authError}
              >
                {isLoading ? "Saving..." : (currentOperationId ? "Update Operation" : "Save Operation")}
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
                    { label: "Job No", key: "job_no" },
                    { label: "Type", key: "operation_type" },
                    { label: "Mode", key: "transport_mode" },
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
                      <td className="px-4 py-3">{operation.job_no}</td>
                      <td className="px-4 py-3">{operation.operation_type}</td>
                      <td className="px-4 py-3">{operation.transport_mode}</td>
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
                          disabled={isLoading || authError}
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(operation.id)}
                          title="Delete"
                          className="text-red-600 hover:text-red-800"
                          type="button"
                          disabled={isLoading || authError}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                      {isLoading ? "Loading operations..." : "No operations found. Click 'Add Operation' to create one."}
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