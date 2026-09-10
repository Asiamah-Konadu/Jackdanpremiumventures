import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Menu, X, Shield, Globe, Car, Wrench, Calculator, Search, Compass, ChevronDown } from 'lucide-react';
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
  const [currencyDropdown, setCurrencyDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Vehicles', id: 'inventory', icon: Car },
    { name: 'Spare Parts', id: 'parts', icon: Wrench },
    { name: 'Cost Calculator', id: 'calculator', icon: Calculator },
    { name: 'Track Cargo', id: 'tracker', icon: Search },
    { name: 'Logistics & Travel', id: 'sister-ventures', icon: Compass },
    { name: 'About', id: 'about', icon: Shield },
    { name: 'Contact', id: 'contact', icon: Phone },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const whatsappUrl = `https://wa.me/${CONTACT_INFO.primaryPhoneFormatted}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#080c14]/95 backdrop-blur-md shadow-2xl border-b border-amber-500/20 py-2.5' : 'bg-gradient-to-b from-[#080c14]/90 via-[#080c14]/60 to-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 via-slate-800 to-amber-600/10 border border-amber-500/40 group-hover:border-amber-400 transition-all shadow-lg shadow-amber-500/10">
              <img 
                src="/assets/logo.svg" 
                alt="Jackdan Premium Ventures Logo" 
                className="w-9 h-9 object-contain drop-shadow"
                onError={(e) => {
                  // fallback to title
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold tracking-wider text-white font-heading">
                  JACK<span className="gold-gradient-text font-black">DAN</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hidden sm:inline-block">
                  PREMIUM
                </span>
              </div>
              <span className="text-[9px] sm:text-[10.5px] uppercase tracking-[0.2em] text-slate-400 font-medium">
                Auto Import & Export
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-sm">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA & Currency Selector */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdown(!currencyDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentCurrency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {currencyDropdown && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-slate-900 border border-amber-500/30 shadow-2xl py-1 z-50">
                  {Object.entries(EXCHANGE_RATES).map(([code, info]) => (
                    <button
                      key={code}
                      onClick={() => {
                        onCurrencyChange(code);
                        setCurrencyDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-amber-500/20 transition-colors ${
                        currentCurrency === code ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-slate-300'
                      }`}
                    >
                      <span>{info.label}</span>
                      <span className="font-mono text-[11px] text-slate-400">{info.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Call */}
            <a
              href={`tel:${CONTACT_INFO.primaryPhoneFormatted}`}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all hover:border-slate-500"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xl:inline">{CONTACT_INFO.phones[0]}</span>
              <span className="xl:hidden">Call</span>
            </a>

            {/* WhatsApp Quick Chat */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-gradient-btn flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>WhatsApp Us</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Currency for mobile */}
            <button
              onClick={() => {
                const codes = Object.keys(EXCHANGE_RATES);
                const nextIdx = (codes.indexOf(currentCurrency) + 1) % codes.length;
                onCurrencyChange(codes[nextIdx]);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-amber-400"
            >
              {currentCurrency}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white border border-slate-700"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0e1a] border-b border-amber-500/20 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 py-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900/80 text-slate-300 border border-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span>{link.name}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <a
              href={`tel:${CONTACT_INFO.primaryPhoneFormatted}`}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call: {CONTACT_INFO.phones[0]}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-gradient-btn flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>Chat with Auto Specialist</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
