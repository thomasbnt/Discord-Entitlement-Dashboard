const STORAGE_KEY = 'welcome_shown'

// Module-level: shared across all component instances
const isOpen = ref(false)

export function useWelcomeWizard() {
  function checkAndOpen() {
    if (!import.meta.client) return
    if (!localStorage.getItem(STORAGE_KEY)) {
      isOpen.value = true
    }
  }

  function open() {
    isOpen.value = true
  }

  function close() {
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, '1')
    isOpen.value = false
  }

  function reset() {
    if (import.meta.client) localStorage.removeItem(STORAGE_KEY)
  }

  return { isOpen, checkAndOpen, open, close, reset }
}
