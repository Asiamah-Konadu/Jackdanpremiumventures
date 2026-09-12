/**
 * Jackdan Premium Ventures — Firestore Data Service
 * 
 * All public data (vehicles, parts, shipments, rates, contact info) lives in
 * Firestore so admin changes instantly propagate to every customer worldwide.
 * 
 * Structure:
 *   vehicles/         → one document per vehicle (id = vehicle.id)
 *   spare_parts/      → one document per part (id = part.id)
 *   shipments/        → one document per shipment (id = trackingId)
 *   config/exchange_rates  → single document
 *   config/contact_info    → single document
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
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

// ─── Collection / Doc paths ──────────────────────────────────────────────────
const COL = {
  VEHICLES:   'vehicles',
  PARTS:      'spare_parts',
  SHIPMENTS:  'shipments',
  CONFIG:     'config',
} as const;

const CFG = {
  RATES:   'exchange_rates',
  CONTACT: 'contact_info',
} as const;

// ─── One-time seed (runs when Firestore collections are empty) ───────────────
export const seedFirestoreIfEmpty = async (): Promise<void> => {
  try {
    // Vehicles
    const vSnap = await getDocs(collection(db, COL.VEHICLES));
    if (vSnap.empty) {
      const b = writeBatch(db);
      VEHICLES.forEach(v => b.set(doc(db, COL.VEHICLES, v.id), v));
      await b.commit();
      console.log('[Firestore] ✅ Seeded vehicles');
    }

    // Spare parts
    const pSnap = await getDocs(collection(db, COL.PARTS));
    if (pSnap.empty) {
      const b = writeBatch(db);
      SPARE_PARTS.forEach(p => b.set(doc(db, COL.PARTS, p.id), p));
      await b.commit();
      console.log('[Firestore] ✅ Seeded spare parts');
    }

    // Shipments
    const sSnap = await getDocs(collection(db, COL.SHIPMENTS));
    if (sSnap.empty) {
      const b = writeBatch(db);
      Object.entries(SAMPLE_SHIPMENTS).forEach(([tid, s]) =>
        b.set(doc(db, COL.SHIPMENTS, tid), s)
      );
      await b.commit();
      console.log('[Firestore] ✅ Seeded shipments');
    }

    // Exchange rates
    const rSnap = await getDoc(doc(db, COL.CONFIG, CFG.RATES));
    if (!rSnap.exists()) {
      await setDoc(doc(db, COL.CONFIG, CFG.RATES), EXCHANGE_RATES);
      console.log('[Firestore] ✅ Seeded exchange rates');
    }

    // Contact info
    const cSnap = await getDoc(doc(db, COL.CONFIG, CFG.CONTACT));
    if (!cSnap.exists()) {
      await setDoc(doc(db, COL.CONFIG, CFG.CONTACT), CONTACT_INFO);
      console.log('[Firestore] ✅ Seeded contact info');
    }
  } catch (err) {
    console.error('[Firestore] Seed error (check Firestore rules):', err);
  }
};

// ─── Real-time subscriptions (for public-facing components) ─────────────────

export const subscribeToVehicles = (
  cb: (v: Vehicle[]) => void
): Unsubscribe =>
  onSnapshot(collection(db, COL.VEHICLES), snap =>
    cb(snap.docs.map(d => d.data() as Vehicle))
  );

export const subscribeToSpareParts = (
  cb: (p: SparePart[]) => void
): Unsubscribe =>
  onSnapshot(collection(db, COL.PARTS), snap =>
    cb(snap.docs.map(d => d.data() as SparePart))
  );

export const subscribeToShipments = (
  cb: (s: Record<string, ShipmentStatus>) => void
): Unsubscribe =>
  onSnapshot(collection(db, COL.SHIPMENTS), snap => {
    const map: Record<string, ShipmentStatus> = {};
    snap.docs.forEach(d => { map[d.id] = d.data() as ShipmentStatus; });
    cb(map);
  });

export const subscribeToExchangeRates = (
  cb: (r: typeof EXCHANGE_RATES) => void
): Unsubscribe =>
  onSnapshot(doc(db, COL.CONFIG, CFG.RATES), snap =>
    cb(snap.exists() ? (snap.data() as typeof EXCHANGE_RATES) : EXCHANGE_RATES)
  );

export const subscribeToContactInfo = (
  cb: (c: typeof CONTACT_INFO) => void
): Unsubscribe =>
  onSnapshot(doc(db, COL.CONFIG, CFG.CONTACT), snap =>
    cb(snap.exists() ? (snap.data() as typeof CONTACT_INFO) : CONTACT_INFO)
  );

// ─── Write helpers (used by Admin Portal via store.ts) ───────────────────────

export const fsWriteVehicles = async (vehicles: Vehicle[]): Promise<void> => {
  // Determine which IDs to delete
  const existing = await getDocs(collection(db, COL.VEHICLES));
  const existingIds = new Set(existing.docs.map(d => d.id));
  const newIds = new Set(vehicles.map(v => v.id));

  const b = writeBatch(db);
  vehicles.forEach(v => b.set(doc(db, COL.VEHICLES, v.id), v));
  existingIds.forEach(id => { if (!newIds.has(id)) b.delete(doc(db, COL.VEHICLES, id)); });
  await b.commit();
};

export const fsWriteSpareParts = async (parts: SparePart[]): Promise<void> => {
  const existing = await getDocs(collection(db, COL.PARTS));
  const existingIds = new Set(existing.docs.map(d => d.id));
  const newIds = new Set(parts.map(p => p.id));

  const b = writeBatch(db);
  parts.forEach(p => b.set(doc(db, COL.PARTS, p.id), p));
  existingIds.forEach(id => { if (!newIds.has(id)) b.delete(doc(db, COL.PARTS, id)); });
  await b.commit();
};

export const fsWriteShipments = async (
  shipments: Record<string, ShipmentStatus>
): Promise<void> => {
  const existing = await getDocs(collection(db, COL.SHIPMENTS));
  const existingIds = new Set(existing.docs.map(d => d.id));
  const newIds = new Set(Object.keys(shipments));

  const b = writeBatch(db);
  Object.entries(shipments).forEach(([id, s]) =>
    b.set(doc(db, COL.SHIPMENTS, id), s)
  );
  existingIds.forEach(id => { if (!newIds.has(id)) b.delete(doc(db, COL.SHIPMENTS, id)); });
  await b.commit();
};

export const fsWriteExchangeRates = async (
  rates: typeof EXCHANGE_RATES
): Promise<void> => {
  await setDoc(doc(db, COL.CONFIG, CFG.RATES), rates);
};

export const fsWriteContactInfo = async (
  info: typeof CONTACT_INFO
): Promise<void> => {
  await setDoc(doc(db, COL.CONFIG, CFG.CONTACT), info);
};

// ─── Bulk export for JSON backup ─────────────────────────────────────────────
export const fsExportAll = async () => {
  const [vSnap, pSnap, sSnap, rDoc, cDoc] = await Promise.all([
    getDocs(collection(db, COL.VEHICLES)),
    getDocs(collection(db, COL.PARTS)),
    getDocs(collection(db, COL.SHIPMENTS)),
    getDoc(doc(db, COL.CONFIG, CFG.RATES)),
    getDoc(doc(db, COL.CONFIG, CFG.CONTACT)),
  ]);

  return {
    version: '2.0',
    exportDate: new Date().toISOString(),
    vehicles:      vSnap.docs.map(d => d.data() as Vehicle),
    spareParts:    pSnap.docs.map(d => d.data() as SparePart),
    shipments:     Object.fromEntries(sSnap.docs.map(d => [d.id, d.data()])),
    exchangeRates: rDoc.exists() ? rDoc.data() : EXCHANGE_RATES,
    contactInfo:   cDoc.exists() ? cDoc.data() : CONTACT_INFO,
  };
};

// ─── Bulk import from JSON backup ────────────────────────────────────────────
export const fsImportAll = async (data: any): Promise<void> => {
  if (Array.isArray(data.vehicles) && data.vehicles.length > 0) {
    await fsWriteVehicles(data.vehicles);
  }
  if (Array.isArray(data.spareParts) && data.spareParts.length > 0) {
    await fsWriteSpareParts(data.spareParts);
  }
  if (data.shipments && typeof data.shipments === 'object') {
    await fsWriteShipments(data.shipments);
  }
  if (data.exchangeRates) await fsWriteExchangeRates(data.exchangeRates);
  if (data.contactInfo)   await fsWriteContactInfo(data.contactInfo);
};

// ─── Reset Firestore to factory defaults ─────────────────────────────────────
export const fsResetToDefaults = async (): Promise<void> => {
  const [vSnap, pSnap, sSnap] = await Promise.all([
    getDocs(collection(db, COL.VEHICLES)),
    getDocs(collection(db, COL.PARTS)),
    getDocs(collection(db, COL.SHIPMENTS)),
  ]);

  const b = writeBatch(db);
  [...vSnap.docs, ...pSnap.docs, ...sSnap.docs].forEach(d => b.delete(d.ref));
  await b.commit();

  // Reseed with defaults
  await seedFirestoreIfEmpty();
};
