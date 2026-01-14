"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  parse,
  isValid,
  format,
  differenceInCalendarDays
} from "date-fns";

// configuration
const MIN_NIGHTS = 3;
const WEEKDAY_RATE = 750;
const WEEKEND_RATE = 950;
const CLEANING_FEE = 200;

export default function BookingPage() {
  // state
  const [disabledDates, setDisabledDates] = useState([]);
  const [checkInText, setCheckInText] = useState("");
  const [checkOutText, setCheckOutText] = useState("");
  const [range, setRange] = useState({ from: null, to: null });
  const [error, setError] = useState("");
  const [totalPrice, setTotalPrice] = useState(null);

  // load blocked dates
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

  // calendar selection logic
  function handleCalendarSelect(selected) {
    setError("");
    if (!selected?.from) {
      setRange({ from: null, to: null });
      setCheckInText("");
      setCheckOutText("");
      return;
    }
    const from = selected.from;
    let to = selected.to ?? null;

    // don’t immediately auto select — let user pick
    setRange({ from, to });

    if (to) {
      setCheckInText(format(from, "MM/dd/yyyy"));
      setCheckOutText(format(to, "MM/dd/yyyy"));
      calculatePrice(from, to);
    }
  }

  // typing logic (text → calendar)
  function handleTextChange(type, value) {
    setError("");
    if (type === "from") setCheckInText(value);
    if (type === "to") setCheckOutText(value);

    const parsedFrom = parse(checkInText, "MM/dd/yyyy", new Date());
    const parsedTo = parse(checkOutText, "MM/dd/yyyy", new Date());

    if (type === "from" && isValid(parsedFrom)) {
      setRange({ from: parsedFrom, to: range.to });
    }
    if (
      type === "to" &&
      isValid(parsedFrom) &&
      isValid(parsedTo) &&
      differenceInCalendarDays(parsedTo, parsedFrom) >= MIN_NIGHTS
    ) {
      setRange({ from: parsedFrom, to: parsedTo });
      calculatePrice(parsedFrom, parsedTo);
    }
  }

  // price calculation
  function calculatePrice(from, to) {
    let nights = differenceInCalendarDays(to, from);
    let sum = 0;
    for (let i = 0; i < nights; i++) {
      let date = new Date(from);
      date.setDate(date.getDate() + i);
      const day = date.getDay();
      // weekend Fri/Sat = 5,6 (0 = Sunday)
      sum += day === 5 || day === 6 ? WEEKEND_RATE : WEEKDAY_RATE;
    }
    sum += CLEANING_FEE;
    setTotalPrice(sum);
  }

  // render
  return (
    <main style={{ padding: "2rem", maxWidth: 720, margin: "auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
        Check Availability
      </h1>

      {/* inputs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ flex: 1 }}>
          <label>Check-in</label>
          <input
            type="text"
            placeholder="MM/DD/YYYY"
            value={checkInText}
            onChange={(e) => handleTextChange("from", e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>Check-out</label>
          <input
            type="text"
            placeholder="MM/DD/YYYY"
            value={checkOutText}
            onChange={(e) => handleTextChange("to", e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      {/* calendar */}
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleCalendarSelect}
        numberOfMonths={2}
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

      {/* error */}
      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
      )}

      {/* summary */}
      {range.from && range.to && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            border: "1px solid #ccc",
            borderRadius: 8,
            background: "#fafafa"
          }}
        >
          <h2 style={{ marginBottom: "0.5rem" }}>Reservation Summary</h2>
          <p>
            <strong>Check-in:</strong>{" "}
            {range.from.toDateString()}
          </p>
          <p>
            <strong>Check-out:</strong>{" "}
            {range.to.toDateString()}
          </p>
          <p>
            <strong>Nights:</strong>{" "}
            {differenceInCalendarDays(range.to, range.from)}
          </p>
          {totalPrice !== null && (
            <p style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
              Estimated Total: ${totalPrice.toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* CTA */}
      {range.from && range.to && (
        <button
          style={buttonStyle}
          disabled={!range.from || !range.to}
          onClick={() => alert("Next: guest info / payment")}
        >
          Reserve Now
        </button>
      )}
    </main>
  );
}

// simple styles
const inputStyle = {
  padding: "0.6rem",
  fontSize: "1rem",
  border: "1px solid #ccc",
  borderRadius: 6,
  width: "100%"
};

const buttonStyle = {
  marginTop: "1.5rem",
  padding: "0.9rem 1.8rem",
  fontSize: "1.2rem",
  backgroundColor: "#004080",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};
