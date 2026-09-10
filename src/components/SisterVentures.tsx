import React, { useState } from 'react';
import { 
  Building2, 
  Ship, 
  Plane, 
  Truck, 
  Warehouse, 
  Globe2, 
  Passport, 
  Hotel, 
  Map, 
  Users, 
  ArrowUpRight, 
  MessageSquare, 
  PhoneCall, 
  CheckCircle2, 
  Eye, 
  X,
  Sparkles
} from 'lucide-react';
import { CONTACT_INFO } from '../data/inventory';

export const SisterVentures: React.FC = () => {
  const [selectedFlyer, setSelectedFlyer] = useState<{ title: string; image: string } | null>(null);

  const logisticsServices = [
    { name: 'Sea Freight (FCL & LCL)', icon: Ship, desc: 'Cost-effective global ocean freight forwarding to Tema Port & Takoradi.' },
    { name: 'Air Freight Cargo', icon: Plane, desc: 'Time-critical air cargo handling from Europe, USA, UAE & China.' },
    { name: 'Secure Cargo Storage', icon: Warehouse, desc: 'State-of-the-art bonded warehousing and container storage facilities.' },
    { name: 'Freight Forwarding', icon: Globe2, desc: 'End-to-end multimodal transport solutions tailored for businesses.' },
    { name: 'Road Freight & Haulage', icon: Truck, desc: 'Heavy-duty transport & flatbed trucking across all 16 regions of Ghana.' },
    { name: 'Customs Clearance', icon: CheckCircle2, desc: 'Fast-track ICUMS documentation, physical exam escort & duty payment.' },
  ];

  const travelServices = [
    { name: 'Visa Assistance', icon: Globe2, desc: 'Expert advisory, document vetting & interview coaching for USA, UK, Schengen & Canada.' },
    { name: 'Flight Bookings', icon: Plane, desc: 'Competitive international airfare ticketing across all major commercial airlines.' },
    { name: 'Hotel Reservations', icon: Hotel, desc: 'Hand-picked luxury, boutique & business accommodations worldwide at corporate rates.' },
    { name: 'Guided Tours & Safaris', icon: Map, desc: 'Curated vacation itineraries, domestic Ghana eco-tours & safari adventures.' },
    { name: 'Corporate & Group Travel', icon: Users, desc: 'Turnkey logistics for business delegations, trade fairs & church pilgrimages.' },
    { name: 'Airport Transfers', icon: Truck, desc: 'VIP executive chauffeur pick-up & drop-off at Kotoka International Airport (KIA).' },
  ];

  const openWhatsApp = (ventureName: string, service?: string) => {
    const text = service 
      ? `Hello! I would like to inquire about ${ventureName} - specifically your "${service}" service.`
      : `Hello! I am contacting you regarding ${ventureName} to discuss collaboration / service booking.`;
    window.open(`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="sister-ventures" className="py-24 bg-dark-900 relative overflow-hidden border-t border-dark-700/50">
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Building2 className="w-3.5 h-3.5" />
            <span>The Jackdan Group Ecosystem</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Integrated <span className="gold-gradient-text">Sister Ventures</span>
          </h2>
          <p className="mt-4 text-dark-300 text-base sm:text-lg">
            Beyond automobile sales, our group delivers complete end-to-end commercial logistics, international freight forwarding, and premium travel consultancy.
          </p>
        </div>

        {/* Ventures Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Venture 1: Twumaasco Logistics & Trading */}
          <div className="rounded-3xl bg-dark-800/80 border border-dark-700 hover:border-gold-500/50 backdrop-blur-xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group">
            <div>
              {/* Badge & Flyer Peek */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  Freight & Commercial Trading
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedFlyer({ title: 'Twumaasco Logistics & Trading Official Flyer', image: '/assets/1_20260909_140844_0000.png' })}
                  className="flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 font-medium"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Official Flyer</span>
                </button>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-2 mb-6">
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white group-hover:text-gold-300 transition-colors">
                  Twumaasco Logistics & Trading
                </h3>
                <p className="text-gold-400 text-sm font-semibold tracking-wide uppercase">
                  "Your Trusted Logistics Partner"
                </p>
                <p className="text-dark-300 text-sm leading-relaxed pt-1">
                  Specialized multimodal freight forwarding, bonded container yard management, and commercial transport serving businesses across West Africa with uncompromising safety.
                </p>
              </div>

              {/* Services List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {logisticsServices.map((srv, idx) => {
                  const Icon = srv.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => openWhatsApp('Twumaasco Logistics', srv.name)}
                      className="p-3.5 rounded-xl bg-dark-900/70 border border-dark-700/60 hover:border-gold-500/40 hover:bg-dark-900 transition-all cursor-pointer group/item"
                    >
                      <div className="flex items-center gap-2.5 mb-1">
                        <Icon className="w-4 h-4 text-gold-400 group-hover/item:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white group-hover/item:text-gold-300">{srv.name}</span>
                      </div>
                      <p className="text-[11px] text-dark-400 leading-snug">{srv.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA bar */}
            <div className="pt-6 border-t border-dark-700/80 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => openWhatsApp('Twumaasco Logistics & Trading')}
                className="w-full sm:w-auto flex-1 gold-gradient-btn py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Inquire with Twumaasco Logistics</span>
              </button>
              <a
                href={`tel:${CONTACT_INFO.primaryPhoneFormatted}`}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-dark-600 hover:border-gold-500/40 bg-dark-900 text-dark-200 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-gold-400" />
                <span>Call Desk</span>
              </a>
            </div>
          </div>

          {/* Venture 2: Jackdan Travel & Tour */}
          <div className="rounded-3xl bg-dark-800/80 border border-dark-700 hover:border-gold-500/50 backdrop-blur-xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group">
            <div>
              {/* Badge & Flyer Peek */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  Global Travel & Hospitality
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedFlyer({ title: 'Jackdan Travel & Tour Official Flyer', image: '/assets/2_20260909_140845_0001.png' })}
                  className="flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 font-medium"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Official Flyer</span>
                </button>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-2 mb-6">
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white group-hover:text-gold-300 transition-colors">
                  Jackdan Travel & Tour
                </h3>
                <p className="text-gold-400 text-sm font-semibold tracking-wide uppercase">
                  "Your Journey, Our Priority"
                </p>
                <p className="text-dark-300 text-sm leading-relaxed pt-1">
                  Turnkey travel consultancy dedicated to stress-free visa packaging, corporate flight reservations, VIP hotel bookings, and memorable guided worldwide vacation excursions.
                </p>
              </div>

              {/* Services List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {travelServices.map((srv, idx) => {
                  const Icon = srv.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => openWhatsApp('Jackdan Travel & Tour', srv.name)}
                      className="p-3.5 rounded-xl bg-dark-900/70 border border-dark-700/60 hover:border-gold-500/40 hover:bg-dark-900 transition-all cursor-pointer group/item"
                    >
                      <div className="flex items-center gap-2.5 mb-1">
                        <Icon className="w-4 h-4 text-gold-400 group-hover/item:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white group-hover/item:text-gold-300">{srv.name}</span>
                      </div>
                      <p className="text-[11px] text-dark-400 leading-snug">{srv.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA bar */}
            <div className="pt-6 border-t border-dark-700/80 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => openWhatsApp('Jackdan Travel & Tour')}
                className="w-full sm:w-auto flex-1 gold-gradient-btn py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Book with Jackdan Travel</span>
              </button>
              <a
                href={`tel:${CONTACT_INFO.secondaryPhoneFormatted}`}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-dark-600 hover:border-gold-500/40 bg-dark-900 text-dark-200 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-gold-400" />
                <span>Call Travel Desk</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Flyer Lightbox Modal */}
      {selectedFlyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-2xl w-full bg-dark-900 border border-gold-500/40 rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-dark-700 mb-4">
              <h4 className="font-heading font-bold text-white text-lg">{selectedFlyer.title}</h4>
              <button
                type="button"
                onClick={() => setSelectedFlyer(null)}
                className="p-1.5 rounded-lg text-dark-400 hover:text-white bg-dark-800 hover:bg-dark-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-dark-950 flex items-center justify-center max-h-[75vh]">
              <img
                src={selectedFlyer.image}
                alt={selectedFlyer.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
