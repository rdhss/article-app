"use client"

import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SidebarMobile() {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const handleNavigate = (path: string) => {
        router.push(path)
        setOpen(false) // Tutup sheet
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" >
                    <Menu className="w-10 h-10" />
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[280px] bg-blue-600 text-white h-full px-5 py-6">
                <SheetTitle className="text-lg font-semibold mb-6 text-white">
                    Dashboard
                </SheetTitle>

                <nav className="space-y-4">
                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-blue-500"
                    onClick={() => handleNavigate("articles")}
                    >
                        Article
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-blue-500"
                     onClick={() => handleNavigate("category")}
                    >
                        Category
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-blue-500">
                        Logout
                    </Button>
                </nav>
            </SheetContent>
        </Sheet>
    )
}
