import React from "react";
import { TopNav } from "./top-nav";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export const Header = ({
  className,
  fixed,
  children,
  ...props
}: HeaderProps) => {
  return (
    <div className="hidden flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <TopNav
            links={[
              {
                href: "/dashboard",
                title: "Dashboard",
              },
              {
                href: "/books",
                title: "Books",
              },
              {
                href: "/members",
                title: "Members",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

Header.displayName = "Header";
