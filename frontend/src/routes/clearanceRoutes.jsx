import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";

const AssignExpenses = lazy(() => import("../pages/customclearance/AssignExpenses"));
const CreditNoteSearch = lazy(() => import("../pages/customclearance/CreditNoteSearch"));
const DeliveryNotePage = lazy(() => import("../pages/customclearance/DeliveryNotePage"));
const ClearanceOperation = lazy(() => import("../pages/customclearance/ClearanceOperations"));
const AssignOtherCharges = lazy(() => import("../pages/customclearance/AssignOtherCharges"));
const ReceiptCancellation = lazy(() => import("../pages/customclearance/ReciptCancel"));

const clearanceRoutes = (
  <>
    <Route path="/assign-expenses" element={<Suspense fallback={<div>Loading...</div>}><AssignExpenses /></Suspense>} />
    <Route path="/credit-note" element={<Suspense fallback={<div>Loading...</div>}><CreditNoteSearch /></Suspense>} />
    <Route path="/delivery-note" element={<Suspense fallback={<div>Loading...</div>}><DeliveryNotePage /></Suspense>} />
    <Route path="/clearance" element={<Suspense fallback={<div>Loading...</div>}><ClearanceOperation /></Suspense>} />
    <Route path="/assign-other-charges" element={<Suspense fallback={<div>Loading...</div>}><AssignOtherCharges /></Suspense>} />
    <Route path="/recipt-cancel" element={<Suspense fallback={<div>Loading...</div>}><ReceiptCancellation /></Suspense>} />
  </>
);

export default clearanceRoutes;
