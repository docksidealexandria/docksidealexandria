"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  differenceInCalendarDays,
  parse,
  isValid,
  format
} from "date-fns";

export default function BookPage() {
  const [range, setRange] = useState();
  const [disabledDates, setDisabledDates] = useState([]);

  const MIN_NIGHTS = 3;

  // Load blocked dates
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

  // Calendar selection logic
  function handleSelect(selected) {
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
        alert(`Minimum stay is ${MIN_NIGHTS} nights`);
        return;
      }
    }

    setRange(selected);
  }

  // Typed input handlers
  function handleInputChange(type, value) {
    const parsed = parse(value, "MM/dd/yyyy", new Date());
    if (!isValid(parsed)) return;

    if (type === "from") {
      setRange({ from: parsed });
    }

    if (type === "to" && range?.from) {
      const nights = differenceInCalendarDays(parsed, range.from);
      if (nights < MIN_NIGHTS) {
        alert(`Minimum stay is ${MIN_NIGHTS} nights`);
        return;
      }
      setRange({ from: range.from, to: parsed });
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 700 }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Select Your Stay
      </h1>

      {/* Date Inputs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <label>Check-in</label>
          <input
            type="text"
            placeholder="MM/DD/YYYY"
            value={range?.from ? format(range.from, "MM/dd/yyyy") : ""}
            onChange={(e) =>
              handleInputChange("from", e.target.value)
            }
            style={inputStyle}
          />
        </div>

        <div>
          <label>Check-out</label>
          <input
            type="text"
            placeholder="MM/DD/YYYY"
            value={range?.to ? format(range.to, "MM/dd/yyyy") : ""}
            onChange={(e) =>
              handleInputChange("to", e.target.value)
            }
            style={inputStyle}
          />
        </div>
      </div>

      {/* Calendar */}
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        numberOfMonths={2}
        showOutsideDays
        disabled={disabledDates}
        modifiers={{
          blocked: disabledDates
        }}
        modifiersStyles={{
          blocked: {
            textDecoration: "line-through",
            color: "#999",
            backgroundColor: "#f5f5f5"
          }
        }}
      />

      {/* Info */}
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

const inputStyle = {
  padding: "0.5rem",
  fontSize: "1rem",
  border: "1px solid #ccc",
  borderRadius: 6,
  width: 140
};
