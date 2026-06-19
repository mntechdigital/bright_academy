/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ChevronDown, Eye, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import logo from "../../../../public/bright Academy.png";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import { logout } from "@/src/services/auth";
import { Sidebar } from "./DashboardSidebar";
import { jwtDecode } from "jwt-decode";

interface NavbarProps {
  adminData: any;
}

export function Navbar({ adminData }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    // Determine redirect path based on user role BEFORE logout deletes cookies
    let redirectPath = "/login";
    
    // Read token from client-side cookies
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return undefined;
    };
    
    const accessToken = getCookie("accessToken");
    
    if (accessToken) {
      try {
        const decoded = jwtDecode<{ role?: string }>(accessToken);
        redirectPath = decoded.role === "TEACHER" ? "/teacher/login" : "/login";
      } catch {
        redirectPath = "/login";
      }
    }
    
    const res = await logout();
    console.log("logout res==>",res);
    
    router.push(redirectPath);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-[#02182b] text-white px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-white">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <VisuallyHidden>
            <SheetTitle>This is the News Sidebar</SheetTitle>
          </VisuallyHidden>
          <SheetContent side="left" className="pt-10">
            <Sidebar
              adminData={adminData}
              isMobile={true}
              onNavItemClick={() => setIsMobileMenuOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <Link href="/dashboard" className="flex items-center">
          <Image
            src={logo || "/placeholder.svg"}
            alt="Bright Academy Logo"
            width={150}
            height={40}
            className="lg:h-10 lg:w-auto"
            priority
            unoptimized
          />
        </Link>
      </div>
      <div className="flex items-center max-sm:gap-1 gap-4">
        <Link href="/#navbar">
          <Button
            variant="outline"
            className="cursor-pointer flex items-center bg-white text-black border-white hover:bg-gray-200"
          >
            <Eye className="h-4 w-4 text-black" />{" "}
            View Site
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-white">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="Admin"
                />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">Admin</span>
              <ChevronDown className="h-4 w-4 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer">
              <Link href={`/dashboard/general-setting`}>Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
