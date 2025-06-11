import React from "react";
import { Truck, Users, FileText, Database, CreditCard, FileCheck, Home } from "lucide-react";
import logo from '../assets/logo_lms-removebg-preview.jpg';
const cards = [
  {
    icon: <Truck className="w-10 h-10 text-blue-500" />,
    title: "Supplier Management",
    desc: "Manage suppliers, purchases, payments, invoices, and more with ease.",
    color: "from-blue-100 to-blue-50",
  },
  {
    icon: <Database className="w-10 h-10 text-purple-500" />,
    title: "Master Data",
    desc: "Setup banks, clients, commodities, vessels, containers, and other master data.",
    color: "from-purple-100 to-purple-50",
  },
  {
    icon: <FileCheck className="w-10 h-10 text-orange-500" />,
    title: "Custom Clearance",
    desc: "Handle clearance operations, invoices, credit notes, jobs, and expenses.",
    color: "from-orange-100 to-orange-50",
  },
  {
    icon: <CreditCard className="w-10 h-10 text-pink-500" />,
    title: "Payments",
    desc: "Track and manage all your payment records and receipts.",
    color: "from-pink-100 to-pink-50",
  },
  {
    icon: <FileText className="w-10 h-10 text-indigo-500" />,
    title: "Reports",
    desc: "Generate, search, and analyze various logistics and financial reports.",
    color: "from-indigo-100 to-indigo-50",
  },
  {
    icon: <Users className="w-10 h-10 text-teal-500" />,
    title: "Accounts",
    desc: "Manage accounts, ledgers, vouchers and view balance sheets.",
    color: "from-teal-100 to-teal-50",
  },
];


const HomePage = () => {
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login page if the user is not authenticated
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;  // Alternatively, you can show a loading spinner while redirecting
  }
  return (
    <div className="bg-gradient-to-br from-white via-[#f8fafc] to-indigo-50 min-h-screen pt-40 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center mb-3">
            <img src={logo} alt="logo" className="w-10 h-10 align-middle" />
            {/* <div className="w-16 h-16 bg-gradient-to-br from-white-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <img src={logo} alt="logo" className="w-10 h-10" />
            </div> */}
            <div className="ml-6">
              <h1 className="text-4xl font-black bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent mb-1">
                LOGISTICS MANAGEMENT SYSTEM
              </h1>
              <p className="text-lg text-gray-500 tracking-wide font-semibold text-center">
                Welcome
              </p>
            </div>
          </div>
          <p className="mt-4 text-center text-gray-600 text-xl max-w-2xl">
            Your all-in-one solution for streamlined logistics, supplier, clearance, accounts, and reporting.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`rounded-2xl shadow-xl bg-gradient-to-br ${card.color} p-8 flex flex-col items-center hover:scale-105 transition-transform duration-300`}
            >
              <div className="mb-4">{card.icon}</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h2>
              <p className="text-gray-500 text-center">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;