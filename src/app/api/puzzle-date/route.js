import { authoritativeCalendar } from "../../../game/calendar.js";
export const dynamic = "force-dynamic";
export function GET() {
  return Response.json(authoritativeCalendar(), {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "CDN-Cache-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
    },
  });
}
