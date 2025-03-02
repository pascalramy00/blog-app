import { db } from "../db";
import { users } from "../db/schema";
import { hashPassword, comparePassword } from "../auth/hashUtils";
import { generateToken } from "../auth/jwtUtils";
import { eq } from "drizzle-orm";
import {
  InputValidationError,
  DatabaseError,
  InvalidCredentialsError,
} from "../errors";
import { generateSlug } from "../utils/generateSlug";

export const registerHandler = async (data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  bio: string;
  profile_picture_url: string;
}) => {
  const { email, password, first_name, last_name, bio, profile_picture_url } =
    data;

  if (!email || !password || !first_name || !last_name)
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

    const hashedPassword = await hashPassword(password);

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
        password_hash: hashedPassword,
        bio,
        profile_picture_url,
        first_name,
        last_name,
      })
      .returning();

    const token = generateToken(newAuthor.id);

    return { newAuthor, token };
  } catch (error) {
    if (error instanceof InputValidationError) throw error;
    throw new DatabaseError("Failed to create author (auth).");
  }
};

export const loginHandler = async (data: {
  email: string;
  password: string;
}) => {
  const { email, password } = data;
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      throw new InvalidCredentialsError("Invalid credentials.");
    }

    if (!(await comparePassword(password, user.password_hash))) {
      throw new InvalidCredentialsError("Invalid credentials.");
    }
    return generateToken(user.id);
  } catch (error) {
    if (error instanceof InvalidCredentialsError) throw error;
    throw new DatabaseError("An error occurred while logging in.");
  }
};
