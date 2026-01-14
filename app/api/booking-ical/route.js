export async function GET() {
  // In the next step, bookings will come from Stripe / DB
  const bookings = [];

  let ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Dockside Alexandria//Direct Booking Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

  bookings.forEach((b, index) => {
    ical += `
BEGIN:VEVENT
UID:dockside-${index}@docksidealexandria.com
DTSTAMP:${formatDateTime(new Date())}
DTSTART;VALUE=DATE:${b.start.replace(/-/g, "")}
DTEND;VALUE=DATE:${b.end.replace(/-/g, "")}
SUMMARY:${b.summary || "Website Booking"}
END:VEVENT
`;
  });

  ical += `
END:VCALENDAR
`;

  return new Response(ical, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function formatDateTime(date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .split(".")[0] + "Z";
}
