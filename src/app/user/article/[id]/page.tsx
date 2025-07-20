'use client';
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Footer from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"
import UserNavigation from "@/components/ui/user-navigation";
import AuthGuard from "@/components/authGuard";
import { useParams } from "next/navigation";
import { DetailArticles, listArticles } from "@/api/admin";
import { useEffect, useState } from "react";
import { formatToReadableDate } from "@/lib/formatDate";
import { profile } from "@/api/auth";


const items = Array.from({ length: 3 }, (_, i) => ({
  id: i,
  date: "12 Agustus",
  title: `Figma's New Dev Mode : ${i + 1} Game-Changer for Designer & Developers`,
  desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt autem quo eius corporis laudantium porro maxime dolores expedita sed pariatur, enim dolorem temporibus recusandae inventore iste quisquam minus consequuntur magnam!",
  category: "Kategori",
  image: "https://cdn.pixabay.com/photo/2021/12/12/20/00/play-6865967_640.jpg",
}));


export default function Article() {
  const params = useParams();
  const id = String(params.id);
  const [detailData, setDetailData] = useState<any>()
  const [loading, setLoading] = useState(true)
  const [listArticleData, setListArticleData] = useState<any>()
  const [plainText, setPlainText] = useState('')

  function htmlToPlainText(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    doc.querySelectorAll('li').forEach((li) => {
      const text = li.textContent?.trim() || '';
      li.textContent = `- ${text}`;
    });

    return doc.body.textContent?.trim() || '';
  }


  const GetDetailArticle = async () => {
    try {
      const res = await DetailArticles(id);
      setDetailData(res)
    } catch (err: any) {
      console.log(err.response?.data?.message);
    }
  }

  const GetListArticle = async () => {
    setLoading(true)
    try {
      const res = await listArticles({
        page: 1,
        category: detailData?.category.id,
        limit: 3
      });
      setLoading(false);
      setListArticleData(res.data);
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
    GetDetailArticle();
    handleProfile();
  }, [])

  useEffect(() => {
    GetListArticle();
    const format = htmlToPlainText(detailData?.content)
    setPlainText(format)
  }, [detailData])

  return (
    <AuthGuard allowedRole="User">
      <div className="w-screen h-screen flex flex-col items-center">
        <UserNavigation profilename={profileData?.username}/>
        <main className="w-full flex flex-col items-center md:pt-40 pt-24 md:px-32 px-6">
          <div className="flex my-4">
            <p className="text-gray-400 text-sm font-bold">{formatToReadableDate(detailData?.createdAt)} - Created by Admin</p>
          </div>
          {/* <h1 className="font-semibold text-3xl md:w-[50vw] text-center">Figma's New Dev Mode : A Game-Changer for Designer & Developers</h1> */}
          <h1 className="font-semibold text-3xl md:w-[50vw] text-center">{detailData?.title}</h1>
          <div className="w-full hidden md:block">
            <AspectRatio ratio={16 / 6} className="bg-muted rounded-lg mt-12">
              {/* <Image
                src={"https://cdn.pixabay.com/photo/2021/12/12/20/00/play-6865967_640.jpg"}
                alt={"title"}
                fill
                className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
              />  */}
              <Image
                src={detailData?.imageUrl?.startsWith("http") ? detailData?.imageUrl : "/placeholder.png"}
                alt={"title"}
                fill
                className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </AspectRatio>
          </div>

          <div className="w-full block md:hidden">
            <AspectRatio ratio={16 / 15} className="bg-muted rounded-lg mt-12">
              {/* <Image
                src={"https://cdn.pixabay.com/photo/2021/12/12/20/00/play-6865967_640.jpg"}
                alt={"title"}
                fill
                className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
              /> */}
              <Image
                src={detailData?.imageUrl?.startsWith("http") ? detailData?.imageUrl : "/placeholder.png"}
                alt={"title"}
                fill
                className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </AspectRatio>
          </div>


          {/* <article className="flex flex-col gap-10 mt-10">
            <section className="space-y-4">
              <p>
                In the ever-evolving world of digital product design, collaboration between designers and developers has always been a crucial—yet often challenging—part of the process. In April 2025, Figma introduced Dev Mode, a powerful new feature aimed at streamlining that collaboration more than ever before.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">🔧 What Is Dev Mode?</h2>
              <p>
                Dev Mode is a new interface within Figma that provides developer-focused tools and removes unnecessary UI clutter that designers typically use. Instead, developers can view ready-to-implement specs, such as spacing, color values, font styles, and asset exports—without disrupting the design file or asking the design team for clarifications.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">🤝 Bridging the Gap Between Design & Development</h2>
              <p>
                Traditionally, handing off designs involved back-and-forth communication, misunderstandings, and occasional delays. With Dev Mode, handoff becomes real-time and seamless:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Live Design Specs:</strong> Developers can inspect the design without needing additional tools or extensions.</li>
                <li><strong>Code Snippets:</strong> Automatically generated CSS, iOS (Swift), and Android (XML) code help speed up implementation.</li>
                <li><strong>Version History Access:</strong> Stay aligned with design updates without asking for a new export every time.</li>
                <li><strong>Integrated Comments:</strong> Developers can leave feedback directly in the design file.</li>
              </ul>
            </section>
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">🚀 Why It Matters</h2>
              <p>
                For design teams working in agile environments, the speed of handoff can make or break a sprint. Figma’s Dev Mode turns a typically messy phase into a collaborative, real-time experience that reduces errors, shortens build times, and improves the designer-developer relationship.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">🧠 Final Thoughts</h2>
              <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-600">
                “It's not just a feature—it's a shift in how digital products are built.”
              </blockquote>
              <p>
                Whether you're a solo designer working with freelance developers or part of a large product team, Figma’s Dev Mode introduces a smoother, smarter way to collaborate.
              </p>
            </section>
          </article> */}
          <article className="flex flex-col gap-10 mt-10">
            {/* {htmlToPlainText(detailData?.content || "")} */}
            {plainText}
          </article>

        </main>

        <nav className="mt-15 px-32 self-start">
          <p className="font-bold text-xl">Other articles</p>
        </nav>

        <section className="md:px-32 px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listArticleData?.map((item: any) => (
              <Card
                key={item.id}
                className="overflow-hidden shadow-none border-0 rounded-2xl"
              >
                <AspectRatio ratio={13 / 7} className="bg-muted rounded-lg">
                  <Image
                    src={item?.imageUrl?.startsWith("http") ? item.imageUrl : "/placeholder.png"}
                    alt={'img'}
                    fill
                    className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
                  />
                </AspectRatio>
                <CardContent className="space-y-2 px-0">
                  <p className="text-sm text-gray-500">{formatToReadableDate(item?.createdAt)}</p>
                  <h3 className="text-lg font-semibold">{item?.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{htmlToPlainText(item?.content)}</p>
                  <Badge variant="primary">{item?.category?.name}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="mt-20 w-full">
          <Footer />
        </div>
      </div>
    </AuthGuard>
  );
}
