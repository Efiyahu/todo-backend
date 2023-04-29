import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { BadRequestError } from '../errors';
import User from '../models/user';
import UnAuthenticatedError from '../errors/unauthenticated';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

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
      email: user.email,
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

  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      id: user._id,
    },
    token,
  });
};

const uploadAvatar = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  console.log(req.params.id);
  if (!user) {
    throw new UnAuthenticatedError('Invalid Credentials');
  }

  const file = req.file;

  if (!file) {
    throw new BadRequestError('Please attach a file');
  }

  const uploadedFile: UploadApiResponse = await cloudinary.uploader.upload(
    file.path,
    {
      folder: 'share',
      resource_type: 'image',
    }
  );

  const avatar = await User.updateOne(
    { _id: user.id },
    {
      $set: {
        avatar: uploadedFile.url,
      },
    }
  );

  res.status(StatusCodes.OK).json({ avatar });
};

const getUserImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError('Please provide an id');
  }
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new UnAuthenticatedError('Invalid Credentials');
  }
  const avatar = user.avatar;
  res.status(StatusCodes.OK).json({ avatar });
};

export { register, login, uploadAvatar, getUserImage };
