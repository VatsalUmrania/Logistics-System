// src/routes/masterDataRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";

import PollDetails from "../pages/masterdata/PollDetial";
import VesselDetailsPage from "../pages/masterdata/Vessel";
import UserManagementPage from "../pages/masterdata/User";
import CommodityManagementPage from "../pages/masterdata/Commodity";
import BankInformationPage from "../pages/masterdata/Bank";
import ClientManagementPage from "../pages/masterdata/Clients";
import CategoriesManagementPage from "../pages/masterdata/Categories";
import ContainerDetailsPage from "../pages/masterdata/Container";

const masterDataRoutes = (
  <>
    <Route path="/poll" element={<PollDetails />} />
    <Route path="/vessel" element={<VesselDetailsPage />} />
    <Route path="/user" element={<UserManagementPage />} />
    <Route path="/commodity" element={<CommodityManagementPage />} />
    <Route path="/bank" element={<BankInformationPage />} />
    <Route path="/clients" element={<ClientManagementPage />} />
    <Route path="/category" element={<CategoriesManagementPage />} />
    <Route path="/container" element={<ContainerDetailsPage />} />
  </>
);

export default masterDataRoutes;
