import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Ship, Wrench, Sparkles, Search, CheckCircle2, Award, Globe, PhoneCall } from 'lucide-react';
import { CONTACT_INFO } from '../data/inventory';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  onSearch: (query: string) => void;
  onTrackSample: (trackingId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onSearch, onTrackSample }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [quickTab, setQuickTab] = useState<'buy' | 'track' | 'parts'>('buy');
  const [quickTrackingInput, setQuickTrackingInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTab === 'buy') {
      if (searchQuery.trim()) {
        onSearch(searchQuery.trim());
        onNavigate('inventory');
      } else {
        onNavigate('inventory');
      }
    } else if (quickTab === 'track') {
      if (quickTrackingInput.trim()) {
        onTrackSample(quickTrackingInput.trim());
        onNavigate('tracker');
      } else {
        onNavigate('tracker');
      }
    } else {
      onNavigate('parts');
    }
  };

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center justify-center overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] radial-gold-glow pointer-events-none opacity-60 blur-3xl" />
      <div className="absolute -top-20 -left-20 w-[450px] h-[450px] radial-blue-glow pointer-events-none opacity-40 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] radial-gold-glow pointer-events-none opacity-30 blur-3xl" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>GLOBAL AUTO SOURCING • USA • DUBAI • EUROPE • ASIA</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white uppercase font-heading leading-tight sm:leading-none">
            YOUR TRUSTED <span className="gold-gradient-text block mt-1 sm:mt-2">AUTO IMPORT & EXPORT</span> PARTNER
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Top quality <strong className="text-white font-semibold">premium luxury cars</strong> and <strong className="text-amber-400 font-semibold">100% genuine spare parts</strong> sourced directly from verified international auctions & manufacturers.
          </p>

          {/* Key Value Pill Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mt-6 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> Wholesale & Retail
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
              <Ship className="w-4 h-4 text-amber-400" /> Container & RoRo Shipping
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> Duty Clearing & Delivery
            </span>
          </div>

          {/* Interactive Fast-Action Search & Discovery Card */}
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-2 sm:p-3 shadow-2xl backdrop-blur-xl">
              
              {/* Tab Selector */}
              <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl mb-3 border border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setQuickTab('buy')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    quickTab === 'buy' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Find a Car</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuickTab('track')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    quickTab === 'track' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Ship className="w-3.5 h-3.5" />
                  <span>Track Container / VIN</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuickTab('parts')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    quickTab === 'parts' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Spare Parts</span>
                </button>
              </div>

              {/* Form Bar */}
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
                {quickTab === 'buy' && (
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search make or model (e.g. Toyota Land Cruiser, Mercedes GLE, Camry...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                )}

                {quickTab === 'track' && (
                  <div className="relative flex-1">
                    <Ship className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                    <input
                      type="text"
                      placeholder="Enter Tracking ID or VIN (e.g. JKD-7829-GH)"
                      value={quickTrackingInput}
                      onChange={(e) => setQuickTrackingInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors uppercase font-mono"
                    />
                  </div>
                )}

                {quickTab === 'parts' && (
                  <div className="relative flex-1 flex items-center px-4 py-3 bg-slate-950/90 border border-slate-700/80 rounded-xl text-sm text-slate-300">
                    <Wrench className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
                    <span>Explore 1,000+ OEM brake kits, suspension, alternators & engine parts</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="gold-gradient-btn px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>{quickTab === 'buy' ? 'Search Inventory' : quickTab === 'track' ? 'Track Live' : 'Browse Catalog'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Sample Quick Links */}
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Popular:</span>
                  <button type="button" onClick={() => { onSearch('Toyota'); onNavigate('inventory'); }} className="hover:text-amber-400 underline decoration-slate-700">Toyota</button>
                  <button type="button" onClick={() => { onSearch('Mercedes'); onNavigate('inventory'); }} className="hover:text-amber-400 underline decoration-slate-700">Mercedes-Benz</button>
                  <button type="button" onClick={() => { onSearch('Lexus'); onNavigate('inventory'); }} className="hover:text-amber-400 underline decoration-slate-700">Lexus</button>
                  <button type="button" onClick={() => { onSearch('Honda'); onNavigate('inventory'); }} className="hover:text-amber-400 underline decoration-slate-700">Honda</button>
                </div>
                <div>
                  <button 
                    type="button" 
                    onClick={() => { onTrackSample('JKD-7829-GH'); onNavigate('tracker'); }}
                    className="text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    Demo Tracking ID: JKD-7829-GH →
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              onClick={() => onNavigate('calculator')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/50 text-sm font-bold text-white transition-all shadow-lg flex items-center gap-2"
            >
              <span>Calculate Import Duty & Freight</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
            <a
              href={`tel:${CONTACT_INFO.primaryPhoneFormatted}`}
              className="px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 text-sm font-bold text-amber-300 transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Talk to an Auto Agent</span>
            </a>
          </div>

        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 lg:mt-20">
          <div className="gold-border-card p-5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3">
              <Globe className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-base font-bold text-white font-heading">Global Sourcing Hub</h2>
            <p className="text-xs text-slate-400 mt-1">Direct access to dealer auctions in USA, Canada, Germany, UAE, and Japan.</p>
          </div>

          <div className="gold-border-card p-5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-base font-bold text-white font-heading">Verified Clean Titles</h2>
            <p className="text-xs text-slate-400 mt-1">Full CarFax/inspection verification, authentic mileage & condition guarantees.</p>
          </div>

          <div className="gold-border-card p-5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3">
              <Wrench className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-base font-bold text-white font-heading">100% Genuine Parts</h2>
            <p className="text-xs text-slate-400 mt-1">OEM braking, engine kits, alternators and components with warranty.</p>
          </div>

          <div className="gold-border-card p-5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-base font-bold text-white font-heading">Complete Customs Clearing</h2>
            <p className="text-xs text-slate-400 mt-1">End-to-end paperwork, duty assessment, and safe transit delivery.</p>
          </div>
        </div>

      </div>
    </section>
  );
};
