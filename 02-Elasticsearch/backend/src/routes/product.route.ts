import { Router } from "express";
import {
    createProduct,
    getProducts,
    search,
    reindexProducts
} from "../controllers/product.controller"

const router = Router()

router.get("/", getProducts);
router.get("/search", search);
router.post("/", createProduct)
router.post("/reindex", reindexProducts)

export default router;