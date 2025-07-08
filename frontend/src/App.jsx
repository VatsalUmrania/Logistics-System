// import React from "react";
// import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements, Outlet } from "react-router-dom";
// import { AuthProvider } from "./services/AuthContext"; // Ensure this is the correct path

// import Navbar from "./components/NavBar";
// import HomePage from "./components/Home";
// import ErrorPage from "./components/ErrorPage";
// import LoginPage from "./components/LoginPage"; // Import the LoginPage component

// import masterDataRoutes from "./routes/masterDataRoutes";
// import supplierRoutes from "./routes/supplierRoutes";
// import clearanceRoutes from "./routes/clearanceRoutes";
// import reportsRoutes from "./routes/reportsRoutes";
// import accountsRoutes from "./routes/accountsRoutes";
// import noLayoutRoutes from "./routes/noLayoutRoutes";
// import Footer from "./components/Footer";
// import MyProfile from "./components/MyProfile";
// import LogoutPage from "./components/LogOutPage";
// // Layout component that includes Navbar and Footer
// const Layout = () => (
//   <>
//     <Navbar />
//     <Outlet />
//     <Footer />
//   </>
// );

// // NoLayout component for routes that don't require a navbar/footer
// const NoLayout = () => <Outlet />;

// // Create routes with `createBrowserRouter`
// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <>
//       {/* Routes that require Layout (Navbar, Footer) */}
//       <Route element={<Layout />} errorElement={<ErrorPage />}>
//         <Route path="/home" element={<HomePage />} />
//         <Route path="/myprofile" element={<MyProfile />} />
//         <Route path="/logout" element={<LogoutPage />} />
//         {masterDataRoutes}
//         {supplierRoutes}
//         {clearanceRoutes}
//         {reportsRoutes}
//         {accountsRoutes}
//       </Route>

//       {/* Routes that don't require Layout */}
//       <Route element={<NoLayout />} errorElement={<ErrorPage />}>
//         {noLayoutRoutes}
//         <Route path="/login" element={<LoginPage />} /> {/* Login route */}
//       </Route>
//     </>
//   )
// );

// function App() {
//   return (
//     <AuthProvider> {/* Wrap app in AuthContext provider */}
//       <React.StrictMode>
//         <RouterProvider router={router} />
//       </React.StrictMode>
//     </AuthProvider>
//   );
// }

// export default App;

import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements, Outlet } from "react-router-dom";
import { AuthProvider } from "./services/AuthContext";

// Lazy imports
const Navbar = lazy(() => import("./components/NavBar"));
const Footer = lazy(() => import("./components/Footer"));
const HomePage = lazy(() => import("./components/Home"));
const ErrorPage = lazy(() => import("./components/ErrorPage"));
const MyProfile = lazy(() => import("./components/MyProfile"));
const LogoutPage = lazy(() => import("./components/LogOutPage"));

// Routes
import masterDataRoutes from "./routes/masterDataRoutes";
import supplierRoutes from "./routes/supplierRoutes";
import clearanceRoutes from "./routes/clearanceRoutes";
import reportsRoutes from "./routes/reportsRoutes";
import accountsRoutes from "./routes/accountsRoutes";
import noLayoutRoutes from "./routes/noLayoutRoutes";

// Layout with Suspense
const Layout = () => (
  <>
    <Suspense fallback={<div>Loading Navbar...</div>}>
      <Navbar />
    </Suspense>
    <Outlet />
    <Suspense fallback={<div>Loading Footer...</div>}>
      <Footer />
    </Suspense>
  </>
);

const NoLayout = () => <Outlet />;

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Layout />} errorElement={<Suspense fallback={<div>Loading...</div>}><ErrorPage /></Suspense>}>
        <Route path="/home" element={<Suspense fallback={<div>Loading...</div>}><HomePage /></Suspense>} />
        <Route path="/myprofile" element={<Suspense fallback={<div>Loading...</div>}><MyProfile /></Suspense>} />
        <Route path="/logout" element={<Suspense fallback={<div>Loading...</div>}><LogoutPage /></Suspense>} />
        {masterDataRoutes}
        {supplierRoutes}
        {clearanceRoutes}
        {reportsRoutes}
        {accountsRoutes}
      </Route>

      <Route element={<NoLayout />} errorElement={<Suspense fallback={<div>Loading...</div>}><ErrorPage /></Suspense>}>
        {noLayoutRoutes}
      </Route>
    </>
  )
);

function App() {
  return (
    <AuthProvider>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </AuthProvider>
  );
}

export default App;
