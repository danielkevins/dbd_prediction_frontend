// frontend/app/layout.js
import "./globals.css";
import Navbar from '@/components/Navbar';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-white text-slate-800 antialiased font-sans">
        <Navbar />
        {/* pt-28 memberikan ruang agar konten tidak tertutup navbar yang fixed */}
        <main className="min-h-screen pt-28 px-4 pb-12 w-[95%] max-w-[1440px] mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}