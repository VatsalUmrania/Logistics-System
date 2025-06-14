// import React from "react";
// import {
//   createBrowserRouter,
//   RouterProvider,
//   Route,
//   createRoutesFromElements,
//   Outlet,
// } from "react-router-dom";
// import { AuthProvider } from "../../backend/modules/auth/AuthContext";

// import Navbar from "./components/NavBar";
// import HomePage from "./components/Home";
// import ErrorPage from "./components/ErrorPage";

// import masterDataRoutes from "./routes/masterDataRoutes";
// import supplierRoutes from "./routes/supplierRoutes";
// import clearanceRoutes from "./routes/clearanceRoutes";
// import reportsRoutes from "./routes/reportsRoutes";
// import accountsRoutes from "./routes/accountsRoutes";
// import noLayoutRoutes from "./routes/noLayoutRoutes";
// import LandingPage from "./components/LandingPage";
// const Layout = () => (
//   <>
//     <Navbar />
//     <Outlet />
//   </>
// );

// const NoLayout = () => <Outlet />;

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <>
//       <Route element={<Layout />} errorElement={<ErrorPage />}>
//       <Route path="/home" element={<HomePage />} />
//         {masterDataRoutes}
//         {supplierRoutes}
//         {clearanceRoutes}
//         {reportsRoutes}
//         {accountsRoutes}
//       </Route>

//       <Route element={<NoLayout />} errorElement={<ErrorPage />}>
//         {noLayoutRoutes}
//       </Route>
//     </>
//   )
// );

// function App() {
//   return (
//     <AuthProvider>
//       <React.StrictMode>
//         <RouterProvider router={router} />
//       </React.StrictMode>
//     </AuthProvider>
    
//   );
// }

// export default App;

import React from "react";
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements, Outlet } from "react-router-dom";
import { AuthProvider } from "../../backend/modules/auth/AuthContext"; // Ensure this is correct

import Navbar from "./components/NavBar";
import HomePage from "./components/Home";
import ErrorPage from "./components/ErrorPage";
import LoginPage from "./components/LoginPage"; // Import your LoginPage component

import masterDataRoutes from "./routes/masterDataRoutes";
import supplierRoutes from "./routes/supplierRoutes";
import clearanceRoutes from "./routes/clearanceRoutes";
import reportsRoutes from "./routes/reportsRoutes";
import accountsRoutes from "./routes/accountsRoutes";
import noLayoutRoutes from "./routes/noLayoutRoutes";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";
const Layout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer/>
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
        <Route path="/login" element={<LoginPage />} /> {/* Add login route */}
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
