import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db/pool";
import { AppError } from "../utils/error.utils";

interface User {
  id: number;
  name: string;
  email: String;
  password_hash: string;
  role: "user" | "admin";
  created_at: Date;
  updated_at: Date;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      throw new AppError("Name, email and password are required", 400);

    if (password.length < 6)
      throw new AppError("Password must be at least 6 character", 400);

    const normalizeEmail = String(email).trim().toLowerCase();

    const existingUser = await pool.query(
      `SELECT *
            FROM users
            WHERE email = $1
            `,
      [normalizeEmail],
    );

    if (existingUser.rows.length > 0)
      throw new AppError("Email is already registerd!", 409);

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query<User>(
      `INSERT INTO users (name, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            RETURNING 
                id,
                name,
                email,
                role,
                created_at,
                updated_at
            `,
      [name.trim(), normalizeEmail, passwordHash, "user"],
    );

    const user = result.rows[0];

    res.status(201).json({
      success: true,
      message: "User registerd successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error(error);
    throw new AppError("Internal server error", 500);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || email.trim().length === 0)
      throw new AppError("Email is required!", 400);

    if (!password || password.trim().length === 0)
      throw new AppError("Password is required!", 400);

    if (password.length < 6)
      throw new AppError("Password al least greather than 6 charecter!", 400);

    const normalizeEmail = String(email).trim().toLowerCase();

    const result = await pool.query<User>(
      `
            SELECT *
            FROM users
            WHERE email = $1
            `,
      [normalizeEmail],
    );

    const uesr = result.rows[0];

    if (!uesr) throw new AppError("Invalid email or password!", 400);

    const passwordMatch = await bcrypt.compare(password, uesr.password_hash);

    if (!passwordMatch) throw new AppError("Invalid email or Password!", 401);

    req.session.userId = String(uesr.id);
    req.session.userRole = uesr.role;

    res.status(200).json({
      success: true,
      message: "Login successfully",
      data: {
        uesr: {
          name: uesr.name,
          email: uesr.email,
          role: uesr.role,
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new AppError("Internal server error", 500);
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    req.session.destroy((error) => {
      if (error) {
        console.error(error);

        return res.status(500).json({
          message: "Could nor Logout",
        });
      }

      res.clearCookie("connect.sid");
    });

    return res.json({
      message: "Logout successful!",
    });
  } catch (error) {
    console.error(error);
    throw new AppError("Internal server error", 500);
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userID = req.session.userId;

    if (!userID) throw new AppError("User Id is required!", 401);

    const result = await pool.query(
      `SELECT 
                id,
                name,
                email,
                role,
                created_at
            FROM users
            WHERE id = $1
            `,
      [userID],
    );

    const user = result.rows[0];
    console.log("user", user);

    if (!user) throw new AppError("User not found!", 404);

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(error);
    throw new AppError("Internal server error", 500);
  }
};
