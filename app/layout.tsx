import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

// Configure the Space Grotesk font
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Account Booster - Search Stage",
  description: "Grow your audience exponentially",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Material Symbols Outlined from Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <style>{`
          /* Custom scrollbar for webkit to match the requested style */
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #102216; 
          }
          ::-webkit-scrollbar-thumb {
            background: #22492f; 
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #316843; 
          }
        `}</style>
      </head>
      <body
        className={`${spaceGrotesk.variable} font-display antialiased selection:bg-[#0df259] selection:text-[#102216]`}
      >
        {children}
      </body>
    </html>
  );
}
