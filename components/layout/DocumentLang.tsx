"use client";

import { useEffect } from "react";

// Sets <html lang> on the client because the html element lives in the
// non-locale root layout, which doesn't have access to the URL locale.
// `suppressHydrationWarning` on <html> covers the brief mismatch.
export function DocumentLang({ locale }: { locale: string }) {
  useEffect(() => {
    if (document.documentElement.lang !== locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);
  return null;
}
