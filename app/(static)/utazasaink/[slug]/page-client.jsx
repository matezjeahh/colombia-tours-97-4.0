"use client";
import React from "react";
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
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PageClient({ post }) {
  const dateRange = {
    from: new Date(post.datum.kezdo),
    to: new Date(post.datum.veg),
  };
  const formattedFromDate = dateRange.from.toLocaleDateString("hu-HU"); // Adjust locale as necessary
  const formattedToDate = dateRange.to.toLocaleDateString("hu-HU");
  const initialViewDate = new Date(post.datum.kezdo);

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

      <div className="grid grid-cols-4 gap-0 lg:gap-1 relative ">
        <Image
          height={0}
          width={0}
          sizes="100vw"
          src="/kep.jpg"
          className="col-span-4 lg:col-span-3 h-72 lg:h-[30rem] w-full object-cover rounded-lg lg:rounded-r-none lg:rounded-l-lg"
        />
        <div className="lg:col-span-1 grid grid-cols-1 gap-0 lg:gap-1">
          <div className="bg-black w-full h-auto rounded-tr-lg"></div>
          <div className="bg-yellow-100 w-full h-auto rounded-br-lg"></div>
        </div>
        <LightBox className="absolute bottom-3 right-3" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 ">
        <div className="col-span-4 sm:col-span-3 space-y-6">
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
          <div className=" flex flex-col space-y-1">
            <h3>Részletek</h3>
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
            <Accordion type="single" collapsible>
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
                      <li key={index} className="flex items-start  ">
                        <span>
                          <XCircle size={20} className="text-red-400 mr-2" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2">
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
        <div className=" col-span-4 lg:col-span-1 h-fit space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Az ár tartalmazza</CardTitle>
              {post.tartalmaz.map((item, index) => (
                <CardDescription key={index} className="flex">
                  <span>
                    <CircleCheck size={20} className="text-green-400 mr-2" />
                  </span>
                  {item}
                </CardDescription>
              ))}
            </CardHeader>
            <CardHeader>
              <CardTitle>Az ár nem tartalmazza</CardTitle>
            </CardHeader>
            {post.nem_tartalmaz.map((item, index) => (
              <CardContent key={index}>{item}</CardContent>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
