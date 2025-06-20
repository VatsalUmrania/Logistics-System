import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";

// Lazy load each report page component
const JobSearchByNo = lazy(() => import("../pages/reports/JobSearchByNo"));
const InvoiceSearch = lazy(() => import("../pages/reports/InvoiceSearch"));
const CustomerStatement = lazy(() => import("../pages/reports/CustomerStatement"));
const PaymentReport = lazy(() => import("../pages/reports/PaymentReport"));
const BayanNoSearch = lazy(() => import("../pages/reports/BayanNoSearch"));
const ClientSearch = lazy(() => import("../pages/reports/ClientSearch"));
const InvoiceSearchByDate = lazy(() => import("../pages/reports/InvoiceSearchByDate"));
const VoucherDetails = lazy(() => import("../pages/reports/VoucherDetails"));
const CancelledReceiptDetails = lazy(() => import("../pages/reports/CancelledReceiptDetails"));
const VatStatementReport = lazy(() => import("../pages/reports/VatStatementReport"));
const ProfitReportByDate = lazy(() => import("../pages/reports/ProfitReportByDate"));
const VatStat = lazy(() => import("../pages/reports/VatReport"));

const reportsRoutes = (
  <>
    <Route path="/jobno" element={<Suspense fallback={<div>Loading...</div>}><JobSearchByNo /></Suspense>} />
    <Route path="/invoice-search" element={<Suspense fallback={<div>Loading...</div>}><InvoiceSearch /></Suspense>} />
    <Route path="/customer-statement" element={<Suspense fallback={<div>Loading...</div>}><CustomerStatement /></Suspense>} />
    <Route path="/payment-report" element={<Suspense fallback={<div>Loading...</div>}><PaymentReport /></Suspense>} />
    <Route path="/bayanno" element={<Suspense fallback={<div>Loading...</div>}><BayanNoSearch /></Suspense>} />
    <Route path="/client-search" element={<Suspense fallback={<div>Loading...</div>}><ClientSearch /></Suspense>} />
    <Route path="/invoice-search-by-date" element={<Suspense fallback={<div>Loading...</div>}><InvoiceSearchByDate /></Suspense>} />
    <Route path="/voucher-details" element={<Suspense fallback={<div>Loading...</div>}><VoucherDetails /></Suspense>} />
    <Route path="/cancel-recipt" element={<Suspense fallback={<div>Loading...</div>}><CancelledReceiptDetails /></Suspense>} />
    <Route path="/vat-statement" element={<Suspense fallback={<div>Loading...</div>}><VatStatementReport /></Suspense>} />
    <Route path="/profit-report-by-date" element={<Suspense fallback={<div>Loading...</div>}><ProfitReportByDate /></Suspense>} />
  </>
);

export default reportsRoutes;
