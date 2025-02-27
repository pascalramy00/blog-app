import { Request, Response } from "express";
import {
  fetchAllPosts,
  fetchPostBySlug,
  createNewPost,
} from "../services/post.services";
import {
  PostNotFoundError,
  InvalidCategoryIdsError,
  DatabaseError,
  InputValidationError,
} from "../errors";

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await fetchAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

export const getPost = async (req: Request, res: Response): Promise<any> => {
  const { slug } = await req.params;
  try {
    const post = await fetchPostBySlug(slug);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }
    res.status(200).json(post);
  } catch (error) {
    if (error instanceof PostNotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof DatabaseError) {
      console.error(error);
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occured." });
    }
  }
};

export const createPost = async (req: Request, res: Response): Promise<any> => {
  const { title, content, author_id, category_ids, excerpt, cover_image_url } =
    req.body;

  try {
    if (!title || !content || !author_id) {
      return res
        .status(400)
        .json({ error: "Title, content, and author_id are required." });
    }

    const newPost = await createNewPost(
      title,
      content,
      author_id,
      category_ids,
      excerpt,
      cover_image_url
    );
    res.status(201).json(newPost);
  } catch (error) {
    if (
      error instanceof DatabaseError ||
      error instanceof InvalidCategoryIdsError ||
      error instanceof InputValidationError
    )
      res.status(400).json({ error: error.message });
    else if (error instanceof DatabaseError) {
      console.error(error);
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  }
};
