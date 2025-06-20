import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";

// Lazy load each page component
const PollDetails = lazy(() => import("../pages/masterdata/PollDetial"));
const VesselDetailsPage = lazy(() => import("../pages/masterdata/Vessel"));
const UserManagementPage = lazy(() => import("../pages/masterdata/User"));
const CommodityManagementPage = lazy(() => import("../pages/masterdata/Commodity"));
const BankInformationPage = lazy(() => import("../pages/masterdata/Bank"));
const ClientManagementPage = lazy(() => import("../pages/masterdata/Clients"));
const CategoriesManagementPage = lazy(() => import("../pages/masterdata/Categories"));
const ContainerDetailsPage = lazy(() => import("../pages/masterdata/Container"));

const masterDataRoutes = (
  <>
    <Route path="/poll" element={<Suspense fallback={<div>Loading...</div>}><PollDetails /></Suspense>} />
    <Route path="/vessel" element={<Suspense fallback={<div>Loading...</div>}><VesselDetailsPage /></Suspense>} />
    <Route path="/user" element={<Suspense fallback={<div>Loading...</div>}><UserManagementPage /></Suspense>} />
    <Route path="/commodity" element={<Suspense fallback={<div>Loading...</div>}><CommodityManagementPage /></Suspense>} />
    <Route path="/bank" element={<Suspense fallback={<div>Loading...</div>}><BankInformationPage /></Suspense>} />
    <Route path="/clients" element={<Suspense fallback={<div>Loading...</div>}><ClientManagementPage /></Suspense>} />
    <Route path="/category" element={<Suspense fallback={<div>Loading...</div>}><CategoriesManagementPage /></Suspense>} />
    <Route path="/container" element={<Suspense fallback={<div>Loading...</div>}><ContainerDetailsPage /></Suspense>} />
  </>
);

export default masterDataRoutes;
