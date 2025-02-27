import { Request, Response, NextFunction } from "express";
import * as errors from "../errors";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Error:", error);

  if (
    error instanceof errors.InputValidationError ||
    error instanceof errors.InvalidCategoryIdsError
  ) {
    res.status(400).json({ error: error.message });
    return;
  }

  if (
    error instanceof errors.NotFoundError ||
    error instanceof errors.AuthorNotFoundError ||
    error instanceof errors.PostNotFoundError
  ) {
    res.status(404).json({ error: error.message });
    return;
  }

  if (error instanceof errors.UnauthorizedError) {
    res.status(401).json({ error: error.message });
    return;
  }

  if (error instanceof errors.ForbiddenError) {
    res.status(403).json({ error: error.message });
    return;
  }

  if (error instanceof errors.DatabaseError) {
    res.status(500).json({ error: "A database error occurred." });
    return;
  }

  res.status(500).json({ error: "An unexpected error occurred." });
};
