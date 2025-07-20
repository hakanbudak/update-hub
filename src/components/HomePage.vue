<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { type UpdateItem, useUpdateStore } from '@/stores/updateStore'
import UpdateCard from '@/components/UpdateCard.vue'
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue"
import EditUpdateModal from '@/components/EditUpdateModal.vue'

const store = useUpdateStore()
const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (store.updates.length === 0) {
    store.loadInitialData()
  }

  const urlTeam = route.query.team as string
  const urlRange = route.query.range as string

  if (urlTeam && ['all', 'Dev', 'Marketing', 'Sales', 'Product', 'Data'].includes(urlTeam)) {
    store.selectedTeam = urlTeam
  }

  if (urlRange && ['all', 'weekly', 'monthly'].includes(urlRange)) {
    store.selectedTimeRange = urlRange as 'all' | 'weekly' | 'monthly'
  }
})

watch(
  () => [store.selectedTeam, store.selectedTimeRange],
  ([team, range]) => {
    router.replace({
      query: {
        team: team !== 'all' ? team : undefined,
        range: range !== 'all' ? range : undefined,
      },
    })
  }
)

const teams = ['all', 'Dev', 'Marketing', 'Sales', 'Product', 'Data']
const timeOptions = [
  { label: 'Tüm Zamanlar', value: 'all' },
  { label: 'Son 7 Gün', value: 'weekly' },
  { label: 'Son 30 Gün', value: 'monthly' },
]

const showConfirmModal = ref(false)
const selectedId = ref<number | null>(null)
const showEditModal = ref(false)
const updateToEdit = ref<UpdateItem | null>(null)

function handleDelete(id: number) {
  selectedId.value = id
  showConfirmModal.value = true
}

function confirmDelete() {
  if (selectedId.value !== null) {
    store.deleteUpdate(selectedId.value)
    selectedId.value = null
    showConfirmModal.value = false
  }
}

function cancelDelete() {
  selectedId.value = null
  showConfirmModal.value = false
}

function openEdit(update: UpdateItem) {
  updateToEdit.value = update
  showEditModal.value = true
}

function saveEditedUpdate(edited: UpdateItem) {
  store.editUpdate(edited)
  showEditModal.value = false
  updateToEdit.value = null
}

function exportUpdates() {
  const updates = store.filteredUpdates

  if (updates.length === 0) {
    alert("İndirilecek güncelleme yok.")
    return
  }

  const headers = ['ID', 'İsim', 'Takım', 'Mesaj', 'Tarih', 'Görsel URL', 'Link']
  const rows = updates.map(update => [
    update.id,
    `"${update.user.name}"`,
    update.user.team,
    `"${update.message.replace(/"/g, '""')}"`,
    update.date,
    update.imageUrl || '',
    update.linkUrl || ''
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `updates-${store.selectedTeam}-${store.selectedTimeRange}.csv`)
  link.click()
  URL.revokeObjectURL(url)
}

</script>

<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-4">Takım Updateleri</h1>

    <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6">
      <select
        v-model="store.selectedTeam"
        class="w-full sm:w-1/2 border border-gray-300 rounded p-2 text-sm"
      >
        <option disabled value="">Takım Seç</option>
        <option v-for="team in teams" :key="team" :value="team">
          {{ team === 'all' ? 'Tüm Takımlar' : team }}
        </option>
      </select>

      <select
        v-model="store.selectedTimeRange"
        class="w-full sm:w-1/2 border border-gray-300 rounded p-2 text-sm mt-2 sm:mt-0"
      >
        <option disabled value="">Zaman Aralığı</option>
        <option v-for="opt in timeOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>


    <div v-if="store.filteredUpdates.length === 0" class="text-gray-500">
      Bu kritere uygun güncelleme bulunamadı.
    </div>
    <div v-else>
      <div
        v-for="update in store.filteredUpdates"
        :key="update.id"
        class="mb-4 relative"
      >
        <UpdateCard
          :update="update"
          :onEdit="openEdit"
          :onDelete="handleDelete"
        />
      </div>
  </div>

  <DeleteConfirmModal
    v-if="showConfirmModal"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />

    <EditUpdateModal
      v-if="showEditModal && updateToEdit"
      :update="updateToEdit"
      @cancel="() => { showEditModal = false }"
      @save="saveEditedUpdate"
    />
    <div class="flex justify-end mb-4">
      <button
        @click="exportUpdates"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
      >
        Güncellemeleri Dışa Aktar
      </button>
    </div>
  </div>
</template>
