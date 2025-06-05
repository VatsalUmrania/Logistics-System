import React from "react";
import { Link } from "react-router-dom";
import logo from '../assets/logo_lms-removebg-preview.jpg';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header - Modern Frosted Glass Effect */}
      <header className="fixed w-full backdrop-blur-sm bg-white/75 shadow-sm z-50">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-lg transform rotate-6 transition-transform group-hover:rotate-12"></div>
                {/* <svg className="w-10 h-10 text-white relative" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg> */}
                
              </div>
              <img src={logo} alt="logo" className="w-11 h-11" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Logistics Management System
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#how-it-works">How it Works</NavLink>
              <NavLink href="#tech-stack">Tech Stack</NavLink>
              <Link
  to="/login"
  className="px-6 py-2.5 text-blue-600 border-2 border-blue-600/20 rounded-full hover:border-blue-600 transition-colors duration-300"
>
  Login
</Link>

              <button className="px-6 py-2.5 text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300">
                Get Started
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section - With Animated Elements */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center relative">
            {/* Decorative Elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-600/10 rounded-full blur-3xl"></div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
              Streamline Your 
              <span className="block text-blue-600">Logistics Operations</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Revolutionize your supply chain with intelligent automation, real-time tracking, 
              and data-driven insights. Experience logistics management reimagined.
            </p>
            
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
              <button className="w-full md:w-auto px-8 py-4 text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300 group">
                <span className="flex items-center justify-center space-x-2">
                  <span>Start Free Trial</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              
              <button className="w-full md:w-auto px-8 py-4 text-gray-700 bg-white border-2 border-gray-200 rounded-full hover:border-blue-600/20 transition-colors duration-300 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats Section */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatCard number="99.9%" label="Uptime" />
              <StatCard number="50K+" label="Deliveries Tracked" />
              <StatCard number="30%" label="Cost Reduction" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Cards with Hover Effects */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <SectionHeader 
            title="Powerful Features"
            subtitle="Everything you need to manage your logistics operations efficiently"
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
              title="Inventory Management"
              description="Real-time tracking of stock levels with automated reordering and shortage predictions."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
              title="Route Optimization"
              description="AI-powered route planning that considers traffic, weather, and vehicle capacity."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Real-time Security"
              description="End-to-end encryption and real-time monitoring of sensitive shipments."
            />
          </div>
        </div>
      </section>

      {/* How It Works - Interactive Timeline */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <SectionHeader 
            title="How It Works"
            subtitle="Get started with LogiFlow in three simple steps"
          />
          
          <div className="max-w-4xl mx-auto mt-16">
            <div className="space-y-12">
              <TimelineItem 
                number="01"
                title="Set Up Your Account"
                description="Quick onboarding process with guided setup and customization options."
              />
              <TimelineItem 
                number="02"
                title="Import Your Data"
                description="Seamless data migration with support for multiple file formats and APIs."
              />
              <TimelineItem 
                number="03"
                title="Start Optimizing"
                description="Immediate access to analytics and optimization recommendations."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Custom Components */}
      {/* You can place these components at the bottom of the file */}
    </div>
  );
};

// Helper Components
const NavLink = ({ href, children }) => (
  <a 
    href={href} 
    className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
  >
    {children}
  </a>
);

const StatCard = ({ number, label }) => (
  <div className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 hover:border-blue-600/20 transition-colors duration-300">
    <div className="text-3xl font-bold text-blue-600 mb-1">{number}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center max-w-2xl mx-auto">
    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent">
      {title}
    </h2>
    <p className="text-xl text-gray-600">{subtitle}</p>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-600/20 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const TimelineItem = ({ number, title, description }) => (
  <div className="flex items-start space-x-6">
    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
      {number}
    </div>
    <div className="flex-grow pt-1">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export default LandingPage;