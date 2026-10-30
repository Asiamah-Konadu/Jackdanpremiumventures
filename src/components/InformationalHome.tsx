import React, { useEffect, useRef, useState } from 'react';
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
  Hotel,
  Volume2,
  VolumeX,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { CONTACT_INFO, EXCHANGE_RATES, VEHICLES, SPARE_PARTS } from '../data/inventory';
import { SpykerHeroStudio } from './SpykerHeroStudio';

interface InformationalHomeProps {
  onNavigatePage: (page: string) => void;
  currentCurrency: string;
}

export const InformationalHome: React.FC<InformationalHomeProps> = ({ 
  onNavigatePage,
  currentCurrency 
}) => {
  const homeRef = useRef<HTMLDivElement>(null);
  const [activeFlyerModal, setActiveFlyerModal] = useState<{
    title: string;
    image: string;
    subtitle: string;
    description: string;
  } | null>(null);

  const [copiedAddress, setCopiedAddress] = useState(false);
  
  // Bespoke Aviation Calculator State
  const [calcCifValue, setCalcCifValue] = useState<number>(38000);
  const [calcYear, setCalcYear] = useState<number>(2023);
  const [calcEngineCap, setCalcEngineCap] = useState<string>('2000-2999cc');
  const [activeSpecsCar, setActiveSpecsCar] = useState<typeof VEHICLES[0] | null>(null);

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

  // Ghana ICUMS Duty Computation logic
  const calculateDutyBreakdown = () => {
    const age = 2026 - calcYear;
    const baseDutyRate = age > 10 ? 0.35 : 0.20; // Over-aged penalty
    const importDuty = calcCifValue * baseDutyRate;
    const vat = (calcCifValue + importDuty) * 0.15;
    const nhil = (calcCifValue + importDuty) * 0.025;
    const getFund = (calcCifValue + importDuty) * 0.025;
    const ecowas = calcCifValue * 0.005;
    const examFee = 850;
    const totalEstimatedGhs = (importDuty + vat + nhil + getFund + ecowas) * 15.6 + examFee;
    const totalEstimatedUsd = (importDuty + vat + nhil + getFund + ecowas) + (examFee / 15.6);

    return {
      importDuty,
      vat,
      nhil,
      getFund,
      ecowas,
      examFee,
      totalEstimatedUsd,
      totalEstimatedGhs
    };
  };

  const dutyCalc = calculateDutyBreakdown();

  const flyers = [
    {
      id: 'auto',
      title: 'Jackdan Auto Import & Export Atelier',
      subtitle: 'Your Trusted Auto Import & Export Partner',
      description: 'Official catalog for overseas luxury SUVs, grand tourers, executive sedans, and genuine OEM spare parts directly shipped and customs cleared at Tema Port.',
      image: '/assets/YOUR TRUSTED AUTO IMPORT AND EXPORT PARTNER_20260909_141036_0000.png',
      badge: 'Main Brand Atelier',
      badgeColor: 'bg-gold-500/20 text-gold-400 border-gold-500/40',
      actionPage: 'inventory',
      actionLabel: 'Browse Fleet Inventory',
      buttonBg: 'gold-gradient-btn text-dark-950 font-bold'
    },
    {
      id: 'logistics',
      title: 'Twumaasco Logistics & Trading Division',
      subtitle: 'Maritime & Heavy Cargo Partner',
      description: 'Official freight forwarding catalog highlighting Sea Freight (FCL/LCL), Air Freight, Bonded Storage, and West Africa road haulage.',
      image: '/assets/1_20260909_140844_0000.png',
      badge: 'Sister Venture: Logistics',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      actionPage: 'twumaasco-logistics',
      actionLabel: 'Explore Twumaasco Logistics',
      buttonBg: 'bg-blue-600 hover:bg-blue-500 text-white font-bold'
    },
    {
      id: 'travel',
      title: 'Jackdan Travel & Tour Division',
      subtitle: 'Aviation & Diplomatic Hospitality',
      description: 'Official travel advisory portfolio featuring Visa Assistance, worldwide Flight Bookings, luxury Hotel Reservations, and curated Group Safaris.',
      image: '/assets/2_20260909_140845_0001.png',
      badge: 'Sister Venture: Travel',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      actionPage: 'travel-tour',
      actionLabel: 'Explore Jackdan Travel & Tour',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold'
    }
  ];

  // The 4 Cinematic Episodes ("A Day Behind the Marque" - Spyker Concept)
  const cinematicEpisodes = [
    {
      time: '06:30 AM',
      location: 'New York & Dubai Autodromes',
      chapter: 'CHAPTER 01',
      title: 'The Dawn Acquisition & Clean Provenance',
      subtitle: 'Sourced Direct from Tier-1 Auctions & Showrooms',
      desc: 'Before any vehicle enters our ledger, overseas agents conduct a 150-point diagnostic scan. We verify structural laser alignment, clean titles (CarFax/AutoCheck with zero flood or salvage history), and confirm genuine factory maintenance records.',
      metrics: [
        { label: 'Source Provenance', val: 'USA, Canada, UAE & Germany' },
        { label: 'Title Standard', val: '100% Clean / No Accident' },
        { label: 'Inspection Protocol', val: 'Laser Scan & Compression Test' }
      ],
      icon: Car
    },
    {
      time: '14:15 PM',
      location: 'Transatlantic & Mediterranean Sea Lanes',
      chapter: 'CHAPTER 02',
      title: 'The High-Seas Meridian Passage',
      subtitle: 'Secured Containerized & RoRo Maritime Transit',
      desc: 'Loaded onto world-class ocean carriers (MSC, Maersk, Grimaldi) with satellite-linked telemetry. Your vehicle cruises with real-time waypoint monitoring across the Atlantic directly toward the Gulf of Guinea and Port of Tema.',
      metrics: [
        { label: 'Vessel Lines', val: 'Maersk, MSC, Grimaldi RoRo' },
        { label: 'Transit Duration', val: '18 – 24 Days Direct' },
        { label: 'Telemetry', val: 'Live GPS Satellite Tracking' }
      ],
      icon: Ship
    },
    {
      time: '18:45 PM',
      location: 'Port of Tema — MPS Terminal 3',
      chapter: 'CHAPTER 03',
      title: 'The Port of Tema ICUMS Citadel',
      subtitle: 'Zero-Demurrage Customs Duty Exemption & Fast Release',
      desc: 'Our registered customs brokerage team executes electronic ICUMS declaration ahead of vessel arrival. We escort physical joint inspections, settle all GRA import taxes, and secure release orders within record turnaround time.',
      metrics: [
        { label: 'Broker Status', val: 'Registered GRA ICUMS Agent' },
        { label: 'Demurrage Penalty', val: 'Guaranteed 0% Zero Demurrage' },
        { label: 'Inspection', val: 'Joint Customs Physical Escort' }
      ],
      icon: ShieldCheck
    },
    {
      time: '22:00 PM',
      location: 'Cantonments, Airport & Nationwide Ghana',
      chapter: 'CHAPTER 04',
      title: 'The Sanctuary Handover & Bespoke Delivery',
      subtitle: 'Valeted Handover with Keys, DVLA Plates & Warranty',
      desc: 'Upon port exit, every vehicle receives high-gloss paint correction and interior ozone sterilization. Delivered via private flatbed carrier directly to your residence with valid registration, roadworthy certificates, and full keys in hand.',
      metrics: [
        { label: 'Delivery Range', val: 'All 16 Regions of Ghana' },
        { label: 'Sanitization', val: 'Valeted & Ozone Purified' },
        { label: 'Documentation', val: 'Turnkey DVLA Registration' }
      ],
      icon: Award
    }
  ];

  const featuredCars = VEHICLES.slice(0, 3);
  const featuredParts = SPARE_PARTS.slice(0, 3);

  useEffect(() => {
    const root = homeRef.current;
    if (!root || !('IntersectionObserver' in window)) return;
    const sections = Array.from(root.querySelectorAll<HTMLElement>(':scope > section'));
    root.classList.add('home-editorial--ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('home-editorial__section--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={homeRef} className="home-editorial bg-dark-950 text-white selection:bg-gold-500 selection:text-dark-950 pb-28">
      {/* 1. HERO: SPYKER-INSPIRED 3D WEBGL STUDIO & LIVERY CONFIGURATOR */}
      <SpykerHeroStudio
        onNavigatePage={onNavigatePage}
        onOpenFlyerModal={() => setActiveFlyerModal(flyers[0])}
      />

      {/* 2. TURNED-ALUMINUM AIRCRAFT COCKPIT INSTRUMENTATION CLUSTER */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-gold-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            {/* Dial 1: Dyno Engine Power */}
            <div className="relative p-5 rounded-2xl bg-dark-950/80 border border-dark-800 flex items-center gap-4 group hover:border-gold-500/50 transition-all">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-gold-500/40 flex items-center justify-center bg-dark-900 shadow-[0_0_20px_rgba(212,175,55,0.15)] group-hover:rotate-45 transition-transform duration-700">
                <Gauge className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-dark-400 block">
                  Dyno Specification
                </span>
                <span className="text-2xl font-heading font-black text-white group-hover:text-gold-300 transition-colors">
                  100% OEM
                </span>
                <span className="text-[11px] text-dark-300 block">Compression Certified</span>
              </div>
            </div>

            {/* Dial 2: Maritime Transit Chronometer */}
            <div className="relative p-5 rounded-2xl bg-dark-950/80 border border-dark-800 flex items-center gap-4 group hover:border-gold-500/50 transition-all">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-gold-500/40 flex items-center justify-center bg-dark-900 shadow-[0_0_20px_rgba(212,175,55,0.15)] group-hover:rotate-45 transition-transform duration-700">
                <Clock className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-dark-400 block">
                  Transit Chrono
                </span>
                <span className="text-2xl font-heading font-black text-white group-hover:text-gold-300 transition-colors">
                  18–24 Days
                </span>
                <span className="text-[11px] text-dark-300 block">Direct Ocean Voyage</span>
              </div>
            </div>

            {/* Dial 3: ICUMS Customs Clearance Guarantee */}
            <div className="relative p-5 rounded-2xl bg-dark-950/80 border border-dark-800 flex items-center gap-4 group hover:border-gold-500/50 transition-all">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-gold-500/40 flex items-center justify-center bg-dark-900 shadow-[0_0_20px_rgba(212,175,55,0.15)] group-hover:rotate-45 transition-transform duration-700">
                <ShieldCheck className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-dark-400 block">
                  Port Authority
                </span>
                <span className="text-2xl font-heading font-black text-white group-hover:text-gold-300 transition-colors">
                  Zero Demurrage
                </span>
                <span className="text-[11px] text-dark-300 block">ICUMS Electronic Broker</span>
              </div>
            </div>

            {/* Dial 4: Nationwide Delivery Range */}
            <div className="relative p-5 rounded-2xl bg-dark-950/80 border border-dark-800 flex items-center gap-4 group hover:border-gold-500/50 transition-all">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-gold-500/40 flex items-center justify-center bg-dark-900 shadow-[0_0_20px_rgba(212,175,55,0.15)] group-hover:rotate-45 transition-transform duration-700">
                <Truck className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-dark-400 block">
                  Territory Fleet
                </span>
                <span className="text-2xl font-heading font-black text-white group-hover:text-gold-300 transition-colors">
                  16 Regions
                </span>
                <span className="text-[11px] text-dark-300 block">Doorstep Flatbed Carrier</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "A DAY BEHIND THE MARQUE" — CINEMATIC SCROLLYTELLING JOURNEY (Spyker Style) */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] tracking-[0.3em] font-mono uppercase text-gold-400 font-bold block mb-2">
              The Grand Voyage Narrative
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight">
              A Day Behind The <span className="gold-gradient-text">Marque</span>
            </h2>
            <p className="mt-4 text-dark-300 text-sm sm:text-base leading-relaxed">
              From dawn overseas auction inspection to transoceanic passage and white-glove arrival at your Ghanaian estate.
            </p>
          </div>

          {/* Scrollytelling Timeline Grid */}
          <div className="space-y-12">
            {cinematicEpisodes.map((ep, idx) => {
              const Icon = ep.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl bg-gradient-to-br from-dark-900/90 via-dark-950 to-dark-900/90 border border-gold-500/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden group hover:border-gold-500/60 transition-all"
                >
                  {/* Subtle Ambient Radial Lighting */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-gold-500/10 transition-colors" />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                    {/* Left Col: Episode Meta (4 cols) */}
                    <div className="lg:col-span-4 space-y-4 border-b lg:border-b-0 lg:border-r border-dark-800 pb-6 lg:pb-0 lg:pr-8">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[11px] font-mono font-bold tracking-wider">
                        <span>{ep.chapter}</span>
                        <span>•</span>
                        <span>{ep.time}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-dark-400 block">
                          Atmospheric Waypoint
                        </span>
                        <h4 className="font-heading text-xl font-bold text-white mt-0.5">
                          {ep.location}
                        </h4>
                      </div>

                      <div className="w-16 h-16 rounded-2xl bg-dark-950 border border-gold-500/40 flex items-center justify-center text-gold-400 shadow-xl group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8" />
                      </div>
                    </div>

                    {/* Right Col: Narrative & Specifications (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                      <div>
                        <h3 className="font-heading text-2xl sm:text-3xl font-black text-white group-hover:text-gold-300 transition-colors">
                          {ep.title}
                        </h3>
                        <p className="text-gold-400 text-xs sm:text-sm font-semibold tracking-wide uppercase mt-1">
                          {ep.subtitle}
                        </p>
                      </div>

                      <p className="text-dark-300 text-sm sm:text-base leading-relaxed">
                        {ep.desc}
                      </p>

                      {/* Technical Credentials Pill Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        {ep.metrics.map((m, mIdx) => (
                          <div key={mIdx} className="p-3.5 rounded-xl bg-dark-950/80 border border-dark-800/80">
                            <span className="text-[10px] uppercase tracking-wider font-mono text-dark-400 block mb-1">
                              {m.label}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-white">
                              {m.val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. "THE MARQUE FLEET" — HIGH-END VEHICLE COLLECTION SHOWCASE */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-dark-800/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[10px] tracking-[0.25em] font-mono uppercase text-gold-400 font-bold block mb-2">
              Curated Showroom Ledger
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              The Grand <span className="gold-gradient-text">Marque Collection</span>
            </h2>
            <p className="text-dark-300 text-sm mt-2 max-w-xl">
              High-economy sedans, family crossovers, and luxury 4x4 workhorses ready for immediate clearance or direct shipping.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigatePage('inventory')}
            className="self-start md:self-end px-6 py-3 rounded-xl bg-dark-900 hover:bg-dark-800 border border-gold-500/40 text-gold-400 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg"
          >
            <span>View All {VEHICLES.length} Fleet Models</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCars.map((car) => (
            <div
              key={car.id}
              className="rounded-3xl bg-gradient-to-b from-dark-900 to-dark-950 border border-dark-800 hover:border-gold-500/50 p-6 flex flex-col justify-between space-y-6 shadow-2xl transition-all group"
            >
              <div className="space-y-4">
                {/* Photo Frame */}
                <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-dark-950 border border-dark-800">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-dark-950/85 backdrop-blur-md text-[10px] font-mono font-bold text-gold-400 border border-gold-500/30 uppercase">
                    {car.category}
                  </div>
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-md bg-dark-950/85 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-dark-700">
                    {car.year} MODEL
                  </div>
                </div>

                <div>
                  <h3 className="font-heading text-xl font-bold text-white group-hover:text-gold-300 transition-colors">
                    {car.name}
                  </h3>
                  <div className="text-2xl font-black text-gold-400 font-mono mt-1">
                    {formatPrice(car.priceUSD)}
                  </div>
                  <p className="text-xs text-dark-400 font-mono mt-1">{car.engine}</p>
                </div>

                {/* Spyker-Style Specs Matrix */}
                <div className="grid grid-cols-2 gap-2 text-xs text-dark-300 pt-3 border-t border-dark-800 font-mono text-[11px]">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-3.5 h-3.5 text-gold-400" />
                    <span>{car.mileage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="w-3.5 h-3.5 text-gold-400" />
                    <span>{car.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2 text-dark-400">
                    <MapPin className="w-3.5 h-3.5 text-gold-400" />
                    <span>{car.location}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-dark-800 flex items-center gap-3">
                <a
                  href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(`Hello Jackdan Concierge, I would like to reserve / inquire about the ${car.name} priced at ${formatPrice(car.priceUSD)}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl gold-gradient-btn text-xs font-bold text-dark-950 flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Reserve on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => onNavigatePage('inventory')}
                  className="py-3 px-4 rounded-xl bg-dark-900 hover:bg-dark-800 text-white border border-dark-700 text-xs font-semibold"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BESPOKE ICUMS IMPORT DUTY & VALUATION CONSOLE */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#0c1322] via-dark-900 to-[#070b14] border-2 border-gold-500/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Col: Sliders & Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Calculator className="w-4 h-4 text-gold-400" />
                <span>Port of Tema Avionics Duty Estimator</span>
              </div>

              <div>
                <h3 className="font-heading text-2xl sm:text-4xl font-black text-white">
                  Bespoke Customs <span className="gold-gradient-text">Valuation Console</span>
                </h3>
                <p className="text-dark-300 text-sm mt-2 leading-relaxed">
                  Real-time Ghana Revenue Authority (GRA) tariff estimator. Avoid unexpected demurrage and calculate accurate import duties before overseas purchase.
                </p>
              </div>

              {/* Slider 1: CIF Vehicle Value */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-dark-300 uppercase tracking-wider">CIF Purchase Value (USD):</span>
                  <span className="text-xl font-bold text-gold-400 font-mono">${calcCifValue.toLocaleString()} USD</span>
                </div>
                <input
                  type="range"
                  min="8000"
                  max="120000"
                  step="1000"
                  value={calcCifValue}
                  onChange={(e) => setCalcCifValue(Number(e.target.value))}
                  className="w-full accent-gold-500 cursor-pointer h-2 bg-dark-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-dark-500 font-mono">
                  <span>$8,000 (Compact)</span>
                  <span>$50,000 (Luxury SUV)</span>
                  <span>$120,000+ (Supercar)</span>
                </div>
              </div>

              {/* Slider 2: Manufacture Year */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-dark-300 uppercase tracking-wider">Year of Manufacture:</span>
                  <span className="text-lg font-bold text-white font-mono">{calcYear}</span>
                </div>
                <input
                  type="range"
                  min="2014"
                  max="2026"
                  step="1"
                  value={calcYear}
                  onChange={(e) => setCalcYear(Number(e.target.value))}
                  className="w-full accent-gold-500 cursor-pointer h-2 bg-dark-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-dark-500 font-mono">
                  <span>2014 (Over-aged duty rate)</span>
                  <span>2020</span>
                  <span>2026 (Brand New)</span>
                </div>
              </div>

              {/* Engine Class Selector */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono text-dark-300 uppercase tracking-wider block">
                  Engine Displacement Category:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {['1000-1999cc', '2000-2999cc', '3000cc+ / V8'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCalcEngineCap(cat)}
                      className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all ${
                        calcEngineCap === cat
                          ? 'bg-gold-500 text-dark-950 border-gold-400 shadow-md'
                          : 'bg-dark-950 text-dark-300 border-dark-800 hover:border-dark-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Instrument Output Dial (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-dark-950 border border-gold-500/40 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-dark-800 pb-3">
                <span className="text-[10px] font-mono tracking-widest uppercase text-gold-400 font-bold">
                  ICUMS Duty Breakdown
                </span>
                <span className="text-[10px] font-mono text-dark-400">GRA TARIFF SCHEDULE</span>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between text-dark-300">
                  <span>Standard Import Duty ({calcYear < 2016 ? '35%' : '20%'}):</span>
                  <span className="text-white">${Math.round(dutyCalc.importDuty).toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between text-dark-300">
                  <span>VAT (15.0%):</span>
                  <span className="text-white">${Math.round(dutyCalc.vat).toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between text-dark-300">
                  <span>NHIL + GETFund (5.0%):</span>
                  <span className="text-white">${Math.round(dutyCalc.nhil + dutyCalc.getFund).toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between text-dark-300">
                  <span>ECOWAS Levy (0.5%):</span>
                  <span className="text-white">${Math.round(dutyCalc.ecowas).toLocaleString()} USD</span>
                </div>
              </div>

              {/* Total Summary */}
              <div className="pt-4 border-t border-dark-800 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-dark-400 block">
                  Total Estimated Duty & Clearing:
                </span>
                <div className="text-3xl font-heading font-black text-gold-400 font-mono">
                  GH₵ {Math.round(dutyCalc.totalEstimatedGhs).toLocaleString()}
                </div>
                <div className="text-xs text-dark-400 font-mono">
                  Approx. ${Math.round(dutyCalc.totalEstimatedUsd).toLocaleString()} USD
                </div>
              </div>

              <div className="pt-3">
                <a
                  href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(`Hello Jackdan Customs Desk, I computed an ICUMS estimate for a ${calcYear} vehicle valued at $${calcCifValue.toLocaleString()} USD (Estimated Duty: GH₵ ${Math.round(dutyCalc.totalEstimatedGhs).toLocaleString()}). Please confirm exact clearance valuation.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl gold-gradient-btn text-xs font-bold text-dark-950 flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Verify ICUMS Duty via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DEDICATED SISTER VENTURES (MARITIME & AVIATION DIVISIONS) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-dark-800/60">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.25em] font-mono uppercase text-gold-400 font-bold block mb-2">
            The Marque Conglomerate
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight">
            Integrated <span className="gold-gradient-text">Sister Ventures</span>
          </h2>
          <p className="mt-3 text-dark-300 text-sm sm:text-base leading-relaxed">
            Multimodal commercial freight forwarding with <strong>Twumaasco Logistics</strong> and global diplomatic visa advisory with <strong>Jackdan Travel & Tour</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Venture 1: Twumaasco Logistics & Trading */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-950/40 via-dark-900 to-dark-950 border border-blue-500/40 p-8 shadow-2xl flex flex-col justify-between space-y-6 hover:border-blue-400 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                  Maritime & Air Freight Division
                </span>
                <span className="text-xs text-blue-400 font-semibold flex items-center gap-1.5 font-mono">
                  <Ship className="w-4 h-4" />
                  <span>PORT OF TEMA CITADEL</span>
                </span>
              </div>

              <div>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-white group-hover:text-blue-300 transition-colors">
                  Twumaasco Logistics & Trading
                </h3>
                <p className="text-blue-400 text-xs font-mono font-bold uppercase tracking-wider mt-1">
                  "Your Trusted Logistics Partner"
                </p>
              </div>

              <p className="text-dark-300 text-sm leading-relaxed">
                Full-service international ocean shipping (FCL/LCL), express air cargo at KIA, bonded container storage yards, and flatbed haulage across all 16 regions of Ghana.
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="p-3 rounded-xl bg-dark-950/70 border border-dark-800 text-xs text-dark-200 flex items-center gap-2">
                  <Container className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>FCL & LCL Ocean Lines</span>
                </div>
                <div className="p-3 rounded-xl bg-dark-950/70 border border-dark-800 text-xs text-dark-200 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Air Freight Express (KIA)</span>
                </div>
                <div className="p-3 rounded-xl bg-dark-950/70 border border-dark-800 text-xs text-dark-200 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Heavy Flatbed Haulage</span>
                </div>
                <div className="p-3 rounded-xl bg-dark-950/70 border border-dark-800 text-xs text-dark-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Licensed Port Clearing</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-dark-800 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigatePage('twumaasco-logistics')}
                className="w-full sm:w-auto flex-1 py-3.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Launch Twumaasco Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent('Hello Twumaasco Logistics & Trading, I would like to inquire about ocean/air freight forwarding rates.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-dark-950 hover:bg-dark-800 border border-dark-700 text-blue-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Freight WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Venture 2: Jackdan Travel & Tour */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-950/40 via-dark-900 to-dark-950 border border-emerald-500/40 p-8 shadow-2xl flex flex-col justify-between space-y-6 hover:border-emerald-400 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                  Aviation & Consular Division
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 font-mono">
                  <Plane className="w-4 h-4" />
                  <span>KOTOKA INTL AIRPORT (KIA)</span>
                </span>
              </div>

              <div>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-white group-hover:text-emerald-300 transition-colors">
                  Jackdan Travel & Tour
                </h3>
                <p className="text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mt-1">
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
                  <span>Airline Flight Ticketing</span>
                </div>
                <div className="p-3 rounded-xl bg-dark-950/70 border border-dark-800 text-xs text-dark-200 flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Luxury Hotel Reservations</span>
                </div>
                <div className="p-3 rounded-xl bg-dark-950/70 border border-dark-800 text-xs text-dark-200 flex items-center gap-2">
                  <Luggage className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Safaris & VIP Chauffeur</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-dark-800 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigatePage('travel-tour')}
                className="w-full sm:w-auto flex-1 py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Launch Travel Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={`https://wa.me/${CONTACT_INFO.secondaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent('Hello Jackdan Travel & Tour, I would like to inquire about visa assistance / flight bookings.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-dark-950 hover:bg-dark-800 border border-dark-700 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Travel WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. OFFICIAL BRAND FLYERS & MARQUE CATALOGS */}
      <section className="py-20 bg-dark-900/60 border-y border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[10px] tracking-[0.25em] font-mono uppercase text-gold-400 font-bold block mb-2">
              Official Literature & Catalogs
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Official Brand <span className="gold-gradient-text">Catalogs & Flyers</span>
            </h2>
            <p className="mt-3 text-dark-300 text-sm sm:text-base leading-relaxed">
              Explore the official flyers for Jackdan Premium Ventures, Twumaasco Logistics & Trading, and Jackdan Travel & Tour. Click any flyer to zoom or download.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {flyers.map((flyer) => (
              <div 
                key={flyer.id}
                className="rounded-3xl bg-dark-950 border border-dark-800 hover:border-gold-500/50 shadow-2xl p-6 flex flex-col justify-between transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${flyer.badgeColor}`}>
                      {flyer.badge}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveFlyerModal(flyer)}
                      className="text-xs text-gold-400 hover:text-white flex items-center gap-1 font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Enlarge</span>
                    </button>
                  </div>

                  <div 
                    onClick={() => setActiveFlyerModal(flyer)}
                    className="relative cursor-pointer rounded-2xl overflow-hidden bg-dark-950 border border-dark-800 aspect-[4/5] flex items-center justify-center group/img"
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

                  <div>
                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-gold-300 transition-colors">
                      {flyer.title}
                    </h3>
                    <p className="text-gold-400 text-xs font-semibold mb-2">{flyer.subtitle}</p>
                    <p className="text-dark-300 text-xs leading-relaxed">{flyer.description}</p>
                  </div>
                </div>

                <div className="pt-5 border-t border-dark-800/80 mt-5 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => onNavigatePage(flyer.actionPage)}
                    className={`w-full py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md ${flyer.buttonBg}`}
                  >
                    <span>{flyer.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(`Hello Jackdan, I am inquiring about your ${flyer.title}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl border border-dark-700 hover:border-gold-500/50 text-dark-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-gold-400" />
                    <span>WhatsApp Inquiry for this Flyer</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. GENUINE OEM SPARE PARTS ATELIER */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[10px] tracking-[0.25em] font-mono uppercase text-gold-400 font-bold block mb-2">
              Factory Precision Engineering
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Direct-Import <span className="gold-gradient-text">OEM Components</span>
            </h2>
            <p className="text-dark-300 text-sm mt-2 max-w-xl">
              Factory replacement engines, gearboxes, brake rotors, tropical radiators, and heavy-duty suspension assemblies.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigatePage('parts')}
            className="self-start md:self-end px-6 py-3 rounded-xl bg-dark-900 hover:bg-dark-800 border border-gold-500/40 text-gold-400 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg"
          >
            <span>View All {SPARE_PARTS.length} Parts</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredParts.map((part) => (
            <div
              key={part.id}
              className="rounded-3xl bg-dark-950 border border-dark-800 hover:border-gold-500/50 p-6 flex flex-col justify-between space-y-4 shadow-2xl transition-all group"
            >
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-dark-900 border border-dark-800">
                  <img
                    src={part.image}
                    alt={part.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded bg-dark-950/85 backdrop-blur-md text-[10px] font-mono font-bold text-gold-400 border border-gold-500/30">
                    {part.category}
                  </div>
                </div>

                <div>
                  <h3 className="font-heading text-lg font-bold text-white group-hover:text-gold-300 transition-colors line-clamp-1">
                    {part.name}
                  </h3>
                  <div className="text-xl font-extrabold text-gold-400 font-mono mt-1">
                    {formatPrice(part.priceUSD)}
                  </div>
                  <span className="text-[11px] text-dark-400 font-mono">Part #{part.partNumber}</span>
                </div>

                <div className="text-[11px] text-dark-300 bg-dark-900 p-3 rounded-xl border border-dark-800">
                  <strong className="text-white block font-medium">Engine / Chassis Compatibility:</strong>
                  <span>{part.compatibility}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-dark-800">
                <a
                  href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(`Hello Jackdan Spare Parts desk, I would like to order: ${part.name} (Part #${part.partNumber}) priced at ${formatPrice(part.priceUSD)}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl gold-gradient-btn text-xs font-bold text-dark-950 flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. HEADQUARTERS & PHYSICAL ABOSSEY OKAI CITADEL ADDRESS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-dark-800/60">
        <div className="rounded-3xl bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900 border border-gold-500/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Col: Address Details (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-400 text-xs font-mono font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-gold-400" />
                <span>Official Corporate Headquarters</span>
              </div>

              <div>
                <h3 className="font-heading text-2xl sm:text-4xl font-black text-white">
                  Visit The Jackdan Citadel
                </h3>
                <p className="text-gold-400 font-mono font-bold text-xs sm:text-sm uppercase tracking-wider mt-1">
                  Abossey Okai Office & Clearing Hub
                </p>
              </div>

              {/* Exact Address Highlight Block */}
              <div className="p-6 rounded-2xl bg-dark-950 border border-gold-500/30 space-y-4">
                <div className="text-white font-extrabold text-sm sm:text-base tracking-wide leading-relaxed font-mono">
                  {CONTACT_INFO.companyName.toUpperCase()}
                  <br />
                  {CONTACT_INFO.poBox}
                  <br />
                  {CONTACT_INFO.landmark}, {CONTACT_INFO.area}, {CONTACT_INFO.city}, {CONTACT_INFO.country}
                </div>

                <div className="pt-3 border-t border-dark-800 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-dark-200 hover:text-white text-xs font-semibold transition-colors"
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Address Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gold-400" />
                        <span>Copy Exact Address</span>
                      </>
                    )}
                  </button>

                  <a
                    href={CONTACT_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 text-xs font-semibold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-dark-300">
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
                  <span>24/7 VIP Concierge WhatsApp</span>
                </div>
              </div>
            </div>

            {/* Right Col: Direction Guide Card (5 cols) */}
            <div className="lg:col-span-5">
              <div className="p-8 rounded-2xl bg-dark-950 border border-dark-800 space-y-4">
                <h4 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-gold-400" />
                  <span>How to Reach Us</span>
                </h4>
                <p className="text-xs text-dark-300 leading-relaxed">
                  Located in the vibrant Abossey Okai commercial hub in Accra, directly opposite the <strong>Lighthouse Chapel International</strong> and near <strong>Fanmilk</strong> depot.
                </p>

                <div className="space-y-2.5 pt-2 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-dark-900 border border-dark-800 text-dark-200">
                    <strong className="text-gold-400 block mb-0.5">Key Landmark:</strong>
                    Opposite Lighthouse Chapel International, Near Fanmilk
                  </div>
                  <div className="p-3.5 rounded-xl bg-dark-900 border border-dark-800 text-dark-200">
                    <strong className="text-gold-400 block mb-0.5">Postal Address:</strong>
                    P.O.BOX DK 1147, Accra, Ghana
                  </div>
                </div>

                <div className="pt-3">
                  <a
                    href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent('Hello Jackdan, I am on my way to your Abossey Okai office and need directions.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl gold-gradient-btn text-xs font-bold text-dark-950 flex items-center justify-center gap-2 shadow-lg"
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

      {/* 10. FLYER MODAL LIGHTBOX */}
      {activeFlyerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-3xl w-full bg-dark-900 border border-gold-500/50 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <div>
                <h4 className="font-heading font-bold text-white text-lg sm:text-xl">
                  {activeFlyerModal.title}
                </h4>
                <p className="text-gold-400 text-xs font-mono">{activeFlyerModal.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveFlyerModal(null)}
                className="p-2 rounded-xl text-dark-400 hover:text-white bg-dark-800 hover:bg-dark-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-dark-950 flex items-center justify-center max-h-[70vh]">
              <img
                src={activeFlyerModal.image}
                alt={activeFlyerModal.title}
                className="w-full h-auto max-h-[65vh] object-contain"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-dark-300 max-w-md">
                {activeFlyerModal.description}
              </p>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={activeFlyerModal.image}
                  download
                  className="flex-1 sm:flex-initial py-3 px-4 rounded-xl bg-dark-800 hover:bg-dark-700 text-dark-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Flyer</span>
                </a>
                <a
                  href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(`Hello Jackdan, I am looking at your flyer for ${activeFlyerModal.title} and would like to ask some questions.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial py-3 px-4 rounded-xl gold-gradient-btn text-xs font-bold text-dark-950 flex items-center justify-center gap-1.5"
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
