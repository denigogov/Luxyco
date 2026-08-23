import type { NavbarTypes } from "../../whitelabel/src/organisms/navbar/o-navbar.types";
import type { MobileQuickMenuTypes } from "../../whitelabel/src/organisms/MobileQuickMenu/o-mobileQuickMenu.types";

export function filterMobileQuickMenuByNavbar(
  items: readonly MobileQuickMenuTypes[],
  navbar: NavbarTypes,
): MobileQuickMenuTypes[] {
  const allowedNavigationPaths = new Set<string>();

  navbar.navItems.forEach((category) => {
    category.menu.forEach((menuItem) => {
      if (menuItem.path) {
        allowedNavigationPaths.add(menuItem.path);
      }

      menuItem.subChildren?.forEach((child) => {
        if (child.path) {
          allowedNavigationPaths.add(child.path);
        }
      });
    });
  });

  return items.flatMap((item): MobileQuickMenuTypes[] => {
    if (item.type === "route") {
      return allowedNavigationPaths.has(item.path) ? [item] : [];
    }

    if (item.type === "toggle") {
      return [
        {
          ...item,
          activePaths: item.activePaths?.filter((path) =>
            allowedNavigationPaths.has(path),
          ),
        },
      ];
    }

    // Keep action items such as scanner.
    return [item];
  });
}
