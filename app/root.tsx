import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "react-router";

import type { Route } from "./+types/root";

import "./app.css";
import { Toaster } from "./components/ui/sonner";
import { Loader2 } from "lucide-react";
import { getCookie } from "~/lib/utils";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap",
  },
];

export async function clientLoader() {
  const token = getCookie("accessToken");

  if (!token) {
    return { user: null };
  }

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  try {
    const response = await fetch(`${apiUrl}/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { user: data.user };
    }

    return { user: null };
  } catch (error) {
    return { user: null };
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigation = useNavigation();

  const isNavigating =
    navigation.state === "loading" || navigation.state === "submitting";

  return (
    <>
      {isNavigating && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/50 backdrop-blur-sm transition-all duration-300">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">
              Loading...
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-rows-[auto_1fr] h-dvh">
        <Outlet />
      </div>
      <Toaster richColors />
    </>
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
