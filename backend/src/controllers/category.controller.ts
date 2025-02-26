import { Request, Response } from "express";
import { db } from "../db";
import { categories } from "../db/schema";
import { eq, or } from "drizzle-orm";

export const createCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log(req.body);
  const { name, slug } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ error: "Name and slug are required" });
  }

  try {
    const existingCategory = await db
      .select()
      .from(categories)
      .where(or(eq(categories.name, name), eq(categories.slug, slug)))
      .limit(1);

    if (existingCategory.length > 0) {
      return res
        .status(409)
        .json({ error: "Catgeory with this name or slug already exists." });
    }

    const newCategory = await db
      .insert(categories)
      .values({ name, slug, created_at: new Date(), updated_at: new Date() })
      .returning();

    res.status(201).json(newCategory[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const allCategories = db.select().from(categories);
    res.json(allCategories);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Failed to fetch categories." });
  }
};
