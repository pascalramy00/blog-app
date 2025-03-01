import { Request, Response } from "express";
import {
  createAuthorHandler,
  deleteAuthorByEmail,
  fetchAllAuthors,
  fetchAuthorByEmail,
  updateAuthorByEmail,
} from "../services/author.services";
import { InputValidationError } from "../errors";

export interface UpdateAuthorObject {
  first_name?: string;
  last_name?: string;
  bio?: string;
  profile_picture_url?: string;
}

export const getAllAuthors = async (req: Request, res: Response) => {
  try {
    res.json(await fetchAllAuthors());
  } catch (error) {
    throw error;
  }
};

export const deleteAuthor = async (req: Request, res: Response) => {
  const { username } = req.params;
  try {
    const author = await deleteAuthorByEmail(username);
    res
      .status(200)
      .json({ message: "Author deleted successfully.", author: author });
  } catch (error) {
    throw error;
  }
};

export const getAuthor = async (req: Request, res: Response) => {
  const { username } = await req.params;
  try {
    const [author] = await fetchAuthorByEmail(username);
    res.status(200).json(author);
  } catch (error) {
    throw error;
  }
};

export const createAuthor = async (
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

  try {
    if (
      !email ||
      !password_hash ||
      !bio ||
      !username ||
      !first_name ||
      !last_name
    ) {
      throw new InputValidationError("All fields are required.");
    }
    const newAuthor = await createAuthorHandler(
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
    throw error;
  }
};

export const updateAuthorHandler = async (req: Request, res: Response) => {
  const { email } = req.params;
  const updateObj: UpdateAuthorObject = Object.fromEntries(
    Object.entries(req.body).filter(([_, value]) => value !== undefined)
  );

  try {
    const updatedAuthor = await updateAuthorByEmail(email, updateObj);
    res.status(200).json({ message: "Author updated successfully." });
  } catch (error) {
    throw error;
  }
};
