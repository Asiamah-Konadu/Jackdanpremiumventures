import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VehicleInventory } from './components/VehicleInventory';
import { SparePartsCatalog } from './components/SparePartsCatalog';
import { ImportCalculator } from './components/ImportCalculator';
import { ShipmentTracker } from './components/ShipmentTracker';
import { SisterVentures } from './components/SisterVentures';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CONTACT_INFO } from './data/inventory';
import { MessageSquare, PhoneCall } from 'lucide-react';

export function App() {
  const [currentCurrency, setCurrentCurrency] = useState<string>('USD');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [inventorySearch, setInventorySearch] = useState<string>('');
  const [trackerId, setTrackerId] = useState<string>('JKD-7829-GH');

  // Scroll spy to highlight active section in Navbar
  useEffect(() => {
    const sectionIds = ['inventory', 'parts', 'calculator', 'tracker', 'sister-ventures', 'contact'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            return;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero' || sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleHeroSearch = (query: string) => {
    setInventorySearch(query);
    handleNavigate('inventory');
  };

  const handleHeroTrack = (id: string) => {
    setTrackerId(id);
    handleNavigate('tracker');
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white font-sans selection:bg-gold-500 selection:text-dark-950 relative">
      {/* Navigation */}
      <Navbar
        currentCurrency={currentCurrency}
        onCurrencyChange={setCurrentCurrency}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero Section */}
        <Hero
          onNavigate={handleNavigate}
          onSearch={handleHeroSearch}
          onTrackSample={handleHeroTrack}
        />

        {/* 2. Vehicle Inventory */}
        <VehicleInventory
          currentCurrency={currentCurrency}
          initialSearch={inventorySearch}
        />

        {/* 3. Genuine Spare Parts Catalog */}
        <SparePartsCatalog
          currentCurrency={currentCurrency}
        />

        {/* 4. Import & Customs Duty Calculator */}
        <ImportCalculator
          currentCurrency={currentCurrency}
        />

        {/* 5. Live Shipment & Container Tracker */}
        <ShipmentTracker
          key={trackerId}
          initialTrackingId={trackerId}
        />

        {/* 6. Sister Ventures (Twumaasco Logistics & Jackdan Travel) */}
        <SisterVentures />

        {/* 7. Contact & Direct Concierge */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Instant WhatsApp & Call Button */}
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
