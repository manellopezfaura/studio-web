import { ReactNode } from "react";
import "../public/css/styles.css";

// This layout is only used for not-found pages at the root level
// or other non-localized routes if any exist.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
