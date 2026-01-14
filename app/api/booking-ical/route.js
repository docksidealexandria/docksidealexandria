export async function GET() {
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
DTSTART;VALUE=DATE:${b.start.replace(/-/g, "")}
DTEND;VALUE=DATE:${b.end.replace(/-/g, "")}
SUMMARY:${b.summary}
END:VEVENT
`;
  });

  ical += `END:VCALENDAR`;

  return new Response(ical, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": "inline; filename=booking-ical.ics",
      "Cache-Control": "no-store"
    }
  });
}

function formatDate(date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .split(".")[0] + "Z";
}
