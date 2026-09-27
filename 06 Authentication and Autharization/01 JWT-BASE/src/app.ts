import express, {type Request, type Response} from "express";
import authRoutes from "./routes/auth.route"
import userRoutes from "./routes/user.route"
import { env } from "./config/env";
const app = express();

app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "ok"
    })
})

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)


console.log("PostgreSQL connected successfully");

app.listen(env.port, () => {
    console.log(`Server running on Port: ${env.port}`);
});

