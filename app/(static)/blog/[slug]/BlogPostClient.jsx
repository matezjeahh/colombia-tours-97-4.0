"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LightBox from "@/components/lightbox";

export default function BlogPostClient({ frontMatter, slug }) {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const importImages = async () => {
      try {
        console.log("BlogPostClient slug:", slug);

        if (!slug) {
          console.error("Invalid slug:", slug);
          return;
        }

        // Adjust path to match your folder structure
        const context = require.context(
          "/app/(static)/blog/lightbox-images",
          true,
          /\.(png|jpe?g|svg)$/ // Handles jpg, jpeg, png, svg
        );

        const allKeys = context.keys();
        console.log("All keys:", allKeys);

        // Filter and map through the images to match the slug folder
        const images = allKeys
          .filter((key) => key.startsWith(`./${slug}/`)) // Filter for the current slug
          .map((key) => ({
            // Correcting the path to match how the app is serving them
            src: `/blog/lightbox-images${key.replace(".", "")}`,
            alt: key.split("/").pop().split(".")[0], // Filename without extension as alt text
          }));

        setSlides(images);
      } catch (error) {
        console.error("Error importing images or descriptions:", error);
      }
    };

    importImages();
  }, [slug]);

  return (
    <>
      <h1 className="text-4xl font-bold">{frontMatter.title}</h1>
      <div className="flex items-center justify-center gap-2 ">
        <Avatar className="w-8 h-8 border">
          <AvatarImage src="/placeholder-user.jpg" alt="@username" />
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
