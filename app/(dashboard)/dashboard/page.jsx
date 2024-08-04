// app/dashboard/utazasok-modositasa/page.jsx
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import withAuth from "@/app/(auth)/withAuth";
import CalendarView from "@/components/calendar-view";

const Dashboard = async () => {
  const docRef = doc(db, "adatok", "utazasaink");
  const docSnapshot = await getDoc(docRef);
  const data = docSnapshot.data().utak || [];

  // Convert Firebase timestamps to JavaScript Date objects
  const trips = data.map((item) => ({
    id: item.id,
    title: item.cim,
    startDate: item.datum.kezdo.toDate().toLocaleDateString("hu-HU"),
    endDate: item.datum.kezdo.toDate().toLocaleDateString("hu-HU"),
  }));

  // Sort trips by startDate in ascending order
  trips.sort((a, b) => {
    if (a.startDate < b.startDate) return -1;
    if (a.startDate > b.startDate) return 1;
    return 0;
  });

  return (
    <div className="container my-10 space-y-10">
      <h2 className="text-2xl font-bold mb-4">Közelgő utazások</h2>
      <CalendarView trips={trips} />
    </div>
  );
};

export default withAuth(Dashboard);
