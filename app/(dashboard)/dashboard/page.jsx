import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import withAuth from "@/app/(auth)/withAuth";
import MyCalendar from "@/components/dashboard/BigCalendar";

const Dashboard = async () => {
  const docRef = doc(db, "adatok", "utazasaink");
  const docSnapshot = await getDoc(docRef);
  const data = docSnapshot.data()?.utak || [];

  const trips = data.map((item) => ({
    name: item.cim,
    startDate: item.datum.kezdo,
    endDate: item.datum.veg,
  }));

  return (
    <div className="container my-10 space-y-10">
      <h2 className="text-2xl font-bold mb-4">Közelgő utazások</h2>
      <MyCalendar trips={trips} />
    </div>
  );
};

export default withAuth(Dashboard);
