import React from "react";
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements, Outlet } from "react-router-dom";
import { AuthProvider } from "../../backend/modules/auth/AuthContext"; // Ensure this is the correct path

import Navbar from "./components/NavBar";
import HomePage from "./components/Home";
import ErrorPage from "./components/ErrorPage";
import LoginPage from "./components/LoginPage"; // Import the LoginPage component

import masterDataRoutes from "./routes/masterDataRoutes";
import supplierRoutes from "./routes/supplierRoutes";
import clearanceRoutes from "./routes/clearanceRoutes";
import reportsRoutes from "./routes/reportsRoutes";
import accountsRoutes from "./routes/accountsRoutes";
import noLayoutRoutes from "./routes/noLayoutRoutes";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";

// Layout component that includes Navbar and Footer
const Layout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

// NoLayout component for routes that don't require a navbar/footer
const NoLayout = () => <Outlet />;

// Create routes with `createBrowserRouter`
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Routes that require Layout (Navbar, Footer) */}
      <Route element={<Layout />} errorElement={<ErrorPage />}>
        <Route path="/home" element={<HomePage />} />
        {masterDataRoutes}
        {supplierRoutes}
        {clearanceRoutes}
        {reportsRoutes}
        {accountsRoutes}
      </Route>

      {/* Routes that don't require Layout */}
      <Route element={<NoLayout />} errorElement={<ErrorPage />}>
        {noLayoutRoutes}
        <Route path="/login" element={<LoginPage />} /> {/* Login route */}
      </Route>
    </>
  )
);

function App() {
  return (
    <AuthProvider> {/* Wrap app in AuthContext provider */}
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </AuthProvider>
  );
}

export default App;
