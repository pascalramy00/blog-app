import React from "react";
import type { Post } from "@/types/types";
import Link from "next/link";

const Posts = ({ posts }: { posts: Post[] }) => {
  return (
    <ul>
      {posts.map(({ id, title, content, created_at, slug }) => {
        return (
          <li key={id}>
            <h2 className="font-bold">{title}</h2>
            <p>{created_at}</p>
            <Link href={`/posts/${slug}`}>Read</Link>
            <p>{content}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default Posts;
