import { Request, Response } from "express";
import {
  fetchAllPosts,
  fetchPostBySlug,
  createNewPost,
  deletePostBySlug,
  updatePostBySlug,
} from "../services/post.services";
import { InputValidationError } from "../errors";

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await fetchAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    deletePostBySlug(slug);
    res.status(200).json();
  } catch (error) {
    throw error;
  }
};

export const getPost = async (req: Request, res: Response): Promise<any> => {
  const { slug } = req.params;
  try {
    const post = await fetchPostBySlug(slug);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }
    res.status(200).json(post);
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (req: Request, res: Response): Promise<any> => {
  const { slug } = req.params;

  const updateObj = Object.fromEntries(
    Object.entries(req.body).filter(([_, value]) => value !== undefined)
  );

  try {
    const [updatedPost] = await updatePostBySlug(slug, updateObj);
    res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    throw error;
  }
};

export const createPost = async (req: Request, res: Response): Promise<any> => {
  const {
    title,
    content,
    author_id,
    category_ids,
    excerpt,
    cover_image_url,
    isDraft,
  } = req.body;

  try {
    if (!title || !content || !author_id) {
      throw new InputValidationError(
        "Title, content and author_id are required."
      );
    }

    const newPost = await createNewPost(
      title,
      content,
      author_id,
      excerpt,
      category_ids,
      isDraft,
      cover_image_url
    );
    res.status(201).json(newPost);
  } catch (error) {
    throw error;
  }
};
