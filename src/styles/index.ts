// DRAMS Design System tokens
export const DRAMS = {
  // Colors
  textDark: '#1a1a1a',
  textLight: '#666666',
  grayTrack: '#e0e0e0',
  white: '#ffffff',
  orange: '#ff6b00',
  orangeLight: '#fff0e6',

  // Spacing (in px)
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',

  // Border radius
  radiusSm: '4px',
  radiusMd: '8px',
  radiusLg: '12px',
};

export const COLORS = {
  primary: DRAMS.orange,
  secondary: '#666666',
  error: '#dc3545',
  success: '#28a745',
  warning: '#ffc107',
  info: '#17a2b8',
  textDark: DRAMS.textDark,
  textMuted: DRAMS.textLight,
  white: DRAMS.white,
  border: DRAMS.grayTrack,
};

export const SPACING = {
  xs: DRAMS.xs,
  sm: DRAMS.sm,
  md: DRAMS.md,
  lg: DRAMS.lg,
  xl: DRAMS.xl,
  '2xl': DRAMS['2xl'],
  '3xl': DRAMS['3xl'],
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '28px',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  body: {
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  bodySmall: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 1.4,
  },
};

export const BUTTON = {
  primary: {
    padding: `${SPACING.md} ${SPACING.lg}`,
    backgroundColor: DRAMS.orange,
    color: DRAMS.white,
    border: 'none',
    borderRadius: DRAMS.radiusMd,
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 500,
  },
  secondary: {
    padding: `${SPACING.md} ${SPACING.lg}`,
    backgroundColor: 'transparent',
    color: DRAMS.textDark,
    border: `1px solid ${DRAMS.grayTrack}`,
    borderRadius: DRAMS.radiusMd,
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 500,
  },
};

export const PILL_BUTTON = {
  orange: {
    ...BUTTON.primary,
    borderRadius: '9999px',
    padding: `${SPACING.md} ${SPACING.xl}`,
  },
};

export const CARD = {
  base: {
    backgroundColor: DRAMS.white,
    border: `1px solid ${DRAMS.grayTrack}`,
    borderRadius: DRAMS.radiusMd,
    padding: SPACING.lg,
  },
};

export const BADGE = {
  error: {
    backgroundColor: '#ffebee',
    color: COLORS.error,
    padding: `${SPACING.sm} ${SPACING.md}`,
    borderRadius: DRAMS.radiusSm,
  },
  success: {
    backgroundColor: '#e8f5e9',
    color: COLORS.success,
    padding: `${SPACING.sm} ${SPACING.md}`,
    borderRadius: DRAMS.radiusSm,
  },
};

export const GRID = {
  twoColumnsWide: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: SPACING.xl,
  },
};
