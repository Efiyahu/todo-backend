import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UnAuthenticatedError } from '../errors';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnAuthenticatedError('Invalid Authentication');
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET ?? ''
    ) as JwtPayload;
    req.body.userId = payload.userId;
  } catch (error) {
    throw new UnAuthenticatedError('Invalid Authentication');
  }
  next();
};

export default auth;
