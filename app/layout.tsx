import '../styles/globals.css';
import React from 'react';
import { ThemeProvider } from '../components/ThemeProvider';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Portfolio AI Pro',
  description: 'Build premium portfolios powered by AI.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <div className="aurora-bg" aria-hidden />
            <Nav />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
