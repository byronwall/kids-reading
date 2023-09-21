import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Create a TS function that slugifies a name with spaces to a URL with dashes.  Give function for encode and decode

export function slugify(name: string) {
  return name.replace(/\s/g, "-");
}

export function deslugify(slug: string) {
  return slug.replace(/-/g, " ");
}
