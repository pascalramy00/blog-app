import express from "express";
import { createAuthor, getAllAuthors } from "../controllers/author.controller";

const router = express.Router();

router.get("/", getAllAuthors);
router.post("/", createAuthor);

export default router;
