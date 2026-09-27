import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { getMe } from "../controllers/user.controller"
import { requireAuth, requireRole } from "../middleware/auth.middleware"
const router = Router()

router.post("/register", register)
router.post("/login", login)
router.get("/me", requireAuth, getMe)

export default router;