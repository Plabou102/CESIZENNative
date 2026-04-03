// constants/theme.ts — CESIZen Design System (React Native)

export const colors = {
  primary:      "#2C6E49",
  primaryLight: "#4C9A6E",
  primaryDim:   "#EAF3EE",
  accent:       "#F2C94C",
  accentDim:    "#FDF6DC",

  bg:           "#F5F5F0",
  surface:      "#FFFFFF",
  surface2:     "#F0F0EB",
  border:       "#E2E2DC",
  borderDark:   "#C8C8C0",

  text:         "#1A1A2E",
  textMuted:    "#6B6B7A",
  textLight:    "#9A9AAA",

  danger:       "#C0392B",
  dangerBg:     "#FDECEA",
  success:      "#2C6E49",
  successBg:    "#EAF3EE",
  warning:      "#D4790A",
  warningBg:    "#FEF3E2",
};

export const radius = {
  sm:  6,
  md:  10,
  lg:  16,
  xl:  24,
  full: 999,
};

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const font = {
  sizeXs:   11,
  sizeSm:   13,
  sizeMd:   15,
  sizeLg:   18,
  sizeXl:   24,
  sizeXxl:  32,
  weightRegular: "400" as const,
  weightMedium:  "500" as const,
  weightSemibold:"600" as const,
  weightBold:    "700" as const,
};

export const shadow = {
  sm: {
    shadowColor: "#1A1A2E",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#1A1A2E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
};