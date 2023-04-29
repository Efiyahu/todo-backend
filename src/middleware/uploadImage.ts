import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';
import { BadRequestError } from '../errors';

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

const checkFileType = (file: Request['file'], cb: FileFilterCallback): void => {
  // Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif|svg/;

  // Check extension names
  if (!file) {
    return cb(new BadRequestError('No file received'));
  }

  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (!extName || !mimeType) {
    return cb(new BadRequestError('Error: You can only upload images'));
  }

  cb(null, true);
};
export default upload;
