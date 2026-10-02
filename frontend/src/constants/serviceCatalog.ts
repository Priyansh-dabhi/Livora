/**
 * Structured Service Catalog
 *
 * 3-Level Data Hierarchy:
 * Category -> Help Type -> Detailed Activity
 *
 * Data-driven architecture ready for backend replacement.
 */

import type { Category, Task } from '@/types';

export const SERVICE_CATEGORIES: Category[] = [
  {
    id: 'cat-errands',
    name: 'Errands & Daily Tasks',
    icon: 'check-square',
    description: 'Bills, banks, documents, government work',
    completeAssistanceTitle: 'Complete Errands & Daily Tasks assistance',
    completeAssistanceDesc:
      'Help across this whole area. You can still pick specific services.',
    taskCount: 12,
    helpTypes: [
      {
        id: 'help-pickups',
        name: 'Pickups & Deliveries',
        description:
          'Courier pickup/drop · Grocery pickup & restocking · Medicine pickup & refills',
        activities: [
          {
            id: 'act-courier',
            name: 'Courier pickup/drop',
            description: 'Same-day parcel pickup and drop across town',
          },
          {
            id: 'act-grocery',
            name: 'Grocery pickup & restocking',
            description: 'Fresh groceries from your preferred neighborhood markets',
          },
          {
            id: 'act-medicine',
            name: 'Medicine pickup & refills',
            description: 'Prescription pickup from pharmacy and timely refills',
          },
          {
            id: 'act-pet-food',
            name: 'Pet food & supplies pickup',
            description: 'Specialty pet food and supplies delivered to your door',
          },
        ],
      },
      {
        id: 'help-payments',
        name: 'Payments & Renewals',
        description:
          'Subscription renewals handling · Bill payments',
        activities: [
          {
            id: 'act-subscription',
            name: 'Subscription renewals handling',
            description: 'Club, magazine, streaming, and service renewals',
          },
          {
            id: 'act-bills',
            name: 'Bill payments',
            description: 'Electricity, water, gas, property tax, and maintenance bills',
          },
        ],
      },
      {
        id: 'help-documents',
        name: 'Documents & Government',
        description:
          'Queue standing · SIM replacement & activation help · Document printing...',
        activities: [
          {
            id: 'act-queue',
            name: 'Queue standing',
            description: 'Someone to wait in line for you at government offices and banks',
          },
          {
            id: 'act-sim',
            name: 'SIM replacement & activation help',
            description: 'Coordination with telecom store for replacement and verification',
          },
          {
            id: 'act-print-scan',
            name: 'Document printing, scanning, notarization',
            description: 'Physical prints, high-res scans, and legal notary stamps',
          },
          {
            id: 'act-lost-item',
            name: 'Lost item recovery coordination',
            description: 'Filing complaints and tracing lost luggage or items',
          },
          {
            id: 'act-passport',
            name: 'Passport photo & form assistance',
            description: 'Passport seva kendra appointments and document prep',
          },
        ],
      },
      {
        id: 'help-shopping',
        name: 'Shopping',
        description: 'Gift shopping & returns',
        activities: [
          {
            id: 'act-gifts',
            name: 'Gift shopping & returns',
            description: 'Curated gift buying, gift wrapping, and ecommerce returns',
          },
        ],
      },
    ],
  },
  {
    id: 'cat-home',
    name: 'Home Services',
    icon: 'home',
    description: 'AC, plumbing, electrical, cleaning, repairs',
    completeAssistanceTitle: 'Complete Home Services assistance',
    completeAssistanceDesc:
      'Dedicated home manager to inspect, diagnose, and supervise all house repairs.',
    taskCount: 11,
    helpTypes: [
      {
        id: 'help-ac',
        name: 'Air Conditioning & Cooling',
        description: 'AC filter deep cleaning · Gas refill · Compressor repair',
        activities: [
          {
            id: 'act-ac-filter',
            name: 'AC filter deep cleaning',
            description: 'Jet pump cleaning of indoor and outdoor coils and filters',
          },
          {
            id: 'act-ac-gas',
            name: 'Gas leak check & refrigerant refill',
            description: 'Leak detection and eco-friendly gas top-up',
          },
          {
            id: 'act-ac-repair',
            name: 'Cooling issue diagnosis & compressor repair',
            description: 'Diagnostics for unusual noise, water leaking, and low cooling',
          },
        ],
      },
      {
        id: 'help-plumbing',
        name: 'Plumbing & Sanitary',
        description: 'Tap leak repair · Drain clearance · Water purifier',
        activities: [
          {
            id: 'act-plumb-leak',
            name: 'Tap, shower & pipe leak repair',
            description: 'Fixing dripping taps, mixers, and concealed pipe leaks',
          },
          {
            id: 'act-plumb-drain',
            name: 'Blocked sink & bathroom drain clearance',
            description: 'Manual and machine snaking for clogged pipelines',
          },
          {
            id: 'act-plumb-ro',
            name: 'Geyser & water purifier installation',
            description: 'Safe mounting, filter cartridge changes, and pipe fitting',
          },
        ],
      },
      {
        id: 'help-electrical',
        name: 'Electrical & Appliances',
        description: 'Switchboard repair · Short circuit check · Fixtures',
        activities: [
          {
            id: 'act-elec-switches',
            name: 'Switchboard & socket replacement',
            description: 'Repairing broken switches, modular boards, and MCBs',
          },
          {
            id: 'act-elec-wiring',
            name: 'Short circuit & internal wiring check',
            description: 'Diagnostic check for tripping breakers and electrical sparks',
          },
          {
            id: 'act-elec-fan',
            name: 'Ceiling fan & light fixture installation',
            description: 'Chandelier hanging, LED strips, and fan regulator changes',
          },
        ],
      },
      {
        id: 'help-cleaning',
        name: 'Deep Cleaning & Pest Control',
        description: 'Full home sanitization · Kitchen degreasing · Pest control',
        activities: [
          {
            id: 'act-clean-home',
            name: 'Full home deep sanitization',
            description: 'Floor buffing, window frame wiping, and bathroom scrubbing',
          },
          {
            id: 'act-clean-kitchen',
            name: 'Kitchen chimney & stove degreasing',
            description: 'Deep oil removal and tile steam cleaning',
          },
        ],
      },
    ],
  },
  {
    id: 'cat-travel',
    name: 'Travel & Tourism',
    icon: 'map-pin',
    description: 'Flights, hotels, visas, transfers, itineraries',
    completeAssistanceTitle: 'Complete Travel & Tourism assistance',
    completeAssistanceDesc:
      'End-to-end itinerary planning, booking, and round-the-clock trip support.',
    taskCount: 6,
    helpTypes: [
      {
        id: 'help-travel-booking',
        name: 'Flights & Accommodations',
        description: 'Flight ticketing · Hotel & villa reservations',
        activities: [
          {
            id: 'act-travel-flight',
            name: 'Flight & train ticket booking',
            description: 'Best routes, seat selection, and meal preferences',
          },
          {
            id: 'act-travel-stay',
            name: 'Hotel, resort & private villa booking',
            description: 'Curated luxury stays with negotiated member perks',
          },
        ],
      },
      {
        id: 'help-travel-visa',
        name: 'Visas & Documentation',
        description: 'Tourist visa application · Travel insurance',
        activities: [
          {
            id: 'act-travel-visa-app',
            name: 'Tourist visa application & embassy paperwork',
            description: 'VFS appointments, document verification, and cover letters',
          },
          {
            id: 'act-travel-insure',
            name: 'Travel insurance & forex card arrangement',
            description: 'Medical coverage policies and multi-currency debit cards',
          },
        ],
      },
      {
        id: 'help-travel-transfers',
        name: 'Transfers & Cabs',
        description: 'Airport pickups · Intercity cab booking',
        activities: [
          {
            id: 'act-travel-airport',
            name: 'Airport pickup & chauffeur coordination',
            description: 'Punctual airport transfers with meet-and-greet',
          },
          {
            id: 'act-travel-cab',
            name: 'Intercity cab booking & local sightseeing',
            description: 'Well-maintained vehicles with verified drivers',
          },
        ],
      },
    ],
  },
  {
    id: 'cat-health',
    name: 'Health & Medical',
    icon: 'heart',
    description: 'Doctor visits, pharmacy, labs, physio',
    completeAssistanceTitle: 'Complete Health & Medical assistance',
    completeAssistanceDesc:
      'Comprehensive health concierge for doctor visits, medications, and testing.',
    taskCount: 6,
    helpTypes: [
      {
        id: 'help-doctor',
        name: 'Doctor Consultations & Visits',
        description: 'Specialist appointments · Immediate teleconsult',
        activities: [
          {
            id: 'act-health-spec',
            name: 'Specialist doctor appointments & second opinions',
            description: 'Priority slots with top cardiologists, orthopedic, and GPs',
          },
          {
            id: 'act-health-tele',
            name: 'Immediate teleconsultation setup',
            description: 'Video consultation with experienced physicians',
          },
        ],
      },
      {
        id: 'help-meds',
        name: 'Medicines & Pharmacy',
        description: 'Prescription medicine delivery · Monthly refills',
        activities: [
          {
            id: 'act-health-rx',
            name: 'Prescription medicine verification & home delivery',
            description: 'Genuine pharmacy medications delivered directly to you',
          },
          {
            id: 'act-health-refill',
            name: 'Monthly chronic medicine refill schedule',
            description: 'Automated monthly refills so parents never run out',
          },
        ],
      },
      {
        id: 'help-labs',
        name: 'Diagnostics & Home Care',
        description: 'Home blood test collection · Home physiotherapy',
        activities: [
          {
            id: 'act-health-blood',
            name: 'Home blood test collection & report delivery',
            description: 'Certified phlebotomist visit for home diagnostic testing',
          },
          {
            id: 'act-health-physio',
            name: 'Certified home physiotherapy sessions',
            description: 'Post-op recovery, back pain, and mobility exercises',
          },
        ],
      },
    ],
  },
  {
    id: 'cat-senior',
    name: 'Senior Care',
    icon: 'users',
    description: 'Check-ins, medicines, vitals, companionship',
    completeAssistanceTitle: 'Complete Senior Care assistance',
    completeAssistanceDesc:
      'Dedicated, caring support for aging parents and seniors living independently.',
    taskCount: 4,
    helpTypes: [
      {
        id: 'help-senior-welfare',
        name: 'Daily Welfare & Checks',
        description: 'Daily check-in calls · Medication reminders',
        activities: [
          {
            id: 'act-senior-call',
            name: 'Daily check-in calls & physical welfare visits',
            description: 'Friendly calls and routine home visits for peace of mind',
          },
          {
            id: 'act-senior-med-reminder',
            name: 'Pill sorting & daily medication reminders',
            description: 'Organizing medicine boxes and ensuring timely doses',
          },
        ],
      },
      {
        id: 'help-senior-medical',
        name: 'Health & Doctor Accompaniment',
        description: 'BP & blood sugar logging · Clinic accompaniment',
        activities: [
          {
            id: 'act-senior-vitals',
            name: 'BP, blood sugar & pulse vitals logging',
            description: 'Regular health parameter tracking shared with family',
          },
          {
            id: 'act-senior-escort',
            name: 'Companion escort to hospital & clinic visits',
            description: 'Assisting parents from doorstep to clinic and back',
          },
        ],
      },
    ],
  },
  {
    id: 'cat-events',
    name: 'Events & Management',
    icon: 'calendar',
    description: 'Weddings, private events, catering, coordination',
    completeAssistanceTitle: 'Complete Events & Management assistance',
    completeAssistanceDesc:
      'End-to-end event production, guest coordination, and vendor supervision.',
    taskCount: 4,
    helpTypes: [
      {
        id: 'help-event-plan',
        name: 'Celebrations & Private Parties',
        description: 'Venue hunting · Theme decor & sound system',
        activities: [
          {
            id: 'act-event-venue',
            name: 'Venue hunting & booking negotiation',
            description: 'Farmhouses, banquets, and boutique event spaces',
          },
          {
            id: 'act-event-decor',
            name: 'Theme decor, lighting & sound system',
            description: 'Custom stage setups, floral decoration, and AV equipment',
          },
        ],
      },
      {
        id: 'help-event-cater',
        name: 'Catering & Hospitality',
        description: 'Custom food menus · Bartenders & serving staff',
        activities: [
          {
            id: 'act-event-menu',
            name: 'Custom food menu curation & live counters',
            description: 'Multi-cuisine catering with live chaat and dessert bars',
          },
          {
            id: 'act-event-staff',
            name: 'Professional bartenders & serving staff',
            description: 'Trained hospitality crew for seamless guest care',
          },
        ],
      },
    ],
  },
];

// Flatten all activities to Task[] for backward-compatible lookups
export const ALL_FLATTENED_TASKS: Task[] = SERVICE_CATEGORIES.flatMap((cat) =>
  cat.helpTypes.flatMap((ht) =>
    ht.activities.map((act) => ({
      id: act.id,
      name: act.name,
      categoryId: cat.id,
      description: act.description || ht.name,
    }))
  )
);
