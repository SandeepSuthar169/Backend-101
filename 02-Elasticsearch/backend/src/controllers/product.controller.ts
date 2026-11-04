import { pool } from "../config/db";
import { searchProducts } from "../services/productSearchService"
import { indexProduct } from "../services/productIndexService"
import type { Request, Response, NextFunction } from "express";


export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await pool.query(
            `SELECT  * FROM products 
            ORDER BY  id DESC
            `
        )
        res.json({
            products: result.rows
        })
    } catch (error) {
        next(error)
    }
}


export const search = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const q = (req.query.q || "").toString().trim()

        if(!q) {
            return res.status(400).json({
                message: "Enter a search term in q."
            })
        }

        const products = await searchProducts(q)

        res.json({
            query: q,
            count: products.length,
            products
        })
    } catch (error) {
        next(error)
    }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, category, price, stock } = req.body;

        if(!name ||
            price === undefined ||
            !Number.isFinite(Number(price)) || 
            Number(price) < 0 ||
            !Number.isInteger(Number(stock)) ||
            Number(stock) < 0
        ) {
            res.status(400).json({
                message: "Invalid product details.."
            })
        }
        // Store result in PostgreSQL
        const result = await pool.query(`
            INSERT INTO products (
                name,
                description,
                category,
                price,
                stock
            )
            VALUES ( $1, $2, $3, $4, $5 )
            RETURNING *    
            `,[
                name.trim(),
                description,
                category,
                Number(price),
                Number(stock)
            ] 
        )
        
        // Index product in elasticsearch 

        let indexed = true;

        try {
            await indexProduct(result.rows[0])
        } catch (indexError) {
            indexed = false
            console.log(indexError.message);
            
        }
    } catch (error) {
        next(error)
    }
}