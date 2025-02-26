import express from "express";
import authorRoutes from "./author.routes";
import postRoutes from "./post.routes";
import categoryRoutes from "./category.routes";

const router = express.Router();

router.use("/authors", authorRoutes);
router.use("/posts", postRoutes);
router.use("/categories", categoryRoutes);

export default router;
