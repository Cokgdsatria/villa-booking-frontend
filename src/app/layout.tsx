import "./global.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Villa Booking",
  description: "Villa Booking Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
