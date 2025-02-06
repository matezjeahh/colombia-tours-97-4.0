import React from "react";
import Image from "next/image";

export const metadata = {
  title: "Rólunk | Colombia Tours 97",
  description:
    "Ismerd meg a Colombia Tours 97 csapatát! Fedezd fel történetünket, értékeinket és küldetésünket, amelyek az autentikus kolumbiai utazási élmény mögött állnak.",
};

export default function AboutUs() {
  return (
    <div className="container my-5 space-y-20">
      <h1>Rólunk</h1>
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 h-full">
        <div className="space-y-4">
          <h2>Rólunk</h2>
          <p>
            Bélafi Szilárd vagyok, a Colombia Tours 97 alapítója és túravezetője. Nyolc éve élek
            Kolumbiában. Röviden összefoglalva a világ legszebb országát, Kolumbiát mutatom meg
            idelátogató vendégeimnek; autentikus körutazások és kalandtúrák keretein belül immár
            ötödik éve. Azt vallom, hogy egy távoli egzotikus országot úgy lehet a legjobban
            megismerni, ha az utazó kilép a turisztikai zónából és megismeri az ország valódi arcát,
            amihez viszont sokszor ki kell majd lépj a megszokott komfortzónádból. Az általam
            vezetett utak során olyan részletes betekintést kapsz az adott országrész hétköznapi
            valóságába, mintha csak egy Márquez regénybe csöppentél volna. Hiszen nem ugyanaz
            átutazni egy országon vagy pedig átélni azt.
          </p>
          <p>
            Sokszor mondtam már hogy kétféle Kolumbia létezik: az egyik amit átformáltak a külföldi
            turisták elvárásai szerint, a másik pedig amit nem. Ez utóbbit képviselem én és a
            Colombia Tours 97 csapata minden körutunkon, amikor a helyi vezetőkkel,
            &apos;campesinó&apos; és indián közösségekkel együttműködve mutatjuk meg az ország
            lenyűgöző természeti és kultúrális látnivalóit. Így értelemszerűen az én útjaim
            bevételéből a vidéki közösségek részesednek, hozzájárulva a kolumbiai vidéki turizmus
            fejlődéséhez, bevételt adva a helyi családoknak bármely országrészben. Cserébe
            élvezheted végtelen vendégszeretetüket.
          </p>
        </div>
        <div className="relative h-64 md:h-96 lg:h-auto">
          <Image
            unoptimized
            src="/szilard2.jpg"
            alt="About Us"
            fill
            className="rounded-xl object-cover"
          />
        </div>
        <Image
          unoptimized
          src="/szilard4.jpg"
          alt="About Us"
          height={0}
          width={0}
          className="rounded-xl h-64 md:h-96 w-full object-cover"
        />
        <Image
          unoptimized
          src="/szilard5.jpg"
          alt="About Us"
          height={0}
          width={0}
          className="rounded-xl h-64 md:h-96 w-full object-cover"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <h2>Túráink</h2>
          <p>
            Az én útjaim azon utazóközönségnek szólnak, akik részletesen szeretnék megismerni az
            adott országrész kultúráját, kevésbé ismert, ám bámulatos természeti látnivalóit, és az
            ott élő natív embereket. A mi útjainkon olyan helyszínekre juthatsz el, amiről az
            átlagos turista nem is tud, hiszen sokuk nem is turisztikai látványosság. Az elmúlt
            évtized alatt nagyon részletesen beutaztam az országot, így mára már Kolumbia mind a 32
            tartományára van útvonalam és rengeteg kiegészítő programom. Folyamatosan bővülő
            kínálatunkban jelenleg több tucat Nemzeti Park, több mint 20 natív indián közösség
            látogatása szerepel, hála az egész országra kiterjedő kapcsolati tőkémnek. Privát
            terepjáròs körutazásainkon úgy mutatom meg ezt az országot, mint senki más: magyarul
            kolumbiai életérzéssel fűszerezve!
          </p>
        </div>
        <div className="relative h-64 md:h-96 lg:h-auto">
          <Image
            unoptimized
            src="/szilard3.jpg"
            alt="About Us"
            fill
            className="rounded-xl object-cover"
          />
        </div>
        <Image
          unoptimized
          src="/szilard6.jpg"
          alt="About Us"
          height={0}
          width={0}
          className="rounded-xl h-64 md:h-96 w-full object-cover"
        />
        <Image
          unoptimized
          src="/szilard7.jpg"
          alt="About Us"
          height={0}
          width={0}
          className="rounded-xl h-64 md:h-96 w-full object-cover object-top"
        />
      </div>
    </div>
  );
}
