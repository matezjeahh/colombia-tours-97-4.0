import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

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
    <div className="py-8">
      {frontMatter.image && (
        <div className="relative w-full h-64 md:h-96 mb-8">
          <Image
            src={frontMatter.image}
            alt={frontMatter.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="100vw"
          />
        </div>
      )}
      <h1 className="text-4xl font-bold mb-2">{frontMatter.title}</h1>
      <p className="text-muted-foreground mb-4">
        {new Date(frontMatter.date).toLocaleDateString()}
      </p>
      <Separator className="my-4" />
      <div className="prose dark:prose-invert lg:prose-xl max-w-none">
        <MDXRemote source={content} />
      </div>
    </div>
  );
}
