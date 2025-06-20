import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";

// Lazy load each component
const AssignSupplier = lazy(() => import("../components/assignsupp"));
const LandingPage = lazy(() => import("../components/LandingPage"));
const LoginPage = lazy(() => import("../components/LoginPage"));

const noLayoutRoutes = (
  <>
    <Route path="/assignup" element={<Suspense fallback={<div>Loading...</div>}><AssignSupplier /></Suspense>} />
    <Route path="/landingpage" element={<Suspense fallback={<div>Loading...</div>}><LandingPage /></Suspense>} />
    <Route path="/" element={<Suspense fallback={<div>Loading...</div>}><LoginPage /></Suspense>} />
  </>
);

export default noLayoutRoutes;
