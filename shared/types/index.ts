import { UserRole, PostStatus } from "../enums";

export interface User {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  first_name?: string | null;
  last_name?: string | null;
  bio?: string | null;
  created_at: Date;
  updated_at: Date;
  profile_picture_url?: string | null;
  role: UserRole;
}

export interface Post {
  id: number;
  title: string;
  status: PostStatus;
  slug: string;
  content: string;
  excerpt?: string | null;
  cover_image_url?: string | null;
  author_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PostCategory {
  post_id: number;
  category_id: number;
}

export interface Author {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
}

export interface PostWithAuthorAndCategories {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
  author: Author;
  categories: Category[];
}
