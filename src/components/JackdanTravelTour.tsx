import React, { useState } from 'react';
import {
  Plane,
  Hotel,
  Map,
  Users,
  Globe2,
  Calendar,
  PhoneCall,
  MessageSquare,
  Eye,
  X,
  Download,
  CheckCircle2,
  ShieldCheck,
  Award,
  Sparkles,
  Luggage,
  Clock,
  Compass,
  ArrowRight,
  Car,
  MapPin
} from 'lucide-react';
import { CONTACT_INFO } from '../data/inventory';

export const JackdanTravelTour: React.FC = () => {
  const [flyerModalOpen, setFlyerModalOpen] = useState(false);
  const [travelForm, setTravelForm] = useState({
    destination: 'United States (USA)',
    serviceType: 'Visa Advisory & Application Assistance',
    travelDate: '',
    numberOfTravelers: '1 Adult',
    accommodation: 'Luxury Hotel / Resort',
    specialNotes: ''
  });

  const travelServices = [
    {
      id: 'visa-assistance',
      name: 'Visa Assistance & Advisory',
      tagline: 'Expert Document Vetting & Interview Coaching',
      icon: Globe2,
      desc: 'High-success visa packaging, DS-160 filing, appointment scheduling, supporting financial document vetting, and mock interview coaching for USA, UK, Canada, Schengen Europe, and Dubai.',
      features: [
        'USA (B1/B2 Visitor, Student F-1 & Exchange J-1)',
        'UK Standard Visitor & Short Stay Visas',
        'Canada Tourist, Work & Study Permit Processing',
        'Schengen Europe Tourist & Business Visas',
        'Dubai (UAE) Express 30 & 60 Days Tourist Visas'
      ]
    },
    {
      id: 'flight-bookings',
      name: 'International Flight Bookings',
      tagline: 'Competitive Airfares Across Major Airlines',
      icon: Plane,
      desc: 'Seamless worldwide flight reservations, open-jaw itineraries, corporate ticket blocks, date changes, and baggage upgrades across top global carriers departing Kotoka International Airport (KIA).',
      features: [
        'Direct partnerships with Emirates, Qatar Airways, Delta & KLM',
        'Corporate discounted bulk tickets & flexible cancellation',
        'Seat selection, meal preferences & frequent flyer crediting',
        'Emergency 24/7 ticket re-issuance & re-routing'
      ]
    },
    {
      id: 'hotel-reservations',
      name: 'Worldwide Hotel & Resort Reservations',
      tagline: 'Hand-Picked 4 & 5-Star Accommodations',
      icon: Hotel,
      desc: 'Curated corporate and leisure hotel bookings across major business capitals and exotic vacation destinations at exclusive partner rates.',
      features: [
        'Centrally located business hotels with high-speed WiFi',
        'Luxury all-inclusive beach resorts and safari lodges',
        'Free breakfast & room upgrade options',
        'Verified hotel booking confirmations for visa applications'
      ]
    },
    {
      id: 'guided-tours',
      name: 'Curated Vacation Tours & Safaris',
      tagline: 'Memorable Domestic & International Excursions',
      icon: Map,
      desc: 'Tailor-made itineraries for family vacations, honeymoons, adventure safaris in Ghana (Mole National Park, Kakum Canopy Walk, Cape Coast Castle) and international holiday packages.',
      features: [
        'Ghana Heritage, Cultural & Eco-Tourism circuits',
        'Dubai Luxury Desert Safari & Burj Khalifa packages',
        'Kenya & Tanzania Serengeti wildlife migrations',
        'Professional licensed multilingual tour guides'
      ]
    },
    {
      id: 'corporate-delegations',
      name: 'Corporate & Group Travel Delegations',
      tagline: 'Turnkey Logistics for Business & Church Groups',
      icon: Users,
      desc: 'End-to-end travel management for corporate executives, government trade missions, church pilgrimages to Israel/Rome, and academic study tours.',
      features: [
        'Group flight charter coordination and block bookings',
        'Conference registration & exhibition logistics',
        'Dedicated travel escort & group itinerary manager',
        'Comprehensive travel medical & luggage insurance'
      ]
    },
    {
      id: 'airport-transfers',
      name: 'VIP Executive Airport Transfers',
      tagline: 'Chauffeur Pick-up & Drop-off at KIA',
      icon: Car,
      desc: 'Punctual, climate-controlled executive chauffeur transfers between Kotoka International Airport (KIA), hotels, embassies, and private residences in Greater Accra and beyond.',
      features: [
        'Meet-and-greet service inside KIA arrivals hall',
        'Premium luxury SUVs and executive sedans',
        'Professional, vetted security-trained chauffeurs',
        'Flight tracking for automatic delay adjustments'
      ]
    }
  ];

  const featuredDestinations = [
    {
      country: 'United States & Canada',
      city: 'New York, Washington, Toronto',
      type: 'Visa Advisory & Flights',
      tag: 'High Demand',
      icon: Globe2,
      desc: 'Complete B1/B2 tourist & student visa document preparation with airline ticketing.'
    },
    {
      country: 'United Kingdom & Europe',
      city: 'London, Paris, Frankfurt',
      type: 'Schengen & UK Visas',
      tag: 'Popular',
      icon: Map,
      desc: 'Standard visitor visas, hotel vouchers, and multi-city Eurail / flight packages.'
    },
    {
      country: 'United Arab Emirates',
      city: 'Dubai & Abu Dhabi',
      type: 'Express E-Visa & Tours',
      tag: 'Fast-Track',
      icon: Sparkles,
      desc: 'Guaranteed 48-72hr tourist visas, 5-star hotel stays, and desert safari experiences.'
    },
    {
      country: 'Explore Ghana Circuits',
      city: 'Cape Coast, Mole Park, Volta',
      type: 'Heritage & Safari Tours',
      tag: 'Local Wonder',
      icon: Compass,
      desc: 'Experience Kakum Rainforest canopy, Elmina slave castles, and wildlife safari game drives.'
    }
  ];

  const handleWhatsAppInquiry = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = `Hello Jackdan Travel & Tour!
I would like to make a travel inquiry:
- Destination: ${travelForm.destination}
- Service Needed: ${travelForm.serviceType}
- Travel Date / Period: ${travelForm.travelDate || 'Flexible / To Be Decided'}
- Travelers: ${travelForm.numberOfTravelers}
- Accommodation Preference: ${travelForm.accommodation}
- Additional Request: ${travelForm.specialNotes || 'Please contact me with advisory details and quotation.'}`;

    window.open(`https://wa.me/${CONTACT_INFO.secondaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const openWhatsAppService = (serviceName: string) => {
    const text = `Hello Jackdan Travel & Tour! I would like to inquire about your "${serviceName}" service.`;
    window.open(`https://wa.me/${CONTACT_INFO.secondaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 border-b border-dark-800">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Hero Information */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <Plane className="w-4 h-4 text-emerald-400" />
                <span>Jackdan Group Sister Venture • Worldwide Travel & Tourism</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                  JACKDAN <span className="text-emerald-400">TRAVEL</span> & TOUR
                </h1>
                <p className="text-gold-400 font-heading text-lg sm:text-xl font-bold tracking-wide uppercase">
                  "YOUR JOURNEY, OUR PRIORITY"
                </p>
              </div>

              <p className="text-dark-200 text-base sm:text-lg leading-relaxed">
                Full-service international travel agency dedicated to seamless visa advisory, competitive flight ticketing across global airlines, luxury hotel bookings, and memorable guided vacation excursions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-sm text-dark-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>USA, UK, Canada & Schengen Visa Advisory</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-dark-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Discounted Global Airline Flight Bookings</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-dark-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Luxury 4 & 5-Star Hotel Reservations</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-dark-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Ghana Heritage Safaris & VIP Airport Transfers</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleWhatsAppInquiry()}
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-3.5 px-6 rounded-xl text-sm flex items-center gap-2 shadow-xl shadow-emerald-600/20 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Book Travel Consultation</span>
                </button>

                <a
                  href={`tel:${CONTACT_INFO.secondaryPhoneFormatted}`}
                  className="py-3.5 px-6 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-600 hover:border-emerald-500/40 text-white font-semibold text-sm flex items-center gap-2 transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Call Travel Desk: {CONTACT_INFO.phones[1]}</span>
                </a>
              </div>
            </div>

            {/* Right Col: Official Travel Flyer Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-md group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 rounded-3xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500" />

                <div className="relative rounded-2xl bg-dark-900 border border-emerald-500/40 p-4 shadow-2xl overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-dark-800 mb-3">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Official Travel Flyer
                    </span>
                    <button
                      type="button"
                      onClick={() => setFlyerModalOpen(true)}
                      className="text-xs text-dark-300 hover:text-white flex items-center gap-1 bg-dark-800 hover:bg-dark-700 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Enlarge</span>
                    </button>
                  </div>

                  <div
                    onClick={() => setFlyerModalOpen(true)}
                    className="cursor-pointer rounded-xl overflow-hidden bg-dark-950 border border-dark-800 relative group/img aspect-[4/5] flex items-center justify-center"
                  >
                    <img
                      src="/assets/2_20260909_140845_0001.png"
                      alt="Jackdan Travel & Tour Official Flyer"
                      className="w-full h-full object-cover transform group-hover/img:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-dark-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xl">
                        <Eye className="w-4 h-4" />
                        <span>Click to Enlarge Flyer</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-dark-800 flex items-center justify-between">
                    <span className="text-[11px] text-dark-400">Jackdan Travel & Tour</span>
                    <button
                      type="button"
                      onClick={() => setFlyerModalOpen(true)}
                      className="text-xs text-emerald-400 hover:underline font-semibold"
                    >
                      View Full Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Numbers & Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-dark-900/80 border border-dark-800 text-center space-y-1">
            <div className="font-heading text-3xl sm:text-4xl font-extrabold text-emerald-400">95%+</div>
            <div className="text-xs sm:text-sm font-semibold text-white">Visa Advisory Success</div>
            <div className="text-[11px] text-dark-400">Rigorous document verification</div>
          </div>

          <div className="p-6 rounded-2xl bg-dark-900/80 border border-dark-800 text-center space-y-1">
            <div className="font-heading text-3xl sm:text-4xl font-extrabold text-emerald-400">50+</div>
            <div className="text-xs sm:text-sm font-semibold text-white">Airlines Ticketing</div>
            <div className="text-[11px] text-dark-400">Emirates, Qatar, Delta, KLM & more</div>
          </div>

          <div className="p-6 rounded-2xl bg-dark-900/80 border border-dark-800 text-center space-y-1">
            <div className="font-heading text-3xl sm:text-4xl font-extrabold text-emerald-400">100+</div>
            <div className="text-xs sm:text-sm font-semibold text-white">Global Destinations</div>
            <div className="text-[11px] text-dark-400">USA, UK, Europe, UAE & Asia</div>
          </div>

          <div className="p-6 rounded-2xl bg-dark-900/80 border border-dark-800 text-center space-y-1">
            <div className="font-heading text-3xl sm:text-4xl font-extrabold text-emerald-400">24/7</div>
            <div className="text-xs sm:text-sm font-semibold text-white">Travel Concierge Desk</div>
            <div className="text-[11px] text-dark-400">Emergency rebooking support</div>
          </div>
        </div>
      </section>

      {/* 3. Comprehensive Travel Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Luggage className="w-3.5 h-3.5" />
            <span>Complete Hospitality & Journey Solutions</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Travel Services by <span className="text-emerald-400">Jackdan Travel</span>
          </h2>
          <p className="mt-4 text-dark-300 text-base sm:text-lg">
            Experience stress-free travel with professional visa packaging, verified flight bookings, VIP hotel accommodations, and memorable tours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {travelServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="rounded-2xl bg-dark-900/90 border border-dark-800 hover:border-emerald-500/50 p-6 flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="font-heading text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {srv.name}
                    </h3>
                    <p className="text-xs text-emerald-400 font-medium">{srv.tagline}</p>
                  </div>

                  <p className="text-dark-300 text-xs sm:text-sm leading-relaxed">
                    {srv.desc}
                  </p>

                  <div className="pt-2 border-t border-dark-800 space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-dark-400 font-bold block">
                      Key Highlights:
                    </span>
                    {srv.features.map((feat, fidx) => (
                      <div key={fidx} className="flex items-start gap-2 text-xs text-dark-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-dark-800">
                  <button
                    type="button"
                    onClick={() => openWhatsAppService(srv.name)}
                    className="w-full py-2.5 px-4 rounded-xl bg-dark-800 hover:bg-emerald-600 text-dark-200 hover:text-white border border-dark-700 hover:border-emerald-500 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Inquire for {srv.name}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Global & Domestic Destination Circuits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-dark-900 border border-dark-800 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mb-10">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider inline-block mb-3">
              Popular Travel Hubs
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Featured Travel & Visa Destinations
            </h3>
            <p className="text-dark-300 text-sm mt-2">
              From North America and Europe to the Arabian Gulf and authentic Ghana safari adventures, we handle your complete journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((dest, idx) => {
              const Icon = dest.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-dark-950/80 border border-dark-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {dest.tag}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{dest.country}</h4>
                      <span className="text-xs text-dark-400">{dest.city}</span>
                    </div>
                    <p className="text-xs text-dark-300 leading-snug">{dest.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-dark-800">
                    <button
                      type="button"
                      onClick={() => openWhatsAppService(`${dest.country} Travel Package`)}
                      className="text-xs font-semibold text-emerald-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>Inquire for {dest.country}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Interactive Visa & Travel Inquiry Tool */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 border border-emerald-500/30 p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Col */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>Travel Consultation Desk</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                Plan Your Next International Journey With Us
              </h3>
              <p className="text-dark-300 text-sm leading-relaxed">
                Whether you need visa document coaching for an embassy interview, an urgent flight ticket to Europe or USA, or an all-inclusive family holiday, let our certified travel officers assist you.
              </p>

              <div className="p-4 rounded-2xl bg-dark-950/80 border border-dark-800 space-y-2">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Licensed & Confidential Handling</span>
                </div>
                <p className="text-[11px] text-dark-400 leading-normal">
                  All applicant passports, bank statements, and personal identity documents are handled under strict confidentiality protocols with personalized interview mock drills.
                </p>
              </div>
            </div>

            {/* Right Col: Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleWhatsAppInquiry} className="p-6 sm:p-8 rounded-2xl bg-dark-950 border border-dark-700/80 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
                      Destination Country
                    </label>
                    <select
                      value={travelForm.destination}
                      onChange={(e) => setTravelForm({ ...travelForm, destination: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700 text-white text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="United States (USA)">United States (USA)</option>
                      <option value="United Kingdom (UK)">United Kingdom (UK)</option>
                      <option value="Canada">Canada</option>
                      <option value="Schengen Europe (Germany, France, Italy)">Schengen Europe (Germany, France, Italy)</option>
                      <option value="Dubai / United Arab Emirates (UAE)">Dubai / United Arab Emirates (UAE)</option>
                      <option value="Ghana Domestic Tour (Cape Coast, Mole, Volta)">Ghana Domestic Tour (Cape Coast, Mole, Volta)</option>
                      <option value="Other Country">Other Country</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
                      Service Requested
                    </label>
                    <select
                      value={travelForm.serviceType}
                      onChange={(e) => setTravelForm({ ...travelForm, serviceType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700 text-white text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Visa Advisory & Application Assistance">Visa Advisory & Application Assistance</option>
                      <option value="International Flight Ticket Booking">International Flight Ticket Booking</option>
                      <option value="Hotel & Resort Reservation">Hotel & Resort Reservation</option>
                      <option value="Guided Vacation / Safari Tour Package">Guided Vacation / Safari Tour Package</option>
                      <option value="Corporate / Group Delegation Travel">Corporate / Group Delegation Travel</option>
                      <option value="KIA Airport Executive VIP Chauffeur Transfer">KIA Airport Executive VIP Chauffeur Transfer</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
                      Target Travel Date / Month
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Next Month / October 2026"
                      value={travelForm.travelDate}
                      onChange={(e) => setTravelForm({ ...travelForm, travelDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700 text-white text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
                      Number of Travelers
                    </label>
                    <select
                      value={travelForm.numberOfTravelers}
                      onChange={(e) => setTravelForm({ ...travelForm, numberOfTravelers: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700 text-white text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="1 Adult">1 Adult</option>
                      <option value="2 Adults (Couple)">2 Adults (Couple)</option>
                      <option value="Family (2 Adults + Children)">Family (2 Adults + Children)</option>
                      <option value="Small Group (3 - 5 Persons)">Small Group (3 - 5 Persons)</option>
                      <option value="Large Delegation / Church / Corporate Group (6+)">Large Delegation / Church / Corporate Group (6+)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
                    Specific Requests / Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Need appointment scheduling, visa interview coach, and return ticket"
                    value={travelForm.specialNotes}
                    onChange={(e) => setTravelForm({ ...travelForm, specialNotes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700 text-white text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Inquiry to Travel Desk on WhatsApp</span>
                  </button>
                  <a
                    href={`tel:${CONTACT_INFO.secondaryPhoneFormatted}`}
                    className="w-full sm:w-auto py-3 px-6 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                    <span>Call {CONTACT_INFO.phones[1]}</span>
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Physical Hub & Location */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-dark-900 border border-dark-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="font-heading text-xl font-bold text-white">Jackdan Travel & Tour Concierge Desk</h4>
            <p className="text-dark-300 text-xs sm:text-sm">
              {CONTACT_INFO.address}
            </p>
            <p className="text-xs text-emerald-400 font-semibold">
              In-person consultation available Monday to Saturday: 8:30 AM – 5:30 PM GMT
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${CONTACT_INFO.secondaryPhoneFormatted}`}
              className="py-3 px-5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-600 text-white text-xs sm:text-sm font-semibold flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>{CONTACT_INFO.phones[1]}</span>
            </a>
            <button
              type="button"
              onClick={() => handleWhatsAppInquiry()}
              className="py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Travel Desk</span>
            </button>
          </div>
        </div>
      </section>

      {/* Flyer Modal Lightbox */}
      {flyerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-3xl w-full bg-dark-900 border border-emerald-500/50 rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <div>
                <h4 className="font-heading font-bold text-white text-lg sm:text-xl">
                  Jackdan Travel & Tour Official Flyer
                </h4>
                <p className="text-emerald-400 text-xs">"Your Journey, Our Priority"</p>
              </div>
              <button
                type="button"
                onClick={() => setFlyerModalOpen(false)}
                className="p-2 rounded-xl text-dark-400 hover:text-white bg-dark-800 hover:bg-dark-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-dark-950 flex items-center justify-center max-h-[70vh]">
              <img
                src="/assets/2_20260909_140845_0001.png"
                alt="Jackdan Travel & Tour Official Flyer"
                className="w-full h-auto max-h-[65vh] object-contain"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-dark-300 max-w-md">
                Official travel advisory flyer featuring Visa Assistance, worldwide Flight Bookings, luxury Hotel Reservations, and curated Tours.
              </p>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href="/assets/2_20260909_140845_0001.png"
                  download="Jackdan_Travel_Official_Flyer.png"
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-dark-800 hover:bg-dark-700 text-dark-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleWhatsAppInquiry()}
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Inquire on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JackdanTravelTour;
