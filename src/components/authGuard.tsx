"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function AuthGuard({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) {
    const router = useRouter();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const roleLoged = localStorage.getItem("role");
        
        if (!token) {
            // tidak ada token, redirect login
            router.replace("/auth/login");
        } else if (roleLoged === allowedRole) {
            // role cocok
            setAllowed(true);
        } else {
            // role tidak cocok, kembali ke halaman sebelumnya
            router.back();
        }
    }, []);

    if (!allowed) return null; // Atau loading...

    return <>{children}</>;
}
