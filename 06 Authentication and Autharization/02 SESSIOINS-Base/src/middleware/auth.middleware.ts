import type {  Request, Response, NextFunction } from "express"
import { AppError } from "../utils/error.utils"

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if(!req.session.userId){
        throw new AppError("Authentication required", 401)
    }
    next()
}

export const requireRole = (role: "user" | "admin") => {
    return ( 
        req: Request, 
        res: Response,
        next: NextFunction
    ) => {
        if(!req.session.userId) throw new AppError("Authentication Required", 401)

        if(req.session.role !== role) throw new AppError("Forbidden", 403)

        next()
    }
}