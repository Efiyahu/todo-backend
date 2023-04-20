import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      minlength: 2,
      maxlength: 40,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      minlength: 5,
      maxlength: 50,
    },
    finished: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Todo', TodoSchema);
