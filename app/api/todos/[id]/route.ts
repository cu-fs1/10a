import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TodoModel from "@/lib/models/todo";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await connectDB();
    const todo = await TodoModel.findById(id);
    if (!todo) {
      return Response.json({ error: "Todo not found" }, { status: 404 });
    }

    todo.completed =
      typeof body.completed === "boolean" ? body.completed : !todo.completed;
    await todo.save();

    return Response.json({
      id: todo._id.toString(),
      task: todo.task,
      completed: todo.completed,
      createdAt: todo.createdAt,
    });
  } catch {
    return Response.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const deleted = await TodoModel.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ error: "Todo not found" }, { status: 404 });
    }
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}
