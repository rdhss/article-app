"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { useRouter } from 'next/navigation';
import { z } from "zod";
import { register } from "@/api/auth";
import { ToastManual } from "@/components/ui/toast";

const schema = z.object({
    username: z.string().min(1),
    password: z.string().min(8),
    role: z.string().min(1),
});



export default function Register() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false)
    const [loged, setloged] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("username sudah dipakai");
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState<'User' | 'Admin'>('User')
    const [errors, setErrors] = useState<{ username?: boolean; password?: boolean, role?: boolean }>({
        username: false,
        password: false,
        role: false,
    });

    const handleRegister = async () => {
        setLoading(true)

        const result = schema.safeParse({ username, password, role });
        if (!result.success) {
            console.log(result.error.format());
            const errorField = result.error.format();

            const newErrors = {
                username: !!errorField.username?._errors?.length,
                password: !!errorField.password?._errors?.length,
                role: !!errorField.role?._errors?.length,
            };

            setErrors(newErrors);
            setLoading(false);

            return;
        }

        setErrors({
            username: false,
            password: false
        });

        try {
            const res = await register({ username, password, role });
            setUsername("");
            setPassword("");
            setShowToast(true);
            setToastMessage("Akun berhasil dibuat")
            setLoading(false)
        } catch (err: any) {
            setLoading(false)
            setToastMessage("Username sudah dipakai")
            setShowToast(true)
            console.log(err.response);
        }
    };


    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role");

        if (token) {
            if (storedRole === "admin") {
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
                message={toastMessage}
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
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    value={username}
                                    id="username"
                                    type="username"
                                    placeholder="Input username"
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                {errors.username
                                    &&
                                    <p className="text-sm text-red-500">Username field cannot be empty</p>
                                }
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        value={password}
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pr-10"
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
                                {
                                    errors.password
                                    &&
                                    <p className="text-sm text-red-500">Password must be at least 8 characters long</p>
                                }
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username">Role</Label>
                                <Select value={role} onValueChange={(e: 'User' | 'Admin') => setRole(e)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Role</SelectLabel>
                                            <SelectItem value="User">User</SelectItem>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {
                                    errors.role &&
                                    <p className="text-sm text-red-500">Role field cannot be empty</p>
                                }
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button onClick={handleRegister} disabled={loading ? true : false} type="submit" variant={"primary"} className="w-full">
                        Register
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="login" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
