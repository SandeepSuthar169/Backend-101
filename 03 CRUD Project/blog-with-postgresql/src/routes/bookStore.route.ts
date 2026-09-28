import express from "express"

import {
    createBook,
    deleteBookById,
    getBooks,
    getBooksId,
    updateBookById
} from "../controllers/bookStore.controller"

const router = express.Router()

router.get("/", getBooks);
router.get("/:id", getBooksId);
router.post("/", createBook);
router.put("/:id", updateBookById);
router.delete("/:id", deleteBookById);

export default router;