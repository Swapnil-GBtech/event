// components/layout/LayoutShell.tsx

"use client";
import { useEffect } from "react";
import React from "react";
import { useAuth } from "@/lib/auth/auth-provider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const { auth,refreshUser } = useAuth();

  return (
    <>
      {/* Navbar only if not superadmin */}
      {auth?.role !== "super Admin" && <Navbar />}
      
      <main className="min-h-screen">{children}</main>
      
      {/* Footer also optional if you want to hide */}
      {auth?.role !== "super Admin" && <Footer />}
    </>
  );
}
