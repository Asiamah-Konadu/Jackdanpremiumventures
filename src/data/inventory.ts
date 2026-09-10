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

export const VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    name: '2024 Mercedes-Benz GLE 450 4MATIC AMG Line',
    make: 'Mercedes-Benz',
    model: 'GLE 450',
    year: 2024,
    category: 'Luxury',
    priceUSD: 88500,
    mileage: '4,200 mi',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    condition: 'Certified Pre-Owned',
    location: 'USA Port -> En Route to Tema',
    engine: '3.0L Inline-6 Turbo with EQ Boost (375 hp)',
    color: 'Obsidian Black Metallic',
    vinPreview: '4JGFF5KE8RB******',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80',
    features: ['Panoramic Sunroof', 'Burmester 3D Audio', 'MBUX Augmented Reality', 'Heated & Cooled Leather', 'Airmatic Suspension'],
    popular: true
  },
  {
    id: 'v2',
    name: '2023 Toyota Land Cruiser Prado TX-L 4x4',
    make: 'Toyota',
    model: 'Land Cruiser Prado',
    year: 2023,
    category: 'SUV',
    priceUSD: 64900,
    mileage: '12,500 mi',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    condition: 'Foreign Used / Clean Title',
    location: 'Dubai Showroom -> Ready to Ship',
    engine: '2.8L D-4D Turbo Diesel (201 hp)',
    color: 'Pearl White Crystal Shine',
    vinPreview: 'JTEBU3FJ9PK******',
    features: ['7-Seater Leather', 'Cooler Box', 'Multi-Terrain Select', 'Rear Climate Control', 'Push-to-Start'],
    popular: true
  },
  {
    id: 'v3',
    name: '2024 Toyota Camry XSE V6',
    make: 'Toyota',
    model: 'Camry',
    year: 2024,
    category: 'Sedan',
    priceUSD: 36800,
    mileage: '6,100 mi',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    condition: 'Foreign Used / Clean Title',
    location: 'USA Yard (Ready for RoRo/Container)',
    engine: '3.5L V6 24V DOHC (301 hp)',
    color: 'Wind Chill Pearl / Black Roof',
    vinPreview: '4T1BZ1HK4RU******',
    features: ['Cockpit Red Leather', 'JBL 9-Speaker Audio', 'Toyota Safety Sense 2.5+', 'Wireless Apple CarPlay', 'Heated Steering'],
    popular: true
  },
  {
    id: 'v4',
    name: '2023 Honda CR-V Touring Hybrid AWD',
    make: 'Honda',
    model: 'CR-V',
    year: 2023,
    category: 'SUV',
    priceUSD: 34500,
    mileage: '14,000 mi',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    condition: 'Foreign Used / Clean Title',
    location: 'Canada Yard',
    engine: '2.0L 4-Cylinder Atkinson-Cycle + Dual Electric Motors (204 hp)',
    color: 'Meteorite Gray Metallic',
    vinPreview: '7FAR546H8PE******',
    features: ['Hands-Free Power Tailgate', 'Bose Premium Audio', 'Wireless Phone Charger', 'Traffic Jam Assist'],
  },
  {
    id: 'v5',
    name: '2023 Range Rover Sport Dynamic SE P400',
    make: 'Land Rover',
    model: 'Range Rover Sport',
    year: 2023,
    category: 'Luxury',
    priceUSD: 96000,
    mileage: '8,400 mi',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    condition: 'Certified Pre-Owned',
    location: 'UK Port (Export Ready)',
    engine: '3.0L MHEV Turbocharged (395 hp)',
    color: 'Santorini Black with Caraway Leather',
    vinPreview: 'SALWR2V47PA******',
    features: ['Dynamic Air Suspension', 'Pixel LED Headlights', 'Meridian 3D Sound', 'All-Wheel Steering'],
    popular: true
  },
  {
    id: 'v6',
    name: '2024 Hyundai Tucson Limited AWD',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2024,
    category: 'SUV',
    priceUSD: 29800,
    mileage: '3,800 mi',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    condition: 'Foreign Used / Clean Title',
    location: 'USA Port Ready',
    engine: '2.5L Smartstream 4-Cylinder (187 hp)',
    color: 'Amazon Gray',
    vinPreview: 'KM8JB3AA6RU******',
    features: ['Blind-Spot View Monitor', 'Remote Smart Parking Assist', '10.25-inch Touchscreen Navigation'],
  },
  {
    id: 'v7',
    name: '2022 Toyota Hilux Revo Rocco 2.8L 4x4 Double Cab',
    make: 'Toyota',
    model: 'Hilux',
    year: 2022,
    category: 'Truck',
    priceUSD: 42500,
    mileage: '22,000 mi',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    condition: 'Foreign Used / Clean Title',
    location: 'Dubai Stock Yard',
    engine: '2.8L GD Turbo Diesel (204 hp / 500 Nm)',
    color: 'Oxide Bronze Metallic',
    vinPreview: 'MR0KA3CD9N1******',
    features: ['Rocco Styling Package', 'Bedliner with Sports Bar', 'Differential Lock', 'JBL Audio System', 'Pre-Crash Safety'],
  },
  {
    id: 'v8',
    name: '2024 Lexus RX 350 Luxury AWD',
    make: 'Lexus',
    model: 'RX 350',
    year: 2024,
    category: 'Luxury',
    priceUSD: 68500,
    mileage: '5,100 mi',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    condition: 'Certified Pre-Owned',
    location: 'USA Stock',
    engine: '2.4L Turbo Inline-4 (275 hp)',
    color: 'Caviar Black / Semi-Aniline Leather',
    vinPreview: '2T2HAMA37RC******',
    features: ['14-inch Touchscreen Display', 'Mark Levinson 21-Speaker', 'Head-Up Display', 'Panorama Glass Roof'],
  }
];

export const SPARE_PARTS: SparePart[] = [
  {
    id: 'p1',
    name: 'Complete High-Performance Ceramic Brake Disc & Caliper Kit',
    category: 'Braking',
    compatibility: 'Toyota Land Cruiser Prado, V8, Lexus LX570/600',
    priceUSD: 420,
    partNumber: 'JKD-BRK-43512-60190',
    inStock: true,
    warranty: '24 Months Replacement Guarantee',
    origin: 'Germany / OEM Certified',
    image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=600&q=80',
    description: 'Precision-drilled and slotted rotors engineered for heavy-duty tropical braking performance without fading.'
  },
  {
    id: 'p2',
    name: 'OEM Heavy Duty Alternator & Starter Assembly 12V / 150A',
    category: 'Batteries & Electrical',
    compatibility: 'Mercedes-Benz GLE/GLC/C-Class, BMW X5, Audi Q7',
    priceUSD: 360,
    partNumber: 'JKD-ELC-0009068404',
    inStock: true,
    warranty: '18 Months Warranty',
    origin: 'Japan OEM Direct',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
    description: 'High-output alternator and heavy-duty starter motor providing maximum charging stability for multi-screen modern vehicles.'
  },
  {
    id: 'p3',
    name: 'Full Complete Front & Rear Air Suspension Strut Assembly',
    category: 'Suspension & Steering',
    compatibility: 'Range Rover Sport / Vogue, Mercedes GLS/GLE',
    priceUSD: 780,
    partNumber: 'JKD-SUS-LR087092',
    inStock: true,
    warranty: '24 Months Warranty',
    origin: 'OEM Quality Standard',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
    description: 'Heavy duty adaptive air bellow and electronic damping unit for smooth and effortless rough-terrain ride quality.'
  },
  {
    id: 'p4',
    name: 'Complete Engine Timing Chain & Gasket Overhaul Kit',
    category: 'Engine & Transmission',
    compatibility: 'Toyota Camry, RAV4, Highlander 2.5L / 3.5L V6',
    priceUSD: 310,
    partNumber: 'JKD-ENG-13506-31010',
    inStock: true,
    warranty: '12 Months Warranty',
    origin: 'Toyota Genuine Japan',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=600&q=80',
    description: 'Includes tensioners, guides, sprockets, timing chain, and master seal gasket set for factory rebuild accuracy.'
  },
  {
    id: 'p5',
    name: 'High Performance AGM Sealed Maintenance-Free Battery 95Ah / 850CCA',
    category: 'Batteries & Electrical',
    compatibility: 'Universal Luxury & European Vehicles with Start/Stop',
    priceUSD: 240,
    partNumber: 'JKD-BAT-AGM95-001',
    inStock: true,
    warranty: '36 Months Warranty',
    origin: 'Germany Certified',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    description: 'Extreme heat and vibration resistant AGM deep-cycle battery built for tropical and demanding climate power demands.'
  },
  {
    id: 'p6',
    name: 'OEM Factory LED Matrix Headlight Unit Assembly (Left / Right)',
    category: 'Body & Lighting',
    compatibility: 'Toyota Land Cruiser 300 / Prado 2021-2024',
    priceUSD: 650,
    partNumber: 'JKD-BDY-81110-60J90',
    inStock: true,
    warranty: '12 Months Warranty',
    origin: 'OEM Genuine',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
    description: 'Crystal clear adaptive sequential LED matrix projector headlight assembly with DRL daytime running bars.'
  }
];

export const SAMPLE_SHIPMENTS: Record<string, ShipmentStatus> = {
  'JKD-7829-GH': {
    trackingId: 'JKD-7829-GH',
    vin: '4JGFF5KE8RB891044',
    vehicleName: '2024 Mercedes-Benz GLE 450 4MATIC (Obsidian Black)',
    origin: 'Port of Newark (New Jersey, USA)',
    destination: 'Port of Tema (Ghana)',
    estimatedArrival: 'September 22, 2026',
    currentStatus: 'Vessel in Ocean Transit (Mid-Atlantic Heading to Gulf of Guinea)',
    statusCode: 'in_transit',
    progressPercentage: 68,
    vesselName: 'MSC AURELIA V.049E',
    containerNumber: 'MSCU-9910482-40HC',
    updates: [
      { date: 'Sep 08, 2026', time: '14:30 GMT', location: 'Atlantic Ocean', note: 'Vessel on schedule, cruising speed 18.4 knots' },
      { date: 'Sep 02, 2026', time: '09:15 EST', location: 'Port of Newark, USA', note: 'Container loaded onboard vessel & departed berth' },
      { date: 'Aug 28, 2026', time: '16:00 EST', location: 'Newark Export Yard', note: 'US Customs export clearance granted & container sealed' },
      { date: 'Aug 24, 2026', time: '11:20 EST', location: 'New York Warehouse', note: 'Vehicle received, full photographic condition inspection completed' }
    ]
  },
  'JKD-4412-US': {
    trackingId: 'JKD-4412-US',
    vin: 'JTEBU3FJ9PK448102',
    vehicleName: '2023 Toyota Land Cruiser Prado TX-L (Pearl White)',
    origin: 'Jebel Ali Port (Dubai, UAE)',
    destination: 'Port of Tema (Ghana)',
    estimatedArrival: 'September 12, 2026',
    currentStatus: 'Arrived at Port of Tema - Customs Duty Assessment & Clearing in Progress',
    statusCode: 'customs_clearing',
    progressPercentage: 90,
    vesselName: 'MAERSK TEMA EXPRESS',
    containerNumber: 'MRKU-7419023-40HC',
    updates: [
      { date: 'Sep 09, 2026', time: '08:45 GMT', location: 'Tema Port Gate 3', note: 'ICUMS documentation submitted and physical joint inspection scheduled' },
      { date: 'Sep 07, 2026', time: '21:00 GMT', location: 'Tema Container Terminal', note: 'Vessel berthed & container safely discharged to terminal stack' },
      { date: 'Aug 19, 2026', time: '10:00 GST', location: 'Jebel Ali, Dubai', note: 'Vessel departed Jebel Ali Port' }
    ]
  },
  'JKD-9103-DXB': {
    trackingId: 'JKD-9103-DXB',
    vin: '4T1BZ1HK4RU109823',
    vehicleName: '2024 Toyota Camry XSE V6 (Wind Chill Pearl)',
    origin: 'Port of Jacksonville (Florida, USA)',
    destination: 'Port of Tema (Ghana)',
    estimatedArrival: 'September 10, 2026',
    currentStatus: 'Customs Duty Cleared - Vehicle Cleaned and Ready for Client Handover',
    statusCode: 'ready_for_pickup',
    progressPercentage: 100,
    vesselName: 'GRIMALDI GRANDE NIGERIA',
    containerNumber: 'RoRo Unit #RORO-48190',
    updates: [
      { date: 'Sep 09, 2026', time: '11:00 GMT', location: 'Jackdan Logistics Hub, Spintex', note: 'Final valet detailing done, keys and title documentation ready for client' },
      { date: 'Sep 06, 2026', time: '15:30 GMT', location: 'Tema Port', note: 'Customs release order issued and gate pass generated' }
    ]
  }
};

export const EXCHANGE_RATES: Record<string, { symbol: string; rateFromUSD: number; label: string }> = {
  USD: { symbol: '$', rateFromUSD: 1.0, label: 'USD ($)' },
  GHS: { symbol: 'GH₵', rateFromUSD: 15.6, label: 'GHS (GH₵)' },
  EUR: { symbol: '€', rateFromUSD: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rateFromUSD: 0.78, label: 'GBP (£)' },
};

export const CONTACT_INFO = {
  phones: ['+233 594 072 371', '+233 597 840 126'],
  primaryPhoneFormatted: '+233594072371',
  secondaryPhoneFormatted: '+233597840126',
  email: 'jackdanpremiumv@gmail.com',
  address: 'Accra / Tema Logistics Corridor, Greater Accra, Ghana',
  whatsappMessage: 'Hello Jackdan Premium Ventures, I would like to inquire about importing a vehicle / purchasing genuine spare parts.'
};
