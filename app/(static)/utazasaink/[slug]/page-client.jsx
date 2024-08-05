"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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

  const dateRange = {
    from: new Date(post.datum.kezdo),
    to: new Date(post.datum.veg),
  };
  const formattedFromDate = dateRange.from.toLocaleDateString("hu-HU"); // Adjust locale as necessary
  const formattedToDate = dateRange.to.toLocaleDateString("hu-HU");

  return (
    <div className="container space-y-6 my-5">
      <BreadcrumbNav props={post.cim} />
      <div className="">
        <h1 className="text-start">{post.cim}</h1>
        <p className="text-muted-foreground  text-base mb-2">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam, voluptatibus!
        </p>
        <Badge className="mr-3" variant="secondary">
          Lorem, ipsum.
        </Badge>
        <Badge className="mr-3" variant="secondary">
          Lorem, ipsum.
        </Badge>
        <Badge className="mr-3" variant="secondary">
          Lorem, ipsum.
        </Badge>
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
          <div className="bg-secondary text-secondary-foreground p-4  mb-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex items-center">
                <Gauge className="w-5 h-5 mr-2 text-blue-500" />
                <div>
                  <p className="text-sm font-semibold">A túra dátuma</p>
                  <p className="text-xs">
                    {formattedFromDate} - {formattedToDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Gauge className="w-5 h-5 mr-2 text-green-500" />
                <div>
                  <p className="text-sm font-semibold">A túra ára</p>
                  <p className="text-xs">{post.ar} USD/fő</p>
                </div>
              </div>
              <div className="flex items-center">
                <Gauge className="w-5 h-5 mr-2 text-orange-500" />
                <div>
                  <p className="text-sm font-semibold">Indulás helyszíne</p>
                  <p className="text-xs">Bogota</p>
                </div>
              </div>
              <div className="flex items-center">
                <Gauge className="w-5 h-5 mr-2 text-purple-500" />
                <div>
                  <p className="text-sm font-semibold">A túra nehézsége</p>
                  <p className="text-xs">könnyű</p>
                </div>
              </div>
              <div className="flex items-center">
                <Gauge className="w-5 h-5 mr-2 text-red-500" />
                <div>
                  <p className="text-sm font-semibold">Group Size</p>
                  <p className="text-xs">Max asd people</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="space-y-6 ">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto voluptas
                obcaecati vero facere quod voluptates cumque recusandae debitis animi ducimus
                itaque, soluta quam iusto fugiat neque eveniet! Delectus, beatae alias a earum totam
                deserunt vitae sed necessitatibus mollitia, quibusdam explicabo.
              </p>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga placeat corrupti
                quisquam obcaecati alias, praesentium dolores nostrum soluta eaque quasi ut.
                Aspernatur saepe quam, facilis animi soluta corporis, corrupti quas sit voluptates
                ab dolor quos nostrum dignissimos consequuntur earum alias error laboriosam beatae
                eligendi iste, nobis accusamus. Ut, iusto et!
              </p>
            </div>
          </div>
          <div className=" flex flex-col lg:hidden space-y-1">
            <h2>Részletek</h2>
            <div className="flex items-center space-x-2">
              <Gauge size={20} />
              <p className="font-medium">Túra nehézsége:</p>
              <p className="font-medium text-muted-foreground">könnyű</p>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarDays size={20} />
              <p className="font-medium">Dátum:</p>
              <p className="font-medium text-muted-foreground">
                {formattedFromDate}-{formattedToDate}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign size={20} />
              <p className="font-medium">Túra ára:</p>
              <p className="font-medium text-muted-foreground">{post.ar}</p>
            </div>
            <div className="flex items-center space-x-2">
              <MapPinIcon size={20} />
              <p className="font-medium">Indulás helye:</p>
              <p className="font-medium text-muted-foreground">Bogota</p>
            </div>
            <Accordion type="single" collapsible className="lg:hidden">
              <AccordionItem value="item-1">
                <AccordionTrigger>Az ár tartalmazza</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-none space-y-2">
                    {post.tartalmaz.map((item, index) => (
                      <li key={index} className="flex items-start  ">
                        <span>
                          <CircleCheck size={20} className="text-green-400 mr-2" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Az ár nem tertalmazza</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-none space-y-2">
                    {post.nem_tartalmaz.map((item, index) => (
                      <li key={index} className="flex items-start leading-7">
                        <span className="mt-1 bg-red-400 text-white rounded-full  mr-2">
                          <XCircle size={20} className="" />
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
                  Érdekli ez az túra?
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
                      <CircleCheck size={20} className="text-green-400 mr-2" />
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
                      <XCircle size={20} className="text-red-400 mr-2" />
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
