import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, ArrowRight, CheckCircle, Zap, Target, Sparkles } from "lucide-react";
import useAuth from "../../context/useAuth";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token and user data consistently
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_data", JSON.stringify({
        email: formData.email,
        role: data.role,
        id: data.user_id
      }));
      
      // Use the auth context to set the logged in state
      login(formData.email, data.role);
      
  // Redirect to dashboard
  navigate("/dashboard");
      
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-white via-blue-50/30 to-blue-100/50 relative overflow-hidden">
      

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Welcome Section */}
          <div className="hidden lg:block space-y-8 animate-slideInLeft">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                <Sparkles className="w-5 h-5 text-[#3B82F6]" />
                <span className="text-sm font-semibold text-[#111827]">Welcome Back!</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-[#111827] leading-tight">
                Sign in to <br />
                <span className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent">
                  Nora
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                Access your personalized dashboard and continue managing your tasks with ease. Your productivity journey awaits!
              </p>
            </div>
            
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0" style={{ animation: 'slideInRight 0.6s ease-out both' }}>
            {/* Mobile Welcome */}
            <div className="lg:hidden mb-8 text-center">
              <h1 className="text-4xl font-bold text-[#111827] mb-2">
                Welcome to <span className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent">Nora</span>
              </h1>
              <p className="text-gray-600">Sign in to continue your productivity journey</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/20 hover:shadow-blue-200/50 transition-all duration-500">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#111827] mb-2">Sign In</h2>
                <p className="text-gray-600">Enter your credentials to access your account</p>
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
              
              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-[#3B82F6] border-gray-300 rounded focus:ring-[#3B82F6] cursor-pointer"
                    />
                    <span className="text-gray-600 group-hover:text-[#111827] transition-colors">Remember me</span>
                  </label>
                  <a href="#" className="text-[#3B82F6] hover:text-[#2563EB] font-medium transition-colors">
                    Forgot password?
                  </a>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !formData.email || !formData.password}
                  className="group w-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] hover:from-[#2563EB] hover:to-[#3B82F6] text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:shadow-blue-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
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
                  <span className="px-4 bg-white text-gray-500">New to Nora?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <Link 
                  to="/signup" 
                  className="group inline-flex items-center gap-2 text-[#3B82F6] hover:text-[#2563EB] font-semibold transition-all duration-300"
                >
                  Create a free account
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

export default Login;