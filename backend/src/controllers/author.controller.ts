import { Request, Response } from "express";
import { db } from "../db";
import { users } from "../db/schema";

export const getAllAuthors = async (req: Request, res: Response) => {
  try {
    const allAuthors = await db.select().from(users);
    res.json(allAuthors);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch authors." });
  }
};

export const createAuthor = async (req: Request, res: Response) => {
  const { email, password_hash } = req.body;

  if (!email || !password_hash) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const newAuthor = await db
      .insert(users)
      .values({
        email,
        password_hash,
      })
      .returning();

    res.status(201).json(newAuthor[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create author" });
  }
};
