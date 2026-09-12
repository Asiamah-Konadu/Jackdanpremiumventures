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
    name: '2020 Toyota Corolla LE',
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    category: 'Sedan',
    priceUSD: 13500,
    mileage: '42,000 mi',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    condition: 'Foreign Used / Clean Title',
    location: 'USA Port -> Tema Bound',
    engine: '1.8L 4-Cylinder DOHC (139 hp) - 38 MPG',
    color: 'Classic Silver Metallic',
    vinPreview: '2T1BURHE8LC******',
    image: '/assets/cars/toyota-corolla.jpg',
    features: ['Ultra High Fuel Economy (38 MPG)', 'Apple CarPlay & Android Auto', 'Toyota Safety Sense 2.0', 'Lowest Maintenance Cost in Ghana', 'Touchscreen Infotainment'],
    popular: true
  },
  {
    id: 'v2',
    name: '2021 Toyota RAV4 XLE AWD',
    make: 'Toyota',
    model: 'RAV4',
    year: 2021,
    category: 'SUV',
    priceUSD: 23800,
    mileage: '31,000 mi',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    condition: 'Foreign Used / Clean Title',
    location: 'Canada Yard -> Ready for RoRo',
    engine: '2.5L Dynamic Force 4-Cylinder (203 hp)',
    color: 'Super White',
    vinPreview: '2T3C1RFV2MC******',
    image: '/assets/cars/toyota-rav4.jpg',
    features: ['High Ground Clearance for Ghanaian Roads', 'All-Wheel Drive (AWD)', 'Blind Spot Monitor', 'Dual-Zone Climate Control', 'Push Button Start'],
    popular: true
  },
  {
    id: 'v3',
    name: '2020 Hyundai Elantra SE',
    make: 'Hyundai',
    model: 'Elantra',
    year: 2020,
    category: 'Sedan',
    priceUSD: 11900,
    mileage: '38,500 mi',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    condition: 'Foreign Used / Clean Title',
    location: 'USA Yard (Ready to Ship)',
    engine: '2.0L 4-Cylinder MPI (147 hp)',
    color: 'Machine Gray Metallic',
    vinPreview: 'KMHD84LF7LU******',
    image: '/assets/cars/hyundai-elantra.jpg',
    features: ['Ideal for Daily Commute & Uber/Yango', 'Rearview Camera with Guidelines', 'Forward Collision Warning', 'Bluetooth & Steering Audio Controls', '35 MPG Highway'],
    popular: true
  },
  {
    id: 'v4',
    name: '2019 Toyota Yaris / Vitz Hatchback',
    make: 'Toyota',
    model: 'Yaris',
    year: 2019,
    category: 'Sedan',
    priceUSD: 8500,
    mileage: '45,000 mi',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    condition: 'Foreign Used / Clean Title',
    location: 'Japan / USA Stock Yard',
    engine: '1.5L 4-Cylinder Dual VVT-i (106 hp)',
    color: 'Silver Streak Mica',
    vinPreview: '3MYDLBY35KY******',
    image: '/assets/cars/toyota-yaris.jpg',
    features: ['Super Fuel Efficient City Car', 'Effortless Parking in Busy Traffic', '7-inch Touchscreen Display', 'Air Conditioning & Power Windows', 'Low Cost Replacement Parts'],
    popular: true
  },
  {
    id: 'v5',
    name: '2020 Honda CR-V EX AWD',
    make: 'Honda',
    model: 'CR-V',
    year: 2020,
    category: 'SUV',
    priceUSD: 21500,
    mileage: '34,000 mi',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    condition: 'Foreign Used / Clean Title',
    location: 'USA Port Ready',
    engine: '1.5L Turbocharged 4-Cylinder (190 hp)',
    color: 'Modern Steel Metallic',
    vinPreview: '7FARW2H56LE******',
    image: '/assets/cars/honda-crv.jpg',
    features: ['Spacious Family Cabin & Large Boot', 'Honda Sensing Active Safety', 'Power Moonroof', 'Heated Front Seats', 'Real-Time All-Wheel Drive'],
    popular: true
  },
  {
    id: 'v6',
    name: '2020 Toyota Camry LE',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    category: 'Sedan',
    priceUSD: 17400,
    mileage: '29,000 mi',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    condition: 'Foreign Used / Clean Title',
    location: 'USA Yard Ready',
    engine: '2.5L Dynamic Force 4-Cylinder (203 hp)',
    color: 'Super White / Midnight Black',
    vinPreview: '4T1B11HK2LU******',
    image: '/assets/cars/toyota-camry.jpg',
    features: ['Comfortable Executive Ride Quality', 'Bi-LED Combination Headlights', 'Toyota Safety Sense P', '8-Way Power Driver Seat', 'Legendary Toyota Durability'],
    popular: true
  },
  {
    id: 'v7',
    name: '2020 Toyota Hilux 2.4L D-4D 4x4 Double Cab',
    make: 'Toyota',
    model: 'Hilux',
    year: 2020,
    category: 'Truck',
    priceUSD: 27500,
    mileage: '39,000 mi',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    condition: 'Foreign Used / Clean Title',
    location: 'Dubai Stock Yard',
    engine: '2.4L D-4D Turbo Diesel (148 hp / 400 Nm)',
    color: 'Glacier White',
    vinPreview: 'MR0KA3CD9N1******',
    image: '/assets/cars/toyota-hilux.jpg',
    features: ['Heavy-Duty 4x4 Construction Workhorse', 'Reinforced Bedliner & Tow Bar', 'High Ground Clearance for Rough Terrain', 'Dual Cab 5-Passenger Seating', 'Rear Differential Lock'],
    popular: true
  },
  {
    id: 'v8',
    name: '2021 Hyundai Tucson Value Edition AWD',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2021,
    category: 'SUV',
    priceUSD: 16800,
    mileage: '33,000 mi',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    condition: 'Foreign Used / Clean Title',
    location: 'USA Stock',
    engine: '2.0L 4-Cylinder GDI (161 hp)',
    color: 'Coliseum Gray',
    vinPreview: 'KM8JB3AA2MU******',
    image: '/assets/cars/hyundai-tucson.jpg',
    features: ['Modern Styling & High Value Package', 'Apple CarPlay & Android Auto', 'Blind-Spot Collision Warning', 'Smooth Highway Ride', 'Spacious Boot Space'],
  }
];

export const SPARE_PARTS: SparePart[] = [
  {
    id: 'p1',
    name: 'Complete Heavy-Duty Ceramic Brake Disc & Caliper Assembly Kit',
    category: 'Braking',
    compatibility: 'Toyota Land Cruiser, Hilux, Prado, Corolla, Camry',
    priceUSD: 380,
    partNumber: 'JKD-BRK-43512-60190',
    inStock: true,
    warranty: '24 Months Replacement Guarantee',
    origin: 'OEM Certified Standard',
    image: '/assets/spare-parts/brakes_rotors.jpg',
    description: 'Precision-vented and slotted rotors engineered for tropical braking temperatures without brake fade.'
  },
  {
    id: 'p2',
    name: 'Complete Japanese OEM Replacement Engine Block & Assembly',
    category: 'Engine & Transmission',
    compatibility: 'Toyota Corolla, RAV4, Camry, Vitz / Yaris 1.8L & 2.5L VVT-i',
    priceUSD: 1450,
    partNumber: 'JKD-ENG-2ZR-FE-OEM',
    inStock: true,
    warranty: '12 Months Warranty',
    origin: 'Japan OEM Direct',
    image: '/assets/spare-parts/engine_japanese.jpg',
    description: 'Factory-tested low-mileage Japanese complete engine block with intake manifold, fuel injectors, and sensors.'
  },
  {
    id: 'p3',
    name: 'Automatic Transmission & Gearbox Overhaul Assembly',
    category: 'Engine & Transmission',
    compatibility: 'Toyota RAV4, Camry, Corolla, Hyundai Elantra, Honda CR-V',
    priceUSD: 980,
    partNumber: 'JKD-TRN-U760E-AUTO',
    inStock: true,
    warranty: '18 Months Warranty',
    origin: 'OEM Certified',
    image: '/assets/spare-parts/gearbox_transmission.jpg',
    description: 'Factory calibrated automatic gearbox unit with torque converter for smooth gear transitions in city and highway driving.'
  },
  {
    id: 'p4',
    name: 'Heavy-Duty Tropical Aluminum Engine Cooling Radiator Assembly',
    category: 'Engine & Transmission',
    compatibility: 'Toyota Hilux, Land Cruiser Prado, Fortuner, Hiace 2.4L / 2.8L',
    priceUSD: 240,
    partNumber: 'JKD-RAD-16400-0L430',
    inStock: true,
    warranty: '24 Months Warranty',
    origin: 'Tropicalized OEM Specification',
    image: '/assets/spare-parts/radiator_part.jpg',
    description: 'High-capacity multi-core aluminum radiator with integrated transmission oil cooler designed for extreme tropical heat.'
  },
  {
    id: 'p5',
    name: 'Full Front & Rear Heavy-Duty Suspension Shocks & Strut Assembly',
    category: 'Suspension & Steering',
    compatibility: 'Toyota RAV4, Hilux, Prado, Honda CR-V, Hyundai Tucson',
    priceUSD: 490,
    partNumber: 'JKD-SUS-48510-80542',
    inStock: true,
    warranty: '24 Months Warranty',
    origin: 'Heavy Duty OEM Grade',
    image: '/assets/spare-parts/suspension_shocks.jpg',
    description: 'Heavy-duty gas-pressurized twin-tube struts engineered to absorb potholes and uneven terrain on Ghanaian roads.'
  },
  {
    id: 'p6',
    name: 'OEM Reinforced High-Strength Alloy Wheel Rim Set (Set of 4)',
    category: 'Body & Lighting',
    compatibility: 'Universal 5x114.3 / 6x139.7 — Toyota, Lexus, Honda, Hyundai',
    priceUSD: 620,
    partNumber: 'JKD-WHL-18X8-ALLOY',
    inStock: true,
    warranty: '36 Months Structural Warranty',
    origin: 'Certified Alloy Forged',
    image: '/assets/spare-parts/alloy_wheels.jpg',
    description: 'Reinforced forged aluminum alloy wheels engineered to resist cracking and bending under heavy payload and rough road conditions.'
  }
];

export const SAMPLE_SHIPMENTS: Record<string, ShipmentStatus> = {
  'JKD-7829-GH': {
    trackingId: 'JKD-7829-GH',
    vin: '2T3C1RFV2MC891044',
    vehicleName: '2021 Toyota RAV4 XLE AWD (Super White)',
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
    vin: '2T1BURHE8LC448102',
    vehicleName: '2020 Toyota Corolla LE (Classic Silver)',
    origin: 'Port of Houston (Texas, USA)',
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
      { date: 'Aug 19, 2026', time: '10:00 GST', location: 'Port of Houston, USA', note: 'Vessel departed export berth' }
    ]
  },
  'JKD-9103-DXB': {
    trackingId: 'JKD-9103-DXB',
    vin: '4T1B11HK2LU109823',
    vehicleName: '2020 Toyota Camry LE (Super White)',
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
  companyName: 'Jackdan Premium Ventures',
  poBox: 'P.O.BOX DK 1147',
  landmark: 'OPPOSITE LIGHTHOUSE CHAPEL INTERNATIONAL, NEAR FANMILK',
  area: 'ABOSSEY OKAI',
  city: 'ACCRA',
  country: 'GHANA',
  address: 'P.O.BOX DK 1147, OPPOSITE LIGHTHOUSE CHAPEL INTERNATIONAL, ABOSSEY OKAI, NEAR FANMILK, ACCRA, GHANA',
  fullAddressWithCompany: 'Jackdan Premium Ventures, P.O.BOX DK 1147, OPPOSITE LIGHTHOUSE CHAPEL INTERNATIONAL, ABOSSEY OKAI, NEAR FANMILK, ACCRA, GHANA',
  googleMapsUrl: 'https://maps.google.com/?q=Lighthouse+Chapel+International+Abossey+Okai+Accra+Ghana',
  phones: ['+233 594 072 371', '+233 597 840 126'],
  primaryPhoneFormatted: '+233594072371',
  secondaryPhoneFormatted: '+233597840126',
  email: 'jackdanpremiumv@gmail.com',
  whatsappMessage: 'Hello Jackdan Premium Ventures, I would like to inquire about importing a vehicle / purchasing genuine spare parts.'
};

