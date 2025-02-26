import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL env variable is not set.");
}

// Create a Neon HTTP client
const sql = neon(process.env.DATABASE_URL!);

// Initialize Drizzle ORM
export const db = drizzle(sql);
