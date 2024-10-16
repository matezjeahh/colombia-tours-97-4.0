// app/api/articles/route.js
import matter from "gray-matter";

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

export async function GET() {
  try {
    const mdxFiles = await traverseDirectory(GITHUB_API_URL);

    const articles = await Promise.all(
      mdxFiles.map(async (file) => {
        const content = await fetch(file.download_url).then((res) => res.text());
        const { data } = matter(content);

        // Extract the folder name from the file path and use it as the slug
        const slug = file.path.split("/")[2]; // Assuming the path is "public/blog/{folder}/{file.mdx}"

        return {
          ...data,
          slug: slug,
          title: data.title || slug,
          date: data.date || null,
        };
      })
    );

    // Sort articles by date (most recent first)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    return Response.json(articles);
  } catch (error) {
    console.error("Error fetching articles from GitHub:", error);
    return Response.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
