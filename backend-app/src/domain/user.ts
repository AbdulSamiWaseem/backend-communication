import { Role } from "./role";

export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
};

export type AuthUser = Omit<User, "password">;
