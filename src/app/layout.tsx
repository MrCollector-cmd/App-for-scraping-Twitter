import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";


const roboto = Roboto({
  subsets: ['latin'],
  weight: ["400", "700"], // Asegúrate de incluir los pesos que necesitas
});

export const metadata: Metadata = {
  title: "Solana | Tonkens.",
  description: "App for tokens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    
    <html lang="en">
      <body
        className={`${roboto.className} antialiased flex justify-center items-center`}
      >
        {children}
      </body>
    </html>
  );
}
