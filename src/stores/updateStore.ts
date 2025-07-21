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
    async loadInitialData() {
      const { data, error } = await supabase
          .from('updates')
          .select('*')
          .order('created_at', { ascending: false })

      if (!error && data) {
        this.updates = data.map(d => ({
          id: d.id,
          message: d.message,
          date: d.created_at,
          imageUrl: d.image_url,
          linkUrl: d.link_url,
          user: {
            name: d.user_name,
            team: d.team
          }
        }))
      } else {
        console.error("Veri çekme hatası:", error)
      }
    },

    async editUpdate(update: UpdateItem) {
      // Local veriyi güncelle
      const index = this.updates.findIndex((u) => u.id === update.id)
      if (index !== -1) {
        this.updates[index] = update
      }

      // Supabase tablosunu güncelle
      const { error } = await supabase
          .from('updates')
          .update({
            user_name: update.user.name,
            team: update.user.team,
            message: update.message,
            image_url: update.imageUrl,
            date: update.date,
          })
          .eq('id', update.id)

      if (error) {
        console.error('Supabase güncelleme hatası:', error)
      }
    },

    async addUpdate(update: UpdateItem) {
      const { error } = await supabase.from('updates').insert([update])
      if (error) {
        console.error('Supabase insert error:', error)
        return
      }
      this.updates.unshift(update)
    },

    async deleteUpdate(id: number) {
      const { error } = await supabase.from('updates').delete().eq('id', id)
      if (error) {
        console.error('Supabase delete error:', error)
        return
      }

      this.updates = this.updates.filter((u) => u.id !== id)
      this.saveToStorage()
    },

    saveToStorage() {
      localStorage.setItem('updates', JSON.stringify(this.updates))
    },
  },
})
