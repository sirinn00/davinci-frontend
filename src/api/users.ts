import { api } from "./client";
import type { User } from "../types";

// JSONPlaceholder dönüş tipleri
type ApiUser = {
  id: number;
  name: string;
  username: string;
  email: string;
};

const mapUser = (u: ApiUser): User => ({
  id: u.id,
  name: u.name,
  username: u.username,
  email: u.email,
});

export async function getUsers(): Promise<User[]> {
  const { data } = await api.get<ApiUser[]>("/users");
  return data.map(mapUser);
}

export async function createUser(payload: Omit<User, "id">): Promise<User> {
  const { data } = await api.post<ApiUser>("/users", payload);
  const id = typeof data?.id === "number" ? data.id : Math.floor(Math.random() * 100000);
  return mapUser({ id, ...payload });
}

export async function updateUser(
  id: number,
  payload: Partial<Omit<User, "id">>
): Promise<User> {
  const { data } = await api.put<ApiUser>(`/users/${id}`, payload);
  const updated: ApiUser = {
    id,
    name: data?.name ?? (payload.name ?? ""),
    username: data?.username ?? (payload.username ?? ""),
    email: data?.email ?? (payload.email ?? ""),
  };
  return mapUser(updated);
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}
