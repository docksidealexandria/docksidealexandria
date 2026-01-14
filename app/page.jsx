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

      <a
        href="/book"
        style={{
          display: "inline-block",
          padding: "14px 24px",
          backgroundColor: "#0f172a",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
          fontSize: "1.1rem",
        }}
      >
        Check Availability
      </a>
    </main>
  );
}
