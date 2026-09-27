import express, { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
// @ts-ignore 
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/error.utils";
import { asyncHandler } from "../utils/asynchandler.utils";
import { pool } from "../db/pool";


export const getMe = async (req: Request, res: Response) => {
    try {
        // if !req.user throw error 
        if(!req.user) throw new AppError("Authentication Requiest", 401)
    
        // find user info by user id
        const result = await pool.query(
            `SELECT
                id,
                name,
                email,
                role,
                created_at
            FROM users
            WHERE id = $1
            `, [req.user.id]
        )
        // write user        const user = result.rows[0];
        const user = result.rows[0]
        
        // validate user
        if(!user) throw new AppError("User not found", 404) 
        // and return user with success message

        return res.status(200).json({
            user
        })

    } catch (error) {
        console.error("error", error);
        throw new AppError("Internal server error", 500)
    }
}