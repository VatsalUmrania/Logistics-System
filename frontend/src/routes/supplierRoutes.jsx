// src/routes/supplierRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";

import AddSupplierPage from "../pages/supplier/AddSupplier";
import SupplierInvoiceEditPage from "../pages/supplier/SupplierInvoiceEdit";
import SupplierPayment from "../pages/supplier/SupplierPayment";
import AssignSupplier from "../pages/supplier/AssignSupplier";
import PurchaseSearch from "../pages/supplier/PurchaseSearch";
import SupplierCreditNote from "../pages/supplier/SupplierCreditNote";

const supplierRoutes = (
  <>
    <Route path="/supplier-add-supplier" element={<AddSupplierPage />} />
    <Route path="/supplier-invoice-edit" element={<SupplierInvoiceEditPage />} />
    <Route path="/supplier-payment" element={<SupplierPayment />} />
    <Route path="/supplier-assign" element={<AssignSupplier />} />
    <Route path="/purchase-search" element={<PurchaseSearch />} />
    <Route path="/supplier-creditnote" element={<SupplierCreditNote />} />
  </>
);

export default supplierRoutes;
