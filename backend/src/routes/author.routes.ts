import express from "express";
import {
  createAuthor,
  deleteAuthor,
  getAllAuthors,
  getAuthor,
} from "../controllers/author.controller";

const router = express.Router();

router.get("/", getAllAuthors);
router.get("/:email", getAuthor);
router.post("/", createAuthor);
router.delete("/:email", deleteAuthor);

export default router;
