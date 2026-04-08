"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const todoSchema = z.object({
  task: z
    .string()
    .min(1, "Task cannot be empty")
    .max(200, "Task must be 200 characters or less"),
});

type TodoFormValues = z.infer<typeof todoSchema>;

interface Todo {
  id: string;
  task: string;
  completed: boolean;
  createdAt: Date;
}

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormValues>({
    resolver: standardSchemaResolver(todoSchema),
    defaultValues: { task: "" },
  });

  function onSubmit(data: TodoFormValues) {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      task: data.task.trim(),
      completed: false,
      createdAt: new Date(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    reset();
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
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

        {/* Add todo form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Add a new task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="task" className="sr-only">
                    Task
                  </Label>
                  <Input
                    id="task"
                    placeholder="What needs to be done?"
                    aria-invalid={!!errors.task}
                    aria-describedby={errors.task ? "task-error" : undefined}
                    {...register("task")}
                  />
                  {errors.task && (
                    <p
                      id="task-error"
                      className="text-destructive text-xs mt-1"
                    >
                      {errors.task.message}
                    </p>
                  )}
                </div>
                <Button type="submit">Add</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="flex gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{activeTodos.length} remaining</Badge>
            {completedTodos.length > 0 && (
              <Badge variant="outline">{completedTodos.length} done</Badge>
            )}
          </div>
        )}

        {/* Active todos */}
        {activeTodos.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">
                Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul>
                {activeTodos.map((todo, index) => (
                  <li key={todo.id}>
                    {index > 0 && <Separator />}
                    <TodoItem
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                    />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Completed todos */}
        {completedTodos.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">
                Completed
              </CardTitle>
              <CardDescription className="text-xs">
                {completedTodos.length}{" "}
                {completedTodos.length === 1 ? "task" : "tasks"} completed
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ul>
                {completedTodos.map((todo, index) => (
                  <li key={todo.id}>
                    {index > 0 && <Separator />}
                    <TodoItem
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                    />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {todos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No tasks yet. Add one above to get started.
          </div>
        )}
      </div>
    </div>
  );
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 group">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        aria-label={
          todo.completed ? `Mark "${todo.task}" as incomplete` : `Mark "${todo.task}" as complete`
        }
      />
      <label
        htmlFor={`todo-${todo.id}`}
        className={`flex-1 text-sm cursor-pointer select-none leading-snug ${
          todo.completed ? "line-through text-muted-foreground" : ""
        }`}
      >
        {todo.task}
      </label>
      <button
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.task}"`}
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-muted-foreground hover:text-destructive transition-all text-xs px-1 py-0.5 rounded"
      >
        Delete
      </button>
    </div>
  );
}
