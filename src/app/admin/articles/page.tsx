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
import { useRouter } from "next/navigation"
import AuthGuard from "@/components/authGuard";
import { Article, Category, DeleteArticles, listArticles, listCategory } from "@/api/admin";
import { useEffect, useState } from "react";
import { formatToReadableDate } from "@/lib/formatDate";
import { profile } from "@/api/auth";


export default function ArticleAdmin() {
    const router = useRouter()
    const [listArticleData, setListArticleData] = useState<any[]>([])
    const [listCategoryData, setlistCategoryData] = useState<Category[]>([])
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [search, setSearch] = useState("");
    const [totalArticle, setTotalArticle] = useState(0)
    const [category, setCategory] = useState("")
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(0)
    const [loading, setLoading] = useState(true)
    const [idArticle, setIdArticle] = useState('')
    const [profileData, setProfileData] = useState<any>()

    const handleNavigate = (path: string) => {
        router.push(path)
    }

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await DeleteArticles(idArticle);
            GetListArticle();
            setLoading(false);
        } catch (err: any) {
            console.log(err.response?.data?.message || 'Login gagal');
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

    const GetListArticle = async () => {
        setLoading(true)
        try {
            const res = await listArticles({
                page,
                category,
                title: debouncedSearch
            });
            setLoading(false);
            setListArticleData(res.data);
            setTotalArticle(res.total)
            setPage(res.page)
            setTotalPage(Math.ceil(res.total / res.limit))
        } catch (err: any) {
            console.log(err.response?.data?.message || 'Login gagal');
        }
    };

    const GetListCategory = async () => {
        try {
            const res = await listCategory(
                {
                    limit: 99
                }
            );
            setlistCategoryData(res.data)
        } catch (err: any) {
            console.log(err.response?.data?.message || 'Login gagal');
        }
    };


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
        handleProfile();
        GetListArticle();
        GetListCategory();
    }, [])

    useEffect(() => {
        // GetListArticle();
        console.log(listArticleData);
        console.log(listArticleData[0]?.imageUrl);

        // GetListCategory();
    }, [listArticleData])

    useEffect(() => {
        GetListArticle();
    }, [page, category, debouncedSearch])




    return (
        <AuthGuard allowedRole="Admin">
            <div className="flex bg-gray-100 md:pl-64 min-h-screen ">
                <Sidebar />
                <main className="w-full">
                    <nav className="flex justify-between py-5 px-7 bg-white">
                        <div className="md:hidden">
                            <SidebarMobile />
                        </div>
                        <p className="font-bold text-2xl">Articles</p>
                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage />
                                <AvatarFallback className="bg-blue-200 text-center font-bold">J</AvatarFallback>
                            </Avatar>
                            <p className="hidden md:block underline text-black font-bold cursor-pointer" onClick={() => router.push('/admin/profile')}>{profileData?.username}</p>
                        </div>
                    </nav>

                    <div className="md:px-10 mt-10 ">
                        <div className="bg-white pb-1">
                            <p className="py-5 px-7 font-semibold">Total Articles : {totalArticle}</p>
                            <hr />
                            <div className="w-full flex justify-between items-center md:flex-row flex-col px-6 md:px-0">
                                <nav className="md:w-[40vw] w-[90%] md:mx-6 md:flex-row flex-col p-2 rounded-xl py-5 flex gap-2">
                                    <Select onValueChange={(e) => setCategory(e)}>
                                        <SelectTrigger className="md:w-56 w-full bg-white font-bold text-black " >
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {listCategoryData.map((item: any, index) =>
                                                    <SelectItem key={index} value={item.id || null}>{item.name}</SelectItem>
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <div className="relative w-full">
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
                                <Button className="md:mr-5 w-full md:w-auto" variant={'primary'}
                                    onClick={() => handleNavigate('/admin/articles/add')}
                                >+ Add Article</Button>
                            </div>
                            <Table className="bg-white mt-10 md:mt-5">
                                <TableHeader>
                                    <TableRow className="bg-gray-100">
                                        <TableHead className="text-center">Thumbnail</TableHead>
                                        <TableHead className="text-center">Title</TableHead>
                                        <TableHead className="text-center">Category</TableHead>
                                        <TableHead className="text-center">Created At</TableHead>
                                        <TableHead className="text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                {loading ?
                                    null
                                    :
                                    <TableBody>
                                        {listArticleData.map((item: any, index) =>
                                            <TableRow key={index}>
                                                <TableCell className="flex justify-center h-[4rem]">
                                                    <Image
                                                        src={item?.imageUrl?.startsWith("http") ? item.imageUrl : "/placeholder.png"}
                                                        alt="img"
                                                        width={60}
                                                        height={60}
                                                        className="rounded-md object-cover"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium text-center">{item.title}</TableCell>
                                                <TableCell className="text-center">{item.category.name}</TableCell>
                                                <TableCell className="text-center">{formatToReadableDate(item.createdAt)}</TableCell>
                                                <TableCell>
                                                    <div className="flex justify-center h-full items-center gap-3">
                                                        <button className="text-blue-500 hover:underline inline-flex items-center gap-1 underline cursor-pointer">
                                                            Preview
                                                        </button>
                                                        <button onClick={() => router.push(`/admin/articles/${item.id}/edit`)} className="text-blue-500 hover:underline inline-flex items-center gap-1 underline cursor-pointer">
                                                            Edit
                                                        </button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button onClick={() => setIdArticle(item.id)} variant={'ghost'} className="text-red-500 p-0 hover:underline inline-flex items-center gap-1 underline cursor-pointer">Delete</Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Delete Articles</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Deleting this article is permanent and cannot be undone. All related content will be removed
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
