import { Request, Response } from "express";
import {
  createAuthor,
  fetchAllAuthors,
  fetchAuthorByUsername,
} from "../services/author.services";
import { DatabaseError, AuthorNotFoundError } from "../errors";

export const getAllAuthorsHandler = async (req: Request, res: Response) => {
  try {
    res.json(await fetchAllAuthors());
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

export const getAuthorByUsernameHandler = async (
  req: Request,
  res: Response
) => {
  const { username } = await req.params;
  try {
    const [author] = await fetchAuthorByUsername(username);
    res.status(200).json(author);
  } catch (error) {
    if (error instanceof AuthorNotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof DatabaseError) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

export const createAuthorHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  const {
    email,
    password_hash,
    bio,
    username,
    first_name,
    last_name,
    profile_picture_url,
  } = req.body;

  if (
    !email ||
    !password_hash ||
    !bio ||
    !username ||
    !first_name ||
    !last_name
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newAuthor = await createAuthor(
      email,
      password_hash,
      bio,
      username,
      first_name,
      last_name,
      profile_picture_url
    );
    res.status(201).json(newAuthor);
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};
