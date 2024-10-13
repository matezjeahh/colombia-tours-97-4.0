import React from "react";
import dynamic from "next/dynamic";
import matter from "gray-matter";

const BlogPostCard = dynamic(() => import("@/components/BlogPostCard"), { ssr: false });

async function getPosts() {
  const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/public/blog`;

  async function fetchContents(url) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
      next: { revalidate: 60 },
    });
    return response.json();
  }

  async function traverseDirectory(url) {
    const contents = await fetchContents(url);
    let mdxFiles = [];

    for (const item of contents) {
      if (item.type === "dir") {
        const subDirFiles = await traverseDirectory(item.url);
        mdxFiles = [...mdxFiles, ...subDirFiles];
      } else if (item.name.endsWith(".mdx")) {
        mdxFiles.push(item);
      }
    }

    return mdxFiles;
  }

  const mdxFiles = await traverseDirectory(GITHUB_API_URL);

  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      const content = await fetch(file.download_url).then((res) => res.text());
      const { data } = matter(content);

      // Extract the folder name from the file path and use it as the slug
      const slug = file.path.split("/")[2]; // Assuming the path is "public/blog/{folder}/{file.mdx}"

      return {
        ...data,
        slug: slug, // Use only the folder name as the slug
        image: data.image || null,
      };
    })
  );

  return posts;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogPostCard
            key={post.slug}
            title={post.title}
            date={post.date}
            description={post.description}
            slug={post.slug}
            image={post.image}
          />
        ))}
      </div>
    </div>
  );
}
