import type { Request, Response } from 'express';
import { AppError } from "../utils/error"
import { asyncHandler } from "../utils/async"

export const register = (
    req: Request,
    res: Response
) => {
    try {
        const {name, email, password} = req.body

        if(!name || !email || !password) throw new AppError("User Info requred!", 400)
            

    } catch (error) {
        throw new AppError("Internal server Error", 500)
    }
}