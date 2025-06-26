import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Truck, Users, FileText, Database, CreditCard, FileCheck, Home, 
  ArrowRight, TrendingUp, Shield, Clock, CheckCircle, Star
} from "lucide-react";
import { useAuth } from "../../../backend/modules/auth/AuthContext";
import logo from '../assets/logo_lms-removebg-preview.jpg';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const userDropdownRef = useRef(null);
  
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
          setUser(result.data.employee_name || "");
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
  // Navigation handlers for each card
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Cards configuration with navigation paths
  const cards = [
    {
      icon: <Truck className="w-8 h-8 text-indigo-600" />,
      title: "Supplier Management",
      desc: "Manage suppliers, purchases, payments, invoices, and more with ease.",
      path: "/supplier-management",
      features: ["Add Suppliers", "Invoice Tracking", "Payment Records", "Supplier Reports"],
      color: "bg-blue-50 hover:bg-blue-100",
      borderColor: "border-blue-200"
    },
    {
      icon: <Database className="w-8 h-8 text-indigo-600" />,
      title: "Master Data",
      desc: "Setup banks, clients, commodities, vessels, containers, and other master data.",
      path: "/master-data",
      features: ["Client Management", "Bank Setup", "Commodity Data", "Vessel Records"],
      color: "bg-purple-50 hover:bg-purple-100",
      borderColor: "border-purple-200"
    },
    {
      icon: <FileCheck className="w-8 h-8 text-indigo-600" />,
      title: "Custom Clearance",
      desc: "Handle clearance operations, invoices, credit notes, jobs, and expenses.",
      path: "/clearance-operations",
      features: ["Clearance Jobs", "Documentation", "Expense Tracking", "Status Updates"],
      color: "bg-orange-50 hover:bg-orange-100",
      borderColor: "border-orange-200"
    },
    {
      icon: <CreditCard className="w-8 h-8 text-indigo-600" />,
      title: "Payments",
      desc: "Track and manage all your payment records and receipts.",
      path: "/payments",
      features: ["Payment Records", "Receipt Management", "Transaction History", "Payment Reports"],
      color: "bg-pink-50 hover:bg-pink-100",
      borderColor: "border-pink-200"
    },
    {
      icon: <FileText className="w-8 h-8 text-indigo-600" />,
      title: "Reports",
      desc: "Generate, search, and analyze various logistics and financial reports.",
      path: "/reports",
      features: ["Financial Reports", "Logistics Analytics", "Custom Reports", "Data Export"],
      color: "bg-green-50 hover:bg-green-100",
      borderColor: "border-green-200"
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      title: "Accounts",
      desc: "Manage accounts, ledgers, vouchers and view balance sheets.",
      path: "/accounts",
      features: ["Account Management", "Ledger Entries", "Balance Sheets", "Financial Statements"],
      color: "bg-teal-50 hover:bg-teal-100",
      borderColor: "border-teal-200"
    },
  ];

  // Quick stats data
  const quickStats = [
    { label: "Active Suppliers", value: "156", icon: <Truck className="w-5 h-5" />, color: "text-blue-600" },
    { label: "Pending Operations", value: "23", icon: <Clock className="w-5 h-5" />, color: "text-orange-600" },
    { label: "Completed Jobs", value: "1,247", icon: <CheckCircle className="w-5 h-5" />, color: "text-green-600" },
    { label: "Total Revenue", value: "$2.4M", icon: <TrendingUp className="w-5 h-5" />, color: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Matching AssignExpenses Style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <img src={logo} alt="LMS Logo" className="w-8 h-8 mr-3" />
              Logistics Management System
            </h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name || 'User'}! Manage your logistics operations efficiently.</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <div className="flex items-center px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
              <Shield className="w-4 h-4 mr-2" />
              System Active
            </div>
          </div>
        </div>

        {/* Quick Stats - Matching AssignExpenses Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="bg-indigo-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
              <Home className="w-5 h-5 mr-2" />
              SYSTEM MODULES
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, index) => (
                <div
                  key={index}
                  onClick={() => handleNavigation(card.path)}
                  className={`
                    ${card.color} ${card.borderColor}
                    border rounded-xl p-6 cursor-pointer transition-all duration-300 
                    hover:shadow-lg hover:scale-105 group
                  `}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-white p-3 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                        {card.icon}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  </div>

                  {/* Card Content */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-800 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2">
                    {card.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Click to access</span>
                      <div className="flex items-center text-indigo-600 group-hover:text-indigo-700 transition-colors">
                        <span className="text-xs font-medium mr-1">Open</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { action: "New supplier added", time: "2 hours ago", icon: <Truck className="w-4 h-4" />, color: "text-blue-600" },
                { action: "Clearance operation completed", time: "4 hours ago", icon: <FileCheck className="w-4 h-4" />, color: "text-green-600" },
                { action: "Payment processed", time: "6 hours ago", icon: <CreditCard className="w-4 h-4" />, color: "text-purple-600" },
                { action: "Report generated", time: "1 day ago", icon: <FileText className="w-4 h-4" />, color: "text-orange-600" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <div className={`${activity.color} mr-3`}>
                      {activity.icon}
                    </div>
                    <span className="text-sm text-gray-800">{activity.action}</span>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img src={logo} alt="LMS Logo" className="w-8 h-8 mr-2" />
              <span className="text-lg font-semibold text-gray-800">Logistics Management System</span>
            </div>
            <p className="text-gray-600 text-sm">
              Streamline your logistics operations with our comprehensive management solution.
            </p>
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>Version 2.1.0</span>
              <span>•</span>
              <span>Last Updated: {new Date().toLocaleDateString()}</span>
              <span>•</span>
              <div className="flex items-center">
                <Star className="w-3 h-3 mr-1 text-yellow-500" />
                <span>Premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
