/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Oq8gthr4g7F
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export const metadata = {
  metadataBase: new URL("https://www.colombiatours97.hu"),
  title: "Elérhetőség | Colombia Tours 97 - Kapcsolatfelvétel",
  description:
    "Lépjen kapcsolatba a Colombia Tours 97-tel! Kérdése van az utazással kapcsolatban? Segítünk a tervezésben. Gyors válasz és személyes tanácsadás garantált.",
  keywords: [
    "kapcsolat",
    "elérhetőség",
    "Colombia Tours 97",
    "utazási információ",
    "kolumbiai utazás",
    "email",
    "WhatsApp",
    "kapcsolatfelvétel",
  ],
  openGraph: {
    title: "Kapcsolat | Colombia Tours 97 - Tervezze meg velünk kolumbiai utazását!",
    description:
      "Kérdése van a kolumbiai utazásról? Vegye fel velünk a kapcsolatot! Gyors válasz, személyes tanácsadás és szakértő segítség az utazástervezésben.",
    images: [
      {
        url: "/home.jpg", // Replace with an image representing your contact page
        width: 1200,
        height: 630,
        alt: "Colombia Tours 97 - Kapcsolatfelvétel",
      },
    ],
    locale: "hu_HU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kapcsolat | Colombia Tours 97 - Segítünk az utazástervezésben",
    description:
      "Kérdése van? Írjon nekünk! Email: colombiatours97@hotmail.com, WhatsApp: +57 322 6014919. Gyors és személyes válasz garantált!",
    images: ["/home.jpg"], // Replace with your actual image path
  },
  alternates: {
    canonical: "https://www.colombiatours97.hu/elerhetoseg",
    languages: {
      "hu-HU": "https://www.colombiatours97.hu/elerhetoseg",
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
    google: "google-site-verification=Ij3REYpezRvU6CK8m-T4cGdjPAHpr0uIetNQ2z1oHJU", // Replace with your actual Google verification code
  },
};

export default function Elerhetoseg() {
  return (
    <div className="container space-y-20 my-5">
      <div className="space-y-2">
        <h1>Elérhetőség</h1>
        <p className="text-center">
          Ha kérdésed van az utazással kapcsolatban, vagy további információra van szükséged, vedd
          fel velünk a kapcsolatot
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Lépjen kapcsolatba velünk</CardTitle>
            <CardDescription>
              A lehető leggyorsabban válaszolunk minden megkeresésre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm showSubject={false} />
          </CardContent>
        </Card>
        <div className="col-span-1 space-y-6">
          <div className="space-y-0">
            <h2>További kapcsolatfelvételi lehetőségek</h2>
            <p className="text-muted-foreground">
              Használja az alábbi elérhetőségeinket, hogy gyorsan kapcsolatba léphessen velünk
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex">
              <Mail size={20} className="mr-2 mt-0.5" />
              <div>
                <h3 className="mt-0">Email</h3>
                <p>colombiatours97@hotmail.com</p>
              </div>
            </div>
            <div className="flex">
              <Phone size={20} className="mr-2 mt-0.5" />
              <div>
                <h3 className="mt-0">Whatsapp</h3>
                <p>+57 322 6014919</p>
              </div>
            </div>
            <div className="flex">
              <MapPin size={20} className="mr-2 mt-0.5" />
              <div>
                <h3 className="mt-0">Cím</h3>
                <p>Carrera 6 #2-39 Mingueo, La Guajira Kolumbia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
