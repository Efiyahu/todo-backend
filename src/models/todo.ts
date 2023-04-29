import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema(
  {
    order: {
      type: Number,
      default: 0,
    },
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
    status: {
      type: String,
      enum: ['todo', 'progress', 'done'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user'],
    },
  },
  { timestamps: true }
);

TodoSchema.pre('save', async function (next) {
  const todo = this;
  const lastTodo = await mongoose
    .model('Todo')
    .findOne({}, {}, { sort: { order: -1 } });
  todo.order = lastTodo ? lastTodo.order + 1 : 0;
  next();
});

export default mongoose.model('Todo', TodoSchema);
