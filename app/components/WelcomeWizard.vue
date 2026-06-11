<script setup lang="ts">
const { isOpen, close } = useWelcomeWizard()
const step = ref(0)
const totalSteps = 4

function next() { if (step.value < totalSteps - 1) step.value++ }
function prev() { if (step.value > 0) step.value-- }
function finish() { step.value = 0; close() }

watch(isOpen, (val) => { if (val) step.value = 0 })
</script>

<template>
  <UModal v-model:open="isOpen" :dismissible="false" :ui="{ width: 'sm:max-w-2xl' }">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-2">
          <UIcon name="i-simple-icons-discord" class="text-xl text-indigo-400" />
          <span class="font-semibold">Discord Entitlement Dashboard</span>
        </div>
        <div class="flex gap-1.5 items-center">
          <div
            v-for="i in totalSteps"
            :key="i"
            class="h-2 rounded-full transition-all duration-300"
            :class="i - 1 === step ? 'bg-indigo-400 w-4' : 'bg-gray-600 w-2'"
          />
        </div>
      </div>
    </template>

    <template #body>
      <div class="h-[480px] overflow-y-auto pr-1">

        <!-- Step 0: What is this? -->
        <div v-if="step === 0" class="space-y-4">
          <h3 class="text-lg font-semibold">Manage your Discord app entitlements</h3>
          <img :src="'/images/monetization-overview.png'" alt="Discord Monetization" class="w-full rounded-lg" />
          <p class="text-sm text-gray-300">
            When users or guilds subscribe to your Discord app or make a purchase, Discord creates an <strong>Entitlement</strong>. This dashboard lets you view, filter, and manage them directly — no slash commands needed.
          </p>
          <p class="text-sm text-gray-300">
            Primarily used to <strong>create and delete test subscriptions</strong> during development, without going through the real payment flow.
          </p>
          <UAlert color="info" icon="i-heroicons-information-circle" description="Your app must have monetization enabled in the Discord Developer Portal to have SKUs and entitlements." />
        </div>

        <!-- Step 1: What you can do -->
        <div v-if="step === 1" class="space-y-4">
          <h3 class="text-lg font-semibold">What you can do</h3>
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-lg bg-gray-800 p-3 space-y-1">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-list-bullet" class="text-indigo-400" />
                <span class="text-sm font-medium">List & filter</span>
              </div>
              <p class="text-xs text-gray-400">View all entitlements. Filter by guild, user, SKU, or status. Sort by date or type.</p>
            </div>
            <div class="rounded-lg bg-gray-800 p-3 space-y-1">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-plus-circle" class="text-green-400" />
                <span class="text-sm font-medium">Create test</span>
              </div>
              <p class="text-xs text-gray-400">Instantly grant any SKU to a guild or user for testing, without real payment.</p>
            </div>
            <div class="rounded-lg bg-gray-800 p-3 space-y-1">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-trash" class="text-red-400" />
                <span class="text-sm font-medium">Delete test</span>
              </div>
              <p class="text-xs text-gray-400">Remove test entitlements individually or in bulk. Only test ones can be deleted — real subscriptions are read-only.</p>
            </div>
            <div class="rounded-lg bg-gray-800 p-3 space-y-1">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-chart-bar" class="text-yellow-400" />
                <span class="text-sm font-medium">Stats overview</span>
              </div>
              <p class="text-xs text-gray-400">Total, active, test, and expired counts with a visual type breakdown.</p>
            </div>
            <div class="rounded-lg bg-gray-800 p-3 space-y-1">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-building-office-2" class="text-cyan-400" />
                <span class="text-sm font-medium">Guild names</span>
              </div>
              <p class="text-xs text-gray-400">Server names resolved automatically. Falls back to public widget if the bot isn't a member.</p>
            </div>
            <div class="rounded-lg bg-gray-800 p-3 space-y-1">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-clipboard-document" class="text-gray-300" />
                <span class="text-sm font-medium">Copy IDs</span>
              </div>
              <p class="text-xs text-gray-400">Click any guild or user badge to copy the ID to clipboard instantly.</p>
            </div>
          </div>
        </div>

        <!-- Step 2: Switch between apps -->
        <div v-if="step === 2" class="space-y-4">
          <h3 class="text-lg font-semibold">Switch between apps</h3>
          <p class="text-sm text-gray-300">
            The dashboard supports multiple Discord apps. Each app's credentials are saved locally so you can switch instantly — no need to re-enter your token each time.
          </p>
          <div class="space-y-3">
            <div class="rounded-lg bg-gray-800 p-4 flex items-start gap-3">
              <UIcon name="i-heroicons-arrows-right-left" class="text-indigo-400 text-xl mt-0.5 shrink-0" />
              <div>
                <p class="text-sm font-medium">App switcher</p>
                <p class="text-xs text-gray-400 mt-0.5">Click the app name in the header to switch between saved apps or add a new one.</p>
              </div>
            </div>
            <div class="rounded-lg bg-gray-800 p-4 flex items-start gap-3">
              <UIcon name="i-heroicons-plus-circle" class="text-green-400 text-xl mt-0.5 shrink-0" />
              <div>
                <p class="text-sm font-medium">Add another app</p>
                <p class="text-xs text-gray-400 mt-0.5">Go to <strong>App switcher → Add another app</strong> to connect a second bot. Give it a name to tell them apart.</p>
              </div>
            </div>
            <div class="rounded-lg bg-gray-800 p-4 flex items-start gap-3">
              <UIcon name="i-heroicons-key" class="text-indigo-400 text-xl mt-0.5 shrink-0" />
              <div>
                <p class="text-sm font-medium">Finding your credentials</p>
                <p class="text-xs text-gray-400 mt-0.5">
                  <strong>Bot Token</strong> — your app → Bot → Reset Token.<br>
                  <strong>App ID</strong> — your app → General Information → Application ID.
                </p>
              </div>
            </div>
          </div>
          <UAlert color="warning" icon="i-heroicons-exclamation-triangle" description="Make sure your app has at least one SKU configured under Monetization in the Developer Portal, otherwise the entitlements list will be empty." />
        </div>

        <!-- Step 3: Privacy -->
        <div v-if="step === 3" class="space-y-4">
          <h3 class="text-lg font-semibold">Your data stays with you</h3>
          <div class="rounded-lg border border-green-500/30 bg-green-500/10 p-4 flex items-start gap-3">
            <UIcon name="i-heroicons-shield-check" class="text-green-400 text-2xl shrink-0 mt-0.5" />
            <div class="space-y-2 text-sm text-gray-300">
              <p><strong class="text-green-300">Your bot token is never sent to any third-party server.</strong></p>
              <p>All saved apps' credentials are stored in your browser's <code class="bg-gray-800 px-1 rounded">localStorage</code> and only transit to <em>this local server</em>, which proxies requests directly to Discord's API.</p>
              <p>No analytics, no telemetry, no external services beyond Discord.</p>
            </div>
          </div>
          <div class="space-y-2 text-sm text-gray-400">
            <div class="flex items-start gap-2">
              <UIcon name="i-heroicons-check" class="text-green-400 shrink-0 mt-0.5" />
              <span>Filter preferences (SKU, hide expired/deleted) are saved locally.</span>
            </div>
            <div class="flex items-start gap-2">
              <UIcon name="i-heroicons-check" class="text-green-400 shrink-0 mt-0.5" />
              <span>Guild name cache lives in memory only — cleared on page refresh.</span>
            </div>
            <div class="flex items-start gap-2">
              <UIcon name="i-heroicons-check" class="text-green-400 shrink-0 mt-0.5" />
              <span>To wipe everything: <strong>Help → Danger zone → Clear all local data</strong>.</span>
            </div>
          </div>
        </div>

      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <UButton v-if="step > 0" variant="ghost" color="neutral" icon="i-heroicons-arrow-left" @click="prev">Back</UButton>
        <span v-else />
        <div class="flex items-center gap-2">
          <UButton variant="ghost" color="neutral" size="sm" @click="finish">Skip</UButton>
          <UButton v-if="step < totalSteps - 1" icon="i-heroicons-arrow-right" trailing @click="next">Next</UButton>
          <UButton v-else color="success" icon="i-heroicons-rocket-launch" @click="finish">Get started</UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
