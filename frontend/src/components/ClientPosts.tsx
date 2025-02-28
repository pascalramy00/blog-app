"use client";

import { useState, useEffect } from "react";
import type { PostWithAuthorAndCategories } from "@shared/types";
import { fetchPosts } from "@/utils/api";

const ClientPosts = ({
  initialPosts,
}: {
  initialPosts: PostWithAuthorAndCategories[];
}) => {
  const [posts, setPosts] =
    useState<PostWithAuthorAndCategories[]>(initialPosts);

  const loadPosts = async () => {
    try {
      const newPosts = await fetchPosts();
      setPosts(newPosts);
    } catch (e) {
      console.error("Failed to fetch posts:", e);
    }
  };

  useEffect(() => {
    const interval = setInterval(loadPosts, 10000);
    return () => clearInterval(interval);
  }, []);

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

export default ClientPosts;
