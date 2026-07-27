import { User } from "../domain/user";

const users: User[] = [
  {
    id: "1",
    email: "admin@gmail.com",
    password: "123456",
    name: "Admin",
    role: "admin",
  },
  {
    id: "2",
    email: "sami@gmail.com",
    password: "123456",
    name: "Sami",
    role: "user",
  },
];

export const findUserByEmail = (email: string): User | undefined =>
  users.find((u) => u.email.toLowerCase() === email.toLowerCase());

export const findUserById = (id: string): User | undefined =>
  users.find((u) => u.id === id);
