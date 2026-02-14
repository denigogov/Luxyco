// utils/helpers/filterNavbarByRole.ts
import type { NavbarTypes } from "../../whitelabel/src/organisms/navbar/o-navbar.types";
import { hasRoleAccessToPath } from "../routes/roleAccess";

/**
 * Returns a new navbar config where items are filtered
 * based on the user's role + routeAccess.
 */
export function filterNavbarByRole(
  navbar: NavbarTypes,
  role: string | null | undefined,
): NavbarTypes {
  // If we don't know the role yet,  return original navbar.
  if (!role) return navbar;

  return {
    ...navbar,
    navItems: navbar.navItems
      .map((category) => {
        const filteredMenu = category.menu
          .map((item) => {
            const subChildren = Array.isArray(item.subChildren)
              ? item.subChildren.filter((sub) => {
                  if (!sub.path) return true;
                  return hasRoleAccessToPath(sub.path, role);
                })
              : item.subChildren;

            return {
              ...item,
              subChildren,
            };
          })
          .filter((item) => {
            const hasPath =
              typeof item.path === "string" && item.path.trim().length > 0;

            const pathAllowed = hasPath
              ? hasRoleAccessToPath(item.path as string, role)
              : true;

            const hasSubChildren =
              Array.isArray(item.subChildren) && item.subChildren.length > 0;

            return pathAllowed || hasSubChildren;
          });

        return {
          ...category,
          menu: filteredMenu,
        };
      })
      // Remove empty categories (no menu items left)
      .filter((category) => category.menu.length > 0),
  };
}
