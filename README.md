# Todo List App

A full-stack **Todo List** application built with **Next.js 16 (App Router)**, **React 19**, and **MongoDB**. The app features a clean, accessible UI with real-time optimistic updates, server persistence, and a well-structured service layer.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [Available Scripts](#available-scripts)
7. [API Reference](#api-reference)
8. [Component Architecture](#component-architecture)
9. [Data Flow](#data-flow)
10. [Validation Rules](#validation-rules)
11. [Design System](#design-system)
12. [TypeScript Configuration](#typescript-configuration)

---

## Tech Stack

| Layer             | Technology                                                                                                    | Version |
| ----------------- | ------------------------------------------------------------------------------------------------------------- | ------- |
| Framework         | [Next.js](https://nextjs.org/) (App Router)                                                                   | 16.2.2  |
| UI Library        | [React](https://react.dev/)                                                                                   | 19.2.4  |
| Database          | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)                                   | ^9.4.1  |
| Styling           | [Tailwind CSS](https://tailwindcss.com/) v4                                                                   | ^4      |
| Component Library | [Shadcn UI](https://ui.shadcn.com/) (`base-nova` style) backed by [Base UI](https://base-ui.com/)            | ^4.2.0  |
| Form Handling     | [React Hook Form](https://react-hook-form.com/)                                                               | ^7.72.1 |
| Schema Validation | [Zod](https://zod.dev/) v4 via `@hookform/resolvers` standard-schema adapter                                  | ^4.3.6  |
| Icons             | [Lucide React](https://lucide.dev/)                                                                           | ^1.7.0  |
| Language          | [TypeScript](https://www.typescriptlang.org/) (strict mode)                                                   | ^5      |
| Package Manager   | [pnpm](https://pnpm.io/) (workspace-enabled)                                                                  | latest  |

---

## Features

- **Create tasks** — Add a new task via an inline form with client-side validation feedback.
- **Toggle completion** — Check/uncheck a task to mark it complete or incomplete. The toggle is optimistic: the UI updates immediately and the server is patched in the background.
- **Delete tasks** — Remove tasks individually. The delete button appears on hover for a clean UI.
- **Live stats** — A badge bar shows the count of remaining active tasks and completed tasks.
- **Separated task lists** — Active tasks and completed tasks are each shown in their own card, keeping the view organised.
- **Loading state** — A spinner is displayed while the initial task list is being fetched from the server.
- **Accessible** — All interactive elements carry `aria-label` attributes; the form uses `aria-invalid` and `aria-describedby` to announce validation errors to screen readers.
- **Health endpoint** — `/api/health` lets you check the database connection status without any auth.

---

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── health/
│   │   │   └── route.ts          # GET /api/health — DB connection check
│   │   └── todos/
│   │       ├── route.ts          # GET /api/todos, POST /api/todos
│   │       └── [id]/
│   │           └── route.ts      # PATCH /api/todos/:id, DELETE /api/todos/:id
│   ├── globals.css               # Tailwind base styles + shadcn CSS variables
│   ├── layout.tsx                # Root HTML shell, font configuration, metadata
│   └── page.tsx                  # Root page — renders <TodoApp />
│
├── components/
│   ├── todo/
│   │   ├── schema.ts             # Zod validation schema for the task form
│   │   ├── types.ts              # Shared TypeScript interface: Todo
│   │   ├── todo-form.tsx         # Controlled form: input + submit button
│   │   ├── todo-item.tsx         # Single row: checkbox + label + delete button
│   │   ├── todo-list-card.tsx    # Card wrapper rendering a list of TodoItems
│   │   └── todo-stats.tsx        # Badges: "N remaining" / "N done"
│   ├── ui/
│   │   ├── badge.tsx             # Shadcn Badge (CVA variants)
│   │   ├── button.tsx            # Shadcn Button (CVA variants)
│   │   ├── card.tsx              # Shadcn Card primitives
│   │   ├── checkbox.tsx          # Base UI Checkbox wrapper
│   │   ├── input.tsx             # Styled text input
│   │   ├── label.tsx             # Styled label
│   │   ├── separator.tsx         # Horizontal divider
│   │   └── spinner.tsx           # Animated loading indicator
│   └── todo-app.tsx              # Root client component — holds all state + side effects
│
├── lib/
│   ├── fonts.ts                  # Google Fonts setup (Geist Sans, Geist Mono, Inter)
│   ├── models/
│   │   └── todo.ts               # Mongoose schema + model for Todo documents
│   ├── services/
│   │   └── todo.service.ts       # Business logic: getAllTodos, createTodo, toggleTodo, deleteTodo
│   ├── mongodb.ts                # Singleton Mongoose connection with hot-reload cache
│   └── utils.ts                  # cn() helper — merges Tailwind classes with clsx + tailwind-merge
│
├── components.json               # Shadcn UI configuration
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration (strict, bundler resolution)
├── postcss.config.mjs            # PostCSS + Tailwind CSS v4 plugin
├── pnpm-workspace.yaml           # pnpm workspace root
└── .env.local                    # Local environment variables (not committed)
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 (Latest LTS recommended)
- **pnpm** — install with `npm install -g pnpm`
- A **MongoDB** instance — either a local install or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd 10a

# 2. Install dependencies
pnpm install
```

---

## Environment Variables

Create a `.env.local` file in the project root. This file is already listed in `.gitignore` and will never be committed.

```env
# .env.local
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```

| Variable    | Required | Description                                            |
| ----------- | -------- | ------------------------------------------------------ |
| `MONGO_URI` | ✅ Yes   | Full MongoDB connection string used by `lib/mongodb.ts` |

> **Note:** The app will throw at startup (`Error: MONGO_URI environment variable is not defined`) if this variable is missing, preventing silent failures.

---

## Available Scripts

All scripts are run via pnpm from the project root.

```bash
pnpm dev      # Start the Next.js development server at http://localhost:3000
pnpm build    # Build the production bundle
pnpm start    # Start the production server (requires pnpm build first)
pnpm lint     # Run ESLint across the project
```

---

## API Reference

All routes live under `/api`. Responses are standard JSON. The server always returns a descriptive error object on failure.

---

### `GET /api/health`

Checks whether the application can establish a database connection.

**Success response — 200 OK**
```json
{ "status": "ok", "db": "connected" }
```

**Failure response — 503 Service Unavailable**
```json
{ "status": "error", "db": "disconnected", "detail": "<error message>" }
```

---

### `GET /api/todos`

Returns all todos sorted by creation date, newest first.

**Success response — 200 OK**
```json
[
  {
    "id": "664f1a2b3c4d5e6f7a8b9c0d",
    "task": "Buy groceries",
    "completed": false,
    "createdAt": "2024-05-23T10:00:00.000Z"
  }
]
```

**Error response — 500 Internal Server Error**
```json
{ "error": "Failed to fetch todos" }
```

---

### `POST /api/todos`

Creates a new todo. The task is trimmed and validated server-side: it must be between 1 and 200 characters.

**Request body**
```json
{ "task": "Buy groceries" }
```

**Success response — 201 Created**
```json
{
  "id": "664f1a2b3c4d5e6f7a8b9c0d",
  "task": "Buy groceries",
  "completed": false,
  "createdAt": "2024-05-23T10:00:00.000Z"
}
```

**Error response — 400 Bad Request** (empty task or > 200 chars)
```json
{ "error": "Invalid task" }
```

**Error response — 500 Internal Server Error**
```json
{ "error": "Failed to create todo" }
```

---

### `PATCH /api/todos/:id`

Toggles the `completed` status of a todo. Optionally accepts an explicit `completed` boolean in the body; if omitted, the current value is flipped.

**Request body (optional)**
```json
{ "completed": true }
```

**Success response — 200 OK** — returns the updated todo object.

**Error response — 404 Not Found**
```json
{ "error": "Todo not found" }
```

**Error response — 500 Internal Server Error**
```json
{ "error": "Failed to update todo" }
```

---

### `DELETE /api/todos/:id`

Permanently deletes a todo by its MongoDB ObjectId.

**Success response — 204 No Content** — empty body.

**Error response — 404 Not Found**
```json
{ "error": "Todo not found" }
```

**Error response — 500 Internal Server Error**
```json
{ "error": "Failed to delete todo" }
```

---

## Component Architecture

The UI follows a single-root client component pattern: all server-fetched state and user actions live in `<TodoApp>`, which passes data and callbacks down to pure presentational children.

```
<TodoApp>                  ← "use client" – owns all state + data fetching
├── <TodoForm>             ← Renders the task input and submit button
├── <TodoStats>            ← Displays "N remaining" / "N done" badges
├── <TodoListCard           title="Tasks">       ← Active tasks card
│   └── <TodoItem>         ← Single active task row (checkbox + delete)
└── <TodoListCard           title="Completed">   ← Completed tasks card
    └── <TodoItem>         ← Single completed task row (strike-through)
```

### State

| State variable | Type      | Purpose                                                  |
| -------------- | --------- | -------------------------------------------------------- |
| `todos`        | `Todo[]`  | Master list of all tasks fetched from the server.        |
| `loading`      | `boolean` | `true` while the initial fetch is in progress.           |
| `submitting`   | `boolean` | `true` while a POST request is in flight (disables form).|

### Event Handlers

| Handler      | Trigger                        | Behaviour                                                         |
| ------------ | ------------------------------ | ----------------------------------------------------------------- |
| `onSubmit`   | Form submission                | POSTs new task, prepends returned todo to state, resets form.     |
| `toggleTodo` | Checkbox change on a todo item | PATCHes the todo, replaces the updated item in local state.       |
| `deleteTodo` | Delete button click            | DELETEs the todo, filters it out of local state.                  |

---

## Data Flow

```
Browser                     Next.js Route Handler            MongoDB
  │                                │                            │
  │──── GET /api/todos ───────────▶│                            │
  │                                │──── connectDB() ──────────▶│
  │                                │◀─── connected ─────────────│
  │                                │──── Todo.find().lean() ───▶│
  │                                │◀─── documents ─────────────│
  │◀─── 200 JSON array ────────────│                            │
  │                                │                            │
  │──── POST /api/todos ──────────▶│                            │
  │      { task: "..." }           │──── Todo.create({task}) ──▶│
  │                                │◀─── new document ──────────│
  │◀─── 201 JSON todo ─────────────│                            │
```

The MongoDB connection is created once per Node.js process and cached on the `global` object. This prevents the Mongoose connection from being re-created on every hot-reload in development.

---

## Validation Rules

Validation is enforced at **two layers**:

### Client-side (Zod + React Hook Form)

Defined in `components/todo/schema.ts`:

```ts
const todoSchema = z.object({
  task: z
    .string()
    .min(1, "Task cannot be empty")
    .max(200, "Task must be 200 characters or less"),
});
```

The `standardSchemaResolver` from `@hookform/resolvers` connects Zod v4 schemas directly to React Hook Form v7. Error messages are rendered inline beneath the input with an `aria-describedby` link to maintain accessibility.

### Server-side (API Route)

The `POST /api/todos` handler independently validates the incoming task after trimming whitespace:

```ts
if (!task || task.length > 200) {
  return Response.json({ error: "Invalid task" }, { status: 400 });
}
```

### Database-level (Mongoose Schema)

The `Todo` Mongoose schema enforces the same constraints at the database layer:

```ts
task: { type: String, required: true, maxlength: 200 }
```

---

## Design System

The UI is built on **Shadcn UI** using the `base-nova` style with the `neutral` base colour. Tailwind CSS v4 CSS variables power the design tokens (declared in `app/globals.css`).

### Fonts

Configured in `lib/fonts.ts` using `next/font/google` for zero layout-shift:

| Variable          | Font        | CSS Variable     |
| ----------------- | ----------- | ---------------- |
| `geistSans`       | Geist       | `--font-sans`    |
| `geistMono`       | Geist Mono  | `--font-mono`    |
| `inter`           | Inter       | `--font-inter`   |

The root layout applies `geistMono` as the document-level font class.

### Utility Helper

`lib/utils.ts` exports a `cn()` function that combines `clsx` and `tailwind-merge` to safely merge Tailwind class strings without conflicts.

### UI Components (from Shadcn)

| Component    | Used by                          |
| ------------ | -------------------------------- |
| `Badge`      | `TodoStats`                      |
| `Button`     | `TodoForm`                       |
| `Card`       | `TodoForm`, `TodoListCard`       |
| `Checkbox`   | `TodoItem`                       |
| `Input`      | `TodoForm`                       |
| `Label`      | `TodoForm`                       |
| `Separator`  | `TodoListCard` (between items)   |
| `Spinner`    | `TodoApp` (loading), `TodoForm` (submitting) |

---

## TypeScript Configuration

The project uses TypeScript 5 in **strict mode** with the following notable settings:

| Option               | Value        | Effect                                              |
| -------------------- | ------------ | --------------------------------------------------- |
| `strict`             | `true`       | Enables all strict type-checks                      |
| `moduleResolution`   | `bundler`    | Uses Next.js/webpack bundler-aware resolution       |
| `isolatedModules`    | `true`       | Ensures each file can be transpiled independently   |
| `incremental`        | `true`       | Speeds up subsequent builds using `.tsbuildinfo`    |
| `paths`              | `"@/*": ["./"]` | Enables `@/` absolute imports throughout the project |

The `@/*` path alias maps to the project root, so `import { cn } from "@/lib/utils"` always resolves correctly regardless of the importing file's depth.
