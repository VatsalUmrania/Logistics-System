import React from 'react';
import { 
  FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub 
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-blue-50 to-blue-100 py-12 border-t border-blue-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold text-blue-600">Logistics Management</h3>
            <p className="text-gray-600">
              Streamlining your logistics operations with modern solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-blue-600 hover:text-blue-700 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-blue-600 hover:text-blue-700 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-blue-600 hover:text-blue-700 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold text-blue-600">Quick Links</h3>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Services</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
          </div>

          {/* Resources */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold text-blue-600">Resources</h3>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Blog</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Help Center</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Careers</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</a>
          </div>

          {/* Developers */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold text-blue-600">Developers</h3>
            <div className="flex flex-col space-y-2">
              <a href="https://github.com/developer1" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors" target="_blank" rel="noopener noreferrer">
                <FaGithub className="mr-2 text-blue-600" />
                <span>Developer 1</span>
              </a>
              <a href="https://github.com/developer2" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors" target="_blank" rel="noopener noreferrer">
                <FaGithub className="mr-2 text-blue-600" />
                <span>Developer 2</span>
              </a>
              <a href="https://github.com/developer3" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors" target="_blank" rel="noopener noreferrer">
                <FaGithub className="mr-2 text-blue-600" />
                <span>Developer 3</span>
              </a>
              <a href="https://github.com/developer4" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors" target="_blank" rel="noopener noreferrer">
                <FaGithub className="mr-2 text-blue-600" />
                <span>Developer 4</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
            <p className="text-gray-600">
              © {new Date().getFullYear()} Logistics Management System. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
