import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, FileText, Camera, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroBanner from "@/components/hero-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <div className="container space-y-10 lg:space-y-32 mt-10 lg:mt-32">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 items-center ">
          <div className="col-span-1 items-center space-y-2 lg:space-y-6 max-w-none">
            <h2>Utazz Kolumbia specialistájával</h2>
            <p>
              A Colombia Tours 97 a kolumbiai autentikus kalandtúrák és körutazások specialistája, a
              legjobb túrákat kínáljuk a dél-amerikai országban. Fedezd fel velünk Kolumbia
              lenyűgöző tájait és kulturális kincseit!
            </p>
            <Button asChild className="items-center">
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
                className="w-full h-96 object-cover rounded-lg"
                src="/kep.jpg"
              />
            </div>
            <div className="col-span-1 flex mt-4 lg:mt-10">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-96 object-cover rounded-lg"
                src="/kep.jpg"
              />
            </div>
          </div>
        </section>
        <section className=" grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 items-center">
          <div className="cols-span-1 h-96 rounded-xl order-last lg:order-first">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-96 object-cover rounded-lg"
              src="/kep.jpg"
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
        <section className="space-y-2 lg:space-y-6 px-4 sm:px-0">
          <div className="flex flex-col space-y-6 max-w-none mx-auto text-start sm:text-center ">
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
                className="bg-gradient-to-b from-white to-[#fbfbfb] dark:bg-gradient-to-b from-[#1e1e1e] to-[#121212]"
              >
                <CardHeader>
                  <CardTitle>
                    {item.icon}
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>{item.subtitle}</CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

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
