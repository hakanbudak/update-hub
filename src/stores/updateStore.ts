import { defineStore } from 'pinia'
import {supabase} from "@/lib/supabase.ts";

export type UpdateItem = {
  id: number
  user: {
    name: string
    team: string
  }
  message: string
  date: string
  imageUrl?: string
}


export const useUpdateStore = defineStore('updateStore', {
  state: () => ({
    updates: [] as UpdateItem[],
    selectedTeam: 'all' as string,
    selectedTimeRange: 'all' as 'all' | 'weekly' | 'monthly',
  }),

  getters: {
    filteredUpdates(state): UpdateItem[] {
      let result = state.updates

      if (state.selectedTeam !== 'all') {
        result = result.filter((u) => u.user.team === state.selectedTeam)
      }

      if (state.selectedTimeRange !== 'all') {
        const now = new Date().getTime()
        const rangeInMs =
          state.selectedTimeRange === 'weekly'
            ? 7 * 24 * 60 * 60 * 1000
            : 30 * 24 * 60 * 60 * 1000

        result = result.filter((u) => {
          const updateTime = new Date(u.date).getTime()
          return now - updateTime <= rangeInMs
        })
      }

      return result
    },
  },


  actions: {
    loadInitialData() {
      const fromStorage = localStorage.getItem('updates')
      if (fromStorage) {
        this.updates = JSON.parse(fromStorage)
      } else {
        this.updates = [
          {
            id: 1,
            user: { name: 'Batu', team: 'Marketing' },
            message: 'Instagram kampanyası başlatıldı 🚀',
            date: '2025-07-15',
          },
          {
            id: 2,
            user: { name: 'Ilteris', team: 'Dev' },
            message: 'Yeni API endpoint yayına alındı.',
            date: '2025-07-16',
          },
          {
            id: 3,
            user: { name: 'Kubra', team: 'Sales' },
            message: 'Potansiyel müşterilerle görüşmeler yapıldı.',
            date: '2025-07-17',
          },
        ]
        this.saveToStorage()
      }
    },

    editUpdate(update: UpdateItem) {
      // Local veriyi güncelle (localStorage)
      const index = updates.value.findIndex((u) => u.id === update.id)
      if (index !== -1) {
        updates.value[index] = update
      }
      saveToLocalStorage()

      // Supabase tablosunu güncelle
      const { error } = await supabase
          .from('updates')
          .update({
            user_name: update.user.name,
            team: update.user.team,
            message: update.message,
            image_url: update.imageUrl,
            link_url: update.linkUrl ?? null,
            date: update.date,
          })
          .eq('id', update.id)

      if (error) {
        console.error('Supabase güncelleme hatası:', error)
      }
    },

    addUpdate(update: UpdateItem) {
      const { error } = await supabase.from('updates').insert([update])
      if (error) {
        console.error('Supabase insert error:', error)
        return
      }
      this.updates.unshift(update)
    },

    deleteUpdate(id: number) {
      const { error } = await supabase.from('updates').delete().eq('id', id)
      if (error) {
        console.error('Supabase delete error:', error)
        return
      }
      this.updates = this.updates.filter((u) => u.id !== id)
    },

    saveToStorage() {
      localStorage.setItem('updates', JSON.stringify(this.updates))
    },
  },
})
