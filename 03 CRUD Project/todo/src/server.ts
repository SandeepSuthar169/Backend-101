import express, { type Request, type Response } from "express";
import { todos, type Todo } from "../Database/db";
import { todo } from "node:test";
const app = express();

const PORT = 3000;

app.use(express.json());

app.get("/todos", (req: Request, res: Response) => {
  res.status(200).json(todos);
});

app.get("/todos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(400).json({
      message: "todo not found",
    });
  }

  res.status(200).json(todo);
});

app.post("/todos", (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  const newTodo: Todo = {
    id: todos.length + 1,
    title: title,
    completed: false,
  };

  todos.push(newTodo);

  res.status(201).json({
    message: "Todo Created successfully",
    todo: newTodo,
  });
});

app.put("/todos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({
      message: "Todo not found",
    });
  }

  const { title, completed } = req.body;

  if (title !== undefined) {
    todo.title = title;
  }

  if (completed !== undefined) {
    todo.completed = completed;
  }

  res.status(200).json({
    message: "Todo updated successfully",
    todo: todo,
  });
});

app.delete("/todos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  console.log("id", id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      message: "Invalid todo ID",
    });
  }

  const todoIndex = todos.findIndex((todo) => todo.id === id);
  console.log("todoIndex", todoIndex);

  if (todoIndex === -1) {
    return res.status(404).json({
      message: "Todo not found",
    });
  }

  const deletedTodo = todos.splice(todoIndex, 1)[0];

  return res.status(200).json({
    message: "Todo deleted successfully",
    todo: deletedTodo,
  });
});

app.listen(PORT, () => {
  console.log("server running at", PORT);
});
