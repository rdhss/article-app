'use client';
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
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
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import { Button } from "@/components/ui/button";
import { Eye, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import Footer from "@/components/ui/footer";
import UserNavigation from "@/components/ui/user-navigation";
import AuthGuard from "@/components/authGuard";
import { useEffect, useState } from "react";
import { listArticles, listCategory } from "@/api/admin";
import { useRouter } from "next/navigation";
import { formatToReadableDate } from "@/lib/formatDate";
import { profile } from "@/api/auth";


const items = Array.from({ length: 9 }, (_, i) => ({
    id: i,
    date: "12 Agustus",
    title: `Figma's New Dev Mode : ${i + 1} Game-Changer for Designer & Developers`,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt autem quo eius corporis laudantium porro maxime dolores expedita sed pariatur, enim dolorem temporibus recusandae inventore iste quisquam minus consequuntur magnam!",
    category: "Kategori",
    image: "https://cdn.pixabay.com/photo/2021/12/12/20/00/play-6865967_640.jpg",
}));


export default function Article() {
    const router = useRouter();
    const [listCategoryData, setlistCategoryData] = useState<any>()
    const [listArticleData, setListArticleData] = useState<any[]>([])
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalArticle, setTotalArticle] = useState(0)
    const [totalPage, setTotalPage] = useState(0)
    const [category, setCategory] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [search, setSearch] = useState("");

    function htmlToPlainText(html: string): string {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        doc.querySelectorAll('li').forEach((li) => {
            const text = li.textContent?.trim() || '';
            li.textContent = `- ${text}`;
        });

        return doc.body.textContent?.trim() || '';
    }


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
        GetListCategory();
        GetListArticle();
        handleProfile();
        // console.log("API URL:", process.env.NEXT_PUBLIC_API_BASE_URL)
    }, [])

    useEffect(() => {
        GetListArticle();
    }, [page, debouncedSearch, category])


    return (
        <AuthGuard allowedRole="User">
            <div className="w-screen h-screen relative overflow-x-hidden overflow-y-scroll">
                <UserNavigation profilename={profileData?.username} white/>
                <header className="bg-blue-600 md:h-[70vh] h-[85vh] flex flex-col justify-center items-center">
                    <div className="flex flex-col text-center mt-11">
                        <p className="text-white text-lg font-semibold">Blog genzet</p>
                        <p className="text-white md:text-5xl text-4xl w-80 md:w-[60vw] mt-5 md:mt-auto">
                            The Journal : Design Resources,
                            Interviews, and Industry News
                        </p>
                        <p className="text-white text-xl mt-4">Your daily dose of design insights!</p>
                    </div>

                    <nav className="md:w-[40vw] w-[90%] md:mx-6 md:flex-row flex-col p-2 bg-blue-500 rounded-xl mt-10 flex gap-2">
                        <Select onValueChange={(e) => setCategory(e)}>
                            <SelectTrigger className="md:w-56 w-full bg-white font-bold text-black " >
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {listCategoryData?.map((item: any, index: any) =>
                                        <SelectItem key={index} value={item.id || null}>{item.name}</SelectItem>
                                    )}
                                    {/* <SelectItem value="admin">Admin</SelectItem> */}
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
                </header>
                <main>
                    <nav className="my-10 px-15">
                        <p className="font-semibold">Showing : 10 of {totalArticle} articles</p>
                    </nav>

                    <section className="overflow-x-hidden px-15">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {loading ?
                                <div className="flex justify-center items-center my-4 w-full">
                                    <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                </div>
                                :
                                <>
                                    {listArticleData.map((item) => (
                                        <Card
                                            onClick={() => router.push(`/user/article/${item.id}`)}
                                            key={item?.id}
                                            className="overflow-hidden shadow-none border-0 rounded-2xl"
                                        >
                                            <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
                                                <Image
                                                    src={item?.imageUrl?.startsWith("http") ? item.imageUrl : "/placeholder.png"}
                                                    fill
                                                    alt="img"
                                                    className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
                                                />
                                            </AspectRatio>
                                            <CardContent className="space-y-2 px-0">
                                                <p className="text-sm text-gray-500">{formatToReadableDate(item?.createdAt)}</p>
                                                <h3 className="text-lg font-semibold cursor-pointer">{item?.title}</h3>
                                                <p className="text-sm text-gray-600 line-clamp-3">{htmlToPlainText(item?.content)}</p>
                                                <Badge variant="primary">{item?.category?.name}</Badge>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </>
                            }
                        </div>
                    </section>
                </main>

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


                <Footer />
            </div>
        </AuthGuard>
    );
}
