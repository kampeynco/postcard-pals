export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  PRICING: '/pricing',
  SETTINGS: {
    BASE: '/settings',
  },
  POSTCARDS: '/postcards',
  MONITORING: '/monitoring',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES] | string;