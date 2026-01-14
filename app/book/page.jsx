"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { addDays, isBefore } from "date-fns";

export default function BookingPage() {
  const [blockedRanges, setBlockedRanges] = useState([]);
  const [range, setRange] = useState();

  useEffect(() => {
    fetch("/api/calendar")
      .then((res) => res.json())
      .then((data) => {
        const disabled = data.bookings.map((b) => ({
          from: new Date(b.start),
          to: new Date(b.end),
        }));
        setBlockedRanges(disabled);
      });
  }, []);

  function handleSelect(selectedRange) {
    if (selectedRange?.from && !selectedRange.to) {
      selectedRange.to = addDays(selectedRange.from, 1);
    }
    setRange(selectedRange);
  }

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.2rem", marginBottom: "10px" }}>
        Book Your Stay
      </h1>

      <p style={{ marginBottom: "30px", color: "#555" }}>
        Select your check-in and check-out dates. Unavailable dates are blocked.
      </p>

      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        disabled={blockedRanges}
        numberOfMonths={2}
        fromDate={new Date()}
      />

      {range?.from && range?.to && (
        <div style={{ marginTop: "25px", padding: "15px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <strong>Selected Dates</strong>
          <div>Check-in: {range.from.toDateString()}</div>
          <div>Check-out: {range.to.toDateString()}</div>
        </div>
      )}
    </main>
  );
}
</>
      )}
    </main>
  );
}
