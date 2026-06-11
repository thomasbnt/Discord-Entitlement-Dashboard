<script setup lang="ts">
useHead({ title: 'Entitlements' })

const auth = useAuthStore()
const store = useEntitlementsStore()
const skusStore = useSkusStore()
const createOpen = ref(false)
const { isOpen: wizardOpen, checkAndOpen } = useWelcomeWizard()

onMounted(() => {
  store.fetch()
  skusStore.fetch()
  checkAndOpen()
})
</script>

<template>
  <UContainer class="py-6 space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div class="flex items-center gap-3">
        <UIcon name="i-simple-icons-discord" class="text-2xl text-indigo-400" />
        <h1 class="text-xl font-semibold">Entitlements</h1>
        <AppSwitcher />
        <UTooltip v-if="auth.appId" text="Manage SKUs in Developer Portal">
          <a
            :href="`https://discord.com/developers/applications/${auth.appId}/skus`"
            target="_blank"
            rel="noopener"
          >
            <UButton icon="i-heroicons-arrow-top-right-on-square" variant="ghost" color="neutral" size="sm" />
          </a>
        </UTooltip>
      </div>
      <div class="flex items-center gap-2">
        <UButton icon="i-heroicons-plus" @click="createOpen = true">
          Create a new test subscription
        </UButton>
        <NuxtLink to="/help">
          <UButton icon="i-heroicons-question-mark-circle" variant="ghost" color="neutral">
            Help
          </UButton>
        </NuxtLink>
        <UTooltip text="Support the developer">
          <a href="https://thomasbnt.dev/donate" target="_blank" rel="noopener">
            <UButton icon="i-heroicons-heart" variant="ghost" color="error" />
          </a>
        </UTooltip>
        <ColorModeToggle />
        <UButton
          icon="i-heroicons-arrow-right-on-rectangle"
          variant="ghost"
          color="neutral"
          @click="auth.logout()"
        >
          Logout
        </UButton>
      </div>
    </div>

    <EntitlementStats />

    <EntitlementFilters />

    <UAlert
      v-if="store.error"
      color="error"
      icon="i-heroicons-exclamation-circle"
      :description="store.error"
    />

    <EntitlementTable />

    <CreateDialog v-model:open="createOpen" />
    <WelcomeWizard />
  </UContainer>
</template>
