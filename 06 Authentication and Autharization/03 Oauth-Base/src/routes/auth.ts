import { Router } from "express";
import passport from "../auth/passport.js";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

// 1. Redirect the user to Google's consent screen
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

// 2. Google redirects back here with ?code=...
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${env.clientUrl}/login?error=oauth_failed`,
    successRedirect: env.clientUrl,
  })
);

// 3. Current user (frontend calls this on load)
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// 4. Logout
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session .destroy((destroyErr) => {
      if (destroyErr) return next(destroyErr);
      res.clearCookie("sid");
      res.status(204).end();
    });
  });
});

export default router;