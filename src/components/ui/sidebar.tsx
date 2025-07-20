'use client'

import { Home, FileText, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function Sidebar() {

  return (
    <aside className="hidden md:block fixed top-0 left-0 h-screen w-64 bg-blue-600 border-r px-5 py-8 shadow-sm z-50">
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-white pl-3">Dashboard</h1>

        <nav className="space-y-4">
          <SidebarLink href="/admin/articles" icon={<FileText size={18} />}>
            Article
          </SidebarLink>
          <SidebarLink href="/admin/category" icon={<Home size={18} />}>
            Category
          </SidebarLink>
          <SidebarLink href="logout" icon={<LogOut size={18} />}>
            Logout
          </SidebarLink>
        </nav>
      </div>
    </aside>
  )
}

function SidebarLink({
  href,
  icon,
  children,
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
    const router = useRouter();

  const handleLogout = () => {
    // Hapus semua item dari localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // ...hapus data lain jika ada

    // Redirect ke halaman login
    router.push('/auth/login');
  };


  return (
    <Link
      onClick={() => href == 'logout' ? handleLogout() : null}
      href={href == 'logout' ? '/auth/login' : href}
      className="flex text-white items-center gap-3 text-sm font-medium  hover:bg-blue-500 px-3 py-2 rounded-lg transition-colors"
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}
