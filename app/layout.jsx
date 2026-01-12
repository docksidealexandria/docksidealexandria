export const metadata = {
  title: "Dockside Alexandria",
  description: "Luxury lakefront vacation rental on Lake Le Homme Dieu in Alexandria, MN"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

