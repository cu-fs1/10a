import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TodoModel from "@/lib/models/todo";

export async function GET() {
  try {
    await connectDB();
    const todos = await TodoModel.find().sort({ createdAt: -1 }).lean();
    const serialized = todos.map((t) => ({
      id: t._id.toString(),
      task: t.task,
      completed: t.completed,
      createdAt: t.createdAt,
    }));
    return Response.json(serialized);
  } catch {
    return Response.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const task = String(body.task ?? "").trim();

    if (!task || task.length > 200) {
      return Response.json({ error: "Invalid task" }, { status: 400 });
    }

    await connectDB();
    const todo = await TodoModel.create({ task });
    return Response.json(
      {
        id: todo._id.toString(),
        task: todo.task,
        completed: todo.completed,
        createdAt: todo.createdAt,
      },
      { status: 201 }
    );
  } catch {
    return Response.json({ error: "Failed to create todo" }, { status: 500 });
  }
}
