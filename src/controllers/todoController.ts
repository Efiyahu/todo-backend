import { Request, Response } from 'express';

const getTodos = async (req: Request, res: Response) => {
  console.log(req.body);
  res.send('get all todos');
};

const getTodo = async (req: Request, res: Response) => {
  res.send('get todo');
};

const createTodo = async (req: Request, res: Response) => {
  res.send('create todo');
};

const updateTodo = async (req: Request, res: Response) => {
  res.send('get all todos');
};

const deleteTodo = async (req: Request, res: Response) => {
  res.send('get all todos');
};

export { getTodo, getTodos, createTodo, deleteTodo, updateTodo };
