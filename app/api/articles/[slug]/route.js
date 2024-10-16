// app/api/articles/[slug]/route.js
import matter from "gray-matter";

const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/public/blog`;

async function fetchFile(url) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
    next: { revalidate: 60 },
  });
  return response.json();
}

export async function GET(request, { params }) {
  const { slug } = params;

  try {
    const folderUrl = `${GITHUB_API_URL}/${slug}`;
    const folderContents = await fetchFile(folderUrl);

    const mdxFile = folderContents.find((file) => file.name.endsWith(".mdx"));
    if (!mdxFile) {
      return Response.json({ error: "Article not found" }, { status: 404 });
    }

    const content = await fetch(mdxFile.download_url).then((res) => res.text());
    const { data: frontmatter, content: bodyContent } = matter(content);

    const article = {
      slug,
      title: frontmatter.title || slug,
      date: frontmatter.date || null,
      description: frontmatter.description || "",
      image: frontmatter.image || null,
      lightboxImages: frontmatter.lightboxImages || [],
      imageDescriptions: frontmatter.imageDescriptions || [],
      content: bodyContent.trim(),
    };

    return Response.json(article);
  } catch (error) {
    console.error(`Error fetching article ${slug} from GitHub:`, error);
    return Response.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}
