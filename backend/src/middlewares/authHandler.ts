import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../auth/jwtUtils";
import { InvalidTokenError, MissingTokenError } from "../errors";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  console.log("MIDD checking the token:::::::::", token);
  if (!token)
    throw new MissingTokenError("Token is required for authentication.");

  try {
    const decoded = verifyToken(token);
    console.log("MIDD decoded::::::::::", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    throw new InvalidTokenError("Invalid token.");
  }
};
