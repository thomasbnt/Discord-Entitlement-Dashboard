<script setup lang="ts">
const props = defineProps<{ guildId: string }>()
const discord = useDiscord()
const toast = useToast()
const guildName = ref<string | null>(null)

onMounted(async () => {
  try {
    const guild = await discord.getGuild(props.guildId)
    guildName.value = guild.name
  } catch {
    guildName.value = null
  }
})

async function copyId() {
  await navigator.clipboard.writeText(props.guildId)
  toast.add({ title: 'Copied', description: props.guildId, color: 'success', duration: 2000 })
}
</script>

<template>
  <UTooltip text="Click to copy ID">
    <UBadge color="primary" variant="subtle" class="cursor-pointer" @click="copyId">
      {{ guildName ?? guildId }}
    </UBadge>
  </UTooltip>
</template>
