// src/routes/noLayoutRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";

import AssignSupplier from "../components/assignsupp";
import LandingPage from "../components/LandingPage";
import LoginPage from "../components/LoginPage";

const noLayoutRoutes = (
  <>
    <Route path="/assignup" element={<AssignSupplier />} />
    <Route path="/landingpage" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
  </>
);

export default noLayoutRoutes;
