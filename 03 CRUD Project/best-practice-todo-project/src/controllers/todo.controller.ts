import type { Request, Response } from "express";
import { todos, type Todo } from "../db/todo.db";
import { AppError } from "../middleware/error.middleware";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import type { CreateTodoInput, UpdateTodoInput } from "../types/todo.types";

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json(todos);
});

export const getTodoById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new AppError("Note id not found!", 404);
    }

    const todo = todos.find((todo) => todo.id === id);
    if (!todo) {
      throw new AppError("Todo not found", 404);
    }

    res.status(200).json({
      message: "Get Todo Successfully",
      todo,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

export const createTodo = asyncHandler(async (req: Request, res: Response) => {
  try {
    // get data form body
    const { title, description, completed } = req.body ?? {};
    // validate
    if (!title || !description)
      throw new AppError("Title and description is required", 400);

    // create toto with id + 1
    const newTodo: CreateTodoInput = {
      id: todos.length + 1,
      title,
      completed,
      description,
    };
    // valudate create todo
    if (!newTodo) throw new AppError("New Todo is not found!", 404);
    // push to todos db

    todos.push(newTodo);
    // and return new todo

    res.status(200).json({
      message: "Tod create successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

export const updateTodo = asyncHandler(async (req: Request, res: Response) => {
  try {
    // get todo id from params
    const id = Number(req.params.id);
    // validate id
    if (Number.isNaN(id)) throw new AppError("Todo id is required", 400);

    // find todod by id
    const todo = todos.find((todo) => todo.id === id);

    // validate todo
    if (!todo) throw new AppError("Todo not found!", 404);

    // get todo data from body
    const { title, description } = req.body ?? {};

    // update it
    if (title !== undefined) {
      todo.title = title;
    }

    if (description !== undefined) {
      todo.description = description;
    }
    // and return it
    res.status(200).json({
      message: "Tod update"
    })
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
});
