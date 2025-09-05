import { api } from "./client";
import type { Post } from "../types";

type ApiPost = {
  id: number;
  userId: number;
  title: string;
  body?: string;
};

const mapPost = (p: ApiPost): Post => ({
  id: p.id,
  userId: p.userId,
  title: p.title,
  body: p.body,
});

export async function getPosts(): Promise<Post[]> {
  const { data } = await api.get<ApiPost[]>("/posts");
  return data.map(mapPost);
}

export async function createPost(payload: Omit<Post, "id">): Promise<Post> {
  const { data } = await api.post<ApiPost>("/posts", payload);
  const id = typeof data?.id === "number" ? data.id : Math.floor(Math.random() * 100000);
  return mapPost({ id, ...payload });
}

export async function updatePost(
  id: number,
  payload: Partial<Omit<Post, "id">>
): Promise<Post> {
  const { data } = await api.put<ApiPost>(`/posts/${id}`, payload);
  const updated: ApiPost = {
    id,
    userId: data?.userId ?? (payload.userId ?? 1),
    title: data?.title ?? (payload.title ?? ""),
    body: data?.body ?? payload.body,
  };
  return mapPost(updated);
}

export async function deletePost(id: number): Promise<void> {
  await api.delete(`/posts/${id}`);
}
