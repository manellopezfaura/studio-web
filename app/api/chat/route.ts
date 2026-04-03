// app/api/chat/route.ts
// Backwards-compatible route — delegates to brand "107"
// New integrations should use /api/chat/[brand] directly

import { POST as brandPOST } from "./[brand]/route"

export async function POST(req: Request) {
  return brandPOST(req, { params: Promise.resolve({ brand: "107" }) })
}
