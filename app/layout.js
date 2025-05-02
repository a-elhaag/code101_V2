import "./globals.css";

export const metadata = {
  title: "Code101",
  description: "Explore and submit open-source projects",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}