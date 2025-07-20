<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    @click.self="onClose"
  >
    <img :src="src" alt="Görsel" class="max-w-full max-h-[90vh] rounded-lg shadow-lg" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ src: string }>()
const emit = defineEmits(['close'])

function onClose() {
  emit('close')
}
</script>
