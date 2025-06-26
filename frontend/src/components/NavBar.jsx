import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, Database, Truck, FileCheck, CreditCard, FileText, Users,
  ChevronDown, User, LogOut, Settings, HelpCircle
} from "lucide-react";
import logo from "../assets/logo_lms-removebg-preview.jpg";

// --- Menu Definitions ---
import navItems from '../menu/navItems';

// --- Dropdown Menu Component ---
const DropdownMenu = ({ dropdownItems }) => (
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

// --- User Dropdown Component ---
const UserDropdown = ({ user, isAdmin, onLogout }) => (
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
      <a href="/myprofile" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"><User className="w-4 h-4 mr-3 text-gray-500" />My Profile</a>
      {/* <a href="#" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"><Settings className="w-4 h-4 mr-3 text-gray-500" />Settings</a>
      <a href="#" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"><HelpCircle className="w-4 h-4 mr-3 text-gray-500" />Help Center</a> */}
    </div>
    <div className="py-1 border-t border-gray-100">
      <button onClick={onLogout} className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
        <LogOut className="w-4 h-4 mr-3" />Logout
      </button>
    </div>
  </div>
);

// --- Mobile Navigation Component ---
const MobileNav = ({
  navItems,
  activeDropdown,
  setActiveDropdown,
  isNavItemActive,
  setIsMobileMenuOpen
}) => (
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

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const userDropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null); // For hover delay

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
    window.location.href = '/logout';
  };

  // Nav item active check
  const isNavItemActive = (item) => {
    if (item.href && location.pathname === item.href) return true;
    if (item.dropdownItems) {
      return item.dropdownItems.some(sub => sub.href && location.pathname === sub.href);
    }
    return false;
  };

  // Handle dropdown hover events
  const handleMouseEnter = (itemId) => {
    clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(itemId);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // 300ms delay before closing
  };

  // Cancel timeout when component unmounts
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-indigo-100 shadow-md">
      {/* Accent Bar */}
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3">
        {/* Logo section */}
        <Link to="/home" className="flex items-center space-x-3">
          <img src={logo} alt="logo" className="w-11 h-11 rounded-full shadow" />
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-700 via-indigo-500 to-indigo-700 bg-clip-text text-transparent">LOGISTICS</h1>
            <p className="text-xs text-gray-500 font-medium tracking-wider">MANAGEMENT SYSTEM</p>
          </div>
        </Link>
        {/* Actions */}
        <div className="flex items-center space-x-3">
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
              <UserDropdown user={user} isAdmin={isAdmin} onLogout={handleLogout} />
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
            <div 
              key={item.id} 
              className="relative group"
              onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={`flex items-center space-x-1 px-5 py-4 border-b-2 border-transparent transition-all duration-300 cursor-pointer ${
                  isNavItemActive(item) 
                    ? 'border-indigo-600 text-indigo-600 font-medium' 
                    : 'text-gray-700 hover:text-gray-900 hover:border-gray-300'
                } ${item.color}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.text}</span>
                {item.hasDropdown && (
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                    activeDropdown === item.id ? "rotate-180" : ""
                  }`} />
                )}
              </div>
              {item.hasDropdown && activeDropdown === item.id && (
                <div 
                  className="absolute left-0 top-full" 
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <DropdownMenu dropdownItems={item.dropdownItems} />
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <MobileNav
          navItems={navItems}
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
          isNavItemActive={isNavItemActive}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      )}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-teal-400 to-indigo-500" />
    </header>
  );
};

export default Navbar;