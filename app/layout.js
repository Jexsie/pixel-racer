import "./globals.css";

export const metadata = {
  title: "Pixel Racer - Retro Racing Game",
  description: "A pixelated car racing game with retro arcade vibes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
