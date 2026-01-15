"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
// import { useAuth } from "@/hooks/use-auth"
import {
  Home,
  FileText,
  Plus,
  Users,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  ChartBarStacked,
  Layers,
  Newspaper,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/hooks/use-auth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  //   useEffect(() => {
  //   // agar tum admin area me ho toh admin check chalayenge
  //   if (pathname.startsWith("/admin")) {
  //     checkAdminAuth()
  //   } else {
  //     checkAuth()
  //   }
  // }, [])

  useEffect(() => {
    // ✅ Prevent redirect loop by ignoring /login
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }

    // If user is not admin, redirect to login
    if (
      !loading &&
      user &&
      user.role !== "admin" &&
      pathname !== "/admin/login"
    ) {
      toast.error("You need admin privileges to access this page.");
      router.push("/admin/login");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null; // Prevent rendering until admin user is loaded

  const menuItems = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/articles", icon: FileText, label: "All Articles" },
    { href: "/admin/articles/new", icon: Plus, label: "Create News" },
    {
      href: "/admin/newsletter",
      icon: Newspaper,
      label: "Newsletter",
      adminOnly: true,
    },
    {
      href: "/admin/categories",
      icon: ChartBarStacked,
      label: "Categories",
      adminOnly: true,
    },
    {
      href: "/admin/opinions",
      icon: Layers,
      label: "Opinions",
      adminOnly: true,
    },
    {
      href: "/admin/fake-news",
      icon: BadgeCheck,
      label: "Fake News Reports",
      adminOnly: true,
    },
    { href: "/admin/users", icon: Users, label: "Users", adminOnly: true },
    {
      href: "/admin/settings",
      icon: Settings,
      label: "Settings",
      adminOnly: true,
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || user.role === "admin" || user.role === "editor"
  );

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">RM</span>
              </div>
              <div>
                <h2 className="font-bold text-red-600">Republic Mirror</h2>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu className="p-2">
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </SidebarTrigger>
                <h1 className="text-xl font-semibold text-gray-900">
                  {pathname === "/admin" && "Dashboard"}
                  {pathname === "/admin/articles" && "All Articles"}
                  {pathname === "/admin/articles/create" && "Create News"}
                  {pathname.startsWith("/admin/articles/") &&
                    pathname.endsWith("/edit") &&
                    "Edit Article"}
                  {pathname === "/admin/newsletter" && "Newsletter"}
                  {pathname === "/admin/users" && "Users"}
                  {pathname === "/admin/settings" && "Settings"}
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={user.profileImage || "/placeholder.svg"}
                        />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user.role}
                        </p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 bg-gray-50">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
