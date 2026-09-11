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
  PhoneCall,
  Copy,
  Check,
  ExternalLink,
  Compass,
  Building2,
  Ship,
  Plane
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
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(CONTACT_INFO.fullAddressWithCompany);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

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
    <section id="contact" className="py-12 bg-dark-950 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
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
                <h3 className="font-heading text-2xl font-bold text-white mb-2">Corporate Headquarters</h3>
                <p className="text-dark-300 text-sm leading-relaxed">
                  Located in the heart of Accra's automotive commercial district, serving clients across all 16 regions of Ghana and international buyers.
                </p>
              </div>

              {/* Exact Physical Address Card */}
              <div className="p-5 rounded-2xl bg-dark-950 border border-gold-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gold-400 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-gold-400" />
                  <span>Physical & Postal Address</span>
                </div>
                
                <div className="text-white font-mono text-xs sm:text-sm leading-relaxed">
                  <strong>{CONTACT_INFO.companyName}</strong>
                  <br />
                  {CONTACT_INFO.poBox}
                  <br />
                  {CONTACT_INFO.landmark}
                  <br />
                  {CONTACT_INFO.area}, {CONTACT_INFO.city}, {CONTACT_INFO.country}
                </div>

                <div className="pt-2 border-t border-dark-800 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-dark-200 hover:text-white text-xs font-semibold transition-colors"
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gold-400" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>

                  <a
                    href={CONTACT_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 text-xs font-semibold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Google Maps</span>
                  </a>
                </div>
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
                  <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <span>Licensed Port Clearing Broker (ICUMS Compliant)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-dark-300">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <span>100% OEM Genuine Parts & Verified Clean Titles</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-dark-300">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
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
                Fill out the form below. It will format your request and connect immediately to our senior desk on WhatsApp.
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
                      placeholder="e.g. Kwame Mensah"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-dark-950 border border-dark-700 text-white placeholder-dark-500 text-sm focus:border-gold-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-2">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      placeholder="e.g. 024 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-dark-950 border border-dark-700 text-white placeholder-dark-500 text-sm focus:border-gold-500 focus:outline-none transition-colors"
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
                      placeholder="e.g. kwame@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-dark-950 border border-dark-700 text-white placeholder-dark-500 text-sm focus:border-gold-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-service" className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-2">
                      Service of Interest *
                    </label>
                    <select
                      id="contact-service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-dark-950 border border-dark-700 text-white text-sm focus:border-gold-500 focus:outline-none transition-colors"
                    >
                      <option value="auto_import">Automobile Sourcing & Importation</option>
                      <option value="spare_parts">OEM Genuine Spare Parts Order</option>
                      <option value="duty_clearing">Customs Clearing (ICUMS/Tema)</option>
                      <option value="twumaasco_logistics">Twumaasco Freight & Cargo Logistics</option>
                      <option value="jackdan_travel">Jackdan Travel & Tour (Visa/Flights)</option>
                      <option value="general">Corporate Distributorship & Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-2">
                    Message / Specification Details *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Tell us vehicle specs (make/year), spare part numbers, freight container sizes, or travel requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-dark-950 border border-dark-700 text-white placeholder-dark-500 text-sm focus:border-gold-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full gold-gradient-btn py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl hover:shadow-gold-500/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message & Chat on WhatsApp</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
