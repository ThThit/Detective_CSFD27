import type { Metadata } from "next";
import { Cinzel_Decorative, Cormorant_Garamond, Special_Elite } from "next/font/google";
import "./globals.css";

const cinzelDecorative = Cinzel_Decorative({
  weight: "700",
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
});

const specialElite = Special_Elite({
  weight: "400",
  variable: "--font-special-elite",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CSFD 27 · CS First Date 2027",
  description: "Seniors have gone undercover. Junior operatives must identify their assigned mentor before the deadline.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzelDecorative.variable} ${cormorantGaramond.variable} ${specialElite.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
