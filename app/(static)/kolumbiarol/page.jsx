import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { getDocumentData } from "@/firebase-functions";

export const metadata = {
  metadataBase: new URL("https://www.colombiatours97.hu"),
  title: "Kolumbiáról | Colombia Tours 97 - Fedezze fel Kolumbia csodáit",
  description:
    "Ismerje meg Kolumbia lenyűgöző világát! Részletes információk az ország kultúrájáról, természeti kincseiről és turisztikai lehetőségeiről a Colombia Tours 97 oldalán.",
  keywords: [
    "Kolumbia",
    "kolumbiai kultúra",
    "kolumbiai természet",
    "dél-amerikai utazás",
    "kolumbiai turizmus",
    "Colombia Tours 97",
  ],
  openGraph: {
    title: "Fedezze fel Kolumbia csodáit | Colombia Tours 97",
    description:
      "Merüljön el Kolumbia lenyűgöző világában! Ismerje meg az ország gazdag kultúráját, lélegzetelállító tájait és izgalmas turisztikai lehetőségeit.",
    images: [
      {
        url: "/home.jpg", // Replace with an actual image showcasing Colombia's diversity
        width: 1200,
        height: 630,
        alt: "Kolumbia sokszínűsége: kultúra, természet és kalandok",
      },
    ],
    locale: "hu_HU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kolumbia felfedezése | Colombia Tours 97",
    description:
      "Fedezze fel Kolumbia gazdag kultúráját, lélegzetelállító tájait és izgalmas kalandjait a Colombia Tours 97 segítségével!",
    images: ["/home.jpg"], // Replace with your actual image path
  },
  alternates: {
    canonical: "https://www.colombiatours97.hu/kolumbiarol",
    languages: {
      "hu-HU": "https://www.colombiatours97.hu/kolumbiarol",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with your actual Google verification code
  },
};

const querySnapshot = await getDocs(collection(db, "adatok"));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
});

export default async function Page({ params }) {
  const { id } = params;
  const post = await getDocumentData("adatok", "kolumbiarol-adatok");
  return (
    <div className="container space-y-20 my-5">
      <h1>Kolumbia</h1>
      <div className="space-y-6">
        {post.kolumbiarol.map((item) => (
          <section key={item.cim} className="space-y-2">
            <h2>{item.cim}</h2>
            <div className="space-y-6">
              {item.reszletek.map((subitem, index) => (
                <p key={index}>{subitem}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
