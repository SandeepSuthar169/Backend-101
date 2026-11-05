import  pool  from "../config/db";
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
        const product = result.rows[0]

        try {
            await indexProduct(product)
        } catch (error) {
            indexed = false
            console.log(error);
        }

        res.status(201).json({
            message: indexed 
            ? "Product created and inexed for search" 
            : "Product saved, but search indexing failed!",

            indexed,

            product
        })
    } catch (error) {
        next(error)
    }
}


export async function reindexProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id");
    const operations = [];

    for (const product of result.rows) {
      operations.push(
        { index: { _index: process.env.ELASTICSEARCH_INDEX || "products", _id: String(product.id) } },
        {
          id: Number(product.id),
          name: product.name,
          description: product.description,
          category: product.category,
          price: Number(product.price),
          stock: Number(product.stock),
          created_at: product.created_at
        }
      );
    }

    if (operations.length) {
      const bulkResult = await (await import("../config/elasticsearch.js")).esClient.bulk({
        refresh: true,
        operations
      });
      if (bulkResult.errors) {
        return res.status(500).json({ message: "Some products could not be indexed.", errors: true });
      }
    }

    res.json({ message: "Reindex completed.", indexedCount: result.rows.length });
  } catch (error) {
    next(error);
  }
}