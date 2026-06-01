export const useAuthStore = defineStore('auth', () => {
  const token = ref(import.meta.client ? (localStorage.getItem('discord_token') ?? '') : '')
  const appId = ref(import.meta.client ? (localStorage.getItem('discord_app_id') ?? '') : '')

  const isAuthenticated = computed(() => !!token.value && !!appId.value)

  function load() {
    if (import.meta.client) {
      token.value = localStorage.getItem('discord_token') ?? ''
      appId.value = localStorage.getItem('discord_app_id') ?? ''
    }
  }

  function save(newToken: string, newAppId: string) {
    token.value = newToken
    appId.value = newAppId
    localStorage.setItem('discord_token', newToken)
    localStorage.setItem('discord_app_id', newAppId)
  }

  function logout() {
    token.value = ''
    appId.value = ''
    localStorage.removeItem('discord_token')
    localStorage.removeItem('discord_app_id')
    return navigateTo('/login')
  }

  return { token, appId, isAuthenticated, load, save, logout }
})
