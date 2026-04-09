import mongoose, { Schema, model, models } from "mongoose";

export interface ITodo {
  _id: mongoose.Types.ObjectId;
  task: string;
  completed: boolean;
  createdAt: Date;
}

const todoSchema = new Schema<ITodo>(
  {
    task: { type: String, required: true, maxlength: 200 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const TodoModel = models.Todo || model<ITodo>("Todo", todoSchema);

export default TodoModel;
