import crypto from "crypto";
import { exitCode } from "process";

export function generateFreshToken (): string{
    return crypto.randomBytes(64).toString("hex")
}

export function hashToken (token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex")
}

