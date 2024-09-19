import { getServerSideSitemap } from "next-sitemap";
import { db } from "@/firebase"; // Adjust import path as needed
import { collection, getDocs } from "firebase/firestore";

export async function GET(request) {
  // Method to source urls from Firebase
  const getUrls = async () => {
    const blogPostsSnapshot = await getDocs(collection(db, "adatok"));
    return blogPostsSnapshot.docs.map((doc) => {
      const lastModified = doc.data().lastModified;
      let lastModifiedISO;

      // Check if lastModified is a valid date
      if (lastModified && lastModified.toDate instanceof Function) {
        // Firestore Timestamp
        lastModifiedISO = lastModified.toDate().toISOString();
      } else if (lastModified instanceof Date) {
        // JavaScript Date object
        lastModifiedISO = lastModified.toISOString();
      } else if (typeof lastModified === "string") {
        // String date
        lastModifiedISO = new Date(lastModified).toISOString();
      } else {
        // Fallback to current date if invalid
        lastModifiedISO = new Date().toISOString();
      }

      return {
        loc: `https://colombiatours97.com/utazasaink/${doc.id}`,
        lastmod: lastModifiedISO,
      };
    });
  };

  // Generate sitemap here
  const urls = await getUrls();
  return getServerSideSitemap(urls);
}
