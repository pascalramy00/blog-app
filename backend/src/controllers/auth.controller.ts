import { Request, Response, NextFunction } from "express";
import { registerHandler, loginHandler } from "../services/auth.services";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newAuthor, token } = await registerHandler(req.body);
    res.status(201).json({
      message: "Author created successfully.",
      token,
      author: newAuthor,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await loginHandler(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });
    res.json({ message: "Logged in successfully!" });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  res.json({ message: "Logged out successfully!" });
};
