import { Geist, Geist_Mono, Inter } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "block",
});

export const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "block",
});

export const inter = Inter({
  subsets: ["latin"],
  display: "block",
  variable: "--font-inter",
});
