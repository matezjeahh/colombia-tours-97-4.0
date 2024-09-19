"use client";
import React, { useState, useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import Cookies from "js-cookie";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const cookieConsent = Cookies.get("cookieConsent");
    const sessionRejection = sessionStorage.getItem("cookieRejected");

    if (!cookieConsent && !sessionRejection) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set("cookieConsent", "accepted", { expires: 365 });
    Cookies.set("analyticsConsent", "true", { expires: 365 }); // Set analytics consent
    setShowBanner(false);
    window.location.reload(); // Reload to enable analytics
  };

  const handleReject = () => {
    sessionStorage.setItem("cookieRejected", "true");
    Cookies.set("analyticsConsent", "false", { expires: 365 }); // Set analytics rejection
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 md:p-0 md:bottom-4 md:left-4 md:right-auto md:max-w-md animate-slide-up">
      <Alert className="shadow-lg">
        <div className="flex justify-between items-start">
          <AlertTitle className="text-lg font-bold">Sütiket használunk</AlertTitle>
          <Cookie className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0 ml-2" />
        </div>
        <AlertDescription className="text-sm mt-2">
          Sütiket használunk, hogy a lehető legjobb élményt nyújtsuk weboldalunkon. További
          információért a sütik használatáról, kérjük, tekintse meg süti szabályzatunkat.
        </AlertDescription>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 md:mt-6">
          <Button className="w-full sm:flex-1" onClick={handleAccept}>
            Elfogadom
          </Button>
          <Button variant="outline" className="w-full sm:flex-1" onClick={handleReject}>
            Elutasítom
          </Button>
        </div>
      </Alert>
    </div>
  );
}
