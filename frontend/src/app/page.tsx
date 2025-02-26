import type { Post } from "@/types/types";
import { fetchPosts } from "@/utils/api";
import Posts from "@/components/Posts";
// import ClientPosts from "@/components/ClientPosts";

export const revalidate = 84600;

export default async function Home() {
  const posts: Post[] = await fetchPosts();

  return (
    <div className="">
      <h1 className="font-bold">My Blog</h1>
      <Posts posts={posts} />
      {/* For recurrent client side fetching. Best to remove revalidate in this case. */}
      {/* <ClientPosts initialPosts={posts}></ClientPosts> */}
    </div>
  );
}
