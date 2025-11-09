import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Bell, Mic, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BoardColumn from '../components/BoardColumn';

const sampleData = {
  new: [
    { id: 't1', title: 'List of tasks to start the project', description: 'Kickoff checklist for stakeholders and scope.', priority: 'high', status: 'new', tags: ['task list'], members: [{ initials: 'MD' } , { initials: 'SJ' }], comments: 19, due: 'Today' },
  ],
  progress: [
    { id: 't2', title: 'Designing the design with the customer', description: 'Home page logic and color palette', priority: 'medium', status: 'progress', tags: ['discussion'], members: [{ initials: 'IV' }, { initials: 'AM' }, { initials: 'JJ' }], comments: 12, due: '24 Oct' },
  ],
  personal: [
    { id: 't3', title: 'Design for app', description: 'Concept and style, wireframes, niche analysis', priority: 'low', status: 'personal', tags: ['UI Kit', 'Design system'], members: [{ initials: 'AB' }], comments: 8, due: 'This week' },
  ]
};

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Restore persisted state
  useEffect(() => {
    const stored = localStorage.getItem('sidebar_collapsed');
    if (stored === 'true') setCollapsed(true);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  const gridTemplate = collapsed ? 'lg:grid-cols-[5.5rem_1fr]' : 'lg:grid-cols-[16rem_1fr]';

  return (
    <div className="min-h-screen bg-gradient-radial from-white via-blue-50/30 to-blue-100/50 p-4 md:p-6">
      <div className={`max-w-7xl mx-auto grid grid-cols-1 ${gridTemplate} gap-6 transition-[grid-template-columns] duration-300`}>        
        {/* Sidebar with Toggle Button */}
        <div className="relative hidden lg:block">
          <Sidebar collapsed={collapsed} />
          {/* External Toggle Button (positioned at right top corner of left panel) */}
          <button
            onClick={toggleSidebar}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="absolute top-4 -right-4 inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white/90 backdrop-blur border border-blue-100 shadow hover:shadow-md hover:bg-blue-50 text-[#111827] transition z-20"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Main area */}
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-3xl border border-blue-100 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="text-[#6B7280]">Your work</span>
                <ChevronDown className="w-4 h-4" />
                <span className="hidden sm:inline">Projects</span>
                <ChevronDown className="w-4 h-4 hidden sm:block" />
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3" />
                  <input className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]" placeholder="Search" />
                </div>
                <button className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-blue-50">
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-blue-50">
                  <Mic className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-blue-50">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white text-sm font-semibold shadow-md hover:from-[#2563EB] hover:to-[#3B82F6]">
                  <Plus className="w-4 h-4" />
                  Create
                </button>
              </div>
            </div>
          </div>

          

          {/* Board */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            <BoardColumn
              title="New"
              subtitle="8 tasks • 367 hours"
              colorClass="from-green-50 to-white"
              tasks={sampleData.new}
            />
            <BoardColumn
              title="In Progress"
              subtitle="14 tasks • 284 hours"
              colorClass="from-pink-50 to-white"
              tasks={sampleData.progress}
            />
            <BoardColumn
              title="Personal"
              subtitle="6 tasks • 129 hours"
              colorClass="from-blue-50 to-white"
              tasks={sampleData.personal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
