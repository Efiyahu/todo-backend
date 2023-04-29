import express from 'express';
const router = express.Router();

import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  updateTodos,
} from '../controllers/todoController';

router.route('/').get(getTodos).post(createTodo).patch(updateTodos);
router.route('/:id').patch(updateTodo).delete(deleteTodo);

export default router;
