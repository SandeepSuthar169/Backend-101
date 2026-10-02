import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "../config/env.js";
import { findUserById, upsertGoogleUser } from "../db/users.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.googleClientId,
      clientSecret: env.googleClientSecret,
      callbackURL: env.googleCallbackUrl,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("Google account has no email"));

        const user = await upsertGoogleUser({
          googleId: profile.id,
          email,
          name: profile.displayName ?? null,
          avatarUrl: profile.photos?.[0]?.value ?? null,
        });
        done(null, user);
      } catch (err) {
        done(err as Error);
      }
    },
  ),
);

// Only the user id is stored in the session
passport.serializeUser((user, done) => done(null, (user as { id: string }).id));

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await findUserById(id);
    done(null, user ?? false); // false = treat as logged out
  } catch (err) {
    done(err);
  }
});

export default passport;
