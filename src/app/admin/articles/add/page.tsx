'use client';
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/ui/sidebar";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"


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
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"


import {
    ArrowLeft, Undo,
    Redo,
    Bold,
    Italic,
    Image as ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    X, RefreshCw
} from "lucide-react";

import {

} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import SidebarMobile from "@/components/ui/sidebar-mobile";
import AuthGuard from "@/components/authGuard";
import { AddArticles, Article, Category, DetailArticles, EditArticles, listCategory, UploadImage } from "@/api/admin";
import Footer from "@/components/ui/footer";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useRouter } from "next/navigation";
import { profile } from "@/api/auth";




export default function ArticleAdmin() {
    const router = useRouter()
    const [plainText, setPlainText] = useState('');
    const [loading, setLoading] = useState(false)
    const [selectedImg, setSelectedImg] = useState<any>(null)
    const [selectedImgUpload, setSelectedImgUpload] = useState<string>('')
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('')
    const [showPreview, setShowPreview] = useState(false)
    const [imageChange, setImageChange] = useState(false)
    const [listCategoryData, setlistCategoryData] = useState<Category[]>([])
    const [profileData, setProfileData] = useState<any>()



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
    const inputRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImg(file);
            const reader = new FileReader();

            reader.onloadend = () => {
                if (reader.result as string != image) {
                    setImageChange(true);
                }
                setImage(reader.result as string); // preview file
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = () => {
        setImageChange(true)
        setImage(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleTriggerChange = () => {
        inputRef.current?.click();
    };


    const handleAdd = async () => {
        setLoading(true)
        let uploadImageSelected;
        if (imageChange) {
            console.log("jalan belum");

            try {
                const responseImage = await UploadImage(selectedImg);
                uploadImageSelected = responseImage.imageUrl
                console.log(uploadImageSelected);
            } catch (err) {
                console.error("Upload gagal:", err);
            }
        }


        try {
            const res = await AddArticles(
                {
                    title: title,
                    content: content,
                    categoryId: category,
                    ...(imageChange && { imageUrl: uploadImageSelected })
                }
            );
            setLoading(false);
            router.push('/admin/articles')

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
        GetListCategory();
        handleProfile();
    }, [])






    return showPreview ?
        <AuthGuard allowedRole="Admin">
            <Preview content={content} title={title} image={image} handleBack={() => setShowPreview(false)} />
        </AuthGuard>
        :
        <AuthGuard allowedRole="Admin">
            <div className="flex bg-gray-100 md:pl-64 min-h-screen">
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
                            <p className="py-5 px-7 font-semibold flex gap-2 items-center text-lg"><ArrowLeft className="cursor-pointer" onClick={() => router.back()} /> Create Article</p>
                            <hr />
                            <div className="grid w-full max-w-sm items-center gap-2 px-5 mt-6">
                                <Label className="font-semibold" htmlFor="picture">Thumbnail</Label>
                                <div className="flex flex-col gap-4">
                                    {/* Input File Hidden */}
                                    <Input
                                        ref={inputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className={image ? "hidden" : ""}
                                    />

                                    {/* Preview + Action */}
                                    {image && (
                                        <div className="flex flex-col gap-2 items-start">
                                            <img
                                                src={image}
                                                alt="Preview"
                                                className="w-48 h-48 object-cover rounded-xl border"
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleTriggerChange}
                                                    className="gap-1"
                                                >
                                                    <RefreshCw className="w-4 h-4" />
                                                    Change
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={handleDelete}
                                                    className="gap-1"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {!image
                                    &&
                                    <p className="text-red-500">Please enter picture</p>
                                }
                            </div>

                            <div className="grid w-full  items-center gap-2 px-5 mt-6">
                                <Label htmlFor="username">Title</Label>
                                <Input
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value)
                                    }}
                                    id="title"
                                    type="title "
                                    placeholder="Input Title"
                                    required
                                />
                                {title == '' &&
                                    <p className="text-red-500">Please enter Title</p>
                                }
                            </div>

                            <div className="grid w-full  items-center gap-2 px-5 mt-6">
                                <Label htmlFor="username">Category</Label>
                                <Select onValueChange={(e) => setCategory(e)} value={category}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {listCategoryData.map((item: any, index) =>
                                                <SelectItem key={index} value={item.id || null}>{item.name}</SelectItem>
                                            )}                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {
                                    category == "" ?
                                        <p className="text-red-500">Please enter Category</p>
                                        :
                                        <p className="text-sm text-gray-500">The existing category can be seen in the&nbsp;
                                            <span className="text-blue-600 underline">Category</span>
                                            &nbsp;menu
                                        </p>
                                }
                            </div>

                            <div className="grid w-full items-center gap-2 mt-6 px-5">
                                <div className="border-[1px] rounded-xl">
                                    <div className="border-b-[1px]">
                                        <ToggleGroup type="multiple" className="flex flex-wrap gap-2 py-1 px-3">
                                            {/* Group 1: Undo & Redo */}
                                            <ToggleGroupItem value="undo" aria-label="Undo">
                                                <Undo className="w-4 h-4" />
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value="redo" aria-label="Redo">
                                                <Redo className="w-4 h-4" />
                                            </ToggleGroupItem>

                                            {/* Spacer */}
                                            <div className="w-4" />

                                            {/* Group 2: Bold & Italic */}
                                            <ToggleGroupItem value="bold" aria-label="Bold">
                                                <Bold className="w-4 h-4" />
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value="italic" aria-label="Italic">
                                                <Italic className="w-4 h-4" />
                                            </ToggleGroupItem>

                                            {/* Spacer */}
                                            <div className="w-4" />

                                            {/* Group 3: Image */}
                                            <ToggleGroupItem value="image" aria-label="Image">
                                                <ImageIcon className="w-4 h-4" />
                                            </ToggleGroupItem>

                                            {/* Spacer */}
                                            <div className="w-4" />

                                            {/* Group 4: Alignment */}
                                            <ToggleGroupItem value="align-left" aria-label="Align Left">
                                                <AlignLeft className="w-4 h-4" />
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value="align-center" aria-label="Align Center">
                                                <AlignCenter className="w-4 h-4" />
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value="align-right" aria-label="Align Right">
                                                <AlignRight className="w-4 h-4" />
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value="align-flat" aria-label="Align Justify">
                                                <AlignJustify className="w-4 h-4" />
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>
                                    <Textarea className="border-0 shadow-none" value={content} onChange={(e) => setContent(e.target.value)} />
                                </div>
                                {content == "" &&
                                    <p className="text-red-500">Content field cannot be empty</p>
                                }
                            </div>
                            <div className="flex justify-end my-14 px-6 gap-2">
                                <Button variant={'ghost'} className="border-[1px]">Cancel</Button>
                                <Button disabled={!content || !category || !title || !image || !loading} variant={'secondary'} onClick={() => setShowPreview(true)}>Preview</Button>
                                <Button
                                    onClick={handleAdd}
                                    disabled={!content || !category || !title || !image || !loading} variant={'primary'}>Upload</Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </AuthGuard>

}


function htmlToPlainText(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Format: ubah <li> → "- item"
    doc.querySelectorAll('li').forEach((li) => {
        const text = li.textContent?.trim() || '';
        li.textContent = `- ${text}`;
    });

    // Bisa tambah format lain di sini kalau mau: <h3>, <em>, dsb

    return doc.body.textContent?.trim() || '';
}

function Preview({ content, title, image, handleBack }: any) {

    return (
        <div className="w-screen h-screen flex flex-col items-center">
            {/* <UserNavigation /> */}
            <main className="w-full flex flex-col items-center md:pt-40 pt-24 md:px-32 px-6">
                <div className="flex my-4">
                    <p className="text-gray-400 text-sm font-bold">February 4, 2025 - Created by Admin</p>
                </div>
                <h1 className="font-semibold text-3xl md:w-[50vw] text-center">{title}</h1>
                <div className="w-full hidden md:block">
                    <AspectRatio ratio={16 / 6} className="bg-muted rounded-lg mt-12">
                        <Image
                            src={image}
                            alt={"title"}
                            fill
                            className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </AspectRatio>
                </div>

                <div className="w-full block md:hidden">
                    <AspectRatio ratio={16 / 15} className="bg-muted rounded-lg mt-12">
                        <Image
                            src={image}
                            alt={"title"}
                            fill
                            className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </AspectRatio>
                </div>


                <article className="flex flex-col gap-10 mt-10 items-start w-full">
                    {content}
                </article>
            </main>



            <section className="md:px-32 px-6 w-full flex justify-center">
                <Button variant={'primary'} onClick={handleBack}>Back To Editing</Button>
            </section>

            <div className="mt-20 w-full">
                <Footer />
            </div>
        </div>
    )
}
