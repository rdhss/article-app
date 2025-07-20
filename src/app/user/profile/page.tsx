'use client';
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Footer from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import UserNavigation from "@/components/ui/user-navigation";
import AuthGuard from "@/components/authGuard";
import { profile } from "@/api/auth";
import { useEffect, useState } from "react";



export default function Profile() {
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
    }, [])
    
    return (
        <AuthGuard allowedRole="User">
            <div className="w-screen h-screen flex flex-col items-center">
                <UserNavigation profilename={profileData?.username}/>
                <main className="flex-grow flex flex-col items-center justify-center md:w-[26vw] w-full md:px-auto px-8">
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
                            <p className="flex-grow text-center">*******</p>
                        </div>

                        <div className="flex justify-start w-full font-semibold py-2 px-4 rounded-lg bg-gray-100">
                            <div className="space-x-7 flex">
                                <p>Role</p>
                                <p>:</p>
                            </div>
                            <p className="flex-grow text-center md:pl-9">{profileData?.role}</p>
                        </div>
                    </div>
                    <Button type="submit" variant={"primary"} className="w-full">
                        Back to home
                    </Button>
                </main>
                <div className="w-full self-end-safe">
                    <Footer />
                </div>
            </div>
        </AuthGuard>
    );
}
