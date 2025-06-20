import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";

// Lazy load each supplier page component
const AddSupplierPage = lazy(() => import("../pages/supplier/AddSupplier"));
const SupplierInvoiceEditPage = lazy(() => import("../pages/supplier/SupplierInvoiceEdit"));
const SupplierPayment = lazy(() => import("../pages/supplier/SupplierPayment"));
const AssignSupplier = lazy(() => import("../pages/supplier/AssignSupplier"));
const PurchaseSearch = lazy(() => import("../pages/supplier/PurchaseSearch"));
const SupplierCreditNote = lazy(() => import("../pages/supplier/SupplierCreditNote"));
const SupplierStatement = lazy(() => import("../pages/supplier/CustomerStatement"));

const supplierRoutes = (
  <>
    <Route path="/supplier-add-supplier" element={<Suspense fallback={<div>Loading...</div>}><AddSupplierPage /></Suspense>} />
    <Route path="/supplier-invoice-edit" element={<Suspense fallback={<div>Loading...</div>}><SupplierInvoiceEditPage /></Suspense>} />
    <Route path="/supplier-payment" element={<Suspense fallback={<div>Loading...</div>}><SupplierPayment /></Suspense>} />
    <Route path="/supplier-assign" element={<Suspense fallback={<div>Loading...</div>}><AssignSupplier /></Suspense>} />
    <Route path="/purchase-search" element={<Suspense fallback={<div>Loading...</div>}><PurchaseSearch /></Suspense>} />
    <Route path="/supplier-creditnote" element={<Suspense fallback={<div>Loading...</div>}><SupplierCreditNote /></Suspense>} />
    <Route path="/supplier-statement" element={<Suspense fallback={<div>Loading...</div>}><SupplierStatement /></Suspense>} />
  </>
);

export default supplierRoutes;
