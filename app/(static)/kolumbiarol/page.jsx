import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { getDocumentData } from "@/firebase-functions";

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
