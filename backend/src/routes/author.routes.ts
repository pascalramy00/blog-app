import express from "express";
import {
  createAuthor,
  deleteAuthor,
  getAllAuthors,
  getAuthorById,
  getAuthorBySlug,
  getAuthorPrivateData,
  updateAuthor,
} from "../controllers/author.controller";
import { authenticateUser } from "../middlewares/authHandler";

const router = express.Router();

router.get("/", getAllAuthors);
router.get("/profile", authenticateUser, getAuthorPrivateData);
router.get("/:id(\\d+)", getAuthorById); // For ids
router.get("/:slug([a-zA-Z0-9-]+)", getAuthorBySlug); // For slugs TODO ensure slugs not numeric
router.post("/", createAuthor);
router.delete("/:email", deleteAuthor);
router.patch("/:email", updateAuthor);

export default router;
