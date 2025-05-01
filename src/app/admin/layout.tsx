"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Users, Package, UserCog, MicIcon, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Cookies from "js-cookie"
import Image from "next/image"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminUser, setAdminUser] = useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = Cookies.get("admin-token")
    const userStr = localStorage.getItem("adminUser")

    if (token && userStr) {
      setIsAuthenticated(true)
      setAdminUser(JSON.parse(userStr))
    } else if (!pathname.includes("/admin/login")) {
      router.push("/admin/login")
    }
  }, [pathname, router])

  const handleLogout = () => {
    Cookies.remove("admin-token")
    localStorage.removeItem("adminUser")
    setIsAuthenticated(false)
    router.push("/admin/login")
  }

  // Don't render the layout for the login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return null // Or a loading state
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Programs", href: "/admin/programs", icon: Package },
    { name: "Premium Users", href: "/admin/premium-users", icon: Users },
    { name: "Free Users", href: "/admin/free-users", icon: Users },
    { name: "Testimonies", href: "/admin/testimonies", icon: MicIcon },
    { name: "Profile", href: "/admin/profile", icon: UserCog },
  ]

  return (
    <div className="flex h-screen bg-[#0e1723]">
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button variant="outline" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-[#c19b37] text-white hover:bg-[#a8842e] border-none">
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-[#0e1723] shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4 border-b border-[#c19b37]/20">
            <div className="flex items-center gap-2">
              <div className="w-20 h-20">
                <Image src="/mkm-logo2.png" alt="mkm-logo" className="object-contain w-full h-full" width={100} height={100} />
              </div>
              <h1 className="text-xl font-bold text-[#c19b37]">Admin </h1>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    isActive ? "bg-[#c19b37] text-white" : "text-gray-300 hover:bg-[#c19b37]/20 hover:text-[#c19b37]",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-[#c19b37]/20 p-4">
            {adminUser && (
              <div className="mb-4 px-3 py-2">
                <div className="font-medium text-[#c19b37]">{adminUser.name}</div>
                <div className="text-xs text-gray-400">{adminUser.role}</div>
              </div>
            )}
            <Button
              variant="outline"
              className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-400 border-[#c19b37]/20"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0e1723] text-gray-200">{children}</main>
      </div>
    </div>
  )
}
