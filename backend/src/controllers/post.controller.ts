import { Request, Response } from "express";
import { db } from "../db";
import { posts } from "../db/schema";

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const allPosts = await db.select().from(posts);
    res.json(allPosts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch posts." });
  }
};

export const createPost = async (req: Request, res: Response): Promise<any> => {
  const { title, content, author_id } = req.body;

  if (!title || !content || !author_id) {
    return res
      .status(400)
      .json({ error: "Title, content and author_id are required." });
  }

  try {
    const newPost = await db
      .insert(posts)
      .values({ title, content, author_id })
      .returning();
    res.status(201).json(newPost[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create post." });
  }
};
