import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  FileText,
  Camera,
  Users,
  ChevronRight,
  Instagram,
  Facebook,
  Youtube,
  Phone,
} from "lucide-react";
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
    title: "Precíz szervezés",
    subtitle:
      "A körutakat én magam személyesen szervezem és vezetem, beleértve a szállást, utazást és a felejthetetlen programokat.",
    icon: <FileText className="mr-2" />,
  },
  {
    title: "Zavartalan Utazás",
    subtitle:
      "Gondoskodunk róla, hogy minden utas biztonságban érezze magát és egész életre szóló élményeket szerezzen.",
    icon: <ShieldCheck className="mr-2" />,
  },
  {
    title: "Rejtett Kincsek",
    subtitle:
      "Fedezd fel velünk azokat a kultúrális és természeti értékeket melyek az átlag turista számára elérhetetlenek.",
    icon: <Camera className="mr-2" />,
  },
  {
    title: "Tapasztalt Idegenvezetők",
    subtitle:
      "A körutakat én magam vezetem, tapasztalt helyi vezetôkkel karöltve akik az adott közösséghez tartoznak.",
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
                unoptimized
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
                unoptimized
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
              unoptimized
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
          <div className="flex flex-col space-y-2 lg:space-y-6 max-w-none text-start sm:text-center">
            <h2>
              A körutazások és kalandtúrák fáradalmait mesés partszakaszokon pihenheted ki, legyen
              szó luxus- vagy pénztárcabarát szállásokról
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                src: "/home5.jpg",
                alt: "Tengerpart kolumbiában",
                caption: "Tayrona Nemzeti Park",
              },
              { src: "/home6.jpg", alt: "Képeslapra illő part", caption: "San Bernardo szigetek" },
              { src: "/home7.jpg", alt: "Kolumbiai tengerpart", caption: "Playa Blanca Barú" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col">
                <Image
                  unoptimized
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-60 lg:h-80 object-cover rounded-lg"
                  src={item.src}
                  alt={item.alt}
                />
                <div className="flex items-center mt-2">
                  <div className="w-0.5 h-6 bg-muted-foreground mr-2"></div>
                  <p className="text-md font-semibold text-accent-foreground">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className=" grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 items-center">
          <div className="col-span-1 items-center space-y-2 lg:space-y-6 max-w-none">
            <h2>Kövess minket az úton!</h2>
            <p>
              Kövess minket közösségi média oldalainkon, hogy elsőként értesülj az izgalmas úti
              célokról, különleges ajánlatokról és utazási tippekről. Csatlakozz a kalandvágyó
              utazók közösségéhez!
            </p>
            <div className="lg:flex space-x-4 hidden ">
              <Link href="https://www.instagram.com/colombiatours97" target="_blank">
                <Button variant="ghost" size="icon">
                  <Instagram />
                </Button>
              </Link>
              <Link href="https://www.youtube.com/channel/UCiWqrA-vRBjOKG7rCn-7vDQ" target="_blank">
                <Button variant="ghost" size="icon">
                  <Youtube />
                </Button>
              </Link>
              <Link href="https://www.facebook.com/colombiatours97" target="_blank">
                <Button variant="ghost" size="icon">
                  <Facebook />
                </Button>
              </Link>
              <Link href="https://wa.me/+573226014919" target="_blank">
                <Button variant="ghost" size="icon">
                  <Phone />
                </Button>
              </Link>
            </div>
          </div>
          <div className="cols-span-1 rounded-xl  ">
            <Image
              unoptimized
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-60 lg:h-96 object-cover rounded-lg"
              src="/home4.jpg"
              alt="kolumbia"
            />
          </div>
          <div className="flex space-x-4 lg:hidden ">
            <Link href="https://www.instagram.com/colombiatours97" target="_blank">
              <Button variant="ghost" size="icon">
                <Instagram />
              </Button>
            </Link>
            <Link href="https://www.youtube.com/channel/UCiWqrA-vRBjOKG7rCn-7vDQ" target="_blank">
              <Button variant="ghost" size="icon">
                <Youtube />
              </Button>
            </Link>
            <Link href="https://www.facebook.com/colombiatours97" target="_blank">
              <Button variant="ghost" size="icon">
                <Facebook />
              </Button>
            </Link>
            <Link href="https://wa.me/+573226014919" target="_blank">
              <Button variant="ghost" size="icon">
                <Phone />
              </Button>
            </Link>
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
