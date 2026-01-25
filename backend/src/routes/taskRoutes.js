const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getTasks,
  createTask,
  updateTaskStatus,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// All routes require authentication
router.use(protect);

router.route('/tasks')
  .get(getTasks)
  .post(createTask);

router.route('/tasks/:id')
  .put(updateTask)
  .delete(deleteTask);

router.patch('/tasks/:id/status', updateTaskStatus);

module.exports = router;
