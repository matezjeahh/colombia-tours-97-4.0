import React from "react";
import VideoCard from "@/components/video-card";

const videos = [
  {
    id: 1,
    youtubeId: "RDUygevDiu4",
    title: "A Hold Szent Hegye, Cerro Quinin",
    description:
      "Az első túranapunk összefoglalója Szilárddal, a Colombia Tours 97 tulajdonosával és idegenvezetőjével. Bogotától 2.5 órányira, a Cerro Quininin jártunk, avagy a Hold Szent Hegyén.",
    channel: "Hungarian Nomads",
  },
  {
    id: 2,
    youtubeId: "RTEdRlPna3c",
    title: "A Majmok Vízesése",
    description:
      "A második túranapunkon Villetából indulva egy gyönyörű vízeséshez értünk, alig fél óra séta alatt. Ha Bogotából egy kis melegbe vágysz, de nincs kedved messzire menni, ez lehet az ideális hely számodra.",
    channel: "Hungarian Nomads",
  },
  {
    id: 3,
    youtubeId: "g3c9wLC1xA8",
    title: "El Dorado legendája + interjú Szilárddal",
    description:
      "Az aranyásók rosszul jártak avagy megcáfoltuk El Dorado legendáját. Továbbá kiderítettük, mit keres egy magyar srác a Wayuu indiánok között a sivatagban.",
    channel: "Hungarian Nomads",
  },
  {
    id: 4,
    youtubeId: "2MaOoi_eGg8",
    title: "Bélafi Szilárd portréfilm",
    description: "...",
    channel: "Norbert Tihanics",
  },
  {
    id: 5,
    youtubeId: "TD4MQV2wdDU",
    title: "Itthon, Kolumbiában!",
    description: "...",
    channel: "Colombia Tours 97 S.A.S",
  },
];

export const metadata = {
  metadataBase: new URL("https://www.colombiatours97.hu"),
  title: "Média | Colombia Tours 97 - Kolumbiai Utazások Videói",
  description:
    "Fedezze fel Kolumbia lenyűgöző világát videóinkon keresztül! Kalandok, kulturális felfedezések és lélegzetelállító tájak a Colombia Tours 97 utazásain.",
  keywords: [
    "Kolumbia videók",
    "utazási élmények",
    "kalandtúra videók",
    "kolumbiai kultúra",
    "úti beszámolók",
    "Colombia Tours 97",
  ],
  openGraph: {
    title: "Kolumbiai Utazások Videói | Colombia Tours 97 Média",
    description:
      "Merüljön el Kolumbia csodálatos világában! Nézze meg videóinkat kalandjainkról, kulturális felfedezéseinkről és a lenyűgöző kolumbiai tájakról.",
    images: [
      {
        url: "/home.jpg", // Replace with a thumbnail of your featured video or media content
        width: 1200,
        height: 630,
        alt: "Colombia Tours 97 - Kolumbiai utazási élmények videón",
      },
    ],
    locale: "hu_HU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kolumbiai Kalandok Videón | Colombia Tours 97 Média",
    description:
      "Csatlakozzon hozzánk virtuálisan! Nézze meg lenyűgöző videóinkat Kolumbia természeti csodáiról, kulturális kincseiről és izgalmas kalandjairól.",
    images: ["/home.jpg"], // Replace with your actual image path
  },
  alternates: {
    canonical: "https://www.colombiatours97.hu/media",
    languages: {
      "hu-HU": "https://www.colombiatours97.hu/media",
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

export default function Media() {
  return (
    <div className="container space-y-20 my-5 ">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-center">Média</h1>
        <p className="text-center">
          Ismerkedj meg velünk online! Fedezd fel kolumbiai utazásaink lenyűgöző világát videóinkon
          keresztül. Csatlakozz hozzánk, hogy részese lehess kalandjainknak és kulturális
          felfedezéseinknek!
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
