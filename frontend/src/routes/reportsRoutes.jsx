// src/routes/reportsRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";

import JobSearchByNo from "../pages/reports/JobSearchByNo";
import InvoiceSearch from "../pages/reports/InvoiceSearch";
import CustomerStatement from "../pages/reports/CustomerStatement";
import PaymentReport from "../pages/reports/PaymentReport";
import BayanNoSearch from "../pages/reports/BayanNoSearch";
import ClientSearch from "../pages/reports/ClientSearch";
import InvoiceSearchByDate from "../pages/reports/InvoiceSearchByDate";
import VoucherDetails from "../pages/reports/VoucherDetails";
import CancelledReceiptDetails from "../pages/reports/CancelledReceiptDetails";
import VatStatementReport from "../pages/reports/VatStatementReport";
import ProfitReportByDate from "../pages/reports/ProfitReportByDate";

const reportsRoutes = (
  <>
    <Route path="/jobno" element={<JobSearchByNo />} />
    <Route path="/invoice-search" element={<InvoiceSearch />} />
    <Route path="/customer-statement" element={<CustomerStatement />} />
    <Route path="/payment-report" element={<PaymentReport />} />
    <Route path="/bayanno" element={<BayanNoSearch />} />
    <Route path="/client-search" element={<ClientSearch />} />
    <Route path="/invoice-search-by-date" element={<InvoiceSearchByDate />} />
    <Route path="/voucher-details" element={<VoucherDetails />} />
    <Route path="/cancel-recipt" element={<CancelledReceiptDetails />} />
    <Route path="/vat-statement" element={<VatStatementReport />} />
    <Route path="/profit-report-by-date" element={<ProfitReportByDate />} />
  </>
);

export default reportsRoutes;
