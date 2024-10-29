import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, CalendarDays, Map, Gauge, Plane, Landmark } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getDocumentData } from "@/firebase-functions";
import { Badge } from "@/components/ui/badge";
import { getFirstImageFromFolder } from "@/lib/images";

export const metadata = {
  metadataBase: new URL("https://www.colombiatours97.hu"),
  title: "Utazásaink | Colombia Tours 97 - Felfedezőutak Kolumbiában",
  description:
    "Fedezze fel Kolumbia varázslatos régióit és élvezze a különleges élményeket! Változatos körutazások és kalandtúrák Dél-Amerika szívében a Colombia Tours 97-tel.",
  keywords: [
    "Kolumbia utazás",
    "körutazás",
    "kalandtúra",
    "északi régió",
    "déli régió",
    "hegyi kirándulás",
    "tengerparti pihenés",
    "Colombia Tours 97",
  ],
  openGraph: {
    title: "Kolumbiai Utazások és Körutazások | Colombia Tours 97",
    description:
      "Fedezze fel Kolumbia északi, középső és déli régióit! Változatos programok, extrém kalandok és tengerparti pihenés egy helyen.",
    images: [
      {
        url: "/home.jpg", // Replace with an image representing your trips
        width: 1200,
        height: 630,
        alt: "Colombia Tours 97 - Változatos utazások Kolumbiában",
      },
    ],
    locale: "hu_HU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kolumbiai Utazások és Túrák | Colombia Tours 97",
    description:
      "Aktuális túráink Kolumbia különböző régióiban: északi látványosságok, hegyi kalandok, tengerparti pihenés. Fedezze fel velünk!",
    images: ["/home.jpg"], // Replace with your actual image path
  },
  alternates: {
    canonical: "https://www.colombiatours97.hu/utazasaink",
    languages: {
      "hu-HU": "https://www.colombiatours97.hu/utazasaink",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification=Ij3REYpezRvU6CK8m-T4cGdjPAHpr0uIetNQ2z1oHJU", // Replace with your actual Google verification code
  },
};

export const dynamic = "force-dynamic";

// Extracted PageHeader component for better organization
const PageHeader = () => (
  <section className="space-y-6 mb-12">
    <div>
      <h1 className="text-center">Utazásaink</h1>
      <p className="text-center text-muted-foreground">
        Fedezze fel Kolumbia varázslatos régióit és élvezze a különleges élményeket
      </p>
    </div>
    <p>
      A hatalmas távolságok és a rengeteg látnivaló miatt felosztottam az országot öt régióra
      égtájak szerint. Mindegyik országrészt tekintve van egy 2 illetve 3 hetes programunk, ez
      utóbbi mindig extrémebb kalandtúra elemeket is tartalmaz.
    </p>
    <p>
      Azt is fontos megemlítenem, hogy mindenki utazási stílusa, elvárásai eltérnek, ezért többféle
      utazási mòd létezik Kolumbia tekintetében is, a felületes luxusutaktól a hátizsákos
      kalandozásig. Az én útjaim általában kislétszámú (max.6 fô) privát terepjárós körutazások, de
      bôven utazunk vizen, levegőben de még szamaras fogaton vagy motortaxin is. A hangsúly mindig
      az egyedülálló élményen van, nem a luxusszálláson vagy a klímás autón. Ha vérbeli autentikus
      Kolumbia-útra vágysz, akkor a Colombia Tours 97 útjain a helyed. Igény esetén bármelyik utunk
      elérhető privát útként akár 1-2 résztvevővel is.
    </p>
    <p>
      Ahány országrész, annyiféle különböző kultúra, éghajlat, etnikum és szokások, mintha egy-egy
      másik országban járna az utazó. Épp ezért tematikusan úgy építettem fel a körutakat, hogy az
      utazó komlett képet kapjon az adott régióról. Az útvonalak ugyan kombinálhatóak, de egy-egy
      utazás alatt maximum 1 vagy 2 országrész meglátogatását ajánlom. Ezzel ellenkezô esetben nem
      jut elég idő egyik régióra sem és csak a &quot;főbb&quot; ismertebb látnivalókat van lehetőség
      felkeresni. Pedig Kolumbiában köztudottan a kevéssé ismert vidéki látnivalókon és natív
      kultúrákon van a hangsúly.
    </p>
    <p>
      Országrészenként eltér az optimális utazási időszak, ez az esős időszaktól vagy a nemzeti
      parkok zárvatartásától, indián ünnepektől függ. Ennek függvényében minden országrészbe indítok
      évente legalább egy csoportos körutazást, melyek közül mindenki megtalálja a neki leginkább
      tetszőt, a kisgyermekes családtól az idős házaspáron keresztül a sportos kalandorig. Válaszd
      ki Te is a hozzád illő utat, és találkozzunk Kolumbiában!
    </p>
  </section>
);

// Extracted TourCard component for better reusability
const TourCard = ({ item, index, imageName }) => (
  <Card className="flex flex-col justify-between h-full overflow-hidden">
    <div className="relative h-60 w-full">
      <Image
        unoptimized
        alt={`Kolumbia ${item.cim}`}
        className="object-cover rounded-t-lg"
        src={imageName ? `/${index}/${imageName}` : "/fallback-image.jpg"}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={index < 3}
      />
    </div>
    <CardHeader className="flex-grow">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Map size={20} className="mr-2" />
          <span className="uppercase text-sm font-semibold">{item.taj}</span>
        </div>
        <Badge variant="default" className="rounded-md">
          {item.nepszeru ? "Kalandtúra" : "Körutazás"}
        </Badge>
      </div>
      <CardTitle className="!mt-3">{item.cim}</CardTitle>
      <CardDescription>{item.leiras}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="flex items-center">
        <Gauge size={20} className="mr-2" />
        <Badge className="rounded-md">
          {item.nehezseg === 0 ? "Könnyű" : item.nehezseg === 1 ? "Közepes" : "Nehéz"}
        </Badge>
      </div>
      <div className="flex items-center">
        <CalendarDays size={20} className="mr-2" />
        <p className="text-sm font-medium leading-none !mt-0">
          {item.datum.kezdo} - {item.datum.veg}
        </p>
      </div>
      <div className="flex items-center">
        <Plane size={20} className="mr-2" />
        <p className="text-sm font-medium">{item.szabad}</p>
      </div>
      <div className="flex items-center">
        <DollarSign size={20} className="mr-2" />
        <p className="text-sm font-medium">{item.ar} USD/fő</p>
      </div>
      <div className="flex items-center">
        <Landmark size={20} className="mr-2" />
        <p className="text-sm font-medium">{item.cimke.join(", ")}</p>
      </div>
    </CardContent>
    <CardFooter className="justify-end mt-auto">
      <Button asChild variant="default" className="items-center w-full">
        <Link href={`utazasaink/${item.slug}`}>Részletek</Link>
      </Button>
    </CardFooter>
  </Card>
);

export default async function Utazasaink({ params }) {
  const { id } = params;
  const post = await getDocumentData("adatok", "utazasaink");

  const tourImages = post.utak.map((_, index) => getFirstImageFromFolder(index));

  return (
    <div className="container mx-auto py-8">
      <PageHeader />

      <section className="space-y-6">
        <div>
          <h2 className="text-center">Aktuális túráink</h2>
          <p className="text-center text-muted-foreground">
            Friss és változatos túraajánlatok Kolumbia különböző régióiban
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {post.utak.map((item, index) => (
            <TourCard key={item.id} item={item} index={index} imageName={tourImages[index]} />
          ))}
        </div>
      </section>
    </div>
  );
}
