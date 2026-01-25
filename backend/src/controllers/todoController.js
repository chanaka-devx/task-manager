const TodoList = require('../models/TodoList');
const { asyncHandler } = require('../middleware/errorMiddleware');

// Get all todo lists for a user
const getTodoLists = asyncHandler(async (req, res) => {
  const todoLists = await TodoList.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(todoLists);
});

// Create a new todo list
const createTodoList = asyncHandler(async (req, res) => {
  const { title } = req.body;
  
  if (!title) {
    const err = new Error('Title is required');
    err.statusCode = 400;
    throw err;
  }
  
  const todoList = await TodoList.create({
    userId: req.user.id,
    title,
    items: []
  });
  
  res.status(201).json(todoList);
});

// Add item to todo list
const addTodoItem = asyncHandler(async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    const err = new Error('Item text is required');
    err.statusCode = 400;
    throw err;
  }
  
  const todoList = await TodoList.findOne({ _id: req.params.id, userId: req.user.id });
  
  if (!todoList) {
    const err = new Error('Todo list not found');
    err.statusCode = 404;
    throw err;
  }
  
  todoList.items.push({ text, completed: false });
  await todoList.save();
  
  res.json(todoList);
});

// Toggle todo item completion
const toggleTodoItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  
  const todoList = await TodoList.findOne({ _id: req.params.id, userId: req.user.id });
  
  if (!todoList) {
    const err = new Error('Todo list not found');
    err.statusCode = 404;
    throw err;
  }
  
  const item = todoList.items.id(itemId);
  if (!item) {
    const err = new Error('Todo item not found');
    err.statusCode = 404;
    throw err;
  }
  
  item.completed = !item.completed;
  await todoList.save();
  
  res.json(todoList);
});

// Delete todo item
const deleteTodoItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  
  const todoList = await TodoList.findOne({ _id: req.params.id, userId: req.user.id });
  
  if (!todoList) {
    const err = new Error('Todo list not found');
    err.statusCode = 404;
    throw err;
  }
  
  todoList.items = todoList.items.filter(item => item._id.toString() !== itemId);
  await todoList.save();
  
  res.json(todoList);
});

// Delete todo list
const deleteTodoList = asyncHandler(async (req, res) => {
  const todoList = await TodoList.findOne({ _id: req.params.id, userId: req.user.id });
  
  if (!todoList) {
    const err = new Error('Todo list not found');
    err.statusCode = 404;
    throw err;
  }
  
  await todoList.deleteOne();
  res.json({ message: 'Todo list deleted successfully' });
});

module.exports = {
  getTodoLists,
  createTodoList,
  addTodoItem,
  toggleTodoItem,
  deleteTodoItem,
  deleteTodoList
};
