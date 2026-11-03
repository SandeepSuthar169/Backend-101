import express, { type Request, type Response } from "express"
import { createTodo, getTodo } from "./controller/todo.controller"
import compression from "compression";
import helmet from "helmet";

const PORT = 5001

const app = express()
app.use(compression({ threshold: 0 })); // threshold 0 = compress even tiny responses (for demo)

app.use(express.json())


app.use(
  helmet({
    strictTransportSecurity: { maxAge: 31536000, includeSubDomains: true },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
      },
    },
    frameguard: { action: "deny" }, // X-Frame-Options: DENY
    noSniff: true,                  // X-Content-Type-Options: nosniff
  })
);


app.get("/api/todos", getTodo)
app.post("/api/todos", createTodo);



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`,);
})

