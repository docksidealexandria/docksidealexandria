"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  parse,
  isValid,
  format,
  differenceInCalendarDays,
  isAfter
} from "date-fns";

// price constants (we’ll extend pricing later)
const MIN_NIGHTS = 3;

export default function BookingPage() {
  const [disabledDates, setDisabledDates] = useState([]);
  const [range, setRange] = useState({ from: null, to: null });

// store input text separately
  const [checkInText, setCheckInText] = useState("");
  const [checkOutText, setCheckOutText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/calendar")
      .then((res) => res.json())
      .then((data) => {
        const blocked = data.bookings.flatMap((b) => {
          const arr = [];
          let d = new Date(b.start);
          const end = new Date(b.end);
          while (d < end) {
            arr.push(new Date(d));
            d.setDate(d.getDate() + 1);
          }
          return arr;
        });
        setDisabledDates(blocked);
      });
  }, []);

  // synchronize text inputs into date range
  function trySyncInputsToCalendar() {
    setError("");

    const fromParsed = parse(checkInText, "MM/dd/yyyy", new Date());
    const toParsed = parse(checkOutText, "MM/dd/yyyy", new Date());

    if (
      isValid(fromParsed) &&
      (!checkOutText ||
       (isValid(toParsed) &&
        isAfter(toParsed, fromParsed))) // require > from
    ) {
      const newRange = { from: fromParsed };

      // if to is valid and >= min nights
      if (isValid(toParsed)) {
        const nights = differenceInCalendarDays(toParsed, fromParsed);
        if (nights < MIN_NIGHTS) {
          setError(`Minimum stay is ${MIN_NIGHTS} nights`);
        } else {
          newRange.to = toParsed;
        }
      }

      setRange(newRange);
    }
  }

  // handle key/blur for checkin
  function onCheckInKey(e) {
    setCheckInText(e.target.value);
    if (e.key === "Enter") {
      trySyncInputsToCalendar();
    }
  }
  function onCheckInBlur() {
    trySyncInputsToCalendar();
  }

  // handle key/blur for checkout
  function onCheckOutKey(e) {
    setCheckOutText(e.target.value);
    if (e.key === "Enter") {
      trySyncInputsToCalendar();
    }
  }
  function onCheckOutBlur() {
    trySyncInputsToCalendar();
  }

  // calendar interactions sync back to inputs
  function handleCalendarSelect(selected) {
    setError("");
    if (!selected?.from) {
      setRange({ from: null, to: null });
      setCheckInText("");
      setCheckOutText("");
      return;
    }

    const from = selected.from;
    let to = selected.to;

    // enforce minimum nights
    if (to) {
      const nights = differenceInCalendarDays(to, from);
      if (nights < MIN_NIGHTS) {
        setError(`Minimum stay is ${MIN_NIGHTS} nights`);
        // keep selecting but do not auto-set to
        to = null;
      }
    }

    // update text inputs
    setCheckInText(format(from, "MM/dd/yyyy"));
    setCheckOutText(to ? format(to, "MM/dd/yyyy") : "");

    setRange({ from, to });
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 700 }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Select Your Stay
      </h1>

      {/* date inputs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ flex: 1 }}>
          <label>Check-in</label>
          <input
            type="text"
            placeholder="MM/DD/YYYY"
            value={checkInText}
            onKeyUp={onCheckInKey}
            onBlur={onCheckInBlur}
            onChange={(e) => setCheckInText(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>Check-out</label>
          <input
            type="text"
            placeholder="MM/DD/YYYY"
            value={checkOutText}
            onKeyUp={onCheckOutKey}
            onBlur={onCheckOutBlur}
            onChange={(e) => setCheckOutText(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleCalendarSelect}
        numberOfMonths={2}
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

      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
      )}
    </main>
  );
}

const inputStyle = {
  padding: "0.6rem",
  fontSize: "1rem",
  border: "1px solid #ccc",
  borderRadius: 6,
  width: "100%"
};
