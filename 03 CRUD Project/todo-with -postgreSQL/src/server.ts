import express, { type Request, type Response } from "express";
import cors from "cors";
import "dotenv/config";

import todoRoutes from "./routes/todo.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Todo api is running",
        success: true
    })
});

app.use("/api/todos", todoRoutes)

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    })
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running on PORT", PORT);
    
})