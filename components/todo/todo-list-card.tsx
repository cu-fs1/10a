import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TodoItem } from "./todo-item";
import type { Todo } from "./types";

interface TodoListCardProps {
  title: string;
  todos: Todo[];
  description?: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoListCard({
  title,
  todos,
  description,
  onToggle,
  onDelete,
}: TodoListCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm tracking-wide uppercase">
          {title}
        </CardTitle>
        {description ? <CardDescription className="text-xs">{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="p-0">
        <ul>
          {todos.map((todo, index) => (
            <li key={todo.id}>
              {index > 0 && <Separator />}
              <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
