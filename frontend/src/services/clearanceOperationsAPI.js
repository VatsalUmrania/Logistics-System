import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/clearance-operations';
const BILLS_URL = 'http://localhost:5000/api/bills';

export const fetchOperations = () => axios.get(BASE_URL);
export const fetchOperationById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createOperation = (operation) => axios.post(BASE_URL, operation);
export const updateOperation = (id, operation) => axios.put(`${BASE_URL}/${id}`, operation);
export const deleteOperation = (id) => axios.delete(`${BASE_URL}/${id}`);

export const fetchBills = () => axios.get(BILLS_URL);
export const fetchBillById = (id) => axios.get(`${BILLS_URL}/${id}`);
export const fetchBillsByOperationId = (operation_id) => axios.get(`${BILLS_URL}/operation/${operation_id}`);
export const createBill = (bill) => axios.post(BILLS_URL, bill);
export const updateBill = (id, bill) => axios.put(`${BILLS_URL}/${id}`, bill);
export const deleteBill = (id) => axios.delete(`${BILLS_URL}/${id}`);
