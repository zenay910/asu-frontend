import type { Metadata } from "next";
import { Outfit, Roboto_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
// @ts-ignore: Allow side-effect CSS import without type declarations
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ASU Appliances - Reliable Appliances & Service",
  description: "Local appliance experts providing reliable appliances and honest service. Browse our inventory of quality washers, dryers, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${mono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
