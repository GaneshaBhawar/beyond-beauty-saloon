import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeContext';

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
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased selection:bg-salon-rose selection:text-white">
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
