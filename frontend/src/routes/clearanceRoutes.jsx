// src/routes/clearanceRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";


import AssignExpenses from "../pages/customclearance/AssignExpenses";
import CreditNoteSearch from "../pages/customclearance/CreditNoteSearch";
import DeliveryNotePage from "../pages/customclearance/DeliveryNotePage";
import ClearanceOperation from "../pages/customclearance/ClearanceOperations";
import AssignOtherCharges from "../pages/customclearance/AssignOtherCharges";
import CreditNote from "../pages/customclearance/CreditNoteManagement";
import ReceiptCancellation from "../pages/customclearance/ReciptCancel";

const clearanceRoutes = (
  <>
    <Route path="/assign-expenses" element={<AssignExpenses />} />
    <Route path="/credit-note" element={<CreditNoteSearch />} />
    <Route path="/delivery-note" element={<DeliveryNotePage />} />
    <Route path="/clearance" element={<ClearanceOperation/>} />
    <Route path="/assign-other-charges" element={<AssignOtherCharges />} />
    <Route path="/recipt-cancel" element={<ReceiptCancellation />} />
  </>
);

export default clearanceRoutes;
