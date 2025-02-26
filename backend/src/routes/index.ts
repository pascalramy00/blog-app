import express from "express";
import authorRoutes from "./author.routes";
import postRoutes from "./post.routes";

const router = express.Router();

router.use("/authors", authorRoutes);
router.use("/posts", postRoutes);

export default router;
