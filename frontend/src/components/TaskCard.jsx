import React from 'react';
import { Users, MessageSquare, Calendar } from 'lucide-react';

const priorityColors = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-amber-100 text-amber-600',
  low: 'bg-green-100 text-green-600'
};

const statusColors = {
  new: 'bg-green-100 text-green-600',
  progress: 'bg-purple-100 text-purple-600',
  personal: 'bg-blue-100 text-blue-600'
};

const TaskCard = ({ task }) => {
  return (
    <div className="group bg-white rounded-3xl p-5 shadow-lg hover:shadow-2xl border border-blue-100 hover:border-blue-300 transition-all duration-300 flex flex-col space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col space-y-1">
          <h3 className="font-semibold text-[#111827] text-sm leading-snug group-hover:text-[#3B82F6] transition-colors">{task.title}</h3>
          <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
        </div>
        <div className="flex -space-x-2 ml-2">
          {task.members.slice(0,3).map((m,i)=>(
            <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
              {m.initials}
            </div>
          ))}
          {task.members.length>3 && (
            <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] text-gray-600 font-semibold">+{task.members.length-3}</div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-[10px] font-medium">
        <span className={`px-2 py-1 rounded ${priorityColors[task.priority]}`}>{task.priority} priority</span>
        <span className={`px-2 py-1 rounded ${statusColors[task.status]}`}>{task.status}</span>
        {task.tags.map((t,i)=>(
          <span key={i} className="px-2 py-1 rounded bg-blue-50 text-blue-600">{t}</span>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <Calendar className="w-3 h-3" />
          <span>{task.due}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-3 h-3" />
          <span>{task.members.length} members</span>
          <MessageSquare className="w-3 h-3" />
          <span>{task.comments} comments</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
