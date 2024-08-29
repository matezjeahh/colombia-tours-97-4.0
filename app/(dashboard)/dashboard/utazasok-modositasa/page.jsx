import { getDocumentData } from "@/firebase-functions";
import withAuth from "@/app/(auth)/withAuth";
import Modifying from "@/components/modifying";

const UtazasokModositasa = async () => {
  const data = await getDocumentData("adatok", "utazasaink");
  const utak = data?.utak || [];

  return (
    <div className="container my-10 space-y-10">
      <h2>Utazások módosítása</h2>
      <Modifying data={utak} />
    </div>
  );
};

export default withAuth(UtazasokModositasa);
