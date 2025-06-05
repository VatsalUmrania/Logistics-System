// import React from "react";
// import {
//   createBrowserRouter,
//   RouterProvider,
//   Route,
//   createRoutesFromElements,
//   Outlet
// } from "react-router-dom";

// import LandingPage from "./components/LandingPage";
// import LoginPage from "./components/LoginPage";
// import Navbar from "./components/NavBar";
// import HomePage from "./components/Home";
// import ErrorPage from "./components/ErrorPage";
// import PollDetails from "./components/PollDetial";
// import VesselDetailsPage from "./components/Vessel";
// import UserManagementPage from "./components/User";
// import CommodityManagementPage from "./components/Commodity";
// import BankInformationPage from "./pages/masterdata/Bank";

// import ClientManagementPage from "./components/Clients";
// import CategoriesManagementPage from "./components/Categories";
// import ContainerDetailsPage from "./components/Container";
// import AssignSupplier from "./components/assignsupp";
// import AddSupplierPage from "./components/AddSupplier";
// import SupplierInvoiceEditPage from "./components/SupplierInvoiceEdit";
// import DeliveryNotePage from "./components/DeliveryNote";
// import JobSearchByNo from "./components/JobSearchByNo";
// import InvoiceSearch from "./components/InvoiceSearch";
// import CustomerStatement from "./components/CustomerStatement";
// import PaymentReport from "./components/PaymentReport";
// import BayanNoSearch from "./components/BayanNoSearch";
// import ClientSearch from "./components/ClientSearch";
// import InvoiceSearchByDate from "./components/InvoiceSearchByDate";
// import VoucherDetails from "./components/VoucherDetails";
// import CancelledReceiptDetails from "./components/CancelledReceiptDetails";
// import VatStatementReport from "./components/VatStatementReport";
// import ProfitReportByDate from "./components/ProfitReportByDate";

// const Layout = () => (
//   <>
//     <Navbar />
//     <Outlet />
//   </>
// );

// // Optional: a placeholder for routes that intentionally use no layout
// const NoLayout = () => <Outlet />;

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <>
//       {/* Layout Routes */}
//       <Route element={<Layout />} errorElement={<ErrorPage />}>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/poll" element={<PollDetails />} />
//         <Route path="/vessel" element={<VesselDetailsPage />} />
//         <Route path="/user" element={<UserManagementPage />} />
//         <Route path="/commodity" element={<CommodityManagementPage />} />
//         <Route path="/bank" element={<BankInformationPage />} />
//         <Route path="/clients" element={<ClientManagementPage />} />
//         <Route path="/category" element={<CategoriesManagementPage />} />
//         <Route path="/container" element={<ContainerDetailsPage />} />
//         <Route path="/addsupplier" element={<AddSupplierPage />} />
//         <Route path="/invoice-edit" element={<SupplierInvoiceEditPage />} />
//         <Route path="/deliverynote" element={<DeliveryNotePage />} />
//         <Route path="/jobno" element={<JobSearchByNo />} />
//         <Route path="/invoice-search" element={<InvoiceSearch />} />
//         <Route path="/customer-statement" element={<CustomerStatement />} />
//         <Route path="/payment-report" element={<PaymentReport />} />
//         <Route path="/bayanno" element={<BayanNoSearch />} />
//         <Route path="/client-search" element={<ClientSearch />} />
//         <Route path="/invoice-search-by-date" element={<InvoiceSearchByDate />} />
//         <Route path="/voucher-details" element={<VoucherDetails />} />
//         <Route path="/cancel-recipt" element={<CancelledReceiptDetails />} />
//         <Route path="/vat-statement" element={<VatStatementReport />} />
//         <Route path="/profit-report-by-date" element={<ProfitReportByDate />} />
//       </Route>

//       {/* No Layout Routes */}
//       <Route element={<NoLayout />} errorElement={<ErrorPage />}>
//         <Route path="/assignup" element={<AssignSupplier />} />
//         <Route path="/landing-page" element={<LandingPage />} />
//         <Route path="/login" element={<LoginPage />} />
//       </Route>
//     </>
//   )
// );

// function App() {
//   return (
//     <React.StrictMode>
//       <RouterProvider router={router} />
//     </React.StrictMode>
//   );
// }

// export default App;



import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Outlet,
} from "react-router-dom";

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
