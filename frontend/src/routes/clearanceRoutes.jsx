// src/routes/clearanceRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";


import AssignExpenses from "../pages/customclearance/AssignExpenses";
import CreditNoteSearch from "../pages/customclearance/CreditNoteSearch";
import DeliveryNotePage from "../pages/customclearance/DeliveryNotePage";

const clearanceRoutes = (
  <>
    <Route path="/assign-expenses" element={<AssignExpenses />} />
    <Route path="/credit-note-search" element={<CreditNoteSearch />} />
    <Route path="/delivery-note" element={<DeliveryNotePage />} />
  </>
);

export default clearanceRoutes;
