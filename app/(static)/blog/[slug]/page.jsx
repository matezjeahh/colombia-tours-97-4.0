import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import BlogPostClient from "./BlogPostClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getPost(slug) {
  const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/public/blog/${slug}/${slug}.mdx`;

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

async function getAllPosts() {
  const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/public/blog`;

  const response = await fetch(GITHUB_API_URL, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
  });

  const folders = await response.json();

  const posts = await Promise.all(
    folders
      .filter((folder) => folder.type === "dir")
      .map(async (folder) => {
        const { content, frontMatter } = await getPost(folder.name);
        return {
          slug: folder.name,
          title: frontMatter.title,
          description: frontMatter.description,
          image: frontMatter.image,
        };
      })
  );

  return posts;
}

function getRandomPosts(posts, count, currentSlug) {
  const filteredPosts = posts.filter((post) => post.slug !== currentSlug);
  const shuffled = filteredPosts.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }) {
  const { content, frontMatter } = await getPost(params.slug);
  const allPosts = await getAllPosts();
  const randomPosts = getRandomPosts(allPosts, 3, params.slug);

  return (
    <div className="container max-w-5xl py-8 space-y-8">
      <BlogPostClient frontMatter={frontMatter} slug={params.slug} />
      <div className="my-prose">
        <MDXRemote source={content} />
      </div>
      <h3>További cikkek</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {randomPosts.map((post) => (
          <div key={post.slug} className="col-span-1 bg-muted rounded-lg overflow-hidden">
            <img src={post.image} alt={post.title} className="object-cover w-full h-56" />
            <div className="p-4 space-y-4">
              <h3 className="text-lg line-clamp-2 font-semibold">{post.title}</h3>
              <p className="text-sm line-clamp-3 text-muted-foreground">{post.description}</p>
              <Link href={`/blog/${post.slug}`} passHref>
                <Button variant="link" className="pl-0">
                  Olvass tovább...
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
