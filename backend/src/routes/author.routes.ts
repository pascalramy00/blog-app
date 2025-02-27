import express from "express";
import {
  createAuthorHandler,
  getAllAuthorsHandler,
  getAuthorByUsernameHandler,
} from "../controllers/author.controller";

const router = express.Router();

router.get("/", getAllAuthorsHandler);
router.get("/:username", getAuthorByUsernameHandler);
router.post("/", createAuthorHandler);

export default router;
