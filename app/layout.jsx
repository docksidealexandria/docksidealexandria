export const metadata = {
  title: "Dockside Alexandria",
  description: "Lakefront vacation rental in Alexandria, MN",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
