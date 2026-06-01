<script setup lang="ts">
useHead({ title: 'Login' })

const auth = useAuthStore()
const form = reactive({ token: '', appId: '' })
const loading = ref(false)
const error = ref('')

async function submit() {
  if (!form.token.trim() || !form.appId.trim()) return
  loading.value = true
  error.value = ''
  try {
    auth.save(form.token.trim(), form.appId.trim())
    await navigateTo('/')
  } catch {
    error.value = 'Connection error.'
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-950 p-4">
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
          The token is stored locally and never sent to third-party servers.
        </p>
      </template>
    </UCard>
  </div>
</template>
