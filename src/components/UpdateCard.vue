<template>
  <div class="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
    <div class="flex items-center justify-between mb-2">
      <div class="font-medium text-gray-800">
        {{ update.user.name }} —
        <span
          class="text-xs font-medium px-2 py-1 rounded-full"
          :class="getTeamColor(update.user.team)"
        >
          {{ update.user.team }}
        </span>
      </div>
      <div class="text-sm text-gray-400">{{ formatDate(update.date) }}</div>
    </div>

    <div
      class="text-gray-700 whitespace-pre-line"
      v-html="linkify(update.message)"
    ></div>

    <div v-if="update.imageUrl" class="mb-2">
      <img
        :src="update.imageUrl"
        alt="Görsel"
        class="rounded max-w-full max-h-64 border cursor-pointer transition hover:brightness-90"
        @click="openPreview(update.imageUrl)"
      />
    </div>

    <div class="flex justify-end gap-3 mt-4">
      <button
        v-if="onEdit"
        @click="onEdit(update)"
        class="text-blue-500 hover:text-blue-700 text-sm"
        title="Düzenle"
      >
        🖊️
      </button>
      <button
        v-if="onDelete"
        @click="onDelete(update.id)"
        class="text-red-500 hover:text-red-700 text-sm"
        title="Sil"
      >
        🗑️
      </button>
    </div>
  </div>
  <ImagePreviewModal
    v-if="previewImage"
    :src="previewImage"
    @close="closePreview"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import ImagePreviewModal from "@/components/ImagePreviewModal.vue";

defineProps<{
  update: {
    id: number
    user: { name: string; team: string }
    message: string
    date: string
    imageUrl?: string
  }
  onEdit?: (update: any) => void
  onDelete?: (id: number) => void
}>()

const previewImage = ref<string | null>(null)

function openPreview(url: string) {
  previewImage.value = url
}
function closePreview() {
  previewImage.value = null
}

function linkify(text: string): string {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">${url}</a>`
  })
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getTeamColor(team: string) {
  switch (team.toLowerCase()) {
    case 'dev':
      return 'bg-purple-100 text-purple-800'
    case 'marketing':
      return 'bg-green-100 text-green-800'
    case 'sales':
      return 'bg-yellow-100 text-yellow-800'
    case 'data':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-200 text-gray-700'
  }
}
</script>
