import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { NavGroup, NavItem, NavLink } from "./data/sidebar-data";
import { Link, useLocation } from "react-router";

export function NavGroup({ title, items }: NavGroup) {
  const { pathname: href } = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${item.url}`;

          if (!item.items) {
            return <SidebarMenuLink key={key} item={item} href={href} />;
          }

          return <></>;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const SidebarMenuLink = ({ item, href }: { item: NavLink; href: string }) => {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(href, item)}
        tooltip={item.title}
      >
        <Link to={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

function checkIsActive(href: string, item: NavItem, mainNav = false) {
  return (
    href === item.url || // /endpint?search=param
    href.split("?")[0] === item.url // endpoint
    // || !!item?.items?.filter((i) => i.url === href).length || // if child nav is active
    // (mainNav &&
    //   href.split("/")[1] !== "" &&
    //   href.split("/")[1] === item?.url?.split("/")[1])
  );
}
