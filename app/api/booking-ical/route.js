export async function GET() {
  const bookings = [
    {
      start: "2026-12-03",
      end: "2026-12-06",
      summary: "TEST – Website Booking"
    }
  ];

  let ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Dockside Alexandria//Direct Booking Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

  bookings.forEach((b, index) => {
    ical += `
BEGIN:VEVENT
UID:dockside-test-${index}@docksidealexandria.com
DTSTAMP:${formatDateTime(new Date())}
DTSTART;VALUE=DATE:${b.start.replace(/-/g, "")}
DTEND;VALUE=DATE:${b.end.replace(/-/g, "")}
SUMMARY:${b.summary}
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
