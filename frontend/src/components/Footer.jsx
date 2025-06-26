import React from 'react';
import {
  Facebook, Twitter, Linkedin, Github, Mail, Phone, MapPin
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-indigo-50 to-indigo-100 border-t border-indigo-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-indigo-200">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-indigo-700 mb-3 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-indigo-500" />
              Logistics Management
            </h3>
            <p className="text-gray-600 mb-4">
              Streamlining your logistics operations with modern, reliable solutions.
            </p>
            <div className="flex space-x-3 mt-2">
              <a href="#" aria-label="Facebook" className="text-indigo-600 hover:text-indigo-800 transition">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-indigo-600 hover:text-indigo-800 transition">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-indigo-600 hover:text-indigo-800 transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-indigo-700 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/home" className="text-gray-600 hover:text-indigo-700 transition">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-700 transition">Services</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-700 transition">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-700 transition">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-bold text-indigo-700 mb-3">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-indigo-700 transition">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-700 transition">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-700 transition">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-700 transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact & Developers */}
          <div>
            <h3 className="text-xl font-bold text-indigo-700 mb-3">Contact & Developers</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-gray-600">
                <Mail size={16} className="text-indigo-500" />
                <a href="mailto:support@logistics.com" className="hover:text-indigo-700 transition">support@logistics.com</a>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Phone size={16} className="text-indigo-500" />
                <a href="tel:+1234567890" className="hover:text-indigo-700 transition">+1 234 567 890</a>
              </li>
            </ul>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Developers</p>
              <div className="flex flex-col space-y-1">
                <a href="https://github.com/vatsalumrania" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-indigo-700 transition">
                  <Github size={20} className="text-indigo-500" />
                  <span>Vatsal Umrania</span>
                </a>
                <a href="https://github.com/AdityaNair-jpg" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-indigo-700 transition">
                  <Github size={20} className="text-indigo-500" />
                  <span>Aditya Nair</span>
                </a>
                <a href="https://github.com/407raina" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-indigo-700 transition">
                  <Github size={20} className="text-indigo-500" />
                  <span>Raina Mendonca</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Logistics Management System. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-indigo-700 text-sm transition">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-indigo-700 text-sm transition">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
