import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import {
  DatabaseError,
  AuthorNotFoundError,
  InputValidationError,
} from "../errors";
import { UpdateAuthorObject } from "../controllers/author.controller";

export const updateAuthorByEmail = async (
  email: string,
  updateObj: UpdateAuthorObject
) => {
  const { first_name, last_name, bio, profile_picture_url } = updateObj;
  try {
    const author = fetchAuthorByEmail(email);
    if (!author) throw new AuthorNotFoundError();

    const updatedUser = await db
      .update(users)
      .set({
        ...(first_name !== undefined && { first_name }),
        ...(last_name !== undefined && { last_name }),
        ...(bio !== undefined && { bio }),
        ...(profile_picture_url !== undefined && { profile_picture_url }),
        updated_at: new Date(),
      })
      .where(eq(users.email, email))
      .returning();

    return updatedUser;
  } catch (error) {
    if (error instanceof AuthorNotFoundError) throw error;
    throw new DatabaseError("Failed to update author by email.");
  }
};

export const fetchAllAuthors = async () => {
  try {
    return await db.select().from(users);
  } catch (error) {
    throw new DatabaseError("Failed to fetch authors.");
  }
};

export const deleteAuthorByEmail = async (email: string) => {
  try {
    const [author] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!author) throw new AuthorNotFoundError();

    await db.delete(users).where(eq(users.email, email));
    return author;
  } catch (error) {
    if (error instanceof AuthorNotFoundError) throw error;
    throw new DatabaseError("Failed to delete author by email.");
  }
};

export const fetchAuthorByEmail = async (email: string) => {
  try {
    const author = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!author) throw new AuthorNotFoundError();
    return author;
  } catch (error) {
    if (error instanceof AuthorNotFoundError) throw error;
    throw new DatabaseError("Failed to fetch author by email.");
  }
};

export const createAuthorHandler = async (
  email: string,
  password_hash: string,
  bio: string,
  username: string,
  first_name: string,
  last_name: string,
  profile_picture_url?: string
) => {
  try {
    const existingAuthor = await fetchAuthorByEmail(email);
    if (existingAuthor) throw new InputValidationError("Email already in use.");

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
