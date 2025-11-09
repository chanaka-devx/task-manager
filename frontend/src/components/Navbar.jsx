import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-6 px-4">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border border-blue-100">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group" aria-label="Nora Home">
            <div>
              <img src={logo} alt="Nora Task Manager Logo" className="w-12 h-12 rounded-xl" />
            </div>
            <span className="text-2xl font-bold text-[#111827]">Nora</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" 
              href="#home" 
              className="text-[#3B82F6] font-semibold text-base hover:text-[#2563EB] transition-colors relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#3B82F6] rounded-full"></span>
            </Link>
            <a 
              href="#features" 
              className="text-[#111827] font-medium text-base hover:text-[#3B82F6] transition-colors relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3B82F6] rounded-full group-hover:w-full transition-all duration-300"></span>
            </a>
            <a 
              href="#about" 
              className="text-[#111827] font-medium text-base hover:text-[#3B82F6] transition-colors relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3B82F6] rounded-full group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/login" 
              className="flex items-center space-x-2 px-6 py-3 text-[#3B82F6] hover:text-[#2563EB] transition-all font-medium rounded-xl hover:bg-blue-50 group"
            >
              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Sign In</span>
            </Link>
            <Link 
              to="/signup" 
              className="flex items-center space-x-2 px-7 py-3 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white rounded-xl hover:from-[#2563EB] hover:to-[#3B82F6] transition-all shadow-lg hover:shadow-xl font-medium transform hover:scale-105 group"
            >
              <span>Free Sign Up</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-purple-50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[#111827]" />
            ) : (
              <Menu className="w-6 h-6 text-[#111827]" />
            )}
          </button>
        </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-blue-100 animate-fadeIn">
              <div className="flex flex-col space-y-4">
                <a 
                  href="#home" 
                  className="text-[#3B82F6] font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="#features" 
                  className="text-[#111827] font-medium px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-[#3B82F6] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#pricing" 
                  className="text-[#111827] font-medium px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-[#3B82F6] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <a 
                  href="#about" 
                  className="text-[#111827] font-medium px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-[#3B82F6] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </a>
                <div className="pt-4 border-t border-blue-100 space-y-3">
                  <Link 
                    to="/login" 
                    className="flex items-center justify-center space-x-2 px-6 py-3 text-[#3B82F6] hover:bg-blue-50 rounded-lg transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Sign In</span>
                  </Link>
                  <Link 
                    to="/signup" 
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white rounded-lg shadow-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Free Sign Up</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
