"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  CalendarDays,
  CircleCheck,
  DollarSign,
  Gauge,
  MailPlus,
  MapPinIcon,
  XCircle,
} from "lucide-react";
import { DrawerDialogForm } from "@/components/drawer-dialog-form";
import LightBox from "@/components/lightbox";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const OptimizedImage = ({ src, alt, className, priority = false }) => (
  <div className={`relative w-full h-full overflow-hidden ${className}`}>
    <Image
      src={src}
      alt={alt}
      fill
      style={{ objectFit: "cover" }}
      sizes="(max-width: 768px) 100vw, 50vw"
      priority={priority}
    />
  </div>
);

export default function PageClient({ post }) {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const importImages = async () => {
      try {
        console.log("PageClient id:", post.id);

        if (post.id === null || post.id === undefined || isNaN(post.id)) {
          console.error("Invalid id:", post.id);
          return;
        }

        const context = require.context("/public", true, /\.(png|jpe?g|svg)$/);

        const allKeys = context.keys();
        console.log("All keys:", allKeys);

        const images = allKeys
          .filter((key) => key.startsWith(`./${post.id}/`))
          .map((key) => ({
            src: `/${post.id}${key.substring(3)}`,
          }));

        console.log("Filtered images:", images);

        setSlides(images);
      } catch (error) {
        console.error("Error importing images:", error);
      }
    };

    importImages();
  }, [post.id]);

  const formattedFromDate = post.datum.kezdo || "N/A";
  const formattedToDate = post.datum.veg || "N/A";

  return (
    <div className="container space-y-6 md:space-y-8 lg:space-y-8 my-5">
      <BreadcrumbNav props={post.cim} />
      <div className="">
        <h1 className="text-start">{post.cim}</h1>
        <p className="text-muted-foreground  text-base mb-2">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam, voluptatibus!
        </p>
        {post.cimke.map((item, index) => (
          <Badge key={index} className="mr-3" variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-1 relative h-[30rem]">
        {slides.length > 0 && (
          <div className="col-span-4 lg:col-span-3 h-full">
            <OptimizedImage
              src={slides[0].src}
              alt="Main tour image"
              className="rounded-lg lg:rounded-r-none lg:rounded-l-lg"
              priority
            />
          </div>
        )}
        <div className="hidden lg:flex lg:col-span-1 flex-col gap-1 h-full">
          {slides.length > 1 && (
            <div className="flex-1">
              <OptimizedImage
                src={slides[1].src}
                alt="Secondary tour image"
                className="rounded-tr-lg"
              />
            </div>
          )}
          {slides.length > 2 && (
            <div className="flex-1">
              <OptimizedImage
                src={slides[2].src}
                alt="Tertiary tour image"
                className="rounded-br-lg"
              />
            </div>
          )}
        </div>
        <div className="absolute bottom-3 right-3 z-10">
          <LightBox slides={slides} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 ">
        <div className="col-span-4 sm:col-span-3 space-y-6">
          <div className="bg-secondary text-secondary-foreground p-4 mb-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center">
                  <CalendarDays size={20} className="mr-2" />
                  <p className="text-sm font-semibold">A túra dátuma</p>
                </div>
                <p className="text-xs ml-7">
                  {formattedFromDate} - {formattedToDate}
                </p>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center">
                  <DollarSign size={20} className="mr-2" />
                  <p className="text-sm font-semibold">A túra ára</p>
                </div>
                <p className="text-xs ml-7">{post.ar} USD/fő</p>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center">
                  <MapPinIcon size={20} className="mr-2" />
                  <p className="text-sm font-semibold">Indulás helyszíne</p>
                </div>
                <p className="text-xs ml-7">Bogota</p>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center">
                  <Gauge size={20} className="mr-2" />
                  <p className="text-sm font-semibold">A túra nehézsége</p>
                </div>
                <p className="text-xs ml-7">könnyű</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="space-y-6 ">
              <p>
                Egy olyan intenzív körutazásról van szó, ahol első kézből kapsz betekintést a Karib­
                térség mindennapi életébe, megcsodálva a térség legszebb természeti csodáit, mindezt
                a lehető legautentikusabb módon, dzsungeltúrával, helyi gasztronómiával és
                folklórral fűszerezve. Betekintést ad Kolumbia legszínesebb indián kultúrája, a
                Wayúu életébe, az Alta Guajira sivatag extrém világába, a Sierra Nevada
                magasságaiba, a Tayrona Nemzeti park legszebb strandjain keresztül az édes-sós
                lagúnák élővilágába, mindezt a festői szépség Cartagenában zárva. Sok időt töltünk a
                természetben, de városnézésből, történelemből sincs hiány.
              </p>
              <p className="hidden lg:flex">
                Ezt az utunkat minden olyan utazónak ajánljuk, aki egy autentikus körutazás keretein
                belül szeretné megismerni a Karib-térség sokszínű világát, a mindennapi életet,
                nyitott egy teljesen más kultúra megismerésére, de csak két hete van rá. Mindezt
                privát terepjáróval, így minden korosztály számára nyugodt szívvel ajánlom. Aktív,
                programdús körutazás sok strandolási lehetőséggel végig meleg éghajlaton,
                megterhelőbb gyalogtúra nélkül. Egy-két programot kihagyva kifejezetten családbarát
                körutazás, idősebb utazóinknak is ajánljuk.
              </p>
              <p>
                Igény esetén az utazás meghosszabbítható tengerparti pihenéssel Cartagenában, vagy a
                Tayrona térségében, illetve spirituális elvonulással is a Sierra Nevada
                dzsungeleiben. Részletekért érdeklődj a Szervezőnél!
              </p>
            </div>
          </div>
          <div className=" flex flex-col lg:hidden space-y-1">
            <Accordion type="single" collapsible className="lg:hidden">
              <AccordionItem value="item-1" className="lg:hidden">
                <AccordionTrigger>Kiknek ajáljuk?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Ezt az utunkat minden olyan utazónak ajánljuk, aki egy autentikus körutazás
                    keretein belül szeretné megismerni a Karib-térség sokszínű világát, a mindennapi
                    életet, nyitott egy teljesen más kultúra megismerésére, de csak két hete van rá.
                    Mindezt privát terepjáróval, így minden korosztály számára nyugodt szívvel
                    ajánlom. Aktív, programdús körutazás sok strandolási lehetőséggel végig meleg
                    éghajlaton, megterhelőbb gyalogtúra nélkül. Egy-két programot kihagyva
                    kifejezetten családbarát körutazás, idősebb utazóinknak is ajánljuk.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Az ár tartalmazza</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-none space-y-2">
                    {post.tartalmaz.map((item, index) => (
                      <li key={index} className="flex items-start leading-7 ">
                        <span>
                          <CircleCheck
                            size={20}
                            strokeWidth={2.5}
                            className="mr-2 mt-1.5 fill-current text-green-400 stroke-white"
                          />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Az ár nem tartalmazza</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-none space-y-2">
                    {post.nem_tartalmaz.map((item, index) => (
                      <li key={index} className="flex items-start ">
                        <span>
                          <XCircle
                            size={20}
                            strokeWidth={2.5}
                            className="mr-2 mt-0.5 fill-current text-red-400 stroke-white"
                          />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="grid grid-cols-1 lg:hidden lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex">
                  <span>
                    <MailPlus className="mr-2" />
                  </span>{" "}
                  Érdekli ez a túra?
                </CardTitle>
              </CardHeader>
              <CardContent>
                Ha érdekli ez a túra, kérjük, vegye fel velünk a kapcsolatot további információkért
                és foglalásért.
              </CardContent>
              <CardFooter>
                <DrawerDialogForm title={post.cim} />
              </CardFooter>
            </Card>
          </div>
          <div className="space-y-2">
            <h2>Program</h2>
            <div className="space-y-6 ">
              {post.program.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-lg">{index + 1}. Nap</h3>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className=" hidden lg:block lg:col-span-1 h-fit space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex">
                <span>
                  <MailPlus className="mr-2" />
                </span>{" "}
                Érdekli ez az túra?
              </CardTitle>
            </CardHeader>
            <CardContent>
              Ha érdekli ez a túra, kérjük, vegye fel velünk a kapcsolatot további információkért és
              foglalásért.
            </CardContent>
            <CardFooter>
              <DrawerDialogForm title={post.cim} />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Az ár tartalmazza</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-none space-y-2">
                {post.tartalmaz.map((item, index) => (
                  <li key={index} className="flex items-start leading-5">
                    <span>
                      <CircleCheck
                        size={20}
                        strokeWidth={2.5}
                        className="mr-2 fill-current text-green-400 stroke-white"
                      />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardHeader>
              <CardTitle>Az ár nem tartalmazza</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-none space-y-2">
                {post.nem_tartalmaz.map((item, index) => (
                  <li key={index} className="flex items-start leading-5">
                    <span>
                      <XCircle
                        size={20}
                        strokeWidth={2.5}
                        className="mr-2 fill-current text-red-400 stroke-white"
                      />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
