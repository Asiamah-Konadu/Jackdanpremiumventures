import React, { useEffect, useRef, useState } from 'react';
import '../styles/homepage.css';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Building2, Calculator, Car, Check,
  CheckCircle2, Clock3, Copy, Download, ExternalLink, Fuel, Gauge, Globe2,
  MapPin, MessageSquare, PackageCheck, Plane, ShieldCheck, Ship, Sparkles,
  Truck, Wrench, X,
} from 'lucide-react';
import { CONTACT_INFO, EXCHANGE_RATES, SPARE_PARTS, VEHICLES } from '../data/inventory';
import { HomepageFrameWebGL } from './HomepageFrameWebGL';
import { VideoScrollHero } from './VideoScrollHero';

interface InformationalHomeProps {
  onNavigatePage: (page: string) => void;
  currentCurrency: string;
}

const flyers = [
  {
    title: 'Jackdan Auto Import & Export Atelier',
    subtitle: 'Your trusted auto import & export partner',
    description: 'Luxury SUVs, executive sedans and genuine OEM parts sourced overseas, shipped and cleared at Tema Port.',
    image: '/assets/YOUR TRUSTED AUTO IMPORT AND EXPORT PARTNER_20260909_141036_0000.png',
    color: 'gold',
    actionPage: 'inventory',
  },
  {
    title: 'Twumaasco Logistics & Trading',
    subtitle: 'Maritime & heavy cargo partner',
    description: 'International sea freight, air cargo, bonded storage and West Africa road haulage.',
    image: '/assets/1_20260909_140844_0000.png',
    color: 'blue',
    actionPage: 'twumaasco-logistics',
  },
  {
    title: 'Jackdan Travel & Tour',
    subtitle: 'Your journey, our priority',
    description: 'Visa advisory, global flights, hotel reservations and curated group safaris.',
    image: '/assets/2_20260909_140845_0001.png',
    color: 'green',
    actionPage: 'travel-tour',
  },
];

const chapters = [
  {
    chapter: '01', time: 'Source', location: 'USA · Canada · UAE · Europe',
    title: 'A better car starts with a better paper trail.',
    description: 'Our overseas agents check title history, service records and vehicle condition before a car is approved for purchase.',
    detail: '150-point inspection · Clean title verification', icon: Car,
  },
  {
    chapter: '02', time: 'Ship', location: 'Atlantic · Mediterranean · Tema',
    title: 'A clear route from the yard to Ghana.',
    description: 'Container and RoRo options move your vehicle with shipment updates from origin through arrival at Tema Port.',
    detail: 'Maersk · MSC · Grimaldi RoRo', icon: Ship,
  },
  {
    chapter: '03', time: 'Clear', location: 'Tema Port · MPS Terminal 3',
    title: 'Customs paperwork handled before arrival.',
    description: 'Our registered brokerage team prepares the ICUMS declaration, coordinates inspection and guides duty settlement.',
    detail: 'Registered GRA ICUMS broker', icon: ShieldCheck,
  },
  {
    chapter: '04', time: 'Deliver', location: 'Accra · All 16 regions',
    title: 'Keys in hand, wherever you call home.',
    description: 'After release, we can arrange final detailing, registration support and delivery to your chosen address.',
    detail: 'Nationwide flatbed delivery available', icon: Truck,
  },
];

export const InformationalHome: React.FC<InformationalHomeProps> = ({ onNavigatePage, currentCurrency }) => {
  const homeRef = useRef<HTMLDivElement>(null);
  const [activeFlyer, setActiveFlyer] = useState<(typeof flyers)[number] | null>(null);
  const [copied, setCopied] = useState(false);
  const [cif, setCif] = useState(38000);
  const [year, setYear] = useState(2023);

  const currency = EXCHANGE_RATES[currentCurrency] || EXCHANGE_RATES.USD;
  const currencySymbol = ({ GHS: 'GH₵', EUR: '€', GBP: '£', USD: '$' } as Record<string, string>)[currentCurrency] || currency.symbol;
  const price = (usd: number) => `${currencySymbol} ${(usd * currency.rateFromUSD).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const cars = VEHICLES.slice(0, 3);
  const parts = SPARE_PARTS.slice(0, 3);
  const ageRate = year < 2016 ? 0.35 : 0.2;
  const importDuty = cif * ageRate;
  const vat = (cif + importDuty) * 0.15;
  const nhil = (cif + importDuty) * 0.025;
  const getFund = (cif + importDuty) * 0.025;
  const ecowas = cif * 0.005;
  const estimatedUsd = importDuty + vat + nhil + getFund + ecowas + 850 / 15.6;
  const estimatedGhs = (importDuty + vat + nhil + getFund + ecowas) * 15.6 + 850;
  const phone = CONTACT_INFO.primaryPhoneFormatted.replace('+', '');

  useEffect(() => {
    const root = homeRef.current;
    if (!root) return;
    root.classList.add('home-editorial--ready');
    document.documentElement.classList.add('home-snap-enabled');
    const shell = root.closest<HTMLElement>('.home-site-shell');
    const siteNav = shell?.querySelector<HTMLElement>(':scope > header');
    const syncNavHeight = () => {
      if (!siteNav) return;
      const navStyle = getComputedStyle(siteNav);
      const currentPadding = Number.parseFloat(navStyle.paddingTop) + Number.parseFloat(navStyle.paddingBottom);
      const expandedHeight = Math.ceil(siteNav.getBoundingClientRect().height + Math.max(0, 32 - currentPadding));
      document.documentElement.style.setProperty('--home-nav-height', `${expandedHeight}px`);
    };
    const navObserver = siteNav ? new ResizeObserver(syncNavHeight) : null;
    if (siteNav) navObserver?.observe(siteNav);
    syncNavHeight();
    const sections = Array.from(root.querySelectorAll<HTMLElement>(':scope > #hero, :scope > section.home-scene'));
    const footer = shell?.querySelector<HTMLElement>(':scope > footer');
    if (footer) sections.push(footer);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let scrollRaf = 0;
    let scrollBusy = false;
    let lastWheelAt = 0;
    let unlockTimer = 0;

    const updateMotion = () => {
      raf = 0;
      const navHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--home-nav-height')) || 80;
      const center = navHeight + (window.innerHeight - navHeight) * 0.5;
      const travel = Math.min(window.innerWidth * (window.innerWidth < 761 ? 0.12 : 0.3), 360);
      sections.forEach((section, index) => {
        const content = section.firstElementChild as HTMLElement | null;
        if (!content) return;
        if (reducedMotion.matches) {
          content.style.opacity = '1';
          content.style.transform = 'none';
          return;
        }
        const rect = section.getBoundingClientRect();
        const sectionCenter = (rect.top + rect.bottom) / 2;
        const rawProgress = 1 - Math.min(1, Math.abs(sectionCenter - center) / (window.innerHeight * 0.9));
        const progress = rawProgress * rawProgress * (3 - 2 * rawProgress);
        const enterFrom = index % 2 === 0 ? 1 : -1;
        content.style.opacity = String(0.66 + progress * 0.34);
        content.style.transform = `translate3d(${enterFrom * (1 - progress) * travel}px, ${(1 - progress) * 12}px, 0)`;
      });
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(updateMotion); };
    const releaseAfterWheelQuiet = () => {
      window.clearTimeout(unlockTimer);
      const quietFor = performance.now() - lastWheelAt;
      if (quietFor < 220) {
        unlockTimer = window.setTimeout(releaseAfterWheelQuiet, 220 - quietFor);
      } else {
        scrollBusy = false;
      }
    };
    const animateToSection = (targetY: number) => {
      const fromY = window.scrollY;
      const duration = reducedMotion.matches ? 0 : 780;
      const startedAt = performance.now();
      document.documentElement.classList.add('home-snap-animating');
      const step = (time: number) => {
        const progress = duration === 0 ? 1 : Math.min(1, (time - startedAt) / duration);
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        window.scrollTo(0, fromY + (targetY - fromY) * eased);
        if (progress < 1) {
          scrollRaf = requestAnimationFrame(step);
        } else {
          window.scrollTo(0, targetY);
          scrollRaf = 0;
          document.documentElement.classList.remove('home-snap-animating');
          releaseAfterWheelQuiet();
        }
      };
      scrollRaf = requestAnimationFrame(step);
    };
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaY) < 8 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (root.querySelector('.home-modal')) return;
      event.preventDefault();
      lastWheelAt = performance.now();
      if (scrollBusy) {
        releaseAfterWheelQuiet();
        return;
      }
      const navHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--home-nav-height')) || 80;
      const points = sections.map(section => section.getBoundingClientRect().top + window.scrollY - navHeight);
      if (!points.length) return;
      const currentY = window.scrollY;
      const threshold = 24;
      const targetY = event.deltaY > 0
        ? (points.find(point => point > currentY + threshold) ?? points[points.length - 1])
        : ([...points].reverse().find(point => point < currentY - threshold) ?? points[0]);
      if (Math.abs(targetY - currentY) < threshold) return;
      scrollBusy = true;
      animateToSection(targetY);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reducedMotion.addEventListener('change', schedule);
    updateMotion();
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scrollRaf);
      window.clearTimeout(unlockTimer);
      document.documentElement.classList.remove('home-snap-animating');
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reducedMotion.removeEventListener('change', schedule);
      navObserver?.disconnect();
      document.documentElement.style.removeProperty('--home-nav-height');
      root.classList.remove('home-editorial--ready');
      document.documentElement.classList.remove('home-snap-enabled');
    };
  }, []);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_INFO.fullAddressWithCompany);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div ref={homeRef} className="home-editorial homepage-redesign text-white selection:bg-gold-500 selection:text-dark-950">
      <HomepageFrameWebGL />
      <VideoScrollHero onNavigatePage={onNavigatePage} onOpenFlyerModal={() => setActiveFlyer(flyers[0])} />

      <section className="home-scene home-scene--proof" aria-label="Jackdan service standards">
        <div className="home-shell home-proof home-proof--right">
          <div className="home-proof__intro">
            <span className="home-eyebrow"><Sparkles size={13} /> THE JACKDAN STANDARD</span>
            <p>One trusted team from overseas sourcing to your driveway.</p>
          </div>
          <div className="home-proof__stats">
            <div><strong>150<span>+</span></strong><small>Inspection points</small></div>
            <div><strong>18<span>–24</span></strong><small>Days at sea</small></div>
            <div><strong>0<span>%</span></strong><small>Demurrage target</small></div>
            <div><strong>16</strong><small>Regions served</small></div>
          </div>
        </div>
      </section>

      <section className="home-scene home-scene--journey" id="journey">
        <div className="home-shell home-split home-split--left">
          <header className="home-section-heading">
            <span className="home-eyebrow">01 — FROM OVERSEAS TO YOUR DOOR</span>
            <h2>A clear journey.<br /><em>At every stage.</em></h2>
            <p>We coordinate the details that make an international vehicle purchase easier to understand and easier to manage.</p>
          </header>
          <div className="home-journey-list">
            {chapters.map(({ chapter, time, location, title, description, detail, icon: Icon }) => (
              <article className="home-journey-step" key={chapter}>
                <div className="home-journey-step__index"><span>{chapter}</span><Icon size={17} /></div>
                <div className="home-journey-step__copy">
                  <div className="home-journey-step__meta"><b>{time}</b><span>{location}</span></div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <small>{detail}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-scene home-scene--inventory" id="fleet">
        <div className="home-shell home-split home-split--right">
          <header className="home-section-heading">
            <span className="home-eyebrow">02 — SELECTED FOR THE ROAD AHEAD</span>
            <h2>Find your next<br /><em>great drive.</em></h2>
            <p>Clean-title sedans and SUVs sourced for everyday Ghanaian roads. View the complete live inventory for more options.</p>
            <button className="home-link-button" type="button" onClick={() => onNavigatePage('inventory')}>Explore all {VEHICLES.length} vehicles <ArrowUpRight size={16} /></button>
          </header>
          <div className="home-car-grid">
            {cars.map((car, index) => (
              <article className={`home-car-card${index === 0 ? ' home-car-card--featured' : ''}`} key={car.id}>
                <div className="home-car-card__image">
                  <img src={car.image} alt={car.name} loading="lazy" />
                  <span className="home-image-label">{car.category} <i /> {car.year}</span>
                  {car.popular && <span className="home-popular">POPULAR</span>}
                </div>
                <div className="home-car-card__body">
                  <div className="home-car-card__title"><div><h3>{car.name}</h3><p>{car.condition}</p></div><strong>{price(car.priceUSD)}</strong></div>
                  <p className="home-car-card__spec">{car.engine}</p>
                  <div className="home-car-card__facts"><span><Gauge size={14} />{car.mileage}</span><span><Fuel size={14} />{car.fuelType}</span><span><MapPin size={14} />{car.location}</span></div>
                  <a className="home-card-action" href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hello Jackdan, please tell me more about the ${car.name} listed at ${price(car.priceUSD)}.`)}`} target="_blank" rel="noopener noreferrer">Ask about this vehicle <ArrowRight size={15} /></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-scene home-scene--calculator" id="duty-estimator">
        <div className="home-shell home-split home-split--left home-calculator-layout">
          <header className="home-section-heading">
            <span className="home-eyebrow">03 — PLAN BEFORE YOU PURCHASE</span>
            <h2>Know the numbers<br /><em>before the voyage.</em></h2>
            <p>Adjust your vehicle value and model year for a quick, indicative import duty estimate. Final assessments are confirmed by GRA/ICUMS.</p>
          </header>
          <div className="home-calculator">
            <div className="home-calculator__controls">
              <label className="home-range-label" htmlFor="home-cif"><span>CIF purchase value</span><b>${cif.toLocaleString()} USD</b></label>
              <input id="home-cif" type="range" min="8000" max="120000" step="1000" value={cif} onChange={event => setCif(Number(event.target.value))} />
              <div className="home-range-ends"><span>$8,000</span><span>$120,000+</span></div>
              <label className="home-range-label" htmlFor="home-year"><span>Year of manufacture</span><b>{year}</b></label>
              <input id="home-year" type="range" min="2014" max="2026" step="1" value={year} onChange={event => setYear(Number(event.target.value))} />
              <div className="home-range-ends"><span>2014 · over-aged</span><span>2026 · new</span></div>
            </div>
            <aside className="home-calculator__result" aria-live="polite">
              <span className="home-eyebrow"><Calculator size={13} /> ESTIMATED DUTY & CLEARING</span>
              <strong>GH₵ {Math.round(estimatedGhs).toLocaleString()}</strong>
              <p>Approximately ${Math.round(estimatedUsd).toLocaleString()} USD</p>
              <div className="home-duty-lines"><span>Import duty <b>${Math.round(importDuty).toLocaleString()}</b></span><span>VAT <b>${Math.round(vat).toLocaleString()}</b></span><span>NHIL + GETFund <b>${Math.round(nhil + getFund).toLocaleString()}</b></span><span>ECOWAS levy <b>${Math.round(ecowas).toLocaleString()}</b></span></div>
              <a href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hello Jackdan Customs Desk, please confirm the estimated duty for a ${year} vehicle at $${cif.toLocaleString()} CIF.`)}`} target="_blank" rel="noopener noreferrer">Confirm this estimate <ArrowRight size={15} /></a>
            </aside>
          </div>
        </div>
      </section>

      <section className="home-scene home-scene--ventures" id="ventures">
        <div className="home-shell home-split home-split--right">
          <header className="home-section-heading">
            <span className="home-eyebrow">04 — MORE UNDER ONE ROOF</span>
            <h2>Connected by<br /><em>good journeys.</em></h2>
            <p>Two specialist teams extend the Jackdan network across freight, travel and hospitality.</p>
          </header>
          <div className="home-venture-grid">
            <article className="home-venture-card home-venture-card--sea">
              <span className="home-venture-card__icon"><Ship size={22} /></span><span className="home-eyebrow">FREIGHT · STORAGE · HAULAGE</span>
              <h3>Twumaasco<br />Logistics & Trading</h3>
              <p>Sea and air freight, bonded storage, port clearing and road haulage throughout Ghana and West Africa.</p>
              <button type="button" onClick={() => onNavigatePage('twumaasco-logistics')}>Explore logistics <ArrowUpRight size={16} /></button>
            </article>
            <article className="home-venture-card home-venture-card--air">
              <span className="home-venture-card__icon"><Plane size={22} /></span><span className="home-eyebrow">VISAS · FLIGHTS · STAYS</span>
              <h3>Jackdan<br />Travel & Tour</h3>
              <p>Practical visa guidance, global flight bookings, hotel reservations and curated travel experiences.</p>
              <button type="button" onClick={() => onNavigatePage('travel-tour')}>Explore travel <ArrowUpRight size={16} /></button>
            </article>
          </div>
        </div>
      </section>

      <section className="home-scene home-scene--catalog" id="catalogs">
        <div className="home-shell home-split home-split--left">
          <header className="home-section-heading">
            <span className="home-eyebrow">05 — THE JACKDAN COLLECTION</span>
            <h2>Take a closer<br /><em>look around.</em></h2>
            <p>Browse the latest company catalogs. Open a flyer to view, download or ask our team about it.</p>
          </header>
          <div className="home-flyer-grid">
            {flyers.map((flyer, index) => (
              <article className={`home-flyer-card home-flyer-card--${flyer.color}`} key={flyer.title}>
                <button className="home-flyer-card__art" type="button" onClick={() => setActiveFlyer(flyer)} aria-label={`Open ${flyer.title}`}>
                  <img src={flyer.image} alt={flyer.title} loading="lazy" />
                  <span>0{index + 1} <ArrowUpRight size={16} /></span>
                </button>
                <div><small>{flyer.subtitle}</small><h3>{flyer.title}</h3><button className="home-text-action" type="button" onClick={() => setActiveFlyer(flyer)}>View catalog <ArrowRight size={14} /></button></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-scene home-scene--parts" id="parts">
        <div className="home-shell home-split home-split--right">
          <header className="home-section-heading">
            <span className="home-eyebrow">06 — BUILT TO FIT. READY TO SHIP.</span>
            <h2>Genuine parts.<br /><em>Direct sourcing.</em></h2>
            <p>Factory replacement components for dependable maintenance and repair. Ask our team to confirm fitment before ordering.</p>
            <button className="home-link-button" type="button" onClick={() => onNavigatePage('parts')}>Browse all {SPARE_PARTS.length} parts <ArrowUpRight size={16} /></button>
          </header>
          <div className="home-part-grid">
            {parts.map(part => (
              <article className="home-part-card" key={part.id}>
                <div className="home-part-card__image"><img src={part.image} alt={part.name} loading="lazy" /><span>{part.category}</span></div>
                <div className="home-part-card__body"><h3>{part.name}</h3><p>{part.description}</p><div className="home-part-card__price"><strong>{price(part.priceUSD)}</strong><small>{part.warranty} warranty</small></div>
                  <a href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hello Jackdan Spare Parts, can you confirm availability and fitment for ${part.name} (${part.partNumber})?`)}`} target="_blank" rel="noopener noreferrer">Ask about this part <ArrowRight size={15} /></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-scene home-scene--contact" id="contact">
        <div className="home-shell home-contact">
          <div className="home-contact__main">
            <span className="home-eyebrow">07 — COME TALK TO US</span>
            <h2>Good service starts<br />with a <em>conversation.</em></h2>
            <p>Visit our Abossey Okai office or speak with our team about vehicles, parts, freight or travel.</p>
            <div className="home-contact__details"><span><MapPin size={16} />{CONTACT_INFO.area}, {CONTACT_INFO.city}, Ghana</span><a href={`tel:${CONTACT_INFO.primaryPhoneFormatted}`}><MessageSquare size={16} />{CONTACT_INFO.phones[0]}</a><span><Clock3 size={16} />Mon–Sat · 8:00–18:00 GMT</span></div>
            <div className="home-contact__actions"><a className="home-button home-button--gold" href={`https://wa.me/${phone}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`} target="_blank" rel="noopener noreferrer">Chat with Jackdan <ArrowRight size={16} /></a><a className="home-button home-button--quiet" href={CONTACT_INFO.googleMapsUrl} target="_blank" rel="noopener noreferrer">Get directions <ExternalLink size={15} /></a></div>
          </div>
          <aside className="home-address-card"><span className="home-address-card__mark"><Building2 size={19} /></span><span className="home-eyebrow">HEAD OFFICE</span><h3>{CONTACT_INFO.companyName}</h3><p>{CONTACT_INFO.poBox}<br />{CONTACT_INFO.landmark}<br />{CONTACT_INFO.area}, {CONTACT_INFO.city}, {CONTACT_INFO.country}</p><button type="button" onClick={copyAddress}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Address copied' : 'Copy address'}</button></aside>
        </div>
      </section>

      {activeFlyer && (
        <div className="home-modal" role="presentation" onClick={() => setActiveFlyer(null)}>
          <div className="home-modal__panel" role="dialog" aria-modal="true" aria-labelledby="flyer-title" onClick={event => event.stopPropagation()}>
            <button className="home-modal__close" type="button" onClick={() => setActiveFlyer(null)} aria-label="Close catalog"><X size={19} /></button>
            <span className="home-eyebrow">OFFICIAL CATALOG</span><h2 id="flyer-title">{activeFlyer.title}</h2><p>{activeFlyer.description}</p>
            <img src={activeFlyer.image} alt={activeFlyer.title} />
            <div className="home-modal__actions"><a href={activeFlyer.image} download><Download size={15} />Download flyer</a><button type="button" onClick={() => { onNavigatePage(activeFlyer.actionPage); setActiveFlyer(null); }}>Explore this division <ArrowUpRight size={15} /></button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InformationalHome;
