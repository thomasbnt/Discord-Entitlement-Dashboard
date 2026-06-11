export type EntitlementTypeColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'

export interface EntitlementTypeInfo {
  label: string
  color: EntitlementTypeColor
  description: string
}

export const ENTITLEMENT_TYPES: Record<number, EntitlementTypeInfo> = {
  1: { label: 'Purchase', color: 'success', description: 'One-time purchase of an item.' },
  2: { label: 'Premium Subscription', color: 'primary', description: 'Discord Nitro subscription linked to the application.' },
  3: { label: 'Developer Gift', color: 'secondary', description: 'Gift granted by a developer.' },
  4: { label: 'Test', color: 'warning', description: 'Test purchase created manually. Deletable.' },
  5: { label: 'Free', color: 'info', description: 'Entitlement granted for free.' },
  6: { label: 'User Gift', color: 'neutral', description: 'Gift granted by another user.' },
  7: { label: 'Premium Purchase', color: 'primary', description: 'Purchase via Discord Premium offer.' },
  8: { label: 'App Subscription', color: 'primary', description: 'Direct subscription to the application. Test entitlements created via the API are deletable.' },
}
