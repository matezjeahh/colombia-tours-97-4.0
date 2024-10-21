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
      <Image
        src="/home.jpg"
        alt="Kolumbia"
        fill
        className="opacity-50 object-cover"
        priority={true}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center container m-auto text-center space-y-8 lg:space-y-2">
        <h1 className="text-white !text-4xl !font-bold !lg:text-5xl">
          Fedezd fel a Föld legcsodálatosabb országát
        </h1>
        <p className="text-white font-medium text-primary-foreground ">
          Ha szeretnéd felfedezni a világ legcsodálatosabb országának valódi értékeit, nincs más
          dolgod mint jelentkezni induló utazásaink valamelyikére, vagy egyéni útként megrendelni
          azt. Válaszd a magyar nyelvű Kolumbia-specialistát, ha felejthetetlen élményekre vágysz.
        </p>
        <Button asChild className="items-center !mt-4">
          <Link href="/utazasaink">Utazásaink</Link>
        </Button>
      </div>
    </div>
  );
}
