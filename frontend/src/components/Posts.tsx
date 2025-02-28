import React from "react";
import Link from "next/link";

import { PostWithAuthorAndCategories } from "../../../shared/types";

const Posts = ({ posts }: { posts: PostWithAuthorAndCategories[] }) => {
  return (
    <ul>
      {posts.map(
        ({
          id,
          title,
          content,
          created_at,
          slug,
          excerpt,
          author: { first_name, last_name, username },
        }) => {
          return (
            <li key={id} className="border border-black mb-4">
              <h2 className="font-bold text-3xl">{title}</h2>
              <p>{new Date(created_at).toDateString()}</p>
              <Link href={`/blog/${slug}`}>Read</Link>
              <p>
                by{" "}
                {first_name && last_name
                  ? `${first_name} ${last_name}`
                  : username}
              </p>
              <p>{excerpt ? excerpt : content}</p>
            </li>
          );
        }
      )}
    </ul>
  );
};

export default Posts;
