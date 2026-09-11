import React, { useState, useMemo } from 'react';
import { Vehicle, VEHICLES, EXCHANGE_RATES, CONTACT_INFO } from '../data/inventory';
import { 
  Fuel, Gauge, MapPin, ShieldCheck, Sparkles, MessageCircle, 
  Eye, X, CheckCircle, ArrowRight, DollarSign, Search, SlidersHorizontal 
} from 'lucide-react';

interface VehicleInventoryProps {
  currentCurrency: string;
  initialSearch?: string;
  onSelectForCalculation?: (vehicle: Vehicle) => void;
}

export const VehicleInventory: React.FC<VehicleInventoryProps> = ({
  currentCurrency,
  initialSearch = '',
  onSelectForCalculation
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMake, setSelectedMake] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const categories = ['All', 'Sedan', 'SUV', 'Truck'];
  const makes = ['All', 'Toyota', 'Hyundai', 'Honda'];

  const currencyInfo = EXCHANGE_RATES[currentCurrency] || EXCHANGE_RATES.USD;

  const formatPrice = (priceInUSD: number) => {
    const converted = priceInUSD * currencyInfo.rateFromUSD;
    return `${currencyInfo.symbol} ${converted.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const filteredVehicles = useMemo(() => {
    return VEHICLES.filter((vehicle) => {
      const matchesCategory = selectedCategory === 'All' || vehicle.category === selectedCategory;
      const matchesMake = selectedMake === 'All' || vehicle.make === selectedMake;
      const matchesCondition = selectedCondition === 'All' || vehicle.condition.includes(selectedCondition);
      
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        vehicle.name.toLowerCase().includes(query) ||
        vehicle.make.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.engine.toLowerCase().includes(query) ||
        vehicle.location.toLowerCase().includes(query);

      return matchesCategory && matchesMake && matchesCondition && matchesSearch;
    });
  }, [selectedCategory, selectedMake, selectedCondition, searchQuery]);

  const getWhatsAppVehicleLink = (vehicle: Vehicle) => {
    const text = `Hello Jackdan Premium Ventures! I am interested in importing / buying the ${vehicle.name} (${formatPrice(vehicle.priceUSD)} - VIN: ${vehicle.vinPreview}). Please share full details, shipping timeline, and landing estimate.`;
    return `https://wa.me/${CONTACT_INFO.primaryPhoneFormatted}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="inventory" className="py-20 bg-[#080c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Available & In-Transit Fleet</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase font-heading tracking-wide">
              Featured <span className="gold-gradient-text">Premium Vehicles</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Inspect clean-title foreign used and brand new luxury cars, SUVs, and commercial trucks ready for worldwide shipment and customs clearance.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
            <span>Showing: <strong className="text-amber-400 font-bold">{filteredVehicles.length}</strong> vehicles</span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl mb-8 space-y-4 shadow-xl">
          
          {/* Top row: Category tabs & Search input */}
          <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Live Search Box */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by keyword (e.g. Prado, AMG, 2024)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Bottom row: Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400 font-medium">Refine:</span>
            </div>

            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Makes</option>
              {makes.filter(m => m !== 'All').map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Conditions</option>
              <option value="Certified">Certified Pre-Owned</option>
              <option value="Foreign Used">Foreign Used / Clean Title</option>
              <option value="Brand New">Brand New</option>
            </select>

            {(selectedCategory !== 'All' || selectedMake !== 'All' || selectedCondition !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedMake('All');
                  setSelectedCondition('All');
                  setSearchQuery('');
                }}
                className="text-amber-400 hover:underline ml-auto font-medium"
              >
                Reset All Filters
              </button>
            )}
          </div>

        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-base">No vehicles found matching your specific filter criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedMake('All');
                setSelectedCondition('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
            >
              Clear Filters & View Full Fleet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div 
                key={vehicle.id}
                className="gold-border-card rounded-2xl overflow-hidden flex flex-col group relative"
              >
                {/* Image & Badges */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-amber-500/40">
                      {vehicle.year}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-semibold text-slate-200 border border-slate-700">
                      {vehicle.condition}
                    </span>
                  </div>

                  {vehicle.popular && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-lg">
                        POPULAR
                      </span>
                    </div>
                  )}

                  {/* Location Pin Bottom-Left of Image */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] text-slate-300 bg-slate-950/90 px-2.5 py-1 rounded-md border border-slate-800 backdrop-blur-sm">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{vehicle.location}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Vehicle Title */}
                    <h3 className="text-lg font-bold text-white font-heading group-hover:text-amber-400 transition-colors line-clamp-2">
                      {vehicle.name}
                    </h3>

                    {/* Price */}
                    <div className="mt-2.5 flex items-baseline justify-between">
                      <div>
                        <span className="text-xl font-extrabold gold-gradient-text font-heading">
                          {formatPrice(vehicle.priceUSD)}
                        </span>
                        {currentCurrency !== 'USD' && (
                          <span className="text-[11px] text-slate-400 ml-2">
                            (approx. ${vehicle.priceUSD.toLocaleString()} USD)
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {vehicle.category}
                      </span>
                    </div>

                    {/* Quick Specs Grid */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5 text-amber-400" />
                        <span>{vehicle.mileage}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5 text-amber-400" />
                        <span>{vehicle.fuelType} • {vehicle.transmission}</span>
                      </div>
                    </div>

                    {/* Key Features Chips */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {vehicle.features.slice(0, 2).map((feat, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60">
                          {feat}
                        </span>
                      ))}
                      {vehicle.features.length > 2 && (
                        <span className="text-[10px] bg-slate-800/80 text-amber-400/90 px-1.5 py-0.5 rounded">
                          +{vehicle.features.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedVehicle(vehicle)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>View Details</span>
                    </button>

                    <a
                      href={getWhatsAppVehicleLink(vehicle)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gold-gradient-btn py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                      title="Direct WhatsApp Inquiry"
                    >
                      <MessageCircle className="w-4 h-4 fill-slate-950" />
                      <span>Inquire</span>
                    </a>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Vehicle Full Specs Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0f1422] border border-amber-500/40 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0f1422]/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
              <div className="pr-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {selectedVehicle.condition} • {selectedVehicle.category}
                </span>
                <h3 className="text-xl font-bold text-white font-heading mt-1">
                  {selectedVehicle.name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              
              {/* Image banner */}
              <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-950">
                <img 
                  src={selectedVehicle.image} 
                  alt={selectedVehicle.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md border border-amber-500/40 px-4 py-2 rounded-xl">
                  <span className="text-xs text-slate-400 block">Export Price:</span>
                  <span className="text-xl font-extrabold gold-gradient-text font-heading">
                    {formatPrice(selectedVehicle.priceUSD)}
                  </span>
                </div>
              </div>

              {/* Full Specs Table */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Make / Model</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">{selectedVehicle.make} {selectedVehicle.model}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Year</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">{selectedVehicle.year}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Mileage</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">{selectedVehicle.mileage}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Engine Output</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">{selectedVehicle.engine}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Fuel / Transmission</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">{selectedVehicle.fuelType} • {selectedVehicle.transmission}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">VIN Identification</span>
                  <span className="text-amber-300 font-mono font-bold text-sm mt-0.5 block">{selectedVehicle.vinPreview}</span>
                </div>
              </div>

              {/* Features List */}
              <div>
                <h4 className="text-sm font-bold text-white font-heading uppercase tracking-wider mb-3">
                  Vehicle Highlights & Equipment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedVehicle.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-300 bg-slate-900/40 p-2 rounded-lg border border-slate-800/80">
                      <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Jackdan Guarantee */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs">
                <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-amber-300">Jackdan Verified Inspection Guarantee</h5>
                  <p className="text-slate-300 mt-1">
                    This unit has passed our pre-export 150-point mechanical check, clean title verification, and diagnostic scan. Full photographic log provided prior to vessel loading.
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer CTAs */}
            <div className="sticky bottom-0 bg-[#0f1422]/95 backdrop-blur-md px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400 text-center sm:text-left">
                <span>Direct inquiry hotline: <strong className="text-amber-400">{CONTACT_INFO.phones[0]}</strong></span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {onSelectForCalculation && (
                  <button
                    onClick={() => {
                      onSelectForCalculation(selectedVehicle);
                      setSelectedVehicle(null);
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                  >
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                    <span>Calculate Landing Duty</span>
                  </button>
                )}
                <a
                  href={getWhatsAppVehicleLink(selectedVehicle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gold-gradient-btn flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>Request Full Dossier on WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
