import "./globals.css";
import "../visuals/lockAnimations.css";
export const metadata = {
  title: "SEVENFOLD — Seven locks. One buried truth.",
  description:
    "An antique mechanical mystery. Align the four rings and reveal the first seal.",
};
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
