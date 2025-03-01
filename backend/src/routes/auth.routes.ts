import express from "express";
import { login, register, logout } from "../controllers/auth.controller";
import { authenticateUser } from "../middlewares/authHandler";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticateUser, logout);

export default router;
