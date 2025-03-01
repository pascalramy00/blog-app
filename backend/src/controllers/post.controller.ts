import { NextFunction, Request, Response } from "express";
import {
  fetchAllPosts,
  fetchPostBySlug,
  createNewPost,
  deletePostBySlug,
  updatePostBySlug,
} from "../services/post.services";

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await fetchAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { slug } = req.params;
  try {
    const post = await fetchPostBySlug(slug);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const newPost = await createNewPost(req.body);
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { slug } = req.params;
  const updateObj = req.body;

  try {
    const [updatedPost] = await updatePostBySlug(slug, updateObj);
    res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { slug } = req.params;
  try {
    deletePostBySlug(slug);
    res.status(200).json();
  } catch (error) {
    next(error);
  }
};
