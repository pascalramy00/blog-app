import { Request, Response } from "express";
import { db } from "../db";
import { users } from "../db/schema";

export const getAllAuthors = async (req: Request, res: Response) => {
  try {
    const allAuthors = await db.select().from(users);
    res.json(allAuthors);
  } catch (e) {
    console.error("Error fetching authors:", e); // Log the error
    res.status(500).json({ error: "Failed to fetch authors." });
  }
};

export const createAuthor = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password_hash,
      bio,
      username,
      first_name,
      last_name,
      profile_picture_url,
    } = req.body;
    const newAuthor = await db
      .insert(users)
      .values({
        email,
        password_hash,
        bio,
        username,
        profile_picture_url,
        first_name,
        last_name,
      })
      .returning();
    res.status(201).json(newAuthor);
  } catch (e) {
    console.error("Error creating author:", e);
    res.status(500).json({ error: "Failed to create author." });
  }
};
