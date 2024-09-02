"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const CookieConsent = ({ initialMandatoryCookiesAccepted }) => {
  const [showConsent, setShowConsent] = useState(false);
  const [mandatoryCookiesAccepted, setMandatoryCookiesAccepted] = useState(
    initialMandatoryCookiesAccepted
  );
  const router = useRouter();

  useEffect(() => {
    if (!mandatoryCookiesAccepted) {
      const timer = setTimeout(() => setShowConsent(true), 500);
      return () => clearTimeout(timer);
    }
  }, [mandatoryCookiesAccepted]);

  const handleAcceptAll = () => {
    document.cookie = "mandatoryCookiesAccepted=true; path=/";
    setMandatoryCookiesAccepted(true);
    setShowConsent(false);
    router.refresh(); // Refresh the page to reflect cookie changes
  };

  const handleDecline = () => {
    document.cookie = "mandatoryCookiesAccepted=false; path=/";
    setMandatoryCookiesAccepted(false);
    setShowConsent(false);
    router.refresh(); // Refresh the page to reflect cookie changes
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 md:p-0 md:bottom-4 md:left-4 md:right-auto md:max-w-md animate-slide-up">
      <Alert className="bg-white p-4 md:p-6 rounded-lg shadow-lg border-gray-200">
        <div className="flex justify-between items-start">
          <AlertTitle className="text-lg font-bold">Sütiket használunk</AlertTitle>
          <Cookie className="h-5 w-5 md:h-6 md:w-6 text-gray-400 flex-shrink-0 ml-2" />
        </div>
        <AlertDescription className="text-sm   mt-2">
          Sütiket használunk, hogy a lehető legjobb élményt nyújtsuk weboldalunkon. További
          információért a sütik használatáról, kérjük, tekintse meg süti szabályzatunkat.
        </AlertDescription>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 md:mt-6">
          <Button
            onClick={handleAcceptAll}
            className="w-full sm:flex-1 bg-black text-white hover:bg-gray-800"
          >
            Elfogadom
          </Button>
          <Button onClick={handleDecline} variant="outline" className="w-full sm:flex-1">
            Elutasítom
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default CookieConsent;
