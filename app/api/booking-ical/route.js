export async function GET() {
  // TODO later: replace this with real bookings from Stripe / DB
  const bookings = [
    {
      start: "2026-07-10",
      end: "2026-07-13",
      summary: "Direct Website Booking"
    }
  ];

  let ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Dockside Alexandria//Booking Calendar//EN
CALSCALE:GREGORIAN
`;

  bookings.forEach((b, i) => {
    const uid = `dockside-${i}@docksidealexandria.com`;

    ical += `
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatDate(new Date())}
DTSTART;VALUE=DATE:${formatDate(new Date(b.start))}
DTEND;VALUE=DATE:${formatDate(new Date(b.end))}
SUMMARY:${b.summary}
END:VEVENT
`;
  });

  ical += `END:VCALENDAR`;

  return new Response(ical, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function formatDate(date) {
  return date.toISOString().split("T")[0].replace(/-/g, "");
}
