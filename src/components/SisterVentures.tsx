import React, { useState } from 'react';
import { 
  Building2, 
  Ship, 
  Plane, 
  Truck, 
  Warehouse, 
  Globe2, 
  Hotel, 
  Map, 
  Users, 
  ArrowUpRight, 
  MessageSquare, 
  PhoneCall, 
  CheckCircle2, 
  Eye, 
  X,
  Sparkles,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { CONTACT_INFO } from '../data/inventory';

interface SisterVenturesProps {
  onNavigate?: (pageId: string) => void;
}

export const SisterVentures: React.FC<SisterVenturesProps> = ({ onNavigate }) => {
  const [selectedFlyer, setSelectedFlyer] = useState<{ title: string; image: string } | null>(null);

  const logisticsServices = [
    { name: 'Sea Freight (FCL & LCL)', icon: Ship, desc: 'Cost-effective global ocean freight forwarding to Tema Port & Takoradi.' },
    { name: 'Air Freight Cargo', icon: Plane, desc: 'Time-critical air cargo handling from Europe, USA, UAE & China to KIA.' },
    { name: 'Secure Cargo Storage', icon: Warehouse, desc: 'State-of-the-art bonded warehousing and container storage facilities.' },
    { name: 'Road Freight & Haulage', icon: Truck, desc: 'Heavy-duty transport & flatbed trucking across all 16 regions of Ghana.' },
    { name: 'Customs Clearance', icon: CheckCircle2, desc: 'Fast-track ICUMS documentation, physical exam escort & duty payment.' },
    { name: 'Commercial Procurement', icon: Globe2, desc: 'Global sourcing, supplier trade verification & payment facilitation.' },
  ];

  const travelServices = [
    { name: 'Visa Assistance & Advisory', icon: Globe2, desc: 'Expert advisory, document vetting & interview coaching for USA, UK, Schengen & Canada.' },
    { name: 'Flight Bookings', icon: Plane, desc: 'Competitive international airfare ticketing across all major commercial airlines.' },
    { name: 'Hotel Reservations', icon: Hotel, desc: 'Hand-picked luxury, boutique & business accommodations worldwide at corporate rates.' },
    { name: 'Guided Tours & Safaris', icon: Map, desc: 'Curated vacation itineraries, domestic Ghana eco-tours & wildlife safaris.' },
    { name: 'Corporate Delegations', icon: Users, desc: 'Turnkey logistics for business delegations, trade fairs & church pilgrimages.' },
    { name: 'KIA Airport Transfers', icon: Truck, desc: 'VIP executive chauffeur pick-up & drop-off at Kotoka International Airport (KIA).' },
  ];

  const openWhatsApp = (ventureName: string, service?: string) => {
    const text = service 
      ? `Hello! I would like to inquire about ${ventureName} - specifically your "${service}" service.`
      : `Hello! I am contacting you regarding ${ventureName} to discuss service booking.`;
    window.open(`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleGoToPage = (pageId: string) => {
    if (onNavigate) {
      onNavigate(pageId);
    }
  };

  return (
    <section id="sister-ventures" className="py-12 bg-dark-900 relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Building2 className="w-3.5 h-3.5" />
            <span>The Jackdan Group Ecosystem</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Integrated <span className="gold-gradient-text">Sister Ventures</span>
          </h2>
          <p className="mt-4 text-dark-300 text-base sm:text-lg">
            Beyond automobile sales, our group delivers dedicated commercial logistics with <strong>Twumaasco Logistics & Trading</strong> and world-class travel consultancy with <strong>Jackdan Travel & Tour</strong>.
          </p>
        </div>

        {/* Quick Launch Cards for Dedicated Pages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Twumaasco Logistics Launch Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-950/60 to-dark-900 border border-blue-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 text-center sm:text-left">
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold uppercase tracking-wider inline-block">
                Dedicated Logistics Portal
              </span>
              <h3 className="font-heading text-2xl font-black text-white">Twumaasco Logistics & Trading</h3>
              <p className="text-xs text-dark-300 max-w-md">
                Full container shipping, air cargo, bonded storage, customs clearing, and West Africa road haulage.
              </p>
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={() => handleGoToPage('twumaasco-logistics')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 flex-shrink-0 shadow-lg"
              >
                <span>Visit Dedicated Page</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Card 2: Jackdan Travel Launch Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/60 to-dark-900 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 text-center sm:text-left">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider inline-block">
                Dedicated Travel Portal
              </span>
              <h3 className="font-heading text-2xl font-black text-white">Jackdan Travel & Tour</h3>
              <p className="text-xs text-dark-300 max-w-md">
                Visa assistance (USA, UK, Canada, Schengen), airline flight ticketing, hotel reservations & safaris.
              </p>
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={() => handleGoToPage('travel-tour')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 flex-shrink-0 shadow-lg"
              >
                <span>Visit Dedicated Page</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Ventures Deep Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Venture 1: Twumaasco Logistics & Trading */}
          <div className="rounded-3xl bg-dark-800/80 border border-dark-700 hover:border-blue-500/50 backdrop-blur-xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group">
            <div>
              {/* Badge & Flyer Peek */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  Freight & Commercial Trading
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedFlyer({ title: 'Twumaasco Logistics & Trading Official Flyer', image: '/assets/1_20260909_140844_0000.png' })}
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Official Flyer</span>
                </button>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-2 mb-6">
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white group-hover:text-blue-300 transition-colors">
                  Twumaasco Logistics & Trading
                </h3>
                <p className="text-blue-400 text-sm font-semibold tracking-wide uppercase">
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
                      className="p-3.5 rounded-xl bg-dark-900/70 border border-dark-700/60 hover:border-blue-500/40 hover:bg-dark-900 transition-all cursor-pointer group/item"
                    >
                      <div className="flex items-center gap-2.5 mb-1">
                        <Icon className="w-4 h-4 text-blue-400 group-hover/item:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white group-hover/item:text-blue-300">{srv.name}</span>
                      </div>
                      <p className="text-[11px] text-dark-400 leading-snug">{srv.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA bar */}
            <div className="pt-6 border-t border-dark-700/80 flex flex-col sm:flex-row items-center gap-3">
              {onNavigate ? (
                <button
                  type="button"
                  onClick={() => handleGoToPage('twumaasco-logistics')}
                  className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Open Twumaasco Dedicated Page</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openWhatsApp('Twumaasco Logistics & Trading')}
                  className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Inquire with Twumaasco</span>
                </button>
              )}
              <a
                href={`tel:${CONTACT_INFO.primaryPhoneFormatted}`}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-dark-600 hover:border-blue-500/40 bg-dark-900 text-dark-200 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-blue-400" />
                <span>Call Desk</span>
              </a>
            </div>
          </div>

          {/* Venture 2: Jackdan Travel & Tour */}
          <div className="rounded-3xl bg-dark-800/80 border border-dark-700 hover:border-emerald-500/50 backdrop-blur-xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group">
            <div>
              {/* Badge & Flyer Peek */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  Global Travel & Hospitality
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedFlyer({ title: 'Jackdan Travel & Tour Official Flyer', image: '/assets/2_20260909_140845_0001.png' })}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Official Flyer</span>
                </button>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-2 mb-6">
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                  Jackdan Travel & Tour
                </h3>
                <p className="text-emerald-400 text-sm font-semibold tracking-wide uppercase">
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
                      className="p-3.5 rounded-xl bg-dark-900/70 border border-dark-700/60 hover:border-emerald-500/40 hover:bg-dark-900 transition-all cursor-pointer group/item"
                    >
                      <div className="flex items-center gap-2.5 mb-1">
                        <Icon className="w-4 h-4 text-emerald-400 group-hover/item:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white group-hover/item:text-emerald-300">{srv.name}</span>
                      </div>
                      <p className="text-[11px] text-dark-400 leading-snug">{srv.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA bar */}
            <div className="pt-6 border-t border-dark-700/80 flex flex-col sm:flex-row items-center gap-3">
              {onNavigate ? (
                <button
                  type="button"
                  onClick={() => handleGoToPage('travel-tour')}
                  className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Open Travel Dedicated Page</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openWhatsApp('Jackdan Travel & Tour')}
                  className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Book with Jackdan Travel</span>
                </button>
              )}
              <a
                href={`tel:${CONTACT_INFO.secondaryPhoneFormatted}`}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-dark-600 hover:border-emerald-500/40 bg-dark-900 text-dark-200 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Call Desk</span>
              </a>
            </div>
          </div>
        </div>

        {/* Official Address & Hub Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-950 border border-gold-500/30 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-gold-400 tracking-wider flex items-center justify-center md:justify-start gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Group Headquarters & Operations Hub</span>
            </span>
            <h4 className="font-heading text-lg sm:text-xl font-bold text-white">
              {CONTACT_INFO.companyName}
            </h4>
            <p className="text-xs text-dark-300">
              {CONTACT_INFO.address}
            </p>
          </div>

          <a
            href={CONTACT_INFO.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow-md flex-shrink-0"
          >
            <span>View on Google Maps</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
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

export default SisterVentures;
