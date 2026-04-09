import { NextRequest } from "next/server";
import { toggleTodo, deleteTodo } from "@/lib/services/todo.service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const todo = await toggleTodo(id, body.completed);
    if (!todo) {
      return Response.json({ error: "Todo not found" }, { status: 404 });
    }
    return Response.json(todo);
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
    const deleted = await deleteTodo(id);
    if (!deleted) {
      return Response.json({ error: "Todo not found" }, { status: 404 });
    }
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}
