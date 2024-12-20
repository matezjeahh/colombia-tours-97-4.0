"use client";

import React, { useEffect, useState, useRef } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { Menu, Facebook, Phone, Instagram, Youtube } from "lucide-react";

export default function Navbar() {
  const navbarRef = useRef(null);
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const navigation = [
    { name: "Főoldal", path: "/" },
    { name: "Utazásaink", path: "/utazasaink" },
    { name: "Kolumbiáról", path: "/kolumbiarol" },
    { name: "Rólunk", path: "/rolunk" },
    { name: "Elérhetőség", path: "/elerhetoseg" },
    { name: "Média", path: "/media" },
  ];

  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  useEffect(() => {
    const updateNavbarHeight = () => {
      if (navbarRef.current) {
        const height = navbarRef.current.offsetHeight;
        document.documentElement.style.setProperty("--navbar-height", `${height}px`);
      }
    };

    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    return () => window.removeEventListener("resize", updateNavbarHeight);
  }, []);

  return (
    <header
      ref={navbarRef}
      className="flex h-14 lg:h-14 w-full shrink-0 sticky top-0 z-10 items-center px-4 md:px-6 lg:px-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <Link href="/" className="font-bold inline-block items-center ml-4 lg:hidden">
          Colombia Tours 97
        </Link>
        <SheetContent side="left">
          <Link href="/" prefetch={false} className="flex items-center">
            <span className="font-bold">Colombia Tours 97</span>
          </Link>
          <div className="grid gap-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`flex w-full items-center text-md py-1 pl-2 focus:bg-muted/80 rounded-lg font-medium ${
                  pathname === item.path ? "bg-muted" : ""
                }`}
                prefetch={false}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex space-x-4 ml-2">
            <Link href="https://www.instagram.com/colombiatours97" target="_blank">
              <Button variant="outline" size="icon">
                <Instagram />
              </Button>
            </Link>
            <Link href="https://www.youtube.com/channel/UCiWqrA-vRBjOKG7rCn-7vDQ" target="_blank">
              <Button variant="outline" size="icon">
                <Youtube />
              </Button>
            </Link>
            <Link href="https://www.facebook.com/colombiatours97" target="_blank">
              <Button variant="outline" size="icon">
                <Facebook />
              </Button>
            </Link>
            <Link href="https://wa.me/+573226014919" target="_blank">
              <Button variant="outline" size="icon">
                <Phone />
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <div className="container lg:flex items-center justify-between hidden">
        <Link href="/" className="hidden lg:flex font-bold items-center" prefetch={false}>
          Colombia Tours 97
        </Link>
        <div className="hidden lg:flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.path}
                      prefetch={false}
                      className={`px-2 text-sm font-medium transition-colors py-2 text-muted-foreground hover:text-foreground/80 ${
                        pathname === item.path ? "text-primary" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center ml-4 space-x-2">
            <Link href="https://wa.me/+573226014919" target="_blank" rel="noopener noreferrer">
              <Phone className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <Link
              href="https://www.facebook.com/colombiatours97"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
      <div className="lg:hidden ml-auto flex items-center space-x-2">
        <ModeToggle />
      </div>
    </header>
  );
}
