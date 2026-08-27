import '../styles/globals.css';
import React from 'react';
import { ThemeProvider } from '../components/ThemeProvider';
import { ToastProvider } from '../components/ui/toast';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';

export const metadata = {
  title: 'Portfolio AI Pro',
  description: 'Build premium portfolios powered by AI.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
<body>
        <ThemeProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col">
              <div className="aurora-bg" aria-hidden />
              <Nav />
              <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">{children}</main>
              <Footer />
              <BackButton />
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
