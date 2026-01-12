export default function HomePage() {
  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
        Dockside Alexandria
      </h1>

      <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
        Lakefront vacation rental in Alexandria, Minnesota.
      </p>

      <img
        src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
        alt="Lake house"
        style={{
          width: "100%",
          borderRadius: "12px",
          marginBottom: "30px",
        }}
      />

      <section style={{ marginBottom: "30px" }}>
        <h2>About the Property</h2>
        <p>
          Enjoy a relaxing stay right on the water in Alexandria, MN. Perfect
          for families, lake weekends, and summer getaways.
        </p>
        <ul>
          <li>Lakefront access</li>
          <li>3-night minimum stay</li>
          <li>$500 deposit</li>
          <li>Balance due 14 days before arrival</li>
        </ul>
      </section>

      <a
        href="/book"
        style={{
          display: "inline-block",
          padding: "15px 25px",
          backgroundColor: "#0070f3",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontSize: "1.1rem",
        }}
      >
        Check Availability & Book
      </a>
    </main>
  );
}
