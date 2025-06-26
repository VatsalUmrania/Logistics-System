import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, Users, FileText, Database, CreditCard, FileCheck, 
  ArrowRight, CheckCircle, Star, Shield, Clock, Globe,
  Menu, X, Phone, Mail, MapPin, ChevronRight, Play,
  BarChart3, TrendingUp, Award, Zap
} from 'lucide-react';
import logo from '../assets/logo_lms-removebg-preview.jpg';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Navigation handler
  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleLearnMore = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  // Features data
  const features = [
    {
      icon: <Truck className="w-12 h-12 text-indigo-600" />,
      title: "Supplier Management",
      description: "Comprehensive supplier relationship management with invoice tracking, payment processing, and performance analytics.",
      benefits: ["Automated invoicing", "Payment tracking", "Supplier analytics", "Performance monitoring"]
    },
    {
      icon: <Database className="w-12 h-12 text-indigo-600" />,
      title: "Master Data Management",
      description: "Centralized data management for banks, clients, commodities, vessels, and containers with real-time synchronization.",
      benefits: ["Centralized database", "Real-time sync", "Data integrity", "Easy maintenance"]
    },
    {
      icon: <FileCheck className="w-12 h-12 text-indigo-600" />,
      title: "Custom Clearance",
      description: "Streamlined clearance operations with automated documentation, job tracking, and expense management.",
      benefits: ["Automated docs", "Job tracking", "Expense control", "Compliance monitoring"]
    },
    {
      icon: <CreditCard className="w-12 h-12 text-indigo-600" />,
      title: "Payment Processing",
      description: "Secure payment management with multi-currency support, automated reconciliation, and detailed reporting.",
      benefits: ["Multi-currency", "Auto reconciliation", "Secure processing", "Detailed reports"]
    },
    {
      icon: <FileText className="w-12 h-12 text-indigo-600" />,
      title: "Advanced Reporting",
      description: "Comprehensive reporting suite with real-time analytics, custom dashboards, and automated insights.",
      benefits: ["Real-time analytics", "Custom dashboards", "Automated insights", "Export capabilities"]
    },
    {
      icon: <Users className="w-12 h-12 text-indigo-600" />,
      title: "Account Management",
      description: "Complete financial management with ledgers, vouchers, balance sheets, and audit trails.",
      benefits: ["Complete ledgers", "Audit trails", "Balance sheets", "Financial control"]
    }
  ];

  // Statistics
  const stats = [
    { number: "500+", label: "Active Clients", icon: <Users className="w-8 h-8" /> },
    { number: "10K+", label: "Operations Completed", icon: <CheckCircle className="w-8 h-8" /> },
    { number: "99.9%", label: "System Uptime", icon: <Shield className="w-8 h-8" /> },
    { number: "24/7", label: "Support Available", icon: <Clock className="w-8 h-8" /> }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Ahmed Al-Rashid",
      role: "Operations Manager",
      company: "Gulf Logistics Co.",
      content: "This system has revolutionized our logistics operations. The automation features have saved us countless hours and improved our accuracy significantly.",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "Finance Director",
      company: "International Freight Solutions",
      content: "The financial management and reporting capabilities are outstanding. We now have complete visibility into our operations and costs.",
      rating: 5
    },
    {
      name: "Mohammed Hassan",
      role: "CEO",
      company: "Red Sea Shipping",
      content: "Implementation was smooth and the support team is exceptional. Our efficiency has increased by 40% since adopting this system.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img src={logo} alt="LMS Logo" className="w-8 h-8 mr-3" />
              <span className="text-xl font-bold text-gray-800">Logistics Management System</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#benefits" className="text-gray-600 hover:text-indigo-600 transition-colors">Benefits</a>
              <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 transition-colors">Testimonials</a>
              <a href="#contact" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</a>
              <button
                onClick={handleGetStarted}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-800"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
                <a href="#benefits" className="text-gray-600 hover:text-indigo-600 transition-colors">Benefits</a>
                <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 transition-colors">Testimonials</a>
                <a href="#contact" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</a>
                <button
                  onClick={handleGetStarted}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div>
              <div className="inline-flex items-center bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4 mr-2" />
                Next-Generation Logistics Platform
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Streamline Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> Logistics</span>
                <br />Operations
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Comprehensive logistics management system designed to optimize your supply chain, 
                reduce costs, and improve operational efficiency with cutting-edge technology.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center transition-all transform hover:scale-105 shadow-lg"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button
                  onClick={handleLearnMore}
                  className="border-2 border-gray-300 hover:border-indigo-600 text-gray-700 hover:text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center transition-all"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex items-center space-x-8">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-600">Industry Leader</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">Global Support</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <h3 className="text-lg font-semibold">Dashboard Overview</h3>
                      <p className="text-indigo-200">Real-time insights</p>
                    </div>
                    <BarChart3 className="w-8 h-8" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  {stats.slice(0, 3).map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-indigo-600 mr-3">{stat.icon}</div>
                        <span className="text-gray-700">{stat.label}</span>
                      </div>
                      <span className="font-bold text-indigo-600">{stat.number}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-medium animate-bounce">
                ✨ New Features
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-400 text-green-900 px-4 py-2 rounded-full text-sm font-medium">
                🚀 Fast Setup
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4 text-indigo-400">
                  {stat.icon}
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> Modern Logistics</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your logistics operations efficiently, from supplier management to financial reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Feature Display */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8">
              <div className="mb-6">{features[activeFeature].icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {features[activeFeature].title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {features[activeFeature].description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {features[activeFeature].benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Navigation */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                    activeFeature === index
                      ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-center">
                    <div className={`mr-4 ${activeFeature === index ? 'text-white' : 'text-indigo-600'}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{feature.title}</h4>
                      <p className={`text-sm ${activeFeature === index ? 'text-indigo-100' : 'text-gray-500'}`}>
                        {feature.description.substring(0, 60)}...
                      </p>
                    </div>
                    <ChevronRight className={`w-5 h-5 ml-auto ${activeFeature === index ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of logistics professionals who trust our platform to streamline their operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="w-8 h-8 text-green-600" />,
                title: "Increase Efficiency",
                description: "Automate routine tasks and reduce manual work by up to 70% with our intelligent automation features.",
                color: "green"
              },
              {
                icon: <Shield className="w-8 h-8 text-blue-600" />,
                title: "Enhanced Security",
                description: "Enterprise-grade security with end-to-end encryption, role-based access, and audit trails.",
                color: "blue"
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
                title: "Real-time Analytics",
                description: "Make data-driven decisions with comprehensive dashboards and real-time reporting capabilities.",
                color: "purple"
              },
              {
                icon: <Globe className="w-8 h-8 text-indigo-600" />,
                title: "Global Scalability",
                description: "Scale your operations globally with multi-currency, multi-language, and multi-timezone support.",
                color: "indigo"
              },
              {
                icon: <Clock className="w-8 h-8 text-orange-600" />,
                title: "24/7 Support",
                description: "Round-the-clock technical support and dedicated account management for enterprise clients.",
                color: "orange"
              },
              {
                icon: <Zap className="w-8 h-8 text-yellow-600" />,
                title: "Quick Implementation",
                description: "Get up and running in days, not months, with our streamlined onboarding process.",
                color: "yellow"
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className={`bg-${benefit.color}-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our clients say about their experience with our logistics management platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-indigo-600">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Logistics?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
            Join thousands of businesses already using our platform to streamline their operations and reduce costs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center transition-all transform hover:scale-105 shadow-lg"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all">
              Schedule Demo
            </button>
          </div>
          <p className="text-indigo-200 text-sm mt-6">
            No credit card required • 30-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <img src={logo} alt="LMS Logo" className="w-8 h-8 mr-3" />
                <span className="text-2xl font-bold">Logistics Management System</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                The most comprehensive logistics management platform designed to optimize your supply chain operations and drive business growth.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-indigo-400" />
                  <span className="text-gray-300">+966 11 234 5678</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-indigo-400" />
                  <span className="text-gray-300">contact@logiflow.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-indigo-400" />
                  <span className="text-gray-300">Riyadh, Saudi Arabia</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <div className="space-y-3">
                <a href="#features" className="block text-gray-400 hover:text-white transition-colors">Features</a>
                <a href="#benefits" className="block text-gray-400 hover:text-white transition-colors">Benefits</a>
                <a href="#testimonials" className="block text-gray-400 hover:text-white transition-colors">Testimonials</a>
                <button onClick={handleGetStarted} className="block text-gray-400 hover:text-white transition-colors text-left">
                  Get Started
                </button>
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <div className="space-y-3">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Documentation</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Help Center</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">API Reference</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Contact Support</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Logistics Management System. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
