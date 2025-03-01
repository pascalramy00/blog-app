import { NextFunction, Request, Response } from "express";
import {
  createAuthorHandler,
  deleteAuthorByEmail,
  fetchAllAuthors,
  fetchAuthorByEmail,
  updateAuthorByEmail,
} from "../services/author.services";

export const getAllAuthors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await fetchAllAuthors());
  } catch (error) {
    next(error);
  }
};

export const deleteAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.params;
  try {
    const author = await deleteAuthorByEmail(email);
    res
      .status(200)
      .json({ message: "Author deleted successfully.", author: author });
  } catch (error) {
    next(error);
  }
};

export const getAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = await req.params;
  try {
    const author = await fetchAuthorByEmail(email);
    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
};

export const createAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const newAuthor = await createAuthorHandler(req.body);
    res.status(201).json(newAuthor);
  } catch (error) {
    next(error);
  }
};

export const updateAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.params;

  try {
    const updatedAuthor = await updateAuthorByEmail(email, req.body);
    res
      .status(200)
      .json({ message: "Author updated successfully.", author: updatedAuthor });
  } catch (error) {
    next(error);
  }
};
