import express, { type Request, type Response } from "express";
import { type Blog, blogs } from "../Database/blogDb";

const app = express();

const PORT = 3000;

app.use(express.json());
// Get all blogs
app.get("/blogs", (req: Request, res: Response) => {
  return res.status(200).json(blogs);
});

// Get blogs by id
app.get("/blogs/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  console.log("req", req);
  console.log("res", res);
  console.log("req.params", req.params);
  

  const blog = blogs.find((blog) => blog.id === id);

  if (!blog) {
    return res.status(404).json({
      message: "Blog not found",
    });
  }

  return res.status(200).json({
    blog,
    message: "blog return successfully!",
  });
});

// Create blog
app.post("/blogs", (req: Request, res: Response) => {
  // get blog body from body
  const { title, description, compleated } = req.body;
  // Check if bolg is not avalable
  if (!title || !description || !compleated) {
    return res.status(400).json({
      message: "Blog content is required",
    });
  }

  // create new blog with id +1
  const newBlog: Blog = {
    id: blogs.length + 1,
    title,
    description,
    compleated,
  };

  // Check if new blog is not created
  if (!newBlog) {
    return res.status(400).json({
      message: "New Blog is required",
    });
  }

  // push new blog onto the blog array
  blogs.push(newBlog);
  // returh new blog

  return res.status(200).json({
    blogs: newBlog,
    message: "New Blog created successfully",
  });
});

// Update blog
app.put("/blogs/:id", (req: Request, res: Response) => {
  // get id from params
  const id = Number(req.params.id);
  // check if blog id is invalud
  if (Number.isNaN(id)) {
    return res.status(400).json({
      message: "Blog Id is Invalid!",
    });
  }

  // find blog by id
  const UpdatedBlog = blogs.find((blog) => blog.id === id);

  // Check if blog not found
  if (!UpdatedBlog) {
    return res.status(404).json({
      message: "blog not found!",
    });
  }
  // get blog content by body

  const { title, description, compleated } = req.body;

  // update blog content

  if(title !== undefined){
    UpdatedBlog.title = title
  }
  if(description !== undefined){
    UpdatedBlog.description = description
  }

  // return updated blog!

  return res.status(200).json({
    blogs: UpdatedBlog,
    message: "Blog Updated Successfully"
  })
});


app.delete("/blogs/:id", (req: Request, res: Response) => {
    // Get blog id by params,
    const id = Number(req.params.id)
    
    // find blog index by id

    const blogIndex = blogs.findIndex((blog) => blog.id === id)

    // if blog index === -1 return blog not found
    if(blogIndex === -1){
        return res.status(404).json({
            message:"Invalid blog Index"
        })
    }
    
    // const deleteblog = blogs.splice(blog index, 1)[0]
    blogs.splice(blogIndex, 1)[0]
    
    // return   deleteblog 
    return res.status(200).json({
        message: "Blog deleted successfully",
        // deleteBlog

    })
})

app.listen(PORT, () => {
  console.log("server listen post on", PORT);
});
