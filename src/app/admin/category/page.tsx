'use client';
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/ui/sidebar";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input"
import SidebarMobile from "@/components/ui/sidebar-mobile";
import AuthGuard from "@/components/authGuard";
import { AddCategory, Category, DeleteCategory, EditCategory, listCategory } from "@/api/admin";
import { useEffect, useState } from "react";
import { formatToReadableDate } from "@/lib/formatDate";
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { profile } from "@/api/auth";



export default function CategoryAdmin() {
    const router = useRouter()
    const [profileData, setProfileData] = useState<any>([])
    const [listCategoryData, setlistCategoryData] = useState<Category[]>([])
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(0)
    const [totalData, setTotalData] = useState(0)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [categoryName, setCategoryName] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [idCategory, setIdCategory] = useState('')
    const [nameCategoryEdit, setNameCategoryEdit] = useState('')

    const GetListCategory = async () => {
        setLoading(true)
        try {
            const res = await listCategory(
                {
                    page: page,
                    limit: 10,
                    search: search,
                }
            );
            setLoading(false);
            setTotalData(res.totalData)
            setlistCategoryData(res.data)
            setTotalPage(Math.ceil(res.totalData / 10))
        } catch (err: any) {
            console.log(err.response?.data?.message || 'Login gagal');
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await DeleteCategory(idCategory);
            GetListCategory();
            setLoading(false);
        } catch (err: any) {
            console.log(err.response?.data?.message || 'Login gagal');
        }
    }

    const handleAdd = async () => {
        setLoading(true);
        try {
            const res = await AddCategory({
                name: categoryName
            });
            GetListCategory();
            setLoading(false);
        } catch (err: any) {
            console.log(err);
            console.log(err.response?.data?.message || 'Login gagal');
        }
    }

    const handleEdit = async () => {
        setLoading(true);
        try {
            const res = await EditCategory({
                name: nameCategoryEdit
            }, idCategory);
            GetListCategory();
            setLoading(false);
        } catch (err: any) {
            console.log(err);
            console.log(err.response?.data?.message || 'Login gagal');
        }
    }

    const handleProfile = async () => {
        setLoading(true);
        try {
            const res = await profile();
            setProfileData(res)
        } catch (err: any) {
            console.log(err);
            console.log(err.response?.data?.message || "error");
        }
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    useEffect(() => {
        GetListCategory();
        handleProfile();
    }, [])

    useEffect(() => {
        GetListCategory();
    }, [page, debouncedSearch])

    return (
        <AuthGuard allowedRole="Admin">
            <div className="flex bg-gray-100 md:pl-64 h-full min-h-screen">
                <Sidebar />
                <main className="w-full">
                    <nav className="flex justify-between py-5 px-7 bg-white">
                        <div className="md:hidden">
                            <SidebarMobile />
                        </div>
                        <p className="font-bold text-2xl">Category</p>
                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage />
                                <AvatarFallback className="bg-blue-200 text-center font-bold">J</AvatarFallback>
                            </Avatar>
                            <p onClick={() => router.push('/admin/profile')} className="hidden md:block underline text-black font-bold cursor-pointer">{profileData?.username}</p>
                        </div>
                    </nav>

                    <div className="md:px-10 mt-10 ">
                        <div className="bg-white pb-1">
                            <p className="py-5 px-7 font-semibold">Total Category : {totalData}</p>
                            <hr />
                            <div className="w-full flex justify-between items-center md:flex-row flex-col px-6 md:px-0">
                                <nav className="md:w-[40vw] md:mx-6 md:flex-row flex-col p-2 rounded-xl py-5 flex md:gap-2">
                                    <div className="relative md:w-60 w-80">
                                        <Input
                                            onChange={(e) => setSearch(e.target.value)}
                                            id="search"
                                            placeholder="Search articles"
                                            className="bg-white pl-8 pb-1 !placeholder-gray-400"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute left-1 top-1/2 mt-[1px] -translate-y-1/2 h-8 w-8 p-0 text-gray-400"
                                        >
                                            <Search className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </nav>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant={'primary'} className="md:mr-5 md:w-auto w-full">+ Add Category</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="w-96">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Add Category</AlertDialogTitle>
                                            <div className="space-y-3 my-6">
                                                {/* <AlertDialogDescription> */}
                                                <Label htmlFor="username">Category</Label>
                                                <Input
                                                    id="category"
                                                    type="category"
                                                    placeholder="Input category"
                                                    onChange={(e) => setCategoryName(e.target.value)}
                                                    required
                                                />
                                                {/* </AlertDialogDescription> */}
                                            </div>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction className="bg-blue-600" onClick={handleAdd}>Add</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <Table className="bg-white mt-10 md:mt-5">
                                <TableHeader>
                                    <TableRow className="bg-gray-100">
                                        <TableHead className="text-center">Category</TableHead>
                                        <TableHead className="text-center">Created At</TableHead>
                                        <TableHead className="text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                {loading ?
                                    null
                                    :
                                    <TableBody>
                                        {listCategoryData.map((item, index) =>
                                            <TableRow key={index}>
                                                <TableCell className="text-center">{item?.name}</TableCell>
                                                <TableCell className="text-center">{formatToReadableDate(item?.createdAt)}</TableCell>
                                                <TableCell>
                                                    <div className="flex justify-center h-full items-center gap-3">
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button onClick={() => {
                                                                    setIdCategory(item.id)
                                                                    setNameCategoryEdit(item.name)
                                                                }} variant={'ghost'} className="text-blue-600 p-0 hover:underline inline-flex items-center gap-1 underline cursor-pointer">Edit</Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="w-96">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Add Category</AlertDialogTitle>
                                                                    <div className="space-y-3 my-6">
                                                                        <Label htmlFor="username">Edit Category</Label>
                                                                        <Input
                                                                            value={nameCategoryEdit}
                                                                            id="category"
                                                                            type="category"
                                                                            placeholder="Input category"
                                                                            onChange={(e) => setNameCategoryEdit(e.target.value)}
                                                                            required
                                                                        />
                                                                    </div>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction className="bg-blue-600" onClick={handleEdit}>Save Changes</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button onClick={() => setIdCategory(item.id)} variant={'ghost'} className="text-red-500 p-0 hover:underline inline-flex items-center gap-1 underline cursor-pointer">Delete</Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="w-96">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>
                                                                        Delete Category
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Delete Category "{item.name}"? This will remove it from master data permanently
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction className="bg-red-600" onClick={handleDelete}>Delete</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>

                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                }
                            </Table>

                            {loading &&
                                <div className="flex justify-center items-center my-4 w-full">
                                    <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                </div>
                            }

                            <Pagination className="my-6">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setPage((prev) => Math.max(prev - 1, 1));
                                            }}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: totalPage }, (_, i) => i + 1).map((p) => (
                                        <PaginationItem key={p}>
                                            <PaginationLink
                                                href="#"
                                                isActive={page === p}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setPage(p);
                                                }}
                                            >
                                                {p}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setPage((prev) => Math.min(prev + 1, totalPage));
                                            }}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>


                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
