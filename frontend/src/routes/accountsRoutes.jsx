// src/routes/accountsRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";
import AccountHead from "../pages/accounts/AccountHead";

// Add imports and components when ready
const accountsRoutes = (
  <>
    <Route path="/account-head" element={<AccountHead />} />
  </>
);

export default accountsRoutes;
