import { db } from "../db";
import { posts, users, categories, post_categories } from "../db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { generateSlug } from "../utils/generateSlug";
import type { Post } from "../../../shared/types";
import {
  DatabaseError,
  PostNotFoundError,
  InvalidCategoryIdsError,
  AuthorNotFoundError,
  InputValidationError,
} from "../errors";

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
        categories: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.author_id, users.id))
      .leftJoin(post_categories, eq(posts.id, post_categories.post_id))
      .leftJoin(categories, eq(post_categories.category_id, categories.id));

    return allPosts;
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

    // Modify slug if title provided
    if (filteredUpdates.title) {
      filteredUpdates.slug = await generateSlug(
        filteredUpdates.title as string,
        posts,
        posts.slug
      );
    }

    // Update categories if provided
    if (updateObj.category_ids) {
      const categoryIds = updateObj.category_ids.map((id) => Number(id));
      await updateCategories(post.id, categoryIds);
    }

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
    const slug = await generateSlug(title, posts, posts.slug);

    const [author] = await db
      .select()
      .from(users)
      .where(eq(users.id, author_id));

    if (!author) {
      throw new AuthorNotFoundError();
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

// Helper function to update categories
export const updateCategories = async (
  postId: number,
  newCategoryIds: number[]
) => {
  // Get current categories for the post
  const currentCategoryIds = (
    await db
      .select({ category_id: post_categories.category_id })
      .from(post_categories)
      .where(eq(post_categories.post_id, postId))
  ).map((row) => row.category_id);

  // Find categories to add
  const categoriesToAdd = newCategoryIds.filter(
    (id) => !currentCategoryIds.includes(id)
  );

  // Find categories to remove
  const categoriesToRemove = currentCategoryIds.filter(
    (id) => !newCategoryIds.includes(id)
  );

  // Remove categories that are no longer associated with this post
  if (categoriesToRemove.length > 0) {
    await db
      .delete(post_categories)
      .where(
        and(
          eq(post_categories.post_id, postId),
          inArray(post_categories.category_id, categoriesToRemove)
        )
      );
  }

  // Add new categories
  if (categoriesToAdd.length > 0) {
    await db.insert(post_categories).values(
      categoriesToAdd.map((categoryId) => ({
        post_id: postId,
        category_id: categoryId,
      }))
    );
  }
};
