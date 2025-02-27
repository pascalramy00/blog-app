import React from "react";
import type { Post } from "@/lib/types/types";
import Link from "next/link";

const Posts = ({ posts }: { posts: Post[] }) => {
  return (
    <ul>
      {posts.map(({ id, title, content, created_at, slug }) => {
        return (
          <li key={id} className="border border-black mb-4">
            <h2 className="font-bold">{title}</h2>
            <p>{new Date(created_at).toDateString()}</p>
            <Link href={`/posts/${slug}`}>Read</Link>
            <p>{content}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default Posts;
