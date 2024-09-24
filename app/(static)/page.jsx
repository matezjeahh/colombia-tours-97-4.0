import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, FileText, Camera, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroBanner from "@/components/hero-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  metadataBase: new URL("https://www.colombiatours97.hu"),
  title: "Colombia Tours 97 | Fedezd fel a Föld legcsodálatosabb országát",
  description:
    "Fedezze fel Kolumbia csodáit a Colombia Tours 97-tel! Autentikus kalandtúrák, körutazások és egyedi élmények várják Dél-Amerika szívében.",
  keywords: ["Kolumbia", "utazás", "kalandtúra", "körutazás", "Dél-Amerika", "Colombia Tours 97"],
  openGraph: {
    title: "Colombia Tours 97 | Varázslatos Utazások Kolumbiába",
    description:
      "Fedezze fel Kolumbia lenyűgöző tájait, kultúráját és rejtett kincseit velünk! Biztonságos és emlékezetes kalandok Dél-Amerika szívében.",
    images: [
      {
        url: "/home.jpg", // Replace with your actual image path
        width: 1200,
        height: 630,
        alt: "Colombia Tours 97 - Felfedező utak Kolumbiában",
      },
    ],
    locale: "hu_HU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Colombia Tours 97 | Fedezd Fel Kolumbiát",
    description:
      "Autentikus kalandok, lenyűgöző tájak és kulturális kincsek várnak Kolumbiában. Utazz velünk és élj át felejthetetlen pillanatokat!",
    images: ["/home.jpg"], // Replace with your actual image path
  },
  alternates: {
    canonical: "https://www.colombiatours97.hu",
    languages: {
      "hu-HU": "https://www.colombiatours97.hu",
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

const data = [
  {
    title: "Precíz Ügyintézés",
    subtitle:
      "Minden apró részletre odafigyelünk, hogy az utazásod zökkenőmentes és kellemes legyen. A tervezéstől a szállásfoglalásig és a programok megszervezéséig mindent megteszünk.",
    icon: <FileText className="mr-2" />,
  },
  {
    title: "Zavartalan Utazás",
    subtitle:
      "Gondoskodunk róla, hogy minden utas biztonságban érezze magát és az utazás zavartalanul teljen. Szilárd és Laura, a Colombia Tours 97 alapítói, mindig rendelkezésedre állnak.",
    icon: <ShieldCheck className="mr-2" />,
  },
  {
    title: "Rejtett Kincsek",
    subtitle:
      "Fedezd fel velünk azokat a rejtett gyöngyszemeket, amelyeket más turisták sosem fedeznek fel. Vezetőink helyi szakértők, akik a legizgalmasabb úti célokat ismerik.",
    icon: <Camera className="mr-2" />,
  },
  {
    title: "Tapasztalt Idegenvezetők",
    subtitle:
      "Tapasztalt és barátságos idegenvezetők kísérik utazásodat Kolumbiában, akik a helyi kultúra, történelem és látnivalók legjobb ismerői.",
    icon: <Users className="mr-2" />,
  },
];

export default function Home() {
  return (
    <>
      <HeroBanner />
      <div className="container space-y-20 lg:space-y-32 mt-10 mb-5 lg:mt-32">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 items-center ">
          <div className="col-span-1 items-center space-y-2 lg:space-y-6 max-w-none">
            <h2>Utazz Kolumbia specialistájával</h2>
            <p>
              A Colombia Tours 97 a kolumbiai autentikus kalandtúrák és körutazások specialistája, a
              legjobb túrákat kínáljuk a dél-amerikai országban. Fedezd fel velünk Kolumbia
              lenyűgöző tájait és kulturális kincseit!
            </p>
            <Button asChild className="items-center ">
              <Link href="/rolunk">
                Ismerj meg minket <ChevronRight size={18} />
              </Link>
            </Button>
          </div>
          <div className="col-span-1 grid grid-cols-2 gap-4 ">
            <div className="col-span-1">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-60 lg:h-96 object-cover rounded-lg"
                src="/home1.jpg"
                alt="kolumbia"
              />
            </div>
            <div className="col-span-1 flex mt-4 lg:mt-10">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-60 lg:h-96 object-cover rounded-lg"
                src="/home2.jpg"
                alt="kolumbia"
              />
            </div>
          </div>
        </section>
        <section className=" grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 items-center">
          <div className="cols-span-1 rounded-xl order-last lg:order-first">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-60 lg:h-96 object-cover rounded-lg"
              src="/home3.jpg"
              alt="kolumbia"
            />
          </div>
          <div className="col-span-1 items-center space-y-2 lg:space-y-6 max-w-none">
            <h2>Ismerd meg Kolumbiát</h2>
            <p>
              Fedezd fel Kolumbia varázslatos esőerdeit, gyönyörű tengerpartjait és vibráló
              kultúráját! Csatlakozz hozzánk egy felejthetetlen kalandra Dél-Amerika szívében.
            </p>
            <Button asChild className="items-center">
              <Link href="/kolumbiarol">
                Ismerd meg Kolumbiát <ChevronRight size={18} />
              </Link>
            </Button>
          </div>
        </section>
        <section className="space-y-2 lg:space-y-6">
          <div className="flex flex-col space-y-2 lg:space-y-6 max-w-none text-start sm:text-center ">
            <h2>Miért érdemes velünk utazni Kolumbiába?</h2>
            <p>
              Tapasztalt és lelkes csapatunk garantálja, hogy az utazásod Kolumbiában az életed
              egyik legemlékezetesebb élménye lesz.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8   max-w-none  items-stretch">
            {data.map((item) => (
              <Card
                key={item.title}
                //className="bg-gradient-to-b from-white to-[#fbfbfb] dark:bg-gradient-to-b from-[#1e1e1e] to-[#121212]"
              >
                <CardHeader>
                  <div className="flex items-center ">
                    <span className="mr-2">{item.icon}</span>
                    <CardTitle>{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-accent-foreground">{item.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
