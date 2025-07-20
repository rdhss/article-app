'use client';
import AuthGuard from "@/components/authGuard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");

    if (storedRole === "admin") {
      router.replace("/admin/articles");
    } else if (storedRole === "User") {
      router.replace("/user/article");
    } else {
      router.replace("/auth/login"); // Default jika role tidak ditemukan
    }
  }, [router]);

  return null;
}
