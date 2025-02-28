import React from "react";
import Posts from "@/components/Posts";
import { fetchPosts } from "@/utils/api";
import { PostWithAuthorAndCategories } from "@shared/types";

const PostsPage = async () => {
  const posts: PostWithAuthorAndCategories[] = await fetchPosts();
  return <Posts posts={posts} />;
};

export default PostsPage;
