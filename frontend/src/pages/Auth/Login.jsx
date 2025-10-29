import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../context/useAuth";
import { BASE_URL } from "../../config/apiConfig";

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
      
      // Redirect to admin dashboard
      navigate("/user");
      
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2b2f33] flex">
      

      {/* Main Content */}
      <div className="flex-1 bg-[#3a3f45] p-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-center text-3xl font-bold text-white mb-2">Login</h1>
          </div>

          {/* Login Form Card */}
          <div className="bg-[#2b2f33] rounded-lg p-8 shadow-xl border border-gray-600">
            {error && (
              <div className="bg-blue-500/20 border border-blue-500 p-4 mb-6 rounded-lg">
                <div className="flex items-center">
                  <i className="fa-solid fa-exclamation-circle text-blue-400 mr-2" />
                  <span className="text-blue-300 font-medium">{error}</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <i className="fa-solid fa-envelope text-blue-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#3a3f45] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <i className="fa-solid fa-lock text-blue-400" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#3a3f45] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || !formData.email || !formData.password}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-sign-in-alt" />
                    Sign In
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-600 text-center">
              <p className="text-gray-400 mb-2">Don't have an account?</p>
              <Link 
                to="/signup" 
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                <i className="fa-solid fa-user-plus" />
                Create Account
              </Link>
            </div>
          </div>

          {/* API Status Indicator */}
          {/* <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-400 bg-[#2b2f33] px-3 py-2 rounded-full border border-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              API: {BASE_URL || 'Not configured'}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;