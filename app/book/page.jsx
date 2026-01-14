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

// US holiday anchor dates (adjust yearly as needed)
const HOLIDAYS = [
  new Date("2026-01-01"), // New Year
  new Date("2026-05-25"), // Memorial Day
  new Date("2026-07-04"), // July 4
  new Date("2026-09-07"), // Labor Day
  new Date("2026-11-26"), // Thanksgiving
];

function isHoliday(date) {
  return HOLIDAYS.some(h =>
    isSameDay(date, h) ||
    isSameDay(date, addDays(h, -1)) || // Thu
    isSameDay(date, addDays(h, 1))     // Mon
  );
}

export default function BookPage() {
  const [range, setRange] = useState();
  const [disabledDates, setDisabledDates] = useState([]);
  const [pricing, setPricing] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/calendar")
      .then(res => res.json())
      .then(data => {
        const blocked = data.bookings.flatMap(b => {
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
      });
  }, []);

  function handleSelect(selected) {
    setError("");
    setPricing(null);

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
    let total = 0;
    let nightly = [];
    let d = new Date(from);

    while (d < to) {
      let rate = WEEKDAY_RATE;
      let label = "Weeknight";

      if (isHoliday(d)) {
        rate = HOLIDAY_RATE;
        label = "Holiday";
      } else if (d.getDay() === 5 || d.getDay() === 6) {
        rate = WEEKEND_RATE;
        label = "Weekend";
      }

      nightly.push({
        date: format(d, "EEE, MMM d"),
        rate,
        label
      });

      total += rate;
      d = addDays(d, 1);
    }

    setPricing({ nightly, total });
  }

  const canBook = range?.from && range?.to && pricing;

  return (
    <main style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem" }}>Book Your Stay</h1>

      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        numberOfMonths={2}
        captionLayout="dropdown"
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
        showOutsideDays
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {pricing && (
        <div style={cardStyle}>
          <h2>Pricing Summary</h2>
          {pricing.nightly.map((n, i) => (
            <div key={i} style={rowStyle}>
              <span>{n.date} ({n.label})</span>
              <span>${n.rate}</span>
            </div>
          ))}
          <hr />
          <div style={{ ...rowStyle, fontWeight: "bold" }}>
            <span>Total</span>
            <span>${pricing.total.toLocaleString()}</span>
          </div>
        </div>
      )}

      <button
        disabled={!canBook}
        onClick={() => {
          sessionStorage.setItem(
            "booking",
            JSON.stringify({
              from: range.from,
              to: range.to,
              pricing
            })
          );
          window.location.href = "/reserve";
        }}
        style={buttonStyle(canBook)}
      >
        Book Now
      </button>
    </main>
  );
}

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 6
};

const cardStyle = {
  marginTop: "2rem",
  padding: "1.5rem",
  border: "1px solid #ddd",
  borderRadius: 8,
  background: "#fafafa"
};

const buttonStyle = (enabled) => ({
  marginTop: "2rem",
  padding: "1rem 2rem",
  fontSize: "1.25rem",
  borderRadius: 8,
  border: "none",
  cursor: enabled ? "pointer" : "not-allowed",
  backgroundColor: enabled ? "#003366" : "#ccc",
  color: "white"
});


