import { Request, Response, NextFunction } from "express";
import * as errors from "../errors";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Error:", error);

  const errorMap: any = {
    DuplicateCategoryError: 409,
    InputValidationError: 400,
    InvalidCategoryIdsError: 400,
    NotFoundError: 404,
    AuthorNotFoundError: 404,
    PostNotFoundError: 404,
    UnauthorizedError: 401,
    ForbiddenError: 403,
    DatabaseError: 500,
  };

  const statusCode = errorMap[error.constructor.name] || 500;
  const message =
    statusCode === 500 ? "An unexpected error occured." : error.message;

  res.status(statusCode).json({ error: message });
};
