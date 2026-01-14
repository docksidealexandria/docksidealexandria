"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { addDays, differenceInCalendarDays } from "date-fns";

export default function BookingPage() {
  const [blocked, setBlocked] = useState([]);
  const [range, setRange] = useState({ from: null, to: null });
  const [error, setError] = useState("");

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
    setError("");

    if (!selected?.from) {
      setRange({ from: null, to: null });
      return;
    }

    // Auto-select checkout if only start date picked
    if (!selected.to) {
      setRange({
        from: selected.from,
        to: addDays(selected.from, 1)
      });
      return;
    }

    const nights = differenceInCalendarDays(selected.to, selected.from);

    if (nights < 3) {
      setError("Minimum stay is 3 nights.");
      return;
    }

    setRange(selected);
  }

  return (
    <main style={{ maxWidth: 520, margin: "40px auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 30, marginBottom: 10 }}>
        Book Your Stay
      </h1>

      <p style={{ color: "#555", marginBottom: 20 }}>
        Select your check-in and check-out dates.
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

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          {error}
        </p>
      )}

      {range.from && range.to && !error && (
        <div style={{ marginTop: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
          <strong>Selected stay</strong>
          <div>Check-in: {range.from.toDateString()} (3:00 PM)</div>
          <div>Check-out: {range.to.toDateString()} (11:00 AM)</div>
          <div style={{ marginTop: 8 }}>Minimum stay: 3 nights</div>
          <div>No pets</div>
          <div>$200 cleaning fee</div>
        </div>
      )}
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { addDays, differenceInCalendarDays } from "date-fns";

export default function BookingPage() {
  const [blocked, setBlocked] = useState([]);
  const [range, setRange] = useState({ from: null, to: null });
  const [error, setError] = useState("");

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
    setError("");

    if (!selected?.from) {
      setRange({ from: null, to: null });
      return;
    }

    // Auto-select checkout if only start date picked
    if (!selected.to) {
      setRange({
        from: selected.from,
        to: addDays(selected.from, 1)
      });
      return;
    }

    const nights = differenceInCalendarDays(selected.to, selected.from);

    if (nights < 3) {
      setError("Minimum stay is 3 nights.");
      return;
    }

    setRange(selected);
  }

  return (
    <main style={{ maxWidth: 520, margin: "40px auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 30, marginBottom: 10 }}>
        Book Your Stay
      </h1>

      <p style={{ color: "#555", marginBottom: 20 }}>
        Select your check-in and check-out dates.
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

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          {error}
        </p>
      )}

      {range.from && range.to && !error && (
        <div style={{ marginTop: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
          <strong>Selected stay</strong>
          <div>Check-in: {range.from.toDateString()} (3:00 PM)</div>
          <div>Check-out: {range.to.toDateString()} (11:00 AM)</div>
          <div style={{ marginTop: 8 }}>Minimum stay: 3 nights</div>
          <div>No pets</div>
          <div>$200 cleaning fee</div>
        </div>
      )}
    </main>
  );
}
