'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Clock,
  Instagram,
  Send,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SALON_IMAGES } from '@/data/salonImages';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceInterest, setServiceInterest] = useState('Hair Styling & Haircut');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do I need an appointment or do you take walk-ins?',
      a: 'Walk-ins are warmly welcomed during salon hours (10:00 AM – 8:00 PM). However, for signature haircuts, bridal services, or specific stylists like Priya or Sneha, reserving online or by phone guarantees zero waiting.',
    },
    {
      q: 'Where exactly in Savedi are you located?',
      a: 'We are situated in Shrikrishna Nagar / Savedi, right near Kohinoor Mangal Karyalaya, Ahilyanagar 414003. Dedicated customer parking is available right outside the studio.',
    },
    {
      q: 'Do you offer bridal makeup trials before the wedding date?',
      a: 'Yes, absolutely! We conduct customized bridal consultations and makeup trials to test shades, lip palettes, and hair architecture well in advance of your auspicious date.',
    },
    {
      q: 'What payment modes are accepted at the salon?',
      a: 'We accept all major payment modes including UPI (Google Pay, PhonePe, Paytm), Visa/Mastercard credit & debit cards, and cash.',
    },
  ];

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setName('');
      setPhone('');
      setMessage('');
    }, 700);
  };

  return (
    <div className="py-16 bg-salon-ivory min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-salon-rose-light text-xs font-semibold text-salon-rose-dark uppercase tracking-wider border border-salon-rose/20">
            <Sparkles className="w-3.5 h-3.5 text-salon-rose" />
            <span>Visit & Connect</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-salon-black">
            Location & Contact
          </h1>
          <p className="text-sm text-salon-muted">
            We are conveniently located in Savedi, Ahilyanagar. Reach out to schedule your visit or enquire about specialized bridal packages.
          </p>
        </div>

        {/* Contact Grid: Details + Working Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details Card (col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-salon-gray p-8 shadow-sm space-y-6">
              
              <div className="border-b border-salon-gray pb-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-salon-gold">
                  Direct Salon Contacts
                </span>
                <h3 className="font-serif text-2xl font-bold text-salon-black">
                  Beyond Beauty Saloon
                </h3>
                <p className="text-xs text-salon-muted mt-1">Savedi, Ahilyanagar, Maharashtra</p>
              </div>

              <div className="space-y-5 text-sm">
                
                {/* Address */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-full bg-salon-rose-light flex items-center justify-center text-salon-rose shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-salon-muted uppercase">Salon Address</h4>
                    <p className="text-xs sm:text-sm text-salon-black mt-1 leading-relaxed">
                      Shrikrishna Nagar / Savedi, near Kohinoor Mangal Karyalaya, Ahilyanagar, Maharashtra 414003, India
                    </p>
                  </div>
                </div>

                {/* Phones */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-full bg-salon-rose-light flex items-center justify-center text-salon-rose shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-salon-muted uppercase">Phone Bookings & Enquiries</h4>
                    <a
                      href="tel:+919823573781"
                      className="text-xs sm:text-sm font-bold text-salon-black hover:text-salon-rose block mt-1"
                    >
                      +91 98235 73781 (Primary Reception)
                    </a>
                    <a
                      href="tel:+919730768487"
                      className="text-xs sm:text-sm font-semibold text-salon-black hover:text-salon-rose block"
                    >
                      +91 97307 68487 (Alternate Line)
                    </a>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-full bg-salon-gold-light flex items-center justify-center text-salon-gold shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-salon-muted uppercase">Salon Working Hours</h4>
                    <p className="text-xs sm:text-sm text-salon-black mt-1 font-medium">
                      Monday to Sunday: <span className="font-bold">10:00 AM – 8:00 PM</span>
                    </p>
                    <p className="text-xs text-salon-muted mt-0.5">
                      Open 7 days a week including public holidays.
                    </p>
                  </div>
                </div>

                {/* Instant WhatsApp & Social */}
                <div className="pt-2 border-t border-salon-gray flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://wa.me/919823573781"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Direct</span>
                  </a>

                  <a
                    href="https://www.instagram.com/beyond__beauty_saloon/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-salon-rose-light border border-salon-rose/30 text-xs font-semibold text-salon-rose-dark hover:bg-salon-rose/20 transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>@beyond__beauty_saloon</span>
                  </a>
                </div>

              </div>

            </div>
          </div>

          {/* Contact Inquiry Form (col-span-7) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-salon-gray p-8 sm:p-10 shadow-sm space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-salon-rose">
                  Send a Message
                </span>
                <h3 className="font-serif text-2xl font-bold text-salon-black">
                  Inquire or Request Bridal Consultation
                </h3>
                <p className="text-xs text-salon-muted mt-1 leading-relaxed">
                  Have questions regarding customized treatments, bridal packages, or scheduling? Send a message and our reception team will respond promptly.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-8 bg-salon-rose-light/40 rounded-2xl border border-salon-rose/30 text-center space-y-4 animate-in fade-in duration-200">
                  <div className="w-12 h-12 rounded-full bg-salon-rose text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-salon-black">
                    Inquiry Sent Successfully!
                  </h4>
                  <p className="text-xs text-salon-muted max-w-sm mx-auto">
                    Thank you! Our front desk at Beyond Beauty Saloon will contact you shortly on your phone number.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="mt-2 px-5 py-2 rounded-full bg-salon-black text-white text-xs font-semibold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-salon-black mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Pooja Deshmukh"
                        className="w-full px-4 py-2.5 rounded-xl border border-salon-gray text-xs focus:outline-none focus:border-salon-rose"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-salon-black mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98..."
                        className="w-full px-4 py-2.5 rounded-xl border border-salon-gray text-xs focus:outline-none focus:border-salon-rose"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-salon-black mb-1">
                      Service Interest
                    </label>
                    <select
                      value={serviceInterest}
                      onChange={(e) => setServiceInterest(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-salon-gray text-xs focus:outline-none focus:border-salon-rose bg-white"
                    >
                      <option>Hair Styling & Haircut</option>
                      <option>L’Oréal Hair Spa & Scalp Therapy</option>
                      <option>Hair Color & Highlights Consultation</option>
                      <option>Facials & Skincare Glow</option>
                      <option>Bridal & Special Occasion Makeup</option>
                      <option>Threading & Grooming</option>
                      <option>General Enquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-salon-black mb-1">
                      Your Message / Preferred Dates
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about the occasion, preferred dates, or specific questions..."
                      className="w-full px-4 py-2.5 rounded-xl border border-salon-gray text-xs focus:outline-none focus:border-salon-rose"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-salon-muted">
                      We respect your privacy. No spam.
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-salon-black hover:bg-neutral-800 transition-colors shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5 mr-2" />
                      {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Embedded Interactive Map & Directions */}
        <div className="bg-white rounded-3xl border border-salon-gray overflow-hidden shadow-sm">
          <div className="p-6 border-b border-salon-gray flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-salon-gold">
                Map Location
              </span>
              <h3 className="font-serif text-xl font-bold text-salon-black">
                Find Beyond Beauty Saloon in Savedi
              </h3>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Beyond+Beauty+Saloon+Savedi+Ahilyanagar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-salon-rose hover:bg-salon-rose-dark transition-colors shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 mr-1.5" />
              Open in Google Maps
            </a>
          </div>

          <div className="h-80 w-full bg-neutral-100">
            <iframe
              title="Beyond Beauty Saloon Savedi Ahilyanagar Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.024921949318!2d74.729000!3d19.108000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA2JzI4LjgiTiA3NMKwNDMnNDQuNCJF!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Interactive FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-salon-rose">
              Got Questions?
            </span>
            <h2 className="font-serif text-3xl font-bold text-salon-black">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-salon-gray overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between text-xs sm:text-sm font-bold text-salon-black hover:text-salon-rose"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-salon-rose shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-salon-muted shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-salon-muted leading-relaxed border-t border-salon-gray/60 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
