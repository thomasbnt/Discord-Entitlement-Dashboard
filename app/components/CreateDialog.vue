<script setup lang="ts">
const open = defineModel<boolean>('open')

const store = useEntitlementsStore()
const skusStore = useSkusStore()
const loading = ref(false)
const error = ref('')
const form = reactive({
  sku_id: '',
  owner_id: '',
  owner_type: 1 as 1 | 2,
})

const ownerTypeOptions = [
  { label: 'Guild (Server)', value: 1 },
  { label: 'User', value: 2 },
]

async function submit() {
  if (!form.sku_id || !form.owner_id.trim()) return
  loading.value = true
  error.value = ''
  try {
    await store.createTest({
      sku_id: form.sku_id,
      owner_id: form.owner_id.trim(),
      owner_type: form.owner_type,
    })
    open.value = false
    form.sku_id = ''
    form.owner_id = ''
    form.owner_type = 1
  } catch (e: any) {
    error.value = e.data?.data?.message ?? e.data?.message ?? e.statusMessage ?? 'Creation error.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal v-model:open="open" title="Create a test entitlement">
    <template #body>
      <div class="space-y-4">
        <UAlert v-if="error" color="error" :description="error" />

        <UFormField label="SKU">
          <USelect
            v-model="form.sku_id"
            :items="skusStore.selectItems"
            value-key="value"
            :loading="skusStore.loading"
            placeholder="Select a SKU"
            class="w-full"
          />
          <template v-if="skusStore.items.length === 0 && !skusStore.loading" #hint>
            No SKUs found for this application
          </template>
        </UFormField>

        <UFormField label="Owner type">
          <USelect
            v-model="form.owner_type"
            :items="ownerTypeOptions"
            value-key="value"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="form.owner_type === 1 ? 'Guild ID' : 'User ID'">
          <UInput
            v-model="form.owner_id"
            :placeholder="form.owner_type === 1 ? 'Server ID' : 'User ID'"
            class="w-full"
          />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-2 justify-end">
        <UButton variant="ghost" color="neutral" @click="open = false">Cancel</UButton>
        <UButton
          :loading="loading"
          :disabled="!form.sku_id || !form.owner_id"
          @click="submit"
        >
          Create
        </UButton>
      </div>
    </template>
  </UModal>
</template>
