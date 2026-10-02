import jwt from "jsonwebtoken"
import { env } from "../config/env" 

export interface AccessTokenPayload {
    userId: string,
    role: "user" | "admin";
}

export function generateAccessToekn ( 
   payload: AccessTokenPayload
 ){
    return jwt.sign(
        payload,
        env.JWT_REFRESH_SECRET,
        {
            expiresIn: env.ACCESS_TOKEN_EXPIRES_IN  as jwt.SignOptions['expiresIn']
        }
    )
}

export function verifyAccessToekn(token: string): AccessTokenPayload{
    return jwt.verify(
        token,
        env.JWT_ACCESS_SECRET
    ) as AccessTokenPayload
}