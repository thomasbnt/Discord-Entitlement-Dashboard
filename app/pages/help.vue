<script setup lang="ts">
useHead({ title: 'Help' })

const confirm = ref(false)
const { open: openWizard, reset: resetWizard } = useWelcomeWizard()

function clearStorage() {
  resetWizard()
  localStorage.clear()
  navigateTo('/login')
}

function showIntro() {
  resetWizard()
  navigateTo('/')
}

const entitlementTypes = [
  { type: 1, label: 'Purchase', color: 'success' as const, description: 'One-time purchase of an item.' },
  { type: 2, label: 'Premium Subscription', color: 'primary' as const, description: 'Discord Nitro subscription linked to the application.' },
  { type: 3, label: 'Developer Gift', color: 'secondary' as const, description: 'Gift granted by a developer.' },
  { type: 4, label: 'Test', color: 'warning' as const, description: 'Test purchase created manually. Deletable.' },
  { type: 5, label: 'Free', color: 'info' as const, description: 'Entitlement granted for free.' },
  { type: 6, label: 'User Gift', color: 'neutral' as const, description: 'Gift granted by another user.' },
  { type: 7, label: 'Premium Purchase', color: 'primary' as const, description: 'Purchase via Discord Premium offer.' },
  { type: 8, label: 'App Subscription', color: 'primary' as const, description: 'Direct subscription to the application. Test entitlements created via the API are deletable.' },
]
</script>

<template>
  <UContainer class="py-6 space-y-8 max-w-3xl">
    <div class="flex items-center gap-3">
      <NuxtLink to="/">
        <UButton icon="i-heroicons-arrow-left" variant="ghost" color="neutral" />
      </NuxtLink>
      <ColorModeToggle />
      <UIcon name="i-simple-icons-discord" class="text-2xl text-indigo-400" />
      <h1 class="text-xl font-semibold">Help & Information</h1>
    </div>

    <UCard>
      <template #header>
        <h2 class="font-semibold">What are Premium Apps & Activities?</h2>
      </template>
      <div class="space-y-4">
        <img
          :src="'/images/monetization-overview.png'"
          alt="Discord App Monetization Overview"
          class="w-full rounded-lg"
        />
        <div class="space-y-2 text-sm text-gray-300">
          <p>
            <strong>Premium Apps & Activities</strong> is Discord's monetization system for developers. It lets you charge users or servers for access to premium features inside your Discord app.
          </p>
          <p>Two models are available:</p>
          <ul class="list-disc list-inside ml-2 space-y-1">
            <li><strong>App Subscriptions</strong> — recurring billing, per user or per server (guild).</li>
            <li><strong>One-time purchases</strong> — single payment for a permanent item or feature unlock.</li>
          </ul>
          <p>
            When a user or guild pays, Discord creates an <strong>Entitlement</strong> — the record that grants access. This dashboard lets you manage those entitlements directly via the Discord API, without needing slash commands.
          </p>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="font-semibold">Monetization prerequisites</h2>
      </template>
      <div class="space-y-3 text-sm text-gray-300">
        <p>Before entitlements can exist, your Discord app must meet the following requirements:</p>
        <ul class="list-disc list-inside ml-2 space-y-1">
          <li>App must be <strong>verified</strong> by Discord.</li>
          <li>App must be owned by a <strong>developer team</strong>.</li>
          <li>Team owner must be at least 18 years old with verified email and 2FA enabled.</li>
          <li>App must use slash commands, or have the <code class="bg-gray-800 px-1 rounded">Message Content</code> privileged intent approved.</li>
          <li>App must have links to a Terms of Service and a Privacy Policy.</li>
          <li>Payouts must be set up with a valid payment method.</li>
        </ul>
        <div class="flex items-center gap-2 pt-1">
          <UIcon name="i-heroicons-arrow-top-right-on-square" class="text-gray-400 shrink-0" />
          <a
            href="https://docs.discord.com/developers/monetization/enabling-monetization"
            target="_blank"
            rel="noopener"
            class="text-indigo-400 hover:underline"
          >
            Discord Documentation — Enabling Monetization
          </a>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="font-semibold">About</h2>
      </template>
      <div class="space-y-2 text-sm text-gray-300">
        <p>
          Dashboard to manage <strong>Entitlements</strong> for a Discord App without needing slash commands.
        </p>
        <p>
          The bot token is stored locally in your browser (<code class="bg-gray-800 px-1 rounded">localStorage</code>) and only transits to your local Nuxt server — never to third parties.
        </p>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="font-semibold">Entitlement types</h2>
      </template>
      <div class="space-y-3">
        <div v-for="t in entitlementTypes" :key="t.type" class="flex items-start gap-3">
          <UBadge :color="t.color" variant="subtle" class="mt-0.5 shrink-0">
            {{ t.label }}
          </UBadge>
          <span class="text-sm text-gray-300">{{ t.description }}</span>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="font-semibold">Deleting an entitlement</h2>
      </template>
      <div class="space-y-2 text-sm text-gray-300">
        <p>The <UIcon name="i-heroicons-trash" class="inline text-red-400" /> button only appears on deletable entitlements:</p>
        <ul class="list-disc list-inside space-y-1 ml-2">
          <li>Type <strong>Test</strong> (type 4)</li>
          <li>Entitlements created via the API <em>(no start date — valid in perpetuity)</em></li>
        </ul>
        <p class="text-gray-400">Real subscriptions cannot be deleted from the dashboard.</p>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="font-semibold">Guild names</h2>
      </template>
      <div class="space-y-2 text-sm text-gray-300">
        <p>Guild names are resolved in two steps:</p>
        <ol class="list-decimal list-inside space-y-1 ml-2">
          <li><strong>Bot member</strong> — full guild info if the bot is in the server.</li>
          <li><strong>Public widget</strong> — guild name from the widget endpoint if the server has widgets enabled (no membership required).</li>
        </ol>
        <p class="text-gray-400">If both fail, the raw guild ID is shown.</p>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="font-semibold">Introduction</h2>
      </template>
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-300">Replay the welcome wizard shown on first visit.</p>
        <UButton icon="i-heroicons-play" variant="outline" color="neutral" @click="showIntro">
          Show introduction
        </UButton>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="font-semibold text-red-400">Danger zone</h2>
      </template>
      <div class="space-y-3">
        <p class="text-sm text-gray-300">
          Clears all localStorage data: bot token, application ID, and saved filter preferences. You will be redirected to the login page.
        </p>
        <div v-if="!confirm">
          <UButton color="error" variant="outline" icon="i-heroicons-trash" @click="confirm = true">
            Clear all local data
          </UButton>
        </div>
        <div v-else class="flex items-center gap-3">
          <span class="text-sm text-red-400 font-medium">Are you sure?</span>
          <UButton color="error" icon="i-heroicons-check" @click="clearStorage">Yes, clear everything</UButton>
          <UButton variant="ghost" color="neutral" @click="confirm = false">Cancel</UButton>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="font-semibold">Useful links</h2>
      </template>
      <div class="space-y-2 text-sm">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-arrow-top-right-on-square" class="text-gray-400 shrink-0" />
          <a
            href="https://docs.discord.com/developers/resources/entitlement"
            target="_blank"
            rel="noopener"
            class="text-indigo-400 hover:underline"
          >
            Discord Documentation — Entitlements
          </a>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-arrow-top-right-on-square" class="text-gray-400 shrink-0" />
          <a
            href="https://docs.discord.com/developers/platform/app-monetization"
            target="_blank"
            rel="noopener"
            class="text-indigo-400 hover:underline"
          >
            Discord Documentation — Premium Apps & Activities
          </a>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-arrow-top-right-on-square" class="text-gray-400 shrink-0" />
          <a
            href="https://discord.com/developers/applications"
            target="_blank"
            rel="noopener"
            class="text-indigo-400 hover:underline"
          >
            Discord Developer Portal
          </a>
        </div>
        <div class="flex items-center gap-2 pt-1 border-t border-gray-700/50 mt-1">
          <UIcon name="i-heroicons-heart" class="text-red-400 shrink-0" />
          <a
            href="https://thomasbnt.dev/donate"
            target="_blank"
            rel="noopener"
            class="text-red-400 hover:underline font-medium"
          >
            Support the developer
          </a>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
