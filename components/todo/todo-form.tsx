import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import type { TodoFormValues } from "./schema";

interface TodoFormProps {
  register: UseFormRegister<TodoFormValues>;
  handleSubmit: UseFormHandleSubmit<TodoFormValues>;
  errors: FieldErrors<TodoFormValues>;
  onSubmit: (data: TodoFormValues) => void;
}

export function TodoForm({ register, handleSubmit, errors, onSubmit }: TodoFormProps) {
  return (
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
                <p id="task-error" className="text-destructive mt-1 text-xs">
                  {errors.task.message}
                </p>
              )}
            </div>
            <Button type="submit">Add</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
