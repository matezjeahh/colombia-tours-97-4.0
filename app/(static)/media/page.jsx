import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Media() {
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
    // Add more videos as needed
  ];
  return (
    <div className="container space-y-20 my-5">
      <div className="space-y-2">
        <h1>Média</h1>
        <p className="text-center">
          Ismerkedj meg velünk online! Fedezd fel kolumbiai utazásaink lenyűgöző világát videóinkon
          keresztül. Csatlakozz hozzánk, hogy részese lehess kalandjainknak és kulturális
          felfedezéseinknek!
        </p>
      </div>
      <div className="grid grid-cols-1  md:grid-cols-3 gap-8">
        {videos.map((item, index) => (
          <Card key={index} className="col-span-1">
            <iframe
              className="w-full h-60 rounded-t-lg"
              src={`https://www.youtube.com/embed/${item.youtubeId}`}
              title={item.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>

              <Button variant="link" className="max-w-fit">
                @ {item.channel}
              </Button>
            </CardHeader>
            <CardContent>
              <p>{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
