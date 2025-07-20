'use client';
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Home, FileText, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import SidebarMobile from "@/components/ui/sidebar-mobile";
import AuthGuard from "@/components/authGuard";
import { useEffect, useState } from "react";
import { profile } from "@/api/auth";
import { useRouter } from "next/navigation";



export default function ProfileAdmin() {
    const router = useRouter()
    const [profileData, setProfileData] = useState<any>()
    const handleProfile = async () => {

        try {
            const res = await profile();
            setProfileData(res)
        } catch (err: any) {
            console.log(err);
            console.log(err.response?.data?.message || "error");
        }
    }

    useEffect(() => {
        handleProfile();
    },[])

    return (
        <AuthGuard allowedRole="Admin">
            <div className="flex bg-gray-100 md:pl-64 h-full min-h-screen">
                <Sidebar />
                <main className="w-full">
                    <nav className="flex justify-between py-5 px-7 bg-white">
                        <div className="md:hidden">
                            <SidebarMobile />
                        </div>
                        <p className="font-bold text-2xl">Profile</p>
                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage />
                                <AvatarFallback className="bg-blue-200 text-center font-bold">J</AvatarFallback>
                            </Avatar>
                            <p onClick={() => router.push("/admin/profile")} className="hidden md:block underline text-black font-bold cursor-pointer">{profileData?.username}</p>
                        </div>
                    </nav>

                    <div className="px-10 mt-10 flex justify-center items-center w-full ">
                        <main className="bg-white flex flex-col items-center justify-center p-10 md:w-[46vw] mt-10 w-full md:px-auto px-8">
                            <p className="mb-6">User Profile</p>
                            <Avatar className="w-16 h-16">
                                <AvatarImage />
                                <AvatarFallback className="bg-blue-200 text-center font-bold">J</AvatarFallback>
                            </Avatar>
                            <div className="w-full space-y-3 my-4">
                                <div className="flex justify-start w-full font-semibold py-2 px-4 rounded-lg bg-gray-100">
                                    <div className="space-x-7 flex">
                                        <p>Username</p>
                                        <p>:</p>
                                    </div>
                                    <p className="flex-grow text-center">{profileData?.username}</p>
                                </div>

                                <div className="flex justify-start w-full font-semibold py-2 px-4 rounded-lg bg-gray-100">
                                    <div className="space-x-7 flex">
                                        <p>Password</p>
                                        <p>:</p>
                                    </div>
                                    <p className="flex-grow text-center">******</p>
                                </div>

                                <div className="flex justify-start w-full font-semibold py-2 px-4 rounded-lg bg-gray-100">
                                    <div className="space-x-7 flex">
                                        <p>Role</p>
                                        <p>:</p>
                                    </div>
                                    <p className="flex-grow text-center pl-10">{profileData?.role}</p>
                                </div>
                            </div>
                            <Button onClick={() => router.push("/admin/articles")} type="submit" variant={"primary"} className="w-full">
                                Back to home
                            </Button>

                        </main>


                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
