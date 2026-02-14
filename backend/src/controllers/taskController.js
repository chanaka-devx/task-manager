const Task = require('../models/Task');
const { asyncHandler } = require('../middleware/errorMiddleware');

// Get all tasks for a user with optional filters
const getTasks = asyncHandler(async (req, res) => {
  const { search, timePeriod } = req.query;
  
  let query = { userId: req.user.id };
  
  // Apply search filter
  if (search) {
    query.$or = [
      { topic: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Apply time period filter
  if (timePeriod && timePeriod !== 'all') {
    const now = new Date();
    // Get start of today in local timezone
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    let startDate;
    
    if (timePeriod === 'week') {
      // Get the day of week (0 = Sunday, 1 = Monday, etc.)
      const dayOfWeek = now.getDay();
      // Calculate days to subtract to get to Sunday (0)
      const daysToSubtract = dayOfWeek;
      startDate = new Date(todayStart);
      startDate.setDate(startDate.getDate() - daysToSubtract);
    } else if (timePeriod === 'month') {
      // First day of current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    }
    
    if (startDate) {
      // Filter for dates >= start of period (inclusive) and < start of next period
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(0, 0, 0, 0);
      
      query.date = { 
        $gte: startDate,
        $lt: endDate
      };
    }
  }
  
  const tasks = await Task.find(query).sort({ date: -1 });
  
  // Group tasks by status
  const groupedTasks = {
    scheduled: tasks.filter(t => t.status === 'scheduled'),
    inProgress: tasks.filter(t => t.status === 'inProgress'),
    done: tasks.filter(t => t.status === 'done')
  };
  
  res.json(groupedTasks);
});

// Create a new task
const createTask = asyncHandler(async (req, res) => {
  const { topic, description, priority, date, dueDate } = req.body;
  
  if (!topic || !description || !date) {
    const err = new Error('Topic, description, and date are required');
    err.statusCode = 400;
    throw err;
  }
  
  const task = await Task.create({
    userId: req.user.id,
    topic,
    description,
    priority: priority || 'medium',
    status: 'scheduled',
    date: new Date(date),
    dueDate: dueDate ? new Date(dueDate) : undefined
  });
  
  res.status(201).json(task);
});

// Update task status (for drag and drop)
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  if (!status || !['scheduled', 'inProgress', 'done'].includes(status)) {
    const err = new Error('Valid status is required');
    err.statusCode = 400;
    throw err;
  }
  
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  
  if (!task) {
    const err = new Error('Task not found');
    err.statusCode = 404;
    throw err;
  }
  
  task.status = status;
  await task.save();
  
  res.json(task);
});

// Update entire task
const updateTask = asyncHandler(async (req, res) => {
  const { topic, description, priority, date, dueDate, status } = req.body;
  
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  
  if (!task) {
    const err = new Error('Task not found');
    err.statusCode = 404;
    throw err;
  }
  
  if (topic) task.topic = topic;
  if (description) task.description = description;
  if (priority) task.priority = priority;
  if (date) task.date = new Date(date);
  if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : undefined;
  if (status) task.status = status;
  
  await task.save();
  res.json(task);
});

// Delete a task
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  
  if (!task) {
    const err = new Error('Task not found');
    err.statusCode = 404;
    throw err;
  }
  
  await task.deleteOne();
  res.json({ message: 'Task deleted successfully' });
});

module.exports = {
  getTasks,
  createTask,
  updateTaskStatus,
  updateTask,
  deleteTask
};
