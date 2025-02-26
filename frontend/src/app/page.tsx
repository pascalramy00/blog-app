"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  });

  return (
    <div className="">
      <h1>My Blog</h1>
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
    </div>
  );
}
