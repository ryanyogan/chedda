import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function convertAmountFromMiliunits(amount: number) {
  return amount / 10;
}

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 10);
}
