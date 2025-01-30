export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  PRICING: '/pricing',
  SETTINGS: {
    BASE: '/settings',
    ACTBLUE: '/settings/actblue',
    ACTBLUE_NEW: '/settings/actblue/new',
  },
  ACCOUNTS: '/accounts',
  POSTCARDS: '/postcards',
  MONITORING: '/monitoring',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];