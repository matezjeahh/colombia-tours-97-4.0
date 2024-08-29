import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function HeroBanner() {
  return (
    <div
      style={{ height: "calc(100vh - var(--navbar-height, 0px))" }}
      className="relative bg-black"
    >
      <Image src="/home.jpg" alt="Kolumbia" fill className="opacity-50 object-cover" />
      <div className="absolute inset-0 flex flex-col items-center justify-center container m-auto text-center space-y-2">
        <h1 className="text-white !text-4xl !font-bold !lg:text-5xl">
          Fedezd fel a Föld legcsodálatosabb országát
        </h1>
        <p className="text-white font-medium text-primary-foreground ">
          Ha igazi kalandra vágysz, és szeretnél felfedezni egy varázslatos országot, akkor nincs
          más dolgod, mint felkerekedni, és Kolumbiába utazni - a Föld egyik legcsodálatosabb
          helyére!
        </p>
        <Button asChild className="items-center !mt-4">
          <Link href="/utazasaink">Utazásaink</Link>
        </Button>
      </div>
    </div>
  );
}
