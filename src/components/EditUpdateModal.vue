<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
      <h2 class="text-lg font-semibold mb-4 text-gray-800">
        Güncellemeyi Düzenle
      </h2>

      <form @submit.prevent="submitEdit">
        <div class="mb-4">
          <label class="block text-sm text-gray-600 mb-1">İsim</label>
          <input v-model="formData.user.name" type="text" class="w-full border rounded p-2" required />
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-600 mb-1">Takım</label>
          <select v-model="formData.user.team" class="w-full border rounded p-2" required>
            <option>Dev</option>
            <option>Marketing</option>
            <option>Sales</option>
            <option>Product</option>
            <option>Data</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-600 mb-1">Görsel Yükle</label>
          <input
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="w-full border rounded p-2"
          />
        </div>

        <div v-if="imagePreview" class="mt-2">
          <img :src="imagePreview" alt="Seçilen Görsel" class="rounded max-w-xs max-h-48 border" />
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-600 mb-1">Güncelleme</label>
          <textarea v-model="formData.message" class="w-full border rounded p-2" rows="3" required />
        </div>

        <div class="flex justify-end space-x-3">
          <button type="button" @click="$emit('cancel')" class="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100">
            Vazgeç
          </button>
          <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            Kaydet
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UpdateItem } from '@/stores/updateStore'
import { uploadImage } from '@/utilites/uploadImage'

const props = defineProps<{
  update: UpdateItem
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'save', update: UpdateItem): void
}>()

const formData = ref<UpdateItem>(JSON.parse(JSON.stringify(props.update))) // deep copy
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(formData.value.imageUrl || null)

async function submitEdit() {
  let finalImageUrl = formData.value.imageUrl

  if (selectedFile.value) {
    const uploaded = await uploadImage(selectedFile.value)
    if (uploaded) {
      finalImageUrl = uploaded
    }
  }

  emit('save', {
    ...formData.value,
    imageUrl: finalImageUrl
  })
}

function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    selectedFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}
</script>
