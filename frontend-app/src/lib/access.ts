export type AccessRule = {
  and?: string[];
  or?: string[];
};

export const matchesAccessRule = (
  permissions: string[] | undefined,
  rule?: AccessRule
) => {
  if (!rule?.and?.length && !rule?.or?.length) return true;

  const list = permissions ?? [];
  const andOk = !rule.and?.length || rule.and.every((p) => list.includes(p));
  const orOk = !rule.or?.length || rule.or.some((p) => list.includes(p));

  return andOk && orOk;
};

export const NAV_ITEMS = [
  { path: "/dashboard", label: "User Info" },
  { path: "/admin", label: "Admin", access: { and: ["admin"] } },
  { path: "/about", label: "About", access: { and: ["about"] } },
  { path: "/contacts", label: "Contacts", access: { and: ["contacts"] } },
  { path: "/reports", label: "Reports", access: { and: ["reports"] } },
  { path: "/settings", label: "Settings", access: { and: ["settings"] } },
];

export const canAccessPath = (
  permissions: string[] | undefined,
  path: string
) => {
  const item = NAV_ITEMS.find((nav) => nav.path === path);
  return matchesAccessRule(permissions, item?.access);
};
