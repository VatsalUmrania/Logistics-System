import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";

// Lazy load each component

const LandingPage = lazy(() => import("../components/LandingPage"));
const LoginPage = lazy(() => import("../components/LoginPage"));

const noLayoutRoutes = (
  <>
    <Route path="/" element={<Suspense fallback={<div>Loading...</div>}><LandingPage /></Suspense>} />
    <Route path="/login" element={<Suspense fallback={<div>Loading...</div>}><LoginPage /></Suspense>} />
  </>
);

export default noLayoutRoutes;
