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
  MapPin
} from 'lucide-react';
import { CONTACT_INFO, EXCHANGE_RATES } from '../data/inventory';

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

  const flyers = [
    {
      id: 'auto',
      title: 'Auto Import & Export Flyer',
      subtitle: 'Your Trusted Auto Import & Export Partner',
      description: 'Official promotional catalog highlighting our international vehicle sourcing, luxury sedans, rugged 4x4 SUVs, and genuine OEM auto parts.',
      image: '/assets/YOUR TRUSTED AUTO IMPORT AND EXPORT PARTNER_20260909_141036_0000.png',
      badge: 'Main Brand Flyer',
      badgeColor: 'bg-gold-500/20 text-gold-400 border-gold-500/40',
      actionPage: 'inventory',
      actionLabel: 'View Vehicle Inventory'
    },
    {
      id: 'logistics',
      title: 'Twumaasco Logistics & Trading Flyer',
      subtitle: 'Your Trusted Logistics Partner',
      description: 'Comprehensive freight forwarding flyer covering Sea Freight (FCL/LCL), Air Freight, Bonded Warehousing, and West Africa road haulage.',
      image: '/assets/1_20260909_140844_0000.png',
      badge: 'Sister Company: Logistics',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      actionPage: 'ventures',
      actionLabel: 'Explore Logistics Services'
    },
    {
      id: 'travel',
      title: 'Jackdan Travel & Tour Flyer',
      subtitle: 'Your Journey, Our Priority',
      description: 'Official travel advisory flyer featuring Visa Assistance, worldwide Flight Bookings, luxury Hotel Reservations, and curated Group Tours.',
      image: '/assets/2_20260909_140845_0001.png',
      badge: 'Sister Company: Travel',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      actionPage: 'ventures',
      actionLabel: 'Explore Travel & Tour'
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Consultation & Car Selection',
      desc: 'Tell us the exact make, model, year, and budget you desire. We source directly from dealer auctions and showrooms across the USA, Canada, UAE, Europe, and Asia.',
      icon: Car
    },
    {
      num: '02',
      title: 'Inspection & Title Verification',
      desc: 'Our overseas agents conduct multi-point mechanical inspections, verify clean titles, verify accident history (CarFax/AutoCheck), and prepare export documentation.',
      icon: ShieldCheck
    },
    {
      num: '03',
      title: 'Ocean Shipping & Tracking',
      desc: 'Your vehicle is safely loaded onto RoRo or secured container vessels. You receive a live satellite Jackdan tracking number to monitor the voyage across international lanes.',
      icon: Ship
    },
    {
      num: '04',
      title: 'Tema Customs & Handover',
      desc: 'Our registered ICUMS customs clearing team completes duty assessments, terminal handling, and delivers the clean-titled car with keys directly to your doorstep.',
      icon: Award
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero / Brand Overview Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 border-b border-dark-800">
        {/* Background glow & accents */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Brand Story & Welcoming Intro (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>Licensed Automobile Importer & Customs Clearing Partner</span>
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

              {/* Informational Paragraphs */}
              <p className="text-dark-200 text-base sm:text-lg leading-relaxed">
                Welcome to <strong>Jackdan Premium Ventures</strong>, Ghana's premier gateway for international automobile importation, genuine OEM spare parts, and integrated freight logistics.
              </p>
              <p className="text-dark-300 text-sm sm:text-base leading-relaxed">
                Whether you are purchasing a brand-new luxury SUV from Dubai, sourcing a clean-title sedan from American dealer auctions, or ordering verified spare parts wholesale, we manage the entire journey with transparent pricing, guaranteed delivery times, and expert Port of Tema customs clearing.
              </p>

              {/* Key Highlights Checkmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-sm text-dark-200">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <span>Direct USA, UAE, Europe & Asia Sourcing</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-dark-200">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <span>100% Genuine OEM Auto Spare Parts</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-dark-200">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <span>Hassle-Free Port of Tema Customs Clearing</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-dark-200">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <span>Doorstep Delivery Across All Regions in Ghana</span>
                </div>
              </div>

              {/* Primary Call-to-Actions */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gold-gradient-btn py-3.5 px-6 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xl"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Us on WhatsApp</span>
                </a>

                <a
                  href={`tel:${CONTACT_INFO.primaryPhoneFormatted}`}
                  className="py-3.5 px-6 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-600 hover:border-gold-500/40 text-white font-semibold text-sm flex items-center gap-2 transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-gold-400" />
                  <span>Call {CONTACT_INFO.phones[0]}</span>
                </a>

                <button
                  type="button"
                  onClick={() => onNavigatePage('inventory')}
                  className="py-3.5 px-5 rounded-xl text-gold-400 hover:text-white hover:underline text-sm font-semibold flex items-center gap-1.5 transition-all"
                >
                  <span>Browse Available Cars</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Featured Flyer Showcase Card (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-md group">
                {/* Gold glowing ambient border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 rounded-3xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500" />

                {/* Main Flyer Card Frame */}
                <div className="relative rounded-2xl bg-dark-900 border border-gold-500/40 p-4 shadow-2xl overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-dark-800 mb-3">
                    <span className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Official Business Flyer
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
                    className="cursor-pointer rounded-xl overflow-hidden bg-dark-950 border border-dark-800 relative group/img"
                  >
                    <img
                      src="/assets/YOUR TRUSTED AUTO IMPORT AND EXPORT PARTNER_20260909_141036_0000.png"
                      alt="Jackdan Auto Import Official Flyer"
                      className="w-full h-auto object-cover transform group-hover/img:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-dark-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 rounded-xl bg-gold-500 text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow-xl">
                        <Eye className="w-4 h-4" />
                        <span>Click to View Full Size</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-dark-800 text-center">
                    <p className="text-xs text-dark-300">
                      Importing certified cars & genuine spare parts direct to Ghana.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Numbers & Credibility Bar */}
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
            <div className="text-[11px] text-dark-400">Wholesale & Retail for all brands</div>
          </div>

          <div className="p-6 rounded-2xl bg-dark-900/80 border border-dark-800 text-center space-y-1">
            <div className="font-heading text-3xl sm:text-4xl font-extrabold text-gold-400">ICUMS</div>
            <div className="text-xs sm:text-sm font-semibold text-white">Registered Clearing Agent</div>
            <div className="text-[11px] text-dark-400">Zero demurrage fast-track clearance</div>
          </div>

          <div className="p-6 rounded-2xl bg-dark-900/80 border border-dark-800 text-center space-y-1">
            <div className="font-heading text-3xl sm:text-4xl font-extrabold text-gold-400">16</div>
            <div className="text-xs sm:text-sm font-semibold text-white">Regions in Ghana Served</div>
            <div className="text-[11px] text-dark-400">Flatbed delivery to your gate</div>
          </div>
        </div>
      </section>

      {/* 3. Core Services - Clear & Informational */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>Comprehensive Solutions</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            What We Do at <span className="gold-gradient-text">Jackdan</span>
          </h2>
          <p className="mt-4 text-dark-300 text-base sm:text-lg">
            We simplify global commerce and automotive ownership for Ghanaian individuals, car dealers, commercial fleet operators, and businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Service 1: Auto Import */}
          <div className="p-6 rounded-2xl bg-dark-900/90 border border-dark-800 hover:border-gold-500/40 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white group-hover:text-gold-300 transition-colors">
                Automobile Import & Sourcing
              </h3>
              <p className="text-dark-300 text-xs sm:text-sm leading-relaxed">
                Brand new, certified pre-owned, and foreign used cars sourced directly from verified overseas dealerships and auction houses with transparent title histories.
              </p>
            </div>
            <div className="pt-4 border-t border-dark-800">
              <button
                type="button"
                onClick={() => onNavigatePage('inventory')}
                className="text-xs font-bold text-gold-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>View Vehicle Inventory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Service 2: Spare Parts */}
          <div className="p-6 rounded-2xl bg-dark-900/90 border border-dark-800 hover:border-gold-500/40 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white group-hover:text-gold-300 transition-colors">
                Genuine OEM Spare Parts
              </h3>
              <p className="text-dark-300 text-xs sm:text-sm leading-relaxed">
                Wholesale and retail genuine auto parts for Mercedes-Benz, Toyota, Land Rover, Hyundai, and more. Guaranteed authentic with factory warranty.
              </p>
            </div>
            <div className="pt-4 border-t border-dark-800">
              <button
                type="button"
                onClick={() => onNavigatePage('parts')}
                className="text-xs font-bold text-gold-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>Browse Spare Parts Catalog</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Service 3: Customs Duty & Clearing */}
          <div className="p-6 rounded-2xl bg-dark-900/90 border border-dark-800 hover:border-gold-500/40 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white group-hover:text-gold-300 transition-colors">
                Duty Calculation & Clearing
              </h3>
              <p className="text-dark-300 text-xs sm:text-sm leading-relaxed">
                Accurate ICUMS/GRA import duty assessment, Port of Tema terminal handling, and compliance clearing with zero hidden demurrage charges.
              </p>
            </div>
            <div className="pt-4 border-t border-dark-800">
              <button
                type="button"
                onClick={() => onNavigatePage('calculator')}
                className="text-xs font-bold text-gold-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>Calculate Import Duty</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Service 4: Cargo Tracking */}
          <div className="p-6 rounded-2xl bg-dark-900/90 border border-dark-800 hover:border-gold-500/40 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                <Ship className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white group-hover:text-gold-300 transition-colors">
                Container Vessel Tracking
              </h3>
              <p className="text-dark-300 text-xs sm:text-sm leading-relaxed">
                Track your vehicle or shipping container across 5 key voyage milestones with estimated arrival dates, carrier info, and direct officer support.
              </p>
            </div>
            <div className="pt-4 border-t border-dark-800">
              <button
                type="button"
                onClick={() => onNavigatePage('tracker')}
                className="text-xs font-bold text-gold-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>Track Live Shipment</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROMINENT FLYER SHOWCASE - Featuring the Owner's Actual Flyers */}
      <section className="py-16 bg-dark-900/70 border-y border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Catalogs & Service Flyers</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Our Official <span className="gold-gradient-text">Flyers & Portfolios</span>
            </h2>
            <p className="mt-4 text-dark-300 text-base sm:text-lg">
              Explore the official flyers for Jackdan Premium Ventures and our integrated sister companies. Click any flyer to view high-resolution details or inquire directly.
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
                        <span>View Full Flyer</span>
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
                    className="w-full py-2.5 px-4 rounded-xl gold-gradient-btn text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
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

      {/* 5. How It Works - The 4 Simple Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Clock className="w-3.5 h-3.5" />
            <span>Simple, Transparent Workflow</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            How We Import Your Car to <span className="gold-gradient-text">Ghana</span>
          </h2>
          <p className="mt-4 text-dark-300 text-base sm:text-lg">
            No confusion, no unexpected duties, no port delays. We handle every phase from overseas auction to your driveway.
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

        {/* Action button beneath process */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => onNavigatePage('calculator')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gold-gradient-btn font-bold text-sm sm:text-base shadow-xl"
          >
            <Calculator className="w-5 h-5" />
            <span>Try the Import Cost & Duty Estimator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 6. Sister Companies Overview (Twumaasco & Jackdan Travel) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-dark-700/80 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider inline-block">
                The Jackdan Business Ecosystem
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                More Than Cars: Freight Logistics & Worldwide Travel
              </h2>
              <p className="text-dark-300 text-sm sm:text-base leading-relaxed">
                Through our trusted sister ventures, we deliver commercial ocean/air freight forwarding, container warehousing, and international visa/travel consultancy.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-dark-950/60 border border-dark-700">
                  <h4 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gold-400" />
                    <span>Twumaasco Logistics & Trading</span>
                  </h4>
                  <p className="text-xs text-dark-400">
                    Sea & Air Freight, Cargo Storage, Freight Forwarding & Road Haulage.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-dark-950/60 border border-dark-700">
                  <h4 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                    <Plane className="w-4 h-4 text-gold-400" />
                    <span>Jackdan Travel & Tour</span>
                  </h4>
                  <p className="text-xs text-dark-400">
                    Visa Assistance, Global Flight Bookings, Hotel Reservations & Guided Tours.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                type="button"
                onClick={() => onNavigatePage('ventures')}
                className="w-full gold-gradient-btn py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <span>View Full Sister Ventures Page</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent('Hello Jackdan Group, I would like to inquire about your Logistics & Travel services.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-dark-950 hover:bg-dark-800 border border-dark-600 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-green-400" />
                <span>Quick WhatsApp Consultation</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Corporate Contact Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-dark-900 border border-gold-500/30 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                We Are Here to Help You
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Ready to Import Your Dream Vehicle or Order Spare Parts?
              </h3>
              <p className="text-dark-300 text-sm max-w-xl">
                Call our dispatch desk or visit our office in Greater Accra. We provide transparent quotes within 15 minutes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0">
              <a
                href={`tel:${CONTACT_INFO.primaryPhoneFormatted}`}
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-600 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-gold-400" />
                <span>{CONTACT_INFO.phones[0]}</span>
              </a>

              <button
                type="button"
                onClick={() => onNavigatePage('contact')}
                className="w-full sm:w-auto gold-gradient-btn py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl"
              >
                <span>Open Contact Page</span>
                <ArrowRight className="w-4 h-4" />
              </button>
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
