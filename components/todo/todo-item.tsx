import { Checkbox } from "@/components/ui/checkbox";
import type { Todo } from "./types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="group flex items-center gap-3 px-6 py-4">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        aria-label={
          todo.completed ? `Mark \"${todo.task}\" as incomplete` : `Mark \"${todo.task}\" as complete`
        }
      />
      <label
        htmlFor={`todo-${todo.id}`}
        className={`flex-1 cursor-pointer select-none text-sm leading-snug ${
          todo.completed ? "text-muted-foreground line-through" : ""
        }`}
      >
        {todo.task}
      </label>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete \"${todo.task}\"`}
        className="text-muted-foreground hover:text-destructive focus:opacity-100 rounded px-1 py-0.5 text-xs opacity-0 transition-all group-hover:opacity-100"
      >
        Delete
      </button>
    </div>
  );
}
