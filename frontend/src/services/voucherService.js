import axios from 'axios';

const API_BASE = '/api/accounts/journal-vouchers';

export default {
  createVoucher: (payload) => axios.post(API_BASE, payload),
  getVouchers: () => axios.get(API_BASE),
  getNextVoucherNo: () => axios.get(`${API_BASE}/next-voucher-no`),
  getAccountData: () => axios.get(`${API_BASE}/account-data`),
  getSubAccounts: (headId) => axios.get(`${API_BASE}/sub-accounts/${headId}`),
};

