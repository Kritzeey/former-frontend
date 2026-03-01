import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const baseUrl =
    import.meta.env.VITE_API_URL || process.env.INTERNAL_API_URL || "";

  if (typeof document === "undefined") {
    return `${baseUrl || "http://localhost:3000"}${cleanPath}`;
  }

  return baseUrl ? `${baseUrl}${cleanPath}` : cleanPath;
}
