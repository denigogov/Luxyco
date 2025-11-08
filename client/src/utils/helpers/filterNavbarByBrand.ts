import type { NavbarTypes } from "../../whitelabel/src/organisms/navbar/o-navbar.types";
import { brandConfig } from "../brands";

type NavItem = NavbarTypes["navItems"][number];
type MenuItem = NavItem["menu"][number];
type SubChild = NonNullable<MenuItem["subChildren"]>[number];

export function filterNavbarByBrand(navData: NavbarTypes): NavbarTypes {
  const allowedPaths = brandConfig.routes?.includePaths || [];

  //  Recursively filter subChildren
  const filterSubChildren = (children: SubChild[]): SubChild[] =>
    children.filter((child) => {
      const inAllowed = child.path ? allowedPaths.includes(child.path) : false;
      return inAllowed;
    });

  //  Recursively filter menu items
  const filterMenu = (items: MenuItem[]): MenuItem[] =>
    items
      .map((item) => {
        const subChildren = item.subChildren
          ? filterSubChildren(item.subChildren)
          : undefined;

        return { ...item, subChildren };
      })
      .filter((item) => {
        const inAllowed = item.path ? allowedPaths.includes(item.path) : false;
        const hasChildren = !!(item.subChildren && item.subChildren.length > 0);
        return inAllowed || hasChildren;
      });

  //  Filter top-level nav sections
  const filteredNavItems: NavbarTypes["navItems"] = navData.navItems
    .map((section) => ({
      ...section,
      menu: filterMenu(section.menu),
    }))
    .filter((section) => section.menu.length > 0);

  return {
    ...navData,
    navItems: filteredNavItems,
  };
}
