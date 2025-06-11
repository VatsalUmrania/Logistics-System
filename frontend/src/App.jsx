import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Outlet,
} from "react-router-dom";
import { AuthProvider } from "../../backend/modules/auth/AuthContext";

import Navbar from "./components/NavBar";
import HomePage from "./components/Home";
import ErrorPage from "./components/ErrorPage";

import masterDataRoutes from "./routes/masterDataRoutes";
import supplierRoutes from "./routes/supplierRoutes";
import clearanceRoutes from "./routes/clearanceRoutes";
import reportsRoutes from "./routes/reportsRoutes";
import accountsRoutes from "./routes/accountsRoutes";
import noLayoutRoutes from "./routes/noLayoutRoutes";
import LandingPage from "./components/LandingPage";
const Layout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const NoLayout = () => <Outlet />;

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Layout />} errorElement={<ErrorPage />}>
      <Route path="/home" element={<HomePage />} />
        {masterDataRoutes}
        {supplierRoutes}
        {clearanceRoutes}
        {reportsRoutes}
        {accountsRoutes}
      </Route>

      <Route element={<NoLayout />} errorElement={<ErrorPage />}>
        {noLayoutRoutes}
      </Route>
    </>
  )
);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
