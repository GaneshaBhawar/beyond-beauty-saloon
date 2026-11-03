import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Instagram, Clock, MessageCircle, Navigation, ExternalLink } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  const googleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=Beyond+Beauty+Saloon+Shrikrishna+Nagar+Savedi+Ahilyanagar+Maharashtra+414003';

  return (
    <footer className="bg-[#272525] text-white pt-16 pb-12 border-t border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Info (col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            <BrandLogo variant="footer" />
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
              Savedi’s distinguished beauty sanctuary offering personalised hair styling, chemical treatments, clinical dermal therapies, and bridal couture in Ahilyanagar.
            </p>
            
            <div className="pt-1 flex items-center space-x-3">
              <a
                href="https://www.instagram.com/beyond__beauty_saloon/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium text-[#B76E79] hover:text-white hover:border-[#B76E79] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>@beyond__beauty_saloon</span>
              </a>

              <a
                href="https://wa.me/919823573781"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium text-emerald-400 hover:text-white hover:border-emerald-400 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Quick Links (col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#C7A77D]">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300">
              <li>
                <Link href="/" className="hover:text-[#B76E79] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#B76E79] transition-colors">
                  Services & Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#B76E79] transition-colors">
                  About Our Salon
                </Link>
              </li>
              <li>
                <Link href="/#gallery" className="hover:text-[#B76E79] transition-colors">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#B76E79] transition-colors">
                  Contact & Location
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-[#B76E79] transition-colors font-semibold text-[#B76E79]">
                  Book Appointment &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Categories (col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#C7A77D]">
              Service Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li>
                <Link href="/services?category=hair-styling" className="hover:text-[#B76E79] transition-colors flex items-center justify-between">
                  <span>Hair Care & Styling</span>
                  <span className="text-[11px] text-neutral-500">Haircuts & Layers</span>
                </Link>
              </li>
              <li>
                <Link href="/services?category=hair-care" className="hover:text-[#B76E79] transition-colors flex items-center justify-between">
                  <span>Chemical Treatments</span>
                  <span className="text-[11px] text-neutral-500">Color & Balayage</span>
                </Link>
              </li>
              <li>
                <Link href="/services?category=skin-care" className="hover:text-[#B76E79] transition-colors flex items-center justify-between">
                  <span>Skin Care & Spa</span>
                  <span className="text-[11px] text-neutral-500">Radiance Facials</span>
                </Link>
              </li>
              <li>
                <Link href="/services?category=makeup" className="hover:text-[#B76E79] transition-colors flex items-center justify-between">
                  <span>Makeup & Grooming</span>
                  <span className="text-[11px] text-neutral-500">Bridal & Basic</span>
                </Link>
              </li>
              <li>
                <Link href="/services?category=threading" className="hover:text-[#B76E79] transition-colors flex items-center justify-between">
                  <span>Threading & Waxing</span>
                  <span className="text-[11px] text-neutral-500">Eyebrow & Facial</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours & Studio Location (col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#C7A77D]">
              Studio & Working Hours
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-300">
              <div className="space-y-1">
                <div className="flex items-start space-x-2.5">
                  <Clock className="w-4 h-4 mt-0.5 text-[#C7A77D] shrink-0" />
                  <div>
                    <span className="font-semibold text-white block">Tuesday – Sunday</span>
                    <span className="text-xs text-neutral-400">8:30 AM – 9:30 PM</span>
                  </div>
                </div>
                <div className="pl-6 text-[11px] text-rose-400 font-medium">
                  Monday: Closed
                </div>
              </div>

              <div className="flex items-start space-x-2.5 pt-1">
                <MapPin className="w-4 h-4 mt-1 text-[#B76E79] shrink-0" />
                <div className="space-y-1">
                  <span className="text-xs leading-relaxed text-neutral-300 block">
                    Shrikrishna Nagar, Savedi, Ahilyanagar, Maharashtra 414003, India.
                  </span>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-[#C7A77D] hover:text-white font-medium underline transition-colors"
                  >
                    <Navigation className="w-3 h-3 mr-1" />
                    Get Directions on Google Maps
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 pt-1">
                <Phone className="w-4 h-4 text-[#B76E79] shrink-0" />
                <a href="tel:+919823573781" className="hover:text-[#C7A77D] transition-colors font-medium">
                  +91 98235 73781
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} Beyond Beauty Saloon. All rights reserved. Savedi, Ahilyanagar.
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="hover:text-neutral-300 transition-colors">
              Client Portal
            </Link>
            <span>•</span>
            <Link href="/employee" className="hover:text-neutral-300 transition-colors">
              Staff Portal
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-neutral-300 transition-colors">
              Admin Ops
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
