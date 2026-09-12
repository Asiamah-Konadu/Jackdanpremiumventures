/**
 * Jackdan Premium Ventures — Unified Data Store
 *
 * Strategy:
 *  - localStorage acts as the fast LOCAL CACHE (instant synchronous reads)
 *  - Firestore is the SOURCE OF TRUTH (all saves write to Firestore)
 *  - `initFirestoreSync()` seeds Firestore on first launch and keeps
 *    localStorage in sync via onSnapshot listeners → public components
 *    update automatically via the `jackdan_storage_updated` window event.
 */

import {
  Vehicle,
  SparePart,
  ShipmentStatus,
  VEHICLES,
  SPARE_PARTS,
  SAMPLE_SHIPMENTS,
  EXCHANGE_RATES,
  CONTACT_INFO,
} from './inventory';

import {
  seedFirestoreIfEmpty,
  subscribeToVehicles,
  subscribeToSpareParts,
  subscribeToShipments,
  subscribeToExchangeRates,
  subscribeToContactInfo,
  fsWriteVehicles,
  fsWriteSpareParts,
  fsWriteShipments,
  fsWriteExchangeRates,
  fsWriteContactInfo,
  fsExportAll,
  fsImportAll,
  fsResetToDefaults,
} from './firestoreService';

// ─── localStorage keys (fast local cache) ────────────────────────────────────
const KEYS = {
  VEHICLES:  'jackdan_vehicles_v1',
  PARTS:     'jackdan_spare_parts_v1',
  SHIPMENTS: 'jackdan_live_shipments_v2',
  RATES:     'jackdan_exchange_rates_v1',
  CONTACT:   'jackdan_contact_info_v1',
  AUTH:      'jackdan_admin_session_v1',
  PIN:       'jackdan_admin_master_pin_v1',
};

const DEFAULT_PIN = 'jackdan2026';

// ─── Firestore → localStorage sync initializer ───────────────────────────────
/**
 * Call once on app startup (in App.tsx).
 * Seeds Firestore with default inventory if empty, then attaches onSnapshot
 * listeners that push every Firestore change into localStorage and fire the
 * `jackdan_storage_updated` event so all public components re-render.
 * Returns a cleanup function to unsubscribe all listeners.
 */
export const initFirestoreSync = (): (() => void) => {
  // Seed Firestore if this is the first launch
  seedFirestoreIfEmpty().catch(console.error);

  const dispatch = () =>
    window.dispatchEvent(new Event('jackdan_storage_updated'));

  const u1 = subscribeToVehicles(vehicles => {
    try { localStorage.setItem(KEYS.VEHICLES, JSON.stringify(vehicles)); } catch {}
    dispatch();
  });

  const u2 = subscribeToSpareParts(parts => {
    try { localStorage.setItem(KEYS.PARTS, JSON.stringify(parts)); } catch {}
    dispatch();
  });

  const u3 = subscribeToShipments(shipments => {
    try { localStorage.setItem(KEYS.SHIPMENTS, JSON.stringify(shipments)); } catch {}
    dispatch();
  });

  const u4 = subscribeToExchangeRates(rates => {
    try { localStorage.setItem(KEYS.RATES, JSON.stringify(rates)); } catch {}
    dispatch();
  });

  const u5 = subscribeToContactInfo(info => {
    try { localStorage.setItem(KEYS.CONTACT, JSON.stringify(info)); } catch {}
    dispatch();
  });

  return () => { u1(); u2(); u3(); u4(); u5(); };
};

// ─── 1. Vehicles ─────────────────────────────────────────────────────────────

export const getStoredVehicles = (): Vehicle[] => {
  try {
    const raw = localStorage.getItem(KEYS.VEHICLES);
    if (raw) {
      const p = JSON.parse(raw);
      if (Array.isArray(p) && p.length > 0) return p;
    }
  } catch {}
  return VEHICLES;
};

export const saveStoredVehicles = (vehicles: Vehicle[]): void => {
  try {
    localStorage.setItem(KEYS.VEHICLES, JSON.stringify(vehicles));
    window.dispatchEvent(new Event('jackdan_storage_updated'));
  } catch (e) {
    console.error('[Store] Failed to cache vehicles:', e);
  }
  // Persist to Firestore (cross-device sync)
  fsWriteVehicles(vehicles).catch(e =>
    console.error('[Firestore] Failed to save vehicles:', e)
  );
};

// ─── 2. Spare Parts ──────────────────────────────────────────────────────────

export const getStoredSpareParts = (): SparePart[] => {
  try {
    const raw = localStorage.getItem(KEYS.PARTS);
    if (raw) {
      const p = JSON.parse(raw);
      if (Array.isArray(p) && p.length > 0) return p;
    }
  } catch {}
  return SPARE_PARTS;
};

export const saveStoredSpareParts = (parts: SparePart[]): void => {
  try {
    localStorage.setItem(KEYS.PARTS, JSON.stringify(parts));
    window.dispatchEvent(new Event('jackdan_storage_updated'));
  } catch (e) {
    console.error('[Store] Failed to cache spare parts:', e);
  }
  fsWriteSpareParts(parts).catch(e =>
    console.error('[Firestore] Failed to save spare parts:', e)
  );
};

// ─── 3. Shipments ─────────────────────────────────────────────────────────────

export const getStoredShipments = (): Record<string, ShipmentStatus> => {
  try {
    const raw = localStorage.getItem(KEYS.SHIPMENTS);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && typeof p === 'object' && Object.keys(p).length > 0) return p;
    }
  } catch {}
  return SAMPLE_SHIPMENTS;
};

export const saveStoredShipments = (
  shipments: Record<string, ShipmentStatus>
): void => {
  try {
    localStorage.setItem(KEYS.SHIPMENTS, JSON.stringify(shipments));
    window.dispatchEvent(new Event('jackdan_storage_updated'));
  } catch (e) {
    console.error('[Store] Failed to cache shipments:', e);
  }
  fsWriteShipments(shipments).catch(e =>
    console.error('[Firestore] Failed to save shipments:', e)
  );
};

// ─── 4. Exchange Rates ───────────────────────────────────────────────────────

export const getStoredExchangeRates = () => {
  try {
    const raw = localStorage.getItem(KEYS.RATES);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && typeof p === 'object') return p;
    }
  } catch {}
  return EXCHANGE_RATES;
};

export const saveStoredExchangeRates = (
  rates: typeof EXCHANGE_RATES
): void => {
  try {
    localStorage.setItem(KEYS.RATES, JSON.stringify(rates));
    window.dispatchEvent(new Event('jackdan_storage_updated'));
  } catch (e) {
    console.error('[Store] Failed to cache rates:', e);
  }
  fsWriteExchangeRates(rates).catch(e =>
    console.error('[Firestore] Failed to save rates:', e)
  );
};

// ─── 5. Contact Info ─────────────────────────────────────────────────────────

export const getStoredContactInfo = () => {
  try {
    const raw = localStorage.getItem(KEYS.CONTACT);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && typeof p === 'object') return p;
    }
  } catch {}
  return CONTACT_INFO;
};

export const saveStoredContactInfo = (
  info: typeof CONTACT_INFO
): void => {
  try {
    localStorage.setItem(KEYS.CONTACT, JSON.stringify(info));
    window.dispatchEvent(new Event('jackdan_storage_updated'));
  } catch (e) {
    console.error('[Store] Failed to cache contact info:', e);
  }
  fsWriteContactInfo(info).catch(e =>
    console.error('[Firestore] Failed to save contact info:', e)
  );
};

// ─── 6. Security & Master PIN (localStorage only — not in Firestore) ─────────

export const getMasterPin = (): string =>
  localStorage.getItem(KEYS.PIN) || DEFAULT_PIN;

export const setMasterPin = (pin: string): void =>
  localStorage.setItem(KEYS.PIN, pin.trim());

export const isUserAuthenticated = (): boolean =>
  sessionStorage.getItem(KEYS.AUTH) === 'true';

export const setSessionAuthenticated = (auth: boolean): void => {
  if (auth) {
    sessionStorage.setItem(KEYS.AUTH, 'true');
  } else {
    sessionStorage.removeItem(KEYS.AUTH);
  }
};

// ─── 7. Backup, Reset & Code Export ─────────────────────────────────────────

/** Exports ALL current data (from Firestore) as a JSON string for download */
export const exportAllDataAsJSON = async (): Promise<string> => {
  try {
    const data = await fsExportAll();
    return JSON.stringify(data, null, 2);
  } catch (e) {
    console.error('[Store] Firestore export failed, using cache:', e);
    return JSON.stringify({
      version: '1.0',
      exportDate: new Date().toISOString(),
      vehicles:      getStoredVehicles(),
      spareParts:    getStoredSpareParts(),
      shipments:     getStoredShipments(),
      exchangeRates: getStoredExchangeRates(),
      contactInfo:   getStoredContactInfo(),
    }, null, 2);
  }
};

/** Imports a full JSON backup into Firestore */
export const importAllDataFromJSON = async (
  jsonString: string
): Promise<boolean> => {
  try {
    const parsed = JSON.parse(jsonString);
    await fsImportAll(parsed);
    // Locally dispatch so UI refreshes before Firestore onSnapshot fires
    if (parsed.vehicles)      saveStoredVehicles(parsed.vehicles);
    if (parsed.spareParts)    saveStoredSpareParts(parsed.spareParts);
    if (parsed.shipments)     saveStoredShipments(parsed.shipments);
    if (parsed.exchangeRates) saveStoredExchangeRates(parsed.exchangeRates);
    if (parsed.contactInfo)   saveStoredContactInfo(parsed.contactInfo);
    return true;
  } catch (e) {
    console.error('[Store] Import failed:', e);
    return false;
  }
};

/** Wipes all Firestore data and reseeds from inventory.ts defaults */
export const resetAllToFactoryDefaults = async (): Promise<void> => {
  try {
    await fsResetToDefaults();
  } catch (e) {
    console.error('[Store] Firestore reset failed, clearing cache:', e);
    localStorage.removeItem(KEYS.VEHICLES);
    localStorage.removeItem(KEYS.PARTS);
    localStorage.removeItem(KEYS.SHIPMENTS);
    localStorage.removeItem(KEYS.RATES);
    localStorage.removeItem(KEYS.CONTACT);
    window.dispatchEvent(new Event('jackdan_storage_updated'));
  }
};

// ─── 8. Code Export (for embedding Firestore data into inventory.ts) ─────────

export const generateMasterInventoryCode = (): string => {
  const vehicles = getStoredVehicles();
  const spareParts = getStoredSpareParts();
  const shipments = getStoredShipments();
  const rates = getStoredExchangeRates();
  const contact = getStoredContactInfo();

  return `// Jackdan Premium Ventures - Master Inventory & Sourcing Dataset
// Generated from Admin Management Portal on ${new Date().toLocaleString()}
// Source: Firebase Firestore → jackdan-premium-ventures

export interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  category: 'Sedan' | 'SUV' | 'Luxury' | 'Truck' | 'Commercial';
  priceUSD: number;
  mileage: string;
  fuelType: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  transmission: 'Automatic' | 'Manual';
  condition: 'Brand New' | 'Foreign Used / Clean Title' | 'Certified Pre-Owned';
  location: string;
  engine: string;
  color: string;
  vinPreview: string;
  image: string;
  features: string[];
  popular?: boolean;
}

export interface SparePart {
  id: string;
  name: string;
  category: 'Braking' | 'Engine & Transmission' | 'Suspension & Steering' | 'Batteries & Electrical' | 'Filters & Fluids' | 'Body & Lighting';
  compatibility: string;
  priceUSD: number;
  partNumber: string;
  inStock: boolean;
  warranty: string;
  origin: string;
  image: string;
  description: string;
}

export interface ShipmentStatus {
  trackingId: string;
  vin: string;
  vehicleName: string;
  origin: string;
  destination: string;
  estimatedArrival: string;
  currentStatus: string;
  statusCode: 'booked' | 'origin_port' | 'in_transit' | 'customs_clearing' | 'ready_for_pickup';
  progressPercentage: number;
  vesselName: string;
  containerNumber: string;
  updates: { date: string; time: string; location: string; note: string }[];
}

export const VEHICLES: Vehicle[] = ${JSON.stringify(vehicles, null, 2)};

export const SPARE_PARTS: SparePart[] = ${JSON.stringify(spareParts, null, 2)};

export const SAMPLE_SHIPMENTS: Record<string, ShipmentStatus> = ${JSON.stringify(shipments, null, 2)};

export const EXCHANGE_RATES: Record<string, { symbol: string; rateFromUSD: number; label: string }> = ${JSON.stringify(rates, null, 2)};

export const CONTACT_INFO = ${JSON.stringify(contact, null, 2)};
`;
};
