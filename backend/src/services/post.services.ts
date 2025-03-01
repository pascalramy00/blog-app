// services/postService.ts
import { db } from "../db";
import { posts, users, categories, post_categories } from "../db/schema";
import { eq, and } from "drizzle-orm";
import {
  DatabaseError,
  PostNotFoundError,
  InvalidCategoryIdsError,
  AuthorNotFoundError,
  InputValidationError,
} from "../errors";

import type { Post } from "../../../shared/types";

// Fetch all posts with author and category details
export const fetchAllPosts = async () => {
  try {
    const allPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        slug: posts.slug,
        created_at: posts.created_at,
        updated_at: posts.updated_at,
        isDraft: posts.isDraft,
        isArchived: posts.isArchived,
        isDeleted: posts.isDeleted,
        author: {
          id: users.id,
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

    // Group posts by ID and aggregate categories
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

    return Object.values(postsMap);
  } catch (error) {
    throw new DatabaseError("Failed to fetch posts.");
  }
};

// Fetch a single post by slug
export const fetchPostBySlug = async (slug: string) => {
  try {
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
    if (!post) {
      throw new PostNotFoundError();
    }
    return post;
  } catch (error) {
    if (error instanceof PostNotFoundError) throw error;
    throw new DatabaseError("Failed to fetch post by slug.");
  }
};

export const deletePostBySlug = async (slug: string) => {
  try {
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
    if (!post) throw new PostNotFoundError();
    await db.delete(posts).where(eq(posts.slug, slug));
    return post;
  } catch (error) {
    if (error instanceof PostNotFoundError) throw error;
    throw new DatabaseError("Failed to delete post by slug.");
  }
};

export const updatePostBySlug = async (
  slug: string,
  updateObj: Partial<Post>
) => {
  const filteredUpdates = Object.fromEntries(
    Object.entries(updateObj).filter(([_, value]) => value !== undefined)
  );

  if (Object.keys(filteredUpdates).length === 0)
    throw new InputValidationError("No valid fields provided for update.");

  try {
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
    if (!post) throw new PostNotFoundError();

    const updatedPost = await db
      .update(posts)
      .set({
        ...filteredUpdates,
        updated_at: new Date(),
      })
      .where(eq(posts.slug, slug))
      .returning();

    return updatedPost;
  } catch (error) {
    if (
      error instanceof PostNotFoundError ||
      error instanceof InputValidationError
    )
      throw error;
    throw new DatabaseError("Failed to update post by slug.");
  }
};

// Create a new post
export const createNewPost = async (postData: {
  title: string;
  content: string;
  author_id: number;
  excerpt: string;
  category_ids: number[];
  isDraft: boolean;
  cover_image_url: string;
}) => {
  const {
    title,
    author_id,
    content,
    category_ids,
    isDraft,
    excerpt,
    cover_image_url,
  } = postData;

  if (!title || !content || !author_id)
    throw new InputValidationError(
      "Title, content, and author_id are required."
    );

  try {
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check if the author exists
    const [author] = await db
      .select()
      .from(users)
      .where(eq(users.id, author_id));

    if (!author) {
      throw new AuthorNotFoundError();
    }

    // Check if a post with the same slug already exists
    const [existingPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug));

    // If the slug exists, append a unique identifier (e.g., timestamp)
    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }

    // Insert the new post
    const [newPost] = await db
      .insert(posts)
      .values({
        title,
        content,
        author_id,
        slug,
        excerpt,
        isDeleted: false,
        isDraft: isDraft ?? true,
        isArchived: false,
        created_at: new Date(),
        updated_at: new Date(),
        cover_image_url,
      })
      .returning();

    // Assign categories to the post
    if (category_ids && category_ids.length > 0) {
      // Validate category IDs
      const validCategories = await db
        .select()
        .from(categories)
        .where(and(...category_ids.map((id) => eq(categories.id, id))));

      if (validCategories.length !== category_ids.length) {
        throw new InvalidCategoryIdsError();
      }

      // Insert into post_categories table
      await db.insert(post_categories).values(
        category_ids.map((category_id) => ({
          post_id: newPost.id,
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
      .where(eq(post_categories.post_id, newPost.id));

    return {
      ...newPost,
      author: {
        id: author.id,
        first_name: author.first_name,
        last_name: author.last_name,
      },
      categories: assignedCategories,
    };
  } catch (error) {
    if (
      error instanceof AuthorNotFoundError ||
      error instanceof InvalidCategoryIdsError ||
      error instanceof InputValidationError
    )
      throw error;
    throw error;
  }
};
