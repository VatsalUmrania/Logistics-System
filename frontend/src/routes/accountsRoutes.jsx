import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";

// Lazy load the AccountHead component
const AccountHead = lazy(() => import("../pages/accounts/AccountHead"));

const accountsRoutes = (
  <Route 
    path="/account-head" 
    element={
      <Suspense fallback={<div>Loading...</div>}>
        <AccountHead />
      </Suspense>
    } 
  />
);

export default accountsRoutes;
