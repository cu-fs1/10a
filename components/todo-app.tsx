"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { todoSchema, type TodoFormValues } from "@/components/todo/schema";
import { TodoForm } from "@/components/todo/todo-form";
import { TodoListCard } from "@/components/todo/todo-list-card";
import { TodoStats } from "@/components/todo/todo-stats";
import type { Todo } from "@/components/todo/types";

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetch("/api/todos")
      .then((r) => r.json())
      .then((data: Array<Todo & { createdAt: string }>) =>
        setTodos(data.map((t) => ({ ...t, createdAt: new Date(t.createdAt) }))),
      );
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormValues>({
    resolver: standardSchemaResolver(todoSchema),
    defaultValues: { task: "" },
  });

  async function onSubmit(data: TodoFormValues) {
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: data.task.trim() }),
    });
    if (res.ok) {
      const newTodo: Todo & { createdAt: string } = await res.json();
      setTodos((prev) => [
        { ...newTodo, createdAt: new Date(newTodo.createdAt) },
        ...prev,
      ]);
      reset();
    }
  }

  async function toggleTodo(id: string) {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (res.ok) {
      const updated: Todo & { createdAt: string } = await res.json();
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...updated, createdAt: new Date(updated.createdAt) }
            : t,
        ),
      );
    }
  }

  async function deleteTodo(id: string) {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  }

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <div className="min-h-screen bg-background flex items-start justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Todo List</h1>
          <p className="text-muted-foreground text-sm">
            Keep track of what needs to get done.
          </p>
        </div>

        <TodoForm
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          onSubmit={onSubmit}
        />

        {todos.length > 0 && (
          <TodoStats
            activeCount={activeTodos.length}
            completedCount={completedTodos.length}
          />
        )}

        {activeTodos.length > 0 && (
          <TodoListCard
            title="Tasks"
            todos={activeTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        )}

        {completedTodos.length > 0 && (
          <TodoListCard
            title="Completed"
            description={`${completedTodos.length} ${completedTodos.length === 1 ? "task" : "tasks"} completed`}
            todos={completedTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        )}

        {todos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No tasks yet. Add one above to get started.
          </div>
        )}
      </div>
    </div>
  );
}
