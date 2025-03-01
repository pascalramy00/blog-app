import express from "express";
import {
  createAuthor,
  deleteAuthor,
  getAllAuthors,
  getAuthor,
} from "../controllers/author.controller";

const router = express.Router();

router.get("/", getAllAuthors);
router.get("/:username", getAuthor);
router.post("/", createAuthor);
router.delete("/:username", deleteAuthor);

export default router;
