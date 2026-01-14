"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { addDays, isBefore } from "date-fns";

export default function BookingPage() {
  const [blocked, setBlocked] = useState([]);
  const [range, setRange] = useState({ from: null, to: null });

  useEffect(() => {
    fetch("/api/calendar")
      .then((res) => res.json())
      .then((data) => {
        const blockedDates = data.bookings.map((b) => ({
          from: new Date(b.start),
          to: new Date(b.end)
        }));
        setBlocked(blockedDates);
      });
  }, []);

  function handleSelect(selected) {
    if (!selected?.from) return;

    // Auto-select 1 night minimum
    if (!selected.to) {
      setRange({
        from: selected.from,
        to: addDays(selected.from, 1)
      });
    } else {
      setRange(selected);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 28, marginBottom: 10 }}>Book Your Stay</h1>
      <p style={{ color: "#666", marginBottom: 20 }}>
        Select your check-in and check-out dates
      </p>

      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        disabled={[
          ...blocked,
          { before: new Date() }
        ]}
        numberOfMonths={2}
        showOutsideDays
      />

      {range.from && range.to && (
        <div style={{ marginTop: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
          <strong>Selected stay:</strong>
          <div>
            {range.from.toDateString()} → {range.to.toDateString()}
          </div>
        </div>
      )}
    </main>
  );
}

