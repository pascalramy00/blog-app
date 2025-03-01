import { db } from "../db";
import { eq } from "drizzle-orm";

export const generateSlug = async (str: string, table: any, column: any) => {
  let baseSlug = str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  let slug = baseSlug;
  let count = 1;

  while (true) {
    const existing = await db.select().from(table).where(eq(column, slug));
    if (!existing.length) break;
    slug = `${baseSlug}-${count++}`;
  }

  return slug;
};
