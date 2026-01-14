import ical from "node-ical";

export async function GET() {
  const AIRBNB_ICAL =
    "https://www.airbnb.com/calendar/ical/1345046922187021169.ics?t=d942422183e145ba83947acffaf36df9";

  const data = await ical.fromURL(AIRBNB_ICAL);

  const bookings = Object.values(data)
    .filter((e) => e.type === "VEVENT")
    .map((e) => ({
      start: e.start,
      end: e.end
    }));

  return Response.json({ bookings });
}

