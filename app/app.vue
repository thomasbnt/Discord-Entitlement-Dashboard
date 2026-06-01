<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'en' },
  titleTemplate: (title) => title ? `${title} — Discord Entitlement Dashboard` : 'Discord Entitlement Dashboard',
  meta: [
    { name: 'robots', content: 'noindex, noarchive' },
    { name: 'description', content: 'Discord Entitlement management dashboard.' },
  ],
})
</script>

<template>
  <UApp>
    <NuxtPage />
    <UNotifications />
  </UApp>
</template>
