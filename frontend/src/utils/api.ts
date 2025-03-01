import type { Post, PostWithAuthorAndCategories } from "@shared/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not defined in environment variables."
  );
}

export async function fetchPosts(): Promise<PostWithAuthorAndCategories[]> {
  const response = await fetch(`${API_BASE_URL}/posts`);
  if (!response.ok) {
    throw new Error("Failed to fetch posts.");
  }
  return response.json();
}

export async function fetchPost(slug: string): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/posts/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch post.");
  }

  return response.json();
}
