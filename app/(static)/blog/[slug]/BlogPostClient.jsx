"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BlogPostClient({ frontMatter, slug }) {
  console.log(frontMatter.facebookLink);
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
      <div>
        {frontMatter.image && (
          <div className="relative w-full h-64 md:h-96">
            <img
              src={frontMatter.image}
              alt={frontMatter.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <div className="flex justify-end ">
          <Button asChild variant="link" className="underline">
            <a
              href={
                frontMatter.facebookLink.startsWith("http")
                  ? frontMatter.facebookLink
                  : `https://${frontMatter.facebookLink}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              Kattints a további képekért
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}
