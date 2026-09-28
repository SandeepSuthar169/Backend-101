import express, { type Response, type Request } from "express";
import { notes, type Note } from "../Database/noteDb";
import { CommentDirectiveType, type tryCast } from "typescript/unstable/ast";

const app = express();

const PORT = 3000;

app.use(express.json());

app.get("/notes", (req: Request, res: Response) => {
  res.status(200).json(notes);
});

app.get("/notes/:id", (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(404).json({
        message: "User Id not Found!",
      });
    }

    const note = notes.find((note) => note.id === id);

    if (!note) {
      res.status(404).json({
        message: "Note not found!",
      });
    }

    res.status(200).json({
      note,
      message: "Get Note successfully",
    });
  } catch (error) {
      return res.status(500).json({
        error: {
          code: "UNEXECTED_ERROR",
          message: "Request validation failed!",
        }
      })
  }
});

app.post("/notes", (req: Request, res: Response) => {
  // get notes body from body
  const { title, description } = req.body;

  // check notes body
  if (!title || !description) {
    res.status(400).json({
      message: "Notes items is required!",
    });
  }

  // create new notes with Id +1
  const newNote: Note = {
    id: notes.length + 1,
    title,
    description,
  };
  // push onto the Notes database

  notes.push(newNote);
  // returh status successful
  console.log("newNote", newNote);

  res.status(200).json({
    notes: newNote,
    message: "New Notes create successfull!",
  });
});

app.put("/notes/:id", (req: Request, res: Response) => {
  // Get id from params

  const id = Number(req.params.id);

  // Find the Notes by Id
  const note = notes.find((note) => note.id === id);

  if (!note) {
    return res.status(404).json({
      message: "Note not found",
    });
  }

  // get Notes data from body
  const { title, description } = req.body;

  // Notes data update it
  if (title !== undefined) {
    note.title = title;
  }
  if (description !== undefined) {
    note.description = description;
  }
  // return note
  return res.status(200).json({
    note: note,
    message: "Note update successfully!",
  });
});

app.delete("/notes/:id", (req: Request, res: Response) => {
  // Get id from Params
  const id = Number(req.params.id);

  // find notes index
  const noteIndex = notes.findIndex((note) => note.id === id);

  // if notes index === -1 return note not found
  if (noteIndex === -1) {
    return res.status(400).json({
      message: "Note not found!",
    });
  }

  // delete note by splice     const deletedTodo = todos.splice(todoIndex, 1)[0];
  const deleteNote = notes.slice(noteIndex, 1)[0];

  // return success status and delete note
  return res.status(200).json({
    note: deleteNote,
    message: "Note delete successfully!",
  });
});

app.listen(PORT, () => {
  console.log("Server listening on POST", PORT);
});
