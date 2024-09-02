// app/components/CookieConsentWrapper.jsx
import { areMandatoryCookiesAccepted } from "@/lib/cookies";
import CookieConsent from "./cookie";

const CookieConsentWrapper = () => {
  // Server-side check for mandatory cookies acceptance
  const mandatoryCookiesAccepted = areMandatoryCookiesAccepted();

  // Pass the initial state to the client component
  return <CookieConsent initialMandatoryCookiesAccepted={mandatoryCookiesAccepted} />;
};

export default CookieConsentWrapper;
