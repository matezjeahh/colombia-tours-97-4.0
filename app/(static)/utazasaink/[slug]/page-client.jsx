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

const TourInfoItem = ({ icon: Icon, title, value }) => (
  <div className="flex flex-col space-y-1">
    <div className="flex items-center">
      <Icon size={20} className="mr-2" />
      <p className="text-sm font-semibold">{title}</p>
    </div>
    <p className="text-xs ml-7">{value}</p>
  </div>
);

const ListItem = ({ icon: Icon, text, iconColor }) => (
  <li className="flex items-start leading-7">
    <span>
      <Icon
        size={20}
        strokeWidth={2.5}
        className={`mr-2 mt-1.5 fill-current ${iconColor} stroke-white`}
      />
    </span>
    {text}
  </li>
);

const TourInfoSection = ({ post }) => (
  <div className="bg-secondary text-secondary-foreground p-4 mb-6 rounded-lg shadow-sm">
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <TourInfoItem
        icon={CalendarDays}
        title="A túra dátuma"
        value={`${post.datum.kezdo} - ${post.datum.veg}`}
      />
      <TourInfoItem icon={DollarSign} title="A túra ára" value={`${post.ar} USD/fő`} />
      <TourInfoItem icon={MapPinIcon} title="Indulás helyszíne" value="Bogota" />
      <TourInfoItem
        icon={Gauge}
        title="A túra nehézsége"
        value={post.nehezseg === 0 ? "Könnyű" : post.nehezseg === 1 ? "Közepes" : "Nehéz"}
      />
    </div>
  </div>
);

const TourDescription = ({ post }) => (
  <div className="space-y-2">
    <div className="space-y-6">
      <p>{post.utleiras}</p>
      <p className="hidden lg:flex">{post.ajanlas}</p>
      <p>{post.hosszabbitas}</p>
    </div>
  </div>
);

const MobileAccordion = ({ post }) => (
  <Accordion type="single" collapsible className="lg:hidden">
    <AccordionItem value="item-1">
      <AccordionTrigger>Kiknek ajáljuk?</AccordionTrigger>
      <AccordionContent>
        <p>{post.ajanlas}</p>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger>Az ár tartalmazza</AccordionTrigger>
      <AccordionContent>
        <ul className="list-none space-y-2">
          {post.tartalmaz.map((item, index) => (
            <ListItem key={index} icon={CircleCheck} text={item} iconColor="text-green-400" />
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-3">
      <AccordionTrigger>Az ár nem tartalmazza</AccordionTrigger>
      <AccordionContent>
        <ul className="list-none space-y-2">
          {post.nem_tartalmaz.map((item, index) => (
            <ListItem key={index} icon={XCircle} text={item} iconColor="text-red-400" />
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

const TourProgram = ({ program }) => (
  <div className="space-y-2">
    <h2>Program</h2>
    <div className="space-y-6">
      {program.map((item, index) => (
        <div key={index} className="space-y-2">
          <h3 className="text-lg">{index + 1}. Nap</h3>
          <p>{item}</p>
        </div>
      ))}
    </div>
  </div>
);

const InquiryCard = ({ title }) => (
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
      Ha érdekli ez a túra, kérjük, vegye fel velünk a kapcsolatot további információkért és
      foglalásért.
    </CardContent>
    <CardFooter>
      <DrawerDialogForm title={title} />
    </CardFooter>
  </Card>
);

const PriceInfoCard = ({ tartalmaz, nem_tartalmaz }) => (
  <Card>
    <CardHeader>
      <CardTitle>Az ár tartalmazza</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="list-none space-y-2">
        {tartalmaz.map((item, index) => (
          <ListItem key={index} icon={CircleCheck} text={item} iconColor="text-green-400" />
        ))}
      </ul>
    </CardContent>
    <CardHeader>
      <CardTitle>Az ár nem tartalmazza</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="list-none space-y-2">
        {nem_tartalmaz.map((item, index) => (
          <ListItem key={index} icon={XCircle} text={item} iconColor="text-red-400" />
        ))}
      </ul>
    </CardContent>
  </Card>
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

        // Adjust the filtering to handle folder names consistently
        const images = allKeys
          .filter((key) => key.startsWith(`./${post.id}/`))
          .map((key) => ({
            src: key.replace("./", "/"), // Removes the './' regardless of the folder name length
          }));

        console.log("Filtered images:", images);

        setSlides(images);
      } catch (error) {
        console.error("Error importing images:", error);
      }
    };

    importImages();
  }, [post.id]);

  return (
    <div className="container space-y-6 md:space-y-8 lg:space-y-8 my-5">
      <BreadcrumbNav props={post.cim} />
      <div className="">
        <h1 className="text-start">{post.cim}</h1>
        <p className="text-muted-foreground text-base mb-2">{post.alcim}</p>
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
          {slides.slice(1, 3).map((slide, index) => (
            <div key={index} className="flex-1">
              <OptimizedImage
                src={slide.src}
                alt={`Tour image ${index + 2}`}
                className={index === 0 ? "rounded-tr-lg" : "rounded-br-lg"}
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-3 right-3 z-10">
          <LightBox slides={slides} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="col-span-4 sm:col-span-3 space-y-6">
          <TourInfoSection post={post} />
          <TourDescription post={post} />
          <div className="flex flex-col lg:hidden space-y-1">
            <MobileAccordion post={post} />
          </div>
          <div className="grid grid-cols-1 lg:hidden lg:grid-cols-2">
            <InquiryCard title={post.cim} />
          </div>
          <TourProgram program={post.program} />
        </div>
        <div className="hidden lg:block lg:col-span-1 h-fit space-y-6">
          <InquiryCard title={post.cim} />
          <PriceInfoCard tartalmaz={post.tartalmaz} nem_tartalmaz={post.nem_tartalmaz} />
        </div>
      </div>
    </div>
  );
}
