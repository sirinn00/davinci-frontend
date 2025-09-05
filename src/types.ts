export type ID = number;

export interface User {
  id: ID;
  name: string;
  username: string;
  email: string;
}

export interface Post {
  id: ID;
  userId: ID;
  title: string;
  body?: string;
}
