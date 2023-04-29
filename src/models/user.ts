import mongoose, { Document, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
  createJWT: () => string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

interface IUserModel extends Model<IUser> {}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an Email'],
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: 'Please provide a valid email address',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide Password'],
    minlength: 6,
    select: false,
  },
  avatar: {
    type: String,
  },
});

UserSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function (this: IUser) {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET ?? '', {
    expiresIn: process.env.JWT_LIFETIME ?? '1d',
  });
};

UserSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const UserModel: IUserModel = mongoose.model<IUser, IUserModel>(
  'User',
  UserSchema
);

export default UserModel;
