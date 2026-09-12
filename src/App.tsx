import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { InformationalHome } from './components/InformationalHome';
import { VehicleInventory } from './components/VehicleInventory';
import { SparePartsCatalog } from './components/SparePartsCatalog';
import { ImportCalculator } from './components/ImportCalculator';
import { ShipmentTracker } from './components/ShipmentTracker';
import { SisterVentures } from './components/SisterVentures';
import { TwumaascoLogistics } from './components/TwumaascoLogistics';
import { JackdanTravelTour } from './components/JackdanTravelTour';
import { ContactSection } from './components/ContactSection';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';
import { CONTACT_INFO } from './data/inventory';
import { MessageSquare, ArrowLeft, Car, Wrench, Calculator, Compass, Search, Phone, Ship, Plane, Building2 } from 'lucide-react';

const getInitialPageFromUrl = (): string => {
  try {
    const path = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
    const hash = window.location.hash.toLowerCase().replace(/^#+/, '');
    const target = path || hash;

    if (target === 'admin' || target.startsWith('admin')) return 'admin';
    if (target === 'inventory' || target === 'vehicles') return 'inventory';
    if (target === 'parts' || target === 'spare-parts') return 'parts';
    if (target === 'calculator' || target === 'duty') return 'calculator';
    if (target === 'tracker' || target === 'track') return 'tracker';
    if (target === 'ventures' || target === 'sister-ventures') return 'ventures';
    if (target === 'twumaasco-logistics' || target === 'logistics') return 'twumaasco-logistics';
    if (target === 'travel-tour' || target === 'travel') return 'travel-tour';
    if (target === 'contact') return 'contact';
  } catch (err) {
    console.error('URL parsing error:', err);
  }
  return 'home';
};

export function App() {
  const [currentCurrency, setCurrentCurrency] = useState<string>('USD');
  const [currentPage, setCurrentPage] = useState<string>(getInitialPageFromUrl);
  const [trackerId, setTrackerId] = useState<string>('JKD-7829-GH');

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPageFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to top whenever user changes page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleNavigate = (pageId: string) => {
    let resolved = pageId;
    if (pageId === 'hero' || pageId === 'home' || pageId === 'about') {
      resolved = 'home';
    } else if (pageId === 'sister-ventures' || pageId === 'ventures') {
      resolved = 'ventures';
    }

    setCurrentPage(resolved);

    // Synchronize browser history and URL without reloading
    try {
      const urlPath = resolved === 'home' ? '/' : `/${resolved}`;
      if (window.location.pathname !== urlPath) {
        window.history.pushState({ page: resolved }, '', urlPath);
      }
    } catch (err) {
      // Fallback to hash if HTML5 history is restricted
      window.location.hash = resolved === 'home' ? '' : resolved;
    }
  };

  const getPageBanner = () => {
    switch (currentPage) {
      case 'inventory':
        return {
          title: 'Available Vehicle Inventory',
          subtitle: 'Certified luxury SUVs, sedans, and commercial trucks ready for shipment or inspection in Ghana.',
          icon: Car,
        };
      case 'parts':
        return {
          title: 'Genuine OEM Spare Parts Catalog',
          subtitle: 'Wholesale and retail certified automotive spare parts with factory warranty and fast delivery across Ghana.',
          icon: Wrench,
        };
      case 'calculator':
        return {
          title: 'Ghana Auto Import & Duty Estimator',
          subtitle: 'Calculate estimated ocean freight, terminal handling, and ICUMS customs duties from global ports to Tema.',
          icon: Calculator,
        };
      case 'tracker':
        return {
          title: 'Live Vessel & Container Tracker',
          subtitle: 'Monitor your vehicle or cargo container through all 5 international shipping and customs clearing milestones.',
          icon: Search,
        };
      case 'ventures':
        return {
          title: 'Jackdan Sister Ventures Ecosystem',
          subtitle: 'Commercial freight forwarding with Twumaasco Logistics & Trading, and global travel advisory with Jackdan Travel & Tour.',
          icon: Building2,
        };
      case 'twumaasco-logistics':
        return {
          title: 'Twumaasco Logistics & Trading',
          subtitle: '"Your Trusted Logistics Partner" — Sea Freight, Air Cargo, Bonded Storage & West Africa Road Haulage.',
          icon: Ship,
        };
      case 'travel-tour':
        return {
          title: 'Jackdan Travel & Tour',
          subtitle: '"Your Journey, Our Priority" — Visa Advisory, Global Flights, Hotels & Curated Safari Tours.',
          icon: Plane,
        };
      case 'contact':
        return {
          title: 'Contact Jackdan Premium Ventures',
          subtitle: 'Speak directly with our automotive import brokers, parts procurement desk, or customs clearing team.',
          icon: Phone,
        };
      default:
        return null;
    }
  };

  const banner = getPageBanner();

  if (currentPage === 'admin') {
    return <AdminPortal onReturnHome={() => handleNavigate('home')} />;
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white font-sans selection:bg-gold-500 selection:text-dark-950 relative flex flex-col justify-between overflow-x-hidden">
      {/* Global Ambient Background Glows that bring visuals to life on every page */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-48 w-[650px] h-[650px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-10 -left-48 w-[600px] h-[600px] bg-emerald-600/8 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Navigation Header */}
      <Navbar
        currentCurrency={currentCurrency}
        onCurrencyChange={setCurrentCurrency}
        activeSection={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        {currentPage === 'home' ? (
          /* Informational Front Website */
          <InformationalHome
            onNavigatePage={handleNavigate}
            currentCurrency={currentCurrency}
          />
        ) : (
          /* Sub-Page Layout with Breadcrumbs */
          <div className="pt-28 pb-20 relative">
            {/* Top Breadcrumb & Page Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
              <div className="p-6 sm:p-8 rounded-3xl bg-dark-900/90 border border-gold-500/30 shadow-2xl shadow-black/60 relative overflow-hidden backdrop-blur-xl">
                {/* Banner Internal Ambient Highlights */}
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => handleNavigate('home')}
                      className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-white mb-2 transition-colors font-semibold"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Home Overview</span>
                    </button>
                    <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
                      {banner?.icon && <banner.icon className="w-7 h-7 text-gold-400" />}
                      <span>{banner?.title}</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-dark-300 max-w-2xl">
                      {banner?.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleNavigate('home')}
                      className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-700 text-xs font-semibold text-white transition-colors"
                    >
                      Return Home
                    </button>
                    <a
                      href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(`Hello Jackdan, I am inquiring from the ${banner?.title} page.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ask an Officer</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Dedicated Page View */}
            {currentPage === 'inventory' && (
              <VehicleInventory
                currentCurrency={currentCurrency}
              />
            )}

            {currentPage === 'parts' && (
              <SparePartsCatalog
                currentCurrency={currentCurrency}
              />
            )}

            {currentPage === 'calculator' && (
              <ImportCalculator
                currentCurrency={currentCurrency}
              />
            )}

            {currentPage === 'tracker' && (
              <ShipmentTracker
                key={trackerId}
                initialTrackingId={trackerId}
              />
            )}

            {currentPage === 'ventures' && (
              <SisterVentures onNavigate={handleNavigate} />
            )}

            {currentPage === 'twumaasco-logistics' && (
              <TwumaascoLogistics />
            )}

            {currentPage === 'travel-tour' && (
              <JackdanTravelTour />
            )}

            {currentPage === 'contact' && (
              <ContactSection />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Instant WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        <a
          href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs sm:text-sm shadow-2xl shadow-green-500/30 transition-all transform hover:scale-105"
          title="Chat with Jackdan Team on WhatsApp"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline font-bold">Chat with Jackdan</span>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
        </a>
      </div>
    </div>
  );
}

export default App;
