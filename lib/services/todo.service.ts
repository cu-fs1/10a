import { connectDB } from "@/lib/mongodb";
import TodoModel from "@/lib/models/todo";

function serialize(t: {
  _id: { toString(): string };
  task: string;
  completed: boolean;
  createdAt: Date;
}) {
  return {
    id: t._id.toString(),
    task: t.task,
    completed: t.completed,
    createdAt: t.createdAt,
  };
}

export async function getAllTodos() {
  await connectDB();
  const todos = await TodoModel.find().sort({ createdAt: -1 }).lean();
  return todos.map(serialize);
}

export async function createTodo(task: string) {
  await connectDB();
  const todo = await TodoModel.create({ task });
  return serialize(todo);
}

export async function toggleTodo(id: string, completed?: boolean) {
  await connectDB();
  const todo = await TodoModel.findById(id);
  if (!todo) return null;
  todo.completed = typeof completed === "boolean" ? completed : !todo.completed;
  await todo.save();
  return serialize(todo);
}

export async function deleteTodo(id: string) {
  await connectDB();
  const deleted = await TodoModel.findByIdAndDelete(id);
  return deleted !== null;
}
