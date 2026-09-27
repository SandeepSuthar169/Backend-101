    import { Router } from "express";
    import { getMe } from "../controllers/user.controller"
    import { requireAuth, requireRole } from "../middleware/auth.middleware"
    const router = Router()

    router.get("/me", requireAuth, getMe)

    export default router;