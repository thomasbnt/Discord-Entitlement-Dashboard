export interface SavedApp {
  id: string
  label: string
  appId: string
  token: string
}

const APPS_KEY = 'discord_saved_apps'
const ACTIVE_KEY = 'discord_active_app'

function parseApps(): SavedApp[] {
  try {
    return JSON.parse(localStorage.getItem(APPS_KEY) ?? '[]')
  } catch {
    return []
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(import.meta.client ? (localStorage.getItem('discord_token') ?? '') : '')
  const appId = ref(import.meta.client ? (localStorage.getItem('discord_app_id') ?? '') : '')
  const savedApps = ref<SavedApp[]>(import.meta.client ? parseApps() : [])
  const activeAppId = ref(import.meta.client ? (localStorage.getItem(ACTIVE_KEY) ?? '') : '')

  // Migrate credentials from pre-multi-app format
  if (import.meta.client && token.value && appId.value && savedApps.value.length === 0) {
    const app: SavedApp = { id: crypto.randomUUID(), label: appId.value, appId: appId.value, token: token.value }
    savedApps.value = [app]
    activeAppId.value = app.id
    localStorage.setItem(APPS_KEY, JSON.stringify([app]))
    localStorage.setItem(ACTIVE_KEY, app.id)
  }

  const isAuthenticated = computed(() => !!token.value && !!appId.value)
  const activeApp = computed(() => savedApps.value.find(a => a.id === activeAppId.value) ?? null)

  function save(newToken: string, newAppId: string, label?: string) {
    const existing = savedApps.value.find(a => a.appId === newAppId)
    let app: SavedApp
    if (existing) {
      existing.token = newToken
      if (label) existing.label = label
      app = existing
    } else {
      app = { id: crypto.randomUUID(), label: label || newAppId, appId: newAppId, token: newToken }
      savedApps.value.push(app)
    }
    activeAppId.value = app.id
    token.value = newToken
    appId.value = newAppId
    localStorage.setItem('discord_token', newToken)
    localStorage.setItem('discord_app_id', newAppId)
    localStorage.setItem(ACTIVE_KEY, app.id)
    localStorage.setItem(APPS_KEY, JSON.stringify(savedApps.value))
  }

  function switchApp(id: string) {
    const app = savedApps.value.find(a => a.id === id)
    if (!app) return
    token.value = app.token
    appId.value = app.appId
    activeAppId.value = id
    localStorage.setItem('discord_token', app.token)
    localStorage.setItem('discord_app_id', app.appId)
    localStorage.setItem(ACTIVE_KEY, id)
  }

  function renameApp(id: string, label: string) {
    const app = savedApps.value.find(a => a.id === id)
    if (!app) return
    app.label = label
    localStorage.setItem(APPS_KEY, JSON.stringify(savedApps.value))
  }

  function removeApp(id: string) {
    savedApps.value = savedApps.value.filter(a => a.id !== id)
    localStorage.setItem(APPS_KEY, JSON.stringify(savedApps.value))
    if (activeAppId.value === id) {
      const next = savedApps.value[0]
      if (next) switchApp(next.id)
      else logout()
    }
  }

  function logout() {
    token.value = ''
    appId.value = ''
    activeAppId.value = ''
    localStorage.removeItem('discord_token')
    localStorage.removeItem('discord_app_id')
    localStorage.removeItem(ACTIVE_KEY)
    return navigateTo('/login')
  }

  return { token, appId, isAuthenticated, savedApps, activeApp, activeAppId, save, switchApp, renameApp, removeApp, logout }
})
