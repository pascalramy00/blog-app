import React from "react";
import { fetchPost } from "@/utils/api";
import type { Post } from "@/lib/types/types";

const PostPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const post: Post = await fetchPost(slug);
  if (!post) {
    return <p>Post not found</p>;
  }

  return (
    <div className="min-h-screen">
      <h1>{post.title}</h1>
      <p>{post.created_at}</p>
      <p>{post.content}</p>
    </div>
  );
};

export default PostPage;
