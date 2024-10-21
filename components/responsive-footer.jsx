import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Instagram, Phone, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-8 w-full mt-auto border-t ">
      <div className="container max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col items-start gap-4">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            {/*ide jöhet egy ikon majd*/}
            <span className="font-bold text-lg">Colombia Tours 97</span>
          </Link>
          <p className="text-sm font-medium text-muted-foreground">
            Az autentikus kalandtúrák és körutazások specialistája.
          </p>
          <div className="flex space-x-4">
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
        </div>
        <div className="grid gap-1">
          <h4 className="font-semibold">Általános információ</h4>
          <Link
            href="/adatvedelmi-iranyelvek"
            className="text-sm font-medium text-muted-foreground hover:text-foreground/80 focus:text-foreground/80"
            prefetch={false}
          >
            Adatvédelmi irányelvek
          </Link>
          <Link
            href="/ceginformacio"
            className="text-sm font-medium text-muted-foreground hover:text-foreground/80 focus:text-foreground/80"
            prefetch={false}
          >
            Céginformáció
          </Link>
          <Link
            href="/rolunk"
            className="text-sm font-medium text-muted-foreground hover:text-foreground/80 focus:text-foreground/80"
            prefetch={false}
          >
            Rólunk
          </Link>
        </div>
        <div className="grid gap-1">
          <h4 className="font-semibold ">Utazóinknak</h4>
          <Link
            href="/utazasaink"
            className="text-sm font-medium text-muted-foreground hover:text-foreground/80 focus:text-foreground/80"
            prefetch={false}
          >
            Utazásaink
          </Link>
          <Link
            href="/kolumbiarol"
            className="text-sm font-medium text-muted-foreground hover:text-foreground/80 focus:text-foreground/80"
            prefetch={false}
          >
            Kolumbiáról
          </Link>
          <Link
            href="/media"
            className="text-sm font-medium text-muted-foreground hover:text-foreground/80 focus:text-foreground/80"
            prefetch={false}
          >
            Média
          </Link>
        </div>
        <div className="grid gap-1">
          <h4 className="font-semibold ">Kapcsolat</h4>
          <p className="text-sm font-medium text-muted-foreground">+57 322 6014919</p>
          <p className="text-sm font-medium text-muted-foreground">colombiatours97@hotmail.com</p>
          <p className="text-sm font-medium text-muted-foreground">
            Carrera 6 #2-39 Mingueo, La Guajira Kolumbia
          </p>
        </div>
      </div>
      <div className="container mt-8 flex flex-col items-center ">
        <p className="text-sm font-medium">
          &copy; {new Date().getFullYear()} Colombia Tours 97. Minden jog fenntartva.
        </p>
      </div>
    </footer>
  );
}
