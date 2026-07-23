import {
  consumeAuthCode,
  createAccessToken,
  createAuthCode,
  findAccessToken,
  findUserByEmail,
  findUserById,
} from "../repositories/oauthRepository";

export const renderLoginPage = (options: {
  redirectUri: string;
  error?: string;
}): string => {
  const { redirectUri, error } = options;
  const loginAction = `/oauth/login?redirect_uri=${encodeURIComponent(redirectUri)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Login</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 360px; margin: 48px auto; padding: 0 16px; }
    label { display: block; margin: 12px 0 4px; font-size: 14px; }
    input { width: 100%; padding: 8px; box-sizing: border-box; }
    button { margin-top: 16px; width: 100%; padding: 10px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Sign in</h1>
  ${error ? `<p style="color:#b00020">${error}</p>` : ""}
  <form method="POST" action="${loginAction}">
    <label>Email</label>
    <input type="email" name="email" required autocomplete="username" />
    <label>Password</label>
    <input type="password" name="password" required autocomplete="current-password" />
    <button type="submit">Login</button>
  </form>
</body>
</html>`;
};

export const renderConfirmPage = (options: {
  redirectUri: string;
  name: string;
}): string => {
  const { redirectUri, name } = options;
  const q = `redirect_uri=${encodeURIComponent(redirectUri)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Confirm</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 360px; margin: 48px auto; padding: 0 16px; }
    button { margin-top: 16px; width: 100%; padding: 10px; cursor: pointer; }
    .secondary { background: transparent; border: 1px solid #ccc; margin-top: 8px; }
  </style>
</head>
<body>
  <h1>Continue as ${name}?</h1>
  <form method="POST" action="/oauth/confirm?${q}">
    <button type="submit">Allow</button>
  </form>
  <form method="POST" action="/oauth/switch?${q}">
    <button type="submit" class="secondary">Use another account</button>
  </form>
</body>
</html>`;
};

export const renderAuthorizePage = (
  redirectUri: string,
  userIdFromCookie?: string
): string => {
  const user = userIdFromCookie
    ? findUserById(String(userIdFromCookie))
    : undefined;

  if (user) {
    return renderConfirmPage({ redirectUri, name: user.name });
  }

  return renderLoginPage({ redirectUri });
};

export const loginAndIssueCode = (
  email: string,
  password: string,
  redirectUri: string
): { code: string; userId: string } => {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }

  return {
    code: createAuthCode(user.id, redirectUri),
    userId: user.id,
  };
};

export const issueCodeForUserId = (
  userId: string,
  redirectUri: string
): string => {
  const user = findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return createAuthCode(user.id, redirectUri);
};

export const exchangeCodeForToken = (code: string, redirectUri: string) => {
  const authCode = consumeAuthCode(code, redirectUri);
  if (!authCode) {
    throw new Error("Invalid or expired authorization code");
  }

  const issued = createAccessToken(authCode.userId);
  return {
    access_token: issued.access_token,
    token_type: "Bearer",
    expires_in: issued.expires_in,
  };
};

export const getUserInfoForToken = (accessToken: string) => {
  const entry = findAccessToken(accessToken);
  if (!entry) {
    throw new Error("Invalid or expired access token");
  }

  const user = findUserById(entry.userId);
  if (!user) {
    throw new Error("User not found");
  }

  const { id, email, name } = user;
  return { id, email, name };
};
