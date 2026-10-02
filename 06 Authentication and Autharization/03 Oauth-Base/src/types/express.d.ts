import type { AppUser } from "../db/users";

declare global {
  namespace Express {
    interface User extends AppUser {}
  }
}

export {};