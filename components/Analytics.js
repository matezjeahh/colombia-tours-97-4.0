"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      analytics.then((analytics) => {
        if (analytics) {
          logEvent(analytics, "page_view", {
            page_path: pathname,
          });
        }
      });
    }
  }, [pathname]);

  return null;
}
