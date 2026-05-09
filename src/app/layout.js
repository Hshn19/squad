// ============================================================
// src/app/layout.jsx
// Root layout — wraps every page with global state + bottom nav
// ============================================================

import { Geist } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { AppProvider } from "@/lib/AppContext";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "FinWise",
  description: "Smart finance for Malaysian youth",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-[#F8F9FB] min-h-screen`}>
        <AppProvider>
          {/* ── Page content ── */}
          <main className="max-w-md mx-auto min-h-screen bg-[#F8F9FB] relative pb-24">
            {children}
          </main>

          {/* ── Bottom navigation ── */}
          <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
            <div className="w-full max-w-md">
              <BottomNav />
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}