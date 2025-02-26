import express from "express";
import { createPost, getAllPosts } from "../controllers/post.controller";

const router = express.Router();

router.post("/", createPost as any);
router.get("/", getAllPosts as any);

export default router;
