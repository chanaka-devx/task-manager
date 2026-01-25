import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, Edit2, Trash2, MoreVertical, MoveRight } from 'lucide-react';

const priorityColors = {
  high: 'bg-red-100 text-red-600 border-red-200',
  medium: 'bg-amber-100 text-amber-600 border-amber-200',
  low: 'bg-green-100 text-green-600 border-green-200'
};

const priorityIcons = {
  high: '🔴',
  medium: '🟡',
  low: '🟢'
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const TaskCard = ({ task, onDragStart, onEdit, onDelete, onMove, currentStatus }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showMoveSubmenu, setShowMoveSubmenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
        setShowMoveSubmenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get available statuses for moving (exclude current status)
  const getAvailableStatuses = () => {
    const allStatuses = [
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'inProgress', label: 'In Progress' },
      { value: 'done', label: 'Done' }
    ];
    return allStatuses.filter(s => s.value !== currentStatus);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
    setShowMoveSubmenu(false);
  };

  const handleMoveClick = (e) => {
    e.stopPropagation();
    setShowMoveSubmenu(!showMoveSubmenu);
  };

  const handleMoveToStatus = (e, newStatus) => {
    e.stopPropagation();
    onMove(task, newStatus);
    setShowMenu(false);
    setShowMoveSubmenu(false);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(task);
    setShowMenu(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task._id);
    setShowMenu(false);
  };

  return (
    <div 
      draggable
      onDragStart={onDragStart}
      className="group bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl border border-blue-100 hover:border-blue-300 transition-all duration-300 cursor-grab active:cursor-grabbing flex flex-col space-y-4"
    >
      <div className="flex flex-col space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-[#111827] text-base leading-tight group-hover:text-[#3B82F6] transition-colors flex-1">
            {task.topic}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-lg">{priorityIcons[task.priority]}</span>
            
            {/* Desktop: Edit and Delete buttons (visible on hover) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="hidden md:block opacity-0 group-hover:opacity-100 p-1.5 hover:bg-blue-50 rounded-lg transition-all"
              title="Edit task"
            >
              <Edit2 className="w-4 h-4 text-blue-500" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task._id);
              }}
              className="hidden md:block opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg transition-all"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>

            {/* Mobile: 3-dot menu */}
            <div className="relative md:hidden" ref={menuRef}>
              <button
                onClick={handleMenuClick}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-all"
                title="More options"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                  {!showMoveSubmenu ? (
                    <>
                      {/* Move Option */}
                      <button
                        onClick={handleMoveClick}
                        className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <MoveRight className="w-4 h-4" />
                          Move
                        </span>
                        <span className="text-xs">›</span>
                      </button>

                      {/* Edit Option */}
                      <button
                        onClick={handleEdit}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>

                      {/* Delete Option */}
                      <button
                        onClick={handleDelete}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Back button */}
                      <button
                        onClick={handleMoveClick}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-200"
                      >
                        <span className="text-xs">‹</span>
                        <span>Back</span>
                      </button>
                      
                      {/* Move Submenu */}
                      {getAvailableStatuses().map(status => (
                        <button
                          key={status.value}
                          onClick={(e) => handleMoveToStatus(e, status.value)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          {status.label}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{task.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold border ${priorityColors[task.priority]}`}>
          <AlertCircle className="w-3 h-3" />
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{formatDate(task.date)}</span>
        </div>
        {task.dueDate && (
          <div className="flex items-center gap-2 bg-red-50 px-2 py-1 rounded-lg">
            <Clock className="w-4 h-4 text-red-500" />
            <span className="font-medium text-red-600">Due: {formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
