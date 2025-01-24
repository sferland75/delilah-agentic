/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Brand colors
        primary: {
          light: '#0055CC',
          DEFAULT: '#003399',
          dark: '#001F5C',
          50: '#E6ECF7',
          100: '#C5D5F0',
          200: '#94A9D3',
          300: '#6B83BE',
          400: '#4A64A9',
          500: '#003399',
          600: '#002B8C',
          700: '#001F5C',
          800: '#001845',
          900: '#000D24',
        },
        // UI Colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "#003399",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          light: '#E6ECF7',
          DEFAULT: '#C5D5F0',
          dark: '#94A9D3',
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          light: '#F0F4FF',
          DEFAULT: '#E6ECF7',
          dark: '#D1DCF2',
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}