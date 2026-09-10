import React, { useState } from 'react';
import { 
  Search, 
  Compass, 
  Ship, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  PhoneCall, 
  Copy, 
  Check, 
  Anchor, 
  FileCheck, 
  Truck, 
  Sparkles
} from 'lucide-react';
import { SAMPLE_SHIPMENTS, ShipmentStatus, CONTACT_INFO } from '../data/inventory';

interface ShipmentTrackerProps {
  initialTrackingId?: string;
}

const STAGES = [
  { code: 'booked', label: 'Booked & Export Verified', icon: FileCheck, desc: 'Title verified, export docs sealed' },
  { code: 'origin_port', label: 'Origin Port Loaded', icon: Anchor, desc: 'Container stowed & secured' },
  { code: 'in_transit', label: 'Ocean Transit', icon: Ship, desc: 'Cruising international shipping lanes' },
  { code: 'customs_clearing', label: 'Discharged & Customs Clearing', icon: Clock, desc: 'ICUMS duty clearance at Tema' },
  { code: 'ready_for_pickup', label: 'Cleared & Handover Ready', icon: CheckCircle2, desc: 'Final detailing & client collection' },
];

export const ShipmentTracker: React.FC<ShipmentTrackerProps> = ({ initialTrackingId }) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialTrackingId || 'JKD-7829-GH');
  const [activeShipment, setActiveShipment] = useState<ShipmentStatus | null>(
    SAMPLE_SHIPMENTS[initialTrackingId || 'JKD-7829-GH'] || SAMPLE_SHIPMENTS['JKD-7829-GH']
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setHasSearched(true);
    const cleaned = searchQuery.trim().toUpperCase();
    
    // Check direct ID or VIN match
    const found = Object.values(SAMPLE_SHIPMENTS).find(
      (s) => s.trackingId.toUpperCase() === cleaned || s.vin.toUpperCase() === cleaned
    );

    if (found) {
      setActiveShipment(found);
    } else {
      setActiveShipment(null);
    }
  };

  const handleSelectSample = (id: string) => {
    setSearchQuery(id);
    setActiveShipment(SAMPLE_SHIPMENTS[id] || null);
    setHasSearched(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStageIndex = (statusCode: string) => {
    const map: Record<string, number> = {
      booked: 0,
      origin_port: 1,
      in_transit: 2,
      customs_clearing: 3,
      ready_for_pickup: 4
    };
    return map[statusCode] ?? 0;
  };

  const currentStageIndex = activeShipment ? getStageIndex(activeShipment.statusCode) : -1;

  const getWhatsAppSupportLink = () => {
    const text = activeShipment
      ? `Hello Jackdan Logistics Support, I would like a live milestone update on my shipment ${activeShipment.trackingId} (${activeShipment.vehicleName}).`
      : `Hello Jackdan Logistics Support, I need assistance tracking my auto shipment reference: ${searchQuery}.`;
    return `https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="tracker" className="py-24 bg-dark-950 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>24/7 Global Satellite Cargo Tracking</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Live Container & <span className="gold-gradient-text">Shipment Tracker</span>
          </h2>
          <p className="mt-4 text-dark-300 text-base sm:text-lg">
            Monitor your container vessel from port of origin across the Atlantic and Gulf of Guinea directly through Tema customs clearance to your doorstep.
          </p>

          {/* Quick Demo Badges */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
            <span className="text-xs text-dark-400 mr-2">Try Demo Shipments:</span>
            {Object.keys(SAMPLE_SHIPMENTS).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => handleSelectSample(id)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  searchQuery === id
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50 shadow-sm'
                    : 'bg-dark-800/80 text-dark-300 border border-dark-700 hover:border-dark-600 hover:text-white'
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Jackdan Tracking ID (e.g., JKD-7829-GH) or 17-digit VIN..."
              className="w-full pl-5 pr-32 sm:pr-36 py-4 rounded-2xl bg-dark-900 border border-dark-700 text-white placeholder-dark-400 focus:outline-none focus:border-gold-500 transition-all shadow-xl font-mono text-sm sm:text-base"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-5 sm:px-6 rounded-xl gold-gradient-btn font-semibold text-sm flex items-center gap-2 shadow-lg"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Track</span>
            </button>
          </form>
        </div>

        {/* Active Shipment Display */}
        {activeShipment ? (
          <div className="space-y-8">
            {/* Shipment Overview Header Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-dark-900/90 border border-dark-700/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left Info */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded-md bg-gold-500/10 border border-gold-500/30 text-gold-400 font-mono text-sm font-semibold flex items-center gap-2">
                      <span>{activeShipment.trackingId}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(activeShipment.trackingId)}
                        className="text-gold-400 hover:text-white"
                        title="Copy Tracking ID"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-dark-800 border border-dark-700 text-dark-300 font-mono text-xs">
                      VIN: {activeShipment.vin}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-semibold">
                      {activeShipment.containerNumber}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                    {activeShipment.vehicleName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-dark-300">
                    <div>
                      <span className="text-dark-400 block text-xs">Origin Port</span>
                      <span className="text-white font-medium">{activeShipment.origin}</span>
                    </div>
                    <div className="text-gold-400 font-bold hidden sm:block">➔</div>
                    <div>
                      <span className="text-dark-400 block text-xs">Destination</span>
                      <span className="text-white font-medium">{activeShipment.destination}</span>
                    </div>
                    <div>
                      <span className="text-dark-400 block text-xs">Vessel Carrier</span>
                      <span className="text-white font-medium">{activeShipment.vesselName}</span>
                    </div>
                  </div>
                </div>

                {/* Right Progress / ETA Badge */}
                <div className="lg:col-span-4 p-5 rounded-xl bg-dark-800/80 border border-dark-700/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider text-dark-400 font-semibold">
                      Estimated Port Arrival
                    </span>
                    <Calendar className="w-4 h-4 text-gold-400" />
                  </div>
                  <div className="font-heading text-xl sm:text-2xl font-bold text-gold-400">
                    {activeShipment.estimatedArrival}
                  </div>
                  <div className="mt-4 pt-3 border-t border-dark-700/60">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-dark-300">Voyage Completion</span>
                      <span className="font-mono text-gold-400 font-semibold">{activeShipment.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-dark-900 rounded-full overflow-hidden p-0.5 border border-dark-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold-500 via-amber-400 to-gold-300 transition-all duration-1000 shadow-sm"
                        style={{ width: `${activeShipment.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Interactive Timeline */}
            <div className="p-6 sm:p-8 rounded-2xl bg-dark-900/90 border border-dark-700/80 backdrop-blur-xl shadow-2xl">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-8 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Cargo Milestone Progression</span>
              </h4>

              {/* Horizontal Timeline (Desktop) & Vertical (Mobile) */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
                {STAGES.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isCompleted = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  const isFuture = idx > currentStageIndex;

                  return (
                    <div key={stage.code} className="relative flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-3">
                      {/* Step Indicator Dot */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                          isCompleted
                            ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40 shadow-lg shadow-gold-500/10'
                            : isCurrent
                            ? 'bg-gold-500 text-dark-950 font-bold border-2 border-gold-300 shadow-xl shadow-gold-500/30 scale-110 animate-pulse'
                            : 'bg-dark-800 text-dark-400 border border-dark-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Text */}
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 md:justify-center">
                          <span
                            className={`text-xs font-bold uppercase tracking-wider ${
                              isCurrent ? 'text-gold-400' : isCompleted ? 'text-white' : 'text-dark-400'
                            }`}
                          >
                            {stage.label}
                          </span>
                        </div>
                        <p className="text-xs text-dark-400 mt-1 leading-relaxed">{stage.desc}</p>
                        {isCurrent && (
                          <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-[10px] font-semibold uppercase tracking-wider">
                            Active Status
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chronological Event Log & Dispatch Action */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Event Logs (8 Cols) */}
              <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-dark-900/90 border border-dark-700/80 backdrop-blur-xl shadow-2xl">
                <h4 className="font-heading text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gold-400" />
                  <span>Chronological Dispatch & Waybill Log</span>
                </h4>

                <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-dark-700">
                  {activeShipment.updates.map((update, i) => (
                    <div key={i} className="relative flex items-start gap-4 pl-8">
                      {/* Timeline dot */}
                      <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-gold-500 border-2 border-dark-900 ring-2 ring-gold-500/30" />
                      
                      <div className="flex-1 bg-dark-800/60 border border-dark-700/60 p-4 rounded-xl">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <span className="font-medium text-white text-sm">{update.location}</span>
                          <span className="text-xs font-mono text-gold-400">
                            {update.date} • {update.time}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-dark-300 leading-relaxed">{update.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Dispatch Assistance (4 Cols) */}
              <div className="lg:col-span-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-dark-800 to-dark-900 border border-gold-500/30 shadow-2xl space-y-6">
                <h4 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-gold-400" />
                  <span>Logistics Liaison</span>
                </h4>
                <p className="text-xs text-dark-300 leading-relaxed">
                  Have questions regarding customs documentation, MPS Terminal 3 discharge schedules, or delivery destination change?
                </p>

                <div className="space-y-3 pt-2">
                  <a
                    href={getWhatsAppSupportLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full gold-gradient-btn py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 text-center shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Clearing Officer</span>
                  </a>

                  <a
                    href={`tel:${CONTACT_INFO.primaryPhoneFormatted}`}
                    className="w-full py-3 px-4 rounded-xl border border-dark-600 hover:border-gold-500/40 bg-dark-900/60 text-dark-200 hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 text-center transition-all"
                  >
                    <PhoneCall className="w-4 h-4 text-gold-400" />
                    <span>Call Port Dispatch</span>
                  </a>
                </div>

                <div className="pt-4 border-t border-dark-700/80 text-[11px] text-dark-400 leading-normal">
                  Tema Port Office: Commercial Warehouse Area, Gate 3 Corridor. Operating Hours: Mon - Sat 7:30 AM - 6:00 PM GMT.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-dark-900/90 border border-dark-700 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white">Tracking Reference Not Found</h3>
            <p className="text-sm text-dark-300 max-w-md mx-auto">
              We couldn't locate a manifest for <span className="font-mono text-gold-400">"{searchQuery}"</span>. Please double-check your Jackdan Waybill number or 17-digit VIN.
            </p>
            <div className="pt-2">
              <a
                href={getWhatsAppSupportLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gold-gradient-btn text-xs sm:text-sm font-bold"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Dispatch on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
