import express from "express";
import {
  login,
  register,
  logout,
  verifyAuth,
} from "../controllers/auth.controller";
import { authenticateUser } from "../middlewares/authHandler";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticateUser, logout);
router.get("/verify-token", verifyAuth as any);

export default router;
