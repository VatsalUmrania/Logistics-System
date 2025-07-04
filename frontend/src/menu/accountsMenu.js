import { href } from "react-router-dom";

const accountsMenu = [
    { label: 'Account Head', key: 'account_head', href: "/account-head" },
    { label: 'Sub Account Head', key: 'sub_account_head',href:"/sub-account-head" },
    { label: 'Opening Balance', key: 'opening_balance',href:"/opening-balance" },
    { label: 'Journal Voucher', key: 'journal_voucher', href:"/journal-voucher" },
    { label: 'Journal Voucher Edit', key: 'journal_voucher_edit' },
    { label: 'Journal Voucher Print', key: 'journal_voucher_print' },
    { label: 'Journal Report', key: 'journal_report' },
    { label: 'Ledger Report', key: 'ledger_report', href:"/ledger-report" },
    { label: 'Trial Balance', key: 'trial_balance' },
    { label: 'Profit And Loss Report', key: 'profit_and_loss_report' },
    { label: 'Balance Sheet', key: 'balance_sheet', href:"/balance-sheet" },
    { label: 'Balance Sheet(Yearly Base)', key: 'balance_sheet_yearly' },
    { label: 'Cash Book', key: 'cash_book', href:"/cashbook" },
  ];

  export default accountsMenu;
  