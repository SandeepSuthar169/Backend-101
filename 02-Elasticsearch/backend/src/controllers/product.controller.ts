import  pool  from "../config/db.js";
import type { Request, Response, NextFunction } from "express";

import {
  searchProducts
} from "../services/productSearchService.js";

import {
  indexProduct
} from "../services/productIndexService.js";
import { esClient } from "../config/elasticsearch.js";


export async function getProducts(req: Request, res: Response, next: NextFunction) {

  try {

    const result = await pool.query(
      "SELECT * FROM products ORDER BY id DESC"
    );

    res.json({
      products: result.rows
    });

  } catch (error) {
    next(error);
  }

}


export async function search(req: Request, res: Response, next: NextFunction) {

  try {

    const q = (req.query.q || "").toString().trim();

    if (!q) {

      return res.status(400).json({
        message: "Enter a search term in q."
      });

    }

    const products = await searchProducts(q);

    res.json({

      query: q,

      count: products.length,

      products

    });

  } catch (error) {
    next(error);
  }

}


export async function createProduct(req: Request, res: Response, next: NextFunction) {

  try {

    const {
      name,
      description = "",
      category = "",
      price,
      stock = 0
    } = req.body;

    if (
      !name ||
      price === undefined ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0 ||
      !Number.isInteger(Number(stock)) ||
      Number(stock) < 0
    ) {

      return res.status(400).json({
        message: "Invalid product details."
      });

    }

    // 1. Save product in PostgreSQL

    const result = await pool.query(

      `INSERT INTO products
       (name, description, category, price, stock)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,

      [
        name.trim(),
        description,
        category,
        Number(price),
        Number(stock)
      ]

    );

    const product = result.rows[0];

    // 2. Index product in Elasticsearch

    let indexed = true;

    try {

      await indexProduct(product);

    } catch (indexError) {

      indexed = false;

      console.error(
        indexError instanceof Error ? indexError.message : indexError
      );

    }

    res.status(201).json({

      message: indexed
        ? "Product created and indexed for search."
        : "Product saved, but search indexing failed.",

      indexed,

      product

    });

  } catch (error) {
    next(error);
  }

}


export async function reindexProducts(_req: Request, res: Response, next: NextFunction) {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    const products = result.rows;

    if (products.length === 0) {
      return res.json({ message: "No products to index.", total: 0, indexed: 0, failed: [] });
    }

    const operations = products.flatMap((product) => [
      { index: { _index: "products", _id: String(product.id) } },
      product,
    ]);

    const bulkResponse = await esClient.bulk({ refresh: true, operations });

    const failed: number[] = [];
    bulkResponse.items.forEach((item, i) => {
      if (item.index?.error) {
        failed.push(products[i].id);
        console.error(`Failed to index product ${products[i].id}:`, item.index.error.reason);
      }
    });

    res.json({
      message: failed.length ? "Reindex finished with some failures." : "All products reindexed.",
      total: products.length,
      indexed: products.length - failed.length,
      failed,
    });
  } catch (error) {
    next(error);
  }
}