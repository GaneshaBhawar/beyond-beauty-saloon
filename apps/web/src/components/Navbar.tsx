'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Calendar, User, ArrowRight, Phone } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#EAE6E3]'
          : 'bg-white/90 backdrop-blur-xs border-b border-[#EAE6E3]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-[84px] gap-2">
          
          {/* Left: Brand Identity */}
          <Link href="/" className="shrink min-w-0 flex items-center group" aria-label="Beyond Beauty Saloon Home">
            <BrandLogo variant="navbar" />
          </Link>

          {/* Center / Right: Nav Links & Prominent Booking CTA */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Desktop Navigation Links */}
            <nav className="flex items-center space-x-7 text-[14px] font-semibold text-[#272525]" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href.startsWith('/#') && pathname === '/');
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`py-1 border-b-2 font-medium tracking-tight transition-colors duration-200 ${
                      isActive && link.href === pathname
                        ? 'border-[#B76E79] text-[#B76E79] font-bold'
                        : 'border-transparent text-[#272525] hover:text-[#B76E79]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Separator Line */}
            <div className="h-5 w-px bg-[#EAE6E3]" />

            {/* Actions: Prominent 'Book Now' + Discreet Portal Login */}
            <div className="flex items-center space-x-3">
              <Link
                href="/book"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase text-white bg-[#B76E79] hover:bg-[#9A5A64] shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Book Now
              </Link>

              {/* Discreet portal link */}
              <Link
                href="/login"
                className="p-2 rounded-full border border-[#EAE6E3] hover:border-[#B76E79] text-[#707070] hover:text-[#B76E79] transition-colors"
                title="Staff & Admin Portal Login"
                aria-label="Staff and Admin Portal Login"
              >
                <User className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex lg:hidden items-center space-x-1.5 sm:space-x-2 shrink-0">
            <Link
              href="/book"
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-wide text-white bg-[#B76E79] hover:bg-[#9A5A64] shadow-xs flex items-center shrink-0 transition-colors"
            >
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
              <span>Book<span className="hidden xs:inline"> Now</span></span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-xl text-[#272525] hover:text-[#B76E79] hover:bg-[#FAF8F5] transition-colors border border-[#EAE6E3] shrink-0"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#EAE6E3] bg-white px-5 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1 font-medium text-[#272525]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#FAF8F5] text-[#B76E79] font-bold'
                      : 'hover:bg-[#FAF8F5] text-[#272525] hover:text-[#B76E79]'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                </Link>
              );
            })}
          </div>

          {/* Mobile Drawer CTAs */}
          <div className="pt-3 border-t border-[#EAE6E3] space-y-2.5">
            <Link
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center py-3 bg-[#B76E79] text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-xs hover:bg-[#9A5A64] transition-all"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment Online
            </Link>

            <a
              href="tel:+919823573781"
              className="w-full flex items-center justify-center py-2.5 rounded-2xl border border-[#EAE6E3] text-[#272525] text-xs font-semibold hover:bg-[#FAF8F5] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 mr-2 text-[#C7A77D]" />
              Call Studio: +91 98235 73781
            </a>

            <div className="pt-1 flex items-center justify-between text-xs text-[#707070] px-1">
              <span>Authorized Access:</span>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#B76E79] hover:underline font-semibold"
              >
                Staff / Admin Portal Login &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
