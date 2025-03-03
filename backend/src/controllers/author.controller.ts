import { NextFunction, Request, Response } from "express";
import {
  createAuthorHandler,
  deleteAuthorByEmail,
  fetchAllAuthors,
  fetchAuthorById,
  fetchAuthorBySlug,
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

export const getAuthorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);
  try {
    const author = await fetchAuthorById(id);
    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
};

export const getAuthorBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { slug } = req.params;
  try {
    const author = await fetchAuthorBySlug(slug);
    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
};

export const getAuthorPrivateData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  try {
    const author = await fetchAuthorById(user.userId);
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
