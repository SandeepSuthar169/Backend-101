import express, { type Request, type Response } from "express"
import { todos, type Todo } from "../db/todo"

export const getTodo = (req: Request, res: Response) => {
    try {

        // 1. Request Headers

        console.log("All Headers:",req.headers);
        console.log("=======================================");
        console.log("User-Agent           :", req.headers["user-agent"]);         
        console.log("Authorization        :", req.headers["authorization"]);     
        console.log("Cookie               :", req.headers["cookie"]);            
        console.log("Host                 :", req.headers["host"]);             
        console.log("accept-encoding      :", req.headers["accept-encoding"]);            
       
        console.log("=======================================");

        // 2. General Headers

        console.log("=== REQUEST general headers ===");

        res.set({
            Date: new Date().toUTCString(),
            "Cache-Control": "no-store",
            Connection: "keep-alive"
        })
        
        console.log("Date              :", req.headers["date"]);                    // usually undefined
        console.log("Cache-Control     :", req.headers["cache-control"]);           // usually undefined
        console.log( "Connection       :",req.headers["connection"]);

        
        console.log("=== RESPONSE general headers ===");
        console.log("Date         :", res.get("Date"));
        console.log("Cache-Control:", res.get("Cache-Control"));
        console.log("Connection   :", res.get("Connection"));    

        
        console.log("======================================");

        // 3. Representation Headers

        console.log("=== Representation headers ===");
        res.on("finish", () => {
            console.log("=== RESPONSE representation headers ===");
            console.log("Content-Type    :", res.get("Content-Type"));
            console.log("Content-Length  :", res.get("Content-Length"));
            console.log("Content-Encoding:", res.get("Content-Encoding"));
            console.log("ETag            :", res.get("ETag"));
        });
        
          // Helmet already set these on `res` before we got here
        console.log("=== RESPONSE security headers ===");
        console.log("Strict-Transport-Security:", res.get("Strict-Transport-Security"));
        console.log("Content-Security-Policy  :", res.get("Content-Security-Policy"));
        console.log("X-Frame-Options          :", res.get("X-Frame-Options"));
        console.log("X-Content-Type-Options   :", res.get("X-Content-Type-Options"));

        res.json({
            data: todos,
            success: true
        })
        
    } catch (error) {
        console.error(error);
    }
}

export const createTodo = (req: Request, res: Response) => {

  //1. Representation headers 
  console.log("=== REQUEST representation headers ===");
  console.log("Content-Type    :", req.headers["content-type"]);
  console.log("Content-Length  :", req.headers["content-length"]);
  console.log("Content-Encoding:", req.headers["content-encoding"]); // usually undefined

  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: "title is required" });
  }

  const todo = { id: Date.now(), title, done: false };
  todos.push(todo);

  res.set("Cache-Control", "no-store");
  res.status(201).json({ success: true, data: todo });
};

export const login = (req: Request, res: Response) => {
  res.cookie("sessionId", "abc123", {
    httpOnly: true,      // JavaScript (document.cookie) cannot read it
    secure: true,        // only sent over HTTPS (localhost is an exception in browsers)
    sameSite: "strict",  // not sent on cross-site requests (CSRF protection)
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  console.log("=== RESPONSE Set-Cookie ===");
  console.log("Set-Cookie:", res.get("Set-Cookie")); // this is an array

  res.json({ success: true, message: "Logged in" });
};