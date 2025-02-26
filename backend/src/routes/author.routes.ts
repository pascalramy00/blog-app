import express from "express";
import { createAuthor, getAllAuthors } from "../controllers/author.controller";

const router = express.Router();

router.post("/", createAuthor as any);
router.get("/", getAllAuthors);

export default router;
