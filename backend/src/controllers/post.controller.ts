import { Request, Response } from "express";
import { db } from "../db";
import { posts, users, categories, post_categories } from "../db/schema";
import { eq, and } from "drizzle-orm";

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    // Fetch all posts with their author and categories
    const allPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        slug: posts.slug,
        created_at: posts.created_at,
        updated_at: posts.updated_at,
        author: {
          id: users.id,
          username: users.username,
          first_name: users.first_name,
          last_name: users.last_name,
        },
        category_id: categories.id,
        category_name: categories.name,
        category_slug: categories.slug,
      })
      .from(posts)
      .leftJoin(users, eq(posts.author_id, users.id))
      .leftJoin(post_categories, eq(posts.id, post_categories.post_id))
      .leftJoin(categories, eq(post_categories.category_id, categories.id));

    console.log("allPosts ready");

    // Group posts by their ID and aggregate categories
    const postsMap = allPosts.reduce((acc, post) => {
      if (!acc[post.id]) {
        acc[post.id] = {
          ...post,
          categories: [],
        };
      }

      if (post.category_id) {
        acc[post.id].categories.push({
          id: post.category_id,
          name: post.category_name,
          slug: post.category_slug,
        });
      }

      return acc;
    }, {} as Record<number, any>);

    // Convert the map back to an array
    const postsWithDetails = Object.values(postsMap);

    console.log(postsWithDetails);

    res.status(200).json(postsWithDetails);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch posts." });
  }
};

export const createPost = async (req: Request, res: Response): Promise<any> => {
  const { title, content, author_id, category_ids, excerpt, cover_image_url } =
    req.body;

  // Validate required fields
  if (!title || !content || !author_id) {
    return res
      .status(400)
      .json({ error: "Title, content, and author_id are required." });
  }

  // Generate a slug from the title
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  try {
    // Check if the author exists
    const author = await db
      .select()
      .from(users)
      .where(eq(users.id, author_id))
      .limit(1);

    if (author.length === 0) {
      return res.status(404).json({ error: "Author not found." });
    }

    // Check if a post with the same slug already exists
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    // If the slug exists, append a unique identifier (e.g., timestamp)
    if (existingPost.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    // Insert the new post
    const newPost = await db
      .insert(posts)
      .values({
        title,
        content,
        author_id,
        slug,
        status: "draft", // Default status
        created_at: new Date(),
        updated_at: new Date(),
        cover_image_url,
        excerpt,
      })
      .returning();

    // Assign categories to the post
    if (category_ids && Array.isArray(category_ids)) {
      // Validate category IDs
      const validCategories = await db
        .select()
        .from(categories)
        .where(
          and(
            ...category_ids.map((category_id) => eq(categories.id, category_id))
          )
        );

      if (validCategories.length !== category_ids.length) {
        return res.status(400).json({ error: "Invalid category IDs." });
      }

      // Insert into post_categories table
      await db.insert(post_categories).values(
        category_ids.map((category_id: number) => ({
          post_id: newPost[0].id,
          category_id,
        }))
      );
    }

    // Fetch assigned categories
    const assignedCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      })
      .from(categories)
      .leftJoin(post_categories, eq(categories.id, post_categories.category_id))
      .where(eq(post_categories.post_id, newPost[0].id));

    // Return the new post with author and category details
    res.status(201).json({
      ...newPost[0],
      author: {
        id: author[0].id,
        username: author[0].username,
        first_name: author[0].first_name,
        last_name: author[0].last_name,
      },
      categories: assignedCategories,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create post." });
  }
};
