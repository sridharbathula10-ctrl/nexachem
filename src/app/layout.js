import "./globals.css";

export const metadata = {
  title: "NexaChem | Industrial Chemical Supply Across UAE & GCC",
  description: "NexaChem Industrial Solutions Co. supports manufacturing, energy, and water infrastructure with chemical trading, distribution, and logistics across the UAE and GCC.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
