import { cookies } from "next/headers";

// Utility to check if mandatory cookies are accepted on the server side
export function areMandatoryCookiesAccepted() {
  const cookieStore = cookies();
  return cookieStore.get("mandatoryCookiesAccepted") === "true";
}
