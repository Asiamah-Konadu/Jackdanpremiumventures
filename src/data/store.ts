import { 
  Vehicle, 
  SparePart, 
  ShipmentStatus, 
  VEHICLES, 
  SPARE_PARTS, 
  SAMPLE_SHIPMENTS, 
  EXCHANGE_RATES, 
  CONTACT_INFO 
} from './inventory';

const STORAGE_KEYS = {
  VEHICLES: 'jackdan_vehicles_v1',
  PARTS: 'jackdan_spare_parts_v1',
  SHIPMENTS: 'jackdan_live_shipments_v2',
  RATES: 'jackdan_exchange_rates_v1',
  CONTACT: 'jackdan_contact_info_v1',
  AUTH: 'jackdan_admin_session_v1',
  PIN: 'jackdan_admin_master_pin_v1'
};

const DEFAULT_PIN = 'jackdan2026';

// 1. Vehicles
export const getStoredVehicles = (): Vehicle[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load vehicles from storage:', e);
  }
  return VEHICLES;
};

export const saveStoredVehicles = (vehicles: Vehicle[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
    window.dispatchEvent(new Event('jackdan_storage_updated'));
  } catch (e) {
    console.error('Failed to save vehicles to storage:', e);
  }
};

// 2. Spare Parts
export const getStoredSpareParts = (): SparePart[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PARTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load spare parts from storage:', e);
  }
  return SPARE_PARTS;
};

export const saveStoredSpareParts = (parts: SparePart[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PARTS, JSON.stringify(parts));
    window.dispatchEvent(new Event('jackdan_storage_updated'));
  } catch (e) {
    console.error('Failed to save spare parts to storage:', e);
  }
};

// 3. Shipments
export const getStoredShipments = (): Record<string, ShipmentStatus> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SHIPMENTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load shipments from storage:', e);
  }
  return SAMPLE_SHIPMENTS;
};

export const saveStoredShipments = (shipments: Record<string, ShipmentStatus>): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(shipments));
    window.dispatchEvent(new Event('jackdan_storage_updated'));
  } catch (e) {
    console.error('Failed to save shipments to storage:', e);
  }
};

// 4. Exchange Rates
export const getStoredExchangeRates = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.RATES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (e) {
    console.error('Failed to load rates from storage:', e);
  }
  return EXCHANGE_RATES;
};

export const saveStoredExchangeRates = (rates: typeof EXCHANGE_RATES): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.RATES, JSON.stringify(rates));
    window.dispatchEvent(new Event('jackdan_storage_updated'));
  } catch (e) {
    console.error('Failed to save rates to storage:', e);
  }
};

// 5. Contact Info
export const getStoredContactInfo = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTACT);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (e) {
    console.error('Failed to load contact info from storage:', e);
  }
  return CONTACT_INFO;
};

export const saveStoredContactInfo = (info: typeof CONTACT_INFO): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(info));
    window.dispatchEvent(new Event('jackdan_storage_updated'));
  } catch (e) {
    console.error('Failed to save contact info to storage:', e);
  }
};

// 6. Security & Master PIN
export const getMasterPin = (): string => {
  return localStorage.getItem(STORAGE_KEYS.PIN) || DEFAULT_PIN;
};

export const setMasterPin = (newPin: string): void => {
  localStorage.setItem(STORAGE_KEYS.PIN, newPin.trim());
};

export const isUserAuthenticated = (): boolean => {
  return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
};

export const setSessionAuthenticated = (auth: boolean): void => {
  if (auth) {
    sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
  }
};

// 7. Backup, Reset, and Code Export
export const resetAllToFactoryDefaults = (): void => {
  localStorage.removeItem(STORAGE_KEYS.VEHICLES);
  localStorage.removeItem(STORAGE_KEYS.PARTS);
  localStorage.removeItem(STORAGE_KEYS.SHIPMENTS);
  localStorage.removeItem(STORAGE_KEYS.RATES);
  localStorage.removeItem(STORAGE_KEYS.CONTACT);
  window.dispatchEvent(new Event('jackdan_storage_updated'));
};

export const exportAllDataAsJSON = (): string => {
  const bundle = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    vehicles: getStoredVehicles(),
    spareParts: getStoredSpareParts(),
    shipments: getStoredShipments(),
    exchangeRates: getStoredExchangeRates(),
    contactInfo: getStoredContactInfo()
  };
  return JSON.stringify(bundle, null, 2);
};

export const importAllDataFromJSON = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.vehicles) saveStoredVehicles(parsed.vehicles);
    if (parsed.spareParts) saveStoredSpareParts(parsed.spareParts);
    if (parsed.shipments) saveStoredShipments(parsed.shipments);
    if (parsed.exchangeRates) saveStoredExchangeRates(parsed.exchangeRates);
    if (parsed.contactInfo) saveStoredContactInfo(parsed.contactInfo);
    return true;
  } catch (e) {
    console.error('Invalid JSON file import:', e);
    return false;
  }
};

export const generateMasterInventoryCode = (): string => {
  const vehicles = getStoredVehicles();
  const spareParts = getStoredSpareParts();
  const shipments = getStoredShipments();
  const rates = getStoredExchangeRates();
  const contact = getStoredContactInfo();

  return `// Jackdan Premium Ventures - Master Inventory & Sourcing Dataset
// Generated from Admin Management Portal

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
