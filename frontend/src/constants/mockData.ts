/**
 * Mock Data — Categories and Tasks
 *
 * ≥ 4 categories, ≥ 20 tasks. Isolated from UI for easy backend replacement.
 * Icons reference @expo/vector-icons (Feather) icon names.
 */

import type { Category, Task } from '@/types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-errands',
    name: 'Errands & Daily Tasks',
    icon: 'check-square',
    description: 'Bills, banks, documents, government work',
    taskCount: 4,
  },
  {
    id: 'cat-home',
    name: 'Home Services',
    icon: 'home',
    description: 'AC, plumbing, electrical, cleaning, repairs',
    taskCount: 5,
  },
  {
    id: 'cat-travel',
    name: 'Travel & Tourism',
    icon: 'map-pin',
    description: 'Flights, hotels, visas, transfers, itineraries',
    taskCount: 5,
  },
  {
    id: 'cat-health',
    name: 'Health & Medical',
    icon: 'heart',
    description: 'Doctor visits, pharmacy, labs, physio',
    taskCount: 4,
  },
  {
    id: 'cat-senior',
    name: 'Senior Care',
    icon: 'users',
    description: 'Check-ins, medicines, vitals, companionship',
    taskCount: 4,
  },
  {
    id: 'cat-events',
    name: 'Events & Management',
    icon: 'calendar',
    description: 'Weddings, private events, catering, coordination',
    taskCount: 4,
  },
  {
    id: 'cat-workforce',
    name: 'Workforce Management',
    icon: 'briefcase',
    description: 'Maids, cooks, drivers, nannies, payroll',
    taskCount: 5,
  },
];

export const MOCK_TASKS: Task[] = [
  // ── Errands & Daily Tasks ──────────────────────────────
  {
    id: 'task-pickups',
    name: 'Pickups & Deliveries',
    categoryId: 'cat-errands',
    description: 'Same-day courier, parcel pickup, and package deliveries across town',
  },
  {
    id: 'task-payments',
    name: 'Payments & Renewals',
    categoryId: 'cat-errands',
    description: 'Utility bills, property tax, vehicle insurance, and subscription renewals',
  },
  {
    id: 'task-documents',
    name: 'Documents & Government',
    categoryId: 'cat-errands',
    description: 'Passport, Aadhaar, notary, municipal certificates, and paperwork',
  },
  {
    id: 'task-shopping',
    name: 'Shopping',
    categoryId: 'cat-errands',
    description: 'Groceries, medicines, specialty store errands, and returns',
  },

  // ── Home Services ──────────────────────────────────────
  {
    id: 'task-ac',
    name: 'AC Servicing & Repair',
    categoryId: 'cat-home',
    description: 'Deep AC filter cleaning, gas recharge, cooling issues, and repair',
  },
  {
    id: 'task-plumbing',
    name: 'Plumbing & Leaks',
    categoryId: 'cat-home',
    description: 'Leak fixes, tap installation, pipeline repair, and drain unclogging',
  },
  {
    id: 'task-electrical',
    name: 'Electrical & Wiring',
    categoryId: 'cat-home',
    description: 'Switch replacement, wiring repairs, appliance fixing, and meter checks',
  },
  {
    id: 'task-cleaning',
    name: 'Deep Cleaning',
    categoryId: 'cat-home',
    description: 'Full house deep cleaning, kitchen degreasing, and bathroom scrubbing',
  },
  {
    id: 'task-repairs',
    name: 'Appliance & Carpentry Repairs',
    categoryId: 'cat-home',
    description: 'Refrigerator, washing machine, woodwork, hinge, and lock repairs',
  },

  // ── Travel & Tourism ───────────────────────────────────
  {
    id: 'task-flights',
    name: 'Flights & Trains',
    categoryId: 'cat-travel',
    description: 'Domestic and international flight ticketing, seat selection, and trains',
  },
  {
    id: 'task-hotels',
    name: 'Hotels & Stays',
    categoryId: 'cat-travel',
    description: 'Handpicked hotels, private villas, resorts, and homestays',
  },
  {
    id: 'task-visas',
    name: 'Visas & Documentation',
    categoryId: 'cat-travel',
    description: 'Visa appointments, application filing, embassy paperwork, and travel insurance',
  },
  {
    id: 'task-transfers',
    name: 'Airport Transfers & Cabs',
    categoryId: 'cat-travel',
    description: 'Punctual airport pickups, chauffeurs, and city-to-city cabs',
  },
  {
    id: 'task-itineraries',
    name: 'Custom Itineraries',
    categoryId: 'cat-travel',
    description: 'Curated day-by-day travel itineraries and local experiences',
  },

  // ── Health & Medical ───────────────────────────────────
  {
    id: 'task-doctor',
    name: 'Doctor Visits & Consultations',
    categoryId: 'cat-health',
    description: 'Priority specialist doctor appointments, teleconsults, and clinic visits',
  },
  {
    id: 'task-pharmacy',
    name: 'Pharmacy & Medicine Delivery',
    categoryId: 'cat-health',
    description: 'Prescription medicines verified and delivered directly to your home',
  },
  {
    id: 'task-labs',
    name: 'Lab Tests & Diagnostics',
    categoryId: 'cat-health',
    description: 'Home blood sample collection, X-ray, and pathology reports',
  },
  {
    id: 'task-physio',
    name: 'Physiotherapy at Home',
    categoryId: 'cat-health',
    description: 'Certified physiotherapists for mobility, post-op, and pain management',
  },

  // ── Senior Care ────────────────────────────────────────
  {
    id: 'task-checkins',
    name: 'Daily Check-ins',
    categoryId: 'cat-senior',
    description: 'Friendly daily calls and physical wellness visits for peace of mind',
  },
  {
    id: 'task-medicines',
    name: 'Medicine Reminders & Refills',
    categoryId: 'cat-senior',
    description: 'Medication management, daily reminders, and timely refill ordering',
  },
  {
    id: 'task-vitals',
    name: 'Vitals Monitoring',
    categoryId: 'cat-senior',
    description: 'Regular BP, pulse, blood sugar, and vitals checkups documented',
  },
  {
    id: 'task-companionship',
    name: 'Companionship & Assistance',
    categoryId: 'cat-senior',
    description: 'Accompanying seniors to parks, temples, appointments, and social walks',
  },

  // ── Events & Management ────────────────────────────────
  {
    id: 'task-weddings',
    name: 'Weddings & Celebrations',
    categoryId: 'cat-events',
    description: 'Full wedding coordination, pre-wedding rituals, and anniversary parties',
  },
  {
    id: 'task-catering',
    name: 'Catering & Dining Setup',
    categoryId: 'cat-events',
    description: 'Curated menus, live counters, professional chefs, and serving staff',
  },
  {
    id: 'task-vendors',
    name: 'Vendor Coordination',
    categoryId: 'cat-events',
    description: 'Decorators, sound, lighting, photographers, and venue management',
  },
  {
    id: 'task-parties',
    name: 'Private Parties',
    categoryId: 'cat-events',
    description: 'Intimate house parties, birthday setups, and celebration planning',
  },

  // ── Workforce Management ───────────────────────────────
  {
    id: 'task-maids',
    name: 'Maids & Housekeepers',
    categoryId: 'cat-workforce',
    description: 'Verified full-time or part-time domestic helpers and housekeepers',
  },
  {
    id: 'task-cooks',
    name: 'Cooks & Chefs',
    categoryId: 'cat-workforce',
    description: 'Experienced cooks for dietary requirements, regional cuisine, and daily meals',
  },
  {
    id: 'task-drivers',
    name: 'Drivers & Chauffeurs',
    categoryId: 'cat-workforce',
    description: 'Trained, background-verified personal drivers for family commutes',
  },
  {
    id: 'task-nannies',
    name: 'Nannies & Babysitters',
    categoryId: 'cat-workforce',
    description: 'Caring, trained infant and child caretakers for home support',
  },
  {
    id: 'task-payroll',
    name: 'Staff Payroll & Verification',
    categoryId: 'cat-workforce',
    description: 'Monthly payroll disbursement, attendance tracking, and police verification',
  },
];

/** Mock registered user for auth simulation */
export const MOCK_USER_CREDENTIALS = {
  email: 'test@livora.com',
  password: 'Password@123',
};

/** The OTP that the mock service accepts */
export const MOCK_VALID_OTP = '123456';

/** OTP validity duration in seconds (10 minutes) */
export const OTP_VALIDITY_SECONDS = 600;

/** Resend cooldown in seconds */
export const OTP_RESEND_COOLDOWN_SECONDS = 30;

/** Maximum incorrect OTP attempts */
export const MAX_OTP_ATTEMPTS = 5;
