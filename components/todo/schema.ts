import { z } from "zod";

export const todoSchema = z.object({
  task: z
    .string()
    .min(1, "Task cannot be empty")
    .max(200, "Task must be 200 characters or less"),
});

export type TodoFormValues = z.infer<typeof todoSchema>;
