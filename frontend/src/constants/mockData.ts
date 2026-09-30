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
    icon: 'shopping-bag',
    description: 'Everyday errands and routine tasks handled for you',
    taskCount: 6,
  },
  {
    id: 'cat-home',
    name: 'Home Services',
    icon: 'home',
    description: 'Professional home maintenance and repair services',
    taskCount: 6,
  },
  {
    id: 'cat-health',
    name: 'Health & Medical',
    icon: 'heart',
    description: 'Healthcare assistance and medical support',
    taskCount: 5,
  },
  {
    id: 'cat-digital',
    name: 'Digital & Tech Help',
    icon: 'monitor',
    description: 'Technology support and digital solutions',
    taskCount: 5,
  },
];

export const MOCK_TASKS: Task[] = [
  // ── Errands & Daily Tasks ──────────────────────────────
  {
    id: 'task-grocery',
    name: 'Grocery Shopping',
    categoryId: 'cat-errands',
    description: 'Get your groceries picked up and delivered to your doorstep',
  },
  {
    id: 'task-laundry',
    name: 'Laundry & Dry Cleaning',
    categoryId: 'cat-errands',
    description: 'Professional laundry pickup, wash, and delivery service',
  },
  {
    id: 'task-courier',
    name: 'Courier & Delivery',
    categoryId: 'cat-errands',
    description: 'Same-day pickup and delivery of packages across the city',
  },
  {
    id: 'task-bill-payment',
    name: 'Bill Payments',
    categoryId: 'cat-errands',
    description: 'Utility bills, recharges, and recurring payments handled',
  },
  {
    id: 'task-pet-care',
    name: 'Pet Care',
    categoryId: 'cat-errands',
    description: 'Pet walking, feeding, grooming, and vet visit coordination',
  },
  {
    id: 'task-queue-wait',
    name: 'Queue & Wait Services',
    categoryId: 'cat-errands',
    description: 'Someone to stand in line for you at offices and counters',
  },

  // ── Home Services ──────────────────────────────────────
  {
    id: 'task-plumbing',
    name: 'Plumbing',
    categoryId: 'cat-home',
    description: 'Fix leaks, install fixtures, and resolve plumbing issues',
  },
  {
    id: 'task-electrical',
    name: 'Electrical Repairs',
    categoryId: 'cat-home',
    description: 'Wiring, switches, appliance installation and repair',
  },
  {
    id: 'task-cleaning',
    name: 'Deep Cleaning',
    categoryId: 'cat-home',
    description: 'Thorough home cleaning including kitchen, bathroom, and more',
  },
  {
    id: 'task-painting',
    name: 'Painting & Walls',
    categoryId: 'cat-home',
    description: 'Interior and exterior painting, wall treatments',
  },
  {
    id: 'task-pest-control',
    name: 'Pest Control',
    categoryId: 'cat-home',
    description: 'Professional pest inspection and treatment services',
  },
  {
    id: 'task-carpentry',
    name: 'Carpentry',
    categoryId: 'cat-home',
    description: 'Furniture repair, custom woodwork, and assembly',
  },

  // ── Health & Medical ───────────────────────────────────
  {
    id: 'task-doc-appointment',
    name: 'Doctor Appointments',
    categoryId: 'cat-health',
    description: 'Book and manage doctor consultations and follow-ups',
  },
  {
    id: 'task-medicine-delivery',
    name: 'Medicine Delivery',
    categoryId: 'cat-health',
    description: 'Prescription medicines picked up and delivered to you',
  },
  {
    id: 'task-lab-tests',
    name: 'Lab Test Booking',
    categoryId: 'cat-health',
    description: 'Schedule diagnostic tests and home sample collection',
  },
  {
    id: 'task-physio',
    name: 'Physiotherapy at Home',
    categoryId: 'cat-health',
    description: 'Certified physiotherapists for home-based sessions',
  },
  {
    id: 'task-elder-care',
    name: 'Elder Care Assistance',
    categoryId: 'cat-health',
    description: 'Companionship, daily help, and health monitoring for seniors',
  },

  // ── Digital & Tech Help ────────────────────────────────
  {
    id: 'task-computer-repair',
    name: 'Computer Repair',
    categoryId: 'cat-digital',
    description: 'Laptop and desktop troubleshooting, hardware fixes',
  },
  {
    id: 'task-wifi-setup',
    name: 'Wi-Fi & Network Setup',
    categoryId: 'cat-digital',
    description: 'Router setup, network configuration, and connectivity issues',
  },
  {
    id: 'task-phone-repair',
    name: 'Phone Repair',
    categoryId: 'cat-digital',
    description: 'Screen replacement, battery swap, and software fixes',
  },
  {
    id: 'task-smart-home',
    name: 'Smart Home Setup',
    categoryId: 'cat-digital',
    description: 'Install and configure smart devices, cameras, and automation',
  },
  {
    id: 'task-data-recovery',
    name: 'Data Recovery',
    categoryId: 'cat-digital',
    description: 'Recover lost files from hard drives, phones, and cloud',
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
