import React from "react";
import { fetchPost } from "@/utils/api";
import type { Post } from "../../../../../shared/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const PostPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const post: Post = await fetchPost(slug);
  if (!post) {
    return <p>Post not found</p>;
  }

  return (
    <div className="min-h-screen">
      <h1>{post.title}</h1>
      <p>{new Date(post.created_at).toDateString()}</p>
      <p>{post.content}</p>
    </div>
  );
};

export default PostPage;
