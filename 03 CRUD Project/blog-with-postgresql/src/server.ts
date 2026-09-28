import express, { type Request, type Response } from "express";
import "dotenv/config";
import cors from "cors";
import bookStore from "./routes/bookStore.route"

const app = express();

app.use(cors());
app.use(express.json());


app.get("/health", (_req: Request, res: Response) => {

        res.status(200).json({
        messgae: "Book Store api is running!",
    });
});


app.use("/api/book",bookStore )

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    })
})
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {

    console.log(`server running on port ${PORT}`);
});
