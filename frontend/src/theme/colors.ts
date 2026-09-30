/**
 * Livora Design System — Color Tokens
 *
 * Visual language: warm, premium, minimal.
 * Off-white backgrounds, deep green primary, dark navy text.
 */

export const colors = {
  // ── Backgrounds ──────────────────────────────────────────
  background: '#FAF9F7',        // warm off-white
  surface: '#FFFFFF',           // cards / inputs
  surfaceElevated: '#F5F4F2',   // slightly darker surface
  highlightMint: '#E8F5EE',     // selected / highlighted elements

  // ── Primary ──────────────────────────────────────────────
  primary: '#1B6B4A',           // deep green — CTAs, links
  primaryDark: '#145236',       // pressed state
  primaryLight: '#D4EDDF',      // badges, light fills

  // ── Text ─────────────────────────────────────────────────
  textPrimary: '#1A1D2B',       // dark navy / near-black
  textSecondary: '#6B7280',     // muted blue-gray
  textTertiary: '#9CA3AF',      // placeholder / hint
  textOnPrimary: '#FFFFFF',     // text on primary-colored surfaces
  textLink: '#1B6B4A',         // link color (matches primary)

  // ── Borders ──────────────────────────────────────────────
  border: '#E5E7EB',            // light gray
  borderFocused: '#1B6B4A',     // focused input
  borderSelected: '#1B6B4A',    // selected card

  // ── Accent ───────────────────────────────────────────────
  accent: '#F0AD4E',            // gold/yellow — "Soon" badges, highlights
  accentLight: '#FFF8EC',       // light gold background

  // ── Feedback ─────────────────────────────────────────────
  error: '#DC3545',
  errorLight: '#FDE8EA',
  success: '#28A745',
  successLight: '#D4EDDA',
  warning: '#FFC107',
  warningLight: '#FFF3CD',
  info: '#17A2B8',
  infoLight: '#D1ECF1',

  // ── Misc ─────────────────────────────────────────────────
  disabled: '#D1D5DB',
  disabledText: '#9CA3AF',
  overlay: 'rgba(0, 0, 0, 0.4)',
  skeleton: '#E5E7EB',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
