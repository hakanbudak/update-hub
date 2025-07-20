<template>
  <form @submit.prevent="submitUpdate" class="bg-white p-4 rounded-lg shadow mb-6 border border-gray-200">
    <h2 class="text-lg font-semibold mb-4">Yeni Güncelleme Ekle</h2>

    <div class="mb-4">
      <label class="block text-sm text-gray-600 mb-1">İsim</label>
      <select v-model="userName" class="w-full border rounded p-2" required>
        <option disabled value="">İsim Seç</option>
        <option v-for="name in names" :key="name" :value="name">
          {{ name }}
        </option>
      </select>
    </div>

    <div class="mb-4">
      <label class="block text-sm text-gray-600 mb-1">Takım</label>
      <select v-model="team" class="w-full border rounded p-2" required>
        <option disabled value="">Takım Seç</option>
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
      <textarea v-model="message" class="w-full border rounded p-2" rows="3" required />
    </div>

    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      Güncellemeyi Ekle
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from "vue-router";
import { useUpdateStore } from '@/stores/updateStore'

const updateStore = useUpdateStore()
const router = useRouter()

const names = [
  "Neslihan",
  "Sahin",
  "Ilteris",
  "Selamet",
  "Cengizhan",
  "Hakan",
  "Kubra",
  "Duygu",
  "Kader",
  "Ece",
  "Batuhan",
  "Bilge",
  "Abdullah",
]


const imagePreview = ref<string | null>(null)
const userName = ref('')
const team = ref('')
const message = ref('')

async function sendSlackWebhook(id: number) {
  const link = `https://update-hub.vercel.app/#/updates?id=${id}`

  const payload = {
    text: `💡 *Yeni Güncelleme* \n👤 *${userName.value}* (${team.value}) \n📝 ${message.value} \n📅 <${link}|Güncellemeye Git}>`
  }

  try {
    await fetch("https://hooks.slack.com/services/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", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
  } catch (error) {
    console.error("Slack Webhook hatası:", error)
  }
}

function submitUpdate() {
  if (!userName.value || !team.value || !message.value) return

  const updateId = Date.now()

  updateStore.addUpdate({
    id: Date.now(),
    user: {
      name: userName.value,
      team: team.value,
    },
    message: message.value,
    date: new Date().toISOString(),
    imageUrl: imagePreview.value || undefined,
  })

   sendSlackWebhook(updateId)

  userName.value = ''
  team.value = ''
  message.value = ''
  imagePreview.value = null

  router.push('/')
}

function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      imagePreview.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

</script>
