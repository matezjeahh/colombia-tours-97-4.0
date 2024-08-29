import React from "react";
import { getDocumentData } from "@/firebase-functions";
import PageClient from "./page-client";

export const dynamic = "force-dynamic";

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

export default async function Page({ params }) {
  const { slug } = params;
  const post = await getPostData(slug);
  console.log(post);

  if (!post) {
    return <div>Post not found</div>;
  }

  return <PageClient post={post} />;
}
