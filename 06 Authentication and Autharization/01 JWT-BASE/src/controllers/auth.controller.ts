import express, { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
// @ts-ignore jsonwebtoken does not have declarations installed
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/error.utils";
import { asyncHandler } from "../utils/asynchandler.utils";
import { pool } from "../db/pool";

export const  register =  asyncHandler(async(req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body

        if(!name || !email || !password) throw new AppError("user informain is required!", 400)

        if(password < 6) throw new AppError("Password must be at least 6 characters", 400)

        const normalizeEmail = String(email).trim().toLowerCase()

        const existingUser = pool.query(
            `SELECT id
            FROM users
            WHERE email = $1
            `, [normalizeEmail]
        );

        if((await existingUser).rows.length > 0) throw new AppError("User already register!", 409)
            
        const passwordHash = await bcrypt.hash(
            password, 12
        )

        const result = await pool.query(
            `
            INSERT INTO users
                (name, email, password_hash)
            VALUES
                ($1, $2, $3)
            RETURNING 
                id,
                name,
                email,
                role,
                created_at 
            `, [name.trim(), normalizeEmail, passwordHash]
        )

        res.status(200).json({
            message: "User register successfully!",
            success: true,
            user: result.rows[0]
        })

        
    } catch (error) {
        console.error(error);
        throw new AppError(`Internal server error `, 500)
    }
})