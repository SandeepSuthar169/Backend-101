import pool from "../db/pool";
import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";
import { AppError } from "../utils/error.unils";

export const getTodos = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const result = pool.query(
    `SELECT * FROM todos 
      ORDER BY created_at 
      DESC`
    );

    if (!result) throw new AppError("Todos not found!", 404);

    res.status(200).json({
      message: "Fetch todo successfully!",
      success: true,
      data: (await result).rows,
    });
    
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server Error",
      success: false,
    });
  }
});

export const getTodoById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) throw new AppError("todo Id is required", 404);

    const result = await pool.query(
    `SELECT * FROM todos 
      WHERE id = $1`, 
    [id]);

    if (!result || result.rows.length === 0)
      throw new AppError("Todo result is required!", 404);

    res.status(200).json({
      success: true,
      message: "Fetch todo success",
      data: result.rows[0],
    });

  } catch (error) {
    
    console.error(error);

    res.status(500).json({
      message: "Internal server Error",
      success: false,
    });
  }
});

export const createTodo = asyncHandler(async (req: Request, res: Response) => {
  try {
  
    const { title, description } = req.body ?? {};

    if (!title || !title.trim()) throw new AppError("Title is requred", 400);

    if (!description || description === null) throw new AppError("Description is requred", 400);

    const result = pool.query(
      `INSERT INTO todos (title, description)
      VALUES ($1, $2)
      RETURNING *`,
      [title.trim(), description.trim()],
    );

    if (!result) throw new AppError("Result is required", 404);

    res.status(200).json({
      message: "Todo create successflly!",
      success: true,
      data: (await result).rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server Error",
      success: false,
    });
  }
});

export const updateTodo = asyncHandler(async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) throw new AppError("Invalid Todo", 404);

    const { title, description, completed } = req.body ?? {};

    if (!title || !title.trim()) throw new AppError("Title is requred", 400);

    if (!description || !description.trim()) throw new AppError("Description is requred", 400);

    const existingTodo = await pool.query(`
      SELECT * FROM todos 
      WHERE id = $1`, 
      [id]);

    if (existingTodo.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Todo not found!",
      });
      return;
    }

    const currenTodo = existingTodo.rows[0];

    const updatedTitle = title !== undefined ? title.trim() : currenTodo.title;

    const updatedDescription =
      description !== undefined ? description.trim() : currenTodo.description;

    const updatedCompleted =
      completed !== undefined ? completed : currenTodo.completed;

    if (!updatedTitle) {
      res.status(400).json({
        success: false,
        message: "Title cannot be empty",
      });
      return;
    }

    if (!updatedDescription) {
      res.status(400).json({
        success: false,
        message: "Description cannot be empty",
      });
      return;
    }

    if (!updatedCompleted) {
      res.status(400).json({
        success: false,
        message: "Completed is required",
      });
      return;
    }

    const result = await pool.query(
      `UPDATE todos
      SET
        title = $1,
        description = $2,
        completed = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *`,
      [updatedTitle, updatedDescription, updatedCompleted, id],
    );

    res.status(200).json({
      success: true,
      message: "Todo updated successfully!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
});

export const deleteTodo = asyncHandler(async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) throw new AppError("Invalid Todo", 404);

    const result = await pool.query(
     `DELETE FROM todos 
      WHERE id = $1 
      RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Todo not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
});
