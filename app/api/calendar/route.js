import ical from "node-ical";

export async function GET() {
  try {
    const url = process.env.AIRBNB_ICAL_URL;

    if (!url) {
      return new Response(
        JSON.stringify({ error: "Missing AIRBNB_ICAL_URL" }),
        { status: 500 }
      );
    }

    const events = await ical.fromURL(url);

    const bookings = Object.values(events)
      .filter(event => event.type === "VEVENT")
      .map(event => ({
        start: event.start,
        end: event.end
      }));

    return new Response(JSON.stringify({ bookings }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch calendar" }),
      { status: 500 }
    );
  }
}

