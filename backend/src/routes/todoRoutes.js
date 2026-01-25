const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getTodoLists,
  createTodoList,
  addTodoItem,
  toggleTodoItem,
  deleteTodoItem,
  deleteTodoList
} = require('../controllers/todoController');

// All routes require authentication
router.use(protect);

router.route('/todos')
  .get(getTodoLists)
  .post(createTodoList);

router.route('/todos/:id')
  .delete(deleteTodoList);

router.post('/todos/:id/items', addTodoItem);
router.patch('/todos/:id/items/:itemId/toggle', toggleTodoItem);
router.delete('/todos/:id/items/:itemId', deleteTodoItem);

module.exports = router;
