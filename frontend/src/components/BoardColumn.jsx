import React from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const BoardColumn = ({ 
  title, 
  colorClass = 'from-blue-50 to-white', 
  subtitle, 
  tasks = [], 
  columnKey,
  showAddButton = false,
  onAddClick,
  onDragStart,
  onDragOver,
  onDrop,
  onEdit,
  onDelete,
  onMove
}) => {
  return (
    <section 
      className="space-y-4"
      onDragOver={onDragOver}
      onDrop={() => onDrop(columnKey)}
    >
      <div className={`flex items-center justify-between bg-gradient-to-br ${colorClass} rounded-2xl p-4 border border-blue-100`}>
        <div>
          <h4 className="text-sm font-bold text-[#111827]">{title}</h4>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        {showAddButton && (
          <button 
            onClick={onAddClick}
            className="flex items-center space-x-1 text-xs font-semibold text-[#3B82F6] hover:text-[#2563EB] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        )}
      </div>

      <div className="space-y-4 min-h-[200px]">
        {tasks.map((t) => (
          <TaskCard 
            key={t._id || t.id} 
            task={t} 
            onDragStart={() => onDragStart(t, columnKey)}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
            currentStatus={columnKey}
          />
        ))}
      </div>
    </section>
  );
};

export default BoardColumn;
