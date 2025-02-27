import express from "express";
import {
  createCategoryHandler,
  getAllCategoriesHandler,
} from "../controllers/category.controller";

const router = express.Router();

router.get("/", getAllCategoriesHandler);
router.post("/", createCategoryHandler);

export default router;
