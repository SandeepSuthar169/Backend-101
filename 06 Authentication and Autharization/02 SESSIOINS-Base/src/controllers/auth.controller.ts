import type {Request, Response} from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db/pool"
import { AppError } from "../utils/error.utils";

export const register = async(req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body

        if(!name || !email || !password) throw new AppError("Name, email and password are required", 400)
        
        if(password.length < 6) throw new AppError("Password must be at least 6 character", 400)

        const normalizeEmail = String(email).trim().toLowerCase()

        const existingUser = await pool.query(
            `
            SELECT id
            FROM users
            WHERE email = $1
            `, [normalizeEmail]
        )

        
    } catch (error) {
        console.error(error);
        throw new AppError("Internal server error", 500)        
    }
} 