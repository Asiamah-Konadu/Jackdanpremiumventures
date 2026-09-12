import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  Menu, 
  X, 
  Globe, 
  Car, 
  Wrench, 
  Calculator, 
  Search, 
  Compass, 
  ChevronDown,
  Home,
  MessageSquare,
  ShieldCheck,
  Building2,
  Ship,
  Plane,
  Sparkles,
  Lock
} from 'lucide-react';

import { CONTACT_INFO, EXCHANGE_RATES } from '../data/inventory';

interface NavbarProps {
  currentCurrency: string;
  onCurrencyChange: (curr: string) => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCurrency,
  onCurrencyChange,
  activeSection,
  onNavigate
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
        setCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  };

  const isServicesActive = ['calculator', 'tracker', 'ventures', 'sister-ventures', 'twumaasco-logistics', 'travel-tour'].includes(activeSection);

  const whatsappUrl = `https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-dark-950/95 backdrop-blur-md shadow-2xl border-b border-gold-500/20 py-2.5' 
        : 'bg-gradient-to-b from-dark-950/95 via-dark-950/80 to-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo - Featuring the Official New Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            {/* The Official Jackdan Logo Mark */}
            <div className="relative h-11 sm:h-12 w-11 sm:w-12 rounded-xl bg-gradient-to-br from-gold-500/20 via-dark-850 to-gold-600/10 border border-gold-500/40 group-hover:border-gold-400 p-1 flex items-center justify-center transition-all shadow-lg shadow-gold-500/10 overflow-hidden">
              <img 
                src="/assets/logo.svg" 
                alt="Jackdan Premium Ventures Official Logo" 
                className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Fallback to high-res PNG
                  const target = e.target as HTMLImageElement;
                  if (target.src.indexOf('jackdan-logo.png') === -1) {
                    target.src = '/assets/jackdan-logo.png';
                  }
                }}
              />
            </div>

            {/* Brand Typography */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-wider text-white font-heading">
                  JACK<span className="gold-gradient-text font-black">DAN</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-gold-500/15 text-gold-300 border border-gold-500/30 hidden xs:inline-block">
                  PREMIUM
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-dark-400 font-medium">
                Auto Import & Export
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links - Restructured & Uncluttered (5 clean items) */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-dark-900/80 px-2 py-1.5 rounded-full border border-dark-700/80 backdrop-blur-md shadow-inner">
            {/* 1. Home */}
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeSection === 'home'
                  ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950 font-bold shadow-md shadow-gold-500/20'
                  : 'text-dark-200 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Home className={`w-3.5 h-3.5 ${activeSection === 'home' ? 'text-dark-950' : 'text-gold-400'}`} />
              <span>Home</span>
            </button>

            {/* 2. Vehicles Showroom */}
            <button
              type="button"
              onClick={() => handleNavClick('inventory')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeSection === 'inventory'
                  ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950 font-bold shadow-md shadow-gold-500/20'
                  : 'text-dark-200 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Car className={`w-3.5 h-3.5 ${activeSection === 'inventory' ? 'text-dark-950' : 'text-gold-400'}`} />
              <span>Vehicles</span>
            </button>

            {/* 3. Spare Parts */}
            <button
              type="button"
              onClick={() => handleNavClick('parts')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeSection === 'parts'
                  ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950 font-bold shadow-md shadow-gold-500/20'
                  : 'text-dark-200 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Wrench className={`w-3.5 h-3.5 ${activeSection === 'parts' ? 'text-dark-950' : 'text-gold-400'}`} />
              <span>Spare Parts</span>
            </button>

            {/* 4. Services & Tools Dropdown (Combines Duty Estimator, Tracking, Sister Ventures) */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isServicesActive
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 font-bold'
                    : 'text-dark-200 hover:text-white hover:bg-dark-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-gold-400" />
                <span>Services & Tools</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${servicesDropdownOpen ? 'rotate-180 text-gold-400' : 'text-dark-400'}`} />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-84 rounded-2xl bg-[#0a0f1d] border-2 border-gold-500/50 shadow-2xl shadow-black p-2.5 z-50 animate-fadeIn ring-1 ring-black">
                  <div className="px-3 py-2 border-b border-dark-700/80 mb-1.5 bg-[#0e1628] rounded-xl">
                    <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold block">
                      Import Tools & Operations
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleNavClick('calculator')}
                    className="w-full text-left p-2.5 rounded-xl bg-transparent hover:bg-[#131c2e] border border-transparent hover:border-gold-500/30 transition-colors flex items-start gap-3 group/item cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-300 group-hover/item:scale-110 transition-transform flex-shrink-0 mt-0.5">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white group-hover/item:text-gold-300 block">
                        Ghana Duty Estimator
                      </span>
                      <span className="text-[11px] text-dark-300 block leading-tight">
                        ICUMS tariff calculator from global ports to Tema
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavClick('tracker')}
                    className="w-full text-left p-2.5 rounded-xl bg-transparent hover:bg-[#131c2e] border border-transparent hover:border-blue-500/30 transition-colors flex items-start gap-3 group/item cursor-pointer mt-0.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 group-hover/item:scale-110 transition-transform flex-shrink-0 mt-0.5">
                      <Ship className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white group-hover/item:text-blue-300 block">
                        Live Cargo Tracker
                      </span>
                      <span className="text-[11px] text-dark-300 block leading-tight">
                        Monitor vessel milestones & customs release
                      </span>
                    </div>
                  </button>

                  <div className="px-3 py-2 border-t border-b border-dark-700/80 my-2 bg-[#0e1628] rounded-xl">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">
                      Sister Ventures — Dedicated Portals
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleNavClick('ventures')}
                    className="w-full text-left p-2.5 rounded-xl bg-transparent hover:bg-[#131c2e] border border-transparent hover:border-gold-500/30 transition-colors flex items-start gap-3 group/item cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-300 group-hover/item:scale-110 transition-transform flex-shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white group-hover/item:text-gold-300 block">
                        Sister Ventures Overview
                      </span>
                      <span className="text-[11px] text-dark-300 block leading-tight">
                        Full Jackdan Group Ecosystem
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavClick('twumaasco-logistics')}
                    className="w-full text-left p-2.5 rounded-xl bg-transparent hover:bg-[#131c2e] border border-transparent hover:border-blue-500/30 transition-colors flex items-start gap-3 group/item cursor-pointer mt-0.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 group-hover/item:scale-110 transition-transform flex-shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white group-hover/item:text-blue-300 block">
                        Twumaasco Logistics & Trading
                      </span>
                      <span className="text-[11px] text-dark-300 block leading-tight">
                        Sea / Air Freight, Haulage & Customs Clearance
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavClick('travel-tour')}
                    className="w-full text-left p-2.5 rounded-xl bg-transparent hover:bg-[#131c2e] border border-transparent hover:border-emerald-500/30 transition-colors flex items-start gap-3 group/item cursor-pointer mt-0.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 group-hover/item:scale-110 transition-transform flex-shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white group-hover/item:text-emerald-300 block">
                        Jackdan Travel & Tour
                      </span>
                      <span className="text-[11px] text-dark-300 block leading-tight">
                        Visa Advisory, Flights, Hotels & Safari Tours
                      </span>
                    </div>
                  </button>

                  <div className="my-1.5 border-t border-dark-800/80" />

                  <button
                    type="button"
                    onClick={() => handleNavClick('admin')}
                    className="w-full text-left p-2.5 rounded-xl bg-transparent hover:bg-gold-500/10 border border-transparent hover:border-gold-500/30 transition-colors flex items-start gap-3 group/item cursor-pointer mt-0.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-400 group-hover/item:scale-110 transition-transform flex-shrink-0 mt-0.5">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white group-hover/item:text-gold-300 flex items-center gap-1.5">
                        <span>Admin Management</span>
                        <span className="px-1.5 py-0.2 bg-gold-500/20 text-gold-400 text-[9px] rounded font-mono">STAFF</span>
                      </span>
                      <span className="text-[11px] text-dark-300 block leading-tight">
                        Live Tracking, Vehicles, Parts & Rates Control
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 5. Contact */}
            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeSection === 'contact'
                  ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950 font-bold shadow-md shadow-gold-500/20'
                  : 'text-dark-200 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Phone className={`w-3.5 h-3.5 ${activeSection === 'contact' ? 'text-dark-950' : 'text-gold-400'}`} />
              <span>Contact</span>
            </button>
          </nav>

          {/* Right Action Bar - Clean & Elegant */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Currency Selector Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dark-900 hover:bg-dark-800 border border-dark-700 text-xs font-semibold text-dark-200 hover:text-white transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-gold-400" />
                <span className="font-mono">{currentCurrency}</span>
                <ChevronDown className="w-3 h-3 text-dark-400" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-dark-900 border border-gold-500/30 shadow-2xl py-1 z-50">
                  {Object.entries(EXCHANGE_RATES).map(([code, info]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        onCurrencyChange(code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-gold-500/15 transition-colors ${
                        currentCurrency === code ? 'text-gold-400 font-bold bg-gold-500/10' : 'text-dark-200'
                      }`}
                    >
                      <span>{info.label}</span>
                      <span className="font-mono text-[11px] text-dark-400">{info.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Call Button (Icon with hover text) */}
            <a
              href={`tel:${CONTACT_INFO.primaryPhoneFormatted}`}
              className="p-2.5 rounded-xl bg-dark-900 hover:bg-dark-800 border border-dark-700 text-gold-400 hover:text-white transition-colors"
              title={`Call Hotline: ${CONTACT_INFO.phones[0]}`}
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* Prominent WhatsApp Inquire Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-gold-500/10"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Desk</span>
            </a>
          </div>

          {/* Mobile Menu & Currency Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Quick Currency Cycle for Mobile */}
            <button
              type="button"
              onClick={() => {
                const codes = Object.keys(EXCHANGE_RATES);
                const nextIndex = (codes.indexOf(currentCurrency) + 1) % codes.length;
                onCurrencyChange(codes[nextIndex]);
              }}
              className="px-2.5 py-2 rounded-xl bg-dark-900 border border-dark-700 text-xs font-bold text-gold-400"
              title="Switch currency"
            >
              <span>{currentCurrency}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-dark-900 border border-dark-700 text-dark-200 hover:text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-dark-950/98 border-b border-gold-500/20 px-4 pt-4 pb-6 space-y-3 mt-2 backdrop-blur-2xl animate-fadeIn shadow-2xl">
          <nav className="grid grid-cols-1 gap-1">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeSection === 'home'
                  ? 'bg-gold-500/15 border border-gold-500/40 text-gold-300 font-bold'
                  : 'text-dark-200 hover:bg-dark-900 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4 text-gold-400" />
              <span>Home Overview</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('inventory')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeSection === 'inventory'
                  ? 'bg-gold-500/15 border border-gold-500/40 text-gold-300 font-bold'
                  : 'text-dark-200 hover:bg-dark-900 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4 text-gold-400" />
              <span>Vehicles Showroom</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('parts')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeSection === 'parts'
                  ? 'bg-gold-500/15 border border-gold-500/40 text-gold-300 font-bold'
                  : 'text-dark-200 hover:bg-dark-900 hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4 text-gold-400" />
              <span>Genuine Spare Parts</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('calculator')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeSection === 'calculator'
                  ? 'bg-gold-500/15 border border-gold-500/40 text-gold-300 font-bold'
                  : 'text-dark-200 hover:bg-dark-900 hover:text-white'
              }`}
            >
              <Calculator className="w-4 h-4 text-gold-400" />
              <span>Ghana Duty Estimator</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('tracker')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeSection === 'tracker'
                  ? 'bg-gold-500/15 border border-gold-500/40 text-gold-300 font-bold'
                  : 'text-dark-200 hover:bg-dark-900 hover:text-white'
              }`}
            >
              <Ship className="w-4 h-4 text-gold-400" />
              <span>Live Cargo Tracker</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('ventures')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeSection === 'ventures'
                  ? 'bg-gold-500/15 border border-gold-500/40 text-gold-300 font-bold'
                  : 'text-dark-200 hover:bg-dark-900 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 text-gold-400" />
              <span>Sister Ventures Overview</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('twumaasco-logistics')}
              className={`flex items-center gap-3 px-4 py-3 ml-4 rounded-xl text-sm font-semibold transition-all ${
                activeSection === 'twumaasco-logistics'
                  ? 'bg-blue-500/15 border border-blue-500/40 text-blue-300 font-bold'
                  : 'text-dark-300 hover:bg-dark-900 hover:text-white'
              }`}
            >
              <Ship className="w-4 h-4 text-blue-400" />
              <span>Twumaasco Logistics</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('travel-tour')}
              className={`flex items-center gap-3 px-4 py-3 ml-4 rounded-xl text-sm font-semibold transition-all ${
                activeSection === 'travel-tour'
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold'
                  : 'text-dark-300 hover:bg-dark-900 hover:text-white'
              }`}
            >
              <Plane className="w-4 h-4 text-emerald-400" />
              <span>Jackdan Travel & Tour</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeSection === 'contact'
                  ? 'bg-gold-500/15 border border-gold-500/40 text-gold-300 font-bold'
                  : 'text-dark-200 hover:bg-dark-900 hover:text-white'
              }`}
            >
              <Phone className="w-4 h-4 text-gold-400" />
              <span>Contact Us</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeSection === 'admin'
                  ? 'bg-gold-500/20 border border-gold-500/50 text-gold-300 font-bold'
                  : 'text-dark-400 hover:bg-dark-900 hover:text-gold-400'
              }`}
            >
              <Lock className="w-4 h-4 text-gold-400" />
              <div className="flex items-center justify-between w-full">
                <span>Admin Management</span>
                <span className="px-1.5 py-0.5 rounded bg-dark-800 text-[10px] text-gold-400 border border-dark-700 font-mono">STAFF</span>
              </div>
            </button>
          </nav>

          <div className="pt-3 border-t border-dark-800 flex flex-col gap-2">
            <a
              href={`tel:${CONTACT_INFO.primaryPhoneFormatted}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-dark-900 border border-dark-700 text-white text-xs font-semibold"
            >
              <Phone className="w-4 h-4 text-gold-400" />
              <span>Call: {CONTACT_INFO.phones[0]}</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-gradient-btn flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat with Jackdan on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
