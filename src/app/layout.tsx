import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Dooper Health | AI Medical Report Analyzer",
  description: "An smart health-tech AI portal to extract and assess medical report biomarkers, track history, and review health diagnostics.",
  icons: {
    icon: "Assets/logonew.png", // Matches Dooper asset icon
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full`}>
      <body className="h-full" style={{ display: "flex", flexDirection: "column" }}>
        {children}
      </body>
    </html>
  );
}
