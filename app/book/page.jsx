"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  differenceInCalendarDays,
  format,
  addDays,
  isSameDay
} from "date-fns";

const MIN_NIGHTS = 3;

// Pricing
const WEEKDAY_RATE = 750;
const WEEKEND_RATE = 950;
const HOLIDAY_RATE = 1100;

// Define holiday weekends (can expand later)
const HOLIDAYS = [
  // New Year’s Day
  new Date("2026-01-01"),
  // Memorial Day (May 25, 2026)
  new Date("2026-05-25"),
  // Independence Day
  new Date("2026-07-04"),
  // Labor Day (Sept 7, 2026)
  new Date("2026-09-07"),
  // Thanksgiving (Nov 26, 2026)
  new Date("2026-11-26"),
];

function isHolidayRange(date) {
  return HOLIDAYS.some((holiday) => {
    return (
      isSameDay(date, holiday) ||
      isSameDay(date, addDays(holiday, -1)) || // Thursday before
      isSameDay(date, addDays(holiday, -2)) || // Wednesday buffer
      isSameDay(date, addDays(holiday, 1)) ||  // Friday after
      isSameDay(date, addDays(holiday, 2))     // Monday after
    );
  });
}

export default function BookPage() {
  const [range, setRange] = useState();
  const [disabledDates, setDisabledDates] = useState([]);
  const [error, setError] = useState("");
  const [pricing, setPricing] = useState([]);

  // Load blocked dates
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

  // Calendar selection
  function handleSelect(selected) {
    setError("");
    setPricing([]);

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

      calculatePricing(selected.from, selected.to);
    }

    setRange(selected);
  }

  function calculatePricing(from, to) {
    const nightly = [];
    let total = 0;
    let current = new Date(from);

    while (current < to) {
      let rate = WEEKDAY_RATE;
      let label = "Weeknight";

      if (isHolidayRange(current)) {
        rate = HOLIDAY_RATE;
        label = "Holiday";
      } else if (current.getDay() === 5 || current.getDay() === 6) {
        rate = WEEKEND_RATE;
        label = "Weekend";
      }

      nightly.push({
        date: format(current, "EEE, MMM d"),
        rate,
        label
      });

      total += rate;
      current = addDays(current, 1);
    }

    setPricing({ nightly, total });
  }

  const canBook = range?.from && range?.to;

  return (
    <main style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
        Book Your Stay
      </h1>

      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        numberOfMonths={2}
        captionLayout="dropdown"
        fromYear={new Date().getFullYear()}
        toYear={new Date().getFullYear() + 2}
        showOutsideDays
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

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Pricing Summary */}
      {pricing?.nightly && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#fafafa"
          }}
        >
          <h2>Pricing Summary</h2>

          {pricing.nightly.map((n, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6
              }}
            >
              <span>{n.date} ({n.label})</span>
              <span>${n.rate}</span>
            </div>
          ))}

          <hr style={{ margin: "1rem 0" }} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "1.25rem",
              fontWeight: "bold"
            }}
          >
            <span>Total</span>
            <span>${pricing.total.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Book Now */}
      <button
        disabled={!canBook}
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

