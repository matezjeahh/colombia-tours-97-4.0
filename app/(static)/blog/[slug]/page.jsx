import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import BlogPostClient from "./BlogPostClient";

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

export async function generateStaticParams() {
  const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/public/blog`;

  // Fetch the list of folders in the 'blog' directory
  const response = await fetch(GITHUB_API_URL, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
  });

  const folders = await response.json();

  // Now, map through the folders and fetch the .mdx files within each folder
  const slugs = await Promise.all(
    folders
      .filter((folder) => folder.type === "dir") // Ensure it's a directory
      .map(async (folder) => {
        const folderUrl = `${GITHUB_API_URL}/${folder.name}`;

        const folderResponse = await fetch(folderUrl, {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
        });

        const folderContents = await folderResponse.json();

        // Find the .mdx file in the folder (we don't use it in the slug, just ensure it exists)
        const mdxFile = folderContents.find((file) => file.name.endsWith(".mdx"));

        // Only return the slug based on the folder name if an .mdx file is present
        if (mdxFile) {
          return {
            slug: folder.name, // Only the folder name as the slug
          };
        }
      })
  );

  // Filter out any undefined values (in case a folder doesn't have an .mdx file)
  return slugs.filter(Boolean);
}

export default async function BlogPost({ params }) {
  const { content, frontMatter } = await getPost(params.slug);

  return (
    <div className="container max-w-5xl py-8 space-y-8">
      <BlogPostClient frontMatter={frontMatter} slug={params.slug} />
      <div className="prose dark:prose-invert lg:prose-xl max-w-none">
        <MDXRemote source={content} />
      </div>
      {/* Server-side rendered related posts component */}
      <h3>További cikkek</h3>
      <div className="grid grid-cols-3 gap-10">
        {/* Add server-side logic for fetching and rendering related posts */}
      </div>
    </div>
  );
}
