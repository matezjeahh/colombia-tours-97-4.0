import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getPost(slug) {
  const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/public/${slug}.mdx`;

  const response = await fetch(GITHUB_API_URL, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
    next: { revalidate: 60 }, // Revalidate every minute
  });

  const file = await response.json();
  const fileContent = await fetch(file.download_url).then((res) => res.text());

  const { content, data } = matter(fileContent);

  return { content, frontMatter: data };
}

export async function generateStaticParams() {
  const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/public`;

  const response = await fetch(GITHUB_API_URL, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
  });

  const files = await response.json();
  return files
    .filter((file) => file.name.endsWith(".mdx"))
    .map((file) => ({
      slug: file.name.replace(/\.mdx$/, ""),
    }));
}

export default async function BlogPost({ params }) {
  const { content, frontMatter } = await getPost(params.slug);

  return (
    <div className="container max-w-5xl py-8 space-y-8">
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
      <div className="prose dark:prose-invert lg:prose-xl max-w-none">
        <MDXRemote source={content} />
      </div>
      <h3>További cikkek</h3>
      <div className="grid grid-cols-3 gap-10">
        <div className="col-span-1 bg-muted rounded-lg overflow-hidden">
          <Image
            src={"/images/Wallpaper.jpg"}
            alt="asd"
            width={400}
            height={250}
            className="object-cover w-full h-56"
          />
          <div className="p-4 space-y-4">
            <h3 className="text-lg line-clamp-2 font-semibold">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt molestias ducimus
              unde. Porro iste vel inventore veritatis, consequatur dignissimos molestiae?
            </h3>
            <p className="text-sm line-clamp-3 text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci error doloremque est
              iure ex voluptatum sunt dolorem eveniet possimus architecto. Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Adipisci error doloremque est iure ex voluptatum
              sunt dolorem eveniet possimus architecto.
            </p>
            <Link href={"/"} passHref>
              <Button variant="link" className="pl-0">
                Olvass tovább...
              </Button>
            </Link>
          </div>
        </div>
        <div className="col-span-1 bg-muted rounded-lg overflow-hidden">
          <Image
            src={"/kep.jpg"}
            alt="asd"
            width={400}
            height={250}
            className="object-cover w-full h-56"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">asd</h3>
            <p className="text-sm text-gray-600">asfsdagfs</p>
            <a href="#" className="inline-block mt-2 text-blue-500 hover:underline">
              Read Full Story
            </a>
          </div>
        </div>
        <div className="col-span-1 bg-muted rounded-lg overflow-hidden">
          <Image
            src={"/kep.jpg"}
            alt="asd"
            width={400}
            height={250}
            className="object-cover w-full h-56"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">asd</h3>
            <p className="text-sm text-gray-600">sfsdagfs</p>
            <a href="#" className="inline-block mt-2 text-blue-500 hover:underline">
              Read Full Story
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
