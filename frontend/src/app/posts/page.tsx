import React from "react";
import Posts from "@/components/Posts";
import { fetchPosts } from "@/utils/api";
import type { Post } from "@/types/types";

const PostsPage = async () => {
  const posts: Post[] = await fetchPosts();
  return <Posts posts={posts} />;
};

export default PostsPage;
