// lib/posts.js
import { getDocumentData } from "@/firebase-functions";

export async function generateStaticParams() {
  const posts = await getDocumentData("adatok", "utazasaink");
  return posts.utak.map((post) => ({
    slug: post.slug,
  }));
}

export async function getPostData(slug) {
  const posts = await getDocumentData("adatok", "utazasaink");
  return posts.utak.find((post) => post.slug === slug);
}
