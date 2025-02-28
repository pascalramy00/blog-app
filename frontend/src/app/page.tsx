import type { PostWithAuthorAndCategories } from "@shared/types";
import { fetchPosts } from "@/utils/api";
import Posts from "@/components/Posts";
import Hero from "@/components/Hero";
// import ClientPosts from "@/components/ClientPosts";

export const revalidate = 84600;

export default async function Home() {
  const posts: PostWithAuthorAndCategories[] = await fetchPosts();

  return (
    <div className="">
      <Hero />
      <Posts posts={posts} />
      {/* For recurrent client side fetching. Best to remove revalidate in this case. */}
      {/* <ClientPosts initialPosts={posts}></ClientPosts> */}
    </div>
  );
}
