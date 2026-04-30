import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKRW(value: number): string {
  return `₩${value.toLocaleString("ko-KR")}`;
}

export function formatUSD(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}
