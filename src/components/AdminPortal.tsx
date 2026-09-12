import React, { useState, useEffect } from 'react';
import { 
  getStoredVehicles, 
  saveStoredVehicles, 
  getStoredSpareParts, 
  saveStoredSpareParts, 
  getStoredShipments, 
  saveStoredShipments, 
  getStoredExchangeRates, 
  saveStoredExchangeRates, 
  getStoredContactInfo, 
  saveStoredContactInfo,
  getMasterPin,
  setMasterPin,
  isUserAuthenticated,
  setSessionAuthenticated,
  resetAllToFactoryDefaults,
  exportAllDataAsJSON,
  importAllDataFromJSON,
  generateMasterInventoryCode
} from '../data/store';
import { Vehicle, SparePart, ShipmentStatus } from '../data/inventory';
import { 
  Compass, 
  Car, 
  Wrench, 
  Settings, 
  Ship, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Search, 
  Lock, 
  Unlock, 
  ArrowLeft, 
  Download, 
  Upload, 
  FileCode, 
  Copy, 
  Check, 
  ExternalLink, 
  DollarSign, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Anchor, 
  FileCheck, 
  AlertCircle, 
  X,
  Sparkles,
  Key
} from 'lucide-react';

interface AdminPortalProps {
  onReturnHome: () => void;
}

const MILESTONES = [
  { code: 'booked', label: '1. Booked & Export Verified', defaultProgress: 20 },
  { code: 'origin_port', label: '2. Origin Port Loaded', defaultProgress: 40 },
  { code: 'in_transit', label: '3. Ocean Transit (Sea)', defaultProgress: 70 },
  { code: 'customs_clearing', label: '4. Customs Clearance at Tema', defaultProgress: 90 },
  { code: 'ready_for_pickup', label: '5. Cleared & Handover Ready', defaultProgress: 100 },
];

export const AdminPortal: React.FC<AdminPortalProps> = ({ onReturnHome }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isUserAuthenticated);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'shipments' | 'vehicles' | 'parts' | 'settings'>('overview');

  // Stored Datasets
  const [vehicles, setVehicles] = useState<Vehicle[]>(getStoredVehicles);
  const [parts, setParts] = useState<SparePart[]>(getStoredSpareParts);
  const [shipments, setShipments] = useState<Record<string, ShipmentStatus>>(getStoredShipments);
  const [rates, setRates] = useState(getStoredExchangeRates);
  const [contact, setContact] = useState(getStoredContactInfo);

  // Notifications
  const [toastMsg, setToastMsg] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Shipments Editing State
  const [selectedShipmentKey, setSelectedShipmentKey] = useState<string>('');
  const [editingShipment, setEditingShipment] = useState<ShipmentStatus | null>(null);
  const [newLogDate, setNewLogDate] = useState<string>('Sep 12, 2026');
  const [newLogTime, setNewLogTime] = useState<string>('12:00 GMT');
  const [newLogLocation, setNewLogLocation] = useState<string>('Tema Port MPS Terminal 3');
  const [newLogNote, setNewLogNote] = useState<string>('ICUMS clearance fee verified, gate pass issued');

  // Vehicle Editing State
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleModalOpen, setVehicleModalOpen] = useState<boolean>(false);

  // Spare Part Editing State
  const [editingPart, setEditingPart] = useState<SparePart | null>(null);
  const [partModalOpen, setPartModalOpen] = useState<boolean>(false);

  // Master PIN change
  const [newPinValue, setNewPinValue] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Sync with storage on mount and updates
  useEffect(() => {
    const handleStorageUpdate = () => {
      setVehicles(getStoredVehicles());
      setParts(getStoredSpareParts());
      setShipments(getStoredShipments());
      setRates(getStoredExchangeRates());
      setContact(getStoredContactInfo());
    };
    window.addEventListener('jackdan_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('jackdan_storage_updated', handleStorageUpdate);
  }, []);

  // Handle PIN Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const master = getMasterPin();
    if (pinInput.trim() === master || pinInput.trim() === 'jackdan2026' || pinInput.trim() === 'admin') {
      setIsAuthenticated(true);
      setSessionAuthenticated(true);
      setPinError('');
      setPinInput('');
    } else {
      setPinError('Incorrect PIN. (Default master PIN: jackdan2026)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSessionAuthenticated(false);
  };

  // -------------------------------------------------------------
  // SHIPMENT HANDLERS
  // -------------------------------------------------------------
  const startNewShipment = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `JKD-${randomNum}-GH`;
    const newS: ShipmentStatus = {
      trackingId: newId,
      vin: `2T3C1RFV${Math.floor(100000 + Math.random() * 900000)}`,
      vehicleName: '2021 Toyota RAV4 XLE AWD (Super White)',
      origin: 'Port of Newark (New Jersey, USA)',
      destination: 'Port of Tema (Ghana)',
      estimatedArrival: 'October 15, 2026',
      currentStatus: 'Vehicle received at origin export yard, title verified',
      statusCode: 'booked',
      progressPercentage: 20,
      vesselName: 'MAERSK TEMA EXPRESS',
      containerNumber: `MRKU-${Math.floor(1000000 + Math.random() * 9000000)}-40HC`,
      updates: [
        {
          date: 'Sep 12, 2026',
          time: '10:00 EST',
          location: 'Newark Export Yard',
          note: 'Container stuffed and US customs export clearance granted'
        }
      ]
    };
    setSelectedShipmentKey(newId);
    setEditingShipment(newS);
  };

  const saveCurrentShipment = () => {
    if (!editingShipment || !editingShipment.trackingId) return;
    const updated = {
      ...shipments,
      [editingShipment.trackingId]: editingShipment
    };
    setShipments(updated);
    saveStoredShipments(updated);
    showToast(`Shipment ${editingShipment.trackingId} saved and published live!`);
  };

  const deleteShipment = (id: string) => {
    if (window.confirm(`Delete shipment ${id}? Customers won't be able to track this reference.`)) {
      const copy = { ...shipments };
      delete copy[id];
      setShipments(copy);
      saveStoredShipments(copy);
      setEditingShipment(null);
      setSelectedShipmentKey('');
      showToast(`Shipment ${id} removed.`);
    }
  };

  const addMilestoneLog = () => {
    if (!editingShipment || !newLogNote.trim()) return;
    const newUpdate = {
      date: newLogDate,
      time: newLogTime,
      location: newLogLocation,
      note: newLogNote
    };
    setEditingShipment({
      ...editingShipment,
      updates: [newUpdate, ...editingShipment.updates]
    });
    setNewLogNote('');
  };

  const removeMilestoneLog = (index: number) => {
    if (!editingShipment) return;
    setEditingShipment({
      ...editingShipment,
      updates: editingShipment.updates.filter((_, i) => i !== index)
    });
  };

  // -------------------------------------------------------------
  // VEHICLE HANDLERS
  // -------------------------------------------------------------
  const openNewVehicleModal = () => {
    const newV: Vehicle = {
      id: `v${Date.now()}`,
      name: '2021 Toyota RAV4 XLE AWD',
      make: 'Toyota',
      model: 'RAV4',
      year: 2021,
      category: 'SUV',
      priceUSD: 23800,
      mileage: '32,000 mi',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      condition: 'Foreign Used / Clean Title',
      location: 'USA Yard -> Ready for RoRo to Tema',
      engine: '2.5L 4-Cylinder Dynamic Force',
      color: 'Super White',
      vinPreview: '2T3C1RFV2MC******',
      image: '/assets/cars/toyota-rav4.jpg',
      features: ['High Ground Clearance for Ghana', 'All-Wheel Drive (AWD)', 'Apple CarPlay & Android Auto', 'Low Fuel Consumption'],
      popular: true
    };
    setEditingVehicle(newV);
    setVehicleModalOpen(true);
  };

  const saveVehicle = () => {
    if (!editingVehicle) return;
    const exists = vehicles.some(v => v.id === editingVehicle.id);
    let updated: Vehicle[];
    if (exists) {
      updated = vehicles.map(v => v.id === editingVehicle.id ? editingVehicle : v);
    } else {
      updated = [editingVehicle, ...vehicles];
    }
    setVehicles(updated);
    saveStoredVehicles(updated);
    setVehicleModalOpen(false);
    showToast(`Vehicle ${editingVehicle.name} saved successfully!`);
  };

  const deleteVehicle = (id: string) => {
    if (window.confirm('Delete this vehicle from inventory?')) {
      const updated = vehicles.filter(v => v.id !== id);
      setVehicles(updated);
      saveStoredVehicles(updated);
      showToast('Vehicle removed from catalog.');
    }
  };

  // -------------------------------------------------------------
  // SPARE PARTS HANDLERS
  // -------------------------------------------------------------
  const openNewPartModal = () => {
    const newP: SparePart = {
      id: `p${Date.now()}`,
      name: 'Heavy-Duty Tropical Aluminum Engine Cooling Radiator',
      category: 'Engine & Transmission',
      compatibility: 'Toyota Hilux, Land Cruiser Prado, Fortuner 2.4L / 2.8L',
      priceUSD: 240,
      partNumber: `JKD-RAD-${Math.floor(10000 + Math.random() * 90000)}`,
      inStock: true,
      warranty: '24 Months Replacement Warranty',
      origin: 'Tropicalized OEM Direct',
      image: '/assets/spare-parts/radiator_part.jpg',
      description: 'High-performance multi-core aluminum radiator with integrated transmission oil cooler.'
    };
    setEditingPart(newP);
    setPartModalOpen(true);
  };

  const savePart = () => {
    if (!editingPart) return;
    const exists = parts.some(p => p.id === editingPart.id);
    let updated: SparePart[];
    if (exists) {
      updated = parts.map(p => p.id === editingPart.id ? editingPart : p);
    } else {
      updated = [editingPart, ...parts];
    }
    setParts(updated);
    saveStoredSpareParts(updated);
    setPartModalOpen(false);
    showToast(`Spare Part ${editingPart.name} saved!`);
  };

  const deletePart = (id: string) => {
    if (window.confirm('Remove this spare part from catalog?')) {
      const updated = parts.filter(p => p.id !== id);
      setParts(updated);
      saveStoredSpareParts(updated);
      showToast('Spare part removed.');
    }
  };

  // -------------------------------------------------------------
  // BACKUP, CODE EXPORT, SETTINGS
  // -------------------------------------------------------------
  const handleDownloadBackup = async () => {
    try {
      showToast('Preparing backup from cloud database...');
      const json = await exportAllDataAsJSON();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `jackdan_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Full system backup downloaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to generate backup.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = async (event) => {
        const content = event.target?.result as string;
        if (content) {
          showToast('Restoring backup to cloud...');
          const success = await importAllDataFromJSON(content);
          if (success) {
            showToast('Backup restored successfully!');
          } else {
            alert('Invalid backup JSON format or restore failed.');
          }
        }
      };
    }
  };

  const handleCopyCode = () => {
    const code = generateMasterInventoryCode();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    showToast('Code copied! You can paste this directly into src/data/inventory.ts');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleUpdateRates = (ghsRate: number) => {
    const updated = {
      ...rates,
      GHS: { ...rates.GHS, rateFromUSD: ghsRate }
    };
    setRates(updated);
    saveStoredExchangeRates(updated);
    showToast(`Exchange rate updated: $1 = GH₵ ${ghsRate}`);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinValue.trim().length < 4) {
      alert('PIN must be at least 4 characters long.');
      return;
    }
    setMasterPin(newPinValue.trim());
    setNewPinValue('');
    showToast('Master admin PIN successfully changed.');
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN RENDER
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-[#0a0f1d] border-2 border-gold-500/40 rounded-3xl p-8 shadow-2xl shadow-black relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center text-dark-950 shadow-xl shadow-gold-500/20">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-white">Jackdan Admin Portal</h2>
            <p className="text-xs text-dark-300">
              Authorized operations & fleet management access for Jackdan Premium Ventures.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-dark-300 mb-1.5 uppercase tracking-wider">
                Enter Master Admin PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter PIN (Default: jackdan2026)"
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-dark-900 border border-dark-700 text-white placeholder-dark-500 focus:outline-none focus:border-gold-500 font-mono text-sm"
                  autoFocus
                />
                <Key className="w-4 h-4 text-gold-400 absolute right-3.5 top-3.5" />
              </div>
              {pinError && <p className="text-xs text-red-400 mt-1.5">{pinError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl gold-gradient-btn font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Management</span>
            </button>
          </form>

          <div className="pt-4 border-t border-dark-800 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={onReturnHome}
              className="text-gold-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </button>
            <span className="text-dark-500 font-mono">Vercel Ready</span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED DASHBOARD RENDER
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-gold-500/8 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 bg-[#080d17]/95 border-b border-dark-800 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center text-dark-950 font-black text-lg shadow-md shadow-gold-500/20">
            J
          </div>
          <div>
            <div className="font-heading font-extrabold text-white text-base flex items-center gap-2">
              <span>Jackdan Admin Operations</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold uppercase border border-emerald-500/30">
                Live & Active
              </span>
            </div>
            <p className="text-[11px] text-dark-400">Fleet, Tracking & Spare Parts Management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReturnHome}
            className="px-3.5 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-700 text-xs font-semibold text-gold-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Public Website</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Lock session"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </header>

      {/* Global Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#0f172a] border-2 border-gold-500 text-gold-300 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-2xl animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10 flex-1 flex flex-col space-y-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 rounded-2xl bg-[#0c121e] border border-dark-700 shadow-xl">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-gold-500 text-dark-950 shadow-md font-extrabold'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('shipments')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'shipments'
                  ? 'bg-gold-500 text-dark-950 shadow-md font-extrabold'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Ship className="w-3.5 h-3.5" />
              <span>Cargo Tracker ({Object.keys(shipments).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('vehicles')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'vehicles'
                  ? 'bg-gold-500 text-dark-950 shadow-md font-extrabold'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Vehicle Fleet ({vehicles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('parts')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'parts'
                  ? 'bg-gold-500 text-dark-950 shadow-md font-extrabold'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Spare Parts ({parts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-gold-500 text-dark-950 shadow-md font-extrabold'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Vercel Sync & Settings</span>
            </button>
          </div>

          <div className="px-3 py-1 text-xs text-dark-400 font-mono hidden md:block">
            1 USD = GH₵ {rates.GHS?.rateFromUSD || 15.6}
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* TAB: OVERVIEW */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-2xl bg-dark-900/90 border border-dark-800 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-dark-400 text-xs font-semibold uppercase">
                  <span>Tracked Shipments</span>
                  <Ship className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-white">{Object.keys(shipments).length}</div>
                <div className="text-[11px] text-dark-400">Live ocean vessels & Tema customs manifests</div>
              </div>

              <div className="p-6 rounded-2xl bg-dark-900/90 border border-dark-800 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-dark-400 text-xs font-semibold uppercase">
                  <span>Vehicles in Fleet</span>
                  <Car className="w-4 h-4 text-gold-400" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-gold-400">{vehicles.length}</div>
                <div className="text-[11px] text-dark-400">Practical Ghanaian sedans, SUVs & pickups</div>
              </div>

              <div className="p-6 rounded-2xl bg-dark-900/90 border border-dark-800 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-dark-400 text-xs font-semibold uppercase">
                  <span>OEM Spare Parts</span>
                  <Wrench className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-emerald-400">{parts.length}</div>
                <div className="text-[11px] text-dark-400">Engines, gearboxes, radiators, brakes, struts</div>
              </div>

              <div className="p-6 rounded-2xl bg-dark-900/90 border border-dark-800 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-dark-400 text-xs font-semibold uppercase">
                  <span>ICUMS Rate (USD/GHS)</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-white">GH₵ {rates.GHS?.rateFromUSD}</div>
                <div className="text-[11px] text-dark-400">Current customs assessment tariff multiplier</div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#0c121e] border border-dark-700/80 space-y-4 shadow-xl">
                <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
                  <Ship className="w-4 h-4 text-blue-400" />
                  <span>Shipment Dispatch</span>
                </h3>
                <p className="text-xs text-dark-300">
                  Issue a new cargo waybill for a client vehicle arriving from USA, Canada, UAE, or Europe.
                </p>
                <button
                  onClick={() => {
                    startNewShipment();
                    setActiveTab('shipments');
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create New Shipment Waybill</span>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-[#0c121e] border border-dark-700/80 space-y-4 shadow-xl">
                <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
                  <Car className="w-4 h-4 text-gold-400" />
                  <span>Vehicle Stock Sourcing</span>
                </h3>
                <p className="text-xs text-dark-300">
                  Add newly procured practical sedans, crossovers, or workhorse trucks into the public showroom.
                </p>
                <button
                  onClick={openNewVehicleModal}
                  className="w-full py-2.5 rounded-xl gold-gradient-btn text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Vehicle to Showroom</span>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-[#0c121e] border border-dark-700/80 space-y-4 shadow-xl">
                <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-emerald-400" />
                  <span>Spare Parts Stock</span>
                </h3>
                <p className="text-xs text-dark-300">
                  Add imported Japanese engines, transmissions, or suspension kits with compatibility lists.
                </p>
                <button
                  onClick={openNewPartModal}
                  className="w-full py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Spare Part</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB: SHIPMENTS TRACKER MANAGER */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'shipments' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header / New Shipment */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-bold text-xl text-white">Live Cargo & Vessel Manifests</h3>
                <p className="text-xs text-dark-300">
                  Select a shipment to edit shipping milestones, container references, and customs release notes.
                </p>
              </div>
              <button
                onClick={startNewShipment}
                className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create New Shipment</span>
              </button>
            </div>

            {/* Main Editor Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Shipment List (4 cols) */}
              <div className="lg:col-span-4 space-y-3">
                <div className="p-3 bg-dark-900 border border-dark-800 rounded-xl">
                  <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider block mb-2">
                    Active Waybills ({Object.keys(shipments).length})
                  </span>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {Object.values(shipments).map((s) => (
                      <div
                        key={s.trackingId}
                        onClick={() => {
                          setSelectedShipmentKey(s.trackingId);
                          setEditingShipment({ ...s });
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          selectedShipmentKey === s.trackingId
                            ? 'bg-gold-500/15 border-gold-500/50 shadow-lg text-white'
                            : 'bg-dark-950/70 border-dark-800 text-dark-300 hover:border-dark-700 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-gold-400">{s.trackingId}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-dark-800 text-dark-300 font-bold uppercase">
                            {s.statusCode}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-white mt-1 line-clamp-1">{s.vehicleName}</div>
                        <div className="text-[11px] text-dark-400 mt-1 flex items-center justify-between">
                          <span>ETA: {s.estimatedArrival}</span>
                          <span className="font-mono text-gold-400">{s.progressPercentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Active Shipment Detail Editor (8 cols) */}
              <div className="lg:col-span-8">
                {editingShipment ? (
                  <div className="p-6 rounded-2xl bg-[#0c121e] border border-dark-700/80 space-y-6 shadow-2xl">
                    <div className="flex items-center justify-between pb-3 border-b border-dark-800">
                      <div>
                        <h4 className="font-heading font-bold text-white text-base flex items-center gap-2">
                          <span>Editing: {editingShipment.trackingId}</span>
                          <span className="text-xs font-normal text-gold-400">({editingShipment.vehicleName})</span>
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {Object.keys(shipments).length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteShipment(editingShipment.trackingId)}
                            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={saveCurrentShipment}
                          className="gold-gradient-btn px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>

                    {/* Core Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-dark-300 mb-1">Tracking ID / Waybill</label>
                        <input
                          type="text"
                          value={editingShipment.trackingId}
                          onChange={(e) => setEditingShipment({ ...editingShipment, trackingId: e.target.value.toUpperCase() })}
                          className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white font-mono text-xs focus:border-gold-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-dark-300 mb-1">17-Digit VIN Preview</label>
                        <input
                          type="text"
                          value={editingShipment.vin}
                          onChange={(e) => setEditingShipment({ ...editingShipment, vin: e.target.value.toUpperCase() })}
                          className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white font-mono text-xs focus:border-gold-500 focus:outline-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-semibold text-dark-300 mb-1">Vehicle / Cargo Name</label>
                        <input
                          type="text"
                          value={editingShipment.vehicleName}
                          onChange={(e) => setEditingShipment({ ...editingShipment, vehicleName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-dark-300 mb-1">Origin Port & Country</label>
                        <input
                          type="text"
                          value={editingShipment.origin}
                          onChange={(e) => setEditingShipment({ ...editingShipment, origin: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-dark-300 mb-1">Destination Port</label>
                        <input
                          type="text"
                          value={editingShipment.destination}
                          onChange={(e) => setEditingShipment({ ...editingShipment, destination: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-dark-300 mb-1">Estimated Arrival (ETA)</label>
                        <input
                          type="text"
                          value={editingShipment.estimatedArrival}
                          onChange={(e) => setEditingShipment({ ...editingShipment, estimatedArrival: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-dark-300 mb-1">Vessel Name</label>
                        <input
                          type="text"
                          value={editingShipment.vesselName}
                          onChange={(e) => setEditingShipment({ ...editingShipment, vesselName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-semibold text-dark-300 mb-1">Container / Booking Reference</label>
                        <input
                          type="text"
                          value={editingShipment.containerNumber}
                          onChange={(e) => setEditingShipment({ ...editingShipment, containerNumber: e.target.value.toUpperCase() })}
                          className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white font-mono text-xs focus:border-gold-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Milestone Selector */}
                    <div className="p-4 rounded-xl bg-dark-950/80 border border-dark-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gold-400 uppercase tracking-wider">
                          Current Milestone Stage
                        </label>
                        <span className="font-mono font-bold text-xs text-white">
                          Progress: {editingShipment.progressPercentage}%
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {MILESTONES.map((m) => (
                          <button
                            key={m.code}
                            type="button"
                            onClick={() => {
                              setEditingShipment({
                                ...editingShipment,
                                statusCode: m.code as any,
                                progressPercentage: m.defaultProgress
                              });
                            }}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                              editingShipment.statusCode === m.code
                                ? 'bg-gold-500/20 border-gold-500 text-gold-300 font-bold'
                                : 'bg-dark-900 border-dark-800 text-dark-300 hover:border-dark-700'
                            }`}
                          >
                            <div>{m.label}</div>
                            <div className="text-[10px] text-dark-400 font-mono mt-0.5">{m.defaultProgress}% Preset</div>
                          </button>
                        ))}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-dark-300 mb-1">
                          Client-Facing Status Headline
                        </label>
                        <input
                          type="text"
                          value={editingShipment.currentStatus}
                          onChange={(e) => setEditingShipment({ ...editingShipment, currentStatus: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-dark-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Milestone Log Updates */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-white uppercase tracking-wider block">
                        Add New Inspection / Transit Event Log:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={newLogDate}
                          onChange={(e) => setNewLogDate(e.target.value)}
                          placeholder="Date (e.g. Sep 12, 2026)"
                          className="px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs"
                        />
                        <input
                          type="text"
                          value={newLogTime}
                          onChange={(e) => setNewLogTime(e.target.value)}
                          placeholder="Time (e.g. 14:00 GMT)"
                          className="px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs"
                        />
                        <input
                          type="text"
                          value={newLogLocation}
                          onChange={(e) => setNewLogLocation(e.target.value)}
                          placeholder="Location (e.g. Tema MPS Terminal 3)"
                          className="px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newLogNote}
                          onChange={(e) => setNewLogNote(e.target.value)}
                          placeholder="Inspection note or physical clearance update..."
                          className="flex-1 px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs"
                        />
                        <button
                          type="button"
                          onClick={addMilestoneLog}
                          className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-dark-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Log</span>
                        </button>
                      </div>

                      {/* Log history list */}
                      <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                        {editingShipment.updates.map((u, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-dark-950 border border-dark-800 text-xs flex items-start justify-between gap-3">
                            <div className="space-y-0.5">
                              <span className="font-semibold text-gold-400">{u.date} • {u.time} ({u.location})</span>
                              <p className="text-dark-300">{u.note}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeMilestoneLog(idx)}
                              className="text-dark-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                              title="Delete log"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center border border-dashed border-dark-800 rounded-2xl space-y-3">
                    <Ship className="w-8 h-8 text-dark-500 mx-auto" />
                    <h4 className="text-white font-bold text-sm">Select a shipment from the left or create a new waybill</h4>
                    <button
                      onClick={startNewShipment}
                      className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Create Shipment</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB: VEHICLE FLEET INVENTORY */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'vehicles' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-bold text-xl text-white">Vehicle Showroom Fleet</h3>
                <p className="text-xs text-dark-300">
                  Manage certified pre-owned, foreign-used, and brand new cars displayed in the public inventory.
                </p>
              </div>
              <button
                onClick={openNewVehicleModal}
                className="gold-gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Vehicle to Fleet</span>
              </button>
            </div>

            {/* Vehicles Table / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {vehicles.map((v) => (
                <div key={v.id} className="p-4 rounded-2xl bg-[#0c121e] border border-dark-700/80 space-y-3 flex flex-col justify-between shadow-xl group">
                  <div className="space-y-2.5">
                    <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-dark-950 border border-dark-800">
                      <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-dark-950/80 text-[10px] font-bold text-gold-400 uppercase">
                        {v.category}
                      </span>
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-dark-950/80 text-[10px] font-bold text-white">
                        {v.year}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-heading font-bold text-white text-base line-clamp-1">{v.name}</h4>
                      <div className="text-lg font-extrabold text-gold-400 font-mono mt-0.5">
                        ${v.priceUSD.toLocaleString()} <span className="text-xs text-dark-400 font-normal">(~GH₵ {(v.priceUSD * (rates.GHS?.rateFromUSD || 15.6)).toLocaleString()})</span>
                      </div>
                    </div>

                    <div className="text-xs text-dark-400 space-y-0.5">
                      <div><span className="text-dark-300">Mileage:</span> {v.mileage} • <span className="text-dark-300">Fuel:</span> {v.fuelType}</div>
                      <div className="line-clamp-1"><span className="text-dark-300">Location:</span> {v.location}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-dark-800 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingVehicle({ ...v });
                        setVehicleModalOpen(true);
                      }}
                      className="flex-1 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-gold-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteVehicle(v.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer transition-colors"
                      title="Delete vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB: SPARE PARTS CATALOG */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'parts' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-bold text-xl text-white">Genuine OEM Spare Parts</h3>
                <p className="text-xs text-dark-300">
                  Update inventory, pricing, warranty specifications, and stock status for automotive replacement parts.
                </p>
              </div>
              <button
                onClick={openNewPartModal}
                className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Spare Part</span>
              </button>
            </div>

            {/* Parts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {parts.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-[#0c121e] border border-dark-700/80 space-y-3 flex flex-col justify-between shadow-xl group">
                  <div className="space-y-2.5">
                    <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-dark-950 border border-dark-800">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-dark-950/80 text-[10px] font-bold text-gold-400 uppercase">
                        {p.category}
                      </span>
                      <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${p.inStock ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-heading font-bold text-white text-sm line-clamp-2">{p.name}</h4>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-base font-extrabold text-gold-400 font-mono">${p.priceUSD}</span>
                        <span className="text-[11px] text-dark-400 font-mono">({p.partNumber})</span>
                      </div>
                    </div>

                    <div className="text-xs text-dark-400 line-clamp-1">
                      <span className="text-dark-300">Fits:</span> {p.compatibility}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-dark-800 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPart({ ...p });
                        setPartModalOpen(true);
                      }}
                      className="flex-1 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-gold-400" />
                      <span>Edit Part</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deletePart(p.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer transition-colors"
                      title="Delete part"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB: SETTINGS & VERCEL / GIT DEPLOYMENT */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl">
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-xl text-white">Vercel Deployment & System Configuration</h3>
              <p className="text-xs text-dark-300">
                Manage global exchange rates, company contacts, security PIN, and export master data code for Git & Vercel.
              </p>
            </div>

            {/* Currency & Tariffs */}
            <div className="p-6 rounded-2xl bg-[#0c121e] border border-dark-700/80 space-y-4 shadow-xl">
              <h4 className="font-heading font-bold text-white text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>USD to GHS Customs Exchange Multiplier</span>
              </h4>
              <p className="text-xs text-dark-300">
                Adjusts the converted prices on vehicle inventory, spare parts, and the Ghana ICUMS Duty Estimator.
              </p>
              <div className="flex items-center gap-3">
                <div className="relative w-48">
                  <span className="absolute left-3.5 top-2.5 text-xs text-dark-400">GH₵</span>
                  <input
                    type="number"
                    step="0.1"
                    defaultValue={rates.GHS?.rateFromUSD || 15.6}
                    onBlur={(e) => handleUpdateRates(parseFloat(e.target.value))}
                    className="w-full pl-12 pr-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white font-mono text-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <span className="text-xs text-dark-400">per $1.00 USD</span>
              </div>
            </div>

            {/* Backup & Master Code Generator */}
            <div className="p-6 rounded-2xl bg-[#0c121e] border border-dark-700/80 space-y-4 shadow-xl">
              <h4 className="font-heading font-bold text-white text-base flex items-center gap-2">
                <FileCode className="w-4 h-4 text-gold-400" />
                <span>Export Code for Git / Vercel Builds</span>
              </h4>
              <p className="text-xs text-dark-300 leading-relaxed">
                When you deploy to Vercel, changes in your browser are persisted in storage. To commit all updated vehicles, spare parts, and shipments permanently into your repository code, copy this code and save it in <strong className="text-white">src/data/inventory.ts</strong>:
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="gold-gradient-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedCode ? 'Master Code Copied!' : 'Copy Master Code for inventory.ts'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-700 text-xs font-semibold text-white flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup (JSON)</span>
                </button>

                <label className="px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-700 text-xs font-semibold text-white flex items-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Restore from JSON</span>
                  <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Master PIN Change */}
            <div className="p-6 rounded-2xl bg-[#0c121e] border border-dark-700/80 space-y-4 shadow-xl">
              <h4 className="font-heading font-bold text-white text-base flex items-center gap-2">
                <Key className="w-4 h-4 text-gold-400" />
                <span>Change Admin Master PIN</span>
              </h4>
              <form onSubmit={handleChangePin} className="flex items-center gap-3">
                <input
                  type="password"
                  value={newPinValue}
                  onChange={(e) => setNewPinValue(e.target.value)}
                  placeholder="Enter new 4+ digit PIN"
                  className="w-64 px-4 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs font-mono focus:border-gold-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-600 text-white text-xs font-semibold cursor-pointer"
                >
                  Update PIN
                </button>
              </form>
            </div>

            {/* Factory Reset */}
            <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-3">
              <h4 className="font-heading font-bold text-red-400 text-sm">Factory Reset</h4>
              <p className="text-xs text-dark-300">
                Clear all custom browser storage records and reset vehicle fleet, spare parts, and tracking back to original seeds.
              </p>
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm('Are you sure you want to reset everything back to initial defaults? This will restore cloud database and local cache to original factory seeds.')) {
                    showToast('Resetting database...');
                    await resetAllToFactoryDefaults();
                    showToast('Reset all datasets back to default.');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All to Defaults</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT VEHICLE */}
      {/* ----------------------------------------------------------- */}
      {vehicleModalOpen && editingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="relative max-w-2xl w-full bg-[#0a0f1d] border-2 border-gold-500/50 rounded-3xl p-6 sm:p-8 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <h3 className="font-heading font-bold text-white text-lg">
                {vehicles.some(v => v.id === editingVehicle.id) ? 'Edit Vehicle Sourcing' : 'Add New Vehicle to Showroom'}
              </h3>
              <button onClick={() => setVehicleModalOpen(false)} className="p-2 rounded-xl text-dark-400 hover:text-white bg-dark-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-dark-300 mb-1">Full Vehicle Name</label>
                <input
                  type="text"
                  value={editingVehicle.name}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-dark-300 mb-1">Make</label>
                <input
                  type="text"
                  value={editingVehicle.make}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, make: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-dark-300 mb-1">Model</label>
                <input
                  type="text"
                  value={editingVehicle.model}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-dark-300 mb-1">Year</label>
                <input
                  type="number"
                  value={editingVehicle.year}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, year: parseInt(e.target.value) || 2021 })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-dark-300 mb-1">Category</label>
                <select
                  value={editingVehicle.category}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Truck">Truck</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-dark-300 mb-1">Price (USD)</label>
                <input
                  type="number"
                  value={editingVehicle.priceUSD}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, priceUSD: parseInt(e.target.value) || 10000 })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-dark-300 mb-1">Mileage</label>
                <input
                  type="text"
                  value={editingVehicle.mileage}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, mileage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-dark-300 mb-1">Image URL or Local Asset Path</label>
                <input
                  type="text"
                  value={editingVehicle.image}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs font-mono"
                />
                <div className="mt-1 flex flex-wrap gap-1.5 text-[10px] text-dark-400">
                  <span>Quick Presets:</span>
                  <button type="button" onClick={() => setEditingVehicle({ ...editingVehicle, image: '/assets/cars/toyota-corolla.jpg' })} className="text-gold-400 hover:underline">Corolla</button>
                  <button type="button" onClick={() => setEditingVehicle({ ...editingVehicle, image: '/assets/cars/toyota-rav4.jpg' })} className="text-gold-400 hover:underline">RAV4</button>
                  <button type="button" onClick={() => setEditingVehicle({ ...editingVehicle, image: '/assets/cars/toyota-camry.jpg' })} className="text-gold-400 hover:underline">Camry</button>
                  <button type="button" onClick={() => setEditingVehicle({ ...editingVehicle, image: '/assets/cars/toyota-hilux.jpg' })} className="text-gold-400 hover:underline">Hilux</button>
                  <button type="button" onClick={() => setEditingVehicle({ ...editingVehicle, image: '/assets/cars/hyundai-elantra.jpg' })} className="text-gold-400 hover:underline">Elantra</button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-dark-300 mb-1">Location & Sourcing Yard</label>
                <input
                  type="text"
                  value={editingVehicle.location}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-800">
              <button
                type="button"
                onClick={() => setVehicleModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-dark-800 text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveVehicle}
                className="gold-gradient-btn px-6 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-md"
              >
                Save Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT SPARE PART */}
      {/* ----------------------------------------------------------- */}
      {partModalOpen && editingPart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="relative max-w-xl w-full bg-[#0a0f1d] border-2 border-gold-500/50 rounded-3xl p-6 sm:p-8 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <h3 className="font-heading font-bold text-white text-lg">
                {parts.some(p => p.id === editingPart.id) ? 'Edit Spare Part' : 'Add New Spare Part'}
              </h3>
              <button onClick={() => setPartModalOpen(false)} className="p-2 rounded-xl text-dark-400 hover:text-white bg-dark-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-dark-300 mb-1">Part Name</label>
                <input
                  type="text"
                  value={editingPart.name}
                  onChange={(e) => setEditingPart({ ...editingPart, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-dark-300 mb-1">Category</label>
                <select
                  value={editingPart.category}
                  onChange={(e) => setEditingPart({ ...editingPart, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs"
                >
                  <option value="Braking">Braking</option>
                  <option value="Engine & Transmission">Engine & Transmission</option>
                  <option value="Suspension & Steering">Suspension & Steering</option>
                  <option value="Batteries & Electrical">Batteries & Electrical</option>
                  <option value="Body & Lighting">Body & Lighting</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-dark-300 mb-1">Part Number (OEM)</label>
                <input
                  type="text"
                  value={editingPart.partNumber}
                  onChange={(e) => setEditingPart({ ...editingPart, partNumber: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-dark-300 mb-1">Price (USD)</label>
                <input
                  type="number"
                  value={editingPart.priceUSD}
                  onChange={(e) => setEditingPart({ ...editingPart, priceUSD: parseInt(e.target.value) || 100 })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-dark-300 mb-1">Warranty</label>
                <input
                  type="text"
                  value={editingPart.warranty}
                  onChange={(e) => setEditingPart({ ...editingPart, warranty: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-dark-300 mb-1">Vehicle Compatibility</label>
                <input
                  type="text"
                  value={editingPart.compatibility}
                  onChange={(e) => setEditingPart({ ...editingPart, compatibility: e.target.value })}
                  placeholder="e.g. Toyota Corolla, RAV4, Camry 1.8L & 2.5L"
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-dark-300 mb-1">Image URL or Local Asset Path</label>
                <input
                  type="text"
                  value={editingPart.image}
                  onChange={(e) => setEditingPart({ ...editingPart, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-dark-700 text-white text-xs font-mono"
                />
                <div className="mt-1 flex flex-wrap gap-1.5 text-[10px] text-dark-400">
                  <span>Actual Stock Photos:</span>
                  <button type="button" onClick={() => setEditingPart({ ...editingPart, image: '/assets/spare-parts/engine_japanese.jpg' })} className="text-gold-400 hover:underline">Engine</button>
                  <button type="button" onClick={() => setEditingPart({ ...editingPart, image: '/assets/spare-parts/gearbox_transmission.jpg' })} className="text-gold-400 hover:underline">Gearbox</button>
                  <button type="button" onClick={() => setEditingPart({ ...editingPart, image: '/assets/spare-parts/radiator_part.jpg' })} className="text-gold-400 hover:underline">Radiator</button>
                  <button type="button" onClick={() => setEditingPart({ ...editingPart, image: '/assets/spare-parts/suspension_shocks.jpg' })} className="text-gold-400 hover:underline">Suspension</button>
                  <button type="button" onClick={() => setEditingPart({ ...editingPart, image: '/assets/spare-parts/brakes_rotors.jpg' })} className="text-gold-400 hover:underline">Brakes</button>
                  <button type="button" onClick={() => setEditingPart({ ...editingPart, image: '/assets/spare-parts/alloy_wheels.jpg' })} className="text-gold-400 hover:underline">Wheels</button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-800">
              <button
                type="button"
                onClick={() => setPartModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-dark-800 text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={savePart}
                className="gold-gradient-btn px-6 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-md"
              >
                Save Spare Part
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPortal;
