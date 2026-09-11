import React from 'react';
import { 
  Car, 
  Wrench, 
  Calculator, 
  Compass, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowUp, 
  MessageSquare,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { CONTACT_INFO } from '../data/inventory';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-dark-950 border-t border-dark-800 text-dark-300 relative overflow-hidden">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-dark-800">
          {/* Brand Col (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 via-gold-600 to-amber-700 flex items-center justify-center text-dark-950 font-black text-xl shadow-lg shadow-gold-500/20">
                J
              </div>
              <div>
                <span className="font-heading text-lg font-black tracking-wider text-white block">
                  JACKDAN
                </span>
                <span className="text-[10px] tracking-widest text-gold-400 uppercase block font-semibold">
                  PREMIUM VENTURES
                </span>
              </div>
            </div>

            <p className="text-sm text-dark-300 leading-relaxed max-w-sm">
              Your trusted partner in international auto import and export, genuine OEM vehicle spare parts, and seamless Port of Tema customs clearance across Ghana.
            </p>

            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider text-gold-400 font-semibold block mb-2">
                "YOUR TRUSTED AUTO IMPORT AND EXPORT PARTNER"
              </span>
              <div className="flex items-center gap-2 text-xs text-dark-400">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>Licensed Ghana Customs Brokerage Partner</span>
              </div>
            </div>
          </div>

          {/* Nav Links: Automotive & Parts (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider text-gold-400">
              Auto & Inventory
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('inventory')}
                  className="hover:text-gold-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-dark-500" />
                  <span>Available Vehicles</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('parts')}
                  className="hover:text-gold-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-dark-500" />
                  <span>Genuine Spare Parts</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('calculator')}
                  className="hover:text-gold-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-dark-500" />
                  <span>Import & Duty Estimator</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('tracking')}
                  className="hover:text-gold-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-dark-500" />
                  <span>Live Container Tracker</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Group Ventures (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider text-gold-400">
              Group Ventures
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('ventures')}
                  className="hover:text-gold-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-dark-500" />
                  <span>Group Ecosystem</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('twumaasco-logistics')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-dark-500" />
                  <span>Twumaasco Logistics</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('travel-tour')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-dark-500" />
                  <span>Jackdan Travel & Tour</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-gold-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-dark-500" />
                  <span>Corporate Inquiries</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Contacts (3 Cols) */}
          <div className="lg:col-span-3 space-y-3.5 text-sm">
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider text-gold-400">
              Contact & Location
            </h4>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <strong className="text-white block">{CONTACT_INFO.companyName}</strong>
                <span>{CONTACT_INFO.poBox}</span>
                <br />
                <span>{CONTACT_INFO.landmark}</span>
                <br />
                <span>{CONTACT_INFO.area}, {CONTACT_INFO.city}, {CONTACT_INFO.country}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <a href={`tel:${CONTACT_INFO.primaryPhoneFormatted}`} className="hover:text-white transition-colors">
                {CONTACT_INFO.phones[0]}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <a href={`tel:${CONTACT_INFO.secondaryPhoneFormatted}`} className="hover:text-white transition-colors">
                {CONTACT_INFO.phones[1]}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors break-all">
                {CONTACT_INFO.email}
              </a>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${CONTACT_INFO.primaryPhoneFormatted.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:text-white hover:bg-green-500 text-xs font-semibold transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat Live on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-dark-500">
          <div>
            © {new Date().getFullYear()} Jackdan Premium Ventures. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Tema Port MPS Terminal 3 Brokerage</span>
            <span>ICUMS Customs Compliant</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-dark-300 hover:text-white transition-colors flex items-center gap-1"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="hidden sm:inline">Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
