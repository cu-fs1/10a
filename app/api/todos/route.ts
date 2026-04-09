import { NextRequest } from "next/server";
import { getAllTodos, createTodo } from "@/lib/services/todo.service";

export async function GET() {
  try {
    const todos = await getAllTodos();
    return Response.json(todos);
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

    const todo = await createTodo(task);
    return Response.json(todo, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create todo" }, { status: 500 });
  }
}
