import React, { useState, useMemo } from 'react';
import { SparePart, SPARE_PARTS, EXCHANGE_RATES, CONTACT_INFO } from '../data/inventory';
import { Wrench, ShieldCheck, CheckCircle2, MessageCircle, Search, SlidersHorizontal, Layers, Sparkles, Box, Phone } from 'lucide-react';

interface SparePartsCatalogProps {
  currentCurrency: string;
}

export const SparePartsCatalog: React.FC<SparePartsCatalogProps> = ({ currentCurrency }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [orderType, setOrderType] = useState<'retail' | 'wholesale'>('retail');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePartModal, setActivePartModal] = useState<SparePart | null>(null);

  const categories = [
    'All',
    'Braking',
    'Engine & Transmission',
    'Suspension & Steering',
    'Batteries & Electrical',
    'Body & Lighting'
  ];

  const currencyInfo = EXCHANGE_RATES[currentCurrency] || EXCHANGE_RATES.USD;

  const formatPrice = (priceInUSD: number) => {
    // If wholesale, apply 15% wholesale discount display
    const price = orderType === 'wholesale' ? priceInUSD * 0.85 : priceInUSD;
    const converted = price * currencyInfo.rateFromUSD;
    return `${currencyInfo.symbol} ${converted.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const filteredParts = useMemo(() => {
    return SPARE_PARTS.filter((part) => {
      const matchesCategory = selectedCategory === 'All' || part.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        part.name.toLowerCase().includes(query) ||
        part.partNumber.toLowerCase().includes(query) ||
        part.compatibility.toLowerCase().includes(query) ||
        part.origin.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const getWhatsAppPartLink = (part: SparePart) => {
    const typeLabel = orderType === 'wholesale' ? 'Wholesale Batch' : 'Single Retail';
    const text = `Hello Jackdan Premium Ventures! I would like to order / inquire about the genuine spare part: "${part.name}" (Part No: ${part.partNumber}) for ${typeLabel} supply. Price: ${formatPrice(part.priceUSD)}. Please confirm stock and delivery timeline.`;
    return `https://wa.me/${CONTACT_INFO.primaryPhoneFormatted}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="parts" className="py-20 bg-[#0a0e19] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span>100% Genuine OEM Auto Components</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase font-heading tracking-wide">
            Genuine <span className="gold-gradient-text">Auto Spare Parts</span>
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Wholesale and retail options available for Japanese, European, and American auto brands. Imported directly from verified global manufacturers with factory warranties.
          </p>

          {/* Wholesale vs Retail Toggle */}
          <div className="inline-flex items-center gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 mt-6 shadow-xl">
            <button
              onClick={() => setOrderType('retail')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                orderType === 'retail'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Retail (Individual Orders)
            </button>
            <button
              onClick={() => setOrderType('wholesale')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                orderType === 'wholesale'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Wholesale (Containers & Garages)</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded ml-1">
                Save 15%
              </span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search part name, OEM No., car model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Parts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParts.map((part) => (
            <div 
              key={part.id}
              className="gold-border-card rounded-2xl overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Part Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img 
                    src={part.image} 
                    alt={part.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-500/30">
                      {part.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="font-mono bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 text-amber-300">
                      {part.partNumber}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                      <CheckCircle2 className="w-3 h-3" /> In Stock
                    </span>
                  </div>
                </div>

                {/* Body Info */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-white font-heading group-hover:text-amber-400 transition-colors line-clamp-2">
                    {part.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {part.description}
                  </p>

                  <div className="mt-3.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Compatibility:</span>
                    <span className="text-white font-medium">{part.compatibility}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Warranty: <strong className="text-slate-200">{part.warranty}</strong></span>
                    <span>Origin: <strong className="text-slate-200">{part.origin}</strong></span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">
                      {orderType === 'wholesale' ? 'Wholesale Tier:' : 'Retail Price:'}
                    </span>
                    <span className="text-lg font-extrabold gold-gradient-text font-heading">
                      {formatPrice(part.priceUSD)}
                    </span>
                  </div>

                  <a
                    href={getWhatsAppPartLink(part)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Order Part</span>
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Wholesale Bulk Container Banner */}
        <div className="mt-12 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/30 rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Box className="w-4 h-4" />
              <span>Commercial & Fleet Garages Supply</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
              Need 20ft / 40ft Container Orders of Mixed Auto Parts?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              We pack and consolidate mixed pallets of OEM brake pads, suspensions, filters, radiators, and body parts directly from Dubai, Europe, and Asia for retail shops and fleet workshops.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <a
              href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted}?text=${encodeURIComponent("Hello Jackdan, I would like to request a wholesale bulk container quote for spare parts.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-gradient-btn px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>Request Wholesale Proforma</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
