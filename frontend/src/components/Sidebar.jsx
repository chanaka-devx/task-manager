import React from 'react';
import { LayoutDashboard, ListChecks, Clock, UserCircle, LogOut, ListTodo } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import logo from '../assets/logo.png';

// Collapsible sidebar (toggle handled externally)
const Sidebar = ({ collapsed = false, activeView = 'overview', onViewChange }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const baseAside = "flex flex-col h-[90vh] bg-white/90 backdrop-blur-md border-r border-blue-100 shadow-lg rounded-3xl transition-all duration-300 ease-in-out sticky top-0";
  const widthClass = collapsed ? "w-20" : "w-64";

  return (
    <aside className={`${baseAside} ${widthClass}`}>
      {/* Header (brand only, external toggle button used) */}
      <div className={`flex items-center transition-all duration-300 ${collapsed ? 'justify-center py-6' : 'space-x-3 p-6'}`}>
        <Link to="/" className="flex items-center space-x-3 group" aria-label="Nora Home">
            <div>
                <img src={logo} alt="Nora Task Manager Logo" className="w-10 h-10 rounded-xl" />
            </div>
        </Link>
        <span className={`text-2xl font-bold text-[#111827] whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>Nora</span>
      </div>

      {/* Nav */}
      <nav className={`flex-1 space-y-2 ${collapsed ? 'px-4' : 'px-6'} transition-all duration-300`}>
        <button 
          onClick={() => onViewChange('overview')}
          className={`w-full flex items-center rounded-xl text-sm font-medium transition ${collapsed ? 'justify-center px-3 py-3' : 'space-x-3 px-4 py-3'} ${
            activeView === 'overview' 
              ? 'bg-blue-100 text-[#3B82F6]' 
              : 'text-[#111827] hover:bg-blue-50 hover:text-[#3B82F6]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          <span className={`whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>Overview</span>
        </button>
        <button 
          onClick={() => onViewChange('tasks')}
          className={`w-full flex items-center rounded-xl text-sm font-medium transition ${collapsed ? 'justify-center px-3 py-3' : 'space-x-3 px-4 py-3'} ${
            activeView === 'tasks' 
              ? 'bg-blue-100 text-[#3B82F6]' 
              : 'text-[#111827] hover:bg-blue-50 hover:text-[#3B82F6]'
          }`}
        >
          <ListChecks className="w-5 h-5 flex-shrink-0" />
          <span className={`whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>Tasks</span>
        </button>
        <button 
          onClick={() => onViewChange('activity')}
          className={`w-full flex items-center rounded-xl text-sm font-medium transition ${collapsed ? 'justify-center px-3 py-3' : 'space-x-3 px-4 py-3'} ${
            activeView === 'activity' 
              ? 'bg-blue-100 text-[#3B82F6]' 
              : 'text-[#111827] hover:bg-blue-50 hover:text-[#3B82F6]'
          }`}
        >
          <Clock className="w-5 h-5 flex-shrink-0" />
          <span className={`whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>Activity</span>
        </button>
        <button 
          onClick={() => onViewChange('todo')}
          className={`w-full flex items-center rounded-xl text-sm font-medium transition ${collapsed ? 'justify-center px-3 py-3' : 'space-x-3 px-4 py-3'} ${
            activeView === 'todo' 
              ? 'bg-blue-100 text-[#3B82F6]' 
              : 'text-[#111827] hover:bg-blue-50 hover:text-[#3B82F6]'
          }`}
        >
          <ListTodo className="w-5 h-5 flex-shrink-0" />
          <span className={`whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>Todo Lists</span>
        </button>
      </nav>

      {/* Spacer to push user section to bottom */}
      <div className="flex-1"></div>

      {/* User + Logout */}
      <div className={`space-y-4 pb-6 ${collapsed ? 'px-4' : 'px-6'} transition-all duration-300`}>
        {user && (
          <div className={`flex items-center p-3 bg-blue-50 rounded-xl transition-all duration-300 ${collapsed ? 'justify-center' : 'space-x-3'}`}>
            <UserCircle className="w-8 h-8 text-[#3B82F6] flex-shrink-0" />
            <div className={`transition-all duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              <p className="text-sm font-semibold text-[#111827] whitespace-nowrap">{user.email}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className={`w-full flex items-center justify-center rounded-xl text-sm font-semibold bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white hover:from-[#2563EB] hover:to-[#3B82F6] shadow-md transition-all duration-300 ${collapsed ? 'px-3 py-3' : 'space-x-2 px-4 py-3'}`}>
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className={`whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
