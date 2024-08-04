// app/dashboard/utazasok-modositasa/page.jsx
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import withAuth from "@/app/(auth)/withAuth";
import Modifying from "@/components/modifying";

const UtazasokModositasa = async () => {
  // Ensure the collection path is correct
  const docRef = doc(db, "adatok", "utazasaink");
  const docSnapshot = await getDoc(docRef);
  const data = docSnapshot.data().utak || [];

  return (
    <div className="container my-10 space-y-10">
      <h2>Utazások módosítása</h2>
      <Modifying data={data} />
    </div>
  );
};

export default withAuth(UtazasokModositasa);
