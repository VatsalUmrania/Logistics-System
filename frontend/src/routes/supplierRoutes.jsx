// src/routes/supplierRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";

import AddSupplierPage from "../pages/supplier/AddSupplier";
import SupplierInvoiceEditPage from "../pages/supplier/SupplierInvoiceEdit";

const supplierRoutes = (
  <>
    <Route path="/addsupplier" element={<AddSupplierPage />} />
    <Route path="/invoice-edit" element={<SupplierInvoiceEditPage />} />
    {/* Add more supplier routes as needed */}
  </>
);

export default supplierRoutes;
