import React from 'react';
import { Facebook, Twitter, Youtube, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';  
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-white border-t py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1.5fr] gap-8 md:gap-12 lg:gap-20 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Link to="/" className="flex items-center space-x-3 group" aria-label="Nora Home">
            <div>
              <img src={logo} alt="Nora Task Manager Logo" className="w-10 h-10 rounded-xl" />
            </div>
          </Link>
              <span className="text-xl font-bold text-[#111827]">Nora</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Empowering professionals worldwide with intuitive task management and seamless collaboration tools.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-[#111827] mb-4">Quick Link</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-600 hover:text-[#3B82F6] transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-600 hover:text-[#3B82F6] transition-colors text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-600 hover:text-[#3B82F6] transition-colors text-sm">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-[#111827] mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#3B82F6] transition-colors text-sm">
                  Terms & conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#3B82F6] transition-colors text-sm">
                  Customer Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#3B82F6] transition-colors text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-[#111827] mb-4">Newsletter</h3>
            <p className="text-gray-600 text-sm mb-4">Stay up to date</p>
            <div className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="Enter email here"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] text-sm"
              />
              <button className="w-full px-6 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors shadow-md hover:shadow-lg text-sm font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-sm bg-white cursor-pointer">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>

            {/* Copyright */}
            <div className="text-gray-600 text-sm">
              © {new Date().getFullYear()} All Rights Reserved
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gradient-to-br from-blue-50 to-white rounded-full flex items-center justify-center hover:from-[#3B82F6] hover:to-[#60A5FA] hover:text-white transition-all text-[#3B82F6] shadow-sm hover:shadow-md border border-blue-100"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gradient-to-br from-blue-50 to-white rounded-full flex items-center justify-center hover:from-[#3B82F6] hover:to-[#60A5FA] hover:text-white transition-all text-[#3B82F6] shadow-sm hover:shadow-md border border-blue-100"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gradient-to-br from-blue-50 to-white rounded-full flex items-center justify-center hover:from-[#3B82F6] hover:to-[#60A5FA] hover:text-white transition-all text-[#3B82F6] shadow-sm hover:shadow-md border border-blue-100"
                aria-label="Youtube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gradient-to-br from-blue-50 to-white rounded-full flex items-center justify-center hover:from-[#3B82F6] hover:to-[#60A5FA] hover:text-white transition-all text-[#3B82F6] shadow-sm hover:shadow-md border border-blue-100"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
