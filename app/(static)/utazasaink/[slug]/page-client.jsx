"use client";
import { Viewport } from "next";
import Head from "next/head";
import React, { useState } from "react";
import Image from "next/image";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { CircleCheck, MailPlus } from "lucide-react";
import { DrawerDialogForm } from "@/components/drawer-dialog-form";
import LightBox from "@/components/lightbox";
import { Calendar } from "@/components/ui/calendar";

export default function PageClient({ post }) {
  //DrawerDialog state
  const [open, setOpen] = useState(false);

  //Date
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
      <h1 className="text-start">{post.cim}</h1>
      <div className="grid grid-cols-4 gap-1 relative ">
        <Image
          height={0}
          width={0}
          sizes="100vw"
          src="/kep.jpg"
          className="col-span-4 lg:col-span-3 h-72 lg:h-[30rem] w-full object-cover rounded-lg lg:rounded-r-none lg:rounded-l-lg"
        />
        <div className="lg:col-span-1 grid grid-cols-1 gap-1">
          <div className="bg-black w-full h-auto rounded-tr-lg"></div>
          <div className="bg-teal-400 w-full h-auto rounded-br-lg"></div>
        </div>
        <LightBox className="absolute bottom-3 right-3" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 ">
        <div className="col-span-4 sm:col-span-3 space-y-6">
          <div className="space-y-2">
            <h2>Leírás</h2>
            <div className="space-y-6">
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
                <DrawerDialogForm open={open} onOpenChange={setOpen} title={post.cim} />
              </CardFooter>
            </Card>
            <Calendar
              mode="range"
              selected={dateRange}
              defaultMonth={initialViewDate}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <h2>Program</h2>
            <div className="space-y-6">
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
