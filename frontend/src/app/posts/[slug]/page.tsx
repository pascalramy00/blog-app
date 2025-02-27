import React from "react";
import { fetchPost } from "@/utils/api";

const PostPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post[0]) {
    return <p>Post not found</p>;
  }

  const { title, created_at, content } = post[0];

  return (
    <div className="min-h-screen">
      <h1>{title}</h1>
      <p>{created_at}</p>
      <p>{content}</p>
    </div>
  );
};

export default PostPage;
