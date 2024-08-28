// app/dashboard/utazasok-modositasa/page.jsx
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import withAuth from "@/app/(auth)/withAuth";
import CalendarView from "@/components/calendar-view";

const Dashboard = async () => {
  const docRef = doc(db, "adatok", "utazasaink");
  const docSnapshot = await getDoc(docRef);
  const data = docSnapshot.data()?.utak || [];

  const formatDate = (date) => {
    if (date && typeof date.toDate === "function") {
      return date.toDate().toLocaleDateString("hu-HU");
    } else if (date instanceof Date) {
      return date.toLocaleDateString("hu-HU");
    } else if (date && date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString("hu-HU");
    }
    return "N/A"; // or some default value
  };

  // Convert Firebase timestamps to formatted date strings
  const trips = data.map((item) => ({
    id: item.id,
    title: item.cim,
    startDate: formatDate(item.datum?.kezdo),
    endDate: formatDate(item.datum?.veg), // Changed from kezdo to veg
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
