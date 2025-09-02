import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hack the Firewall - College Coding Club',
  description: 'An ice-breaker hacking game for new students',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-mono">{children}</body>
    </html>
  );
}