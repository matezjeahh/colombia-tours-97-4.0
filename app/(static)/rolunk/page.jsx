import React from "react";

export default function AboutUs() {
  return (
    <div className="container my-5 space-y-20">
      <h1>Rólunk</h1>
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <h2>Rólunk</h2>
          <p>
            Üdvözöljük a Colombia Tours 97 oldalán, ahol Kolumbia autentikus arcát mutatjuk be
            Önnek! Cégünk immár öt éve szervez egyedülálló körutazásokat és kalandtúrákat a világ
            harmadik legszebb országában. Célunk, hogy vendégeink a turisztikai zónákon kívül
            megismerjék Kolumbia valódi értékeit és kultúráját, melyhez sokszor szükség van a
            komfortzónából való kilépésre.
          </p>
          <p>
            Útjaink során olyan mélyreható élményekkel gazdagodhat, mintha egy Márquez-regénybe
            csöppent volna. Kétféle Kolumbiát ismerhet meg: egyet, amely a külföldi turisták
            elvárásaihoz igazodik, és egy másikat, amely a helyi közösségek autentikus valóságát
            tükrözi. Mi ez utóbbit képviseljük minden körutunkon, helyi vezetőkkel, campesinókkal és
            indián közösségekkel együttműködve.
          </p>
        </div>
        <img
          src="/kep.jpg"
          alt="About Us"
          width={600}
          height={400}
          className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
        />
      </div>

      <div className="rounded-lg  p-4 shadow-lg ">
        <img
          src="/kep.jpg"
          alt="John Doe"
          width={200}
          height={200}
          className="mx-auto h-32 w-32 rounded-full object-cover"
        />
        <div className="mt-4 text-center">
          <h3 className="text-lg font-bold">John Doe</h3>
          <p className="">Co-Founder &amp; CEO</p>
          <p className="mt-2 text-sm ">
            John is a seasoned entrepreneur with a passion for technology and a track record of
            building successful startups.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <h2>Túráink</h2>
          <p>
            Túráink bevételeiből a vidéki közösségek részesednek, ezzel hozzájárulva a kolumbiai
            vidéki turizmus fejlődéséhez és támogatva a helyi családokat. Cserébe vendégeink
            élvezhetik a helyiek végtelen vendégszeretetét.
          </p>
          <p>
            Kínálatunk azokat az utazókat célozza meg, akik mélyrehatóan szeretnék megismerni
            Kolumbia kultúráját, kevésbé ismert, ám lenyűgöző természeti látnivalóit és az ott élő
            natív embereket. Olyan helyszínekre juttatjuk el Önt, amelyeket az átlagos turista nem
            ismer, mivel sokuk nem turisztikai látványosság.
          </p>
          <p>
            Az elmúlt évtizedben részletesen beutaztuk az országot, így mára mind a 32 tartományra
            kidolgozott útvonalaink és rengeteg kiegészítő programunk van. Folyamatosan bővülő
            kínálatunk jelenleg több tucat nemzeti parkot és több mint 20 natív indián közösség
            látogatását tartalmazza, hála az egész országra kiterjedő kapcsolati tőkénknek.
          </p>
          <p>
            Privát terepjárós körutazásainkon olyan módon mutatjuk be Kolumbiát, mint senki más,
            magyar nyelven és a kolumbiai életérzéssel fűszerezve! Csatlakozzon hozzánk, és fedezze
            fel Kolumbiát a Colombia Tours 97 segítségével!
          </p>
        </div>
        <img
          src="/kep.jpg"
          alt="About Us"
          width={600}
          height={400}
          className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
        />
      </div>
    </div>
  );
}
