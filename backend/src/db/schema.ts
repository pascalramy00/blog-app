import {
  pgTable,
  varchar,
  serial,
  text,
  timestamp,
  integer,
  primaryKey,
  index,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  first_name: varchar("first_name", { length: 100 }).notNull(),
  last_name: varchar("last_name", { length: 100 }).notNull(),
  bio: text("bio"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  profile_picture_url: varchar("profile_picture_url", { length: 255 }),
  // role: varchar("role", { length: 50 }).default("user").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  isAuthor: boolean("is_author").default(false).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
});

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    content: text("content").notNull(),
    excerpt: text("excerpt").default(""),
    cover_image_url: varchar("cover_image_url", { length: 255 }),
    author_id: integer("author_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    isDeleted: boolean("is_deleted").default(false).notNull(),
    isArchived: boolean("is_archived").default(false).notNull(),
    isDraft: boolean("is_draft").default(true).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("slug_idx").on(table.slug)]
);

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const post_categories = pgTable(
  "post_categories",
  {
    post_id: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    category_id: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.post_id, t.category_id] })]
);
