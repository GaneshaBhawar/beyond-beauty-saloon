import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FAF8F5',
};

export const metadata: Metadata = {
  title: 'Beyond Beauty Saloon | Luxury Hair, Skin & Bridal Studio in Savedi, Ahilyanagar',
  description:
    'Indulge in couture hair styling, restorative hair spas, clinical skin glow therapies, and royal bridal makeovers at Beyond Beauty Saloon in Savedi, Ahilyanagar. Reserve your appointment online.',
  keywords: [
    'Beyond Beauty Saloon',
    'Salon in Ahilyanagar',
    'Salon in Savedi',
    'Haircut Ahilyanagar',
    'Bridal Makeup Ahilyanagar',
    'Hair Spa Ahilyanagar',
    'Facials & Skincare',
    'Beauty Studio Maharashtra',
  ],
  authors: [{ name: 'Beyond Beauty Saloon' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden w-full max-w-full">
      <body className="min-h-screen flex flex-col antialiased selection:bg-salon-rose selection:text-white overflow-x-hidden w-full max-w-full relative">
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow w-full max-w-full overflow-x-hidden">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
