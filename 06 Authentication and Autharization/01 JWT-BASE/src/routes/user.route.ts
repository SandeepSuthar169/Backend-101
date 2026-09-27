    import { Router } from "express";
    import { getMe, getUsers } from "../controllers/user.controller"
    import { requireAuth, requireRole } from "../middleware/auth.middleware"
    const router = Router()

    router.get("/me", requireAuth, getMe)
    router.get("/users", requireAuth, requireRole("user"), getUsers)

    export default router;