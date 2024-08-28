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

  const formatDate = (date) => {
    if (date && typeof date.toDate === "function") {
      date = date.toDate();
    } else if (date && date.seconds) {
      date = new Date(date.seconds * 1000);
    }

    if (date instanceof Date) {
      return (
        date.getFullYear() +
        "." +
        String(date.getMonth() + 1).padStart(2, "0") +
        "." +
        String(date.getDate()).padStart(2, "0")
      );
    }
    return null; // or a default date string
  };

  const serializedPost = {
    ...post,
    datum: {
      kezdo: formatDate(post.datum?.kezdo),
      veg: formatDate(post.datum?.veg),
    },
  };

  return <PageClient post={serializedPost} />;
}
