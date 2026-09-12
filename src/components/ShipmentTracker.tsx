import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Settings,
  Plus,
  Save,
  RotateCcw,
  Edit3,
  X,
  Lock,
  Unlock,
  FileCode,
  Trash2
} from 'lucide-react';
import { SAMPLE_SHIPMENTS, ShipmentStatus, CONTACT_INFO } from '../data/inventory';

interface ShipmentTrackerProps {
  initialTrackingId?: string;
}

const LOCAL_STORAGE_KEY = 'jackdan_live_shipments_v2';

const getInitialShipments = (): Record<string, ShipmentStatus> => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading saved shipments:', err);
  }
  return SAMPLE_SHIPMENTS;
};

const STAGES = [
  { code: 'booked', label: 'Booked & Export Verified', icon: FileCheck, desc: 'Title verified, export docs sealed', defaultProgress: 20 },
  { code: 'origin_port', label: 'Origin Port Loaded', icon: Anchor, desc: 'Container stowed & secured', defaultProgress: 40 },
  { code: 'in_transit', label: 'Ocean Transit', icon: Ship, desc: 'Cruising international shipping lanes', defaultProgress: 70 },
  { code: 'customs_clearing', label: 'Discharged & Customs Clearing', icon: Clock, desc: 'ICUMS duty clearance at Tema', defaultProgress: 90 },
  { code: 'ready_for_pickup', label: 'Cleared & Handover Ready', icon: CheckCircle2, desc: 'Final detailing & client collection', defaultProgress: 100 },
];

export const ShipmentTracker: React.FC<ShipmentTrackerProps> = ({ initialTrackingId }) => {
  const [allShipments, setAllShipments] = useState<Record<string, ShipmentStatus>>(getInitialShipments);
  const [searchQuery, setSearchQuery] = useState<string>(initialTrackingId || 'JKD-7829-GH');
  const [activeShipment, setActiveShipment] = useState<ShipmentStatus | null>(() => {
    const defaultKey = initialTrackingId || 'JKD-7829-GH';
    const init = getInitialShipments();
    return init[defaultKey] || Object.values(init)[0] || null;
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Owner / Admin Portal State
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState<boolean>(false);
  const [ownerKey, setOwnerKey] = useState<string>('JKD-7829-GH');
  const [editingShipment, setEditingShipment] = useState<ShipmentStatus>(() => {
    const init = getInitialShipments();
    return init['JKD-7829-GH'] || Object.values(init)[0];
  });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [codeCopied, setCodeCopied] = useState<boolean>(false);

  // Synchronize live with Admin Portal updates
  useEffect(() => {
    const handleStorageChange = () => {
      const updated = getInitialShipments();
      setAllShipments(updated);
      if (activeShipment && updated[activeShipment.trackingId]) {
        setActiveShipment(updated[activeShipment.trackingId]);
      }
    };
    window.addEventListener('jackdan_storage_updated', handleStorageChange);
    return () => window.removeEventListener('jackdan_storage_updated', handleStorageChange);
  }, [activeShipment]);

  // Quick New Log Event subform
  const [newLogDate, setNewLogDate] = useState<string>('Sep 12, 2026');
  const [newLogTime, setNewLogTime] = useState<string>('10:00 GMT');
  const [newLogLocation, setNewLogLocation] = useState<string>('Port of Tema (MPS Terminal 3)');
  const [newLogNote, setNewLogNote] = useState<string>('ICUMS assessment verified, container gated out for delivery');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setHasSearched(true);
    const cleaned = searchQuery.trim().toUpperCase();
    
    // Check direct ID or VIN match in allShipments
    const found = Object.values(allShipments).find(
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
    setActiveShipment(allShipments[id] || null);
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

  // Owner Portal Handlers
  const handleSelectForEdit = (id: string) => {
    setOwnerKey(id);
    setEditingShipment({ ...allShipments[id] });
    setSaveSuccessMsg('');
  };

  const handleCreateNewShipment = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `JKD-${randomNum}-GH`;
    const newShipment: ShipmentStatus = {
      trackingId: newId,
      vin: `2T3C1RFV${Math.floor(100000 + Math.random() * 900000)}`,
      vehicleName: '2021 Toyota RAV4 XLE AWD (Super White)',
      origin: 'Port of Newark (New Jersey, USA)',
      destination: 'Port of Tema (Ghana)',
      estimatedArrival: 'October 10, 2026',
      currentStatus: 'Vehicle Received at Origin Warehouse - Export Clearance Initiated',
      statusCode: 'booked',
      progressPercentage: 20,
      vesselName: 'MSC AURELIA V.049E',
      containerNumber: `MSCU-${Math.floor(1000000 + Math.random() * 9000000)}-40HC`,
      updates: [
        {
          date: 'Sep 12, 2026',
          time: '11:00 GMT',
          location: 'Origin Export Warehouse',
          note: 'Vehicle checked in, photographic condition inspection completed, booking sealed'
        }
      ]
    };
    setOwnerKey(newId);
    setEditingShipment(newShipment);
    setSaveSuccessMsg('New shipment initialized! Edit details below and click Save.');
  };

  const handleSaveCurrentShipment = () => {
    if (!editingShipment.trackingId) return;
    const updated = {
      ...allShipments,
      [editingShipment.trackingId]: editingShipment
    };
    setAllShipments(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
    if (activeShipment?.trackingId === editingShipment.trackingId || searchQuery === editingShipment.trackingId) {
      setActiveShipment(editingShipment);
    }
    setSaveSuccessMsg(`Shipment ${editingShipment.trackingId} saved live!`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleDeleteShipment = (id: string) => {
    if (window.confirm(`Are you sure you want to remove shipment ${id}?`)) {
      const copy = { ...allShipments };
      delete copy[id];
      setAllShipments(copy);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(copy));
      const remaining = Object.values(copy);
      if (remaining.length > 0) {
        setEditingShipment(remaining[0]);
        setOwnerKey(remaining[0].trackingId);
        setActiveShipment(remaining[0]);
      }
    }
  };

  const handleAddUpdateEvent = () => {
    if (!newLogNote.trim()) return;
    const newUpdates = [
      {
        date: newLogDate,
        time: newLogTime,
        location: newLogLocation,
        note: newLogNote
      },
      ...editingShipment.updates
    ];
    setEditingShipment({
      ...editingShipment,
      updates: newUpdates
    });
    setNewLogNote('');
  };

  const handleDeleteUpdateEvent = (index: number) => {
    const filtered = editingShipment.updates.filter((_, i) => i !== index);
    setEditingShipment({
      ...editingShipment,
      updates: filtered
    });
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all tracking records back to original defaults?')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setAllShipments(SAMPLE_SHIPMENTS);
      const first = Object.values(SAMPLE_SHIPMENTS)[0];
      setEditingShipment(first);
      setOwnerKey(first.trackingId);
      setActiveShipment(first);
      setSaveSuccessMsg('Reset to default sample shipments.');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    }
  };

  const handleExportCode = () => {
    const code = `export const SAMPLE_SHIPMENTS: Record<string, ShipmentStatus> = ${JSON.stringify(allShipments, null, 2)};`;
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 3000);
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

          {/* Quick Demo Badges & Owner Portal Trigger */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
            <span className="text-xs text-dark-400 mr-2">Track Active Shipments:</span>
            {Object.keys(allShipments).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => handleSelectSample(id)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  searchQuery === id
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50 shadow-sm font-bold'
                    : 'bg-dark-800/80 text-dark-300 border border-dark-700 hover:border-dark-600 hover:text-white'
                }`}
              >
                {id}
              </button>
            ))}

            {/* Owner / Staff Portal Button */}
            <button
              type="button"
              onClick={() => {
                setEditingShipment(allShipments[searchQuery] || Object.values(allShipments)[0]);
                setOwnerKey(searchQuery in allShipments ? searchQuery : Object.keys(allShipments)[0]);
                setIsOwnerModalOpen(true);
              }}
              className="ml-2 px-3.5 py-1 rounded-full bg-gold-500/15 hover:bg-gold-500/25 border border-gold-500/40 text-gold-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              title="Open Owner & Staff Tracking Manager"
            >
              <Settings className="w-3.5 h-3.5 text-gold-400" />
              <span>Owner / Dispatch Manager</span>
            </button>
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

        {/* OWNER / DISPATCH TRACKING MANAGEMENT MODAL */}
        {isOwnerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
            <div className="relative max-w-4xl w-full bg-[#0a0f1d] border-2 border-gold-500/50 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-dark-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-lg sm:text-xl flex items-center gap-2">
                      <span>Jackdan Cargo Dispatch Management</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-mono font-bold uppercase">
                        Owner Portal
                      </span>
                    </h3>
                    <p className="text-xs text-dark-300">
                      Create new tracking waybills, advance shipping milestones, log customs inspection notes, or sync data.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOwnerModalOpen(false)}
                  className="p-2 rounded-xl text-dark-400 hover:text-white bg-dark-800 hover:bg-dark-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0f172a] border border-dark-700">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <span className="text-xs font-semibold text-dark-300">Select Shipment:</span>
                  <select
                    value={ownerKey}
                    onChange={(e) => handleSelectForEdit(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-dark-900 border border-dark-600 text-white text-xs focus:border-gold-500 focus:outline-none"
                  >
                    {Object.values(allShipments).map((s) => (
                      <option key={s.trackingId} value={s.trackingId} className="bg-[#0f172a] text-white">
                        {s.trackingId} — {s.vehicleName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCreateNewShipment}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ New Shipment</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCode}
                    className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-600 text-dark-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                    title="Copies all active shipments as valid code for inventory.ts"
                  >
                    <FileCode className="w-3.5 h-3.5 text-gold-400" />
                    <span>{codeCopied ? 'Code Copied!' : 'Copy Code'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToDefaults}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                    title="Reset to initial default demo data"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Success Notification Alert */}
              {saveSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* Editing Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Core Shipment Manifest */}
                <div className="space-y-4 p-5 rounded-2xl bg-dark-900/60 border border-dark-800">
                  <div className="flex items-center justify-between border-b border-dark-800 pb-2">
                    <h4 className="font-heading font-bold text-white text-sm flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-gold-400" />
                      <span>Manifest & Identity</span>
                    </h4>
                    {Object.keys(allShipments).length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteShipment(editingShipment.trackingId)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-dark-300 mb-1">
                        Tracking ID / Waybill
                      </label>
                      <input
                        type="text"
                        value={editingShipment.trackingId}
                        onChange={(e) => setEditingShipment({ ...editingShipment, trackingId: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white font-mono text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-dark-300 mb-1">
                        17-Digit VIN Preview
                      </label>
                      <input
                        type="text"
                        value={editingShipment.vin}
                        onChange={(e) => setEditingShipment({ ...editingShipment, vin: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white font-mono text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-dark-300 mb-1">
                      Vehicle / Cargo Title
                    </label>
                    <input
                      type="text"
                      value={editingShipment.vehicleName}
                      onChange={(e) => setEditingShipment({ ...editingShipment, vehicleName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                      placeholder="e.g. 2021 Toyota RAV4 XLE AWD (Super White)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-dark-300 mb-1">
                        Origin Port & Country
                      </label>
                      <input
                        type="text"
                        value={editingShipment.origin}
                        onChange={(e) => setEditingShipment({ ...editingShipment, origin: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                        placeholder="e.g. Port of Newark (New Jersey, USA)"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-dark-300 mb-1">
                        Destination Port
                      </label>
                      <input
                        type="text"
                        value={editingShipment.destination}
                        onChange={(e) => setEditingShipment({ ...editingShipment, destination: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                        placeholder="e.g. Port of Tema (Ghana)"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-dark-300 mb-1">
                        Estimated Arrival (ETA)
                      </label>
                      <input
                        type="text"
                        value={editingShipment.estimatedArrival}
                        onChange={(e) => setEditingShipment({ ...editingShipment, estimatedArrival: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                        placeholder="e.g. September 22, 2026"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-dark-300 mb-1">
                        Vessel Name
                      </label>
                      <input
                        type="text"
                        value={editingShipment.vesselName}
                        onChange={(e) => setEditingShipment({ ...editingShipment, vesselName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                        placeholder="e.g. MSC AURELIA V.049E"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-dark-300 mb-1">
                      Container / Booking Reference
                    </label>
                    <input
                      type="text"
                      value={editingShipment.containerNumber}
                      onChange={(e) => setEditingShipment({ ...editingShipment, containerNumber: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white font-mono text-xs focus:border-gold-500 focus:outline-none"
                      placeholder="e.g. MSCU-9910482-40HC"
                    />
                  </div>
                </div>

                {/* Column 2: Status Milestones & Event Log */}
                <div className="space-y-4 p-5 rounded-2xl bg-dark-900/60 border border-dark-800 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="border-b border-dark-800 pb-2">
                      <h4 className="font-heading font-bold text-white text-sm flex items-center gap-1.5">
                        <Ship className="w-4 h-4 text-blue-400" />
                        <span>Live Stage & Milestones</span>
                      </h4>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-dark-300 mb-1">
                        Active Milestone Stage
                      </label>
                      <select
                        value={editingShipment.statusCode}
                        onChange={(e) => {
                          const newCode = e.target.value as any;
                          const stage = STAGES.find(s => s.code === newCode);
                          setEditingShipment({
                            ...editingShipment,
                            statusCode: newCode,
                            progressPercentage: stage?.defaultProgress ?? editingShipment.progressPercentage,
                            currentStatus: stage?.desc ?? editingShipment.currentStatus
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs focus:border-gold-500 focus:outline-none cursor-pointer"
                      >
                        {STAGES.map((stg) => (
                          <option key={stg.code} value={stg.code} className="bg-[#0f172a] text-white">
                            {stg.label} ({stg.defaultProgress}%)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-dark-300 mb-1">
                        Status Headline (Client-facing message)
                      </label>
                      <input
                        type="text"
                        value={editingShipment.currentStatus}
                        onChange={(e) => setEditingShipment({ ...editingShipment, currentStatus: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-dark-300 mb-1">
                        <span>Progress Percentage</span>
                        <span className="font-mono text-gold-400 font-bold">{editingShipment.progressPercentage}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editingShipment.progressPercentage}
                        onChange={(e) => setEditingShipment({ ...editingShipment, progressPercentage: Number(e.target.value) })}
                        className="w-full accent-gold-500 cursor-pointer"
                      />
                    </div>

                    {/* Timeline Updates Section */}
                    <div className="pt-2 border-t border-dark-800 space-y-2">
                      <label className="block text-[11px] font-bold text-white uppercase tracking-wider">
                        Add New Tracking Log Note:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={newLogDate}
                          onChange={(e) => setNewLogDate(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-dark-950 border border-dark-700 text-white text-xs"
                          placeholder="Date"
                        />
                        <input
                          type="text"
                          value={newLogTime}
                          onChange={(e) => setNewLogTime(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-dark-950 border border-dark-700 text-white text-xs"
                          placeholder="Time"
                        />
                        <input
                          type="text"
                          value={newLogLocation}
                          onChange={(e) => setNewLogLocation(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-dark-950 border border-dark-700 text-white text-xs"
                          placeholder="Location"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newLogNote}
                          onChange={(e) => setNewLogNote(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-dark-950 border border-dark-700 text-white text-xs"
                          placeholder="Note (e.g. Vessel berthed at Tema MPS Terminal 3)"
                        />
                        <button
                          type="button"
                          onClick={handleAddUpdateEvent}
                          className="px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-dark-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Log</span>
                        </button>
                      </div>

                      {/* Current Event History List */}
                      <div className="mt-3 max-h-36 overflow-y-auto space-y-1.5 pr-1">
                        <span className="text-[10px] text-dark-400 uppercase font-semibold">Active Log History ({editingShipment.updates.length}):</span>
                        {editingShipment.updates.map((u, i) => (
                          <div key={i} className="p-2 rounded-lg bg-dark-950/80 border border-dark-800 text-[11px] flex items-start justify-between gap-2">
                            <div>
                              <div className="text-gold-400 font-semibold">{u.date} • {u.time} ({u.location})</div>
                              <div className="text-dark-300">{u.note}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteUpdateEvent(i)}
                              className="text-dark-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                              title="Delete this event"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-dark-800">
                <span className="text-xs text-dark-400">
                  Changes save directly to browser storage & update the tracking screen in real time.
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOwnerModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-700 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCurrentShipment}
                    className="gold-gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Update Live Tracking</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
