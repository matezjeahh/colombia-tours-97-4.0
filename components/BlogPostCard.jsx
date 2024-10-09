import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const BlogPostCard = ({ title, date, description, slug, image }) => {
  return (
    <div className="w-full max-w-md grid gap-4">
      <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
        <img
          src={image}
          alt={`Cover image for ${title}`}
          className="object-cover w-full h-full"
          width="400"
          height="300"
          style={{ aspectRatio: "400/300", objectFit: "cover" }}
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Avatar className="w-5 h-5 border">
              <AvatarImage src="/placeholder-user.jpg" alt="@username" />
              <AvatarFallback>BS</AvatarFallback>
            </Avatar>
            <span>Bélafi Szilárd</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <span>
            {new Date(date).toLocaleDateString("hu-HU", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <p className="text-muted-foreground">{description}</p>
        <Link href={`/blog/${slug}`} passHref>
          <Button variant="link" className="pl-0">
            Olvass tovább...
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BlogPostCard;
