import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { StrictMode } from "react";

import { Toaster } from "@/components/ui/sonner";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        {/* <Links /> */}
      </head>
      <body>
        {/* <SidebarProvider> */}
        {/* <AppSidebar /> */}
        <main>
          {/* <SidebarTrigger /> */}
          {children}
        </main>
        {/* </SidebarProvider> */}

        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Outlet />
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button variant="outline">Open</Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent className="w-56">
    //     <DropdownMenuLabel>My Account</DropdownMenuLabel>
    //     <DropdownMenuSeparator />
    //     <DropdownMenuGroup>
    //       <DropdownMenuItem>
    //         Profile
    //         <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
    //       </DropdownMenuItem>
    //       <DropdownMenuItem>
    //         Billing
    //         <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
    //       </DropdownMenuItem>
    //       <DropdownMenuItem>
    //         Settings
    //         <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
    //       </DropdownMenuItem>
    //       <DropdownMenuItem>
    //         Keyboard shortcuts
    //         <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
    //       </DropdownMenuItem>
    //     </DropdownMenuGroup>
    //     <DropdownMenuSeparator />
    //     <DropdownMenuGroup>
    //       <DropdownMenuItem>Team</DropdownMenuItem>
    //       <DropdownMenuSub>
    //         <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
    //         <DropdownMenuPortal>
    //           <DropdownMenuSubContent>
    //             <DropdownMenuItem>Email</DropdownMenuItem>
    //             <DropdownMenuItem>Message</DropdownMenuItem>
    //             <DropdownMenuSeparator />
    //             <DropdownMenuItem>More...</DropdownMenuItem>
    //           </DropdownMenuSubContent>
    //         </DropdownMenuPortal>
    //       </DropdownMenuSub>
    //       <DropdownMenuItem>
    //         New Team
    //         <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
    //       </DropdownMenuItem>
    //     </DropdownMenuGroup>
    //     <DropdownMenuSeparator />
    //     <DropdownMenuItem>GitHub</DropdownMenuItem>
    //     <DropdownMenuItem>Support</DropdownMenuItem>
    //     <DropdownMenuItem disabled>API</DropdownMenuItem>
    //     <DropdownMenuSeparator />
    //     <DropdownMenuItem>
    //       Log out
    //       <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
