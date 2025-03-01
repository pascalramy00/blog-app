import { db } from "../db";
import { categories } from "../db/schema";
import { eq, or } from "drizzle-orm";
import { generateSlug } from "../utils/generateSlug";
import {
  DuplicateCategoryError,
  DatabaseError,
  InputValidationError,
} from "../errors";

export const fetchAllCategories = async () => {
  try {
    const allCategories = await db.select().from(categories);
    return allCategories;
  } catch (error) {
    console.error("Error fetching all categories:", error);
    throw new DatabaseError("Error fetching all categories.");
  }
};

export const createNewCategory = async (categoryData: {
  name: string;
  slug: string;
}) => {
  const { name } = categoryData;
  if (!name) throw new InputValidationError("Category name is required.");
  try {
    const slug = await generateSlug(name, categories, categories.slug);

    const existingCategory = await db
      .select()
      .from(categories)
      .where(or(eq(categories.name, name), eq(categories.slug, slug)))
      .limit(1);

    if (existingCategory.length > 0) {
      throw new DuplicateCategoryError();
    }

    const [newCategory] = await db
      .insert(categories)
      .values({ name, slug, created_at: new Date(), updated_at: new Date() })
      .returning();

    return newCategory;
  } catch (error) {
    console.error("Error creating category:", error);
    if (
      error instanceof DuplicateCategoryError ||
      error instanceof InputValidationError
    )
      throw error;
    throw new DatabaseError("Error creating category.");
  }
};
