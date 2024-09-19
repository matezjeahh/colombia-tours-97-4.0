import { getServerSideSitemap } from "next-sitemap";
import { db } from "@/firebase"; // Adjust import path as needed
import { collection, getDocs } from "firebase/firestore";

export async function GET(request) {
  // Method to source urls from Firebase
  const getUrls = async () => {
    const blogPostsSnapshot = await getDocs(collection(db, "adatok"));
    return blogPostsSnapshot.docs.map((doc) => ({
      loc: `https://colombiatours97.hu/utazasaink/${doc.slug}`,
      lastmod: new Date(doc.data().lastModified).toISOString(),
    }));
  };

  // Generate sitemap here
  const urls = await getUrls();
  return getServerSideSitemap(urls);
}
