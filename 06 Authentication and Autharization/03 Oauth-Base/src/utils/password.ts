import bcrypt from "bcrypt";

const ROUND: number = 12;

export async function hashPassword(passwrod: string): Promise<string> {
    return bcrypt.hash(passwrod, ROUND)
}

export async function comparePassword(
    password: string, 
    passwordHash: string
): Promise<boolean> {
    return bcrypt.compare(password, passwordHash)    
}

