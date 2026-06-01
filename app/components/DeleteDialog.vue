<script setup lang="ts">
const props = defineProps<{ entitlementId: string }>()
const emit = defineEmits<{ closed: [] }>()
const open = defineModel<boolean>('open')

const store = useEntitlementsStore()
const loading = ref(false)
const error = ref('')

async function confirm() {
  loading.value = true
  error.value = ''
  try {
    await store.remove(props.entitlementId)
    open.value = false
    emit('closed')
  } catch (e: any) {
    error.value = e.data?.data?.message ?? e.data?.message ?? e.statusMessage ?? 'Deletion error.'
  } finally {
    loading.value = false
  }
}

function cancel() {
  open.value = false
  emit('closed')
}
</script>

<template>
  <UModal v-model:open="open" title="Delete entitlement">
    <template #body>
      <div class="space-y-4">
        <UAlert v-if="error" color="error" :description="error" />
        <p>
          Confirm deletion of entitlement
          <UBadge color="neutral" variant="outline" class="font-mono">{{ entitlementId }}</UBadge>?
        </p>
        <p class="text-sm text-gray-400">
          This action is irreversible. Only test entitlements can be deleted.
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-2 justify-end">
        <UButton variant="ghost" color="neutral" @click="cancel">Cancel</UButton>
        <UButton color="error" :loading="loading" @click="confirm">Delete</UButton>
      </div>
    </template>
  </UModal>
</template>
