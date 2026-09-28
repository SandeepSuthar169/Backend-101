import express, { type Request, type Response } from "express";
import pool from "../db/pool";

export const getBooks = async (req: Request, res: Response) => {
  try {
    // get all books
    const result = pool.query(
      `SELECT * FROM booksStore 
            ORDER BY created_at
            DESC`,
    );

    // validate books
    if (!result) {
      res.status(404).json({
        message: "Books not found",
      });
    }

    // return books
    res.status(200).json({
      message: "Fetch books successfully",
      success: true,
      data: (await result).rows,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getBooksId = async (req: Request, res: Response) => {
  try {
    // get Books Id
    const id = Number(req.params.id);

    // validate Books Id
    if (Number.isNaN(id)) {
      res.status(400).json({
        message: "Books id is required!",
      });
    }
    // find book by Id
    const result = pool.query(
      `SELECT * FROM booksStore 
            WHERE id = $1`,
      [id],
    );

    // validate Books
    if (!result || (await result).rows.length === 0) {
      res.status(404).json({
        message: "Book not found!",
      });
    }
    // return Books
    res.status(200).json({
      message: "Fetch Book by Id successfully",
      success: true,
      data: (await result).rows[0],
    });

  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    // get data from body
    const { content, slug, author } = req.body() ?? {};

    // validate data
    if (!content || content.trim() === 0) {
      res.status(404).json({
        message: "content not found!",
      });
      return;
    }
    
    if (!slug || slug.trim() === 0) {
      res.status(404).json({
        message: "slug not found!",
      });
      return;
    }


    if (!author || author.trim() === 0) {
      res.status(404).json({
        message: "author not found!",
      });
    }

    // add data form db
    const result = pool.query(
      `INSERT INTO booksStore (content, slug, author)
        VALUE ($1, $2, $3)
        RETURNING *`,
      [content.trim(), slug.trim(), author.trim()],
    );

    // validate db
    if (!result || (await result).rows.length === 0) {
      res.status(404).json({
        message: "Books is not created",
      });
      return;
    }

    // return data
    res.status(200).json({
      message: "Books create successfully",
      success: true,
      data: (await result).rows[0],
    });

  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateBookById = async (req: Request, res: Response) => {
  try {
    // get book Id by params
    const id = Number(req.params.id);

    // validate book ID
    if (Number.isNaN(id)) {
      res.status(404).json({
        message: "Invalidate Book Id",
      });
    }
    // get data from body
    const { content, slug, author } = req.body ?? {};
    // validate body

    if (!content || content.trim().length === 0) {
      res.status(400).json({
        message: "content is required",
      });
      return;
    }

    if (!slug || slug.trim().length === 0) {
      res.status(400).json({
        message: "slug is required",
      });
      return;
    }
    
    if (!author || author.trim().length === 0) {
      res.status(400).json({
        message: "author is required",
      });
      return;
    }
    // get existing book ( finding book )

    const existingBook = pool.query(
      `SELECT * FROM booksStore
       WHERE id = $1`,
      [id],
    );

    // validate book
    if ((await existingBook).rows.length === 0) {
      res.status(400).json({
        message: "Book not found!",
      });
      return;
    }

    const currentBook = (await existingBook).rows[0];

    const updateContent = content !== undefined ? content.trim() : currentBook.content;
    
    const updateSlug = slug !== undefined ? slug.trim() : currentBook.slug;
    
    const updateAuthor = author !== undefined ? author.trim() : currentBook.author;

    if (!updateContent) {
      res.status(400).json({
        message: "Content cannot by empty",
      });
      return;
    }
    
    if (!updateSlug) {
      res.status(400).json({
        message: "Slug cannot by empty",
      });
      return;
    }

    if (!updateAuthor) {
      res.status(400).json({
        message: "Author cannot by empty",
      });
      return;
    }

    // upate book body
    const result = pool.query(
      `UPDATE booksStore
      SET
        content = $1,
        slug = $2,
        author = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *`,
      [updateContent, updateSlug, updateAuthor, id]
    )

    // validte update book

    if(!result){
      res.status(400).json({
        message: "result is required",
      });
      return;
    }

    // and return book

    res.status(200).json({
      message: "Update Book successfully",
      success: true,
      data: (await result).rows[0],
    })


  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteBookById = async (req: Request, res: Response) => {
  try {
    // get id from params
    const id = Number(req.params.id)


    // validate Id 
    if(Number.isNaN(id)){
       res.status(400).json({
        message: "Invalid Id",
      });
      return;
    }

    // delete book using Id
    const result = pool.query(
    `DELETE FROM booksStore
      WHERE id = $1`, 
      [id]
    )
    // validate 
    
    if(!result || (await result).rows.length === 0){
      res.status(404).json({
        message: "Book not delete",
      });
      return;
    }


    // return success
    res.status(200).json({
      message: "Delete Book successfully",
      success: true,
      data: (await result).rows[0],

    })

    
  } catch (error) {
    console.log("error", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
