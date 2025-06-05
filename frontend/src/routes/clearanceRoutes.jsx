// src/routes/clearanceRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";

import DeliveryNotePage from "../components/DeliveryNote";

const clearanceRoutes = (
  <>
    <Route path="/deliverynote" element={<DeliveryNotePage />} />
    {/* Add other clearance routes like edit, assign, etc. */}
  </>
);

export default clearanceRoutes;
