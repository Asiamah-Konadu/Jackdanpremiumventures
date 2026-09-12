import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Ship, 
  ShieldCheck, 
  ArrowRight, 
  MessageSquare, 
  DollarSign, 
  Building2, 
  MapPin, 
  Sparkles,
  Info,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { EXCHANGE_RATES, CONTACT_INFO } from '../data/inventory';

interface ImportCalculatorProps {
  currentCurrency: string;
}

interface OriginOption {
  country: string;
  port: string;
  roroBaseUSD: number;
  containerBaseUSD: number;
  transitDays: string;
}

const ORIGIN_HUBS: Record<string, OriginOption> = {
  usa_east: { country: 'United States (East Coast)', port: 'Newark / Baltimore / Savannah', roroBaseUSD: 1450, containerBaseUSD: 3850, transitDays: '18 - 24 days' },
  usa_west: { country: 'United States (West / Gulf)', port: 'Houston / Los Angeles', roroBaseUSD: 1850, containerBaseUSD: 4400, transitDays: '26 - 32 days' },
  canada: { country: 'Canada', port: 'Halifax / Montreal', roroBaseUSD: 1550, containerBaseUSD: 3950, transitDays: '20 - 26 days' },
  uae: { country: 'United Arab Emirates', port: 'Dubai (Jebel Ali)', roroBaseUSD: 1350, containerBaseUSD: 3300, transitDays: '16 - 22 days' },
  germany: { country: 'Germany / Western Europe', port: 'Bremerhaven / Antwerp', roroBaseUSD: 1250, containerBaseUSD: 3200, transitDays: '14 - 18 days' },
  uk: { country: 'United Kingdom', port: 'Southampton / Tilbury', roroBaseUSD: 1200, containerBaseUSD: 3100, transitDays: '12 - 16 days' },
  japan: { country: 'Japan', port: 'Yokohama / Kobe', roroBaseUSD: 1950, containerBaseUSD: 4600, transitDays: '30 - 38 days' },
  china: { country: 'China', port: 'Ningbo / Guangzhou', roroBaseUSD: 2100, containerBaseUSD: 4200, transitDays: '28 - 35 days' },
};

export const ImportCalculator: React.FC<ImportCalculatorProps> = ({ currentCurrency }) => {
  const [vehicleValueUSD, setVehicleValueUSD] = useState<number>(35000);
  const [vehicleType, setVehicleType] = useState<string>('suv');
  const [originKey, setOriginKey] = useState<string>('usa_east');
  const [shippingMethod, setShippingMethod] = useState<'roro' | 'container' | 'air'>('roro');
  const [vehicleAge, setVehicleAge] = useState<'new' | '1to5' | '6to10' | 'over10'>('1to5');
  const [destinationPort, setDestinationPort] = useState<string>('tema');
  const [includeDoorstepDelivery, setIncludeDoorstepDelivery] = useState<boolean>(true);

  const currencyInfo = EXCHANGE_RATES[currentCurrency] || EXCHANGE_RATES.USD;

  const formatAmount = (usd: number) => {
    const val = usd * currencyInfo.rateFromUSD;
    return `${currencyInfo.symbol}${Math.round(val).toLocaleString()}`;
  };

  const calculation = useMemo(() => {
    const origin = ORIGIN_HUBS[originKey] || ORIGIN_HUBS.usa_east;
    
    // 1. Freight & Transit Insurance
    let baseFreight = shippingMethod === 'roro' ? origin.roroBaseUSD : origin.containerBaseUSD;
    if (shippingMethod === 'air') {
      baseFreight = 7500;
    }
    if (vehicleType === 'truck' || vehicleType === 'luxury_suv') {
      baseFreight *= 1.15;
    }
    const marineInsurance = vehicleValueUSD * 0.015; // 1.5% CIF insurance
    const totalFreightAndInsurance = Math.round(baseFreight + marineInsurance);

    // CIF Value (Cost, Insurance, Freight)
    const cifValueUSD = vehicleValueUSD + totalFreightAndInsurance;

    // 2. Ghana Customs Duties & Import Levies (benchmark ICUMS/GRA model)
    // Basic duty: 10% or 20% depending on type
    let dutyRate = 0.20; // 20% standard import duty
    if (vehicleType === 'commercial') dutyRate = 0.10;
    
    // Age penalty surcharge (Ghana GRA overage tax for >10 yrs)
    let agePenalty = 0;
    if (vehicleAge === 'over10') {
      agePenalty = cifValueUSD * 0.15; // 15% overage levy
    } else if (vehicleAge === '6to10') {
      agePenalty = cifValueUSD * 0.05;
    }

    const importDuty = cifValueUSD * dutyRate;
    const vatAndLevies = cifValueUSD * 0.185; // VAT, NHIL, GETFund, COVID levy
    const ecowasLevy = cifValueUSD * 0.005;
    const totalCustomsDuties = Math.round(importDuty + vatAndLevies + ecowasLevy + agePenalty);

    // 3. Port Handling & GPHA Terminal charges
    const portHandlingUSD = destinationPort === 'tema' ? 850 : 920;

    // 4. Jackdan Documentation & Concierge Clearing
    const clearingConciergeUSD = 650;
    const deliveryUSD = includeDoorstepDelivery ? 350 : 0;
    const jackdanServiceFees = clearingConciergeUSD + deliveryUSD;

    // Total Landed Cost (excluding initial vehicle purchase value for the fee summary, and total combined)
    const totalFeesUSD = totalFreightAndInsurance + totalCustomsDuties + portHandlingUSD + jackdanServiceFees;
    const grandTotalUSD = vehicleValueUSD + totalFeesUSD;

    return {
      fobValue: vehicleValueUSD,
      freightAndInsurance: totalFreightAndInsurance,
      customsDuties: totalCustomsDuties,
      portHandling: portHandlingUSD,
      jackdanService: jackdanServiceFees,
      totalImportFees: totalFeesUSD,
      grandTotal: grandTotalUSD,
      transitDays: origin.transitDays
    };
  }, [vehicleValueUSD, vehicleType, originKey, shippingMethod, vehicleAge, destinationPort, includeDoorstepDelivery]);

  const generateWhatsAppLink = () => {
    const origin = ORIGIN_HUBS[originKey]?.country || 'USA';
    const text = `Hello Jackdan Premium Ventures! 
I just used your Ghana Import & Duty Estimator:
- Vehicle Value (FOB): $${vehicleValueUSD.toLocaleString()}
- Vehicle Category: ${vehicleType.toUpperCase()}
- Origin: ${origin}
- Shipping Method: ${shippingMethod.toUpperCase()}
- Destination: Port of ${destinationPort === 'tema' ? 'Tema' : 'Takoradi'}
- Estimated Duty & Fees: ${formatAmount(calculation.totalImportFees)}
- Total Estimated Landed Cost: ${formatAmount(calculation.grandTotal)}

I would like an official guaranteed quote and shipping booking with your clearing team.`;
    return `https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="calculator" className="py-24 bg-dark-900/80 relative overflow-hidden border-t border-dark-700/50">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>Transparent ICUMS & Clearing Breakdown</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Import Cost & Duty <span className="gold-gradient-text">Estimator</span>
          </h2>
          <p className="mt-4 text-dark-300 text-base sm:text-lg">
            Plan your car import with zero surprises. Calculate accurate freight rates, estimated Ghana customs duty (ICUMS/GRA), and terminal clearing fees from global ports directly to Tema.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-dark-800/80 border border-dark-700/80 backdrop-blur-xl shadow-2xl space-y-6">
              <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2.5 pb-4 border-b border-dark-700">
                <Ship className="w-5 h-5 text-gold-400" />
                <span>1. Shipment & Vehicle Specifications</span>
              </h3>

              {/* Vehicle FOB Price Slider & Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="fob-slider" className="text-sm font-medium text-dark-200">
                    Vehicle Purchase Value (FOB / Auction Price)
                  </label>
                  <span className="font-heading font-bold text-gold-400 text-lg">
                    ${vehicleValueUSD.toLocaleString()} USD
                  </span>
                </div>
                <input
                  id="fob-slider"
                  type="range"
                  min="5000"
                  max="180000"
                  step="1000"
                  value={vehicleValueUSD}
                  onChange={(e) => setVehicleValueUSD(Number(e.target.value))}
                  className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-gold-500"
                />
                <div className="flex justify-between text-xs text-dark-400 mt-1">
                  <span>$5,000</span>
                  <span>$50,000</span>
                  <span>$100,000</span>
                  <span>$180,000+</span>
                </div>
              </div>

              {/* Vehicle Category & Year Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="calc-vehicle-type" className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-2">
                    Body Style / Category
                  </label>
                  <select
                    id="calc-vehicle-type"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0f172a] border border-dark-700 text-white focus:border-gold-500 focus:outline-none transition-colors text-sm cursor-pointer"
                  >
                    <option value="sedan" className="bg-[#0f172a] text-white py-2">Sedan / Coupe / Hatchback</option>
                    <option value="suv" className="bg-[#0f172a] text-white py-2">Compact / Midsize SUV</option>
                    <option value="luxury_suv" className="bg-[#0f172a] text-white py-2">Full-Size Luxury SUV (GLS, Range Rover, Escalade)</option>
                    <option value="truck" className="bg-[#0f172a] text-white py-2">Pickup Truck / Van (Hilux, Tundra, F-150)</option>
                    <option value="commercial" className="bg-[#0f172a] text-white py-2">Heavy Duty / Commercial Bus</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="calc-vehicle-age" className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-2">
                    Vehicle Age (GRA Penalty Bracket)
                  </label>
                  <select
                    id="calc-vehicle-age"
                    value={vehicleAge}
                    onChange={(e) => setVehicleAge(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0f172a] border border-dark-700 text-white focus:border-gold-500 focus:outline-none transition-colors text-sm cursor-pointer"
                  >
                    <option value="new" className="bg-[#0f172a] text-white py-2">Brand New (2025 - 2026)</option>
                    <option value="1to5" className="bg-[#0f172a] text-white py-2">1 - 5 Years Old (2021 - 2024)</option>
                    <option value="6to10" className="bg-[#0f172a] text-white py-2">6 - 10 Years Old (2016 - 2020)</option>
                    <option value="over10" className="bg-[#0f172a] text-white py-2">Over 10 Years (Subject to Over-Age Tax)</option>
                  </select>
                </div>
              </div>

              {/* Origin Hub */}
              <div>
                <label htmlFor="calc-origin-hub" className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-2">
                  Origin Country & Loading Port
                </label>
                <select
                  id="calc-origin-hub"
                  value={originKey}
                  onChange={(e) => setOriginKey(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0f172a] border border-dark-700 text-white focus:border-gold-500 focus:outline-none transition-colors text-sm cursor-pointer"
                >
                  {Object.entries(ORIGIN_HUBS).map(([key, opt]) => (
                    <option key={key} value={key} className="bg-[#0f172a] text-white py-2">
                      {opt.country} — {opt.port} ({opt.transitDays})
                    </option>
                  ))}
                </select>
              </div>

              {/* Shipping Method Pills */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-2">
                  Shipping Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setShippingMethod('roro')}
                    className={`py-3 px-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      shippingMethod === 'roro'
                        ? 'border-gold-500 bg-gold-500/10 text-gold-300 font-semibold shadow-lg shadow-gold-500/10'
                        : 'border-dark-700 bg-dark-900/60 text-dark-300 hover:border-dark-600'
                    }`}
                  >
                    <span className="text-sm">RoRo Vessel</span>
                    <span className="text-[11px] text-dark-400">Drive-on / Drive-off</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingMethod('container')}
                    className={`py-3 px-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      shippingMethod === 'container'
                        ? 'border-gold-500 bg-gold-500/10 text-gold-300 font-semibold shadow-lg shadow-gold-500/10'
                        : 'border-dark-700 bg-dark-900/60 text-dark-300 hover:border-dark-600'
                    }`}
                  >
                    <span className="text-sm">Container (FCL)</span>
                    <span className="text-[11px] text-dark-400">Enclosed & Secured</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingMethod('air')}
                    className={`py-3 px-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      shippingMethod === 'air'
                        ? 'border-gold-500 bg-gold-500/10 text-gold-300 font-semibold shadow-lg shadow-gold-500/10'
                        : 'border-dark-700 bg-dark-900/60 text-dark-300 hover:border-dark-600'
                    }`}
                  >
                    <span className="text-sm">Air Freight</span>
                    <span className="text-[11px] text-dark-400">4-7 Days Express</span>
                  </button>
                </div>
              </div>

              {/* Destination Port & Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label htmlFor="calc-destination-port" className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-2">
                    Ghana Discharge Port
                  </label>
                  <select
                    id="calc-destination-port"
                    value={destinationPort}
                    onChange={(e) => setDestinationPort(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0f172a] border border-dark-700 text-white focus:border-gold-500 focus:outline-none transition-colors text-sm cursor-pointer"
                  >
                    <option value="tema" className="bg-[#0f172a] text-white py-2">Port of Tema (MPS Terminal 3)</option>
                    <option value="takoradi" className="bg-[#0f172a] text-white py-2">Port of Takoradi</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeDoorstepDelivery}
                      onChange={(e) => setIncludeDoorstepDelivery(e.target.checked)}
                      className="w-4 h-4 rounded border-dark-700 bg-dark-900 text-gold-500 focus:ring-gold-500 accent-gold-500"
                    />
                    <span className="text-xs text-dark-200">
                      Include Valet Detailing & Doorstep Flatbed Delivery across Accra/Kumasi
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Jackdan Guarantee Badge */}
            <div className="p-4 rounded-xl bg-gold-500/5 border border-gold-500/20 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-dark-300 leading-relaxed">
                <strong className="text-gold-300">Jackdan Clearing Guarantee:</strong> We handle all physical ICUMS customs declaration, compliance inspections, EPA fees, and delivery permits with zero hidden demurrage charges.
              </div>
            </div>
          </div>

          {/* Results Summary Column (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-2xl bg-gradient-to-b from-dark-800 to-dark-900 border border-gold-500/30 p-6 sm:p-8 shadow-2xl shadow-gold-500/5 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-dark-700">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">Total Landed Estimate</span>
                  <h3 className="font-heading text-2xl font-bold text-white">Quotation Breakdown</h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-dark-900 border border-dark-700 text-xs text-dark-300">
                  {ORIGIN_HUBS[originKey]?.transitDays}
                </div>
              </div>

              {/* Price Line Items */}
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center text-dark-300">
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-dark-400" />
                    Vehicle FOB Cost:
                  </span>
                  <span className="font-mono text-white font-medium">
                    {formatAmount(calculation.fobValue)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-dark-300">
                  <span className="flex items-center gap-2">
                    <Ship className="w-4 h-4 text-blue-400" />
                    Ocean Freight & Marine Insurance:
                  </span>
                  <span className="font-mono text-white font-medium">
                    {formatAmount(calculation.freightAndInsurance)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-dark-300">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    Estimated Ghana Customs Duties (ICUMS):
                  </span>
                  <span className="font-mono text-white font-medium">
                    {formatAmount(calculation.customsDuties)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-dark-300">
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-teal-400" />
                    Port Terminal & GPHA Handling:
                  </span>
                  <span className="font-mono text-white font-medium">
                    {formatAmount(calculation.portHandling)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-dark-300">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    Jackdan Concierge & Delivery:
                  </span>
                  <span className="font-mono text-white font-medium">
                    {formatAmount(calculation.jackdanService)}
                  </span>
                </div>

                {/* Subtotal Import Charges */}
                <div className="pt-3 border-t border-dark-700/60 flex justify-between items-center">
                  <span className="text-xs uppercase tracking-wider text-dark-400 font-semibold">
                    Total Estimated Clearance & Shipping:
                  </span>
                  <span className="font-mono font-bold text-gold-400">
                    {formatAmount(calculation.totalImportFees)}
                  </span>
                </div>
              </div>

              {/* Grand Total Landed Highlight */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-gold-500/15 via-gold-500/10 to-transparent border border-gold-500/40">
                <div className="text-xs font-semibold uppercase tracking-wider text-dark-300 mb-1">
                  Estimated Total Landed Investment
                </div>
                <div className="font-heading text-3xl sm:text-4xl font-extrabold gold-gradient-text">
                  {formatAmount(calculation.grandTotal)}
                </div>
                <div className="text-[11px] text-dark-400 mt-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-gold-400" />
                  <span>Subject to official customs exchange rate & physical container inspection.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full gold-gradient-btn py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 text-center text-sm shadow-xl"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Lock In Quote via WhatsApp</span>
                </a>

                <a
                  href="#contact"
                  className="w-full py-3 px-6 rounded-xl border border-dark-600 hover:border-gold-500/50 bg-dark-900/60 text-dark-200 hover:text-white font-semibold flex items-center justify-center gap-2 text-center text-sm transition-all"
                >
                  <span>Request Custom Vehicle Sourcing</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
