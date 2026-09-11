import React, { useState } from 'react';
import { 
  Car, 
  Wrench, 
  Calculator, 
  Compass, 
  Ship, 
  PhoneCall, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Globe2, 
  Clock, 
  Award, 
  Eye, 
  X, 
  Download, 
  ExternalLink,
  ChevronRight,
  Plane,
  Truck,
  Sparkles,
  MapPin,
  Copy,
  Check,
  Fuel,
  Gauge,
  Calendar,
  Layers,
  Container,
  Luggage,
  Star,
  Hotel
} from 'lucide-react';
import { CONTACT_INFO, EXCHANGE_RATES, VEHICLES, SPARE_PARTS } from '../data/inventory';

interface InformationalHomeProps {
  onNavigatePage: (page: string) => void;
  currentCurrency: string;
}

export const InformationalHome: React.FC<InformationalHomeProps> = ({ 
  onNavigatePage,
  currentCurrency 
}) => {
  const [activeFlyerModal, setActiveFlyerModal] = useState<{
    title: string;
    image: string;
    subtitle: string;
    description: string;
  } | null>(null);

  const [copiedAddress, setCopiedAddress] = useState(false);
  const [quickDutyPrice, setQuickDutyPrice] = useState<number>(35000);
  const [quickDutyYear, setQuickDutyYear] = useState<number>(2023);

  const currencyData = EXCHANGE_RATES[currentCurrency] || EXCHANGE_RATES.USD;

  const formatPrice = (usd: number) => {
    const converted = usd * currencyData.rateFromUSD;
    return `${currencyData.symbol} ${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(CONTACT_INFO.fullAddressWithCompany);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const flyers = [
    {
      id: 'auto',
      title: 'Jackdan Auto Import & Export Flyer',
      subtitle: 'Your Trusted Auto Import & Export Partner',
      description: 'Official catalog for overseas luxury SUVs, sedans, 4x4 pickups, and genuine OEM spare parts directly shipped and customs cleared at Tema Port.',
      image: '/assets/YOUR TRUSTED AUTO IMPORT AND EXPORT PARTNER_20260909_141036_0000.png',
      badge: 'Main Brand Flyer',
      badgeColor: 'bg-gold-500/20 text-gold-400 border-gold-500/40',
      actionPage: 'inventory',
      actionLabel: 'Browse Vehicle Inventory',
      buttonBg: 'gold-gradient-btn text-dark-950 font-bold'
    },
    {
      id: 'logistics',
      title: 'Twumaasco Logistics & Trading Flyer',
      subtitle: 'Your Trusted Logistics Partner',
      description: 'Official freight forwarding flyer highlighting Sea Freight (FCL/LCL), Air Freight, Bonded Storage, and West Africa road haulage.',
      image: '/assets/1_20260909_140844_0000.png',
      badge: 'Sister Venture: Logistics',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      actionPage: 'twumaasco-logistics',
      actionLabel: 'Explore Twumaasco Logistics',
      buttonBg: 'bg-blue-600 hover:bg-blue-500 text-white font-bold'
    },
    {
      id: 'travel',
      title: 'Jackdan Travel & Tour Flyer',
      subtitle: 'Your Journey, Our Priority',
      description: 'Official travel advisory flyer featuring Visa Assistance, worldwide Flight Bookings, luxury Hotel Reservations, and curated Group Safaris.',
      image: '/assets/2_20260909_140845_0001.png',
      badge: 'Sister Venture: Travel',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      actionPage: 'travel-tour',
      actionLabel: 'Explore Jackdan Travel & Tour',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold'
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Consultation & Car Selection',
      desc: 'Tell us your exact desired make, model, year, and budget. We source direct from licensed dealer auctions and showrooms across the USA, UAE, Canada, and Europe.',
      icon: Car
    },
    {
      num: '02',
      title: 'Multi-Point Inspection & History',
      desc: 'Our overseas agents inspect mechanical condition, verify clean title status (CarFax/AutoCheck), and prepare strict export clearance documentation.',
      icon: ShieldCheck
    },
    {
      num: '03',
      title: 'Ocean Shipping & Milestone Tracking',
      desc: 'Loaded onto secured RoRo or container vessels. You receive live Jackdan satellite tracking updates across all 5 maritime voyage milestones.',
      icon: Ship
    },
    {
      num: '04',
      title: 'Tema Customs Clearance & Handover',
      desc: 'Our registered ICUMS customs brokerage team clears all duties and taxes at Port of Tema, valets the car, and delivers with keys to your door.',
      icon: Award
    }
  ];

  // Featured 3 vehicles for the homepage spotlight
  const spotlightVehicles = VEHICLES.slice(0, 3);

  // Featured 3 spare parts
  const spotlightParts = SPARE_PARTS.slice(0, 3);

  // Quick duty formula approximation for teaser widget
  const estimatedQuickDuty = Math.round(quickDutyPrice * 0.38 + (2026 - quickDutyYear > 10 ? 3000 : 800));

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION - Ultra-Modern Luxury Design */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 border-b border-dark-800">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Brand Story & Welcoming Intro (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>Licensed Automobile Importer • Port of Tema Customs Broker</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                  JACKDAN <span className="gold-gradient-text">PREMIUM</span> VENTURES
                </h1>
                <p className="text-gold-400 font-heading text-lg sm:text-xl font-bold tracking-wide uppercase">
                  "YOUR TRUSTED AUTO IMPORT AND EXPORT PARTNER"
                </p>
              </div>

              {/* Informational Summary */}
              <p className="text-dark-200 text-base sm:text-lg leading-relaxed">
                Ghana's premier gateway for international automobile importation, genuine OEM spare parts, commercial logistics via <strong>Twumaasco Logistics</strong>, and worldwide travel consultancy via <strong>Jackdan Travel & Tour</strong>.
              </p>

              {/* Physical Office Badge */}
              <div className="p-3.5 rounded-2xl bg-dark-900/90 border border-gold-500/30 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-dark-300">
                  <strong className="text-white block font-semibold">Head Office Location:</strong>
                  <span>{CONTACT_INFO.address}</span>
                </div>
              </div>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-dark-200">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <span>Direct USA, UAE, Canada & Europe Sourcing</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-dark-200">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <span>100% Genuine OEM Auto Spare Parts</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-dark-200">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <span>Hassle-Free ICUMS Customs Duty Clearing</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-dark-200">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <span>Dedicated Logistics & Travel Sister Ventures</span>
                </div>
              </div>

              {/* Primary Call-to-Actions */}
              <div className="pt-3 flex flex-wrap items-center gap-3.5">
                <a
                  href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gold-gradient-btn py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Us on WhatsApp</span>
                </a>

                <a
                  href={`tel:${CONTACT_INFO.primaryPhoneFormatted}`}
                  className="py-3.5 px-5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-600 hover:border-gold-500/40 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-gold-400" />
                  <span>Call {CONTACT_INFO.phones[0]}</span>
                </a>

                <button
                  type="button"
                  onClick={() => onNavigatePage('inventory')}
                  className="py-3.5 px-5 rounded-xl text-gold-400 hover:text-white bg-dark-900 hover:bg-dark-800 border border-dark-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all"
                >
                  <span>Browse Available Cars</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Featured Flyer Showcase Frame (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-md group">
                {/* Gold glowing ambient border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 rounded-3xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500" />

                {/* Main Flyer Card Frame */}
                <div className="relative rounded-2xl bg-dark-900 border border-gold-500/40 p-4 shadow-2xl overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-dark-800 mb-3">
                    <span className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Official Brand Flyer
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveFlyerModal(flyers[0])}
                      className="text-xs text-dark-300 hover:text-white flex items-center gap-1 bg-dark-800 hover:bg-dark-700 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-gold-400" />
                      <span>Enlarge Flyer</span>
                    </button>
                  </div>

                  {/* Flyer Image Preview */}
                  <div 
                    onClick={() => setActiveFlyerModal(flyers[0])}
                    className="cursor-pointer rounded-xl overflow-hidden bg-dark-950 border border-dark-800 relative group/img aspect-[4/5] flex items-center justify-center"
                  >
                    <img
                      src="/assets/YOUR TRUSTED AUTO IMPORT AND EXPORT PARTNER_20260909_141036_0000.png"
                      alt="Jackdan Auto Import Official Flyer"
                      className="w-full h-full object-cover transform group-hover/img:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-dark-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 rounded-xl bg-gold-500 text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow-xl">
                        <Eye className="w-4 h-4" />
                        <span>Click to View High-Res</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-dark-800 flex items-center justify-between text-xs text-dark-300">
                    <span>Jackdan Premium Ventures</span>
                    <button
                      type="button"
                      onClick={() => onNavigatePage('inventory')}
                      className="text-gold-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Showroom</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KEY STATS & CREDIBILITY BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-dark-900/80 border border-dark-800 text-center space-y-1">
            <div className="font-heading text-3xl sm:text-4xl font-extrabold text-gold-400">10+</div>
            <div className="text-xs sm:text-sm font-semibold text-white">Global Shipping Ports</div>
            <div className="text-[11px] text-dark-400">USA, UAE, Europe, China, Japan</div>
          </div>

          <div className="p-6 rounded-2xl bg-dark-900/80 border border-dark-800 text-center space-y-1">
            <div className="font-heading text-3xl sm:text-4xl font-extrabold text-gold-400">100%</div>
            <div className="text-xs sm:text-sm font-semibold text-white">Genuine OEM Parts</div>
            <div className="text-[11px] text-dark-400">Wholesale & retail for all brands</div>
          </div>

          <div className="p-6 rounded-2xl bg-dark-900/80 border border-dark-800 text-center space-y-1">
            <div className="font-heading text-3xl sm:text-4xl font-extrabold text-gold-400">ICUMS</div>
            <div className="text-xs sm:text-sm font-semibold text-white">Registered Clearing Broker</div>
            <div className="text-[11px] text-dark-400">Zero demurrage fast-track clearance</div>
          </div>

          <div className="p-6 rounded-2xl bg-dark-900/80 border border-dark-800 text-center space-y-1">
            <div className="font-heading text-3xl sm:text-4xl font-extrabold text-gold-400">16</div>
            <div className="text-xs sm:text-sm font-semibold text-white">Regions in Ghana Served</div>
            <div className="text-[11px] text-dark-400">Flatbed delivery to your doorstep</div>
          </div>
        </div>
      </section>

      {/* 3. DEDICATED SISTER VENTURES HERO TILES (New Feature Highlight) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Integrated Group Ventures</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Explore Our <span className="gold-gradient-text">Dedicated Sister Portals</span>
          </h2>
          <p className="mt-3 text-dark-300 text-sm sm:text-base">
            In addition to automotive sourcing, our group manages commercial maritime freight forwarding and international travel consultation through dedicated companies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Twumaasco Logistics & Trading */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-950/40 via-dark-900 to-dark-900 border border-blue-500/40 p-8 shadow-2xl flex flex-col justify-between space-y-6 hover:border-blue-400 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
                  Commercial Freight & Haulage
                </span>
                <span className="text-xs text-blue-400 font-semibold flex items-center gap-1">
                  <Ship className="w-4 h-4" />
                  <span>Dedicated Portal</span>
                </span>
              </div>

              <div>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-white group-hover:text-blue-300 transition-colors">
                  Twumaasco Logistics & Trading
                </h3>
                <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mt-1">
                  "Your Trusted Logistics Partner"
                </p>
              </div>

              <p className="text-dark-300 text-sm leading-relaxed">
                Full-service international ocean shipping (FCL/LCL), express air cargo at KIA, bonded container storage yards, and flatbed haulage across all 16 regions of Ghana.
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="p-3 rounded-xl bg-dark-950/70 border border-dark-800 text-xs text-dark-200 flex items-center gap-2">
                  <Container className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>FCL & LCL Ocean Freight</span>
                </div>
                <div className="p-3 rounded-xl bg-dark-950/70 border border-dark-800 text-xs text-dark-200 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Air Freight Cargo Express</span>
                </div>
                <div className="p-3 rounded-xl bg-dark-950/70 border border-dark-800 text-xs text-dark-200 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Road Freight & Haulage</span>
                </div>
                <div className="p-3 rounded-xl bg-dark-950/70 border border-dark-800 text-xs text-dark-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Port ICUMS Clearance</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-dark-800 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigatePage('twumaasco-logistics')}
                className="w-full sm:w-auto flex-1 py-3.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Open Twumaasco Logistics Page</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent('Hello Twumaasco Logistics & Trading, I would like to inquire about freight forwarding / shipping rates.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-dark-950 hover:bg-dark-800 border border-dark-700 text-blue-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Quick WhatsApp Quote</span>
              </a>
            </div>
          </div>

          {/* Card 2: Jackdan Travel & Tour */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-950/40 via-dark-900 to-dark-900 border border-emerald-500/40 p-8 shadow-2xl flex flex-col justify-between space-y-6 hover:border-emerald-400 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                  Global Travel & Hospitality
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Plane className="w-4 h-4" />
                  <span>Dedicated Portal</span>
                </span>
              </div>

              <div>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-white group-hover:text-emerald-300 transition-colors">
                  Jackdan Travel & Tour
                </h3>
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mt-1">
                  "Your Journey, Our Priority"
                </p>
              </div>

              <p className="text-dark-300 text-sm leading-relaxed">
                Expert visa assistance & interview coaching (USA, UK, Canada, Schengen), discounted global airline bookings, luxury hotel reservations, and curated vacation safaris.
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="p-3 rounded-xl bg-dark-950/70 border border-dark-800 text-xs text-dark-200 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>USA, UK & Schengen Visas</span>
                </div>
                <div className="p-3 rounded-xl bg-dark-950/70 border border-dark-800 text-xs text-dark-200 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Worldwide Flight Tickets</span>
                </div>
                <div className="p-3 rounded-xl bg-dark-950/70 border border-dark-800 text-xs text-dark-200 flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>4 & 5-Star Hotel Stays</span>
                </div>
                <div className="p-3 rounded-xl bg-dark-950/70 border border-dark-800 text-xs text-dark-200 flex items-center gap-2">
                  <Luggage className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Safaris & Guided Tours</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-dark-800 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigatePage('travel-tour')}
                className="w-full sm:w-auto flex-1 py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Open Jackdan Travel Page</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${CONTACT_INFO.secondaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent('Hello Jackdan Travel & Tour, I would like to inquire about visa assistance / flight bookings.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-dark-950 hover:bg-dark-800 border border-dark-700 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Quick WhatsApp Inquiry</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED VEHICLE SHOWCASE SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Car className="w-3.5 h-3.5" />
              <span>Certified Stock & Sourcing</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Featured Luxury & SUV <span className="gold-gradient-text">Showcase</span>
            </h2>
            <p className="text-dark-300 text-xs sm:text-sm mt-1 max-w-xl">
              Foreign-used, brand-new, and certified pre-owned vehicles verified for clean title and ready for direct shipment to Ghana.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigatePage('inventory')}
            className="self-start md:self-end px-5 py-2.5 rounded-xl bg-dark-900 hover:bg-dark-800 border border-dark-700 hover:border-gold-500/40 text-gold-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <span>View All {VEHICLES.length} Vehicles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {spotlightVehicles.map((car) => (
            <div
              key={car.id}
              className="rounded-2xl bg-dark-900/90 border border-dark-800 hover:border-gold-500/40 p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all group"
            >
              <div className="space-y-3">
                {/* Image */}
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-dark-950 border border-dark-800">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-dark-950/80 backdrop-blur-md text-[10px] font-bold text-gold-400 border border-gold-500/30 uppercase">
                    {car.category}
                  </div>
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-dark-950/80 backdrop-blur-md text-[10px] font-bold text-white border border-dark-700">
                    {car.year}
                  </div>
                </div>

                <div>
                  <h3 className="font-heading text-lg font-bold text-white group-hover:text-gold-300 transition-colors line-clamp-1">
                    {car.name}
                  </h3>
                  <div className="text-xl font-extrabold text-gold-400 font-mono mt-1">
                    {formatPrice(car.priceUSD)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-dark-300 pt-2 border-t border-dark-800">
                  <div className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-gold-400" />
                    <span>{car.mileage}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-gold-400" />
                    <span>{car.fuelType}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-dark-800 flex items-center gap-2">
                <a
                  href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(`Hello Jackdan, I am interested in inquiring about the ${car.name} priced at ${formatPrice(car.priceUSD)}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl gold-gradient-btn text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Inquire</span>
                </a>
                <button
                  type="button"
                  onClick={() => onNavigatePage('inventory')}
                  className="py-2.5 px-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-dark-200 hover:text-white border border-dark-700 text-xs font-semibold"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. OFFICIAL COMPANY FLYERS SHOWCASE */}
      <section className="py-16 bg-dark-900/70 border-y border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Portfolios</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Official Flyers & <span className="gold-gradient-text">Brand Catalogs</span>
            </h2>
            <p className="mt-4 text-dark-300 text-base sm:text-lg">
              Explore the official flyers for Jackdan Premium Ventures, Twumaasco Logistics & Trading, and Jackdan Travel & Tour. Click any flyer to zoom or download.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {flyers.map((flyer) => (
              <div 
                key={flyer.id}
                className="rounded-2xl bg-dark-800/80 border border-dark-700 hover:border-gold-500/50 shadow-2xl p-5 flex flex-col justify-between transition-all group"
              >
                <div className="space-y-4">
                  {/* Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${flyer.badgeColor}`}>
                      {flyer.badge}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveFlyerModal(flyer)}
                      className="text-xs text-gold-400 hover:text-white flex items-center gap-1 font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Enlarge</span>
                    </button>
                  </div>

                  {/* Flyer Image Container */}
                  <div 
                    onClick={() => setActiveFlyerModal(flyer)}
                    className="relative cursor-pointer rounded-xl overflow-hidden bg-dark-950 border border-dark-700 aspect-[4/5] flex items-center justify-center group/img"
                  >
                    <img
                      src={flyer.image}
                      alt={flyer.title}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-dark-950/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                      <span className="px-4 py-2 rounded-xl bg-gold-500 text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow-xl">
                        <Eye className="w-4 h-4" />
                        <span>View High-Res Flyer</span>
                      </span>
                    </div>
                  </div>

                  {/* Flyer Info */}
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-gold-300 transition-colors">
                      {flyer.title}
                    </h3>
                    <p className="text-gold-400 text-xs font-semibold mb-2">{flyer.subtitle}</p>
                    <p className="text-dark-300 text-xs leading-relaxed">{flyer.description}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-5 border-t border-dark-700/70 mt-5 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => onNavigatePage(flyer.actionPage)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md ${flyer.buttonBg}`}
                  >
                    <span>{flyer.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(`Hello Jackdan, I am inquiring about your ${flyer.title}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl border border-dark-600 hover:border-green-500/50 text-dark-200 hover:text-green-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Inquiry for this Flyer</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GENUINE OEM SPARE PARTS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Wrench className="w-3.5 h-3.5" />
              <span>OEM Genuine Auto Components</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Wholesale & Retail <span className="gold-gradient-text">Spare Parts</span>
            </h2>
            <p className="text-dark-300 text-xs sm:text-sm mt-1 max-w-xl">
              Direct factory OEM components for Mercedes-Benz, Toyota, Land Rover, and Lexus with warranty.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigatePage('parts')}
            className="self-start md:self-end px-5 py-2.5 rounded-xl bg-dark-900 hover:bg-dark-800 border border-dark-700 hover:border-gold-500/40 text-gold-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <span>View All Spare Parts</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {spotlightParts.map((part) => (
            <div
              key={part.id}
              className="rounded-2xl bg-dark-900/90 border border-dark-800 hover:border-gold-500/40 p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all group"
            >
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-dark-950 border border-dark-800">
                  <img
                    src={part.image}
                    alt={part.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-dark-950/80 backdrop-blur-md text-[10px] font-bold text-gold-400 border border-gold-500/30">
                    {part.category}
                  </div>
                </div>

                <div>
                  <h3 className="font-heading text-sm sm:text-base font-bold text-white group-hover:text-gold-300 transition-colors line-clamp-2">
                    {part.name}
                  </h3>
                  <div className="text-lg font-extrabold text-gold-400 font-mono mt-1">
                    {formatPrice(part.priceUSD)}
                  </div>
                </div>

                <p className="text-xs text-dark-300 line-clamp-2">{part.description}</p>
                <div className="text-[11px] text-dark-400 bg-dark-950 p-2 rounded-lg border border-dark-800">
                  <strong className="text-white font-medium">Fits: </strong>
                  <span>{part.compatibility}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-dark-800">
                <a
                  href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(`Hello Jackdan, I would like to order the spare part: ${part.name} (Part #${part.partNumber}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl gold-gradient-btn text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. HOW IT WORKS - 4 SIMPLE STEPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Clock className="w-3.5 h-3.5" />
            <span>Transparent Workflow</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            How We Import Your Car to <span className="gold-gradient-text">Ghana</span>
          </h2>
          <p className="mt-4 text-dark-300 text-base sm:text-lg">
            No confusion, no unexpected duties, no port delays. We manage every phase from overseas auction to your driveway.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-dark-900/80 border border-dark-800 relative space-y-4 hover:border-gold-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-gold-500/40">{step.num}</span>
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-heading text-lg font-bold text-white">{step.title}</h3>
                <p className="text-dark-300 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => onNavigatePage('calculator')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gold-gradient-btn font-bold text-sm sm:text-base shadow-xl"
          >
            <Calculator className="w-5 h-5" />
            <span>Try the Ghana Auto Import & Duty Estimator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 8. OFFICIAL HEADQUARTERS & PHYSICAL OFFICE ADDRESS (Prominent Card) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900 border border-gold-500/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Col: Address Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-400 text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-gold-400" />
                <span>Official Corporate Headquarters</span>
              </div>

              <div>
                <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                  Visit Jackdan Premium Ventures
                </h3>
                <p className="text-gold-400 font-bold text-sm sm:text-base uppercase tracking-wider mt-1">
                  Abossey Okai Office & Clearing Hub
                </p>
              </div>

              {/* Exact Address Highlight Block */}
              <div className="p-5 rounded-2xl bg-dark-950 border border-gold-500/30 space-y-3">
                <div className="text-white font-extrabold text-sm sm:text-base tracking-wide leading-relaxed font-mono">
                  {CONTACT_INFO.companyName.toUpperCase()}
                  <br />
                  {CONTACT_INFO.poBox}
                  <br />
                  {CONTACT_INFO.landmark}, {CONTACT_INFO.area}, {CONTACT_INFO.city}, {CONTACT_INFO.country}
                </div>

                <div className="pt-2 border-t border-dark-800 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-dark-200 hover:text-white text-xs font-semibold transition-colors"
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Address Copied!</span>
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
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 text-xs font-semibold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-dark-300">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <span>Primary Desk: <strong>{CONTACT_INFO.phones[0]}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <span>Secondary Desk: <strong>{CONTACT_INFO.phones[1]}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <span>Mon – Sat: 8:00 AM – 6:00 PM GMT</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>24/7 WhatsApp Response</span>
                </div>
              </div>
            </div>

            {/* Right Col: Direction Guide Card */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700/80 space-y-4">
                <h4 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-gold-400" />
                  <span>How to Find Us</span>
                </h4>
                <p className="text-xs text-dark-300 leading-relaxed">
                  Located in the vibrant Abossey Okai commercial hub in Accra, directly opposite the <strong>Lighthouse Chapel International</strong> and near <strong>Fanmilk</strong> depot.
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="p-3 rounded-xl bg-dark-950 border border-dark-800 text-xs text-dark-200">
                    <strong className="text-gold-400 block mb-0.5">Key Landmark:</strong>
                    Opposite Lighthouse Chapel International, Near Fanmilk
                  </div>
                  <div className="p-3 rounded-xl bg-dark-950 border border-dark-800 text-xs text-dark-200">
                    <strong className="text-gold-400 block mb-0.5">Postal Address:</strong>
                    P.O.BOX DK 1147, Accra, Ghana
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent('Hello Jackdan, I am on my way to your Abossey Okai office and need directions.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl gold-gradient-btn text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Get Live WhatsApp Directions</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flyer Modal Lightbox */}
      {activeFlyerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-3xl w-full bg-dark-900 border border-gold-500/50 rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <div>
                <h4 className="font-heading font-bold text-white text-lg sm:text-xl">
                  {activeFlyerModal.title}
                </h4>
                <p className="text-gold-400 text-xs">{activeFlyerModal.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveFlyerModal(null)}
                className="p-2 rounded-xl text-dark-400 hover:text-white bg-dark-800 hover:bg-dark-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-dark-950 flex items-center justify-center max-h-[70vh]">
              <img
                src={activeFlyerModal.image}
                alt={activeFlyerModal.title}
                className="w-full h-auto max-h-[65vh] object-contain"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-dark-300 max-w-md">
                {activeFlyerModal.description}
              </p>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={activeFlyerModal.image}
                  download
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-dark-800 hover:bg-dark-700 text-dark-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Flyer</span>
                </a>
                <a
                  href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(`Hello Jackdan, I am looking at your flyer for ${activeFlyerModal.title} and would like to ask some questions.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl gold-gradient-btn text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InformationalHome;
