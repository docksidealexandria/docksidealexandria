"use client";

import { useEffect, useState } from "react";
import { format, differenceInCalendarDays } from "date-fns";

export default function ReservePage() {
  const [booking, setBooking] = useState(null);
  const [guest, setGuest] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
    agree: false
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("booking");
    if (stored) setBooking(JSON.parse(stored));
  }, []);

  if (!booking) return <p style={{ padding: "2rem" }}>Loading…</p>;

  const nights = differenceInCalendarDays(
    new Date(booking.to),
    new Date(booking.from)
  );

  const canContinue =
    guest.first &&
    guest.last &&
    guest.email &&
    guest.phone &&
    guest.agree;

  return (
    <main style={{ padding: "2rem", maxWidth: 700, margin: "0 auto" }}>
      <h1>Confirm Your Reservation</h1>

      <div style={cardStyle}>
        <h2>Stay Details</h2>
        <p><strong>Check-in:</strong> {format(new Date(booking.from), "MMMM d, yyyy")}</p>
        <p><strong>Check-out:</strong> {format(new Date(booking.to), "MMMM d, yyyy")}</p>
        <p><strong>Nights:</strong> {nights}</p>
        <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          Total: ${booking.pricing.total.toLocaleString()}
        </p>
      </div>

      <div style={cardStyle}>
        <h2>Guest Information</h2>

        <input placeholder="First Name" style={inputStyle}
          onChange={e => setGuest({ ...guest, first: e.target.value })} />
        <input placeholder="Last Name" style={inputStyle}
          onChange={e => setGuest({ ...guest, last: e.target.value })} />
        <input placeholder="Email" style={inputStyle}
          onChange={e => setGuest({ ...guest, email: e.target.value })} />
        <input placeholder="Phone" style={inputStyle}
          onChange={e => setGuest({ ...guest, phone: e.target.value })} />

        <label style={{ marginTop: "1rem", display: "flex", gap: 8 }}>
          <input type="checkbox"
            onChange={e => setGuest({ ...guest, agree: e.target.checked })} />
          I agree to the house rules and cancellation policy
        </label>
      </div>

      <button
        disabled={!canContinue}
        onClick={() => alert("Next: Stripe payment")}
        style={buttonStyle(canContinue)}
      >
        Continue to Payment
      </button>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.7rem",
  marginTop: "0.75rem",
  borderRadius: 6,
  border: "1px solid #ccc"
};

const cardStyle = {
  padding: "1.5rem",
  border: "1px solid #ddd",
  borderRadius: 8,
  marginBottom: "1.5rem",
  background: "#fafafa"
};

const buttonStyle = (enabled) => ({
  padding: "1rem 2rem",
  fontSize: "1.25rem",
  borderRadius: 8,
  border: "none",
  cursor: enabled ? "pointer" : "not-allowed",
  backgroundColor: enabled ? "#003366" : "#ccc",
  color: "white"
});
