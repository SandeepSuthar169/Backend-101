import express from "express"
import type { Request, Response, NextFunction } from "express"
import cors from "cors";
import productRoute from "./routes/product.route"
import { checkDatabaseConnection, initializeDatabase } from "./config/db";
import { initializeSearchIndex } from "./config/elasticsearch";

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(cors());

app.get("/health", (req: Request, res: Response) => {
    try {
        res.status(200).json({
            message: "Health is good",
            success: true
        })
    } catch (error) {
        console.error(error);
    }
})

app.use("/api/product", productRoute)

async function startServer() {
  try {

    await checkDatabaseConnection();
    // await initializeSearchIndex();
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  
  } catch (error) {
    console.error("Failed to connect to Neon PostgreSQL:", error);
    process.exit(1);
  }
}

startServer();