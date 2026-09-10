import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { CONTACT_INFO } from '../data/inventory';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    service: 'auto_import',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format message for direct WhatsApp sending
    const text = `Hello Jackdan Premium Ventures!
New Website Inquiry:
- Name: ${formData.fullName}
- Phone: ${formData.phone}
- Email: ${formData.email || 'Not provided'}
- Service: ${formData.service.replace('_', ' ').toUpperCase()}
- Message: ${formData.message}`;

    const whatsappUrl = `https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-dark-950 relative overflow-hidden border-t border-dark-800">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Concierge Desk</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Connect with <span className="gold-gradient-text">Jackdan Premium</span>
          </h2>
          <p className="mt-4 text-dark-300 text-base sm:text-lg">
            Speak directly with our automotive import specialists, customs clearing officers, or spare parts procurement team today.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details & Info Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-dark-900/90 border border-gold-500/30 backdrop-blur-xl shadow-2xl space-y-8">
              <div>
                <h3 className="font-heading text-2xl font-bold text-white mb-2">Corporate Office</h3>
                <p className="text-dark-300 text-sm leading-relaxed">
                  Headquartered at the gateway of Ghana's international maritime trade corridor, serving clients across the country and the diaspora.
                </p>
              </div>

              {/* Direct Touchpoints */}
              <div className="space-y-5">
                {/* Phone 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0 text-gold-400">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-dark-400 font-semibold block">Primary Hotline & WhatsApp</span>
                    <a
                      href={`tel:${CONTACT_INFO.primaryPhoneFormatted}`}
                      className="text-white hover:text-gold-400 font-bold text-base transition-colors"
                    >
                      {CONTACT_INFO.phones[0]}
                    </a>
                    <div className="flex gap-3 mt-1">
                      <a
                        href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1 font-medium"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0 text-gold-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-dark-400 font-semibold block">Secondary Line & Dispatch</span>
                    <a
                      href={`tel:${CONTACT_INFO.secondaryPhoneFormatted}`}
                      className="text-white hover:text-gold-400 font-bold text-base transition-colors"
                    >
                      {CONTACT_INFO.phones[1]}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0 text-gold-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-dark-400 font-semibold block">Official Inquiries Email</span>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="text-white hover:text-gold-400 font-medium text-sm transition-colors break-all"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0 text-gold-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-dark-400 font-semibold block">Hub & Clearing Office</span>
                    <span className="text-white text-sm">
                      {CONTACT_INFO.address}
                    </span>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0 text-gold-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-dark-400 font-semibold block">Working Hours</span>
                    <span className="text-white text-sm">
                      Monday – Saturday: 8:00 AM – 6:00 PM GMT
                    </span>
                    <span className="block text-xs text-dark-400">24/7 WhatsApp emergency response</span>
                  </div>
                </div>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-6 border-t border-dark-700 space-y-2">
                <div className="flex items-center gap-2 text-xs text-dark-300">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>Licensed Port Clearing Agent (ICUMS Compliant)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-dark-300">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>100% OEM Genuine Parts & Verified Clean Titles</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-dark-300">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>Worldwide Door-to-Door & RoRo Freight Coverage</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-dark-900/90 border border-dark-700/80 backdrop-blur-xl shadow-2xl">
              <h3 className="font-heading text-2xl font-bold text-white mb-2">Send an Instant Inquiry</h3>
              <p className="text-dark-300 text-sm mb-8">
                Fill out the form below. It will connect immediately to our senior desk on WhatsApp for immediate quotation and paperwork.
              </p>

              {submitted && (
                <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-sm flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Thank you! Your message was formatted and directed to our dispatch desk on WhatsApp.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-fullname" className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      id="contact-fullname"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Kwabena Mensah"
                      className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-white placeholder-dark-400 focus:border-gold-500 focus:outline-none transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-2">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+233 XX XXX XXXX"
                      className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-white placeholder-dark-400 focus:border-gold-500 focus:outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-2">
                      Email Address (Optional)
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="youremail@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-white placeholder-dark-400 focus:border-gold-500 focus:outline-none transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-service" className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-2">
                      Service Requested *
                    </label>
                    <select
                      id="contact-service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-white focus:border-gold-500 focus:outline-none transition-colors text-sm"
                    >
                      <option value="auto_import">Automobile Custom Import / Sourcing</option>
                      <option value="showroom_car">Purchase Vehicle in Inventory</option>
                      <option value="spare_parts">OEM Spare Parts (Wholesale / Retail)</option>
                      <option value="customs_clearing">Port of Tema Customs Clearing</option>
                      <option value="twumaasco_freight">Twumaasco Logistics & Sea/Air Cargo</option>
                      <option value="jackdan_travel">Jackdan Travel & Tour (Visa/Flights)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-2">
                    Message / Vehicle Details / Inquiries *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what make, model, year, part number, or freight requirements you have..."
                    className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-white placeholder-dark-400 focus:border-gold-500 focus:outline-none transition-colors text-sm"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full gold-gradient-btn py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 text-sm sm:text-base shadow-xl"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Jackdan Desk via WhatsApp</span>
                  </button>
                  <p className="text-center text-[11px] text-dark-400 mt-2.5">
                    We respond within 15 minutes during standard operational hours.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
