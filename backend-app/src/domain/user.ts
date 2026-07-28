import { Permission } from "./permission";

export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  permissions: Permission[];
};

export type AuthUser = Omit<User, "password">;
