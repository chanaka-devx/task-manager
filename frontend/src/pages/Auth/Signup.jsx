import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight, User, UserPlus, Sparkles } from "lucide-react";
import useAuth from "../../context/useAuth";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user_data", JSON.stringify({
        email: formData.email,
        role: data.role,
        id: data.user_id
      }));
      
      // Update auth context state
      login(formData.email, data.role);
      
      setSuccessMessage("Signup successful!");

      setTimeout(() => {
  navigate("/dashboard");
      }, 2000);

    } catch (err) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-white via-blue-50/30 to-blue-100/50 relative overflow-hidden">
      {/* Animated Background Elements - Same as Login */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Welcome Section */}
          <div className="hidden lg:block space-y-8 animate-slideInLeft">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                <Sparkles className="w-5 h-5 text-[#3B82F6]" />
                <span className="text-sm font-semibold text-[#111827]">Join Nora Today!</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-[#111827] leading-tight">
                Start Your <br />
                <span className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent">
                  Productivity Journey
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                Create your free account and unlock powerful tools to organize, prioritize, and accomplish your goals with ease.
              </p>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0" style={{ animation: 'slideInRight 0.6s ease-out both' }}>
            {/* Mobile Welcome */}
            <div className="lg:hidden mb-8 text-center">
              <h1 className="text-4xl font-bold text-[#111827] mb-2">
                Join <span className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent">Nora</span>
              </h1>
              <p className="text-gray-600">Create your account to get started</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/20 hover:shadow-blue-200/50 transition-all duration-500">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#111827] mb-2">Create Account</h2>
                <p className="text-gray-600">Fill in your details to get started</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg animate-pulse-slow">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg animate-pulse-slow">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700 font-medium">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#111827]">
                    <User className="w-4 h-4 text-[#3B82F6]" />
                    Full Name
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all text-[#111827] placeholder-gray-400 group-hover:border-gray-300"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#111827]">
                    <Mail className="w-4 h-4 text-[#3B82F6]" />
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all text-[#111827] placeholder-gray-400 group-hover:border-gray-300"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#111827]">
                    <Lock className="w-4 h-4 text-[#3B82F6]" />
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all text-[#111827] placeholder-gray-400 group-hover:border-gray-300"
                      placeholder="Minimum 6 characters"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#111827]">
                    <Lock className="w-4 h-4 text-[#3B82F6]" />
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all text-[#111827] placeholder-gray-400 group-hover:border-gray-300"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start space-x-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-[#3B82F6] border-gray-300 rounded focus:ring-[#3B82F6] cursor-pointer mt-0.5"
                      required
                    />
                    <span className="text-sm text-gray-600 group-hover:text-[#111827] transition-colors">
                      I agree to the <a href="#" className="text-[#3B82F6] hover:text-[#2563EB] font-medium">Terms of Service</a> and <a href="#" className="text-[#3B82F6] hover:text-[#2563EB] font-medium">Privacy Policy</a>
                    </span>
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
                  className="group w-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] hover:from-[#2563EB] hover:to-[#3B82F6] text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:shadow-blue-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <UserPlus className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>
              
              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <Link 
                  to="/login" 
                  className="group inline-flex items-center gap-2 text-[#3B82F6] hover:text-[#2563EB] font-semibold transition-all duration-300"
                >
                  Sign in to your account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
