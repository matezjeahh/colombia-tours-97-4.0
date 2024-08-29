import React from "react";
import { getDocumentData } from "@/firebase-functions";
import PageClient from "./page-client";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `https://${process.env.NEXT_PUBLIC_VERCEL_URL || "your-default-domain.com"}`;
}

export async function generateStaticParams() {
  const posts = await getDocumentData("adatok", "utazasaink");

  return posts.utak.map((post) => ({
    slug: post.slug,
  }));
}

async function getPostData(slug) {
  const posts = await getDocumentData("adatok", "utazasaink");
  return posts.utak.find((post) => post.slug === slug);
}

async function getFirstImage(postId) {
  try {
    const dirPath = path.join(process.cwd(), "public", postId.toString());
    const files = await fs.readdir(dirPath);
    const imageFiles = files.filter((file) => /\.(png|jpe?g|svg)$/i.test(file));
    if (imageFiles.length > 0) {
      return `/${postId}/${imageFiles[0]}`;
    }
  } catch (error) {
    console.error("Error reading image directory:", error);
  }
  return null;
}

export async function generateMetadata({ params }) {
  const post = await getPostData(params.slug);

  if (!post) {
    return {
      title: "Tour Not Found",
      description: "The requested tour could not be found.",
    };
  }

  const firstImagePath = await getFirstImage(post.id);
  const baseUrl = getBaseUrl();

  return {
    metadataBase: new URL(baseUrl),
    title: `${post.cim} | Colombia Tours 97`,
    description: post.rovid_leiras,
    openGraph: {
      title: post.cim,
      description: post.rovid_leiras,
      images: firstImagePath
        ? [
            {
              url: firstImagePath,
              width: 1200,
              height: 630,
              alt: post.cim,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.cim,
      description: post.rovid_leiras,
      images: firstImagePath ? [firstImagePath] : [],
    },
  };
}

export default async function Page({ params }) {
  const { slug } = params;
  const post = await getPostData(slug);
  console.log(post);

  if (!post) {
    return <div>Post not found</div>;
  }

  return <PageClient post={post} />;
}
