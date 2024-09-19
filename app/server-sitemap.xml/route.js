import { getServerSideSitemap } from "next-sitemap";
import { db } from "@/firebase"; // Adjust import path as needed
import { collection, getDocs } from "firebase/firestore";

export async function GET(request) {
  // Method to source URLs from Firebase (utazasaink collection)
  const getUrls = async () => {
    // Correcting the collection reference
    const blogPostsSnapshot = await getDocs(collection(db, "utazasaink"));
    return blogPostsSnapshot.docs.map((doc) => {
      const lastModified = doc.data().lastModified;
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
        loc: `https://colombiatours97.com/utazasaink/${doc.slug}`, // Construct the correct URL
        lastmod: lastModifiedISO,
      };
    });
  };

  // Generate sitemap
  const urls = await getUrls();
  return getServerSideSitemap(urls);
}
