import { FlashMessageSchema } from "@/components/layout/flash-message";
import { createCookieSessionStorage } from "react-router";

// Get the secret for the cookie from environment variables
let secret = import.meta.env.VITE_COOKIE_SECRET || "default";

if (secret === "default") {
  console.warn("No COOKIE_SECRET set, the app is insecure");
  secret = "session-secret";
}

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60,
      secrets: [secret],
    },
  });

// Function to get flash message from the session
export async function getFlashMessage(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const data = session.get("flash") || null;
  return {
    data: data ? FlashMessageSchema.parse(JSON.parse(data)) : null,
    headers: { "Set-Cookie": await destroySession(session) },
  };
}

// Function to set flash message in the session
export async function setFlashMessage(
  request: Request,
  data: FlashMessageSchema
) {
  const session = await getSession(request.headers.get("Cookie"));
  session.flash("flash", JSON.stringify(data));
  return { headers: { "Set-Cookie": await commitSession(session) } };
}
