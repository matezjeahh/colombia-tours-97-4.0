"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LightBox from "@/components/lightbox";

export default function BlogPostClient({ frontMatter, slug }) {
  const slides = frontMatter.lightboxImages.map((image, index) => ({
    src: image,
    description: frontMatter.imageDescriptions[index] || "",
  }));

  return (
    <>
      <h1 className="text-4xl font-bold">{frontMatter.title}</h1>
      <div className="flex items-center justify-center gap-2">
        <Avatar className="w-8 h-8 border">
          <AvatarFallback>BS</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span>Bélafi Szilárd</span>
          <span className="text-xs text-muted-foreground">
            {new Date(frontMatter.date).toLocaleDateString("hu-HU", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {frontMatter.image && (
        <div className="relative w-full h-64 md:h-96 mb-8">
          <img
            src={frontMatter.image}
            alt={frontMatter.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <div className="flex justify-end">
        <LightBox variant={"link"} text={"További képek..."} slides={slides} />
      </div>
    </>
  );
}
