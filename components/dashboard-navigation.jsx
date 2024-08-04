"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../firebase";

export default function DashboardNavbar() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await signOut(getAuth(app));

    await fetch("/api/logout");

    router.push("/login");
  }

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
          <Button variant="ghost" size="icon">
            <LayoutGrid />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <p className="font-bold inline-block items-center ml-4 lg:hidden">Irányítópult</p>
        <SheetContent side="left">
          <p className="font-bold">Irányítópult</p>

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
        <p className="font-bold items-center ml-4">Irányítópult</p>
        <Button variant="outline" onClick={handleLogout}>
          Kijelentkezés
        </Button>
      </div>
      <ModeToggle className="lg:hidden ml-auto" />
    </header>
  );
}
