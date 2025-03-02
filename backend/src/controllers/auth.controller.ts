import { Request, Response, NextFunction } from "express";
import { registerHandler, loginHandler } from "../services/auth.services";
import { verifyToken } from "../auth/jwtUtils";

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
  console.log("Login request received with data:", req.body);
  try {
    const token = await loginHandler(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });
    console.log("Logged in success! Returning response");
    res.json({ message: "Logged in successfully!" });
  } catch (error) {
    console.log("Login error: (controller)", error);
    next(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
  });

  res.json({ message: "Logged out successfully!" });
};

export const verifyAuth = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ authenticated: false });
  try {
    verifyToken(token);
    return res.json({ authenticated: true });
  } catch (error) {
    console.log(error);
    res.status(401).json({ authenticated: false });
  }
};
