import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import {
  DatabaseError,
  AuthorNotFoundError,
  InputValidationError,
} from "../errors";
import type { Author } from "../../../shared/types";
import { generateSlug } from "../utils/generateSlug";

export const fetchAllAuthors = async () => {
  try {
    return await db.select().from(users);
  } catch (error) {
    throw new DatabaseError("Failed to fetch authors.");
  }
};

export const fetchAuthorByEmail = async (email: string) => {
  try {
    const [author] = await db
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

export const createAuthorHandler = async (authorData: {
  email: string;
  password_hash: string;
  bio?: string;
  first_name: string;
  last_name: string;
  profile_picture_url?: string;
}) => {
  const {
    email,
    password_hash,
    bio,
    first_name,
    last_name,
    profile_picture_url,
  } = authorData;

  if (!email || !password_hash || !first_name || !last_name)
    throw new InputValidationError(
      "Email, password, first name and last name are required."
    );

  try {
    const [existingAuthor] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingAuthor) throw new InputValidationError("Email already in use.");

    const slug = await generateSlug(
      `${first_name} ${last_name}`,
      users,
      users.slug
    );

    const [newAuthor] = await db
      .insert(users)
      .values({
        email,
        slug,
        password_hash,
        bio,
        profile_picture_url,
        first_name,
        last_name,
      })
      .returning();

    return newAuthor;
  } catch (error) {
    if (
      error instanceof AuthorNotFoundError ||
      error instanceof InputValidationError
    ) {
      throw error;
    }
    throw new DatabaseError("Failed to create author.");
  }
};

export const updateAuthorByEmail = async (
  email: string,
  updateObj: Partial<Author>
) => {
  const filteredUpdates = Object.fromEntries(
    Object.entries(updateObj).filter(([_, value]) => value !== undefined)
  );

  if (Object.keys(filteredUpdates).length === 0)
    throw new InputValidationError("No valid fields provided for update");

  try {
    const author = await fetchAuthorByEmail(email);
    if (!author) throw new AuthorNotFoundError();

    if (filteredUpdates.first_name || filteredUpdates.last_name) {
      filteredUpdates.slug = await generateSlug(
        `${filteredUpdates.first_name} ${filteredUpdates.last_name}`,
        users,
        users.slug
      );
    }

    const updatedUser = await db
      .update(users)
      .set({
        ...filteredUpdates,
        updated_at: new Date(),
      })
      .where(eq(users.email, email))
      .returning();

    return updatedUser;
  } catch (error) {
    if (
      error instanceof AuthorNotFoundError ||
      error instanceof InputValidationError
    )
      throw error;
    throw new DatabaseError("Failed to update author by email.");
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
