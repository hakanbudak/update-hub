<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-lg font-semibold mb-4 text-gray-800">
        Güncellemeyi silmek istediğinize emin misiniz?
      </h2>

      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
        >
          Vazgeç
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        >
          Evet, Sil
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['confirm', 'cancel'])
</script>
