import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { BadRequestError } from '../errors';
import Todo from '../models/todo';

const getTodos = async (req: Request, res: Response) => {
  const { status } = req.query;
  const todos = await Todo.find({
    createdBy: req.body.userId,
    status: status,
  }).sort('order');
  const sentTodos = todos.map((todo) => ({
    id: todo._id,
    title: todo.title,
    description: todo.description,
    status: todo.status,
    date: todo.createdAt,
    priority: todo.priority,
    order: todo.order,
  }));
  res.status(StatusCodes.OK).json({ todos: sentTodos });
};

const createTodo = async (req: Request, res: Response) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new BadRequestError('Please Provide All Values');
  }

  req.body.createdBy = req.body.userId;
  const todo = await Todo.create(req.body);
  res.status(StatusCodes.CREATED).json({ todo });
};

const updateTodos = async (req: Request, res: Response) => {
  const { todos } = req.body;
  const updatedTodos = todos.map((todo: any, index: number) => ({
    ...todo,
    order: index,
  }));
  for (let i = 0; i < updatedTodos.length; i++) {
    const { id, ...updatedFields } = updatedTodos[i];
    await Todo.findByIdAndUpdate(id, updatedFields);
  }
  res.status(StatusCodes.OK).send('Todos updated successfully');
};

const updateTodo = async (req: Request, res: Response) => {
  res.send('get all todos');
};

const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params;

  const todoToDelete = await Todo.findOneAndDelete({ _id: id });
  res.status(StatusCodes.OK).json({ todo: todoToDelete });
};

export { getTodos, createTodo, deleteTodo, updateTodo, updateTodos };
