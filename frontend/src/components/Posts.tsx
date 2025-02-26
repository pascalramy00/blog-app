import React from "react";
import type { Post } from "@/types/types";

const Posts = ({ posts }: { posts: Post[] }) => {
  return (
    <ul>
      {posts.map(({ id, title, content }) => {
        return (
          <li key={id}>
            <h2>{title}</h2>
            <p>{content}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default Posts;
