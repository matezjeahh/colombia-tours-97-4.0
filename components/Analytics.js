"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      analytics.then((analytics) => {
        if (analytics) {
          logEvent(analytics, "page_view", {
            page_path: pathname,
            page_search: searchParams.toString(),
          });
        }
      });
    }
  }, [pathname, searchParams]);

  return null;
}
