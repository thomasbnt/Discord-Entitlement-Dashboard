<script setup lang="ts">
useHead({ title: 'Login' })

const auth = useAuthStore()
const form = reactive({ token: '', appId: '', label: '' })
const loading = ref(false)
const error = ref('')

async function submit() {
  if (!form.token.trim() || !form.appId.trim()) return
  loading.value = true
  error.value = ''
  try {
    const data = await $fetch<{ id: string; name: string }>('/api/discord/applications/@me', {
      headers: { 'x-discord-token': form.token.trim() }
    })
    if (data.id !== form.appId.trim()) {
      error.value = 'Application ID does not match this bot token.'
      return
    }
    auth.save(form.token.trim(), form.appId.trim(), form.label.trim() || data.name || undefined)
    await navigateTo('/')
  } catch (e: any) {
    error.value = e.data?.message ?? e.message ?? 'Connection error.'
  } finally {
    loading.value = false
  }
}

function switchTo(id: string) {
  auth.switchApp(id)
  navigateTo('/')
}
</script>

<template>
  <div class="min-h-dvh grid place-items-center bg-gray-100 dark:bg-gray-950 p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="flex items-center gap-3">
          <UIcon name="i-simple-icons-discord" class="text-3xl text-indigo-400" />
          <div>
            <h1 class="text-lg font-semibold">Discord Entitlement Dashboard</h1>
            <p class="text-sm text-gray-400">Connect with your bot token</p>
          </div>
        </div>
      </template>

      <div class="space-y-6">
        <UAlert v-if="error" color="error" :description="error" />

        <div v-if="auth.savedApps.length > 0" class="space-y-3">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Saved apps</p>
          <div class="space-y-2">
            <div
              v-for="app in auth.savedApps"
              :key="app.id"
              class="flex items-center justify-between gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-transparent px-3 py-2"
            >
              <div class="flex items-center gap-2 min-w-0">
                <UIcon name="i-heroicons-server" class="text-indigo-400 shrink-0" />
                <span class="text-sm font-medium truncate">{{ app.label !== app.appId ? app.label : app.appId }}</span>
              </div>
              <div class="flex items-center gap-1 shrink-0">
                <UButton size="xs" variant="outline" color="neutral" @click="switchTo(app.id)">
                  Switch
                </UButton>
                <UButton size="xs" variant="ghost" color="error" icon="i-heroicons-x-mark" @click="auth.removeApp(app.id)" />
              </div>
            </div>
          </div>
          <UDivider label="or connect a new app" />
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium">Bot Token</label>
          <UInput
            v-model="form.token"
            type="password"
            placeholder="Your bot token"
            class="w-full"
            @keyup.enter="submit"
          />
          <p class="text-xs text-gray-500">
            Found in
            <a
              href="https://discord.com/developers/applications"
              target="_blank"
              rel="noopener"
              class="text-indigo-400 hover:underline"
            >Discord Developer Portal</a>
            → your app → <strong>Bot</strong> → Token
          </p>
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium">Application ID</label>
          <UInput
            v-model="form.appId"
            placeholder="Discord application ID"
            class="w-full"
            @keyup.enter="submit"
          />
          <p class="text-xs text-gray-500">
            Found in
            <a
              href="https://discord.com/developers/applications"
              target="_blank"
              rel="noopener"
              class="text-indigo-400 hover:underline"
            >Discord Developer Portal</a>
            → your app → <strong>General Information</strong> → Application ID
          </p>
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium">
            App name
            <span class="text-gray-500 font-normal">(optional)</span>
          </label>
          <UInput
            v-model="form.label"
            placeholder="My Bot"
            class="w-full"
            @keyup.enter="submit"
          />
        </div>

        <UButton
          block
          :loading="loading"
          :disabled="!form.token || !form.appId"
          @click="submit"
        >
          Connect
        </UButton>
      </div>

      <template #footer>
        <p class="text-xs text-gray-500 text-center">
          Credentials are stored locally and never sent to third-party servers.
        </p>
      </template>
    </UCard>
  </div>
</template>
