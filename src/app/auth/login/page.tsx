"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link";
import { useEffect, useState } from "react";
import { login } from "@/api/auth";
import { useRouter } from 'next/navigation';
import { z } from "zod";
import { ToastManual } from "@/components/ui/toast";

const schema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
});

export default function Login() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false)
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<{ username?: boolean; password?: boolean }>({
        username: false,
        password: false,
    });

    const handleLogin = async () => {
        setLoading(true)
        const result = schema.safeParse({ username, password });
        if (!result.success) {
            console.log(result.error.format());
            const errorField = result.error.format();

            const newErrors = {
                username: !!errorField.username?._errors?.length,
                password: !!errorField.password?._errors?.length,
            };

            setErrors(newErrors);
            setLoading(false)
            return;
        }

        setErrors({
            username: false,
            password: false
        });

        try {
            const res = await login({ username, password });
            localStorage.setItem('token', res.token); // Simpan token
            localStorage.setItem('role', res.role); // Simpan token
            if (res.role == "User") {
                router.push('/user/article')
            } else {
                router.push('/admin/articles')
            }

        } catch (err: any) {
            setLoading(false)
            setShowToast(true)
            console.log(err.response?.data?.message || 'Login gagal');
        }
    };

    const [loged, setloged] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role");

        if (token) {
            if (storedRole === "Admin") {
                router.replace("/admin/articles");
            } else {
                router.replace("/user/article");
            }
        } else {
            setloged(false);
        }
    }, []);

    if (loged) return null;

    return (
        <div className="w-screen h-screen overflow-hidden flex justify-center items-center md:bg-gray-100">
            <ToastManual
                message="Account tidak ditemukan"
                show={showToast}
                setShow={setShowToast}
            />
            <Card className="w-full max-w-sm border-0 shadow-none ">
                <CardHeader>
                    <CardTitle className="text-3xl flex justify-center">
                        <Image
                            src="/images/LogoText.png"
                            alt="Logo"
                            width={150} // atau ukuran sesuai kebutuhan
                            height={40}
                        />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="username"
                                    placeholder="Input username"
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                {errors.username &&
                                    <p className="text-sm text-red-500">Please enter your username</p>
                                }
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="pr-10"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                    >
                                        {showPassword ? (
                                            <Eye className="w-4 h-4" />
                                        ) : (
                                            <EyeOff className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                                {errors.password &&
                                    <p className="text-sm text-red-500">Please enter your password</p>
                                }
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" disabled={loading ? true : false} variant={"primary"} className="w-full" onClick={handleLogin}>
                        Login
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                        Don’t have an account?{" "}
                        <Link href="register" className="text-blue-600 hover:underline">
                            Register
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
