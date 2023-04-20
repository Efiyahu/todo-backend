import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CustomAPIError from '../errors/custom-api';

interface CustomError extends Error {
  statusCode: number;
}

const errorHandlerMiddleWare = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later',
  };
  if (err.name === 'ValidationError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = err.message;
  }
  const { statusCode, msg } = defaultError;
  res.status(statusCode).json({ msg: msg });
};

export default errorHandlerMiddleWare;
