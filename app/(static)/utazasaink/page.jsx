import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, CalendarDays, Map, Ticket, Landmark, Gauge, TicketX } from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getDocumentData } from "@/firebase-functions";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";
export default async function Homee({ params }) {
  const { id } = params;
  const post = await getDocumentData("adatok", "utazasaink");

  return (
    <div className="container space-y-4 lg:space-y-6 my-5">
      <div className=" space-y-2 ">
        <h1 className="text-center">Utazásaink</h1>
        <p className="lg:text-center">
          Kolumbiának rengeteg látnivalója van, ezért érdemes egy vagy két kisebb régiót választani
          az utazáshoz, hogy élvezetes legyen és ne túlságosan fárasztó. Az oldalunkon különféle
          körutazásokat is talál, melyek segíthetnek a tervezésben.
        </p>
        <p>
          {" "}
          Kolumbiába látogatóknak javasoljuk, hogy kezdjék az északi régióval, ahol a legtöbb
          turisztikai látványosság található, és kínálunk kevésbé megerőltető programokat is. Az
          aktív pihenést és hegyi kirándulásokat kedvelőknek a középső és déli részét ajánljuk, ahol
          extrém kalandokat és tengerparti pihenést is kínálunk.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {post.utak.map((item) => (
          <Card key={item.id} className="flex flex-col justify-between h-full overflow-hidden">
            <Image
              alt="Product image"
              className="h-60 w-full object-cover rounded-t-lg"
              height={0}
              width={0}
              sizes="100vw"
              src="/kep.jpg"
            />
            <CardHeader>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Map size={20} className="mr-2" />
                  <span className="uppercase text-sm font-semibold">{item.taj}</span>
                </div>
                {item.nepszeru && <Badge variant="approve">Népszerű túra</Badge>}
              </div>
              <CardTitle className="!mt-3">{item.cim}</CardTitle>
              <CardDescription>{item.leiras}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center">
                <Gauge size={20} className="mr-2" />
                {item.nehezseg === 0 && <Badge>Könnyű</Badge>}
                {item.nehezseg === 1 && <Badge>Közepes</Badge>}
                {item.nehezseg === 2 && <Badge>Nehéz</Badge>}
              </div>
              <div className="flex items-center ">
                <CalendarDays size={20} className="mr-2" />
                <p className="text-sm font-medium leading-none !mt-0">
                  {item.datum.kezdo.toDate().toLocaleDateString()} -{" "}
                  {item.datum.veg.toDate().toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center ">
                {item.szabad === 0 ? (
                  <TicketX size={20} className="mr-2" />
                ) : (
                  <Ticket size={20} className="mr-2" />
                )}
                {item.szabad === 0 ? (
                  <p className="text-sm font-medium">A túra betelt, nincs több szabad hely </p>
                ) : (
                  <p className="text-sm font-medium">{item.szabad} szabad hely maradt még</p>
                )}
              </div>
              <div className="flex items-center">
                <DollarSign size={20} className="mr-2" />
                <p className="text-sm font-medium">{item.ar} USD/fő</p>
              </div>
              <div className="flex items-center ">
                <Landmark size={20} className="mr-2" />
                <p className="text-sm font-medium">Medellín, Bogotá, Cartagena</p>
              </div>
            </CardContent>
            <CardFooter className="justify-end mt-auto">
              <Button asChild variant="default" className="items-center w-full">
                <Link href={`utazasaink/${item.slug}`}>Részletek</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-8">
        {post.utak.map((item) => (
          <Card key={item.id} className="flex flex-col justify-between h-full overflow-hidden">
            <Image
              alt="Product image"
              className="h-60 w-full object-cover rounded-t-lg"
              height={0}
              width={0}
              sizes="100vw"
              src="/kep.jpg"
            />
            <CardHeader>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Map size={20} className="mr-2" />
                  <span className="uppercase text-sm font-semibold">{item.taj}</span>
                </div>
                {item.nepszeru && <Badge variant="approve">Népszerű túra</Badge>}
              </div>
              <CardTitle className="!mt-3">{item.taj}</CardTitle>
              <CardDescription>{item.leiras}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center">
                <Gauge size={20} className="mr-2" />
                {item.nehezseg === 0 && <Badge>Könnyű</Badge>}
                {item.nehezseg === 1 && <Badge>Közepes</Badge>}
                {item.nehezseg === 2 && <Badge>Nehéz</Badge>}
              </div>
              <div className="flex items-center ">
                <CalendarDays size={20} className="mr-2" />
                <p className="text-sm font-medium leading-none !mt-0">
                  {item.datum.kezdo.toDate().toLocaleDateString()} -{" "}
                  {item.datum.veg.toDate().toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center ">
                {item.szabad === 0 ? (
                  <TicketX size={20} className="mr-2" />
                ) : (
                  <Ticket size={20} className="mr-2" />
                )}
                {item.szabad === 0 ? (
                  <p className="text-sm font-medium">A túra betelt, nincs több szabad hely </p>
                ) : (
                  <p className="text-sm font-medium">{item.szabad} szabad hely maradt még</p>
                )}
              </div>
              <div className="flex items-center">
                <DollarSign size={20} className="mr-2" />
                <p className="text-sm font-medium">{item.ar} USD/fő</p>
              </div>
              <div className="flex items-center ">
                <Landmark size={20} className="mr-2" />
                <p className="text-sm font-medium">Medellín, Bogotá, Cartagena</p>
              </div>
            </CardContent>
            <CardFooter className="justify-end mt-auto">
              <Button asChild variant="default" className="items-center w-full">
                <Link href={`utazasaink/${item.slug}`}>Részletek</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
