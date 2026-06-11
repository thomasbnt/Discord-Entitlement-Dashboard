<script setup lang="ts">
const auth = useAuthStore()
const entitlementsStore = useEntitlementsStore()
const skusStore = useSkusStore()

const addOpen = ref(false)
const form = reactive({ token: '', appId: '', label: '' })
const loading = ref(false)
const error = ref('')

const confirmApp = ref<{ id: string; label: string } | null>(null)

function resetStores() {
  clearGuildCache()
  entitlementsStore.fetch()
  skusStore.fetch()
}

const currentLabel = computed(() => {
  const active = auth.activeApp
  if (!active) return auth.appId
  return active.label !== active.appId ? active.label : active.appId
})

const items = computed(() => [
  auth.savedApps.map(app => ({
    label: app.label !== app.appId ? app.label : app.appId,
    slot: 'app' as const,
    appId: app.id,
    isActive: app.id === auth.activeAppId,
    class: app.id === auth.activeAppId ? 'bg-green-500/15 text-green-300' : '',
    onSelect() {
      if (app.id === auth.activeAppId) return
      auth.switchApp(app.id)
      resetStores()
    }
  })),
  [
    {
      label: 'Add another app',
      icon: 'i-heroicons-plus-circle',
      onSelect() {
        form.token = ''
        form.appId = ''
        form.label = ''
        error.value = ''
        addOpen.value = true
      }
    }
  ]
])

function askDisconnect(appId: string, label: string) {
  confirmApp.value = { id: appId, label }
}

function confirmDisconnect() {
  if (!confirmApp.value) return
  const wasActive = confirmApp.value.id === auth.activeAppId
  auth.removeApp(confirmApp.value.id)
  confirmApp.value = null
  if (wasActive && auth.isAuthenticated) resetStores()
}

async function validateCredentials(token: string, appId: string): Promise<string | null> {
  const data = await $fetch<{ id: string; name: string }>('/api/discord/applications/@me', {
    headers: { 'x-discord-token': token }
  })
  if (data.id !== appId) throw new Error('Application ID does not match this bot token.')
  return data.name ?? null
}

async function submit() {
  if (!form.token.trim() || !form.appId.trim()) return
  loading.value = true
  error.value = ''
  try {
    const appName = await validateCredentials(form.token.trim(), form.appId.trim())
    auth.save(form.token.trim(), form.appId.trim(), form.label.trim() || appName || undefined)
    addOpen.value = false
    resetStores()
  } catch (e: any) {
    error.value = e.data?.message ?? e.message ?? 'Invalid credentials.'
    loading.value = false
  }
}

</script>

<template>
  <div>
    <UDropdownMenu :items="items" :ui="{ content: 'min-w-[280px]' }">
      <UButton variant="subtle" color="neutral" size="sm" class="gap-1.5">
        <UIcon name="i-heroicons-server" class="text-indigo-400 shrink-0" />
        <span class="max-w-[140px] truncate">{{ currentLabel }}</span>
        <UIcon name="i-heroicons-chevron-down" class="text-gray-400 shrink-0" />
      </UButton>

      <template #app="{ item }">
        <div
          class="flex items-center justify-between w-full gap-2 rounded"
          :class="item.isActive ? 'cursor-default' : 'cursor-pointer'"
        >
          <div class="flex items-center gap-2">
            <UIcon
              :name="item.isActive ? 'i-heroicons-check-circle' : 'i-heroicons-server'"
              class="shrink-0 text-sm"
              :class="item.isActive ? 'text-indigo-400' : 'text-gray-400'"
            />
            <span class="text-sm" :class="item.isActive ? 'font-medium' : ''">{{ item.label }}</span>
          </div>
          <button
            type="button"
            class="shrink-0 flex items-center text-red-400 opacity-50 hover:opacity-100 cursor-pointer"
            @click.stop.prevent="askDisconnect(item.appId, item.label)"
          >
            <UIcon name="i-heroicons-trash" class="w-3.5 h-3.5" />
          </button>
        </div>
      </template>
    </UDropdownMenu>
  </div>

  <UModal v-model:open="addOpen" title="Add another app">
    <template #body>
      <div class="space-y-4">
        <UAlert v-if="error" color="error" :description="error" />

        <div class="space-y-1">
          <label class="block text-sm font-medium">Bot Token</label>
          <UInput
            v-model="form.token"
            type="password"
            placeholder="Your bot token"
            class="w-full"
            @keyup.enter="submit"
          />
          <p class="text-xs text-gray-500">Your app → <strong>Bot</strong> → Token</p>
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium">Application ID</label>
          <UInput
            v-model="form.appId"
            placeholder="Discord application ID"
            class="w-full"
            @keyup.enter="submit"
          />
          <p class="text-xs text-gray-500">Your app → <strong>General Information</strong> → Application ID</p>
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium">
            App name
            <span class="text-gray-500 font-normal">(optional — fetched from Discord if left empty)</span>
          </label>
          <UInput
            v-model="form.label"
            placeholder="My Bot"
            class="w-full"
            @keyup.enter="submit"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" color="neutral" @click="addOpen = false">Cancel</UButton>
        <UButton :loading="loading" :disabled="!form.token || !form.appId" @click="submit">
          Connect
        </UButton>
      </div>
    </template>
  </UModal>

  <UModal :open="!!confirmApp" title="Disconnect app" @update:open="confirmApp = null">
    <template #body>
      <p class="text-sm text-gray-300">
        Remove <strong>{{ confirmApp?.label }}</strong> from saved apps? The credentials will be deleted locally.
      </p>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" color="neutral" @click="confirmApp = null">Cancel</UButton>
        <UButton color="error" icon="i-heroicons-trash" @click="confirmDisconnect">Disconnect</UButton>
      </div>
    </template>
  </UModal>
</template>
