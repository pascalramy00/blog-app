import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { DatabaseError, AuthorNotFoundError } from "../errors";

export const fetchAllAuthors = async () => {
  try {
    return await db.select().from(users);
  } catch (error) {
    throw new DatabaseError("Failed to fetch authors.");
  }
};

export const fetchAuthorByUsername = async (username: string) => {
  try {
    return [await db.select().from(users).where(eq(users.username, username))];
  } catch (error) {
    throw new AuthorNotFoundError();
  }
};

export const createAuthor = async (
  email: string,
  password_hash: string,
  bio: string,
  username: string,
  first_name: string,
  last_name: string,
  profile_picture_url?: string
) => {
  try {
    const [newAuthor] = await db
      .insert(users)
      .values({
        email,
        password_hash,
        bio,
        username,
        profile_picture_url,
        first_name,
        last_name,
      })
      .returning();

    return newAuthor;
  } catch (error) {
    if (error instanceof AuthorNotFoundError) {
      throw error;
    }
    throw new DatabaseError("Failed to fetch author by username.");
  }
};
