import { cn } from "@/lib/utils";
import { NavLink } from "react-router";

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  links: {
    title: string;
    href: string;
    // isActive: boolean;
    disabled?: boolean;
  }[];
}

export function TopNav({ className, links, ...props }: TopNavProps) {
  return (
    <>
      <nav
        className={cn("flex items-center space-x-4 lg:space-x-6", className)}
        {...props}
      >
        {links.map(({ title, href }) => (
          <NavLink
            key={`${title}-${href}`}
            to={href}
            className={({ isActive }) =>
              cn("text-sm font-medium transition-colors hover:text-primary", {
                "text-muted-foreground": !isActive,
              })
            }
          >
            {title}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
