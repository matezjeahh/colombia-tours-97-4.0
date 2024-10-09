import React from "react";
import BlogPostCard from "@/components/BlogPostCard";
import matter from "gray-matter";

async function getPosts() {
  const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/public`;

  const response = await fetch(GITHUB_API_URL, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
    next: { revalidate: 60 }, // Revalidate every minute
  });

  const files = await response.json();
  const mdxFiles = files.filter((file) => file.name.endsWith(".mdx"));

  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      const content = await fetch(file.download_url).then((res) => res.text());
      const { data } = matter(content);
      return {
        ...data,
        slug: file.name.replace(/\.mdx$/, ""),
        image: data.image || null, // Include the image URL from frontmatter
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
