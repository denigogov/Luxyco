import type { NavbarTypes } from "../../whitelabel/src/organisms/navbar/o-navbar.types";
import { brandConfig } from "../brands";
import { flattenIncludePaths } from "../routes/routeFlattenPath";

type NavItem = NavbarTypes["navItems"][number];
type MenuItem = NavItem["menu"][number];
type SubChild = NonNullable<MenuItem["subChildren"]>[number];

export function filterNavbarByBrand(navData: NavbarTypes): NavbarTypes {
  const allowedPaths = flattenIncludePaths(brandConfig.routes) || [];

  const filterSubChildren = (children: SubChild[]): SubChild[] =>
    children.filter((child) =>
      child.path ? allowedPaths.includes(child.path) : false
    );

  const filterMenu = (items: MenuItem[]): MenuItem[] =>
    items
      .map((item) => {
        const subChildren = item.subChildren
          ? filterSubChildren(item.subChildren)
          : undefined;

        return { ...item, subChildren };
      })
      .filter((item) => {
        const allowed = item.path ? allowedPaths.includes(item.path) : false;
        const hasChildren = item.subChildren && item.subChildren.length > 0;
        return allowed || hasChildren;
      });

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
