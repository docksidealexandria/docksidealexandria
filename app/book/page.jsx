"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { differenceInCalendarDays, addDays } from "date-fns";

export default function BookPage() {
  const [range, setRange] = useState();
  const [disabledDates, setDisabledDates] = useState([]);

  const MIN_NIGHTS = 3;

  useEffect(() => {
    async function loadBlockedDates() {
      const res = await fetch("/api/calendar");
      const data = await res.json();

      const disabled = data.bookings.flatMap((b) => {
        const dates = [];
        let d = new Date(b.start);
        const end = new Date(b.end);
        while (d <= end) {
          dates.push(new Date(d));
          d.setDate(d.getDate() + 1);
        }
        return dates;
      });

      setDisabledDates(disabled);
    }

    loadBlockedDates();
  }, []);

  function handleSelect(selected) {
    // First click → set start date only
    if (!range?.from || (range.from && range.to)) {
      setRange({ from: selected?.from });
      return;
    }

    // Second click → validate min nights
    const nights = differenceInCalendarDays(
      selected.to,
      selected.from
    );

    if (nights < MIN_NIGHTS) {
      alert(`Minimum stay is ${MIN_NIGHTS} nights`);
      return;
    }

    setRange(selected);
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Select Your Stay
      </h1>

      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        disabled={disabledDates}
        min={MIN_NIGHTS}
        numberOfMonths={2}
        showOutsideDays
      />

      {range?.from && !range?.to && (
        <p style={{ marginTop: "1rem", color: "#555" }}>
          Select a checkout date (minimum {MIN_NIGHTS} nights)
        </p>
      )}

      {range?.from && range?.to && (
        <div style={{ marginTop: "1.5rem" }}>
          <strong>Check-in:</strong>{" "}
          {range.from.toDateString()}
          <br />
          <strong>Check-out:</strong>{" "}
          {range.to.toDateString()}
        </div>
      )}
    </main>
  );
}
