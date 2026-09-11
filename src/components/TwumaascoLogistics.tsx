import React, { useState } from 'react';
import {
  Ship,
  Plane,
  Truck,
  Warehouse,
  Globe2,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  Calculator,
  Eye,
  X,
  Download,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  Sparkles,
  Package,
  Anchor,
  FileCheck,
  Container,
  Navigation
} from 'lucide-react';
import { CONTACT_INFO } from '../data/inventory';

export const TwumaascoLogistics: React.FC = () => {
  const [flyerModalOpen, setFlyerModalOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    originPort: 'USA (Newark/Houston)',
    cargoType: 'Vehicle / RoRo',
    containerSize: '40ft High Cube',
    destination: 'Tema Port (MPS Terminal 3)',
    customsRequired: 'Yes, Full ICUMS Clearing',
    cargoDescription: ''
  });
  const [estimatedCost, setEstimatedCost] = useState<string | null>(null);

  const logisticsServices = [
    {
      id: 'sea-freight',
      name: 'Sea Freight (FCL & LCL)',
      tagline: 'Full Container Load & Groupage Shipping',
      icon: Ship,
      desc: 'Cost-effective global ocean freight forwarding to Port of Tema & Takoradi from major maritime hubs across North America, Europe, UAE, and Asia.',
      features: [
        'Dedicated 20ft, 40ft & 40ft High Cube (HC) containers',
        'LCL consolidation for smaller cargo loads',
        'RoRo (Roll-on/Roll-off) vehicle shipping specialization',
        'Direct partnerships with MSC, Maersk, Grimaldi & CMA CGM'
      ]
    },
    {
      id: 'air-freight',
      name: 'Air Freight Cargo',
      tagline: 'Time-Critical International Express Transit',
      icon: Plane,
      desc: 'High-speed air cargo logistics for urgently needed spare parts, commercial electronics, sensitive documents, and high-value equipment landing directly at Kotoka International Airport (KIA).',
      features: [
        'Express 3-5 business days global transit',
        'Temperature-controlled & sensitive cargo handling',
        'Airport tarmac customs clearance & direct dispatch',
        'Charter services for oversized industrial machinery'
      ]
    },
    {
      id: 'warehousing',
      name: 'Secure Cargo Storage & Bonded Yard',
      tagline: '24/7 Monitored Bonded Facilities',
      icon: Warehouse,
      desc: 'State-of-the-art secure warehousing, container storage yards, and break-bulk holding spaces strategically located near the Tema port corridor.',
      features: [
        '24/7 CCTV surveillance & armed on-site security',
        'Bonded warehousing for duty-deferred cargo',
        'Forklift and heavy crane destuffing / stuffing',
        'Inventory tracking & computerized pallet management'
      ]
    },
    {
      id: 'haulage',
      name: 'Road Freight & Flatbed Haulage',
      tagline: 'Nationwide Delivery Across All 16 Regions',
      icon: Truck,
      desc: 'Heavy-duty transport fleet, low-bed trailers, and flatbed carriers delivering containerized and break-bulk goods from Tema/Takoradi to anywhere in Ghana and landlocked West African neighbors (Burkina Faso, Mali, Niger).',
      features: [
        'GPS-tracked modern truck fleet',
        'Escorted heavy-duty oversized cargo haulage',
        'Door-to-door doorstep vehicle carrier delivery',
        'Interstate transit permits and border transit documentation'
      ]
    },
    {
      id: 'customs',
      name: 'ICUMS Customs Clearance Brokerage',
      tagline: 'Zero Demurrage Fast-Track Release',
      icon: CheckCircle2,
      desc: 'Licensed customs brokerage team handling pre-arrival documentation, HS Code classification, GRA duty valuation, physical joint inspections, and customs release orders.',
      features: [
        'Integrated ICUMS filing & electronic manifest processing',
        'Duty assessment optimization within legal tariff schedules',
        'Fast turnaround (3-5 days average port exit)',
        'Direct MPS Terminal 3 gate pass handling'
      ]
    },
    {
      id: 'trading',
      name: 'Commercial Trading & Procurement',
      tagline: 'Global Sourcing & Supplier Vetting',
      icon: Globe2,
      desc: 'Connecting Ghanaian enterprises and merchants directly with verified manufacturers and export distributors in China, UAE, USA, and Europe with payment guarantees.',
      features: [
        'Factory audit and quality control inspections',
        'Letter of Credit (LC) & supplier trade facilitation',
        'Wholesale auto spare parts & machinery procurement',
        'Customs export compliance from origin countries'
      ]
    }
  ];

  const tradeRoutes = [
    {
      origin: 'USA East Coast (Newark / Savannah)',
      destination: 'Tema Port, Ghana',
      transitTime: '21 – 28 Days',
      vesselFrequency: 'Weekly Direct & Transshipment',
      icon: Anchor
    },
    {
      origin: 'Dubai / Jebel Ali Port, UAE',
      destination: 'Tema Port, Ghana',
      transitTime: '18 – 24 Days',
      vesselFrequency: 'Bi-Weekly Direct Line',
      icon: Ship
    },
    {
      origin: 'Antwerp / Hamburg / London (Europe)',
      destination: 'Tema Port, Ghana',
      transitTime: '14 – 20 Days',
      vesselFrequency: 'Weekly Express Sailings',
      icon: Container
    },
    {
      origin: 'Ningbo / Shanghai / Guangzhou (China)',
      destination: 'Tema Port, Ghana',
      transitTime: '28 – 35 Days',
      vesselFrequency: 'Multiple Weekly Sailings',
      icon: Globe2
    }
  ];

  const handleCalculateEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    let base = 1800;
    if (quoteForm.originPort.includes('USA')) base = 2100;
    if (quoteForm.originPort.includes('China')) base = 2600;
    if (quoteForm.containerSize.includes('40ft')) base += 1200;
    if (quoteForm.cargoType.includes('Air')) base = 1200;

    setEstimatedCost(`$${base.toLocaleString()} – $${(base + 750).toLocaleString()} USD`);
  };

  const openWhatsAppQuote = () => {
    const text = `Hello Twumaasco Logistics & Trading!
I would like to request a formal freight quotation:
- Origin Port: ${quoteForm.originPort}
- Cargo Type: ${quoteForm.cargoType}
- Container/Size: ${quoteForm.containerSize}
- Destination: ${quoteForm.destination}
- Customs Clearance Required: ${quoteForm.customsRequired}
- Additional Details: ${quoteForm.cargoDescription || 'Please contact me with rates and schedule.'}`;

    window.open(`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const openWhatsAppService = (serviceName: string) => {
    const text = `Hello Twumaasco Logistics! I am interested in inquiring about your "${serviceName}" service.`;
    window.open(`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 border-b border-dark-800">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Hero Information */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <Ship className="w-4 h-4 text-blue-400" />
                <span>Jackdan Group Sister Venture • Commercial Freight & Haulage</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                  TWUMAASCO <span className="text-blue-400">LOGISTICS</span> & TRADING
                </h1>
                <p className="text-gold-400 font-heading text-lg sm:text-xl font-bold tracking-wide uppercase">
                  "YOUR TRUSTED LOGISTICS PARTNER"
                </p>
              </div>

              <p className="text-dark-200 text-base sm:text-lg leading-relaxed">
                Specialized in worldwide multimodal ocean freight forwarding, air cargo operations, bonded container warehousing, and heavy flatbed road haulage across Ghana and West Africa.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-sm text-dark-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>FCL & LCL Ocean Freight to Tema / Takoradi</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-dark-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Time-Critical Air Cargo Express</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-dark-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Licensed ICUMS Customs Clearance</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-dark-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Heavy Haulage Across All 16 Regions</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={openWhatsAppQuote}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3.5 px-6 rounded-xl text-sm flex items-center gap-2 shadow-xl shadow-blue-600/20 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Request Instant Freight Quote</span>
                </button>

                <a
                  href={`tel:${CONTACT_INFO.primaryPhoneFormatted}`}
                  className="py-3.5 px-6 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-600 hover:border-blue-500/40 text-white font-semibold text-sm flex items-center gap-2 transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-blue-400" />
                  <span>Call Desk: {CONTACT_INFO.phones[0]}</span>
                </a>
              </div>
            </div>

            {/* Right Col: Official Logistics Flyer Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-md group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-700 rounded-3xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500" />

                <div className="relative rounded-2xl bg-dark-900 border border-blue-500/40 p-4 shadow-2xl overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-dark-800 mb-3">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Official Twumaasco Flyer
                    </span>
                    <button
                      type="button"
                      onClick={() => setFlyerModalOpen(true)}
                      className="text-xs text-dark-300 hover:text-white flex items-center gap-1 bg-dark-800 hover:bg-dark-700 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <span>Enlarge</span>
                    </button>
                  </div>

                  <div
                    onClick={() => setFlyerModalOpen(true)}
                    className="cursor-pointer rounded-xl overflow-hidden bg-dark-950 border border-dark-800 relative group/img aspect-[4/5] flex items-center justify-center"
                  >
                    <img
                      src="/assets/1_20260909_140844_0000.png"
                      alt="Twumaasco Logistics & Trading Official Flyer"
                      className="w-full h-full object-cover transform group-hover/img:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-dark-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xl">
                        <Eye className="w-4 h-4" />
                        <span>Click to Enlarge Flyer</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-dark-800 flex items-center justify-between">
                    <span className="text-[11px] text-dark-400">Twumaasco Logistics & Trading</span>
                    <button
                      type="button"
                      onClick={() => setFlyerModalOpen(true)}
                      className="text-xs text-blue-400 hover:underline font-semibold"
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

      {/* 2. Key Logistics Performance Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-dark-900/80 border border-dark-800 text-center space-y-1">
            <div className="font-heading text-3xl sm:text-4xl font-extrabold text-blue-400">500+</div>
            <div className="text-xs sm:text-sm font-semibold text-white">Containers Cleared Annually</div>
            <div className="text-[11px] text-dark-400">Zero demurrage record at Tema</div>
          </div>

          <div className="p-6 rounded-2xl bg-dark-900/80 border border-dark-800 text-center space-y-1">
            <div className="font-heading text-3xl sm:text-4xl font-extrabold text-blue-400">100%</div>
            <div className="text-xs sm:text-sm font-semibold text-white">Cargo Insurance Available</div>
            <div className="text-[11px] text-dark-400">Comprehensive marine & transit coverage</div>
          </div>

          <div className="p-6 rounded-2xl bg-dark-900/80 border border-dark-800 text-center space-y-1">
            <div className="font-heading text-3xl sm:text-4xl font-extrabold text-blue-400">16</div>
            <div className="text-xs sm:text-sm font-semibold text-white">Regions in Ghana Reached</div>
            <div className="text-[11px] text-dark-400">GPS tracked flatbed fleet</div>
          </div>

          <div className="p-6 rounded-2xl bg-dark-900/80 border border-dark-800 text-center space-y-1">
            <div className="font-heading text-3xl sm:text-4xl font-extrabold text-blue-400">3-5 Days</div>
            <div className="text-xs sm:text-sm font-semibold text-white">Express Air Cargo Delivery</div>
            <div className="text-[11px] text-dark-400">Direct KIA tarmac clearance</div>
          </div>
        </div>
      </section>

      {/* 3. Comprehensive Logistics Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Package className="w-3.5 h-3.5" />
            <span>End-to-End Freight Solutions</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Logistics Services by <span className="text-blue-400">Twumaasco</span>
          </h2>
          <p className="mt-4 text-dark-300 text-base sm:text-lg">
            From single pallet LCL groupage to multi-container commercial imports and heavy industrial haulage, we deliver seamless freight solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {logisticsServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="rounded-2xl bg-dark-900/90 border border-dark-800 hover:border-blue-500/50 p-6 flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="font-heading text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                      {srv.name}
                    </h3>
                    <p className="text-xs text-blue-400 font-medium">{srv.tagline}</p>
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
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-dark-800">
                  <button
                    type="button"
                    onClick={() => openWhatsAppService(srv.name)}
                    className="w-full py-2.5 px-4 rounded-xl bg-dark-800 hover:bg-blue-600 text-dark-200 hover:text-white border border-dark-700 hover:border-blue-500 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
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

      {/* 4. Global Shipping Routes & Transit Times */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-dark-900 border border-dark-800 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mb-10">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider inline-block mb-3">
              Trade Lanes & Corridors
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Major Shipping Lanes Directly to Port of Tema
            </h3>
            <p className="text-dark-300 text-sm mt-2">
              We operate scheduled weekly and bi-weekly container and RoRo departures connecting the world's most active industrial ports to Ghana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tradeRoutes.map((route, idx) => {
              const Icon = route.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-dark-950/80 border border-dark-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-dark-400 tracking-wider block">Origin</span>
                    <h4 className="text-sm font-bold text-white">{route.origin}</h4>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-dark-400 tracking-wider block">Destination</span>
                    <p className="text-xs text-blue-300 font-semibold">{route.destination}</p>
                  </div>
                  <div className="pt-2 border-t border-dark-800 flex items-center justify-between text-xs">
                    <span className="text-dark-400">Est. Transit:</span>
                    <span className="font-bold text-white">{route.transitTime}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Interactive Freight Quote Request Tool */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 border border-blue-500/30 p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Explanatory copy */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5" />
                <span>Instant Freight Quotation</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                Get an Immediate Commercial Shipping Estimate
              </h3>
              <p className="text-dark-300 text-sm leading-relaxed">
                Whether you are importing a full container of industrial equipment, shipping personal effects from the diaspora, or needing express air cargo, build your quote request here.
              </p>

              <div className="p-4 rounded-2xl bg-dark-950/80 border border-dark-800 space-y-2">
                <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Transparent Rates Guarantee</span>
                </div>
                <p className="text-[11px] text-dark-400 leading-normal">
                  All quotes include ocean/air freight, terminal handling options, and optional ICUMS customs clearing package with zero unexpected post-arrival demurrage charges.
                </p>
              </div>

              {estimatedCost && (
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/40 text-center animate-fadeIn">
                  <span className="text-xs text-blue-300 block mb-1">Estimated Freight Range</span>
                  <div className="text-2xl font-black text-white font-mono">{estimatedCost}</div>
                  <span className="text-[11px] text-dark-400 block mt-1">Excludes local customs duty & terminal handling</span>
                </div>
              )}
            </div>

            {/* Right: Interactive Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleCalculateEstimate} className="p-6 sm:p-8 rounded-2xl bg-dark-950 border border-dark-700/80 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
                      Origin Port / Country
                    </label>
                    <select
                      value={quoteForm.originPort}
                      onChange={(e) => setQuoteForm({ ...quoteForm, originPort: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="USA (Newark / Savannah / Houston)">USA (Newark / Savannah / Houston)</option>
                      <option value="UAE (Dubai / Jebel Ali)">UAE (Dubai / Jebel Ali)</option>
                      <option value="Europe (Antwerp / Hamburg / London)">Europe (Antwerp / Hamburg / London)</option>
                      <option value="China (Ningbo / Guangzhou / Shanghai)">China (Ningbo / Guangzhou / Shanghai)</option>
                      <option value="Canada (Toronto / Montreal)">Canada (Toronto / Montreal)</option>
                      <option value="Japan / South Korea">Japan / South Korea</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
                      Shipping Type / Method
                    </label>
                    <select
                      value={quoteForm.cargoType}
                      onChange={(e) => setQuoteForm({ ...quoteForm, cargoType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Ocean Freight Container (FCL)">Ocean Freight Container (FCL)</option>
                      <option value="Vehicle / RoRo Shipping">Vehicle / RoRo Shipping</option>
                      <option value="LCL Groupage / Shared Container">LCL Groupage / Shared Container</option>
                      <option value="Air Freight Express (KIA)">Air Freight Express (KIA)</option>
                      <option value="Heavy Machinery & Project Cargo">Heavy Machinery & Project Cargo</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
                      Container / Volume Size
                    </label>
                    <select
                      value={quoteForm.containerSize}
                      onChange={(e) => setQuoteForm({ ...quoteForm, containerSize: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="20ft Standard Container">20ft Standard Container</option>
                      <option value="40ft High Cube Container">40ft High Cube (HC) Container</option>
                      <option value="Single Vehicle (RoRo / Containerized)">Single Vehicle (RoRo / Containerized)</option>
                      <option value="Pallets / Less than Container (LCL)">Pallets / Less than Container (LCL)</option>
                      <option value="Air Cargo Package (< 100 kg)">Air Cargo Package (&lt; 100 kg)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
                      Destination in Ghana
                    </label>
                    <select
                      value={quoteForm.destination}
                      onChange={(e) => setQuoteForm({ ...quoteForm, destination: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Tema Port (MPS Terminal 3)">Tema Port (MPS Terminal 3)</option>
                      <option value="Takoradi Port">Takoradi Port</option>
                      <option value="Accra / Doorstep Delivery">Accra / Doorstep Delivery</option>
                      <option value="Kumasi Logistics Hub">Kumasi Logistics Hub</option>
                      <option value="Tamale / Northern Corridor">Tamale / Northern Corridor</option>
                      <option value="Transit to Burkina Faso / Mali">Transit to Burkina Faso / Mali</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
                    Cargo Description / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2 SUVs + 10 boxes of auto spare parts, ready to load next week"
                    value={quoteForm.cargoDescription}
                    onChange={(e) => setQuoteForm({ ...quoteForm, cargoDescription: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-lg"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Calculate Estimate</span>
                  </button>
                  <button
                    type="button"
                    onClick={openWhatsAppQuote}
                    className="w-full sm:w-auto py-3 px-6 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send to WhatsApp Desk</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Physical Hub & Contact */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-dark-900 border border-dark-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="font-heading text-xl font-bold text-white">Twumaasco Logistics & Trading Operations Desk</h4>
            <p className="text-dark-300 text-xs sm:text-sm">
              {CONTACT_INFO.address}
            </p>
            <p className="text-xs text-blue-400 font-semibold">
              Tema Port MPS Terminal 3 ICUMS Brokerage Desk • Spintex & Abossey Okai Dispatch
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${CONTACT_INFO.primaryPhoneFormatted}`}
              className="py-3 px-5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-600 text-white text-xs sm:text-sm font-semibold flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-blue-400" />
              <span>{CONTACT_INFO.phones[0]}</span>
            </a>
            <button
              type="button"
              onClick={openWhatsAppQuote}
              className="py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </button>
          </div>
        </div>
      </section>

      {/* Flyer Modal Lightbox */}
      {flyerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-3xl w-full bg-dark-900 border border-blue-500/50 rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <div>
                <h4 className="font-heading font-bold text-white text-lg sm:text-xl">
                  Twumaasco Logistics & Trading Official Flyer
                </h4>
                <p className="text-blue-400 text-xs">"Your Trusted Logistics Partner"</p>
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
                src="/assets/1_20260909_140844_0000.png"
                alt="Twumaasco Logistics & Trading Official Flyer"
                className="w-full h-auto max-h-[65vh] object-contain"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-dark-300 max-w-md">
                Full-service international freight forwarding, bonded container warehousing, and West Africa road haulage.
              </p>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href="/assets/1_20260909_140844_0000.png"
                  download="Twumaasco_Logistics_Official_Flyer.png"
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-dark-800 hover:bg-dark-700 text-dark-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={openWhatsAppQuote}
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
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

export default TwumaascoLogistics;
