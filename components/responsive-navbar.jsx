"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { Menu } from "lucide-react";

export default function Navbar() {
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

  return (
    <header className="flex h-16 w-full shrink-0 sticky top-0 z-10 items-center px-4 md:px-6 lg:px-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
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
            <MountainIcon className="h-6 w-6" />
            <span className="font-bold">Colombia Tours 97</span>
          </Link>
          <div className="grid gap-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`flex w-full items-center text-md py-1 pl-2 focus:bg-muted/30 rounded-lg font-medium ${
                  pathname === item.path ? "bg-muted" : ""
                }`}
                prefetch={false}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <div className="container lg:flex items-center justify-between hidden">
        <Link href="/" className="mr-6 hidden lg:flex" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <span className="font-bold items-center ml-4">Colombia Tours 97</span>
          <span className="sr-only">Acme Inc</span>
        </Link>
        <div className="hidden lg:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavigationMenuLink asChild key={item.name}>
                  <Link
                    href={item.path}
                    prefetch={false}
                    className={`px-4 text-sm font-medium transition-colors py-2 text-muted-foreground hover:text-foreground/80 ${
                      pathname === item.path ? "text-primary" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                </NavigationMenuLink>
              ))}
              <ModeToggle />
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <ModeToggle className="lg:hidden ml-auto" />
    </header>
  );
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
