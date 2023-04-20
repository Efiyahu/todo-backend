import express from 'express';
const router = express.Router();

import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController';

router.route('/').get(getTodos).post(createTodo);
router.route('/:id').get(getTodo).patch(updateTodo).delete(deleteTodo);

export default router;
