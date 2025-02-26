import type { Post } from "@/types/types";
import { fetchPosts } from "@/utils/api";

export const revalidate = 10;

export default async function Home() {
  const posts: Post[] = await fetchPosts();

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
