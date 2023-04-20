import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { BadRequestError } from '../errors';
import User from '../models/user';
import UnAuthenticatedError from '../errors/unauthenticated';

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new UnAuthenticatedError('Please Provide all values');
  }
  const isExisting = await User.findOne({ email });
  if (isExisting) {
    throw new UnAuthenticatedError('Email already in use');
  }
  const user = await User.create({ name, email, password });

  const token = user.createJWT();
  res.status(201).json({
    user: {
      name: user.name,
      email: user.password,
    },
    token,
  });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnAuthenticatedError('Invalid Credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError('Password is incorrect');
  }
  const token = user.createJWT();
  const userWithoutPassword = { ...user, password: undefined };
  res.status(StatusCodes.OK).json({ userWithoutPassword, token });
};

export { register, login };
