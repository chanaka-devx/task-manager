import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { BASE_URL } from '../config/apiConfig';

const TodoView = () => {
  const [todoLists, setTodoLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newListTitle, setNewListTitle] = useState('');
  const [newItemTexts, setNewItemTexts] = useState({});

  const getToken = () => localStorage.getItem('token');

  const fetchTodoLists = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      const response = await fetch(`${BASE_URL}/api/todos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch todo lists');

      const data = await response.json();
      setTodoLists(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodoLists();
  }, []);

  const createTodoList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/api/todos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newListTitle })
      });

      if (!response.ok) throw new Error('Failed to create todo list');

      const newList = await response.json();
      setTodoLists([newList, ...todoLists]);
      setNewListTitle('');
    } catch (err) {
      setError(err.message);
    }
  };

  const addTodoItem = async (listId) => {
    const text = newItemTexts[listId];
    if (!text?.trim()) return;

    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/api/todos/${listId}/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) throw new Error('Failed to add item');

      const updatedList = await response.json();
      setTodoLists(todoLists.map(list => list._id === listId ? updatedList : list));
      setNewItemTexts({ ...newItemTexts, [listId]: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTodoItem = async (listId, itemId) => {
    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/api/todos/${listId}/items/${itemId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to toggle item');

      const updatedList = await response.json();
      setTodoLists(todoLists.map(list => list._id === listId ? updatedList : list));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTodoItem = async (listId, itemId) => {
    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/api/todos/${listId}/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete item');

      const updatedList = await response.json();
      setTodoLists(todoLists.map(list => list._id === listId ? updatedList : list));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTodoList = async (listId) => {
    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/api/todos/${listId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete list');

      setTodoLists(todoLists.filter(list => list._id !== listId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Create New List */}
      <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-3xl border border-blue-100 p-6">
        <h3 className="text-lg font-bold text-[#111827] mb-4">Create New Todo List</h3>
        <form onSubmit={createTodoList} className="flex gap-3">
          <input
            type="text"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder="Enter list title..."
            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white rounded-xl font-semibold shadow-md hover:from-[#2563EB] hover:to-[#3B82F6] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create List
          </button>
        </form>
      </div>

      {/* Todo Lists Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {todoLists.map((list) => (
          <div key={list._id} className="bg-white/90 backdrop-blur-md shadow-lg rounded-3xl border border-blue-100 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#111827]">{list.title}</h3>
              <button
                onClick={() => deleteTodoList(list._id)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                title="Delete list"
              >
                <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
              </button>
            </div>

            {/* Todo Items */}
            <div className="space-y-2 mb-4 flex-1">
              {list.items.map((item) => (
                <div key={item._id} className="flex items-center gap-2 group">
                  <button
                    onClick={() => toggleTodoItem(list._id, item._id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      item.completed
                        ? 'bg-[#3B82F6] border-[#3B82F6]'
                        : 'border-gray-300 hover:border-[#3B82F6]'
                    }`}
                  >
                    {item.completed && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-400' : 'text-[#111827]'}`}>
                    {item.text}
                  </span>
                  <button
                    onClick={() => deleteTodoItem(list._id, item._id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Item */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newItemTexts[list._id] || ''}
                onChange={(e) => setNewItemTexts({ ...newItemTexts, [list._id]: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && addTodoItem(list._id)}
                placeholder="Add new item..."
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
              />
              <button
                onClick={() => addTodoItem(list._id)}
                className="p-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
              {list.items.filter(i => i.completed).length} / {list.items.length} completed
            </div>
          </div>
        ))}
      </div>

      {todoLists.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No todo lists yet. Create your first one above!</p>
        </div>
      )}
    </div>
  );
};

export default TodoView;
