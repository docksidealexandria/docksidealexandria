"use client";

import { useState } from "react";
import { differenceInDays, eachDayOfInterval, format } from "date-fns";

export default function BookingPage() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const cleaningFee = 200;
  const deposit = 500;

  const nights =
    checkIn && checkOut
      ? differenceInDays(new Date(checkOut), new Date(checkIn))
      : 0;

  const isValidStay = nights >= 3;

  const calculateNightlyTotal = () => {
    if (!checkIn || !checkOut) return 0;

    const days = eachDayOfInterval({
      start: new Date(checkIn),
      end: new Date(checkOut),
    }).slice(0, -1);

    return days.reduce((total, day) => {
      const dayOfWeek = day.getDay();
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
      return total + (isWeekend ? 950 : 750);
    }, 0);
  };

  const nightlyTotal = calculateNightlyTotal();
  const total = nightlyTotal + cleaningFee;
  const remainingBalance = total - deposit;

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <h1>Book Dockside Alexandria</h1>

      <label>Check-in</label>
      <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />

      <label>Check-out</label>
      <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />

      {checkIn && checkOut && (
        <>
          <p>Nights: {nights}</p>

          {!isValidStay && (
            <p style={{ color: "red" }}>Minimum stay is 3 nights.</p>
          )}

          {isValidStay && (
            <>
              <p>Nightly total: ${nightlyTotal}</p>
              <p>Cleaning fee: ${cleaningFee}</p>
              <hr />
              <p><strong>Total stay: ${total}</strong></p>
              <p>Deposit due today: ${deposit}</p>
              <p>Remaining balance charged 14 days before check-in: ${remainingBalance}</p>

              <button style={{ marginTop: 20 }}>
                Reserve Now
              </button>
            </>
          )}
        </>
      )}
    </main>
  );
}
