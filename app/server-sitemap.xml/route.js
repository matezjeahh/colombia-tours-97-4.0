import { getServerSideSitemap } from "next-sitemap";
import { db } from "@/firebase"; // Adjust import path as needed
import { collection, getDocs } from "firebase/firestore";

export async function GET(request) {
  // Method to source URLs from Firebase (utazasaink collection)
  const getUrls = async () => {
    const blogPostsSnapshot = await getDocs(collection(db, "utazasaink"));
    return blogPostsSnapshot.docs.map((doc) => {
      const data = doc.data();
      const lastModified = data.lastModified;
      let lastModifiedISO;

      // Check if lastModified is a valid date
      if (lastModified && lastModified.toDate instanceof Function) {
        lastModifiedISO = lastModified.toDate().toISOString(); // Firestore Timestamp
      } else if (lastModified instanceof Date) {
        lastModifiedISO = lastModified.toISOString(); // JS Date object
      } else if (typeof lastModified === "string") {
        lastModifiedISO = new Date(lastModified).toISOString(); // String date
      } else {
        lastModifiedISO = new Date().toISOString(); // Fallback to current date
      }

      return {
        loc: `https://colombiatours97.hu/utazasaink/${data.slug}`, // Use data.slug instead of doc.slug
        lastmod: lastModifiedISO,
      };
    });
  };

  // Generate sitemap
  const urls = await getUrls();

  // Ensure we have at least one URL
  if (urls.length === 0) {
    urls.push({
      loc: "https://colombiatours97.hu",
      lastmod: new Date().toISOString(),
    });
  }

  return getServerSideSitemap(urls);
}
