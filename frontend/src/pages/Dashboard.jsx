import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, ChevronLeft, ChevronRight, X, Calendar, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BoardColumn from '../components/BoardColumn';
import TodoView from '../components/TodoView';
import { BASE_URL } from '../config/apiConfig';

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [tasks, setTasks] = useState({
    scheduled: [],
    inProgress: [],
    done: []
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [timePeriod, setTimePeriod] = useState('week'); // 'week' or 'month'
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    priority: 'medium',
    date: new Date().toISOString().split('T')[0],
    dueDate: ''
  });

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setError('Please login to view tasks');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      // Always apply time period filter
      if (timePeriod) params.append('timePeriod', timePeriod);

      const response = await fetch(`${BASE_URL}/api/tasks?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on mount and when filters change
  useEffect(() => {
    fetchTasks();
  }, [searchTerm, timePeriod, activeView]);

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

  const handleDragStart = (task, sourceColumn) => {
    setDraggedTask({ task, sourceColumn });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (targetColumn) => {
    if (!draggedTask) return;

    const { task, sourceColumn } = draggedTask;
    if (sourceColumn === targetColumn) {
      setDraggedTask(null);
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/api/tasks/${task._id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: targetColumn })
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      // Update local state
      setTasks(prev => {
        const newTasks = { ...prev };
        newTasks[sourceColumn] = newTasks[sourceColumn].filter(t => t._id !== task._id);
        newTasks[targetColumn] = [...newTasks[targetColumn], { ...task, status: targetColumn }];
        return newTasks;
      });
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task status');
    }

    setDraggedTask(null);
  };

  // Handle moving task via menu (for mobile)
  const handleMoveTask = async (task, newStatus) => {
    const currentStatus = task.status;
    if (currentStatus === newStatus) return;

    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/api/tasks/${task._id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      // Update local state
      setTasks(prev => {
        const newTasks = { ...prev };
        newTasks[currentStatus] = newTasks[currentStatus].filter(t => t._id !== task._id);
        newTasks[newStatus] = [...newTasks[newStatus], { ...task, status: newStatus }];
        return newTasks;
      });
    } catch (err) {
      console.error('Error moving task:', err);
      setError('Failed to move task');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    try {
      const token = getToken();
      const url = isEditMode 
        ? `${BASE_URL}/api/tasks/${editingTaskId}`
        : `${BASE_URL}/api/tasks`;
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: formData.topic,
          description: formData.description,
          priority: formData.priority,
          date: formData.date,
          dueDate: formData.dueDate || undefined
        })
      });

      if (!response.ok) {
        throw new Error(isEditMode ? 'Failed to update task' : 'Failed to create task');
      }

      const taskData = await response.json();

      if (isEditMode) {
        // Update existing task in local state
        setTasks(prev => {
          const newTasks = { ...prev };
          Object.keys(newTasks).forEach(key => {
            newTasks[key] = newTasks[key].map(t => 
              t._id === editingTaskId ? taskData : t
            );
          });
          return newTasks;
        });
      } else {
        // Add new task to local state
        setTasks(prev => ({
          ...prev,
          scheduled: [...prev.scheduled, taskData]
        }));
      }

      setFormData({
        topic: '',
        description: '',
        priority: 'medium',
        date: new Date().toISOString().split('T')[0],
        dueDate: ''
      });
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingTaskId(null);
      setError('');
    } catch (err) {
      console.error('Error saving task:', err);
      setError(isEditMode ? 'Failed to update task' : 'Failed to create task');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditTask = (task) => {
    setIsEditMode(true);
    setEditingTaskId(task._id);
    setFormData({
      topic: task.topic,
      description: task.description,
      priority: task.priority,
      date: task.date.split('T')[0],
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      // Remove from local state
      setTasks(prev => {
        const newTasks = { ...prev };
        Object.keys(newTasks).forEach(key => {
          newTasks[key] = newTasks[key].filter(t => t._id !== taskId);
        });
        return newTasks;
      });
      setError('');
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
    }
  };

  const gridTemplate = collapsed ? 'lg:grid-cols-[5.5rem_1fr]' : 'lg:grid-cols-[16rem_1fr]';

  return (
    <div className="min-h-screen bg-gradient-radial from-white via-blue-50/30 to-blue-100/50 p-4 md:p-6">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/90 backdrop-blur border border-blue-100 shadow-lg hover:shadow-xl hover:bg-blue-50 text-[#111827] transition"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed top-0 left-0 h-full z-40 animate-slide-in">
            <Sidebar 
              collapsed={false} 
              activeView={activeView}
              onViewChange={(view) => {
                setActiveView(view);
                setMobileMenuOpen(false);
              }}
            />
          </div>
        </>
      )}

      <div className={`max-w-7xl mx-auto grid grid-cols-1 ${gridTemplate} gap-6 transition-[grid-template-columns] duration-300`}>        
        {/* Desktop Sidebar with Toggle Button */}
        <div className="relative hidden lg:block">
          <Sidebar 
            collapsed={collapsed} 
            activeView={activeView}
            onViewChange={setActiveView}
          />
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
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Top Bar */}
          <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-3xl border border-blue-100 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Search Bar - Left Side */}
              <div className="relative flex items-center flex-1 max-w-md">
                <Search className="w-5 h-5 text-gray-400 absolute left-3" />
                <input 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all" 
                  placeholder="Search tasks by topic or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                {/* Time Period Filter */}
                <div className="relative">
                  <button 
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-blue-50 transition-colors"
                  >
                    <Filter className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 capitalize">{timePeriod}</span>
                  </button>
                  
                  {showFilterMenu && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => {
                          setTimePeriod('all');
                          setShowFilterMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors flex items-center gap-2 ${
                          timePeriod === 'all' ? 'bg-blue-50 text-[#3B82F6] font-semibold' : 'text-gray-700'
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        All Tasks
                      </button>
                      <button
                        onClick={() => {
                          setTimePeriod('week');
                          setShowFilterMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors flex items-center gap-2 ${
                          timePeriod === 'week' ? 'bg-blue-50 text-[#3B82F6] font-semibold' : 'text-gray-700'
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        This Week
                      </button>
                      <button
                        onClick={() => {
                          setTimePeriod('month');
                          setShowFilterMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors flex items-center gap-2 ${
                          timePeriod === 'month' ? 'bg-blue-50 text-[#3B82F6] font-semibold' : 'text-gray-700'
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        This Month
                      </button>
                    </div>
                  )}
                </div>

                {/* Create Button */}
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white text-sm font-semibold shadow-md hover:from-[#2563EB] hover:to-[#3B82F6] transition-all">
                  <Plus className="w-4 h-4" />
                  Create
                </button>
              </div>
            </div>
          </div>

          {/* Board */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6]"></div>
            </div>
          ) : (
            <>
              {/* Overview - Show all 3 columns */}
              {activeView === 'overview' && (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <BoardColumn
                    title="Scheduled"
                    subtitle={`${tasks.scheduled.length} tasks`}
                    colorClass="from-blue-50 to-white"
                    tasks={tasks.scheduled}
                    columnKey="scheduled"
                    showAddButton={true}
                    onAddClick={() => setIsModalOpen(true)}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onMove={handleMoveTask}
                  />
                  <BoardColumn
                    title="In Progress"
                    subtitle={`${tasks.inProgress.length} tasks`}
                    colorClass="from-yellow-50 to-white"
                    tasks={tasks.inProgress}
                    columnKey="inProgress"
                    showAddButton={false}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onMove={handleMoveTask}
                  />
                  <BoardColumn
                    title="Done"
                    subtitle={`${tasks.done.length} tasks`}
                    colorClass="from-green-50 to-white"
                    tasks={tasks.done}
                    columnKey="done"
                    showAddButton={false}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onMove={handleMoveTask}
                  />
                </div>
              )}

              {/* Tasks - Show only scheduled tasks */}
              {activeView === 'tasks' && (
                <div className="grid md:grid-cols-1 gap-6">
                  <BoardColumn
                    title="Scheduled Tasks"
                    subtitle={`${tasks.scheduled.length} tasks`}
                    colorClass="from-blue-50 to-white"
                    tasks={tasks.scheduled}
                    columnKey="scheduled"
                    showAddButton={true}
                    onAddClick={() => setIsModalOpen(true)}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onMove={handleMoveTask}
                  />
                </div>
              )}

              {/* Activity - Show only done tasks */}
              {activeView === 'activity' && (
                <div className="grid md:grid-cols-1 gap-6">
                  <BoardColumn
                    title="Completed Tasks"
                    subtitle={`${tasks.done.length} tasks`}
                    colorClass="from-green-50 to-white"
                    tasks={tasks.done}
                    columnKey="done"
                    showAddButton={false}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onMove={handleMoveTask}
                  />
                </div>
              )}

              {/* Todo Lists - Show todo view */}
              {activeView === 'todo' && <TodoView />}
            </>
          )}

          {/* Add Task Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                  <h2 className="text-2xl font-bold text-[#111827]">
                    {isEditMode ? 'Edit Task' : 'Add New Task'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsEditMode(false);
                      setEditingTaskId(null);
                      setFormData({
                        topic: '',
                        description: '',
                        priority: 'medium',
                        date: new Date().toISOString().split('T')[0],
                        dueDate: ''
                      });
                    }}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleAddTask} className="p-6 space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#111827]">
                      Topic <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                      placeholder="Enter task topic"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#111827]">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all resize-none"
                      placeholder="Enter task description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#111827]">
                        Priority <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#111827]">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#111827]">
                      Due Date <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setIsEditMode(false);
                        setEditingTaskId(null);
                      }}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white rounded-xl font-semibold shadow-md hover:from-[#2563EB] hover:to-[#3B82F6] transition-all"
                    >
                      {isEditMode ? 'Update Task' : 'Add Task'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
