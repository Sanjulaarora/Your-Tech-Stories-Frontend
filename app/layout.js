import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import LoadingScreen from "./loading";
import { UserProvider } from '@/context/user-context';

const inter = Inter ({ subsets: ['latin']});

export const metadata = {
  title: "Gemlay",
  description: "Created by Sanjula Arora",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <UserProvider>
        <body
          className={`inter.className bg-black text-white`}
        >
          <Header />
          <React.Suspense fallback={<LoadingScreen />}>
          {children}
          </React.Suspense>
          <footer className="mx-11 mt-11 mb-8 p-2">
            <p className="text-center">Made with 💛 by Sanjula Arora</p>
          </footer>
        </body>
      </UserProvider>
    </html>
  );
}
