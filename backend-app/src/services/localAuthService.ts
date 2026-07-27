import { AuthUser } from "../domain/user";
import { createSession } from "../repositories/sessionRepository";
import { findUserByEmail } from "../repositories/userRepository";
import { ResponseObject } from "../utils/constants";

export const login = async (
  email: string,
  password: string,
  resp: ResponseObject
) => {
  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    return {
      error: true,
      error_message: "Invalid email or password",
    };
  }

  const { access_token, expires_in } = createSession(user.id);
  console.log(`[auth] ${user.email} logged in as ${user.role}`);

  return {
    ...resp,
    success_message: "Login successful",
    data: {
      access_token,
      token_type: "Bearer",
      expires_in,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    },
  };
};

export const getProfile = async (user: AuthUser, resp: ResponseObject) => ({
  ...resp,
  success_message: "Profile retrieved",
  data: user,
});
