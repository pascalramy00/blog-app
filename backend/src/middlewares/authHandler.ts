import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../auth/jwtUtils";
import { InvalidTokenError, MissingTokenError } from "../errors";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies.token || req.headers["authorization"]?.replace("Bearer ", "");

  if (!token)
    throw new MissingTokenError("Token is required for authentication.");

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    throw new InvalidTokenError("Invalid token.");
  }
};
