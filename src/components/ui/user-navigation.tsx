'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./button";

export default function UserNavigation({ profilename, white }: any) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const handleLogout = () => {
        // Hapus semua item dari localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        // ...hapus data lain jika ada

        // Redirect ke halaman login
        router.push('/auth/login');
    };

    return (
        <nav className="absolute w-full h-20 bg-white md:bg-transparent z-[99] flex top-0 items-center justify-between md:px-14 px-5">
            <img src="/images/LogoText.png" alt="Logo" className={`h-[23px] w-[130px] ${white ? 'hidden' : 'block'}`} />
            <img src="/images/LogoTextWhite.png" alt="Logo" className={`h-[23px] w-[130px] ${white ? 'block' : 'hidden'}`} />
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpen((prev) => !prev)}>
                <Avatar>
                    <AvatarImage />
                    <AvatarFallback className="bg-blue-200 text-center font-bold">J</AvatarFallback>
                </Avatar>
                {/* <p className="hidden md:block underline text-black">{profilename}</p> */}


                <nav className=" py-4">
                    <div className="flex items-center justify-between">

                        <div className="relative ml-3">
                            <button
                                className={`${white ? 'text-white' : 'text-black'} cursor-pointer`}
                            >
                                {profilename}
                            </button>

                            {open && (
                                <div className="absolute top-7 right-[-0.6rem] w-52 py-2 mt-2 bg-white border shadow rounded z-10">
                                    <Link
                                        href="/user/profile"
                                        className="block px-4 py-2 "
                                    >
                                        My Account
                                    </Link>
                                    <Button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-red-400 cursor-pointer !bg-transparent font-bold flex items-center gap-1"
                                    >
                                        <LogOut />
                                        Log Out
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

            </div>
        </nav>
    );
}


