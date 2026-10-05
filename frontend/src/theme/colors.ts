/**
 * Livora Design System — Color Tokens
 *
 * Theme: Alexandria
 * Visual language: archival intelligence, clean precision, scholarly authority.
 * Cool neutral surfaces, indigo-cobalt primary, technical clarity.
 *
 * Extracted from Stitch Alexandria design system screens.
 */

export const colors = {
  // ── Backgrounds ──────────────────────────────────────────
  background: '#FAF9FA',        // cool near-white canvas
  surface: '#FFFFFF',           // cards / inputs (pure white)
  surfaceElevated: '#F5F3F4',   // elevated cards (surfaceContainerLow)
  highlightMint: '#D9E2FF',     // selected / highlighted elements (primaryFixed)

  // ── Primary ──────────────────────────────────────────────
  primary: '#094CB2',           // indigo-cobalt — CTAs, links, active states
  primaryDark: '#3366CC',       // primaryContainer — pressed / deep state
  primaryLight: '#D9E2FF',      // primaryFixed — badges, light fills

  // ── Text ─────────────────────────────────────────────────
  textPrimary: '#1B1C1D',       // neutral near-black (onSurface)
  textSecondary: '#434653',     // cool slate (onSurfaceVariant)
  textTertiary: '#737784',      // outline tone — placeholders / hints
  textOnPrimary: '#FFFFFF',     // text on primary-colored surfaces
  textLink: '#094CB2',          // link color (matches primary)

  // ── Borders ──────────────────────────────────────────────
  border: '#C3C6D5',            // outlineVariant — subtle borders
  borderFocused: '#094CB2',     // focused input (primary)
  borderSelected: '#094CB2',    // selected card (primary)

  // ── Accent ───────────────────────────────────────────────
  accent: '#BFAB49',            // gold — tertiaryContainer for badges, highlights
  accentLight: '#F9E37A',       // tertiaryFixedDim — light gold background

  // ── Feedback ─────────────────────────────────────────────
  error: '#BA1A1A',
  errorLight: '#FFDAD6',
  success: '#28A745',
  successLight: '#D4EDDA',
  warning: '#FFC107',
  warningLight: '#FFF3CD',
  info: '#2259BF',              // surfaceTint blue (Alexandria)
  infoLight: '#D9E2FF',         // primaryFixed

  // ── Misc ─────────────────────────────────────────────────
  disabled: '#C3C6D5',          // outlineVariant
  disabledText: '#737784',      // outline
  overlay: 'rgba(27, 28, 29, 0.4)', // neutral cool overlay
  skeleton: '#E3E2E3',          // surfaceContainerHighest
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
