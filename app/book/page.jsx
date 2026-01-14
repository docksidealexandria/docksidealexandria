"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { differenceInCalendarDays, format } from "date-fns";

const MIN_NIGHTS = 3;

export default function BookPage() {
  const [range, setRange] = useState();
  const [disabledDates, setDisabledDates] = useState([]);
  const [error, setError] = useState("");

  // Load blocked dates from Airbnb sync
  useEffect(() => {
    async function loadBlockedDates() {
      const res = await fetch("/api/calendar");
      const data = await res.json();

      const blocked = data.bookings.flatMap((b) => {
        const dates = [];
        let d = new Date(b.start);
        const end = new Date(b.end);
        while (d < end) {
          dates.push(new Date(d));
          d.setDate(d.getDate() + 1);
        }
        return dates;
      });

      setDisabledDates(blocked);
    }

    loadBlockedDates();
  }, []);

  // Calendar selection logic
  function handleSelect(selected) {
    setError("");

    if (!selected?.from) {
      setRange(undefined);
      return;
    }

    if (selected.from && selected.to) {
      const nights = differenceInCalendarDays(
        selected.to,
        selected.from
      );

      if (nights < MIN_NIGHTS) {
        setError(`Minimum stay is ${MIN_NIGHTS} nights`);
        return;
      }
    }

    setRange(selected);
  }

  const canBook = range?.from && range?.to;

  return (
    <main style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
        Book Your Stay
      </h1>

      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        Select your check-in and check-out dates
      </p>

      {/* Calendar */}
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        numberOfMonths={2}
        showOutsideDays
        captionLayout="dropdown"   // shows month + YEAR selector
        fromYear={new Date().getFullYear()}
        toYear={new Date().getFullYear() + 2}
        disabled={disabledDates}
        modifiers={{ blocked: disabledDates }}
        modifiersStyles={{
          blocked: {
            textDecoration: "line-through",
            color: "#999",
            backgroundColor: "#f5f5f5"
          }
        }}
      />

      {/* Error */}
      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
      )}

      {/* Summary */}
      {range?.from && range?.to && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#fafafa"
          }}
        >
          <h2 style={{ marginBottom: "0.5rem" }}>
            Your Reservation
          </h2>
          <p>
            <strong>Check-in:</strong>{" "}
            {format(range.from, "MMMM d, yyyy")}
          </p>
          <p>
            <strong>Check-out:</strong>{" "}
            {format(range.to, "MMMM d, yyyy")}
          </p>
          <p>
            <strong>Nights:</strong>{" "}
            {differenceInCalendarDays(range.to, range.from)}
          </p>
        </div>
      )}

      {/* Book Now Button */}
      <button
        disabled={!canBook}
        onClick={() => {
          alert("Next step: guest info & payment");
        }}
        style={{
          marginTop: "2rem",
          padding: "1rem 2rem",
          fontSize: "1.25rem",
          borderRadius: 8,
          border: "none",
          cursor: canBook ? "pointer" : "not-allowed",
          backgroundColor: canBook ? "#003366" : "#ccc",
          color: "white"
        }}
      >
        Book Now
      </button>
    </main>
  );
}
