import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const convertPriceToLocal = (price: number): string => {
  // Here you can implement a real conversion logic
  // Example: if the price is in dollars, convert it to local currency (₦)
  // const dollarValue = parseFloat(price.replace('$', ''));
  const conversionRate = 1500; // Example conversion rate
  const localPrice = price * conversionRate;

  return `₦${localPrice.toLocaleString()}`;
};