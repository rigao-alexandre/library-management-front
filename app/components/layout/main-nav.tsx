import { cn } from "@/lib/utils";
import { Link, NavLink } from "react-router";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {/* {sidebarData.navGroups.map((item) => (
        // <NavGroup key={props.title} {...props} />
        <Link
          key={item.title}
          to={item.url}
          onClick={() => setOpenMobile(false)}
        >
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </Link>
      ))} */}
      <NavLink
        to="/home"
        // className="text-sm font-medium transition-colors hover:text-primary"
        className={({ isActive }) =>
          cn("text-sm font-medium transition-colors hover:text-primary", {
            "text-muted-foreground": !isActive,
          })
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/books"
        className={({ isActive }) =>
          cn("text-sm font-medium transition-colors hover:text-primary", {
            "text-muted-foreground": !isActive,
          })
        }
      >
        Books
      </NavLink>
      {/* <NavLink
        to="/examples/dashboard"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Products
      </NavLink>
      <NavLink
        to="/examples/dashboard"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Settings
      </NavLink> */}
    </nav>
  );
}
