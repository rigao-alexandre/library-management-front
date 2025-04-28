import React from "react";
import { Header } from "./header";
import { Main } from "./main";

interface BaseLayoutProps extends React.HTMLAttributes<HTMLElement> {}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <>
      <Header />

      <Main>{children}</Main>
    </>
  );
};

BaseLayout.displayName = "BaseLayout";
