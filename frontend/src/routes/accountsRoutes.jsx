import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
// Lazy load the components
const AccountHead = lazy(() => import("../pages/accounts/AccountHead"));
const JournalVoucher = lazy(() => import("../pages/accounts/JournalVoucher"));
const Cashbook = lazy(() => import("../pages/accounts/CashBook"));
const BalanceSheet = lazy(() => import("../pages/accounts/BalanceSheet"));
const LedgerReport = lazy(() => import("../pages/accounts/LedgerReport "));
const SubAccountHeadPage = lazy(() => import("../pages/accounts/SubAccountHead"));
const OpeningBalancePage = lazy(() => import("../pages/accounts/OpeningBalance"));

const accountsRoutes = (
  <>
    <Route
      path="/account-head"
      element={
        <Suspense fallback={<div>Loading...</div>}>
          <AccountHead />
        </Suspense>
      }
    />
    <Route
      path="/journal-voucher"
      element={
        <Suspense fallback={<div>Loading...</div>}>
          <JournalVoucher />
        </Suspense>
      }
    />
    <Route
      path="/cashbook"
      element={
        <Suspense fallback={<div>Loading...</div>}>
          <Cashbook />
        </Suspense>
      }
    />
    <Route
      path="/balance-sheet"
      element={
        <Suspense fallback={<div>Loading...</div>}>
          <BalanceSheet />
        </Suspense>
      }
    />
    <Route
      path="/ledger-report"
      element={
        <Suspense fallback={<div>Loading...</div>}>
          <LedgerReport />
        </Suspense>
      }
    />
    <Route
      path="/sub-account-head"
      element={
        <Suspense fallback={<div>Loading...</div>}>
          <SubAccountHeadPage />
        </Suspense>
      }
    />
    <Route
      path="/opening-balance"
      element={
        <Suspense fallback={<div>Loading...</div>}>
          <OpeningBalancePage />
        </Suspense>
      }
    />
  </>
);

export default accountsRoutes;
