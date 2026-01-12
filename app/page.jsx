export default function HomePage() {
  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Dockside Alexandria</h1>

      <p>
        Welcome to Dockside Alexandria — a lakefront vacation rental in
        Alexandria, Minnesota.
      </p>

      <a
        href="/book"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "12px 20px",
          background: "#000",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "6px",
        }}
      >
        Book Your Stay
      </a>
    </main>
  );
}
