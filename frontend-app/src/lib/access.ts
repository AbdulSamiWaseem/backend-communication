export const NAV_ITEMS = [
  { path: "/dashboard", label: "User Info" },
  { path: "/admin", label: "Admin", permission: "admin" },
  { path: "/about", label: "About", permission: "about" },
  { path: "/contacts", label: "Contacts", permission: "contacts" },
  { path: "/reports", label: "Reports", permission: "reports" },
  { path: "/settings", label: "Settings", permission: "settings" },
];

export const hasPermission = (
  permissions: string[] | undefined,
  permission?: string
) => !permission || (permissions?.includes(permission) ?? false);

export const canAccessPath = (
  permissions: string[] | undefined,
  path: string
) => {
  const item = NAV_ITEMS.find((nav) => nav.path === path);
  return hasPermission(permissions, item?.permission);
};
