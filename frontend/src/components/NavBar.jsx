import { useState, useEffect, useRef } from "react";
import {
  Bell, Mail, Search, ChevronDown, User, LogOut, Home, Database, Truck,
  FileCheck, CreditCard, FileText, Users, Settings, HelpCircle
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo_lms-removebg-preview.jpg";

// Menu definitions
const masterDataMenu = [
  { label: 'Banks', key: 'banks', href: "/bank" },
  { label: 'Clients', key: 'clients', href: "/clients" },
  { label: 'Commodity', key: 'commodity', href: "/commodity" },
  { label: 'Category', key: 'category', href: "/category" },
  { label: 'Expense & Income Head', key: 'expense_income_head' },
  { label: 'Vessel', key: 'vessel', href: "/vessel" },
  { label: 'Container', key: 'container', href: "/container" },
  { label: 'POL', key: 'polldetails', href: "/poll" },
  { label: 'User', key: 'user', href: "/user" },
];

const supplierMenu = [
  { label: 'Add Supplier', key: 'add_supplier', href: "/supplier-add-supplier" },
  { label: 'Supplier Purchase', key: 'supplier_purchase' },
  { label: 'Supplier Payment', key: 'supplier_payment', href: "/supplier-payment" },
  { label: 'Supplier Invoice Edit', key: 'supplier_invoice_edit', href: "/supplier-invoice-edit" },
  { label: 'Assign Supplier', key: 'supplier_assign', href: "/supplier-assign" },
  { label: 'Supplier Creditnote', key: 'supplier_creditnote', href: "/supplier-creditnote" },
  { label: 'Supplier Invoice Cancel', key: 'supplier_invoice_cancel', href: "/supplier-invoicecancel" },
  { label: 'Supplier Statement Report', key: 'supplier_statement_report', href: "/supplier-statement" },
  { label: 'Purchase Search By Supplier', key: 'purchase_search_supplier', href: "/purchase-search" },
];

const clearanceMenu = [
  { label: 'Clearance Operation', key: 'add_clearance_op', href: "/clearance" },
  { label: 'Assign Expense', key: 'assign_expense', href: "/assign-expenses" },
  { label: 'Assign Other Charges', key: 'assign_other_charges', href: "/assign-other-charges" },
  { label: 'Creditnote', key: 'creditnote_search', href: "/credit-note" },
  { label: 'Receipt Cancelation', key: 'receipt_cancelation', href: "recipt-cancel" },
  { label: 'Delivery Note', key: 'delivery_note', href: "/delivery-note" },
];

const reportsMenu = [
  { label: 'Search Invoice (Date, Invoice No, Name)', key: 'search_invoice', href: "/invoice-search" },
  { label: 'Search Invoice By Date', key: 'search_invoice_date', href: "/invoice-search-by-date" },
  { label: 'Search By Invoice No', key: 'search_by_invoice_no', href: "/invoice-search" },
  { label: 'Invoice Search By Bayan No', key: 'invoice_search_bayan', href: "/bayanno" },
  { label: 'Invoice Search By Job No', key: 'invoice_search_job', href: "jobno" },
  { label: 'Customer Statement Report', key: 'customer_statement_report', href: "/customer-statement" },
  { label: 'Payment Report', key: 'payment_report', href: "/payment-report" },
  { label: 'Client Searching', key: 'client_searching', href: "/client-search" },
  { label: 'Cancelled Receipt', key: 'cancelled_receipt', href: "cancel-recipt" },
  { label: 'Expense Reports', key: 'expense_reports' },
  { label: 'Vat Statement', key: 'vat_statement', href: "vat-statement" },
  { label: 'Voucher', key: 'voucher', href: "/voucher-details" },
  { label: 'Profit Report By Jobno', key: 'profit_report_jobno' },
  { label: 'Profit Report By Date', key: 'profit_report_date', href: "/profit-report-by-date" },
  { label: 'Purchase Sales Vat Report', key: 'purchase_sales_vat_report' }
];

const accountsMenu = [
  { label: 'Account Head', key: 'account_head', href: "/account-head" },
  { label: 'Sub Account Head', key: 'sub_account_head' },
  { label: 'Opening Balance', key: 'opening_balance' },
  { label: 'Journal Voucher', key: 'journal_voucher' },
  { label: 'Journal Voucher Edit', key: 'journal_voucher_edit' },
  { label: 'Journal Voucher Print', key: 'journal_voucher_print' },
  { label: 'Journal Report', key: 'journal_report' },
  { label: 'Ledger Report', key: 'ledger_report' },
  { label: 'Trial Balance', key: 'trial_balance' },
  { label: 'Profit And Loss Report', key: 'profit_and_loss_report' },
  { label: 'Balance Sheet', key: 'balance_sheet' },
  { label: 'Balance Sheet(Yearly Base)', key: 'balance_sheet_yearly' },
  { label: 'Cash Book', key: 'cash_book' },
];

const navItems = [
  { icon: Home, text: 'Dashboard', id: 'home', href: "/", color: 'text-violet-600' },
  { icon: Database, text: 'Master Data', hasDropdown: true, id: 'master', color: 'text-indigo-600', dropdownItems: masterDataMenu },
  { icon: Truck, text: 'Suppliers', hasDropdown: true, id: 'supplier', color: 'text-white-600', dropdownItems: supplierMenu },
  { icon: FileCheck, text: 'Custom Clearance', hasDropdown: true, id: 'clearance', color: 'text-orange-600', dropdownItems: clearanceMenu },
  { icon: CreditCard, text: 'Payments', id: 'payment', color: 'text-pink-600' },
  { icon: FileText, text: 'Reports', hasDropdown: true, id: 'reports', color: 'text-indigo-600', dropdownItems: reportsMenu },
  { icon: Users, text: 'Accounts', hasDropdown: true, id: 'accounts', color: 'text-teal-600', dropdownItems: accountsMenu },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const userDropdownRef = useRef(null);

  // Fetch user info
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          window.location.href = '/login';
          return;
        }
        const response = await fetch('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (response.ok && result.data) {
          setUser(result.data.employee_name || "User");
          setIsAdmin(result.data.is_admin === 1);
        } else {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
      } catch {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    })();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    }
    if (isUserDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserDropdownOpen]);

  // Mobile nav close on location change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  // Nav item active check
  const isNavItemActive = (item) => {
    if (item.href && location.pathname === item.href) return true;
    if (item.dropdownItems) {
      return item.dropdownItems.some(sub => sub.href && location.pathname === sub.href);
    }
    return false;
  };

  // Desktop Dropdown
  const renderDropdown = (dropdownItems) => (
    <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-2 animate-fade-in">
      {dropdownItems.map((entry) =>
        entry.href ? (
          <Link
            key={entry.key}
            to={entry.href}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
            tabIndex={0}
          >
            {entry.label}
          </Link>
        ) : (
          <span key={entry.key} className="flex items-center px-4 py-2 text-sm text-gray-400 cursor-not-allowed">{entry.label}</span>
        )
      )}
    </div>
  );

  // Mobile Nav
  const renderMobileNav = () => (
    <nav className="lg:hidden bg-white border-t border-gray-100 shadow-md fixed w-full top-20 left-0 z-40 animate-fade-in">
      <div className="flex flex-col py-4">
        {navItems.map((item) => (
          <div key={item.id}>
            <button
              className={`w-full flex items-center px-6 py-3 text-lg text-gray-700 hover:bg-gray-50 transition-colors ${isNavItemActive(item) ? "text-indigo-600 font-semibold" : ""}`}
              onClick={() => item.hasDropdown ? setActiveDropdown(activeDropdown === item.id ? null : item.id) : setIsMobileMenuOpen(false)}
            >
              <item.icon size={20} className={`mr-3 ${item.color}`} />
              {item.text}
              {item.hasDropdown && (
                <ChevronDown size={18} className={`ml-auto transition-transform ${activeDropdown === item.id ? "rotate-180" : ""}`} />
              )}
            </button>
            {item.hasDropdown && activeDropdown === item.id && (
              <div className="bg-gray-50 pl-10 py-2">
                {item.dropdownItems.map((entry) =>
                  entry.href ? (
                    <Link
                      key={entry.key}
                      to={entry.href}
                      className="block px-3 py-2 text-base text-gray-600 hover:text-indigo-600 hover:bg-white rounded transition-colors"
                    >
                      {entry.label}
                    </Link>
                  ) : (
                    <span key={entry.key} className="block px-3 py-2 text-base text-gray-400">{entry.label}</span>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );

  return (
    <header className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3">
        {/* Logo section */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg ">
              <img src={logo} alt="logo" className="w-11 h-11" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent">LOGISTICS</h1>
            <p className="text-xs text-gray-500 font-medium tracking-wider">MANAGEMENT SYSTEM</p>
          </div>
        </div>
        {/* Search */}
        {/* <form className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-72 transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-300 focus-within:bg-white">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input type="text" placeholder="Search anything..." className="bg-transparent flex-1 text-sm text-gray-700 placeholder-gray-500 outline-none" />
        </form> */}
        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button className="relative p-2.5 bg-gray-100 hover:bg-indigo-50 rounded-xl transition" aria-label="Mails">
            <Mail className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold animate-pulse">3</span>
          </button>
          <button className="p-2.5 bg-gray-100 hover:bg-amber-50 rounded-xl transition" aria-label="Notifications">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          {/* User */}
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
              aria-haspopup="true"
              aria-expanded={isUserDropdownOpen}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-800">{user ? user : 'Loading...'}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isUserDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl z-50 overflow-hidden border border-gray-100 animate-fade-in">
                <div className="p-4 border-b border-gray-100 flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{user}</h3>
                    <p className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'User'}</p>
                  </div>
                </div>
                <div className="py-1">
                  <a href="#" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"><User className="w-4 h-4 mr-3 text-gray-500" />My Profile</a>
                  <a href="#" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"><Settings className="w-4 h-4 mr-3 text-gray-500" />Settings</a>
                  <a href="#" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"><HelpCircle className="w-4 h-4 mr-3 text-gray-500" />Help Center</a>
                </div>
                <div className="py-1 border-t border-gray-100">
                  <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4 mr-3" />Logout
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Mobile menu toggle */}
          <button className="lg:hidden p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition" aria-label="Open menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center justify-center border-t border-gray-100 bg-white">
        <div className="flex items-stretch -mb-px">
          {navItems.map((item) => (
            <div key={item.id} className="relative group">
              <button
                onClick={() => item.hasDropdown && setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                className={`flex items-center space-x-1 px-5 py-4 border-b-2 border-transparent transition-all duration-300 ${isNavItemActive(item) ? 'border-indigo-600 text-indigo-600 font-medium' : 'text-gray-700 hover:text-gray-900 hover:border-gray-300'} ${item.color}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.text}</span>
                {item.hasDropdown && (
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${activeDropdown === item.id ? "rotate-180" : ""}`} />
                )}
              </button>
              {item.hasDropdown && activeDropdown === item.id && renderDropdown(item.dropdownItems)}
            </div>
          ))}
        </div>
      </nav>
      {/* Mobile Navigation */}
      {isMobileMenuOpen && renderMobileNav()}
    </header>
  );
};

export default Navbar;