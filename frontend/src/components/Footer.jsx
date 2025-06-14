import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-blue-50 to-blue-100 py-8 mt-auto border-t border-blue-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold mb-2 text-blue-600">Logistics Management</h3>
            <p className="text-gray-600">
              Streamlining your logistics operations with modern solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold mb-2 text-blue-600">Quick Links</h3>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Services</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold mb-2 text-blue-600">Contact Us</h3>
            <p className="text-gray-600 flex items-center">
              <i className="fas fa-envelope mr-2 text-blue-600"></i>
              info@logistics.com
            </p>
            <p className="text-gray-600 flex items-center">
              <i className="fas fa-phone mr-2 text-blue-600"></i>
              +1 (123) 456-7890
            </p>
            <p className="text-gray-600 flex items-center">
              <i className="fas fa-map-marker-alt mr-2 text-blue-600"></i>
              123 Logistics Street
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} Logistics Management System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;